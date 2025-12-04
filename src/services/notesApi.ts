// src/services/notesApi.ts
import { api } from "./api";

export interface PaperNoteRecord {
  id: string;
  paper_id: string;
  user_id: string;
  pass_no: number;
  slot: string;
  content?: string | null;
  note?: string | null;
}

export interface FiveCNotesPayload {
  category?: string | null;
  context?: string | null;
  correctness?: string | null;
  contributions?: string | null;
  clarity?: string | null;
}

/* ----------------------------------------------
 * 전체 노트 조회
 * ---------------------------------------------- */
export async function fetchPaperNotes(paperId: string) {
  const res = await api.get<PaperNoteRecord[]>(
    `/api/v1/papers/${paperId}/notes`
  );
  return res.data;
}

/* ----------------------------------------------
 * 특정 Pass 노트 조회
 * ---------------------------------------------- */
export async function fetchNotesByPass(paperId: string, passNo: number) {
  const res = await api.get<PaperNoteRecord[]>(
    `/api/v1/papers/${paperId}/notes/${passNo}`
  );
  return res.data;
}

/* ----------------------------------------------
 * First Pass PUT (5C)
 * ---------------------------------------------- */
export async function updateFirstPassNotes(
  paperId: string,
  payload: FiveCNotesPayload
) {
  return api
    .put(`/api/v1/papers/${paperId}/notes/first-pass`, payload)
    .then((r) => r.data);
}

/* ----------------------------------------------
 * Second Pass PUT
 * ---------------------------------------------- */
export async function updateSecondPassNotes(
  paperId: string,
  note: string
) {
  return api
    .put(`/api/v1/papers/${paperId}/notes/second-pass`, {
      note: note ?? "",
    })
    .then((r) => r.data);
}

/* ----------------------------------------------
 * Third Pass PUT
 * ---------------------------------------------- */
export async function updateThirdPassNotes(
  paperId: string,
  note: string
) {
  return api
    .put(`/api/v1/papers/${paperId}/notes/third-pass`, {
      note: note ?? "",
    })
    .then((r) => r.data);
}
