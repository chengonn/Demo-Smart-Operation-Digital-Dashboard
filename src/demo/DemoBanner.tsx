import React from 'react';
import { resetDemo } from './api';
import './demo.css';
import { getLanguage, setLanguage, t } from './i18n';

export default function DemoBanner() {
  return <aside className="demo-banner" aria-label={t('展示版說明')}>
    <span><strong>{t('作品展示版')}</strong> {t('· 全站使用虛構示範資料，操作僅保存在此瀏覽器；郵件與 AI 回覆為模擬。')}</span>
    <div className="demo-actions">
      <div className="language-switch" role="group" aria-label="語言 / Language">
        <button lang="zh-Hant" aria-pressed={getLanguage() === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        <button lang="en" aria-pressed={getLanguage() === 'en'} onClick={() => setLanguage('en')}>English</button>
      </div>
      <button onClick={() => { if (window.confirm(t('重設此瀏覽器的示範資料？'))) resetDemo(); }}>{t('重設示範資料')}</button>
    </div>
  </aside>;
}
