// API 서비스 레이어 - 백엔드 통신

const API_BASE_URL = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL 
  : 'http://localhost:8000/api';

export interface UploadPDFResponse {
  paperId: string;
  extractedText: string;
  metadata: {
    title: string;
    authors: string[];
    abstract: string;
  };
}

export interface TranslationResponse {
  paperId: string;
  translatedText: string;
  pageTranslations: {
    [pageNumber: number]: string;
  };
  sections: {
    title: string;
    original: string;
    translated: string;
  }[];
}

export interface SummaryResponse {
  paperId: string;
  summary: string;
  keyPoints: string[];
}

// PDF 업로드 및 텍스트 추출
export async function uploadPDF(file: File): Promise<UploadPDFResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // TODO: 실제 백엔드 API 연결
  // const response = await fetch(`${API_BASE_URL}/papers/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return await response.json();

  // 현재는 Mock 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paperId: Date.now().toString(),
        extractedText: `Attention Is All You Need

Abstract

The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.

Introduction

Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.`,
        metadata: {
          title: file.name.replace('.pdf', ''),
          authors: ['Ashish Vaswani', 'Noam Shazeer'],
          abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
        },
      });
    }, 1500);
  });
}

// 논문 번역 요청
export async function translatePaper(paperId: string, text: string): Promise<TranslationResponse> {
  // TODO: 실제 백엔드 API 연결
  // const response = await fetch(`${API_BASE_URL}/papers/${paperId}/translate`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text }),
  // });
  // return await response.json();

  // 현재는 Mock 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paperId,
        translatedText: `서론

딥러닝은 최근 몇 년 동안 인공지능과 기계 학습 분야에 혁명을 일으켰습니다. 이러한 변화는 몇 가지 주요 요인에 의해 주도되었습니다: 대규모 데이터셋의 가용성, 계산 능력의 발전, 그리고 새로운 아키텍처 혁신입니다.

딥러닝의 기본 구성 요소는 인간 뇌의 생물학적 신경망에서 영감을 받은 인공 신경망입니다. 이러한 네트워크는 입력 데이터를 처리하고 변환하여 원하는 출력을 생성하는 상호 연결된 노드 또는 뉴런의 레이어로 구성됩니다.`,
        pageTranslations: {
          1: `서론

딥러닝은 최근 몇 년 동안 인공지능과 기계 학습 분야에 혁명을 일으켰습니다. 이러한 변화는 몇 가지 주요 요인에 의해 주도되었습니다: 대규모 데이터셋의 가용성, 계산 능력의 발전, 그리고 새로운 아키텍처 혁신입니다.

딥러닝의 기본 구성 요소는 인간 뇌의 생물학적 신경망에서 영감을 받은 인공 신경망입니다. 이러한 네트워크는 입력 데이터를 처리하고 변환하여 원하는 출력을 생성하는 상호 연결된 노드 또는 뉴런의 레이어로 구성됩니다.`,
          2: `배경 및 동기

딥러닝의 기원은 최초의 인공 뉴런 모델이 도입된 1940년대로 거슬러 올라갑니다. 그러나 딥러닝이 컴퓨터 비전, 자연어 처리, 음성 인식을 포함한 다양한 영역에서 놀라운 성공을 거두기 시작한 것은 2010년대가 되어서였습니다.

주요 돌파구 중 하나는 효과적인 훈련 알고리즘, 특히 경사 하강 최적화와 결합된 역전파의 개발이었습니다. 이러한 기술을 통해 신경망은 내부 매개변수를 반복적으로 조정하여 데이터에서 복잡한 패턴을 학습할 수 있습니다.`,
          3: `합성곱 신경망

합성곱 신경망(CNN)은 이미지 관련 작업에서 지배적인 아키텍처가 되었습니다. CNN은 원시 픽셀 데이터에서 계층적 특징 표현을 자동으로 학습하도록 설계되었습니다. CNN의 핵심 혁신은 입력에서 로컬 패턴을 감지하기 위해 학습된 필터를 적용하는 합성곱 레이어의 사용입니다.

일반적인 CNN 아키텍처는 여러 유형의 레이어로 구성됩니다: 특징 추출을 위한 합성곱 레이어, 다운샘플링을 위한 풀링 레이어, 분류를 위한 완전 연결 레이어입니다. 이러한 계층적 구조를 통해 CNN은 여러 수준의 추상화에서 특징을 학습할 수 있습니다.`,
        },
        sections: [
          {
            title: 'Abstract',
            original: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
            translated: '지배적인 시퀀스 변환 모델들은 인코더와 디코더를 포함하는 복잡한 순환 신경망이나 합성곱 신경망을 기반으로 합니다...',
          },
          {
            title: 'Introduction',
            original: 'Recurrent neural networks, long short-term memory and gated recurrent neural networks...',
            translated: '순환 신경망, 특히 LSTM과 GRU는 언어 모델링과 기계 번역과 같은 시퀀스 모델링 및 변환 문제에서...',
          },
        ],
      });
    }, 2000);
  });
}

