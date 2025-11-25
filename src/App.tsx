import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { MainSidebar } from './components/MainSidebar.tsx';
import { Library } from './components/Library.tsx';
import { FirstPass } from './components/FirstPass.tsx';
import { SecondPass } from './components/SecondPass.tsx';
import { ThirdPass } from './components/ThirdPass.tsx';
import { Login } from './components/Login.tsx';
import { samplePapers } from './data/samplePapers.ts';
import type { Highlight, Paper, ViewType, FirstPassData, SecondPassData, ThirdPassData } from './types/';
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
  
  // 전역 채팅 세션 (모든 Pass에서 공유)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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

  const handleAddHighlight = (highlight: Highlight) => {
    setHighlights([...highlights, highlight]);
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const handleUpdateHighlight = (id: string, note: string) => {
    setHighlights(highlights.map(h => h.id === id ? { ...h, note } : h));
  };

  const handleBackToLibrary = () => {
    setView('library');
    setSelectedPaper(null);
    setFirstPassData(null);
    setSecondPassData(null);
    setThirdPassData(null);
    setChatMessages([]);
  };

  const handleNavigateToPass = (pass: 'first' | 'second' | 'third') => {
    const viewMap: Record<typeof pass, ViewType> = {
      first: 'first-pass',
      second: 'second-pass',
      third: 'third-pass',
    };
    setView(viewMap[pass]);
  };

  // 채팅 메시지 전송 핸들러
  const handleSendChatMessage = useCallback(async (message: string) => {
    if (!selectedPaper) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      // TODO: 실제 백엔드 API 호출
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paperId: selectedPaper.id,
      //     message: message,
      //     history: chatMessages
      //   })
      // });
      // const data = await response.json();

      // Mock 응답 (실제로는 백엔드 AI 서버의 응답이 여기에 표시됩니다)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `논문 "${selectedPaper.title}"에 대한 질문이시군요. 이 부분에 대해 설명드리겠습니다.\n\n(실제로는 백엔드 AI 서버의 응답이 여기에 표시됩니다)`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat message failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [selectedPaper, chatMessages]);

  const handleSaveFirstPass = useCallback((data: FirstPassData) => {
    setFirstPassData(data);
  }, []);

  const handleSaveSecondPass = useCallback((data: SecondPassData) => {
    setSecondPassData(data);
  }, []);

  const handleSaveThirdPass = useCallback((data: ThirdPassData) => {
    setThirdPassData(data);
  }, []);

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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 relative">
      {/* Main Sidebar - Always visible */}
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
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {view === 'library' ? (
          <Library papers={samplePapers} onSelectPaper={handleSelectPaper} isSidebarOpen={isSidebarOpen} />
        ) : (
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}