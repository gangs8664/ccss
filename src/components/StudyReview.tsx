import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lightbulb,
  MessageSquare,
  Share2,
  Star,
  Target,
  Users,
} from "lucide-react";

import type {
  Paper,
  FirstPassData,
  SecondPassData,
  ThirdPassData,
} from "../types";
import type { ChatMessage } from "./Chatbot";
import type { UnifiedNotesData } from "./UnifiedNotes";

interface FiveCData {
  category: string;
  context: string;
  correctness: string;
  contributions: string;
  clarity: string;
}

interface StudyReviewProps {
  paper: Paper;
  firstPassData: FirstPassData | null;
  secondPassData: SecondPassData | null;
  thirdPassData: ThirdPassData | null;
  chatMessages: ChatMessage[];
  unifiedNotes: UnifiedNotesData;
  onBackToLibrary: () => void;
}

const DEFAULT_FIVE_C: FiveCData = {
  category: "",
  context: "",
  correctness: "",
  contributions: "",
  clarity: "",
};

const formatAuthors = (authors?: string[]) => {
  if (!authors || authors.length === 0) return "미상";
  return authors.join(", ");
};

const formatPublishedDate = (publishedDate?: string) => {
  if (!publishedDate) return "발행일 미상";
  try {
    const date = new Date(publishedDate);
    if (Number.isNaN(date.getTime())) return publishedDate;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return publishedDate;
  }
};

const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    subText: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-900",
    subText: "text-purple-700",
    iconBg: "bg-purple-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-900",
    subText: "text-green-700",
    iconBg: "bg-green-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    subText: "text-amber-700",
    iconBg: "bg-amber-500",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-900",
    subText: "text-rose-700",
    iconBg: "bg-rose-500",
  },
};

