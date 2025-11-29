import { useState } from 'react';
import { X, BookOpen, Target, Wrench, HelpCircle, FileText, Edit3, Star, MessageSquare, Highlighter } from 'lucide-react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'library' | 'first-pass' | 'second-pass' | 'third-pass';
}

type TabType = 'methodology' | 'current' | 'features' | 'faq';

export function HelpPanel({ isOpen, onClose, currentView }: HelpPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('methodology');

  // 현재 페이지에 따른 동적 가이드
  const getCurrentStageGuide = () => {
    if (currentView === 'first-pass') {
      return {
        title: 'First Pass - 논문 훑어보기',
        duration: '5-10분',
        description: '논문의 전체적인 구조와 핵심 내용을 빠르게 파악하는 단계입니다.',
        steps: [
          '제목, 초록, 서론을 주의 깊게 읽기',
          '각 섹션과 서브섹션 제목 확인하기',
          '결론 읽기',
          '참고문헌 훑어보며 이전에 읽은 논문 체크하기',
          '그림, 다이어그램, 표 등 시각 자료 확인하기',
        ],
        goals: [
          '카테고리: 논문이 어떤 유형인지 파악',
          '맥락: 다른 논문들과의 관계 이해',
          '정확성: 가정들의 타당성 평가',
          '기여: 주요 기여사항 파악',
          '명확성: 작성 품질 판단',
        ],
        tips: '이 단계에서는 논문을 읽어야 할지 말지 결정할 수 있습니다. 5C 노트를 활용하여 핵심 내용을 정리하세요.',
      };
    } else if (currentView === 'second-pass') {
      return {
        title: 'Second Pass - 내용 이해',
        duration: '1시간',
        description: '논문을 꼼꼼히 읽으며 핵심 내용을 깊이 있게 이해하는 단계입니다.',
        steps: [
          '그림, 다이어그램, 표를 주의 깊게 살펴보기',
          '읽지 않은 관련 참고문헌 표시하기 (배경지식 확보용)',
          '논문의 주요 논지와 증거 파악하기',
          '여백에 메모하며 핵심 포인트 표시하기',
          '이해되지 않는 용어나 개념 기록하기',
        ],
        goals: [
          '논문의 내용을 파악하되 세부사항은 이해하지 못해도 괜찮음',
          '핵심 아이디어와 방법론 이해',
          '실험 설계와 결과 분석',
        ],
        tips: '상세 노트를 활용하여 핵심 아이디어, 방법론, 실험 결과를 정리하세요. 챗봇에게 이해되지 않는 부분을 질문할 수도 있습니다.',
      };
    } else if (currentView === 'third-pass') {
      return {
        title: 'Third Pass - 깊이 있는 분석',
        duration: '4-5시간 (초보자)',
        description: '논문을 처음부터 끝까지 완전히 이해하고 재현할 수 있는 수준까지 파고드는 단계입니다.',
        steps: [
          '논문을 가상으로 재구현하며 읽기 (같은 가정 사용)',
          '실제 구현과 비교하며 혁신 포인트 파악',
          '모든 가정과 주장에 대해 비판적으로 사고하기',
          '직접 증명이나 실험을 재현해보기',
          '강점과 약점, 잠재적 개선점 도출하기',
        ],
        goals: [
          '논문의 모든 세부사항 완전 이해',
          '저자의 관점에서 논문 재구성',
          '혁신적인 아이디어와 숨겨진 실패 발견',
          '향후 연구 방향 제시',
        ],
        tips: '이 단계까지 완료하면 논문의 내용을 완전히 이해하고, 동료에게 설명할 수 있으며, 관련 연구를 진행할 수 있습니다.',
      };
    }
    
    return {
      title: '논문 라이브러리',
      duration: '',
      description: '학습할 논문을 선택하고 관리하는 공간입니다.',
      steps: [
        '논문 목록에서 학습하고 싶은 논문 선택',
        'Three-Pass 방법론으로 단계적 학습 시작',
        '각 단계에서 노트와 챗봇 활용',
      ],
      goals: [
        '논문 선택 및 관리',
        '학습 진행도 확인',
      ],
      tips: '논문을 클릭하여 First Pass부터 시작하세요!',
    };
  };

  const tabs = [
    { id: 'methodology' as TabType, label: 'Three-Pass 방법론', icon: BookOpen },
    { id: 'current' as TabType, label: '현재 단계', icon: Target },
    { id: 'features' as TabType, label: '기능 가이드', icon: Wrench },
    { id: 'faq' as TabType, label: 'FAQ', icon: HelpCircle },
  ];

  if (!isOpen) return null;

  const currentGuide = getCurrentStageGuide();

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-slate-800">도움말</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 transition-all border-b-2 ${
                    isActive
                      ? 'border-indigo-500 bg-white text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Three-Pass 방법론 */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-800 mb-2">Three-Pass 방법론이란?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Three-Pass는 논문을 효율적으로 읽고 이해하기 위한 체계적인 방법론입니다. 
                  세 단계를 거치며 점진적으로 논문에 대한 이해를 깊게 만들어갑니다.
                </p>
              </div>

              <div className="space-y-4">
                {/* First Pass */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
                    <div>
                      <h4 className="text-slate-800">First Pass - 훑어보기</h4>
                      <span className="text-blue-600 text-xs">5-10분</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">
                    논문의 전체적인 구조와 핵심 내용을 빠르게 파악합니다. 
                    이 논문이 읽을 가치가 있는지 판단할 수 있습니다.
                  </p>
                </div>

                {/* Second Pass */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
                    <div>
                      <h4 className="text-slate-800">Second Pass - 이해하기</h4>
                      <span className="text-purple-600 text-xs">약 1시간</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">
                    논문을 꼼꼼히 읽으며 핵심 아이디어와 방법론을 깊이 있게 이해합니다. 
                    세부사항은 모두 이해하지 못해도 괜찮습니다.
                  </p>
                </div>

                {/* Third Pass */}
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
                    <div>
                      <h4 className="text-slate-800">Third Pass - 완전 이해</h4>
                      <span className="text-rose-600 text-xs">4-5시간 (초보자)</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">
                    논문을 재구현할 수 있을 정도로 완전히 이해합니다. 
                    저자의 관점에서 논문을 재구성하고 혁신 포인트를 파악합니다.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">
                  💡 <strong>팁:</strong> 모든 논문에 Third Pass가 필요한 것은 아닙니다. 
                  자신의 연구 목적에 따라 적절한 단계까지만 진행하세요.
                </p>
              </div>
            </div>
          )}

          {/* 현재 단계 가이드 */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-slate-800">{currentGuide.title}</h3>
                </div>
                {currentGuide.duration && (
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs mb-3">
                    소요 시간: {currentGuide.duration}
                  </span>
                )}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentGuide.description}
                </p>
              </div>

              {currentGuide.steps.length > 0 && (
                <div>
                  <h4 className="text-slate-700 mb-3">📋 진행 단계</h4>
                  <ol className="space-y-2">
                    {currentGuide.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span className="text-slate-600 text-sm pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {currentGuide.goals.length > 0 && (
                <div>
                  <h4 className="text-slate-700 mb-3">🎯 목표</h4>
                  <ul className="space-y-2">
                    {currentGuide.goals.map((goal, index) => (
                      <li key={index} className="flex gap-2 text-slate-600 text-sm">
                        <span className="text-indigo-500">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  💡 <strong>팁:</strong> {currentGuide.tips}
                </p>
              </div>
            </div>
          )}

          {/* 기능 가이드 */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-800 mb-2">주요 기능 사용법</h3>
                <p className="text-slate-600 text-sm">
                  척척석사의 다양한 기능을 활용하여 효율적으로 논문을 학습하세요.
                </p>
              </div>

              {/* 5C 노트 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-slate-800">5C 노트</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  논문을 5가지 기준으로 체계적으로 분석하는 프레임워크입니다.
                </p>
                <div className="pl-4 space-y-2 text-sm">
                  <div>
                    <strong className="text-slate-700">1. Category (범주):</strong>
                    <span className="text-slate-600"> 논문의 유형 파악</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">2. Context (맥락):</strong>
                    <span className="text-slate-600"> 관련 논문과 이론적 기반</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">3. Correctness (정확성):</strong>
                    <span className="text-slate-600"> 가정의 타당성 평가</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">4. Contributions (기여):</strong>
                    <span className="text-slate-600"> 주요 기여사항 정리</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">5. Clarity (명확성):</strong>
                    <span className="text-slate-600"> 작성 품질 판단</span>
                  </div>
                </div>
              </div>

              {/* 상세 노트 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-500" />
                  <h4 className="text-slate-800">상세 노트</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  핵심 아이디어, 방법론, 실험 결과를 자유롭게 정리하는 공간입니다. 
                  Second Pass와 Third Pass에서 특히 유용합니다.
                </p>
              </div>

              {/* 추가 메모 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-500" />
                  <h4 className="text-slate-800">추가 메모</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  논문을 읽으면서 떠오른 생각, 아이디어, 질문을 자유롭게 기록하세요. 
                  모든 Pass에서 동일�� 메모가 유지됩니다.
                </p>
              </div>

              {/* 챗봇 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-slate-800">AI 챗봇</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  논문 내용에 대해 궁금한 점을 질문하고, AI의 도움을 받으세요. 
                  이해되지 않는 개념이나 용어를 물어볼 수 있습니다.
                </p>
              </div>

              {/* 하이라이트 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Highlighter className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-slate-800">하이라이트</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  중요한 문장이나 단락을 하이라이트하여 나중에 쉽게 찾을 수 있습니다. 
                  (현재 개발 중)
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  💡 <strong>팁:</strong> 노트와 챗봇은 모든 Pass에서 동일하게 유지되므로, 
                  단계를 진행하며 누적된 지식을 계속 참고할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-800 mb-2">자주 묻는 질문</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. Three-Pass를 모두 완료해야 하나요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. 아니요! 자신의 목적에 맞게 선택하세요. 논문의 개요만 파악하고 싶다면 First Pass만, 
                    핵심 내용을 이해하고 싶다면 Second Pass까지, 완전히 이해하고 재현하고 싶다면 Third Pass까지 진행하세요.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. 각 단계마다 시간이 얼마나 걸리나요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. First Pass는 5-10분, Second Pass는 약 1시간, Third Pass는 초보자 기준 4-5시간이 소요됩니다. 
                    경험이 쌓이면 시간이 단축됩니다.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. 노트는 어떻게 관리되나요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. 모든 Pass에서 동일한 노트가 유지됩니다. First Pass에서 작성한 5C 노트를 Second Pass와 Third Pass에서도 
                    계속 확인하고 수정할 수 있습니다.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. 5C 노트는 무엇인가요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. Category(범주), Context(맥락), Correctness(정확성), Contributions(기여), Clarity(명확성)의 
                    5가지 기준으로 논문을 체계적으로 분석하는 프레임워크입니다.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. 챗봇은 어떻게 활용하나요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. 논문을 읽다가 이해되지 않는 개념이나 용어가 있을 때 챗봇에게 질문하세요. 
                    AI가 설명을 제공하여 학습을 도와줍니다.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-800 mb-2">Q. 논문을 건너뛰어서 읽어도 되나요?</h4>
                  <p className="text-slate-600 text-sm">
                    A. Third Pass로 바로 시작할 수도 있지만, Three-Pass 방법론의 장점을 최대한 활용하려면 
                    순서대로 진행하는 것을 권장합니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}