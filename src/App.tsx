// // App.tsx
// import { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

// import { Login } from "./components/Login";
// import { LoginCallback } from "./components/LoginCallback";

// import { MainSidebar } from "./components/MainSidebar";
// import { Library } from "./components/Library";

// import { api } from "./services/api";
// import { NewModal } from "./components/NewModal";

// import type { ChatMessage } from "./components/Chatbot";

// import { FirstPass } from "./components/FirstPass";
// import { SecondPass } from "./components/SecondPass";
// import { ThirdPass } from "./components/ThirdPass";

// import {
//   analyzePaper,
//   fetchPapersByCollection,
// } from "./services/paperApi";

// import {
//   fetchCollections,
//   createCollection,
//   updateCollection,
//   deleteCollection,
// } from "./services/collectionApi";

// import type { Paper } from "./types";
// import type { UnifiedNotesData } from "./components/UnifiedNotes";

// interface Collection {
//   id: string;
//   name: string;
//   is_default: boolean;
// }

// // 0000000000000000000000000
// interface Collection {
//   id: string;
//   name: string;
//   is_default: boolean;
// }

// // Pass별 서버 분석 결과 저장 (first_pass 텍스트)
// const [firstPassMap, setFirstPassMap] = useState<Record<string, string>>({});

// /* ============================================================
//  * Pass 공통으로 쓰일 UnifiedNotes 기본값
//  * ============================================================ */
// const EMPTY_UNIFIED_NOTES: UnifiedNotesData = {
//   quickNotes: JSON.stringify({
//     category: "",
//     context: "",
//     correctness: "",
//     contributions: "",
//     clarity: "",
//   }),
//   detailedNotes: "",
//   finalReview: "",
// };

// /* ============================================================
//  * FirstPass / SecondPass / ThirdPass 페이지 래퍼
//  *  - paperId는 URL에서 가져오고
//  *  - paper / unifiedNotes 를 props로 넘겨주는 역할만 담당
//  * ============================================================ */

// type NotesMap = Record<string, UnifiedNotesData>;

// interface PassPageCommonProps {
//   papers: Paper[];
//   notesMap: NotesMap;
//   firstPassMap: Record<string, string>;
//   onUpdateNotes: (paperId: string, notes: UnifiedNotesData) => void;
// }

// /** FirstPass 래퍼 */
// function FirstPassPageWrapper({
//   papers,
//   notesMap,
//   firstPassMap,
//   onUpdateNotes,
// }: PassPageCommonProps) {
//   const { paperId } = useParams<{ paperId: string }>();
//   const navigate = useNavigate();

//   if (!paperId) return <div>잘못된 접근입니다. (paperId 없음)</div>;

//   const paper = papers.find((p) => p.id === paperId);

//   const safePaper = paper ?? {
//     id: paperId,
//     title: "",
//     content: "",
//     translatedContent: "",
//     analysis_stage: "first_pass",
//   };

//   const [firstPassTextMap, setFirstPassTextMap] = useState<Record<string, string>>({});

//   const firstPassRaw = firstPassMap[paperId] ?? ""; // ← 서버에서 받은 first_pass 텍스트

//   const unifiedNotes = notesMap[paperId] ?? EMPTY_UNIFIED_NOTES;

//   return (
//     <div className="h-screen overflow-hidden">
//       <FirstPass
//         paper={safePaper}
//         rawFirstPassText={firstPassRaw}       
//         initialData={null}
//         chatMessages={[]}
//         onSendChatMessage={() => {}}
//         isChatLoading={false}
//         unifiedNotes={unifiedNotes}
//         onUpdateNotes={(updated) => onUpdateNotes(paperId, updated)}
//         onNext={() => navigate(`/papers/${paperId}/secondpass`)}
//       />
//     </div>
//   );
// }

// /** SecondPass 래퍼 */
// function SecondPassPageWrapper({
//   papers,
//   notesMap,
//   onUpdateNotes,
// }: PassPageCommonProps) {
//   const { paperId } = useParams<{ paperId: string }>();
//   const navigate = useNavigate();

//   if (!paperId) return <div>잘못된 접근입니다. (paperId 없음)</div>;

//   const paper = papers.find((p) => p.id === paperId);
//   const safePaper = paper ?? {
//     id: paperId,
//     title: "",
//     content: "",
//     translatedContent: "",
//     analysis_stage: "second_pass",
//   };

//   const unifiedNotes = notesMap[paperId] ?? EMPTY_UNIFIED_NOTES;

//   const handleUpdateNotes = (updated: UnifiedNotesData) => {
//     onUpdateNotes(paperId, updated);
//   };

//   return (
//     <div className="h-screen overflow-hidden">
//       <SecondPass
//         paper={safePaper}
//         initialData={null}
//         chatMessages={[]}
//         onSendChatMessage={() => {}}
//         isChatLoading={false}
//         unifiedNotes={unifiedNotes}
//         onUpdateNotes={handleUpdateNotes}
//         onSave={() => {
//           /* 필요하면 두 번째 Pass 결과를 App에 캐싱 */
//         }}
//         onSaveAndExit={() => navigate("/main")}
//         onNext={() => navigate(`/papers/${paperId}/thirdpass`)}
//       />
//     </div>
//   );
// }

// /** ThirdPass 래퍼 */
// function ThirdPassPageWrapper({
//   papers,
//   notesMap,
//   onUpdateNotes,
// }: PassPageCommonProps) {
//   const { paperId } = useParams<{ paperId: string }>();
//   const navigate = useNavigate();

//   if (!paperId) return <div>잘못된 접근입니다. (paperId 없음)</div>;

//   const paper = papers.find((p) => p.id === paperId);

//   const safePaper = paper ?? {
//     id: paperId,
//     title: "",
//     content: "",
//     translatedContent: "",
//     analysis_stage: "third_pass",
//   };

