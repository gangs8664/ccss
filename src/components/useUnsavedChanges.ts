// src/store/useUnsavedChanges.ts
import { useEffect, useState } from "react";

// 전역 상태 저장 (컴포넌트 리렌더와 무관하게 유지됨)
let globalUnsaved = false;
let listeners: Array<(val: boolean) => void> = [];

export function setUnsavedChanges(val: boolean) {
  globalUnsaved = val;
  listeners.forEach((fn) => fn(val));
}

export function resetUnsavedChanges() {
  globalUnsaved = false;
  listeners.forEach((fn) => fn(false));
}

export function getUnsavedChanges() {
  return globalUnsaved;
}

/**
 * 컴포넌트에서 사용하는 훅
 * → 컴포넌트가 리렌더될 때 subscribe / unsubscribe 자동 관리
 */
export function useUnsavedChanges() {
  const [value, setValue] = useState(globalUnsaved);

  useEffect(() => {
    listeners.push(setValue);

    // 언마운트 시 제거
    return () => {
      listeners = listeners.filter((fn) => fn !== setValue);
    };
  }, []);

  return value;
}