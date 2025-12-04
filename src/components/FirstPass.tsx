import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { ChevronRight, FileText, MessageSquare } from "lucide-react";

import type { Paper, FirstPassData } from "../types";
import { Chatbot, type ChatMessage } from "./Chatbot";
import {
  UnifiedNotes,
  type UnifiedNotesData,
} from "./UnifiedNotes";

export interface FirstPassSection {
  title: string;
  type: string;
  content_org: string | null;
  content_trans: string | null;
}

interface FirstPassProps {
  paper: Paper;
  firstPassSections?: FirstPassSection[];
  onSave?: (data: FirstPassData) => void;
  onNext?: () => void;
  initialData?: FirstPassData | null;
  chatMessages?: ChatMessage[];
  onSendChatMessage?: (msg: string) => void;
  isChatLoading?: boolean;
  unifiedNotes?: UnifiedNotesData;
  onUpdateNotes?: (notes: UnifiedNotesData) => void;
}

const EMPTY_NOTES: UnifiedNotesData = {
  quickNotes: JSON.stringify({
    category: "",
    context: "",
    correctness: "",
    contributions: "",
    clarity: "",
  }),
  detailedNotes: "",
  finalReview: "",
};

const EMPTY_FIRST_PASS: FirstPassData = {
  paperId: "",
  originalSections: [],
  translatedSections: [],
  notes: "",
};

