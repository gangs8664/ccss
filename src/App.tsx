// App.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { Login } from "./components/Login";
import { LoginCallback } from "./components/LoginCallback";

import { MainSidebar } from "./components/MainSidebar";
import { Library } from "./components/Library";

import { api } from "./services/api";
import {
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "./services/collectionApi";
import { fetchPapersByCollection } from "./services/paperApi";

import type { Paper, ViewType } from "./types";

interface Collection {
  id: string;
  name: string;
  is_default: boolean;
}

export default function App() {
  const navigate = useNavigate();

  // ============ AUTH STATE ============
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/main");
  };

  // 최초 실행: 토큰 검증
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsLoggedIn(false);
      setAuthChecked(true);
      return;
    }

    api
      .get("/api/v1/auth/me")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  // ============ COLLECTION + PAPER STATE ============
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!authChecked || !isLoggedIn) return;

    fetchCollections()
      .then((data) => {
        setCollections(data);
        const def = data.find((c) => c.is_default);
        setSelectedCollectionId(def?.id ?? data[0]?.id ?? null);
      })
      .catch((err) => console.error("컬렉션 조회 실패:", err));
  }, [authChecked, isLoggedIn]);

  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    if (!selectedCollectionId) return;
    fetchPapersByCollection(selectedCollectionId)
      .then((data) => setPapers(data))
      .catch(() => setPapers([]));
  }, [selectedCollectionId]);

  // 🔄 현재 선택된 컬렉션의 논문 목록 다시 불러오기
  const refreshPapers = async () => {
    if (!selectedCollectionId) return;
    try {
      const data = await fetchPapersByCollection(selectedCollectionId);
      setPapers(data);
    } catch (err) {
      console.error("논문 새로고침 실패:", err);
    }
  };

  const handleCreateCollection = async () => {
    const name = prompt("새 컬렉션 이름을 입력하세요");
    if (!name) return;
    const newCol = await createCollection(name);
    setCollections((prev) => [...prev, newCol]);
  };

  const handleRenameCollection = async (id: string, newName: string) => {
    const updated = await updateCollection(id, newName);
    setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));

    if (selectedCollectionId === id) {
      const def = collections.find((c) => c.is_default);
      setSelectedCollectionId(def?.id ?? null);
    }
  };

  // ============ OTHER UI STATE ============
  const [view, setView] = useState<ViewType>("library");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ============ AUTH CHECK BEFORE RENDER ============
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // ============ ROUTING STRUCTURE (최종 return 오직 1개) ============
  return (
    <Routes>
      {/* 소셜 로그인 콜백 */}
      <Route
        path="/auth/callback"
        element={<LoginCallback onLogin={handleLogin} />}
      />

      {!isLoggedIn ? (
        <>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route
            path="/main"
            element={
              <div className="h-screen flex overflow-hidden">
                <MainSidebar
                  collections={collections}
                  selectedCollectionId={selectedCollectionId}
                  onSelectCollection={setSelectedCollectionId}
                  onCreateCollection={handleCreateCollection}
                  onRenameCollection={handleRenameCollection}
                  onDeleteCollection={handleDeleteCollection}
                  papers={papers}
                  selectedPaperId={null}
                  onSelectPaper={() => {}}
                  onLogoClick={() => setView("library")}
                  onNewChat={() => {}}
                  onLogout={handleLogout}
                  isOpen={isSidebarOpen}
                  onToggle={() => setIsSidebarOpen((prev) => !prev)}
                  onPaperChanged={refreshPapers}
                />

                <main className="flex-1 overflow-hidden">
                  <Library
                    papers={papers}
                    onSelectPaper={() => {}}
                    isSidebarOpen={isSidebarOpen}
                    selectedCollectionId={selectedCollectionId}
                    refreshPapers={refreshPapers}
                  />
                </main>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </>
      )}
    </Routes>
  );
}