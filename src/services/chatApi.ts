import { api } from "./api";

export interface ChatHistoryRecord {
  question_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface ChatSendResponse {
  paper_id: string;
  question_id: string;
  answer: string;
}

export async function fetchChatHistory(paperId: string) {
  const res = await api.get<ChatHistoryRecord[]>(
    `/api/v1/papers/${paperId}/chat`
  );
  return res.data ?? [];
}

export async function sendChatMessage(paperId: string, question: string) {
  const res = await api.post<ChatSendResponse>(
    `/api/v1/papers/${paperId}/chat`,
    { question }
  );
  return res.data;
}
