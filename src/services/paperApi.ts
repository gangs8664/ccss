// src/services/paperApi.ts
import { api } from "./api";

/* ------------------------------------------------------------------
 * 1. 컬렉션별 논문 목록 가져오기
 * ------------------------------------------------------------------ */
export async function fetchPapersByCollection(collectionId: string) {
  const res = await api.get(`/api/v1/collections/${collectionId}/papers`);
  return res.data;
}

/* ------------------------------------------------------------------
 * 2. 논문 업로드 (Swagger 스펙 100% 준수)
 *
 * POST /api/v1/papers
 * multipart/form-data
 *  - collection_id (string)
 *  - title (string)
 *  - file (binary)
 * ------------------------------------------------------------------ */
export async function createPaper(collectionId: string, file: File) {
  const formData = new FormData();

  formData.append("collection_id", collectionId);

  // title은 파일 이름에서 확장자 제거 (원히면 file.name 그대로 가능)
  const title = file.name.replace(/\.[^/.]+$/, "");
  formData.append("title", title);

  formData.append("file", file);

  const res = await api.post(`/api/v1/papers`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

/* ------------------------------------------------------------------
 * 3. 논문 삭제
 * ------------------------------------------------------------------ */
export async function deletePaper(paperId: string) {
  const res = await api.delete(`/api/v1/papers/${paperId}`);
  return res.data;
}

/* ------------------------------------------------------------------
 * 4. 논문 다른 컬렉션으로 이동시키기
 * ------------------------------------------------------------------ */
export async function movePaper(paperId: string, targetCollectionId: string) {
  const res = await api.patch(`/api/v1/papers/${paperId}/move`, {
    target_collection_id: targetCollectionId,
  });
  return res.data;
}