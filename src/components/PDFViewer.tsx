import { useEffect, useMemo, useState } from "react";
import { Document, Page } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Highlighter,
} from "lucide-react";

interface HighlightData {
  id: string;
  text: string;
  color: string;
  pageNumber: number;
}

interface PDFViewerProps {
  pdfUrl?: string;
  content?: string;
  onHighlight?: (text: string, color: string) => void;
  onPageChange?: (pageNumber: number) => void;
}

export function PDFViewer({
  pdfUrl,
  content = "",
  onHighlight,
  onPageChange,
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState("transparent");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const highlightColors = [
    { name: '투명', color: 'transparent' },
    { name: '노랑', color: '#FEF08A' },
    { name: '초록', color: '#BBF7D0' },
    { name: '파랑', color: '#BFDBFE' },
    { name: '분홍', color: '#FBCFE8' },
    { name: '보라', color: '#E9D5FF' },
  ];

  const fallbackParagraphs = useMemo(
    () =>
      content
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter(Boolean),
    [content]
  );
  const fallbackTotalPages = Math.max(
    1,
    Math.ceil(fallbackParagraphs.length / 3)
  );
  const fallbackPageContent = useMemo(() => {
    const startIndex = (currentPage - 1) * 3;
    return fallbackParagraphs.slice(startIndex, startIndex + 3);
  }, [currentPage, fallbackParagraphs]);

  const effectiveTotalPages = pdfUrl
    ? numPages ?? 1
    : fallbackTotalPages;

  const handleInternalPageChange = (newPage: number) => {
    const next = Math.min(
      Math.max(1, newPage),
      Math.max(1, effectiveTotalPages)
    );
    setCurrentPage(next);
    onPageChange?.(next);
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
    handleInternalPageChange(1);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("PDF 로드 실패:", error);
    setPdfError("PDF를 불러오는 데 실패했습니다.");
  };

  useEffect(() => {
    setCurrentPage(1);
    setNumPages(null);
    setPdfError(null);
  }, [pdfUrl]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = selection.toString().trim();
    if (text && text.length > 0) {
      // 현재 페이지에서 선택한 텍스트와 겹치는 모든 하이라이트 찾기
      const overlappingHighlights = highlights.filter(
        (h) =>
          h.pageNumber === currentPage &&
          (h.text === text ||
            h.text.includes(text) ||
            text.includes(h.text))
      );

      // 투명색인 경우: 겹치는 모든 하이라이트 제거
      if (selectedColor === "transparent") {
        if (overlappingHighlights.length > 0) {
          const overlappingIds = overlappingHighlights.map((h) => h.id);
          setHighlights((prev) =>
            prev.filter((h) => !overlappingIds.includes(h.id))
          );
        }
        selection.removeAllRanges();
        return;
      }

      // 겹치는 하이라이트가 있으면 모두 제거하고 새로 추가
      if (overlappingHighlights.length > 0) {
        const overlappingIds = overlappingHighlights.map((h) => h.id);
        setHighlights((prev) => [
          ...prev.filter((h) => !overlappingIds.includes(h.id)),
          {
            id: Date.now().toString(),
            text,
            color: selectedColor,
            pageNumber: currentPage,
          },
        ]);
      } else {
        // 겹치는 게 없으면 새로 추가
        const newHighlight: HighlightData = {
          id: Date.now().toString(),
          text,
          color: selectedColor,
          pageNumber: currentPage,
        };
        setHighlights((prev) => [...prev, newHighlight]);
      }

      if (onHighlight) {
        onHighlight(text, selectedColor);
      }

      selection.removeAllRanges();
    }
  };

  const getHighlightedContent = () => {
    const pageHighlights = highlights.filter(
      (h) => h.pageNumber === currentPage
    );

    return fallbackPageContent.map((paragraph, idx) => {
      // 하이라이트를 위치 기반으로 정렬하여 적용
      const parts: { text: string; highlight?: HighlightData }[] = [];
      let lastIndex = 0;

      const highlightPositions = pageHighlights
        .map((highlight) => {
          const index = paragraph.indexOf(highlight.text, lastIndex);
          return index !== -1 ? { highlight, index } : null;
        })
        .filter(
          (item): item is { highlight: HighlightData; index: number } =>
            item !== null
        )
        .sort((a, b) => a.index - b.index);

      const validHighlights: {
        highlight: HighlightData;
        index: number;
      }[] = [];
      let currentEnd = 0;

      for (const item of highlightPositions) {
        if (item.index >= currentEnd) {
          validHighlights.push(item);
          currentEnd = item.index + item.highlight.text.length;
        }
      }

      lastIndex = 0;
      validHighlights.forEach(({ highlight, index }) => {
        if (index > lastIndex) {
          parts.push({ text: paragraph.substring(lastIndex, index) });
        }
        parts.push({ text: highlight.text, highlight });
        lastIndex = index + highlight.text.length;
      });

      if (lastIndex < paragraph.length) {
        parts.push({ text: paragraph.substring(lastIndex) });
      }

      return (
        <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
          {parts.map((part, partIdx) =>
            part.highlight ? (
              <mark
                key={partIdx}
                style={{
                  backgroundColor: part.highlight.color,
                  padding: "2px 0",
                  borderRadius: "2px",
                }}
              >
                {part.text}
              </mark>
            ) : (
              <span key={partIdx}>{part.text}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleInternalPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 hover:bg-slate-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600">
              {currentPage} / {effectiveTotalPages}
            </span>
            <button
              onClick={() => handleInternalPageChange(currentPage + 1)}
              disabled={currentPage >= effectiveTotalPages}
              className="p-2 hover:bg-slate-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-slate-200" />

          {/* Highlighter */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Highlighter
                className="w-4 h-4"
                style={{
                  color:
                    selectedColor === "transparent"
                      ? "#94A3B8"
                      : selectedColor === "#FEF08A"
                      ? "#EAB308"
                      : selectedColor === "#BBF7D0"
                      ? "#22C55E"
                      : selectedColor === "#BFDBFE"
                      ? "#3B82F6"
                      : selectedColor === "#FBCFE8"
                      ? "#EC4899"
                      : "#A855F7",
                }}
              />
              <span className="text-sm text-slate-700">형광펜</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-10">
                <p className="text-xs text-slate-500 mb-2">색상 선택</p>
                <div className="flex gap-2">
                  {highlightColors.map((item) => (
                    <button
                      key={item.color}
                      onClick={() => {
                        setSelectedColor(item.color);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-md transition-all hover:scale-110 ${
                        selectedColor === item.color
                          ? "ring-2 ring-indigo-500 ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 hover:bg-slate-100 rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 min-w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 hover:bg-slate-100 rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100">
        {pdfUrl ? (
          <div
            className="max-w-5xl mx-auto p-6 flex justify-center"
            onMouseUp={handleTextSelection}
          >
            {pdfError ? (
              <div className="w-full max-w-lg rounded-lg bg-white p-6 text-center text-sm text-red-600 shadow">
                {pdfError}
              </div>
            ) : (
              <Document
                file={pdfUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={
                  <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-600 shadow">
                    PDF를 불러오는 중입니다...
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={zoom / 100}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </Document>
            )}
          </div>
        ) : (
          <div className="p-8">
            <div
              className="max-w-4xl mx-auto bg-white shadow-lg p-12 select-text"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
              onMouseUp={handleTextSelection}
            >
              <div className="prose prose-slate max-w-none">
                {fallbackParagraphs.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    PDF가 연결되지 않은 논문입니다. 텍스트 내용이 제공되면
                    여기에서 확인할 수 있어요.
                  </p>
                ) : (
                  getHighlightedContent()
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Highlight Counter */}
      {highlights.length > 0 && (
        <div className="bg-white border-t border-slate-200 px-4 py-2">
          <p className="text-sm text-slate-600">
            총{" "}
            <span className="text-indigo-600">{highlights.length}개</span>의
            하이라이트 (현재 페이지:{" "}
            {
              highlights.filter((h) => h.pageNumber === currentPage)
                .length
            }
            개)
          </p>
        </div>
      )}
    </div>
  );
}