//   const unifiedNotes = notesMap[paperId] ?? EMPTY_UNIFIED_NOTES;

//   const handleUpdateNotes = (updated: UnifiedNotesData) => {
//     onUpdateNotes(paperId, updated);
//   };

//   if (!paper) return <div>존재하지 않는 논문입니다.</div>;

//   return (
//     <div className="h-screen overflow-hidden">
//       <ThirdPass
//         paper={safePaper}
//         initialData={null}
//         chatMessages={[]}
//         onSendChatMessage={() => {}}
//         isChatLoading={false}
//         unifiedNotes={unifiedNotes}
//         onUpdateNotes={handleUpdateNotes}
//         onSaved={() => {
//           // 최종 저장 후 메인으로 돌려보내기
//           navigate("/main");
//         }}
//       />
//     </div>
//   );
// }



// // 000000000000000000000000000



// export default function App() {
//   const navigate = useNavigate();

//   /* ============================================================
//    * AUTH
//    * ============================================================ */
//   const [authChecked, setAuthChecked] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [analyzingPaperId, setAnalyzingPaperId] = useState<string | null>(null);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//     navigate("/main");
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setIsLoggedIn(false);
//       setAuthChecked(true);
//       return;
//     }

//     api
//       .get("/api/v1/auth/me")
//       .then(() => setIsLoggedIn(true))
//       .catch(() => setIsLoggedIn(false))
//       .finally(() => setAuthChecked(true));
//   }, []);

//   /* ============================================================
//    * COLLECTION & PAPER STATE
//    * ============================================================ */
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [selectedCollectionId, setSelectedCollectionId] =
//     useState<string | null>(null);

//   useEffect(() => {
//     if (!authChecked || !isLoggedIn) return;

//     fetchCollections()
//       .then((data) => {
//         setCollections(data);
//         const def = data.find((c) => c.is_default);
//         setSelectedCollectionId(def?.id ?? data[0]?.id ?? null);
//       })
//       .catch((err) => console.error("컬렉션 조회 실패:", err));
//   }, [authChecked, isLoggedIn]);

//   const [papers, setPapers] = useState<Paper[]>([]);

//   /* ============================================================
//    * Pass 공통 노트 상태 (paperId → UnifiedNotesData)
//    * ============================================================ */
//   const [unifiedNotesMap, setUnifiedNotesMap] = useState<NotesMap>({});

//   const handleUpdateUnifiedNotes = (paperId: string, notes: UnifiedNotesData) => {
//     setUnifiedNotesMap((prev) => ({
//       ...prev,
//       [paperId]: notes,
//     }));
//   };

//   useEffect(() => {
//     if (!selectedCollectionId) return;

//     fetchPapersByCollection(selectedCollectionId)
//       .then((data) => setPapers(data))
//       .catch(() => setPapers([]));
//   }, [selectedCollectionId]);

//   const refreshPapers = async () => {
//     if (!selectedCollectionId) return;
//     const data = await fetchPapersByCollection(selectedCollectionId);
//     setPapers(data);
//   };

//   /* ============================================================
//    * COLLECTION HANDLERS
//    * ============================================================ */
//   const handleCreateCollection = async () => {
//     const name = prompt("새 컬렉션 이름을 입력하세요");
//     if (!name) return;
//     const newCol = await createCollection(name);
//     setCollections((prev) => [...prev, newCol]);
//   };

//   const handleRenameCollection = async (id: string, newName: string) => {
//     const updated = await updateCollection(id, newName);
//     setCollections((prev) =>
//       prev.map((c) => (c.id === id ? updated : c))
//     );
//   };

//   const handleDeleteCollection = async (id: string) => {
//     await deleteCollection(id);
//     setCollections((prev) => prev.filter((c) => c.id !== id));

//     if (selectedCollectionId === id) {
//       const def = collections.find((c) => c.is_default);
//       setSelectedCollectionId(def?.id ?? null);
//     }
//   };

//   /* ============================================================
//    * PAPER CLICK / MODAL
//    * ============================================================ */
//   const [activePaper, setActivePaper] = useState<Paper | null>(null);
//   const [modalType, setModalType] = useState<
//     "none" | "analyze" | "learn"
//   >("none");

//   const handleSidebarPaperClick = (paper: Paper) => {
//     setActivePaper(paper);

//     if (!paper.analysis_stage || paper.analysis_stage === "not_started") {
//       setModalType("analyze");
//     } else {
//       setModalType("learn");
//     }
//   };

//   /* ============================================================
//    * 분석 시작 핸들러
//    * ============================================================ */
//   const [loading, setLoading] = useState(false);

//   // const handleStartAnalyze = async (dontAskAgain: boolean) => {
//   //   if (!activePaper) return;

//   //   try {
//   //     setAnalyzingPaperId(activePaper.id);

//   //     await analyzePaper(activePaper.id);

//   //     updatePaperStage(activePaper.id, "first_pass");

//   //     setModalType("none");

//   //     navigate(`/papers/${activePaper.id}/firstpass`);

//   //   } catch (err) {
//   //     alert("분석 실패했습니다. 다시 시도해주세요.");
//   //   } finally {
//   //     setAnalyzingPaperId(null);
//   //   }
//   // };

//   const handleStartAnalyze = async () => {
//     if (!activePaper) return;

//     setAnalyzingPaperId(activePaper.id);

//     try {
//       // 1) 실서버 분석 호출
//       const result = await analyzePaper(activePaper.id);

//       console.log("🔥 분석 완료:", result);

//       // 2) 서버에서 받은 first_pass 텍스트 저장
//       setFirstPassTextMap((prev) => ({
//         ...prev,
//         [activePaper.id]: result.first_pass ?? "",
//       }));

//       // 3) 분석 스테이지 업데이트
//       updatePaperStage(activePaper.id, "first_pass");

