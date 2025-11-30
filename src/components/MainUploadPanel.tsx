// src/components/MainUploadPanel.tsx
import { useState } from "react";
import { api } from "../services/api";

export function MainUploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [message, setMessage] = useState("");

  // ------------------------------
  // ① 파일 선택
  // ------------------------------
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setMessage("");
  };

  // ------------------------------
  // ② 업로드 (POST /papers)
  // ------------------------------
  const handleUpload = async () => {
    if (!file) {
      setMessage("파일을 선택해주세요.");
      return;
    }

    try {
      setUploading(true);
      setMessage("PDF 업로드 중...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/v1/papers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newId = res.data.id;
      setPaperId(newId);

      setMessage(`업로드 완료! paper_id = ${newId}`);
    } catch (err) {
      console.error(err);
      setMessage("업로드 실패!");
    } finally {
      setUploading(false);
    }
  };

  // ------------------------------
  // ③ 분석 (POST /papers/{id}/analyze)
  // ------------------------------
  const handleAnalyze = async () => {
    if (!paperId) {
      setMessage("먼저 PDF를 업로드해주세요.");
      return;
    }

    try {
      setAnalyzing(true);
      setMessage("분석 중입니다...");

      await api.post(`/api/v1/papers/${paperId}/analyze`);

      setMessage("분석 요청 완료! (AI 서버로 전달됨)");
    } catch (err) {
      console.error(err);
      setMessage("분석 요청 실패!");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-6 border rounded-xl bg-white shadow-sm w-full max-w-xl">

      {/* 파일 선택 */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleSelectFile}
        className="border p-2 rounded-lg w-full"
      />

      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        {uploading ? "업로드 중..." : "PDF 업로드"}
      </button>

      {/* 분석 버튼 */}
      <button
        onClick={handleAnalyze}
        disabled={!paperId || analyzing}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        {analyzing ? "분석 중..." : "분석하기"}
      </button>

      {/* 상태 메시지 */}
      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </div>
  );
}