export function StudyReview({
  paper,
  firstPassData,
  secondPassData,
  thirdPassData,
  chatMessages,
  unifiedNotes,
  onBackToLibrary,
}: StudyReviewProps) {
  const [activeTab, setActiveTab] =
    useState<"overview" | "notes" | "chat">("overview");

  const fiveCData: FiveCData = useMemo(() => {
    const value = unifiedNotes.quickNotes;
    if (!value) return DEFAULT_FIVE_C;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return { ...DEFAULT_FIVE_C, ...parsed };
      } catch {
        return DEFAULT_FIVE_C;
      }
    }
    return {
      ...DEFAULT_FIVE_C,
      ...value,
    };
  }, [unifiedNotes.quickNotes]);

  const stats = {
    totalTime: "4시간 35분",
    passesCompleted: [
      firstPassData,
      secondPassData,
      thirdPassData,
    ].filter(Boolean).length,
    chatCount: chatMessages.length,
    notesCount: [
      unifiedNotes.detailedNotes,
      unifiedNotes.finalReview,
    ].filter((value) => !!value?.trim()).length,
  };

  const tabs = [
    { id: "overview" as const, label: "전체 요약", icon: BookOpen },
    { id: "notes" as const, label: "나의 노트", icon: FileText },
    { id: "chat" as const, label: "질의응답 기록", icon: MessageSquare },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-slate-900 mb-1">학습 완료!</h1>
                  <p className="text-slate-500 text-sm">
                    Three-Pass 방법론으로 논문 학습을 성공적으로 마쳤습니다
                  </p>
                </div>
              </div>

              <h2 className="text-slate-800 mb-2 mt-4 truncate">
                {paper.title || "제목 없는 논문"}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{formatAuthors(paper.authors)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatPublishedDate(paper.publishedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={onBackToLibrary}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                라이브러리로
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                공유
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                <Download className="w-4 h-4" />
                내보내기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-900 text-sm mb-0.5">학습 시간</p>
                  <p className="text-blue-700">{stats.totalTime}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-purple-900 text-sm mb-0.5">완료한 Pass</p>
                  <p className="text-purple-700">{stats.passesCompleted}/3 단계</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-4 border border-rose-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-rose-900 text-sm mb-0.5">질의응답</p>
                  <p className="text-rose-700">{stats.chatCount}개 대화</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-amber-900 text-sm mb-0.5">작성한 노트</p>
                  <p className="text-amber-700">{stats.notesCount}개 섹션</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-all ${
                    isActive
                      ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-0.5">AI 생성 요약</h3>
                      <p className="text-indigo-100 text-sm">
                        논문의 핵심 내용을 AI가 정리했습니다
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {thirdPassData?.aiSummary || "요약이 아직 생성되지 않았습니다."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-0.5">5C 분석</h3>
                      <p className="text-blue-100 text-sm">
                        논문을 5가지 기준으로 체계적으로 분석했습니다
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[
                      { key: "category", label: "카테고리 (Category)", icon: BookMarked, color: "blue" },
                      { key: "context", label: "맥락 (Context)", icon: Lightbulb, color: "purple" },
                      { key: "correctness", label: "정확성 (Correctness)", icon: CheckCircle2, color: "green" },
                      { key: "contributions", label: "기여 (Contributions)", icon: Star, color: "amber" },
                      { key: "clarity", label: "명확성 (Clarity)", icon: FileText, color: "rose" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const value = fiveCData[item.key as keyof FiveCData];
                      const styles =
                        COLOR_STYLES[item.color as keyof typeof COLOR_STYLES];
                      return (
                        <div
                          key={item.key}
                          className={`${styles.bg} border ${styles.border} rounded-lg p-4`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`${styles.text} mb-2 text-sm`}>{item.label}</h4>
                              <p
                                className={`${styles.subText} text-sm ${
                                  !value && "italic opacity-60"
                                }`}
                              >
                                {value || "작성된 내용이 없습니다."}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-800">Three-Pass 학습 과정</h3>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    {
                      title: "First Pass",
                      description: "논문 훑어보기 - 전체 구조 파악",
                      data: firstPassData?.notes,
                    },
                    {
                      title: "Second Pass",
                      description: "내용 이해 - 핵심 내용 파악",
                      data: secondPassData?.notes ?? "",
                    },
                    {
                      title: "Third Pass",
                      description: "깊이 있는 이해 - 비판적 분석",
                      data: thirdPassData?.userNotes ?? unifiedNotes.finalReview ?? "",
                    },
                  ].map((pass, index) => (
                    <div className="flex gap-4" key={pass.title}>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            pass.data ? "bg-green-500" : "bg-slate-200"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-5 h-5 ${pass.data ? "text-white" : "text-slate-400"}`}
                          />
                        </div>
                        {index !== 2 && <div className="w-0.5 flex-1 bg-slate-200" />}
                      </div>
                      <div className="flex-1 pb-6 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-slate-800">{pass.title}</h4>
                          {pass.data && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              완료
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{pass.description}</p>
                        {pass.data && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
                            {pass.data}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              {unifiedNotes.detailedNotes && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-purple-900">상세 노트</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {unifiedNotes.detailedNotes}
                    </p>
                  </div>
                </div>
              )}

              {unifiedNotes.finalReview && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-rose-50 to-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-rose-900">최종 정리</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {unifiedNotes.finalReview}
                    </p>
                  </div>
                </div>
              )}

              {!unifiedNotes.detailedNotes && !unifiedNotes.finalReview && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">작성된 노트가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-slate-800">질의응답 기록</h3>
                </div>
                <span className="text-sm text-slate-500">
                  {chatMessages.length}개의 대화
                </span>
              </div>
              <div className="p-6">
                {chatMessages.length > 0 ? (
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" ? "bg-indigo-500" : "bg-slate-200"
                          }`}
                        >
                          {message.role === "user" ? (
                            <span className="text-white text-sm">나</span>
                          ) : (
                            <span className="text-slate-600 text-sm">AI</span>
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-2xl ${
                            message.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          <div
                            className={`inline-block px-4 py-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-indigo-500 text-white"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(message.timestamp).toLocaleString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">질의응답 기록이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
