import { Plus, Search, FileText, Settings, User, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Paper } from '../types/';

interface MainSidebarProps {
  papers: Paper[];
  selectedPaperId: string | null;
  onSelectPaper: (paper: Paper) => void;
  onNewChat: () => void;
  onLogoClick: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function MainSidebar({
  papers,
  selectedPaperId,
  onSelectPaper,
  onNewChat,
  onLogoClick,
  isOpen,
  onToggle,
}: MainSidebarProps) {
  const recentPapers = papers.slice(0, 3);
  const olderPapers = papers.slice(3);

  return (
    <div className={`bg-white border-r border-slate-200 flex flex-col h-screen relative z-20 transition-all duration-300 flex-shrink-0 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className={`p-4 border-b border-slate-200 flex-shrink-0 ${!isOpen && 'flex flex-col items-center gap-3'}`}>
        {isOpen ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={onLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white"></span>
                </div>
                <span className="text-slate-800">척척석사</span>
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            
            <button
              onClick={onNewChat}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New chat</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogoClick}
              className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <span className="text-white">척</span>
            </button>
            <button
              onClick={onToggle}
              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </>
        )}
      </div>

      {/* Search */}
      {isOpen && (
        <div className="p-4 flex-shrink-0">
          <button className="w-full flex items-center justify-center p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {!isOpen && (
        <div className="p-4 flex-shrink-0">
          <button 
            onClick={onNewChat}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      )}

      {/* Paper List - 스크롤 가능, 풋터 공간 확보 */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto min-h-0 pb-2">
          {/* Past Papers */}
          <div className="px-4 pb-4 pt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-sm">Past Papers</h3>
              <button className="text-indigo-500 text-sm hover:text-indigo-600">Clear All</button>
            </div>
            
            <div className="space-y-1">
              {recentPapers.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => onSelectPaper(paper)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                    selectedPaperId === paper.id
                      ? 'bg-slate-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 text-sm truncate">{paper.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Last 3 Days */}
          {olderPapers.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-slate-500 text-sm mb-2">Last 3 Days</h3>
              <div className="space-y-1">
                {olderPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <button
                      onClick={() => onSelectPaper(paper)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 text-sm truncate">{paper.title}</span>
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all">
                      <Trash2 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer - 항상 하단 고정 */}
      {isOpen ? (
        <div className="border-t border-slate-200 flex-shrink-0 bg-white mt-auto">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 text-sm">환경설정</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 text-sm">테스트계정</span>
          </button>
        </div>
      ) : (
        <div className="border-t border-slate-200 flex-shrink-0 bg-white mt-auto">
          <button className="w-full flex items-center justify-center p-4 hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
          <button className="w-full flex items-center justify-center p-4 hover:bg-slate-50 transition-colors">
            <User className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
}