//       // 4) FirstPass 페이지로 이동
//       navigate(`/papers/${activePaper.id}/firstpass`);
//     } finally {
//       setAnalyzingPaperId(null);
//     }
//   };

//   const updatePaperStage = (paperId: string, stage: string) => {
//     setPapers((prev) =>
//       prev.map((p) =>
//         p.id === paperId ? { ...p, analysis_stage: stage } : p
//       )
//     );
//   };

//   /* ============================================================
//    * 학습 페이지 이동
//    * ============================================================ */
//   const goToFirstPass = () => {
//     if (!activePaper) return;
//     navigate(`/papers/${activePaper.id}/firstpass`);
//   };

//   /* ============================================================
//    * LOGOUT
//    * ============================================================ */
//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   if (!authChecked) return <div>Loading...</div>;
//   const nickname = localStorage.getItem("nickname") ?? "테스트계정";

//   /* ============================================================
//    * ROUTES
//    * ============================================================ */
//   return (
//     <Routes>
//       <Route
//         path="/auth/callback"
//         element={<LoginCallback onLogin={handleLogin} />}
//       />

//       {!isLoggedIn ? (
//         <>
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </>
//       ) : (
//         <>
//           <Route
//             path="/main"
//             element={
//               <div className="h-screen flex overflow-hidden">
//                 <MainSidebar
//                   collections={collections}
//                   selectedCollectionId={selectedCollectionId}
//                   onSelectCollection={setSelectedCollectionId}
//                   onCreateCollection={handleCreateCollection}
//                   onRenameCollection={handleRenameCollection}
//                   onDeleteCollection={handleDeleteCollection}
//                   papers={papers}
//                   selectedPaperId={null}
//                   onSelectPaper={handleSidebarPaperClick}
//                   onLogoClick={() => {}}
//                   onNewChat={() => {}}
//                   onLogout={handleLogout}
//                   isOpen={true}
//                   onToggle={() => {}}
//                   onPaperChanged={refreshPapers}
//                   userName={nickname}
//                 />

//                 <main className="flex-1 overflow-hidden">
//                   <Library
//                     papers={papers}
//                     onSelectPaper={() => {}}
//                     isSidebarOpen={true}
//                     selectedCollectionId={selectedCollectionId}
//                     refreshPapers={refreshPapers}
//                   />

//                   <NewModal
//                     open={modalType !== "none"}
//                     title={
//                       modalType === "analyze"
//                         ? "논문 분석을 시작할까요?"
//                         : "논문 학습을 시작할까요?"
//                     }
//                     description={
//                       modalType === "analyze"
//                         ? "이 논문은 아직 분석되지 않았어요. 분석을 시작할까요?"
//                         : "FirstPass를 시작합니다."
//                     }
//                     confirmLabel={
//                       modalType === "analyze"
//                         ? "분석 시작"
//                         : "학습 시작"
//                     }
//                     loading={loading}
//                     showDontAskAgain={true}
//                     onConfirm={(dontAskAgain) => {
//                       if (modalType === "analyze") handleStartAnalyze(dontAskAgain);
//                       else goToFirstPass();
//                     }}
//                     onCancel={() => setModalType("none")}
//                   />
//                 </main>
//               </div>
//             }
//           />

//           <Route path="*" element={<Navigate to="/main" replace />} />
//           {/* <Route
//             path="/papers/:paperId/firstpass"
//             element={<FirstPass />}
//           /> */}
          
//           <Route
//             path="/papers/:paperId/firstpass"
//             element={
//               <FirstPassPageWrapper
//                 papers={papers}
//                 notesMap={unifiedNotesMap}
//                 firstPassMap={firstPassMap}
//                 onUpdateNotes={handleUpdateUnifiedNotes}
//               />
//             }
//           />

//           <Route
//             path="/papers/:paperId/secondpass"
//             element={
//               <SecondPassPageWrapper
//                 papers={papers}
//                 notesMap={unifiedNotesMap}
//                 onUpdateNotes={handleUpdateUnifiedNotes}
//               />
//             }
//           />

//           <Route
//             path="/papers/:paperId/thirdpass"
//             element={
//               <ThirdPassPageWrapper
//                 papers={papers}
//                 notesMap={unifiedNotesMap}
//                 onUpdateNotes={handleUpdateUnifiedNotes}
//               />
//             }
//           />
          

//           {/* 실제 코드 */}
//           {/* <Route
//             path="/papers/:paperId/firstpass"
//             element={
//               <FirstPass
//                 paper={activePaper!}  
//                 onSave={() => {}}
//                 onNext={() => {}}
//                 initialData={null}
//                 chatMessages={[]}
//                 onSendChatMessage={() => {}}
//                 isChatLoading={false}
//                 unifiedNotes={{ summary: "", insights: "", questions: "" }}
//                 onUpdateNotes={() => {}}
//               />
//             }
//           /> */}
//         </>
//       )}
//     </Routes>
//   );
// }


// src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import { Login } from "./components/Login";
import { LoginCallback } from "./components/LoginCallback";
import { MainSidebar } from "./components/MainSidebar";
import { Library } from "./components/Library";
import { api } from "./services/api";
import { NewModal } from "./components/NewModal";

import { FirstPass } from "./components/FirstPass";
import { SecondPass } from "./components/SecondPass";
import { ThirdPass } from "./components/ThirdPass";

import {
  analyzePaper,
  fetchPapersByCollection,
  fetchSecondPassPages,
  fetchThirdPassSummary,
  fetchFirstPassSections,
} from "./services/paperApi";
import {
  fetchPaperNotes,
  updateFirstPassNotes,
  updateSecondPassNotes,
  updateThirdPassNotes,
  type FiveCNotesPayload,
  type PaperNoteRecord,
} from "./services/notesApi";

