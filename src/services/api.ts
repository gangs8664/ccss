// src/services/api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 매 요청마다 Authorization 헤더 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  // console.log("🔥 API 요청 정보:", {
  //   url: config.url,
  //   method: config.method,
  //   Authorization: config.headers.Authorization,
  // });

  return config;
});



// 토큰 만료 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.warn("⚠️ 토큰 만료됨 → 자동 로그아웃");
      localStorage.removeItem("access_token");

      // 강제 이동
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
