import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, MessageSquare, FileText } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { TranslatedTextPanel } from './TranslatedTextPanel';
import { Chatbot, type ChatMessage } from './Chatbot';
import { UnifiedNotes, type UnifiedNotesData } from './UnifiedNotes';
import { translatePaper, savePaperProgress } from '../services/api';
import type { Paper, SecondPassData, Highlight } from '../types';
import { LangGlyphIcon } from "../assets/LangGlyphIcon";

interface SecondPassProps {
  paper: Paper;
  onSave: (data: SecondPassData) => void;
  onNext: () => void;
  onSaveAndExit: () => void;
  initialData: SecondPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
  unifiedNotes: UnifiedNotesData;
  onUpdateNotes: (notes: UnifiedNotesData) => void;
}

export function SecondPass({
  paper,
  onSave,
  onNext,
  onSaveAndExit,
  initialData,
  chatMessages,
  onSendChatMessage,
  isChatLoading,
  unifiedNotes,
  onUpdateNotes,
}: SecondPassProps) {
  const [pdfAnnotations, setPdfAnnotations] = useState<Highlight[]>(initialData?.pdfAnnotations || []);
  const [translatedFullText, setTranslatedFullText] = useState(initialData?.translatedFullText || '');
  const [pageTranslations, setPageTranslations] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isTranslating, setIsTranslating] = useState(false);
  const [rightPanel, setRightPanel] =
    useState<'translation' | 'notes' | 'chatbot'>('translation');

  // 번역 요청
  useEffect(() => {
    const fetchTranslation = async () => {
      if (Object.keys(pageTranslations).length === 0 && !isTranslating) {
        setIsTranslating(true);
        try {
          const response = await translatePaper(paper.id, paper.content);
          setTranslatedFullText(response.translatedText);
          setPageTranslations(response.pageTranslations);
        } catch (error) {
          console.error('Translation failed:', error);
          const mockPageTranslations = {
            1: `서론\n\n딥러닝은 최근 몇 년 동안 인공지능과 기계 학습 분야에 혁명을 일으켰습니다...`,
            2: `일반적인 CNN 아키텍처는 여러 유형의 레이어로 구성됩니다...`,
            3: `도전 과제 및 향후 방향\n\n놀라운 진전에도 불구하고 딥러닝 연구에는 여러 과제가 남아 있습니다...`,
          };
          setPageTranslations(mockPageTranslations);
          setTranslatedFullText(Object.values(mockPageTranslations).join('\n\n'));
        } finally {
          setIsTranslating(false);
        }
      }
    };

    fetchTranslation();
  }, [paper.id, paper.content, pageTranslations, isTranslating]);

  // 자동 저장
  useEffect(() => {
    const data: SecondPassData = {
      paperId: paper.id,
      pdfAnnotations,
      translatedFullText,
      notes,
    };
    onSave(data);
    savePaperProgress(paper.id, 'second', data);
  }, [pdfAnnotations, translatedFullText, notes, paper.id, onSave]);

  const handleHighlight = (text: string, color: string) => {
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      color,
      position: {
        pageNumber: 1,
        start: 0,
        end: text.length,
      },
      paperId: paper.id,
    };
    setPdfAnnotations([...pdfAnnotations, newHighlight]);
  };

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        {/* Left Panel - PDF Viewer */}
        <div className="flex-1 border-r border-slate-200">
          <PDFViewer
            pdfUrl={paper.pdfUrl}
            content={paper.content}
            onHighlight={handleHighlight}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">
                {rightPanel === 'chatbot'
                  ? 'AI 어시스턴트'
                  : rightPanel === 'notes'
                  ? '나의 노트'
                  : `전체 번역본 (페이지 ${currentPage})`}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {rightPanel === 'chatbot'
                  ? '논문에 대해 질문하세요'
                  : rightPanel === 'notes'
                  ? '학습 내용을 기록하고 정리하세요'
                  : 'AI가 번역한 내용'}
              </p>
            </div>
            <div className="flex items-center gap-2">
            {/* 번역본 보기 버튼 */}
              <button
                onClick={() => setRightPanel('translation')}
                className={`p-2 rounded-lg transition-all ${
                  rightPanel === 'translation'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
                title="번역본 보기"
              >
                <LangGlyphIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRightPanel('notes')}
                className={`p-2 rounded-lg transition-all ${
                  rightPanel === 'notes'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
                title="노트 보기"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRightPanel('chatbot')}
                className={`p-2 rounded-lg transition-all ${
                  rightPanel === 'chatbot'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
                title="챗봇 열기"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isTranslating ? (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
                <p className="text-slate-600">논문을 번역하는 중입니다...</p>
                <p className="text-slate-400 text-sm mt-1">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : rightPanel === 'chatbot' ? (
            // Chatbot도 패널 내부에서만 스크롤되도록 래핑
            <div className="flex-1 overflow-hidden">
              <Chatbot
                messages={chatMessages}
                onSendMessage={onSendChatMessage}
                isLoading={isChatLoading}
              />
            </div>
          ) : rightPanel === 'notes' ? (
            <>
              <UnifiedNotes notes={unifiedNotes} onUpdate={onUpdateNotes} />
              <div className="border-t border-slate-200 p-6 bg-white flex-shrink-0">
                <div className="space-y-2">
                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>저장하고 나중에 돌아오기</span>
                  </button>

                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-amber-200 text-sm"
                  >
                    <span>배경 자료 읽고 돌아오기</span>
                  </button>

                  <button
                    onClick={onNext}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Third Pass로 진행</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                <TranslatedTextPanel
                  content={pageTranslations[currentPage] || translatedFullText}
                  title={`전체 번역본 (페이지 ${currentPage})`}
                />
              </div>

              <div className="border-t border-slate-200 p-6 bg-white space-y-4 flex-shrink-0">
                <div>
                  <h3 className="text-slate-700 mb-2">메모</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="논문 내용에 대한 메모를 작성하세요..."
                    className="w-full h-24 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 resize-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>저장하고 나중에 돌아오기</span>
                  </button>

                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-amber-200 text-sm"
                  >
                    <span>배경 자료 읽고 돌아오기</span>
                  </button>

                  <button
                    onClick={onNext}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Third Pass로 진행</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}