import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  MessageSquare,
  FileText,
  Languages,
} from "lucide-react";

import { PDFViewer } from "./PDFViewer";
import { TranslatedTextPanel } from "./TranslatedTextPanel";
import { Chatbot, type ChatMessage } from "./Chatbot";
import {
  UnifiedNotes,
  type UnifiedNotesData,
} from "./UnifiedNotes";

import type {
  Paper,
  SecondPassData,
  Highlight,
} from "../types";

interface SecondPassProps {
  paper?: Paper;
  onSave?: (data: SecondPassData) => void;
  onNext?: () => void;
  onSaveAndExit?: () => void;
  initialData?: SecondPassData | null;
  chatMessages?: ChatMessage[];
  onSendChatMessage?: (message: string) => void;
  isChatLoading?: boolean;
  unifiedNotes?: UnifiedNotesData;
  onUpdateNotes?: (notes: UnifiedNotesData) => void;
  pageTranslationsData?: Record<number, string>;
}

export function SecondPass({
  paper,
  onSave,
  onNext,
  onSaveAndExit,
  initialData,
  chatMessages = [],
  onSendChatMessage = () => {},
  isChatLoading = false,
  unifiedNotes,
  onUpdateNotes = () => {},
  pageTranslationsData,
}: SecondPassProps) {
  if (import.meta.env.DEV) {
    console.log("[SecondPass] props", {
      paper,
      initialData,
      pageTranslationsData,
    });
  }
  const safePaper: Paper = useMemo(
    () =>
      paper ?? {
        id: "",
        title: "",
        content: "",
        translatedContent: "",
        analysis_stage: "second_pass",
      },
    [paper]
  );

  const [pdfAnnotations, setPdfAnnotations] = useState<Highlight[]>(
    initialData?.pdfAnnotations ?? []
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [currentPage, setCurrentPage] = useState(1);
  const [contentTab, setContentTab] = useState<"translation" | "notes">(
    "translation"
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const initialTranslation = useMemo(() => {
    const text =
      initialData?.translatedFullText?.trim() ??
      safePaper.translatedContent?.trim() ??
      "";
    return text;
  }, [initialData?.translatedFullText, safePaper.translatedContent]);

  const [translatedFullText, setTranslatedFullText] = useState(
    initialTranslation
  );
  const [pageTranslations, setPageTranslations] = useState<Record<number, string>>(
    () =>
      pageTranslationsData && Object.keys(pageTranslationsData).length > 0
        ? pageTranslationsData
        : buildPageTranslations(initialTranslation)
  );
  if (import.meta.env.DEV) {
    console.log("[SecondPass] initialTranslation", initialTranslation);
  }

  useEffect(() => {
    setTranslatedFullText(initialTranslation);
    if (!pageTranslationsData || Object.keys(pageTranslationsData).length === 0) {
      const built = buildPageTranslations(initialTranslation);
      setPageTranslations(built);
      if (import.meta.env.DEV) {
        console.log("[SecondPass] built page translations from text", built);
      }
    }
  }, [initialTranslation, pageTranslationsData]);

  useEffect(() => {
    if (pageTranslationsData && Object.keys(pageTranslationsData).length > 0) {
      setPageTranslations(pageTranslationsData);
      if (import.meta.env.DEV) {
        console.log("[SecondPass] using provided pageTranslationsData", pageTranslationsData);
      }
    }
  }, [pageTranslationsData]);

  useEffect(() => {
    if (!onSave) return;
    const payload: SecondPassData = {
      paperId: safePaper.id,
      pdfAnnotations,
      translatedFullText,
      notes,
    };
    onSave(payload);
  }, [pdfAnnotations, translatedFullText, notes, onSave, safePaper.id]);

  const handleHighlight = (text: string, color: string) => {
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      color,
      paperId: safePaper.id,
      position: {
        pageNumber: currentPage,
        start: 0,
        end: text.length,
      },
    };
    setPdfAnnotations((prev) => [...prev, newHighlight]);
  };

  const pdfUrl = useMemo(() => {
    if (safePaper.pdfUrl) return safePaper.pdfUrl;
    if (!safePaper.file_path) return undefined;
    if (/^https?:\/\//.test(safePaper.file_path)) return safePaper.file_path;

    const apiBase =
      (import.meta as any).env?.VITE_API_BASE_URL as
        | string
        | undefined;

    if (!apiBase) return safePaper.file_path;

    const normalizedBase = apiBase.endsWith("/")
      ? apiBase.slice(0, -1)
      : apiBase;
    const normalizedPath = safePaper.file_path.startsWith("/")
      ? safePaper.file_path.slice(1)
      : safePaper.file_path;

    return `${normalizedBase}/${normalizedPath}`;
  }, [safePaper.file_path, safePaper.pdfUrl]);

  const translationContent =
    pageTranslations[currentPage] ??
    (translatedFullText || safePaper.content || "");
  if (import.meta.env.DEV) {
    console.log("[SecondPass] translationContent", { currentPage, translationContent });
  }

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50">
      <div className="h-full w-full flex">
        <div className="flex-1 border-r border-slate-200 bg-white">
          <PDFViewer
            pdfUrl={pdfUrl}
            content={safePaper.content}
            onHighlight={handleHighlight}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">
                {contentTab === "notes"
                  ? "나의 노트"
                  : `번역본 (페이지 ${currentPage})`}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {contentTab === "notes"
                  ? "5C 노트와 Summary를 정리하세요"
                  : "AI가 번역한 내용을 확인하세요"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setContentTab("translation")}
                className={`p-2 rounded-lg transition-all ${
                  contentTab === "translation"
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title="번역본 보기"
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={() => setContentTab("notes")}
                className={`p-2 rounded-lg transition-all ${
                  contentTab === "notes"
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
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
            <div className="flex-1 min-h-0">
              {contentTab === "notes" ? (
                <div className="h-full overflow-auto">
                  <UnifiedNotes
                    notes={unifiedNotes}
                    onUpdate={(updated) => onUpdateNotes(updated)}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <TranslatedTextPanel
                      content={translationContent}
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
                  </div>
                </div>
              )}
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

          <SecondPassActionBar
            onSaveAndExit={onSaveAndExit}
            onNext={onNext}
          />
        </div>
      </div>
    </div>
  );
}

function SecondPassActionBar({
  onSaveAndExit,
  onNext,
}: {
  onSaveAndExit?: () => void;
  onNext?: () => void;
}) {
  const handleSave = () => {
    onSaveAndExit?.();
  };
  const handleNext = () => {
    onNext?.();
  };

  return (
    <div className="border-t border-slate-200 p-6 bg-white flex-shrink-0 space-y-2">
      <button
        onClick={handleSave}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
      >
        저장하고 나중에 돌아오기
      </button>

      <button
        onClick={handleSave}
        className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-amber-200 text-sm"
      >
        배경 자료 읽고 돌아오기
      </button>

      <button
        onClick={handleNext}
        disabled={!onNext}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Third Pass로 진행
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function buildPageTranslations(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return {};
  const segments = trimmed
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const map: Record<number, string> = {};
  segments.forEach((segment, idx) => {
    map[idx + 1] = segment;
  });
  return map;
}
