// src/components/PortalDropdown.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalDropdownProps {
  children: React.ReactNode;
  position: { top: number; left: number };
  onClose: () => void;
}

export function PortalDropdown({ children, position, onClose }: PortalDropdownProps) {
  // 외부 클릭 감지
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      onClose();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  return createPortal(
    <div
      className="absolute z-[9999] bg-white shadow-xl border rounded-lg py-1"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않음
    >
      {children}
    </div>,
    document.body
  );
}