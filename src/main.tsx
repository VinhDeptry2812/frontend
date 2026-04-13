import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🔥 Warm-up Render server ngay khi app khởi động (tránh cold start chậm)
fetch('https://tttn-1.onrender.com/api/categories?tree=0')
  .catch(() => { }); // Silent - không làm gì nếu lỗi

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
