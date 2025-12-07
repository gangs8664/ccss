export interface Highlight {
  id: string;
  text: string;
  color: string;
  note?: string;
  position: { 
    pageNumber: number;
    start: number; 
    end: number;
    boundingRect?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  paperId: string;
}

// export interface Paper {
//   id: string;
//   title: string;
//   authors: string[];
//   abstract: string;
//   content: string;
//   publishedDate: string;
//   pdfUrl?: string; // PDF 파일 URL
//   translatedContent?: string; // 번역된 전체 내용
//   sections?: PaperSection[];
// }

export interface PaperSection {
  title: string;
  content: string;
  translatedContent?: string;
}

export type ViewType = 'library' | 'first-pass' | 'second-pass' | 'third-pass';

export interface FirstPassData {
  paperId: string;
  originalSections: string[]; // 영어 원본 섹션들
  translatedSections: string[]; // 번역된 섹션들
  notes?: string;
}

export interface SecondPassData {
  paperId: string;
  pdfAnnotations: Highlight[]; // PDF에 표시된 하이라이트들
  translatedFullText: string; // 전체 번역본
  notes?: string;
}

export interface ThirdPassData {
  paperId: string;
  aiSummary: string; // AI가 생성한 요약
  userNotes: string; // 사용자 작성 노트
  firstPassSummary?: string;
  secondPassSummary?: string;
  finalReview?: string;
}

// export interface Paper {
//   id: string;
//   collection_id: string;
//   title: string;
//   file_path: string;
//   analysis_stage: string;   // ← 여기 추가 (이 파일이 정식 위치)
//   created_at: string;
//   updated_at: string;
// }

// === First Pass Notes ===
export interface FirstPassNotes {
  category: string;
  context: string;
  correctness: string;
  contributions: string;
  clarity: string;
}

export interface Paper {
  id: string;
  collection_id?: string;

  title: string;
  authors?: string[];
  abstract?: string;

  content: string;
  translatedContent?: string;

  publishedDate?: string;
  pdfUrl?: string;

  sections?: PaperSection[];

  analysis_stage?: string;
  file_path?: string;

  created_at?: string;
  updated_at?: string;
}

// 통합 노트 타입 (FirstPass, SecondPass, ThirdPass 한 번에 저장하기 위한 구조)
export interface UnifiedNotesData {
  quickNotes?: {
    category?: string;
    context?: string;
    correctness?: string;
    contributions?: string;
    clarity?: string;
  };

  detailedNotes?: string;

  finalReview?: string;

  // ThirdPass 옵션들
  aiSummary?: string;
  userNotes?: string;
}
