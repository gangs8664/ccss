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
  onAnalyzePaper?: (paperId: string) => Promise<boolean> | boolean;
}

export function Library({
  papers,
  onSelectPaper,
  selectedCollectionId,
  refreshPapers,
  onAnalyzePaper,
}: LibraryProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleClickFakeInput = () => fileInputRef.current?.click();
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setPaperId(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");
    if (!selectedCollectionId) return alert("왼쪽 컬렉션을 먼저 선택해주세요.");

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

      await refreshPapers();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      alert("PDF 업로드 완료!");
    } catch (err) {
      console.error(err);
      alert("업로드 실패!");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!paperId) return alert("먼저 PDF를 업로드해주세요.");
    setAnalyzing(true);

    try {
      let success = true;
      if (onAnalyzePaper) {
        success = !!(await onAnalyzePaper(paperId));
      } else {
        await api.post(`/api/v1/papers/${paperId}/analyze`);
        success = true;
      }
      if (!success) return;
      alert("분석이 완료되었습니다!");
    } catch (err) {
      console.error(err);
      alert("분석 실패!");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    setPaperId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">

          {/* 제목 */}
          <h1 className="text-slate-800 mb-8 text-2xl font-semibold tracking-tight">
            논문, 같이 공부해요! 자료만 있다면 얼마든 가능해요!
          </h1>

          {/* 메인 카드 */}
          <div
            className="
            bg-white shadow-xl rounded-3xl p-10
            border border-slate-200 
            "
          >
            {/* 실제 업로드 input */}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleSelectFile}
              className="hidden"
            />

            {/* 파일 선택 UI */}
            <div
              onClick={handleClickFakeInput}
              className="
              flex items-center gap-3 
              bg-slate-100 border border-slate-300
              rounded-xl p-4 cursor-pointer
              hover:bg-slate-200 transition
              "
            >
              <input
                type="text"
                readOnly
                value={file ? file.name : ""}
                placeholder="이곳을 눌러 PDF 파일을 업로드하세요."
                className="flex-1 px-2 py-1 bg-transparent focus:outline-none text-slate-600"
              />

              {file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelectedFile();
                  }}
                  className="p-1 rounded hover:bg-slate-300"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col space-y-4 mt-8">

              {/* 업로드 버튼 */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="
                w-full py-3 rounded-xl font-medium
                bg-indigo-500 text-white
                shadow hover:bg-indigo-600
                transition disabled:opacity-50
                "
              >
                {uploading ? "업로드 중..." : "PDF 업로드"}
              </button>

              {/* 분석 버튼 */}
              <button
                onClick={handleAnalyze}
                disabled={!paperId || analyzing}
                className="
                w-full py-3 rounded-xl font-medium
                bg-purple-500 text-white
                flex items-center justify-center gap-2
                shadow hover:bg-purple-600
                transition disabled:opacity-50
                "
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
