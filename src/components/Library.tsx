import { ArrowRight } from "lucide-react";
import type { Paper } from "../types/";

interface LibraryProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  isSidebarOpen: boolean;
}

export function Library({
  papers,
  onSelectPaper,
}: LibraryProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-slate-900 mb-6 text-xl font-medium">
            논문, 같이 공부해요! 자료만 있다면 얼마든 가능해요!
          </h1>

          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8">
            <input
              type="text"
              placeholder="PDF 파일을 업로드하세요."
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-slate-600"
            />
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2">
              <span>분석하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-left">
            <p className="text-slate-500 mb-3">
              또는 샘플 논문으로 시작해보세요:
            </p>
            <div className="space-y-2">
              {papers.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => onSelectPaper(paper)}
                  className="w-full text-left p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                >
                  <h3 className="text-slate-800 mb-1">
                    {paper.title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {paper.authors.join(", ")} ·{" "}
                    {paper.publishedDate}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}