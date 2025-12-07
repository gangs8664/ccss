import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  MessageSquare,
  FileText,
  CheckCircle,
} from "lucide-react";

import { TranslatedTextPanel } from "./TranslatedTextPanel";
import { Chatbot, type ChatMessage } from "./Chatbot";
import {
  UnifiedNotes,
  type UnifiedNotesData,
} from "./UnifiedNotes";

import type {
  Paper,
  ThirdPassData,
  FirstPassData,
  SecondPassData,
} from "../types";
import { mockThirdPass } from "../hardcoded/thirdPassData";

interface ThirdPassProps {
  paper?: Paper | null;
  firstPassData?: FirstPassData | null;
  secondPassData?: SecondPassData | null;
  onSave?: (data: ThirdPassData) => void;
  initialData?: ThirdPassData | null;
  chatMessages?: ChatMessage[];
  onSendChatMessage?: (message: string) => void;
  isChatLoading?: boolean;
  unifiedNotes?: UnifiedNotesData;
  onUpdateNotes?: (notes: UnifiedNotesData) => void;
  onComplete?: () => void;
}

const EMPTY_NOTES: UnifiedNotesData = {
  quickNotes: {
    category: "",
    context: "",
    correctness: "",
    contributions: "",
    clarity: "",
  },
  detailedNotes: "",
  finalReview: "",
};

const EMPTY_THIRD_PASS: ThirdPassData = {
  paperId: "",
  aiSummary: "",
  userNotes: "",
  firstPassSummary: "",
  secondPassSummary: "",
  finalReview: "",
};

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
  onComplete,
}: ThirdPassProps) {
  const safePaper: Paper = useMemo(
    () =>
      paper ?? {
        id: "",
        title: "",
        content: "",
        translatedContent: "",
        analysis_stage: "third_pass",
      },
    [paper]
  );

  const safeNotes = unifiedNotes ?? EMPTY_NOTES;
  const safeInitial = initialData ?? {
    ...EMPTY_THIRD_PASS,
    paperId: safePaper.id,
    firstPassSummary: firstPassData?.notes ?? "",
    secondPassSummary: secondPassData?.notes ?? "",
  };

  const safeChatMessages = chatMessages ?? [];

  const [aiSummary, setAiSummary] = useState(
    safeInitial.aiSummary || mockThirdPass.aiSummary
  );
  const [userNotes, setUserNotes] = useState(
    safeInitial.userNotes ??
      mockThirdPass.userNotes ??
      ""
  );
  const [finalReview, setFinalReview] = useState(
    safeInitial.finalReview ??
      mockThirdPass.finalReview ??
      ""
  );
  const [isGeneratingSummary, setIsGeneratingSummary] =
    useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const notesPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialData?.aiSummary && initialData.aiSummary !== aiSummary) {
      setAiSummary(initialData.aiSummary);
      if (import.meta.env.DEV) {
        console.log("[ThirdPass] initialData.aiSummary applied:", initialData.aiSummary);
      }
    }
    if (initialData?.userNotes && initialData.userNotes !== userNotes) {
      setUserNotes(initialData.userNotes);
    }
    if (initialData?.finalReview && initialData.finalReview !== finalReview) {
      setFinalReview(initialData.finalReview);
    }
  }, [initialData?.aiSummary, initialData?.userNotes, initialData?.finalReview]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (aiSummary || isGeneratingSummary) return;
      setIsGeneratingSummary(true);
      try {
        const response = await mockGenerateSummary(
          safePaper.id,
          safePaper.content
        );
        setAiSummary(response.summary);
      } catch (err) {
        console.error("ThirdPass summary fallback:", err);
        setAiSummary(mockThirdPass.aiSummary);
      } finally {
        setIsGeneratingSummary(false);
      }
    };

    fetchSummary();
  }, [
    aiSummary,
    isGeneratingSummary,
    safePaper.content,
    safePaper.id,
  ]);

  useEffect(() => {
    if (!onSave) return;

    const payload: ThirdPassData = {
      paperId: safePaper.id,
      aiSummary,
      userNotes,
      firstPassSummary: firstPassData?.notes ?? "",
      secondPassSummary: secondPassData?.notes ?? "",
      finalReview,
    };

    onSave(payload);
    mockSavePaperProgress(safePaper.id, payload);
  }, [
    aiSummary,
    userNotes,
    finalReview,
    safePaper.id,
    firstPassData?.notes,
    secondPassData?.notes,
    onSave,
  ]);

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        <div className="flex-1 border-r border-slate-200 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-slate-800">AI 요약</h2>
              <p className="text-slate-500 text-sm mt-1">
                모델이 분석한 요약 결과
              </p>
            </div>
          </div>

          {isGeneratingSummary ? (
            <div className="flex-1 flex items-center justify-center">
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
                title="AI 요약"
                editable={false}
              />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">나의 노트 & AI 어시스턴트</h2>
              <p className="text-slate-500 text-sm mt-1">
                학습을 정리하면서 동시에 AI에게 질문할 수 있어요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isChatOpen) {
                    setIsChatOpen(false);
                  }
                  requestAnimationFrame(() => {
                    notesPanelRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  });
                }}
                className="p-2 rounded-lg transition-all hover:bg-slate-200 text-slate-600"
                title="노트 보기"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsChatOpen((prev) => !prev)}
                className={`p-2 rounded-lg transition-all ${
                  isChatOpen
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title={isChatOpen ? "챗봇 닫기" : "챗봇 열기"}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 overflow-hidden flex flex-col ${
              isChatOpen ? "xl:flex-row" : ""
            }`}
          >
            <div ref={notesPanelRef} className="flex-1 overflow-auto">
              <UnifiedNotes
                notes={safeNotes}
                onUpdate={onUpdateNotes ?? (() => {})}
              />
            </div>
            {isChatOpen && (
              <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-slate-200 bg-white flex-shrink-0 min-h-[320px] max-h-full">
                <Chatbot
                  messages={safeChatMessages}
                  onSendMessage={onSendChatMessage ?? (() => {})}
                  isLoading={isChatLoading ?? false}
                />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-6 bg-white flex-shrink-0 space-y-3">
            <button
              onClick={onComplete}
              className="w-full text-white py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#34d399,#22c55e,#059669)",
              }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>학습 완료하기</span>
            </button>
            <p className="text-xs text-slate-500 text-center">
              완료 후 전체 학습 내용을 한눈에 확인할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

async function mockGenerateSummary(_: string, __: string) {
  return Promise.resolve({
    summary: mockThirdPass.aiSummary,
  });
}

async function mockSavePaperProgress(
  paperId: string,
  payload: ThirdPassData
) {
  console.info("ThirdPass progress saved:", paperId, payload);
  return Promise.resolve();
}
