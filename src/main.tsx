import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// ⛔ index.css 삭제!
// ✅ Tailwind가 들어있는 globals.css를 진짜로 import 해야 함
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)