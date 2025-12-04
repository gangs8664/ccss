// src/components/NewModal.tsx
import { useState, type ReactNode } from "react";

interface NewModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;

  showDontAskAgain?: boolean;
  initialDontAskAgain?: boolean;

  loading?: boolean;

  onConfirm: (dontAskAgain: boolean) => void;
  onCancel: () => void;
}

export function NewModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",

  showDontAskAgain = false,
  initialDontAskAgain = false,

  loading = false,

  onConfirm,
  onCancel,
}: NewModalProps) {
  const [dontAskAgain, setDontAskAgain] = useState(initialDontAskAgain);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        
        <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mb-4 text-sm text-slate-700">{description}</div>

        {showDontAskAgain && (
          <label className="mb-4 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            다시 이 메시지를 보지 않겠습니다.
          </label>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(dontAskAgain)}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "처리 중..." : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}