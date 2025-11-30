// src/components/Login.tsx
import { BookOpen } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;

const GOOGLE_REDIRECT = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const KAKAO_REDIRECT = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export function Login({ onLogin }: LoginProps) {
  // 🔹 Google OAuth URL 생성
  const buildGoogleLoginUrl = () => {
    return (
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline`
    );
  };

  // 🔹 Kakao OAuth URL 생성
  const buildKakaoLoginUrl = () => {
    return (
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT)}` +
      `&response_type=code`
    );
  };

  // 🔹 Google 버튼 클릭
  const handleGoogleLogin = () => {
    const url = buildGoogleLoginUrl();
    console.log("🔥 생성된 Google URL:", url);
    window.location.href = url;
  };

  // 🔹 Kakao 버튼 클릭
  const handleKakaoLogin = () => {
    console.log("🔥 카카오 로그인 버튼 눌림");
    const url = buildKakaoLoginUrl();
    console.log("🔍 생성된 Kakao URL:", url);
    window.location.href = url;
  };

  // ⬇️⬇️⬇️ **여기가 네 코드에는 없음 → 반드시 있어야 함**
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900 mb-2">척척석사</h1>
          <p className="text-slate-600">논문 학습의 새로운 시작</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-slate-800 text-center mb-2">로그인</h2>
            <p className="text-slate-500 text-center text-sm">
              소셜 계정으로 간편하게 시작하세요
            </p>
          </div>

          <div className="space-y-3">

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 533.5 544.3">
                <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34-4.1-50.2H272v95h147.9c-6.4 34.7-25.4 64.1-54.3 83.7v69h87.7c51.4-47.3 80.2-115.9 80.2-197.5z" />
                <path fill="#34a853" d="M272 544.3c73.2 0 134.7-24.3 179.6-65.9l-87.7-69c-24.3 16.3-55.4 25.7-91.9 25.7-70.6 0-130.4-47.6-151.7-111.4H31.7v70.3c44.3 87.9 135.4 150.3 240.3 150.3z" />
                <path fill="#fbbc05" d="M120.3 323.7c-10.2-30.5-10.2-63.3 0-93.8V159.5H31.7c-43.9 87.6-43.9 191.2 0 278.8l88.6-70.3z" />
                <path fill="#ea4335" d="M272 107.7c38.7 0 73.4 13.3 100.8 39.4l75.6-75.6C405.7 24.2 344.1 0 272 0 167.3 0 76.1 62.4 31.7 150.3L120.3 221c21.3-63.8 81.1-111.4 151.7-111.4z" />
              </svg>

              <span className="text-slate-700">Google로 계속하기</span>
            </button>

            {/* Kakao Login */}
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all shadow-sm"
              style={{ backgroundColor: "#FEE500" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#3C1E1E"
                  d="M12 3C6.48 3 2 6.38 2 10.5c0 2.52 1.76 4.74 4.4 6.02L5.5 21l4.06-2.24c.47.07.94.1 1.44.1 5.52 0 10-3.38 10-7.5S17.52 3 12 3z"
                />
              </svg>

              <span className="text-slate-900">카카오로 계속하기</span>
            </button>

          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Three-Pass 방법론 기반 논문 학습 플랫폼
        </p>
      </div>
    </div>
  );
}  // ← 이게 너 코드에는 없음!