import { useState } from 'react';
import { FileText, Edit3, Star } from 'lucide-react';

export interface UnifiedNotesData {
  quickNotes: string; // 5C 데이터를 JSON으로 저장
  detailedNotes: string;
  finalReview: string;
}

export interface FiveCData {
  category: string;
  context: string;
  correctness: string;
  contributions: string;
  clarity: string;
}

interface UnifiedNotesProps {
  notes: UnifiedNotesData;
  onUpdate: (notes: UnifiedNotesData) => void;
}

type TabType = 'quick' | 'detailed' | 'review';

export function UnifiedNotes({ notes, onUpdate }: UnifiedNotesProps) {
  // 기본값 정의
  const defaultNotes: UnifiedNotesData = {
    quickNotes: JSON.stringify({
      category: '',
      context: '',
      correctness: '',
      contributions: '',
      clarity: '',
    }),
    detailedNotes: '',
    finalReview: '',
  };

  // notes가 undefined이거나 필드가 비어 있어도 항상 안전한 형태로 보정
  const safeNotes: UnifiedNotesData = {
    ...defaultNotes,
    ...(notes || {}),
  };

  const [activeTab, setActiveTab] = useState<TabType>('quick');

  // 5C 데이터 파싱
  const parseFiveC = (): FiveCData => {
    try {
      const parsed = JSON.parse(safeNotes.quickNotes || '{}');
      return {
        category: parsed.category || '',
        context: parsed.context || '',
        correctness: parsed.correctness || '',
        contributions: parsed.contributions || '',
        clarity: parsed.clarity || '',
      };
    } catch {
      return {
        category: '',
        context: '',
        correctness: '',
        contributions: '',
        clarity: '',
      };
    }
  };

  const [fiveCData, setFiveCData] = useState<FiveCData>(parseFiveC());

  const handleFiveCChange = (field: keyof FiveCData, value: string) => {
    const updatedFiveC = { ...fiveCData, [field]: value };
    setFiveCData(updatedFiveC);
    // 항상 safeNotes 기준으로 업데이트
    onUpdate({
      ...safeNotes,
      quickNotes: JSON.stringify(updatedFiveC),
    });
  };

  const handleDetailedNotesChange = (value: string) => {
    onUpdate({
      ...safeNotes,
      detailedNotes: value,
    });
  };

  const handleFinalReviewChange = (value: string) => {
    onUpdate({
      ...safeNotes,
      finalReview: value,
    });
  };

  const tabs = [
    { id: 'quick' as TabType, label: '5C', icon: FileText, color: 'indigo' },
    { id: 'detailed' as TabType, label: '상세 노트', icon: Edit3, color: 'purple' },
    { id: 'review' as TabType, label: 'Summary', icon: Star, color: 'rose' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
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
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all border-b-2 ${
                  isActive
                    ? `border-${tab.color}-500 bg-white text-${tab.color}-600`
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'quick' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-slate-800 mb-1">5C 분석</h3>
                <p className="text-slate-500 text-sm">
                  논문을 5가지 기준으로 체계적으로 분석하세요
                </p>
              </div>
            </div>

            {/* 1. Category */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-slate-700">1. 범주 (Category)</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  이 논문은 어떤 유형인가? 측정 논문인가? 기존 시스템에 대한 분석인가? 연구 프로토타입에 대한 설명인가?
                </span>
              </label>
              <textarea
                value={fiveCData.category}
                onChange={(e) => handleFiveCChange('category', e.target.value)}
                placeholder="논문의 유형을 분석하세요..."
                className="w-full h-20 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/20 resize-none text-sm"
              />
            </div>

            {/* 2. Context */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-slate-700">2. 맥락 (Context)</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  어떤 다른 논문들과 관련이 있는가? 문제를 분석하기 위해 어떤 이론적 기반이 사용되었는가?
                </span>
              </label>
              <textarea
                value={fiveCData.context}
                onChange={(e) => handleFiveCChange('context', e.target.value)}
                placeholder="관련 논문과 이론적 기반을 정리하세요..."
                className="w-full h-20 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/20 resize-none text-sm"
              />
            </div>

            {/* 3. Correctness */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-slate-700">3. 정확성 (Correctness)</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  가정들이 타당해 보이는가?
                </span>
              </label>
              <textarea
                value={fiveCData.correctness}
                onChange={(e) => handleFiveCChange('correctness', e.target.value)}
                placeholder="논문의 가정과 논리를 평가하세요..."
                className="w-full h-20 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/20 resize-none text-sm"
              />
            </div>

            {/* 4. Contributions */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-slate-700">4. 기여 (Contributions)</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  이 논문의 주요 기여는 무엇인가?
                </span>
              </label>
              <textarea
                value={fiveCData.contributions}
                onChange={(e) => handleFiveCChange('contributions', e.target.value)}
                placeholder="논문의 핵심 기여를 정리하세요..."
                className="w-full h-20 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/20 resize-none text-sm"
              />
            </div>

            {/* 5. Clarity */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-slate-700">5. 명확성 (Clarity)</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  이 논문은 잘 작성되었는가?
                </span>
              </label>
              <textarea
                value={fiveCData.clarity}
                onChange={(e) => handleFiveCChange('clarity', e.target.value)}
                placeholder="논문의 작성 품질을 평가하세요..."
                className="w-full h-20 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50/20 resize-none text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Edit3 className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-slate-800 mb-1">상세 노트</h3>
                <p className="text-slate-500 text-sm mb-3">
                  핵심 아이디어, 방법론, 실험 결과 등을 상세히 분석하고 정리하세요
                </p>
              </div>
            </div>
            <textarea
              value={safeNotes.detailedNotes}
              onChange={(e) => handleDetailedNotesChange(e.target.value)}
              placeholder="• 논문의 핵심 기여&#10;• 제안하는 방법론&#10;• 실험 설계 및 결과&#10;• 나라면 어떻게 구현할지&#10;• 차별점과 혁신 포인트"
              className="w-full h-96 p-4 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30 resize-none"
            />
          </div>
        )}

        {activeTab === 'review' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Star className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-slate-800 mb-1">추가 메모</h3>
                <p className="text-slate-500 text-sm mb-3">
                  자유롭게 생각과 아이디어를 기록하세요
                </p>
              </div>
            </div>
            <textarea
              value={safeNotes.finalReview}
              onChange={(e) => handleFinalReviewChange(e.target.value)}
              placeholder="논문을 읽으면서 떠오른 생각, 아이디어, 질문 등을 자유롭게 메모하세요..."
              className="w-full h-96 p-4 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}