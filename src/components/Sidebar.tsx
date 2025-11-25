import { useState } from 'react';
import { ArrowLeft, Highlighter, Trash2, StickyNote, X } from 'lucide-react';
import type { Highlight } from '../types/';

interface SidebarProps {
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
  onUpdateHighlight: (id: string, note: string) => void;
  onBackToLibrary: () => void;
  paperTitle: string;
}

export function Sidebar({ highlights, onDeleteHighlight, onUpdateHighlight, onBackToLibrary, paperTitle }: SidebarProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleStartEdit = (highlight: Highlight) => {
    setEditingNote(highlight.id);
    setNoteText(highlight.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateHighlight(id, noteText);
    setEditingNote(null);
    setNoteText('');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteText('');
  };

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-indigo-200 flex flex-col h-screen">
      <div className="p-6 border-b border-indigo-200">
        <button
          onClick={onBackToLibrary}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>라이브러리로 돌아가기</span>
        </button>
        <h2 className="text-indigo-900 line-clamp-2">{paperTitle}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-2 mb-4">
          <Highlighter className="w-5 h-5 text-indigo-600" />
          <h3 className="text-indigo-900">하이라이트</h3>
          <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {highlights.length}
          </span>
        </div>

        {highlights.length === 0 ? (
          <div className="text-center py-12">
            <Highlighter className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <p className="text-indigo-400">
              텍스트를 선택하고<br />하이라이트를 추가하세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: highlight.color }}
                  />
                  <p className="flex-1 text-slate-700 line-clamp-3">
                    "{highlight.text}"
                  </p>
                  <button
                    onClick={() => onDeleteHighlight(highlight.id)}
                    className="text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {editingNote === highlight.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="메모를 입력하세요..."
                      className="w-full p-2 border border-indigo-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveNote(highlight.id)}
                        className="flex-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {highlight.note ? (
                      <div
                        onClick={() => handleStartEdit(highlight)}
                        className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <StickyNote className="w-3 h-3 text-amber-600" />
                          <span className="text-amber-700">메모</span>
                        </div>
                        <p className="text-slate-600">{highlight.note}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(highlight)}
                        className="mt-2 w-full p-2 border border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <StickyNote className="w-4 h-4" />
                        <span>메모 추가</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