import {
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "./services/collectionApi";

import type {
  Paper,
  FirstPassData,
  SecondPassData,
  ThirdPassData,
} from "./types";
import type { UnifiedNotesData } from "./components/UnifiedNotes";
import { StudyReview } from "./components/StudyReview";
import type { ChatMessage } from "./components/Chatbot";
import { fetchChatHistory, sendChatMessage } from "./services/chatApi";


/* ---------------- 기본 값 ---------------- */
const EMPTY_FIVE_C: FiveCNotesPayload = {
  category: "",
  context: "",
  correctness: "",
  contributions: "",
  clarity: "",
};

const EMPTY_UNIFIED_NOTES: UnifiedNotesData = {
  quickNotes: JSON.stringify(EMPTY_FIVE_C),
  detailedNotes: "",
  finalReview: "",
};

const FIVE_C_KEYS: (keyof FiveCNotesPayload)[] = [
  "category",
  "context",
  "correctness",
  "contributions",
  "clarity",
];

const parseFiveCString = (value?: string | null): FiveCNotesPayload => {
  if (!value) return { ...EMPTY_FIVE_C };
  try {
    const parsed = JSON.parse(value);
    const next: FiveCNotesPayload = { ...EMPTY_FIVE_C };
    FIVE_C_KEYS.forEach((key) => {
      next[key] =
        typeof parsed?.[key] === "string" ? parsed[key] : EMPTY_FIVE_C[key];
    });
    return next;
  } catch {
    return { ...EMPTY_FIVE_C };
  }
};

const mapNotesToUnified = (
  records: PaperNoteRecord[] | undefined | null
): UnifiedNotesData => {
  const fiveC: FiveCNotesPayload = { ...EMPTY_FIVE_C };
  let detailed = "";
  let finalReview = "";

  const extractValue = (record: PaperNoteRecord) =>
    record.content ?? record.note ?? "";

  (records ?? []).forEach((record) => {
    if (record.pass_no === 1 && FIVE_C_KEYS.includes(record.slot as any)) {
      const key = record.slot as keyof FiveCNotesPayload;
      fiveC[key] = extractValue(record);
    } else if (record.pass_no === 2) {
      detailed = extractValue(record);
    } else if (record.pass_no === 3) {
      finalReview = extractValue(record);
    }
  });

  return {
    quickNotes: JSON.stringify(fiveC),
    detailedNotes: detailed,
    finalReview,
  };
};

const persistUnifiedNotes = async (
  paperId: string,
  prevNotes: UnifiedNotesData | undefined,
  nextNotes: UnifiedNotesData
) => {
  const tasks: Promise<unknown>[] = [];

  if (!prevNotes || prevNotes.quickNotes !== nextNotes.quickNotes) {
    tasks.push(updateFirstPassNotes(paperId, parseFiveCString(nextNotes.quickNotes)));
  }

  if (!prevNotes || prevNotes.detailedNotes !== nextNotes.detailedNotes) {
    tasks.push(updateSecondPassNotes(paperId, nextNotes.detailedNotes ?? ""));
  }

  if (!prevNotes || prevNotes.finalReview !== nextNotes.finalReview) {
    tasks.push(updateThirdPassNotes(paperId, nextNotes.finalReview ?? ""));
  }

  if (!tasks.length) return;

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.error("🟥 노트 저장 실패:", err);
  }
};

const mapChatHistoryToMessages = (
  records: Awaited<ReturnType<typeof fetchChatHistory>>
): ChatMessage[] => {
  if (!Array.isArray(records)) return [];
  return [...records]
    .sort(
      (a, b) =>
        new Date(a.created_at ?? 0).getTime() -
        new Date(b.created_at ?? 0).getTime()
    )
    .flatMap((record) => {
      const timestamp = new Date(record.created_at ?? Date.now());
      const entries: ChatMessage[] = [];
      const question = record.question?.trim();
      const answer = record.answer?.trim();
      if (question) {
        entries.push({
          id: `${record.question_id}-question`,
          role: "user",
          content: question,
          timestamp,
        });
      }
      if (answer) {
        entries.push({
          id: `${record.question_id}-answer`,
          role: "assistant",
          content: answer,
          timestamp,
        });
      }
      return entries;
    });
};

