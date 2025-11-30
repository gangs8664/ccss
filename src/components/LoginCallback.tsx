// src/components/LoginCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginCallbackProps {
  onLogin: () => void;
}

export function LoginCallback({ onLogin }: LoginCallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    let accessToken: string | null = null;

    // #access_token=...
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      accessToken = params.get("access_token");
    }

    // ?access_token=...
    if (!accessToken && search.includes("access_token")) {
      const params = new URLSearchParams(search);
      accessToken = params.get("access_token");
    }

    if (!accessToken) {
      console.error("❌ access_token 없음 → 로그인 실패");
      // navigate는 비동기로 한 텀 뒤 실행해야 충돌 없음
      setTimeout(() => navigate("/login"), 0);
      return;
    }

    // 1) 토큰 저장
    localStorage.setItem("access_token", accessToken);

    // 2) URL에서 토큰 제거
    try {
      // "/auth/callback"을 그대로 쓰면 다시 LoginCallback이 실행됨 → 오류 유발
      window.history.replaceState({}, document.title, "/");
    } catch (err) {
      console.warn("replaceState 실패:", err);
    }

    // 3) 즉시 onLogin() 실행하면 Router 트리 충돌함 → 반드시 딜레이 줘야 함
    setTimeout(() => {
      onLogin(); // App에서 isLoggedIn=true → /main 이동
    }, 0);
  }, [navigate, onLogin]);

  return <div>로그인 처리 중...</div>;
}