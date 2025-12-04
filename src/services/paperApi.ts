// src/services/paperApi.ts
import { api } from "./api";

/* ----------------------------------------------
 * 1. 논문 목록
 * ---------------------------------------------- */
export async function fetchPapersByCollection(collectionId: string) {
  const res = await api.get(`/api/v1/collections/${collectionId}/papers`);
  return res.data;
}

/* ----------------------------------------------
 * 2. 논문 업로드
 * ---------------------------------------------- */
export async function createPaper(collectionId: string, file: File) {
  const formData = new FormData();
  formData.append("collection_id", collectionId);

  const title = file.name.replace(/\.[^/.]+$/, "");
  formData.append("title", title);
  formData.append("file", file);

  const res = await api.post(`/api/v1/papers`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/* ----------------------------------------------
 * 3. 논문 삭제
 * ---------------------------------------------- */
export async function deletePaper(paperId: string) {
  const res = await api.delete(`/api/v1/papers/${paperId}`);
  return res.data;
}

/* ----------------------------------------------
 * 4. 논문 컬렉션 이동
 * ---------------------------------------------- */
export async function movePaper(paperId: string, collectionId: string) {
  const res = await api.patch(`/api/v1/papers/${paperId}/move`, {
    collection_id: collectionId,
  });
  return res.data;
}

/* ----------------------------------------------
 * 5. 논문 분석 시작 — 실서버 API 스펙 준수
 * ---------------------------------------------- */
export interface AnalyzePaperResponse {
  paper_id: string;
  ai_paper_id: string;
  first_pass: string; // 서버에서 내려주는 FirstPass 텍스트
}

export async function analyzePaper(paperId: string) {
  console.log("🟦 analyzePaper() 호출됨, paperId:", paperId);

  try {
    const response = await api.post(`/api/v1/papers/${paperId}/analyze`);
    console.log("🟩 analyzePaper() 응답:", response.data);
    return response.data;
  } catch (err) {
    console.error("🟥 analyzePaper() 에러:", err);
    throw err;
  }
}

/* ----------------------------------------------
 * 6-A. First Pass 결과 조회
 * ---------------------------------------------- */
export interface FirstPassSectionsResponse {
  paper_id?: string;
  first_pass?: unknown;
  sections?: unknown[];
}

export async function fetchFirstPassSections(paperId: string) {
  const res = await api.get<FirstPassSectionsResponse>(
    `/api/v1/papers/${paperId}/first-pass`
  );
  return res.data;
}

/* ----------------------------------------------
 * 6. Second Pass 번역 데이터
 * ---------------------------------------------- */
export interface SecondPassPageTranslation {
  paper_id: string;
  page_no: number;
  content_trans: string;
}

export async function fetchSecondPassPages(paperId: string) {
  const res = await api.get<SecondPassPageTranslation[]>(
    `/api/v1/papers/${paperId}/second-pass`
  );
  return res.data;
}

/* ----------------------------------------------
 * 7. Third Pass 요약 데이터
 * ---------------------------------------------- */
export interface ThirdPassSummaryResponse {
  paper_id?: string;
  language?: string;
  style?: string;
  summary?: string;
}

export async function fetchThirdPassSummary(
  paperId: string,
  options?: { language?: string; style?: string }
) {
  const payload = {
    language: options?.language ?? "ko",
    style: options?.style ?? "medium",
  };

  const res = await api.post<ThirdPassSummaryResponse>(
    `/api/v1/papers/${paperId}/third-pass`,
    payload
  );
  return res.data;
}
