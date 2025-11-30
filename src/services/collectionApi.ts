import { api } from "./api";

// 1. 컬렉션 목록 조회
export const fetchCollections = () => {
  return api.get("/api/v1/collections").then(res => res.data);
};

// 2. 컬렉션 생성
export const createCollection = (name: string) => {
  return api.post("/api/v1/collections", { name }).then(res => res.data);
};

// 3. 컬렉션 이름 수정
export const updateCollection = (id: string, name: string) => {
  return api.patch(`/api/v1/collections/${id}`, { name }).then(res => res.data);
};

// 4. 컬렉션 삭제
export const deleteCollection = (id: string) => {
  return api.delete(`/api/v1/collections/${id}`);
};