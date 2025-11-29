import { useState, useEffect } from 'react';
import { ChevronRight, MessageSquare, FileText } from 'lucide-react';
import { Chatbot, type ChatMessage } from './Chatbot';
import { UnifiedNotes, type UnifiedNotesData } from './UnifiedNotes';
import type { Paper, FirstPassData } from '../types';

interface FirstPassProps {
  paper: Paper;
  onSave: (data: FirstPassData) => void;
  onNext: () => void;
  initialData: FirstPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
  unifiedNotes: UnifiedNotesData;
  onUpdateNotes: (notes: UnifiedNotesData) => void;
}

export function FirstPass({
  paper,
  onSave,
  onNext,
  initialData,
  chatMessages,
  onSendChatMessage,
  isChatLoading,
  unifiedNotes,
  onUpdateNotes,
}: FirstPassProps) {
  // 논문의 주요 섹션 추출 (Title, Abstract, Introduction, Sections, Conclusion)
  const sections = paper.content.split('\n\n').filter((s) => s.trim());
  const [originalSections] = useState(sections.slice(0, 6)); // 영어 원본

  // 번역본을 섹션별로 나누기 (지금은 목업 수준)
  const translatedFullText = paper.translatedContent || paper.content;
  const translatedSectionArray = translatedFullText.split('\n\n').filter((s) => s.trim());

  const [translatedSections] = useState<string[]>(
    initialData?.translatedSections || translatedSectionArray.slice(0, 6),
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [rightPanel, setRightPanel] = useState<'notes' | 'chatbot'>('notes');

  useEffect(() => {
    const data: FirstPassData = {
      paperId: paper.id,
      originalSections,
      translatedSections,
      notes,
    };
    onSave(data);
  }, [translatedSections, notes, paper.id, onSave, originalSections]);

  const sectionTitles = ['Title', 'Abstract', 'Introduction', 'Main Sections', 'Conclusions', 'References'];

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        {/* Left Panel - Original English */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex-shrink-0">
            <h2 className="text-slate-800">원본 (영어)</h2>
            <p className="text-slate-500 text-sm mt-1">First Pass - 논문 훑어보기</p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {originalSections.map((section, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-indigo-600 mb-3">{sectionTitles[idx]}</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Notes or Chatbot */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">{rightPanel === 'chatbot' ? 'AI 어시스턴트' : '나의 노트'}</h2>
              <p className="text-slate-500 text-sm mt-1">
                {rightPanel === 'chatbot' ? '논문에 대해 질문하세요' : '학습 내용을 기록하고 정리하세요'}
              </p>
            </div>
            <div className="flex items-center gap-2">
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

          {rightPanel === 'chatbot' ? (
            // Chatbot도 오른쪽 패널 내부에서만 스크롤되도록 래핑
            <div className="flex-1 overflow-hidden">
              <Chatbot messages={chatMessages} onSendMessage={onSendChatMessage} isLoading={isChatLoading} />
            </div>
          ) : (
            <>
              {/* UnifiedNotes 내부에서 스크롤 */}
              <UnifiedNotes notes={unifiedNotes} onUpdate={onUpdateNotes} />
              <div className="border-t border-slate-200 p-6 bg-white flex-shrink-0">
                <button
                  onClick={onNext}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Second Pass로 이동</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}