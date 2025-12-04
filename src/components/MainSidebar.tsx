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

import { PortalDropdown } from "./PortalDropdown";
import { movePaper, deletePaper } from "../services/paperApi";
import type { Paper } from "../types";

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

  onPaperChanged: () => void;

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
  onSelectPaper,
  onLogout,
  onPaperChanged,
  isOpen,
  onToggle,
  userName,
}: MainSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  /** 현재 열려있는 드롭다운에 해당하는 논문 ID */
  const [dropdownPaperId, setDropdownPaperId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  /** 이동 버튼 클릭 → 드롭다운 열기 */
  const openDropdown = (e: React.MouseEvent<HTMLButtonElement>, paperId: string) => {
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dropdownHeight = 200; // 예상 항목 높이
    const spaceBelow = window.innerHeight - rect.bottom;

    const top =
      spaceBelow < dropdownHeight
        ? rect.top - dropdownHeight - 8
        : rect.bottom + 8;

    setDropdownPaperId(paperId);
    setDropdownPos({ top, left: rect.left });
  };

  const closeDropdown = () => setDropdownPaperId(null);

  return (
    <div
      className={`bg-white border-r border-slate-200 flex flex-col h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-lg">
                
              </div>
              <span className="font-medium">척척석사</span>
            </div>

            <button onClick={onToggle}>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-lg">
              
            </div>
            <button onClick={onToggle}>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* 컬렉션 목록 */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-slate-200">
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
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditingName(c.name);
                                }}
                              >
                                <Edit className="w-4 h-4 text-slate-400" />
                              </button>
                              <button onClick={() => onDeleteCollection(c.id)}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </>
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

        {/* 논문 목록 */}
        {isOpen && (
          <div className="px-4 py-3">
            <p className="text-slate-500 text-sm mb-2">선택한 컬렉션의 논문 목록</p>

            {papers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 h-10"
              >
                {/* 좌측: 아이콘 + 제목 */}
                <button
                  className="flex items-center gap-2 flex-1 min-w-0 text-left overflow-hidden"
                  onClick={() => onSelectPaper(p)}
                >
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />

                  <span className="text-sm text-slate-700 truncate block max-w-full">
                    {p.title}
                  </span>
                </button>

                {/* 우측 버튼들 */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => openDropdown(e, p.id)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 삭제 */}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm("정말 삭제하시겠습니까?")) return;
                      await deletePaper(p.id);
                      onPaperChanged();
                    }}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200 px-3 py-3 space-y-2">
        <div className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm text-slate-700">
          <User className="w-4 h-4 text-slate-500" />
          {isOpen && (
            <span className="truncate">{userName ?? "테스트계정"}</span>
          )}
        </div>
        
        <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700">
          <Settings className="w-4 h-4 text-slate-500" />
          {isOpen && <span>환경설정</span>}
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-red-50 text-sm text-red-600"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>로그아웃</span>}
        </button>
      </div>

      {/* 🔥 Portal Dropdown: 절대 안 잘리는 이동 메뉴 */}
      {dropdownPaperId && (
        <PortalDropdown position={dropdownPos} onClose={closeDropdown}>
          {collections
            .filter((c) => c.id !== selectedCollectionId)
            .map((c) => (
              <button
                key={c.id}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                onClick={async () => {
                  await movePaper(dropdownPaperId, c.id);
                  closeDropdown();
                  onPaperChanged();
                }}
              >
                {c.name}
              </button>
            ))}
        </PortalDropdown>
      )}
    </div>
  );
}