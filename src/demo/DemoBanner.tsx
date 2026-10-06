import React from 'react';
import { resetDemo } from './api';
import './demo.css';

export default function DemoBanner() {
  return <aside className="demo-banner" aria-label="展示版說明">
    <span><strong>作品展示版</strong> · 全站使用虛構示範資料，操作僅保存在此瀏覽器；郵件與 AI 回覆為模擬。</span>
    <button onClick={() => { if (window.confirm('重設此瀏覽器的示範資料？')) resetDemo(); }}>重設示範資料</button>
  </aside>;
}
