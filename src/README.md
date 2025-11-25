# 논문 학습 플랫폼 (Three-Pass Method)

## 프로젝트 구조

```
/
├── components/
│   ├── MainSidebar.tsx          # 메인 사이드바 (항상 표시)
│   ├── PassNavigation.tsx       # Pass 간 네비게이션
│   ├── Library.tsx              # 논문 라이브러리 홈
│   ├── PDFViewer.tsx            # PDF 뷰어 컴포넌트
│   ├── TranslatedTextPanel.tsx  # 번역 텍스트 패널
│   ├── FirstPass.tsx            # 1st Pass: 영어 원본 ↔ 한글 번역
│   ├── SecondPass.tsx           # 2nd Pass: PDF 뷰어 ↔ 전체 번역본
│   ├── ThirdPass.tsx            # 3rd Pass: AI 요약 ↔ 사용자 노트
│   ├── PaperViewer.tsx          # 전체 읽기 모드
│   └── Sidebar.tsx              # 하이라이트 사이드바
├── types/
│   └── index.ts                 # TypeScript 타입 정의
├── data/
│   └── samplePapers.ts          # 샘플 논문 데이터
├── constants/
│   └── colors.ts                # 하이라이트 색상 상수
├── styles/
│   └── globals.css              # Tailwind CSS 설정
└── App.tsx                      # 메인 앱 컴포넌트
```

## 화면 구성

### 1. First Pass (1차 읽기)
**목적**: 논문 훑어보기 (5-10분)
- **좌측**: 영어 원본 (Title, Abstract, Introduction, Sections, Conclusions, References)
- **우측**: 한글 번역본 + 메모 영역

### 2. Second Pass (2차 읽기)
**목적**: 논문 내용 파악 및 주요 요지 요약 (최대 1시간)
- **좌측**: PDF 뷰어 (원본 논문, 하이라이트 기능)
- **우측**: 전체 번역본 + 메모 + 다음 단계 선택
  - (a) 저장하고 나중에 돌아오기
  - (b) 배경 자료 읽고 돌아오기
  - (c) Third Pass로 진행

### 3. Third Pass (3차 읽기)
**목적**: 논문의 본질 파악 및 가상 재구현
- **좌측**: GPT AI 요약
- **우측**: 통합 노트
  - First Pass 메모
  - Second Pass 메모 + 하이라이트 수
  - 사용자 상세 노트 (수정 가능)
  - 최종 리뷰 & 평가

## 주요 기능

### 1. PDF 뷰어
- 페이지 네비게이션 (이전/다음)
- 줌 인/아웃 (50% - 200%)
- 텍스트 하이라이트 기능
- 하이라이트 색상: 노랑, 초록, 파랑, 분홍, 보라

### 2. 번역 패널
- AI 번역된 전체 내용 표시
- 수정 가능/불가능 모드 토글
- 저장/취소 기능

### 3. 사이드바
- 토글 가능 (열기/닫기)
- 논문 목록 (Past Papers, Last 3 Days)
- New Chat 버튼
- Settings, Account

## 기술 스택

### 필수 의존성
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.553.0",
  "react-pdf": "^7.7.1"  // PDF 뷰어용 (설치 필요)
}
```

### 개발 의존성
```json
{
  "vite": "^5.4.11",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.6.2"
}
```

## CSS 충돌 방지

### Tailwind v4.0 사용 시
- `tailwind.config.js` 파일 불필요
- `/styles/globals.css`에서 직접 설정
- 컴포넌트에서는 utility 클래스만 사용

### 주의사항
- ❌ `font-size` 클래스 사용 금지 (예: `text-2xl`)
- ❌ `font-weight` 클래스 사용 금지 (예: `font-bold`)
- ❌ `line-height` 클래스 사용 금지 (예: `leading-none`)
- ✅ `globals.css`에서 기본 타이포그래피 설정

## 설치 및 실행

```bash
# 의존성 설치
npm install

# react-pdf 설치 (PDF 뷰어용)
npm install react-pdf

# 개발 서버 실행
npm run dev
```

## 데이터 흐름

```
Library
  ↓ (논문 선택)
First Pass
  ↓ (영어 원본 → 한글 번역 확인)
Second Pass
  ↓ (PDF 하이라이트 + 전체 번역본 읽기)
Third Pass
  ↓ (AI 요약 + 모든 노트 통합 + 최종 정리)
완료
```

## 향후 개선 사항

1. **PDF 업로드 기능**
   - 사용자가 직접 PDF 파일 업로드
   - 자동 텍스트 추출 및 번역

2. **AI 통합**
   - GPT API를 통한 자동 번역
   - 논문 요약 생성
   - 질문 답변 기능

3. **데이터 저장**
   - Supabase 연동
   - 하이라이트 및 노트 동기화
   - 여러 기기에서 접근

4. **협업 기능**
   - 논문 공유
   - 팀 노트
   - 댓글 기능