function usePaperChat(paperId?: string) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    setChatMessages([]);
    if (!paperId) return;

    let ignore = false;
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory(paperId);
        if (!ignore) {
          setChatMessages(mapChatHistoryToMessages(history));
        }
      } catch (err) {
        console.error("챗봇 히스토리 로드 실패:", err);
      }
    };
    loadHistory();
    return () => {
      ignore = true;
    };
  }, [paperId]);

  const handleSendChatMessage = useCallback(
    async (message: string) => {
      if (!paperId) return;
      const trimmed = message.trim();
      if (!trimmed || isChatLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
      setIsChatLoading(true);

      try {
        const response = await sendChatMessage(paperId, trimmed);
        const assistantMessage: ChatMessage = {
          id: `${response.question_id ?? `assistant-${Date.now()}`}`,
          role: "assistant",
          content: response.answer ?? "답변을 가져오지 못했습니다.",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error("챗봇 응답 실패:", err);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            content: "응답을 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [paperId, isChatLoading]
  );

  return { chatMessages, isChatLoading, handleSendChatMessage };
}


/* ---------------- FirstPass Wrapper ---------------- */
function FirstPassPageWrapper({
  papers,
  notesMap,
  firstPassMap,
  onUpdateNotes,
  onCacheFirstPass,
}) {
  const { paperId } = useParams();
  const navigate = useNavigate();

  console.log("🟡 FirstPassPageWrapper 실행 paperId:", paperId);
  console.log("🟡 FirstPassPageWrapper papers:", papers);
  console.log("🟡 FirstPassPageWrapper firstPassMap:", firstPassMap);

  if (!paperId) return <div>잘못된 접근입니다.</div>;

  const safePaper =
    papers.find((p) => p.id === paperId) ?? {
      id: paperId,
      title: "",
      content: "",
      translatedContent: "",
      analysis_stage: "first_pass",
    };

  const raw = firstPassMap[paperId] ?? "";
  console.log("🟢 firstPassRaw:", raw);
  const existingNotes = notesMap[paperId];
  const [firstPassLoading, setFirstPassLoading] = useState(false);
  const [firstPassError, setFirstPassError] = useState<string | null>(null);

  useEffect(() => {
    if (!paperId) return;
    const hasSections =
      (Array.isArray(raw) && raw.length > 0) ||
      (typeof raw === "string" && raw.trim().length > 0) ||
      (raw && typeof raw === "object" && Array.isArray(raw.sections));
    if (hasSections) return;

    let ignore = false;
    const loadSections = async () => {
      setFirstPassLoading(true);
      try {
        if (import.meta.env.DEV) {
          console.log("[FirstPassPageWrapper] fetching first-pass data for", paperId);
        }
        const data = await fetchFirstPassSections(paperId);
        if (ignore) return;
        const payload =
          (data && typeof data === "object" && "first_pass" in data)
            ? (data as any).first_pass
            : (data && typeof data === "object" && "sections" in data)
            ? (data as any).sections
            : data;
        const normalized = normalizeSections(payload);
        if (normalized.length > 0) {
          onCacheFirstPass?.(paperId, normalized);
          setFirstPassError(null);
        } else {
          console.warn("[FirstPassPageWrapper] first-pass response was empty", data);
          setFirstPassError("서버에서 First Pass 결과를 받지 못했습니다.");
        }
      } catch (err: any) {
        console.error("FirstPass 원본 로드 실패:", err);
        if (err?.response) {
          console.error("[FirstPassPageWrapper] error status:", err.response.status);
          console.error("[FirstPassPageWrapper] error data:", err.response.data);
          console.error(
            "[FirstPassPageWrapper] error data (stringified):",
            JSON.stringify(err.response.data)
          );
        }
        if (!ignore) setFirstPassError("First Pass 데이터를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setFirstPassLoading(false);
      }
    };
    loadSections();
    return () => {
      ignore = true;
    };
  }, [paperId, raw, onCacheFirstPass]);

  useEffect(() => {
    if (!paperId || existingNotes) return;
    let ignore = false;
    const load = async () => {
      try {
        const records = await fetchPaperNotes(paperId);
        if (ignore) return;
        onUpdateNotes(paperId, mapNotesToUnified(records), { persist: false });
      } catch (err) {
        console.error("FirstPass 노트 로드 실패:", err);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [paperId, existingNotes, onUpdateNotes]);

  const { chatMessages, isChatLoading, handleSendChatMessage } = usePaperChat(paperId);

  let sections = [];
  try {
    if (Array.isArray(raw)) {
        sections = raw;
    } else if (typeof raw === "string" && raw.trim().length > 0) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) sections = parsed;
      else if (parsed && typeof parsed === "object" && Array.isArray(parsed.sections)) {
        sections = parsed.sections;
      }
    } else if (raw && typeof raw === "object" && Array.isArray(raw.sections)) {
      sections = raw.sections;
    } else {
      sections = [];
    }
  } catch (e) {
    console.error("🔴 JSON 파싱 실패:", e);
  }

  if (import.meta.env.DEV) {
    console.log("[FirstPassPageWrapper] sections after normalize:", sections);
  }

  if (firstPassLoading && sections.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        First Pass 데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (firstPassError && sections.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-600">
        <p>{firstPassError}</p>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
          onClick={() => navigate("/main")}
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <FirstPass
        paper={safePaper}
        firstPassSections={sections}
        unifiedNotes={existingNotes ?? EMPTY_UNIFIED_NOTES}
        onUpdateNotes={(updated) => onUpdateNotes(paperId, updated)}
        onNext={() => navigate(`/papers/${paperId}/secondpass`)}
        chatMessages={chatMessages}
        onSendChatMessage={handleSendChatMessage}
        isChatLoading={isChatLoading}
      />
    </div>
  );
}

function SecondPassPageWrapper({ papers, notesMap, onUpdateNotes }) {
  const { paperId } = useParams();
  const navigate = useNavigate();

  if (!paperId) return <div>잘못된 접근입니다.</div>;

  const paper = papers.find((p) => p.id === paperId);
  const safePaper =
    paper ?? {
      id: paperId,
      title: "",
      content: "",
      translatedContent: "",
      analysis_stage: "second_pass",
    };

  const [pageTranslations, setPageTranslations] = useState<Record<number, string>>({});
  const [translatedFullText, setTranslatedFullText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchSecondPassPages(paperId);
        if (ignore) return;
        const map: Record<number, string> = {};
        data.forEach((item) => {
          const rawPage = Number(item.page_no ?? 0);
          const normalizedPageNo =
            Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : rawPage + 1;
          map[normalizedPageNo] = item.content_trans ?? "";
        });
        setPageTranslations(map);
        if (import.meta.env.DEV) {
          console.log("[SecondPassPageWrapper] pageTranslations map:", map);
        }
        const combined = data
          .map((item) => (item.content_trans ?? "").trim())
          .filter((chunk) => chunk.length > 0)
          .join("\n\n");
        setTranslatedFullText(combined);
        setError(null);
      } catch (err) {
        console.error("SecondPass 번역 로드 실패:", err);
        if (!ignore) {
          setPageTranslations({});
          setTranslatedFullText("");
          setError("번역 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [paperId]);

  const existingNotes = notesMap[paperId];

  useEffect(() => {
    if (!paperId || existingNotes) return;
    let ignore = false;
    const loadNotes = async () => {
      try {
        const records = await fetchPaperNotes(paperId);
        if (ignore) return;
        onUpdateNotes(paperId, mapNotesToUnified(records), { persist: false });
      } catch (err) {
        console.error("SecondPass 노트 로드 실패:", err);
      }
    };
    loadNotes();
    return () => {
      ignore = true;
    };
  }, [paperId, existingNotes, onUpdateNotes]);

  const unifiedNotes = existingNotes ?? EMPTY_UNIFIED_NOTES;
  const {
    chatMessages,
    isChatLoading,
    handleSendChatMessage,
  } = usePaperChat(paperId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Second Pass 번역을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-600">
        <p>{error}</p>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
          onClick={() => navigate("/main")}
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const initialData = {
    paperId: safePaper.id,
    pdfAnnotations: [],
    translatedFullText,
    notes: "",
  };

  return (
    <div className="h-screen overflow-hidden">
      <SecondPass
        paper={safePaper}
        initialData={initialData}
        pageTranslationsData={pageTranslations}
        chatMessages={chatMessages}
        onSendChatMessage={handleSendChatMessage}
        isChatLoading={isChatLoading}
        unifiedNotes={unifiedNotes}
        onUpdateNotes={(updated) => onUpdateNotes(paperId, updated)}
        onSave={() => {}}
        onSaveAndExit={() => navigate("/main")}
        onNext={() => navigate(`/papers/${paperId}/thirdpass`)}
      />
    </div>
  );
}

function ThirdPassPageWrapper({ papers, notesMap, onUpdateNotes }) {
  const { paperId } = useParams();
  const navigate = useNavigate();

  if (!paperId) return <div>잘못된 접근입니다.</div>;

  const safePaper =
    papers.find((p) => p.id === paperId) ?? {
      id: paperId,
      title: "",
      content: "",
      translatedContent: "",
      analysis_stage: "third_pass",
    };

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        if (import.meta.env.DEV) {
          console.log("[ThirdPassPageWrapper] requesting third-pass summary for", paperId);
        }
        const data = await fetchThirdPassSummary(paperId);
        if (import.meta.env.DEV) {
          console.log("[ThirdPassPageWrapper] fetch third-pass response:", data);
        }
        if (ignore) return;
        const summaryTextRaw =
          typeof data === "string"
            ? data
            : typeof data?.summary === "string"
              ? data.summary
              : "";
        const summaryText = summaryTextRaw?.trim?.() ?? "";
        if (import.meta.env.DEV) {
          console.log("[ThirdPassPageWrapper] normalized summary:", summaryText);
        }
        setSummary(summaryText);
        setError(null);
      } catch (err: any) {
        console.error("ThirdPass 요약 로드 실패:", err);
        if (err?.response) {
          console.error("[ThirdPassPageWrapper] error status:", err.response.status);
          console.error("[ThirdPassPageWrapper] error data:", err.response.data);
          if (err.response.data?.detail) {
            console.error("[ThirdPassPageWrapper] error detail:", err.response.data.detail);
          }
          console.error(
            "[ThirdPassPageWrapper] error data (stringified):",
            JSON.stringify(err.response.data)
          );
        }
        if (!ignore) {
          setSummary("");
          setError("Third Pass 요약을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [paperId]);

  const existingNotes = notesMap[paperId];

  useEffect(() => {
    if (!paperId || existingNotes) return;
    let ignore = false;
    const loadNotes = async () => {
      try {
        const records = await fetchPaperNotes(paperId);
        if (ignore) return;
        onUpdateNotes(paperId, mapNotesToUnified(records), { persist: false });
      } catch (err) {
        console.error("ThirdPass 노트 로드 실패:", err);
      }
    };
    loadNotes();
    return () => {
      ignore = true;
    };
  }, [paperId, existingNotes, onUpdateNotes]);

  const {
    chatMessages: thirdPassChatMessages,
    isChatLoading: isThirdPassChatLoading,
    handleSendChatMessage: handleThirdPassSendChatMessage,
  } = usePaperChat(paperId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Third Pass 요약을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-600">
        <p>{error}</p>
        <button
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
          onClick={() => navigate("/main")}
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const initialData = {
    paperId: safePaper.id,
    aiSummary: summary,
    userNotes: "",
    firstPassSummary: "",
    secondPassSummary: "",
    finalReview: "",
  };

  return (
    <div className="h-screen overflow-hidden">
      <ThirdPass
        paper={safePaper}
        initialData={initialData}
        chatMessages={thirdPassChatMessages}
        onSendChatMessage={handleThirdPassSendChatMessage}
        isChatLoading={isThirdPassChatLoading}
        unifiedNotes={existingNotes ?? EMPTY_UNIFIED_NOTES}
        onUpdateNotes={(updated) => onUpdateNotes(paperId, updated)}
        onComplete={() => navigate(`/papers/${paperId}/review`)}
      />
    </div>
  );
}

function StudyReviewPageWrapper({ papers, notesMap, onUpdateNotes }) {
  const { paperId } = useParams();
  const navigate = useNavigate();

  if (!paperId) return <div>잘못된 접근입니다.</div>;

  const safePaper =
    papers.find((p) => p.id === paperId) ?? {
      id: paperId,
      title: "",
      content: "",
      translatedContent: "",
      analysis_stage: "third_pass",
    };

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const loadSummary = async () => {
      setLoading(true);
      try {
        const data = await fetchThirdPassSummary(paperId);
        if (ignore) return;
        const summaryText =
          typeof data === "string"
            ? data
            : typeof data?.summary === "string"
              ? data.summary
              : "";
        setSummary(summaryText?.trim?.() ?? "");
      } catch (err) {
        console.error("StudyReview summary fetch failed:", err);
        if (!ignore) setSummary("");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadSummary();
    return () => {
      ignore = true;
    };
  }, [paperId]);

  const existingNotes = notesMap[paperId];

  useEffect(() => {
    if (!paperId || existingNotes) return;
    let ignore = false;
    const loadNotes = async () => {
      try {
        const records = await fetchPaperNotes(paperId);
        if (ignore) return;
        onUpdateNotes(paperId, mapNotesToUnified(records), { persist: false });
      } catch (err) {
        console.error("StudyReview 노트 로드 실패:", err);
      }
    };
    loadNotes();
    return () => {
      ignore = true;
    };
  }, [paperId, existingNotes, onUpdateNotes]);

  const unifiedNotes = existingNotes ?? EMPTY_UNIFIED_NOTES;

  const fiveCString =
    typeof unifiedNotes.quickNotes === "string"
      ? unifiedNotes.quickNotes
      : JSON.stringify(unifiedNotes.quickNotes ?? EMPTY_FIVE_C);

  const fiveCValues = parseFiveCString(fiveCString);
  const firstPassNote = Object.entries(fiveCValues)
    .filter(([, value]) => value?.trim())
    .map(
      ([key, value]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
    )
    .join("\n");

  const firstPassData: FirstPassData | null = firstPassNote
    ? {
        paperId: safePaper.id,
        originalSections: [],
        translatedSections: [],
        notes: firstPassNote,
      }
    : null;

  const secondPassData: SecondPassData | null =
    unifiedNotes.detailedNotes?.trim()
      ? {
          paperId: safePaper.id,
          pdfAnnotations: [],
          translatedFullText: "",
          notes: unifiedNotes.detailedNotes ?? "",
        }
      : null;

  const thirdPassData: ThirdPassData | null =
    summary?.trim() || unifiedNotes.finalReview?.trim()
      ? {
          paperId: safePaper.id,
          aiSummary: summary,
          userNotes: unifiedNotes.finalReview ?? "",
          firstPassSummary: firstPassData?.notes ?? "",
          secondPassSummary: secondPassData?.notes ?? "",
          finalReview: unifiedNotes.finalReview ?? "",
        }
      : null;

  const { chatMessages: reviewChatMessages } = usePaperChat(paperId);

  if (loading && !thirdPassData) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        학습 리뷰를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <StudyReview
        paper={safePaper}
        firstPassData={firstPassData}
        secondPassData={secondPassData}
        thirdPassData={thirdPassData}
        chatMessages={reviewChatMessages}
        unifiedNotes={unifiedNotes}
        onBackToLibrary={() => navigate("/main")}
      />
    </div>
  );
}


/* ---------------- App Component ---------------- */
export default function App() {
  const navigate = useNavigate();

  /* AUTH */
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* DATA */
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [papers, setPapers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /* NOTE + FIRST PASS DATA */
  const [unifiedNotesMap, setUnifiedNotesMap] = useState<Record<string, UnifiedNotesData>>({});
  const handleUpdateUnifiedNotes = (
    paperId: string,
    notes: UnifiedNotesData,
    options?: { persist?: boolean }
  ) => {
    const prevNotes = unifiedNotesMap[paperId];
    setUnifiedNotesMap((prev) => ({
      ...prev,
      [paperId]: notes,
    }));
    if (options?.persist === false) return;
    void persistUnifiedNotes(paperId, prevNotes, notes);
  };
  const [firstPassMap, setFirstPassMap] = useState({});
  const cacheFirstPassSections = useCallback((paperId: string, sections: any[]) => {
    setFirstPassMap((prev) => ({
      ...prev,
      [paperId]: sections,
    }));
  }, []);

  /* 분석 중인지 표시하는 상태 */
  const [analyzingPaperId, setAnalyzingPaperId] = useState(null);

  const [activePaper, setActivePaper] = useState(null);
  const [modalType, setModalType] = useState("none");

  /* -------------- AUTH CHECK -------------- */
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


  /* -------------- COLLECTION LOAD -------------- */
  useEffect(() => {
    if (!authChecked || !isLoggedIn) return;

    fetchCollections()
      .then((data) => {
        setCollections(data);
        const def = data.find((c) => c.is_default);
        setSelectedCollectionId(def?.id ?? data[0]?.id ?? null);
      })
      .catch(console.error);
  }, [authChecked, isLoggedIn]);


  const refreshPapers = async (targetId?: string) => {
    const collectionId = targetId ?? selectedCollectionId;
    if (!collectionId) return;
    try {
      const data = await fetchPapersByCollection(collectionId);
      setPapers(data);
    } catch (err) {
      console.error("❌ 논문 목록 조회 실패", err);
      setPapers([]);
    }
  };

  /* -------------- PAPERS LOAD -------------- */
  useEffect(() => {
    if (!selectedCollectionId) return;
    refreshPapers(selectedCollectionId);
  }, [selectedCollectionId]);

  const handleCreateCollection = async () => {
    const name = prompt("새 컬렉션 이름을 입력하세요");
    if (!name) return;
    try {
      const created = await createCollection(name);
      setCollections((prev) => [...prev, created]);
      setSelectedCollectionId(created.id);
    } catch (err) {
      console.error("❌ 컬렉션 생성 실패", err);
    }
  };

  const handleRenameCollection = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    try {
      const updated = await updateCollection(id, newName);
      setCollections((prev) =>
        prev.map((col) => (col.id === id ? updated : col))
      );
    } catch (err) {
      console.error("❌ 컬렉션 이름 변경 실패", err);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("정말 해당 컬렉션을 삭제할까요?")) return;
    try {
      await deleteCollection(id);
      const remaining = collections.filter((col) => col.id !== id);
      setCollections(remaining);
      if (selectedCollectionId === id) {
        const fallback =
          remaining.find((col) => col.is_default) ?? remaining[0] ?? null;
        setSelectedCollectionId(fallback?.id ?? null);
      }
    } catch (err) {
      console.error("❌ 컬렉션 삭제 실패", err);
    }
  };


  const normalizeSections = (payload: unknown): any[] => {
    if (!payload) return [];

    const maybeParsed =
      typeof payload === "string"
        ? (() => {
            try {
              return JSON.parse(payload);
            } catch {
              return null;
            }
          })()
        : payload;

    if (Array.isArray(maybeParsed)) return maybeParsed;
    if (
      maybeParsed &&
      typeof maybeParsed === "object" &&
      Array.isArray((maybeParsed as any).sections)
    ) {
      return (maybeParsed as any).sections;
    }
    return [];
  };

  /* -------------- ANALYZE -------------- */
  const handleStartAnalyze = async (paperId: string): Promise<boolean> => {
    console.log("🟦 분석 시작:", paperId);

    const targetPaper =
      papers.find((p) => p.id === paperId) ?? activePaper ?? null;
    if (targetPaper) setActivePaper(targetPaper);

    setModalType("none");
    setAnalyzingPaperId(paperId);

    try {
      const result = await analyzePaper(paperId);
      console.log("🟩 분석 완료 result:", result);

      const normalizedSections = normalizeSections(result.first_pass);
      console.log("🟢 normalizeSections 결과:", normalizedSections);

      cacheFirstPassSections(paperId, normalizedSections);

      setPapers((prev) =>
        prev.map((p) =>
          p.id === paperId ? { ...p, analysis_stage: "first_pass" } : p
        )
      );
      setActivePaper((prev) =>
        prev ? { ...prev, analysis_stage: "first_pass" } : prev
      );
      setModalType("learnReady");
      return true;
    } catch (e) {
      console.error(e);
      alert("분석 실패");
      return false;
    } finally {
      setAnalyzingPaperId(null);
    }
  };

  const handleSidebarPaperClick = (paper: Paper) => {
    setActivePaper(paper);
    if (!paper.analysis_stage || paper.analysis_stage === "not_started") {
      setModalType("analyze");
    } else {
      setModalType("learn");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setCollections([]);
    setPapers([]);
    setSelectedCollectionId(null);
    setActivePaper(null);
    setModalType("none");
    setFirstPassMap({});
    setUnifiedNotesMap({});
    navigate("/login");
  };

  const handleModalConfirm = () => {
    if (!activePaper) return;
    if (modalType === "analyze") {
      void handleStartAnalyze(activePaper.id);
      return;
    }
    setModalType("none");
    navigate(`/papers/${activePaper.id}/firstpass`);
  };


  /* -------------- IF AUTH NOT CHECKED -------------- */
  if (!authChecked) return <div>Loading...</div>;

  /* -------------- NOT LOGGED IN -------------- */
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={() => navigate("/main")} />} />
        <Route path="/auth/callback" element={<LoginCallback onLogin={() => navigate("/main")} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }


  /* -------------- LOGGED IN VIEW -------------- */
  const nickname = localStorage.getItem("nickname") ?? "테스트계정";

  const modalCopy =
    modalType === "analyze"
      ? {
          title: "논문 분석을 시작할까요?",
          description:
            "이 논문은 아직 분석되지 않았어요. 분석을 시작하면 AI가 내용을 정리합니다.",
          confirmLabel: analyzingPaperId ? "분석 중..." : "분석 시작",
        }
      : modalType === "learn"
      ? {
          title: "학습을 시작할까요?",
          description: "이미 분석된 논문입니다. FirstPass 화면으로 이동합니다.",
          confirmLabel: "학습 시작",
        }
      : modalType === "learnReady"
      ? {
          title: "분석이 완료되었습니다.",
          description: "지금 바로 FirstPass 학습을 시작할까요?",
          confirmLabel: "학습 시작",
        }
      : null;

  return (
    <Routes>
      <Route path="/auth/callback" element={<LoginCallback onLogin={() => navigate("/main")} />} />

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
              selectedPaperId={activePaper?.id ?? null}
              onSelectPaper={handleSidebarPaperClick}
              onLogoClick={() => navigate("/main")}
              onNewChat={() => {}}
              onLogout={handleLogout}
              onPaperChanged={() => refreshPapers()}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen((prev) => !prev)}
              userName={nickname}
            />

            <main className="flex-1 overflow-hidden">
              <Library
                papers={papers}
                onSelectPaper={handleSidebarPaperClick}
                isSidebarOpen={isSidebarOpen}
                selectedCollectionId={selectedCollectionId}
                refreshPapers={() => refreshPapers()}
                onAnalyzePaper={(paperId) => handleStartAnalyze(paperId)}
              />

              {modalCopy && (
                <NewModal
                  open={modalType !== "none"}
                  title={modalCopy.title}
                  description={modalCopy.description}
                  confirmLabel={modalCopy.confirmLabel}
                  loading={modalType === "analyze" && !!analyzingPaperId}
                  onConfirm={() => handleModalConfirm()}
                  onCancel={() => setModalType("none")}
                />
              )}
            </main>
          </div>
        }
      />

      {/* Pass Routing */}
      <Route
        path="/papers/:paperId/firstpass"
        element={
          <FirstPassPageWrapper
            papers={papers}
            notesMap={unifiedNotesMap}
            firstPassMap={firstPassMap}
            onUpdateNotes={handleUpdateUnifiedNotes}
            onCacheFirstPass={cacheFirstPassSections}
          />
        }
      />

      <Route
        path="/papers/:paperId/secondpass"
        element={
          <SecondPassPageWrapper
            papers={papers}
            notesMap={unifiedNotesMap}
            onUpdateNotes={handleUpdateUnifiedNotes}
          />
        }
      />

      <Route
        path="/papers/:paperId/thirdpass"
        element={
          <ThirdPassPageWrapper
            papers={papers}
            notesMap={unifiedNotesMap}
            onUpdateNotes={handleUpdateUnifiedNotes}
          />
        }
      />

      <Route
        path="/papers/:paperId/review"
        element={
          <StudyReviewPageWrapper
            papers={papers}
            notesMap={unifiedNotesMap}
            onUpdateNotes={handleUpdateUnifiedNotes}
          />
        }
      />

      <Route path="*" element={<Navigate to="/main" />} />
    </Routes>
  );
}
