import { useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import type { Paper } from "../types";
import { api } from "../services/api";

interface LibraryProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  isSidebarOpen: boolean;
  selectedCollectionId: string | null;
  refreshPapers: () => void;
}

export function Library({
  papers,
  onSelectPaper,
  selectedCollectionId,
  refreshPapers,
}: LibraryProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  /* -----------------------------
   * 파일 선택
   * ----------------------------- */
  const handleClickFakeInput = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setPaperId(null);
  };

  /* -----------------------------
   * 파일 업로드
   * ----------------------------- */
  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    if (!selectedCollectionId)
      return alert("왼쪽 컬렉션을 먼저 선택해주세요.");

    setUploading(true);

    try {
      const formData = new FormData();
      const title = file.name.replace(/\.[^/.]+$/, "");

      formData.append("collection_id", selectedCollectionId);
      formData.append("title", title);
      formData.append("file", file);

      const res = await api.post("/api/v1/papers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPaperId = res.data.id;
      setPaperId(newPaperId);

      // 🔥 업로드 후 사이드바 새로고침
      await refreshPapers();

      // 입력된 파일 UI 초기화
      setFile(null);

      // file input 내부 값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("PDF 업로드 완료!");
    } catch (err) {
      console.error(err);
      alert("업로드 실패!");
    } finally {
      setUploading(false);
    }
  };

  /* -----------------------------
   * 분석 요청
   * ----------------------------- */
  const handleAnalyze = async () => {
    if (!paperId) return alert("먼저 PDF를 업로드해주세요.");

    setAnalyzing(true);
    try {
      await api.post(`/api/v1/papers/${paperId}/analyze`);
      alert("분석 요청 완료!");
    } catch (err) {
      console.error(err);
      alert("분석 실패!");
    } finally {
      setAnalyzing(false);
    }
  };

  /* -----------------------------
   * 파일 제거 (X 버튼)
   * ----------------------------- */
  const clearSelectedFile = () => {
    setFile(null);
    setPaperId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-slate-900 mb-6 text-xl font-medium">
            논문, 같이 공부해요! 자료만 있다면 얼마든 가능해요!
          </h1>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">

            {/* 숨겨진 실제 파일 input */}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleSelectFile}
              className="hidden"
            />

            {/* 표시 UI */}
            <div
              className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-300 cursor-pointer relative"
              onClick={handleClickFakeInput}
            >
              <input
                type="text"
                readOnly
                value={file ? file.name : ""}
                placeholder="이곳을 눌러 PDF 파일을 업로드하세요."
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-slate-600 cursor-pointer"
              />

              {/* 🔥 X 버튼 (파일 제거) */}
              {file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedFile();
                  }}
                  className="p-1 rounded hover:bg-slate-200"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {/* 업로드 / 분석 */}
            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-indigo-500 text-white px-6 py-2 rounded-xl disabled:opacity-50"
              >
                {uploading ? "업로드 중..." : "PDF 업로드"}
              </button>

              <button
                onClick={handleAnalyze}
                disabled={!paperId || analyzing}
                className="bg-purple-500 text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzing ? "분석 중..." : "분석하기"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}