export function FirstPass({
  paper,
  firstPassSections,
  onSave,
  onNext,
  initialData,
  chatMessages = [],
  onSendChatMessage = () => {},
  isChatLoading = false,
  unifiedNotes,
  onUpdateNotes = () => {},
}: FirstPassProps) {
  if (import.meta.env.DEV) {
    console.log("[FirstPass] firstPassSections:", firstPassSections);
  }
  const safePaper: Paper =
    paper ?? {
      id: "",
      title: "",
      content: "",
      translatedContent: "",
      analysis_stage: "first_pass",
    };

  const sections: FirstPassSection[] = firstPassSections ?? [];

  const safeInitialData: FirstPassData = {
    ...(initialData ?? EMPTY_FIRST_PASS),
    paperId: safePaper.id,
  };

  const safeUnifiedNotes = unifiedNotes ?? EMPTY_NOTES;

  const [leftTab, setLeftTab] = useState<"pdf" | "ai">("pdf");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL as
    | string
    | undefined;

  const pdfUrl = useMemo(() => {
    if (safePaper.pdfUrl) return safePaper.pdfUrl;
    if (!safePaper.file_path) return undefined;

    if (
      safePaper.file_path.startsWith("http://") ||
      safePaper.file_path.startsWith("https://")
    ) {
      return safePaper.file_path;
    }

    if (!apiBase) return safePaper.file_path;

    const normalizedBase = apiBase.endsWith("/")
      ? apiBase.slice(0, -1)
      : apiBase;
    const normalizedPath = safePaper.file_path.startsWith("/")
      ? safePaper.file_path.slice(1)
      : safePaper.file_path;

    return `${normalizedBase}/${normalizedPath}`;
  }, [apiBase, safePaper.file_path, safePaper.pdfUrl]);

  const originalSections = sections
    .map((s) => s.content_org ?? "")
    .filter((s) => s.trim().length > 0);
  const translatedSections = sections
    .map((s) => s.content_trans ?? "")
    .filter((s) => s.trim().length > 0);
  const notes = safeInitialData.notes ?? "";

  useEffect(() => {
    if (!onSave) return;

    onSave({
      paperId: safePaper.id,
      originalSections,
      translatedSections,
      notes,
    });
  }, [onSave, safePaper.id, originalSections, translatedSections, notes]);

  useEffect(() => {
    setNumPages(null);
    setPdfError(null);
  }, [pdfUrl]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[FirstPass] 렌더링 paper:", safePaper);
      console.log("[FirstPass] 계산된 pdfUrl:", pdfUrl);
    }
  }, [safePaper, pdfUrl]);

  const handlePdfLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const handlePdfLoadError = (error: unknown) => {
    console.error("PDF 로드 실패:", error);
    setPdfError("PDF를 불러오는 데 실패했습니다.");
  };

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-slate-800">논문 원본 & AI 분석</h2>
              <p className="text-slate-500 text-sm mt-1">
                PDF 원문과 AI가 분석한 섹션 구조를 왼쪽에서 확인할 수 있어요.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl bg-white p-1 border border-slate-200">
              <button
                onClick={() => setLeftTab("pdf")}
                className={`px-3 py-1 text-sm rounded-lg ${
                  leftTab === "pdf"
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                PDF 원문
              </button>
              <button
                onClick={() => setLeftTab("ai")}
                className={`px-3 py-1 text-sm rounded-lg ${
                  leftTab === "ai"
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                AI 분석 섹션
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {leftTab === "pdf" ? (
              <PdfPreviewPane
                pdfUrl={pdfUrl}
                title={safePaper.title}
                numPages={numPages}
                pdfError={pdfError}
                onLoadSuccess={handlePdfLoadSuccess}
                onLoadError={handlePdfLoadError}
              />
            ) : (
              <AiSections sections={sections} />
            )}
          </div>
        </div>

        <RightPanelContent
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          chatMessages={chatMessages}
          onSendChatMessage={onSendChatMessage}
          isChatLoading={isChatLoading}
          unifiedNotes={safeUnifiedNotes}
          onUpdateNotes={onUpdateNotes}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

function PdfPreviewPane({
  pdfUrl,
  title,
  numPages,
  pdfError,
  onLoadSuccess,
  onLoadError,
}: {
  pdfUrl?: string;
  title: string;
  numPages: number | null;
  pdfError: string | null;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: unknown) => void;
}) {
  if (!pdfUrl) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
        이 논문에 연결된 PDF 경로가 없습니다. (pdfUrl 또는 file_path를 확인해주세요)
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
      <div className="border-b border-slate-200 px-4 py-2 text-xs text-slate-600 bg-slate-50 flex justify-between">
        <span className="truncate">
          PDF: <span className="font-medium">{title}</span>
        </span>
        {numPages && <span>총 {numPages} 페이지</span>}
      </div>

      <div className="flex-1 overflow-auto flex justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="p-4 text-sm text-slate-500">
              PDF를 불러오는 중입니다…
            </div>
          }
        >
          {pdfError ? (
            <div className="p-4 text-sm text-red-500">{pdfError}</div>
          ) : numPages ? (
            <div className="py-4 flex flex-col items-center gap-4">
              {Array.from({ length: numPages }).map((_, idx) => (
                <div
                  key={`page_${idx + 1}`}
                  className="shadow-sm bg-white border border-slate-200"
                >
                  <Page pageNumber={idx + 1} width={650} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-slate-500">
              페이지 정보를 가져오는 중입니다…
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}

function AiSections({ sections }: { sections: FirstPassSection[] }) {
  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
        아직 AI First Pass 분석 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((sec, idx) => {
        const hasOrg = (sec.content_org ?? "").trim().length > 0;
        const hasTrans = (sec.content_trans ?? "").trim().length > 0;

        return (
          <div
            key={`${sec.title ?? "section"}-${idx}`}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-indigo-600">
                {sec.title || `Section ${idx + 1}`}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {sec.type || "section"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {hasOrg && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    원문 (영어)
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {sec.content_org}
                  </p>
                </div>
              )}

              {hasTrans && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    번역문 (한국어)
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {sec.content_trans}
                  </p>
                </div>
              )}

              {!hasOrg && !hasTrans && (
                <div className="col-span-1 md:col-span-2 text-xs text-slate-500">
                  이 섹션에는 아직 내용이 없습니다.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RightPanelContent({
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  onSendChatMessage,
  isChatLoading,
  unifiedNotes,
  onUpdateNotes,
  onNext,
}: {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  onSendChatMessage: (msg: string) => void;
  isChatLoading: boolean;
  unifiedNotes: UnifiedNotesData;
  onUpdateNotes: (update: UnifiedNotesData) => void;
  onNext?: () => void;
}) {
  const notesPanelRef = useRef<HTMLDivElement | null>(null);

  const focusNotes = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    }
    requestAnimationFrame(() => {
      notesPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-slate-800">나의 노트 & AI 대화</h2>
          <p className="text-slate-500 text-sm mt-1">
            노트를 정리하면서 동시에 AI에게 질문할 수 있어요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={focusNotes}
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
            notes={unifiedNotes}
            onUpdate={(updated) => onUpdateNotes(updated)}
          />
        </div>

        {isChatOpen && (
          <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-slate-200 bg-white flex-shrink-0 min-h-[320px] max-h-full">
            <Chatbot
              messages={chatMessages}
              onSendMessage={onSendChatMessage}
              isLoading={isChatLoading}
            />
          </div>
        )}
      </div>

      {isChatOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
          챗봇 대화는 패널을 닫아도 유지돼요.
        </div>
      )}

      {onNext && (
        <div className="border-t p-6 bg-white flex-shrink-0">
          <button
            onClick={onNext}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <span>Second Pass로 이동</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
