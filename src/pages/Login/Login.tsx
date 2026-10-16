import { t } from "../../demo/i18n";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { demoUser } from '../../demo/api';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  return <main style={{ minHeight: '75vh', display: 'grid', placeItems: 'center', background: '#f5f7fb' }}>
    <section style={{ padding: '40px', maxWidth: 520, margin: 20, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px #25344c15' }}>
      <p style={{ color: '#98791c' }}>SMART OPERATION · DEMO</p>
      <h1 style={{ fontSize: 28 }}>{t("智慧營運數位儀表板")}</h1>
      <p>{t("探索營運圖表、交辦事項與管理功能。無需 Google 帳號，所有內容均為示範資料。")}</p>
      <button style={{ padding: '12px 24px', color: 'white', background: '#3163b3', border: 0, borderRadius: 8 }} onClick={() => { setUser(demoUser); navigate('/home'); }}>{t("以展示帳號進入")}</button>
    </section>
  </main>;
}