// AI 요약 생성 요청
export async function generateSummary(paperId: string, text: string): Promise<SummaryResponse> {
  // TODO: 실제 백엔드 API 연결
  // const response = await fetch(`${API_BASE_URL}/papers/${paperId}/summarize`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text }),
  // });
  // return await response.json();

  // 현재는 Mock 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paperId,
        summary: `이 논문은 Transformer라는 새로운 신경망 아키텍처를 제안합니다. 기존의 순환 신경망(RNN)이나 합성곱 신경망(CNN)과 달리, Transformer는 오직 어텐션 메커니즘만을 사용하여 시퀀스를 처리합니다.

주요 기여:
1. Self-Attention 메커니즘을 기반으로 한 완전히 새로운 아키텍처 제안
2. 순환 구조를 제거하여 병렬화 가능성을 크게 향상
3. 기계 번역 작업에서 기존 최고 성능 모델들을 능가하는 결과 달성
4. 훈련 시간을 대폭 단축 (8개 GPU로 12시간만에 학습 가능)

핵심 아이디어:
- Multi-Head Attention: 여러 개의 어텐션을 병렬로 수행하여 다양한 표현 부분공간의 정보를 동시에 학습
- Positional Encoding: 순환 구조 없이도 시퀀스의 위치 정보를 인코딩
- Feed-Forward Networks: 각 위치에서 독립적으로 적용되는 완전 연결 네트워크

성능:
- WMT 2014 영어-독일어 번역에서 BLEU 점수 28.4 달성 (기존 최고 대비 2.0 BLEU 점수 향상)
- WMT 2014 영어-프랑스어 번역에서 BLEU 점수 41.8 달성 (새로운 최고 기록)

영향:
이 연구는 자연어 처리 분야에 혁명을 가져왔으며, BERT, GPT 등 현대의 대부분의 언어 모델들의 기초가 되었습니다. Transformer 아키텍처는 현재 NLP뿐만 아니라 컴퓨터 비전, 음성 인식 등 다양한 분야에서 활용되고 있습니다.`,
        keyPoints: [
          'RNN과 CNN을 사용하지 않는 순수 어텐션 기반 아키텍처',
          '병렬화 가능성 증대로 훈련 시간 대폭 단축',
          '기계 번역에서 새로운 최고 성능 달성',
          'Multi-Head Attention으로 다양한 표현 학습',
          '현대 언어 모델(BERT, GPT 등)의 기초가 됨',
        ],
      });
    }, 2500);
  });
}

// 논문 데이터 저장 (First/Second/Third Pass 데이터)
export async function savePaperProgress(paperId: string, passType: 'first' | 'second' | 'third', data: any): Promise<void> {
  // TODO: 실제 백엔드 API 연결
  // await fetch(`${API_BASE_URL}/papers/${paperId}/progress`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ passType, data }),
  // });

  // 현재는 로컬 스토리지에 저장
  const key = `paper_${paperId}_${passType}_pass`;
  localStorage.setItem(key, JSON.stringify(data));
  console.log(`Saved ${passType} pass data for paper ${paperId}`);
}

// 논문 진행 상황 불러오기
export async function loadPaperProgress(paperId: string, passType: 'first' | 'second' | 'third'): Promise<any | null> {
  // TODO: 실제 백엔드 API 연결
  // const response = await fetch(`${API_BASE_URL}/papers/${paperId}/progress/${passType}`);
  // return await response.json();

  // 현재는 로컬 스토리지에서 불러오기
  const key = `paper_${paperId}_${passType}_pass`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}