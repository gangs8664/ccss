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

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  content: string;
  publishedDate: string;
  pdfUrl?: string; // PDF 파일 URL
  translatedContent?: string; // 번역된 전체 내용
  sections?: PaperSection[];
}

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
  aiSummary: string; // GPT가 요약한 내용
  userNotes: string; // 사용자 작성 노트
  firstPassSummary?: string;
  secondPassSummary?: string;
  finalReview?: string;
}