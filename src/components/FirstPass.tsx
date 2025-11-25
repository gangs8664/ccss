import { useState, useEffect } from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { Chatbot, type ChatMessage } from './Chatbot';
import type { Paper, FirstPassData } from '../types/';

interface FirstPassProps {
  paper: Paper;
  onSave: (data: FirstPassData) => void;
  onNext: () => void;
  initialData: FirstPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
}

export function FirstPass({ paper, onSave, onNext, initialData, chatMessages, onSendChatMessage, isChatLoading }: FirstPassProps) {
  // 논문의 주요 섹션 추출 (Title, Abstract, Introduction, Sections, Conclusion)
  const sections = paper.content.split('\\n\\n').filter(s => s.trim());
  const [originalSections] = useState(sections.slice(0, 6)); // 영어 원본
  
  // 번역본을 섹션별로 나누기
  const translatedFullText = paper.translatedContent || paper.content;
  const translatedSectionArray = translatedFullText.split('\\n\\n').filter(s => s.trim());
  
  const [translatedSections, setTranslatedSections] = useState<string[]>(
    initialData?.translatedSections || translatedSectionArray.slice(0, 6)
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const data: FirstPassData = {
      paperId: paper.id,
      originalSections,
      translatedSections,
      notes,
    };
    onSave(data);
  }, [translatedSections, notes, paper.id]);

  const sectionTitles = ['Title', 'Abstract', 'Introduction', 'Main Sections', 'Conclusions', 'References'];

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        {/* Left Panel - Original English */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="text-slate-800">원본 (영어)</h2>
            <p className="text-slate-500 text-sm mt-1">First Pass - 논문 훑어보기</p>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {originalSections.map((section, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-indigo-600 mb-3">{sectionTitles[idx]}</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {section}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Korean Translation or Chatbot */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-slate-800">{showChatbot ? 'AI 어시스턴트' : '번역본 (한국어)'}</h2>
              <p className="text-slate-500 text-sm mt-1">
                {showChatbot ? '논문에 대해 질문하세요' : 'AI가 번역한 내용'}
              </p>
            </div>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="p-2 rounded-lg hover:bg-slate-200 transition-all"
              title={showChatbot ? '번역본 보기' : '챗봇 열기'}
            >
              <MessageSquare className={`w-5 h-5 ${showChatbot ? 'text-indigo-600' : 'text-slate-600'}`} />
            </button>
          </div>
          
          {showChatbot ? (
            <Chatbot
              messages={chatMessages}
              onSendMessage={onSendChatMessage}
              isLoading={isChatLoading}
            />
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {translatedSections.map((section, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="text-indigo-700 mb-3">{sectionTitles[idx]}</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {section}
                    </p>
                  </div>
                ))}

                <div className="bg-white rounded-xl p-6 border border-slate-200 mt-8">
                  <h3 className="text-slate-700 mb-3">추가 메모</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="First Pass에서 파악한 내용을 메모하세요..."
                    className="w-full h-32 p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 resize-none"
                  />
                </div>

                <button
                  onClick={onNext}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Second Pass로 이동</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}