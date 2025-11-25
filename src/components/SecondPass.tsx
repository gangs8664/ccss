import { useState, useEffect } from "react";
import { ChevronRight, Save, Loader2, MessageSquare } from "lucide-react";
import { PDFViewer } from "./PDFViewer";
import { TranslatedTextPanel } from "./TranslatedTextPanel.tsx";
import { Chatbot, type ChatMessage } from "./Chatbot";
import {
  translatePaper,
  savePaperProgress,
} from "../services/api.ts";
import type {
  Paper,
  SecondPassData,
  Highlight,
} from "../types/";

interface SecondPassProps {
  paper: Paper;
  onSave: (data: SecondPassData) => void;
  onNext: () => void;
  onSaveAndExit: () => void;
  initialData: SecondPassData | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
}

export function SecondPass({
  paper,
  onSave,
  onNext,
  onSaveAndExit,
  initialData,
  chatMessages,
  onSendChatMessage,
  isChatLoading,
}: SecondPassProps) {
  const [pdfAnnotations, setPdfAnnotations] = useState<
    Highlight[]
  >(initialData?.pdfAnnotations || []);
  const [translatedFullText, setTranslatedFullText] = useState(
    initialData?.translatedFullText || "",
  );
  const [pageTranslations, setPageTranslations] = useState<{
    [key: number]: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // 컴포넌트 마운트 시 번역 자동 요청 (이미 번역된 내용이 없을 경우)
  useEffect(() => {
    const fetchTranslation = async () => {
      if (
        Object.keys(pageTranslations).length === 0 &&
        !isTranslating
      ) {
        setIsTranslating(true);
        try {
          const response = await translatePaper(
            paper.id,
            paper.content,
          );
          setTranslatedFullText(response.translatedText);
          setPageTranslations(response.pageTranslations);
        } catch (error) {
          console.error("Translation failed:", error);
          // Mock 데이터로 폴백
          const mockPageTranslations = {
            1: `서론\n\n딥러닝은 최근 몇 년 동안 인공지능과 기계 학습 분야에 혁명을 일으켰습니다. 이러한 변화는 몇 가지 주요 요인에 의해 주도되었습니다: 대규모 데이터셋의 가용성, 계산 능력의 발전, 그리고 새로운 아키텍처 혁신입니다.\n\n딥러닝의 기본 구성 요소는 인간 뇌의 생물학적 신경망에서 영감을 받은 인공 신경망입니다. 이러한 네트워크는 입력 데이터를 처리하고 변환하여 원하는 출력을 생성하는 상호 연결된 노드 또는 뉴런의 레이어로 구성됩니다.\n\n배경 및 동기\n\n딥러닝의 기원은 최초의 인공 뉴런 모델이 도입된 1940년대로 거슬러 올라갑니다. 그러나 딥러닝이 컴퓨터 비전, 자연어 처리, 음성 인식을 포함한 다양한 영역에서 놀라운 성공을 거두기 시작한 것은 2010년대가 되어서였습니다.\n\n주요 돌파구 중 하나는 효과적인 훈련 알고리즘, 특히 경사 하강 최적화와 결합된 역전파의 개발이었습니다. 이러한 기술을 통해 신경망은 내부 매개변수를 반복적으로 조정하여 데이터에서 복잡한 패턴을 학습할 수 있습니다.\n\n합성곱 신경망\n\n합성곱 신경망(CNN)은 이미지 관련 작업에서 지배적인 아키텍처가 되었습니다. CNN은 원시 픽셀 데이터에서 계층적 특징 표현을 자동으로 학습하도록 설계되었습니다. CNN의 핵심 혁신은 입력에서 로컬 패턴을 감지하기 위해 학습된 필터를 적용하는 합성곱 레이어의 사용입니다.`,
            2: `일반적인 CNN 아키텍처는 여러 유형의 레이어로 구성됩니다: 특징 추출을 위한 합성곱 레이어, 다운샘플링을 위한 풀링 레이어, 분류를 위한 완전 연결 레이어입니다. 이러한 계층적 구조를 통해 CNN은 여러 수준의 추상화에서 특징을 학습할 수 있습니다.\n\n순환 신경망\n\n텍스트나 시계열과 같은 순차 데이터의 경우 순환 신경망(RNN)이 매우 효과적인 것으로 입증되었습니다. RNN은 임의 길이의 시퀀스를 처리하고 시간적 의존성을 포착할 수 있는 내부 상태를 유지합니다.\n\nLong Short-Term Memory(LSTM) 네트워크와 Gated Recurrent Units(GRU)는 기울기 소실 문제를 해결하는 고급 RNN 변형으로, 순차 데이터에서 장거리 의존성을 학습할 수 있습니다.\n\nTransformer 아키텍처\n\n2017년 Transformer 아키텍처의 도입은 딥러닝의 또 다른 중요한 이정표가 되었습니다. Transformer는 데이터의 의존성을 모델링하기 위해 어텐션 메커니즘에만 전적으로 의존하며, 순환의 필요성을 제거합니다. 이 설계는 더 나은 병렬화를 가능하게 하며 자연어 처리 작업에서 최첨단 결과를 가져왔습니다.\n\n응용 및 영향\n\n딥러닝은 수많은 영역에서 응용되고 있습니다. 컴퓨터 비전에서 딥러닝 모델은 이미지 분류, 객체 감지, 의미론적 분할과 같은 작업에서 인간 수준 또는 초인간적 성능을 달성합니다. 자연어 처리에서 BERT 및 GPT와 같은 모델은 인간 언어를 이해하고 생성하는 데 있어 놀라운 능력을 보여주었습니다.\n\n이러한 전통적인 영역을 넘어 딥러닝은 의료, 자율 주행 차량, 과학적 발견 및 기타 많은 분야에서 상당한 영향을 미치고 있습니다. 원시 데이터에서 관련 특징을 자동으로 학습하는 딥러닝 모델의 능력은 복잡한 실제 문제를 해결하는 데 귀중한 도구가 되었습니다.`,
            3: `도전 과제 및 향후 방향\n\n놀라운 진전에도 불구하고 딥러닝 연구에는 여러 과제가 남아 있습니다. 여기에는 대량의 레이블이 지정된 훈련 데이터의 필요성, 계산 요구 사항, 학습된 모델의 해석 가능성, 적대적 공격에 대한 강건성이 포함됩니다.\n\n향후 연구 방향에는 보다 효율적인 학습 알고리즘 개발, 제한된 데이터에서 학습할 수 있는 모델 생성, 모델 해석 가능성 향상, AI 시스템이 공정하고 안전하며 인간의 가치와 일치하도록 보장하는 것이 포함됩니다.\n\n결론\n\n딥러닝은 인공지능을 변화시켰으며 수많은 분야에서 계속해서 혁신을 주도하고 있습니다. 현재의 과제를 해결하고 새로운 영역을 탐색함에 따라 딥러닝은 앞으로 몇 년 동안 훨씬 더 강력한 기능과 응용 프로그램을 발휘할 것을 약속합니다.`,
          };
          setPageTranslations(mockPageTranslations);
          setTranslatedFullText(
            Object.values(mockPageTranslations).join("\n\n"),
          );
        } finally {
          setIsTranslating(false);
        }
      }
    };

    fetchTranslation();
  }, [
    paper.id,
    paper.content,
    pageTranslations,
    isTranslating,
  ]);

  useEffect(() => {
    const data: SecondPassData = {
      paperId: paper.id,
      pdfAnnotations,
      translatedFullText,
      notes,
    };
    onSave(data);
    savePaperProgress(paper.id, "second", data);
  }, [pdfAnnotations, translatedFullText, notes, paper.id]);

  const handleHighlight = (text: string, color: string) => {
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      color,
      position: {
        pageNumber: 1,
        start: 0,
        end: text.length,
      },
      paperId: paper.id,
    };
    setPdfAnnotations([...pdfAnnotations, newHighlight]);
  };

  return (
    <div className="h-full overflow-hidden bg-slate-50">
      <div className="h-full flex">
        {/* Left Panel - PDF Viewer */}
        <div className="flex-1 border-r border-slate-200">
          <PDFViewer
            pdfUrl={paper.pdfUrl}
            content={paper.content}
            onHighlight={handleHighlight}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Panel - Translated Text or Chatbot */}
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-slate-800">
                {showChatbot ? 'AI 어시스턴트' : `전체 번역본 (페이지 ${currentPage})`}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {showChatbot ? '논문에 대해 질문하세요' : 'AI가 번역한 내용'}
              </p>
            </div>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="p-2 rounded-lg hover:bg-slate-200 transition-all"
              title={showChatbot ? '번역본 보기' : '챗봇 열기'}
            >
              <MessageSquare className={`w-5 h-5 ${showChatbot ? 'text-indigo-600' : 'text-slate-600'}`} />
            </button>
          </div>

          {isTranslating ? (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
                <p className="text-slate-600">
                  논문을 번역하는 중입니다...
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  잠시만 기다려주세요
                </p>
              </div>
            </div>
          ) : showChatbot ? (
            <Chatbot
              messages={chatMessages}
              onSendMessage={onSendChatMessage}
              isLoading={isChatLoading}
            />
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                <TranslatedTextPanel
                  content={
                    pageTranslations[currentPage] ||
                    translatedFullText
                  }
                  title={`전체 번역본 (페이지 ${currentPage})`}
                />
              </div>

              <div className="border-t border-slate-200 p-6 bg-white space-y-4 flex-shrink-0">
                <div>
                  <h3 className="text-slate-700 mb-2">메모</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="논문 내용에 대한 메모를 작성하세요..."
                    className="w-full h-24 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 resize-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>저장하고 나중에 돌아오기</span>
                  </button>

                  <button
                    onClick={onSaveAndExit}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-amber-200 text-sm"
                  >
                    <span></span>
                    <span>배경 자료 읽고 돌아오기</span>
                  </button>

                  <button
                    onClick={onNext}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Third Pass로 진행</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}