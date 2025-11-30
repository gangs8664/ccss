// src/components/MainSidebar.tsx
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderPlus,
  Trash2,
  Edit,
  Check,
  X,
  Settings,
  User,
  LogOut,
  ArrowLeftRight,
  FileText,
} from "lucide-react";

import type { Paper } from "../types";
import { movePaper, deletePaper } from "../services/paperApi";

interface Collection {
  id: string;
  name: string;
  is_default: boolean;
}

interface MainSidebarProps {
  collections: Collection[];
  selectedCollectionId: string | null;

  onSelectCollection: (id: string) => void;
  onCreateCollection: () => void;
  onRenameCollection: (id: string, name: string) => void;
  onDeleteCollection: (id: string) => void;

  papers: Paper[];
  selectedPaperId: string | null;
  onSelectPaper: (paper: Paper) => void;

  onLogoClick: () => void;
  onNewChat: () => void;
  onLogout: () => void;

  onPaperChanged: () => void; // 논문 이동/삭제/업로드 후 목록 새로고침

  isOpen: boolean;
  onToggle: () => void;

  userName?: string;
}

export function MainSidebar({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
  papers,
  selectedPaperId,
  onSelectPaper,
  onLogoClick,
  onNewChat,
  onLogout,
  onPaperChanged,
  isOpen,
  onToggle,
  userName,
}: MainSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  return (
    <div
      className={`bg-white border-r border-slate-200 flex flex-col h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {isOpen ? (
          <>
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2 text-slate-700"
            >
              <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-lg">
                척
              </div>
              <span className="font-medium">척척석사</span>
            </button>

            <button onClick={onToggle}>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogoClick}
              className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-lg"
            >
              척
            </button>
            <button onClick={onToggle}>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </>
        )}
      </div>

      {/* Body */}
      {/* 🔥 overflow-hidden 제거해서 드롭다운이 밖으로 나올 수 있게 함 */}
      <div className="flex-1 flex flex-col">
        {/* 컬렉션 목록 */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">컬렉션</span>
              <button onClick={onCreateCollection}>
                <FolderPlus className="w-4 h-4 text-indigo-500" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {collections.map((c) => {
                const isEditing = editingId === c.id;

                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg ${
                      selectedCollectionId === c.id
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {isEditing ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 text-sm border px-1 py-0.5 rounded"
                      />
                    ) : (
                      <button
                        className="flex items-center gap-2 flex-1 text-left"
                        onClick={() => onSelectCollection(c.id)}
                      >
                        <Folder className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700 truncate">
                          {c.name}
                        </span>
                      </button>
                    )}

                    <div className="flex gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              onRenameCollection(c.id, editingName);
                              setEditingId(null);
                            }}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                          <button onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      ) : (
                        <>
                          {!c.is_default && (
                            <button
                              onClick={() => {
                                setEditingId(c.id);
                                setEditingName(c.name);
                              }}
                            >
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                          {!c.is_default && (
                            <button onClick={() => onDeleteCollection(c.id)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 선택된 컬렉션의 논문 목록 */}
        {isOpen && (
          <div className="px-4 py-3 overflow-y-auto">
            <p className="text-slate-500 text-sm mb-2">논문 목록</p>

            <div className="flex flex-col gap-1">
              {papers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50"
                >
                  {/* 논문 제목 */}
                  <button
                    className="flex items-center gap-2 flex-1 text-left overflow-hidden"
                    onClick={() => onSelectPaper(p)}
                  >
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 truncate max-w-[150px]">
                      {p.title}
                    </span>
                  </button>

                  {/* 아이콘 영역 */}
                  <div className="flex gap-1 flex-shrink-0">
                    {/* 컬렉션 이동 */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-slate-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                      </button>

                      {/* 🔥 왼쪽으로 펼쳐지는 드롭다운 + z-50, clipping 안 되게 */}
                      <div className="absolute left-0 top-7 z-50 hidden group-hover:block bg-white shadow-lg border rounded-lg py-1 w-40">
                        {collections
                          .filter((c) => c.id !== selectedCollectionId)
                          .map((c) => (
                            <button
                              key={c.id}
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await movePaper(p.id, c.id);
                                onPaperChanged();
                              }}
                            >
                              {c.name}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 논문 삭제 */}
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-red-50"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm("정말 삭제하시겠습니까?")) return;
                        await deletePaper(p.id);
                        onPaperChanged();
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-3 py-3 space-y-2">
        <button
          type="button"
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          {isOpen && <span>환경설정</span>}
        </button>

        <div
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-slate-700 text-sm ${
            isOpen ? "" : "justify-center"
          }`}
        >
          <User className="w-4 h-4 text-slate-500" />
          {isOpen && (
            <span className="truncate">
              {userName && userName.trim() ? userName : "테스트계정"}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-red-50 text-sm ${
            isOpen ? "justify-start text-red-600" : "justify-center text-red-600"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
}