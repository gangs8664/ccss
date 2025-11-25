import { useState, useEffect } from "react";
import { Save, Loader2, MessageSquare } from "lucide-react";
import { TranslatedTextPanel } from "./TranslatedTextPanel.tsx";
import { Chatbot, type ChatMessage } from "./Chatbot";
import {
  generateSummary,
  savePaperProgress,
} from "../services/api.ts";
import type {
  Paper,
  ThirdPassData,
  FirstPassData,
  SecondPassData,
} from "../types/";

interface ThirdPassProps {
  paper: Paper;
  firstPassData: FirstPassData | null;
  secondPassData: SecondPassData | null;
  onSave: (data: ThirdPassData) => void;
  initialData: ThirdPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
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
}: ThirdPassProps) {
  const [aiSummary, setAiSummary] = useState(
    initialData?.aiSummary || "",
  );
  const [userNotes, setUserNotes] = useState(
    initialData?.userNotes || "",
  );
  const [finalReview, setFinalReview] = useState(
    initialData?.finalReview || "",
  );
  const [isGeneratingSummary, setIsGeneratingSummary] =
    useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // 컴포넌트 마운트 시 AI 요약 자동 생성 (이미 생성된 요약이 없을 경우)
  useEffect(() => {
    const fetchSummary = async () => {
      if (!aiSummary && !isGeneratingSummary) {
        setIsGeneratingSummary(true);
        try {
          // TODO: 실제 백엔드 API 호출
          const response = await generateSummary(
            paper.id,
            paper.content,
          );
          setAiSummary(response.summary);
        } catch (error) {
          console.error("Summary generation failed:", error);
          // 에러 시 기본 텍스트 사용
          setAiSummary(
            `이 논문은 Transformer라는 새로운 신경망 아키텍처를 제안합니다. 기존의 순환 신경망(RNN)이나 합성곱 신경망(CNN)과 달리, Transformer는 오직 어텐션 메커니즘만을 사용하여 시퀀스를 처리합니다.\n\n주요 기여:\n1. Self-Attention 메커니즘을 기반으로 한 완전히 새로운 아키텍처 제안\n2. 순환 구조를 제거하여 병렬화 가능성을 크게 향상\n3. 기계 번역 작업에서 기존 최고 성능 모델들을 능가하는 결과 달성\n4. 훈련 시간을 대폭 단축 (8개 GPU로 12시간만에 학습 가능)\n\n핵심 아이디어:\n- Multi-Head Attention: 여러 개의 어텐션을 병렬로 수행하여 다양한 표현 부분공간의 정보를 동시에 학습\n- Positional Encoding: 순환 구조 없이도 시퀀스의 위치 정보를 인코딩\n- Feed-Forward Networks: 각 위치에서 독립적으로 적용되는 완전 연결 네트워크\n\n성능:\n- WMT 2014 영어-독일어 번역에서 BLEU 점수 28.4 달성 (기존 최고 대비 2.0 BLEU 점수 향상)\n- WMT 2014 영어-프랑스어 번역에서 BLEU 점수 41.8 달성 (새로운 최고 기록)\n\n영향:\n이 연구는 자연어 처리 분야에 혁명을 가져왔으며, BERT, GPT 등 현대의 대부분의 언어 모델들의 기초가 되었습니다. Transformer 아키텍처는 현재 NLP뿐만 아니라 컴퓨터 비전, 음성 인식 등 다양한 분야에서 활용되고 있습니다.`,
          );
        } finally {
          setIsGeneratingSummary(false);
        }
      }
    };

    fetchSummary();
  }, [paper.id, paper.content, aiSummary, isGeneratingSummary]);

  useEffect(() => {
    const data: ThirdPassData = {
      paperId: paper.id,
      aiSummary,
      userNotes,
      firstPassSummary: firstPassData?.notes || "",
      secondPassSummary: secondPassData?.notes || "",
      finalReview,
    };
    onSave(data);

    // 백엔드에 자동 저장
    savePaperProgress(paper.id, "third", data);
  }, [
    userNotes,
    finalReview,
    paper.id,
    aiSummary,
    firstPassData,
    secondPassData,
  ]);

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
                <p className="text-slate-600">
                  AI가 논문을 요약하는 중입니다...
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  잠시만 기다려주세요
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <TranslatedTextPanel
                content={aiSummary}
                title="GPT 요약"
                editable={false}
              />
            </div>
          )}
        </div>

        {/* Right Panel - User Notes or Chatbot */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">
                {showChatbot ? 'AI 어시스턴트' : '나의 노트 & 최종 정리'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {showChatbot ? '논문에 대해 질문하세요' : '모든 Pass의 내용을 통합하여 최종 정리'}
              </p>
            </div>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="p-2 rounded-lg hover:bg-slate-200 transition-all"
              title={showChatbot ? '노트 보기' : '챗봇 열기'}
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
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* First Pass Summary */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <h3 className="text-indigo-700 mb-3">
                  First Pass 메모
                </h3>
                {firstPassData?.notes ? (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {firstPassData.notes}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    First Pass 메모가 없습니다
                  </p>
                )}
              </div>

              {/* Second Pass Summary */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h3 className="text-purple-700 mb-3">
                  Second Pass 메모
                </h3>
                {secondPassData?.notes ? (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {secondPassData.notes}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    Second Pass 메모가 없습니다
                  </p>
                )}
                {secondPassData?.pdfAnnotations &&
                  secondPassData.pdfAnnotations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-purple-600 text-sm mb-2">
                        하이라이트:{" "}
                        {secondPassData.pdfAnnotations.length}개
                      </p>
                    </div>
                  )}
              </div>

              {/* User Notes */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h3 className="text-slate-700 mb-3">
                  나의 상세 노트
                </h3>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="논문을 가상으로 재구현한다면 어떻게 할지, 핵심 아이디어와 차별점을 정리하세요..."
                  className="w-full h-48 p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 resize-none"
                />
              </div>

              {/* Final Review */}
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                <h3 className="text-rose-700 mb-3">
                  최종 리뷰 & 평가
                </h3>
                <textarea
                  value={finalReview}
                  onChange={(e) => setFinalReview(e.target.value)}
                  placeholder="논문의 강점, 약점, 활용 가능성 등을 종합적으로 평가하세요..."
                  className="w-full h-32 p-4 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white resize-none"
                />
              </div>

              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                <span>최종 저장하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}