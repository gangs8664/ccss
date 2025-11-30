import { useState, useEffect } from 'react';
import { Save, Loader2, MessageSquare, FileText } from 'lucide-react';
import { TranslatedTextPanel } from './TranslatedTextPanel';
import { Chatbot, type ChatMessage } from './Chatbot';
import { UnifiedNotes, type UnifiedNotesData } from './UnifiedNotes';
import { generateSummary, savePaperProgress } from '../services/mockPaperApi';
import type { Paper, ThirdPassData, FirstPassData, SecondPassData } from '../types';

interface ThirdPassProps {
  paper: Paper;
  firstPassData: FirstPassData | null;
  secondPassData: SecondPassData | null;
  onSave: (data: ThirdPassData) => void;
  initialData: ThirdPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
  unifiedNotes: UnifiedNotesData;
  onUpdateNotes: (notes: UnifiedNotesData) => void;
}

export function ThirdPass({
  paper,
  firstPassData,
  secondPassData,
  onSave,
  initialData,
  chatMessages,
  onSendChatMessage,
  isChatLoading,
  unifiedNotes,
  onUpdateNotes,
}: ThirdPassProps) {
  const [aiSummary, setAiSummary] = useState(initialData?.aiSummary || '');
  const [userNotes, setUserNotes] = useState(initialData?.userNotes || '');
  const [finalReview, setFinalReview] = useState(initialData?.finalReview || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [rightPanel, setRightPanel] = useState<'notes' | 'chatbot'>('notes');

  // AI 요약 자동 생성
  useEffect(() => {
    const fetchSummary = async () => {
      if (!aiSummary && !isGeneratingSummary) {
        setIsGeneratingSummary(true);
        try {
          const response = await generateSummary(paper.id, paper.content);
          setAiSummary(response.summary);
        } catch (error) {
            console.error('Summary generation failed:', error);
            setAiSummary(
              `이 논문은 Transformer라는 새로운 신경망 아키텍처를 제안합니다...`,
            );
        } finally {
          setIsGeneratingSummary(false);
        }
      }
    };

    fetchSummary();
  }, [paper.id, paper.content, aiSummary, isGeneratingSummary]);

  // 자동 저장
  useEffect(() => {
    const data: ThirdPassData = {
      paperId: paper.id,
      aiSummary,
      userNotes,
      firstPassSummary: firstPassData?.notes || '',
      secondPassSummary: secondPassData?.notes || '',
      finalReview,
    };
    onSave(data);
    savePaperProgress(paper.id, 'third', data);
  }, [userNotes, finalReview, paper.id, aiSummary, firstPassData, secondPassData, onSave]);

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        {/* Left Panel - AI Summary */}
        <div className="flex-1 border-r border-slate-200 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex-shrink-0">
            <h2 className="text-slate-800">GPT 요약</h2>
            <p className="text-slate-500 text-sm mt-1">AI가 분석한 논문 요약</p>
          </div>

          {isGeneratingSummary ? (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
                <p className="text-slate-600">AI가 논문을 요약하는 중입니다...</p>
                <p className="text-slate-400 text-sm mt-1">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <TranslatedTextPanel content={aiSummary} title="GPT 요약" editable={false} />
            </div>
          )}
        </div>

        {/* Right Panel - Notes or Chatbot */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">
                {rightPanel === 'chatbot' ? 'AI 어시스턴트' : '나의 노트'}
              </h2>
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
            <div className="flex-1 overflow-hidden">
              <Chatbot
                messages={chatMessages}
                onSendMessage={onSendChatMessage}
                isLoading={isChatLoading}
              />
            </div>
          ) : (
            <>
              <UnifiedNotes notes={unifiedNotes} onUpdate={onUpdateNotes} />
              <div className="border-t border-slate-200 p-6 bg-white flex-shrink-0">
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>최종 저장하기</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}