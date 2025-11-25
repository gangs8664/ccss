export interface HighlightColor {
  name: string;
  color: string;
  hover: string;
}

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  { name: '노랑', color: '#FEF08A', hover: '#FDE047' },
  { name: '초록', color: '#BBF7D0', hover: '#86EFAC' },
  { name: '파랑', color: '#BFDBFE', hover: '#93C5FD' },
  { name: '분홍', color: '#FBCFE8', hover: '#F9A8D4' },
  { name: '보라', color: '#E9D5FF', hover: '#D8B4FE' },
];
