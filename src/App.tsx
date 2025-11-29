import { useState, useCallback } from 'react';
import { MainSidebar } from './components/MainSidebar.tsx';
import { Library } from './components/Library.tsx';
import { FirstPass } from './components/FirstPass.tsx';
import { SecondPass } from './components/SecondPass.tsx';
import { ThirdPass } from './components/ThirdPass.tsx';
import { Login } from './components/Login.tsx';
import { samplePapers } from './data/samplePapers.ts';
import type { UnifiedNotesData } from "./components/UnifiedNotes";

import type {
  Highlight,
  Paper,
  ViewType,
  FirstPassData,
  SecondPassData,
  ThirdPassData
} from './types';
import type { ChatMessage } from './components/Chatbot.tsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [view, setView] = useState<ViewType>('library');
  const [firstPassData, setFirstPassData] = useState<FirstPassData | null>(null);
  const [secondPassData, setSecondPassData] = useState<SecondPassData | null>(null);
  const [thirdPassData, setThirdPassData] = useState<ThirdPassData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [unifiedNotes, setUnifiedNotes] = useState<UnifiedNotesData>({
  quickNotes: JSON.stringify({
    category: "",
    context: "",
    correctness: "",
    contributions: "",
    clarity: "",
  }),
  detailedNotes: "",
  finalReview: "",
});

const handleUpdateNotes = (notes: UnifiedNotesData) => {
  setUnifiedNotes(notes);
};

  const handleLogin = () => setIsLoggedIn(true);

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setView('first-pass');
  };

  const handleLogoClick = () => {
    setView('library');
    setSelectedPaper(null);
  };

  const handleNewChat = () => {
    setView('library');
    setSelectedPaper(null);
    setFirstPassData(null);
    setSecondPassData(null);
    setThirdPassData(null);
    setChatMessages([]);
  };

  const handleNavigateToPass = (pass: 'first' | 'second' | 'third') => {
    const viewMap: Record<'first' | 'second' | 'third', ViewType> = {
      first: 'first-pass',
      second: 'second-pass',
      third: 'third-pass',
    };
    setView(viewMap[pass]);
  };

  const handleBackToLibrary = () => {
    setView('library');
    setSelectedPaper(null);
    setFirstPassData(null);
    setSecondPassData(null);
    setThirdPassData(null);
    setChatMessages([]);
  };

  const handleSaveFirstPass = useCallback((data: FirstPassData) => {
    setFirstPassData(data);
  }, []);

  const handleSaveSecondPass = useCallback((data: SecondPassData) => {
    setSecondPassData(data);
  }, []);

  const handleSaveThirdPass = useCallback((data: ThirdPassData) => {
    setThirdPassData(data);
  }, []);

  const handleSendChatMessage = useCallback(
    async (message: string) => {
      if (!selectedPaper) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
      setIsChatLoading(true);

      try {
        // 실제 API 통신 준비용 Mock
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `논문 "${selectedPaper.title}"에 대한 질문이시군요.\n\n(여기에 AI 응답이 들어갑니다.)`,
          timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, aiMessage]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [selectedPaper, chatMessages]
  );

  const renderContent = () => {
    if (!selectedPaper) return null;

    switch (view) {
      case 'first-pass':
        return (
          <FirstPass
            paper={selectedPaper}
            onSave={handleSaveFirstPass}
            onNext={() => handleNavigateToPass('second')}
            initialData={firstPassData}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            isChatLoading={isChatLoading}
            unifiedNotes={unifiedNotes}          
            onUpdateNotes={handleUpdateNotes}    
          />
        );

      case 'second-pass':
        return (
          <SecondPass
            paper={selectedPaper}
            onSave={handleSaveSecondPass}
            onNext={() => handleNavigateToPass('third')}
            onSaveAndExit={handleBackToLibrary}
            initialData={secondPassData}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            isChatLoading={isChatLoading}
            unifiedNotes={unifiedNotes}          
            onUpdateNotes={handleUpdateNotes}    
          />
        );

      case 'third-pass':
        return (
          <ThirdPass
            paper={selectedPaper}
            firstPassData={firstPassData}
            secondPassData={secondPassData}
            onSave={handleSaveThirdPass}
            initialData={thirdPassData}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            isChatLoading={isChatLoading}
            unifiedNotes={unifiedNotes}         
            onUpdateNotes={handleUpdateNotes}   
          />
        );

      default:
        return null;
    }
  };

  /** ---------------------------
   *  로그인 상태 아닐 때 → 중앙 정렬
   * --------------------------- */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  /** ---------------------------
   *  로그인 이후 전체 레이아웃
   * --------------------------- */
  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <MainSidebar
        papers={samplePapers}
        selectedPaperId={selectedPaper?.id || null}
        onSelectPaper={handleSelectPaper}
        onNewChat={handleNewChat}
        onLogoClick={handleLogoClick}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'library' ? (
          <Library papers={samplePapers} onSelectPaper={handleSelectPaper} isSidebarOpen={isSidebarOpen} />
        ) : (
          <div className="h-full overflow-hidden">{renderContent()}</div>
        )}
      </main>
    </div>
  );
}