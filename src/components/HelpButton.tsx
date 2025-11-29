import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { HelpPanel } from './HelpPanel.tsx';

interface HelpButtonProps {
  currentView: 'library' | 'first-pass' | 'second-pass' | 'third-pass';
}

export function HelpButton({ currentView }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-30 flex items-center justify-center group"
        aria-label="도움말"
      >
        <HelpCircle className="w-6 h-6" />
        
        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          도움말
        </span>
      </button>

      {/* Help Panel */}
      <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} currentView={currentView} />
    </>
  );
}