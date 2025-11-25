import { BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const handleGoogleLogin = () => {
    // TODO: 실제 Google OAuth 연동
    console.log('Google login clicked');
    onLogin();
  };

  const handleKakaoLogin = () => {
    // TODO: 실제 Kakao OAuth 연동
    console.log('Kakao login clicked');
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
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
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-slate-700">Google로 계속하기</span>
            </button>

            {/* Kakao Login Button */}
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all shadow-sm"
              style={{ backgroundColor: '#FEE500' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C6.477 3 2 6.477 2 10.8c0 2.794 1.877 5.252 4.7 6.656-.197.72-.65 2.407-.743 2.797-.113.464.17.458.358.332.148-.098 2.38-1.585 3.325-2.22.45.062.91.094 1.36.094 5.523 0 10-3.477 10-7.76C22 6.478 17.523 3 12 3z"
                  fill="#3C1E1E"
                />
              </svg>
              <span className="text-slate-900">카카오로 계속하기</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Three-Pass 방법론 기반 논문 학습 플랫폼
        </p>
      </div>
    </div>
  );
}