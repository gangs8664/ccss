// src/components/LoginCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface LoginCallbackProps {
  onLogin: () => void;
}

export function LoginCallback({ onLogin }: LoginCallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    let accessToken: string | null = null;

    // -------------------------------
    // 1) 토큰 파싱
    // -------------------------------
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      accessToken = params.get("access_token");
    }

    if (!accessToken && search.includes("access_token")) {
      const params = new URLSearchParams(search);
      accessToken = params.get("access_token");
    }

    if (!accessToken) {
      console.error("❌ access_token 없음 → OAuth 실패");
      return; // navigate 절대 하면 안됨
    }

    // -------------------------------
    // 2) 토큰 저장
    // -------------------------------
    localStorage.setItem("access_token", accessToken);

    // callback URL 정리
    window.history.replaceState({}, document.title, "/");

    // -------------------------------
    // 3) 사용자 정보 요청
    // -------------------------------
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data?.nickname) {
          localStorage.setItem("nickname", res.data.nickname);
        }

        console.log("로그인 사용자:", res.data);

        // 4) App.tsx → /main 이동
        onLogin();
      } catch (err) {
        console.error("❌ 사용자 정보 요청 실패:", err);
        // navigate 절대 금지 → 무한 루프 발생
        // 대신 토큰만 삭제
        localStorage.removeItem("access_token");
      }
    };

    // Router 안정화 위해 10ms 지연
    setTimeout(fetchUser, 10);
  }, [navigate, onLogin]);

  return <div>로그인 처리 중...</div>;
}