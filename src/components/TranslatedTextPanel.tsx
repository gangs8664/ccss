import { useState } from 'react';

interface TranslatedTextPanelProps {
  content: string;
  editable?: boolean;
  onContentChange?: (content: string) => void;
  title?: string;
}

export function TranslatedTextPanel({ content, editable = false, onContentChange, title = '번역된 내용' }: TranslatedTextPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    if (onContentChange) {
      onContentChange(editedContent);
    }
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        ) : (
          <div className="prose prose-slate max-w-none">
            {editedContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
      
      {editable && (
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-2 flex-shrink-0 bg-slate-50">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(content);
                }}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
            >
              수정
            </button>
          )}
        </div>
      )}
    </div>
  );
}