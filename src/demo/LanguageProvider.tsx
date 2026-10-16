import React, { ReactNode, useEffect, useSyncExternalStore } from 'react';
import { registerLocale } from 'react-datepicker';
import { enUS, zhTW } from 'date-fns/locale';
import { getLanguage, getLocale, subscribeLanguage, t } from './i18n';

registerLocale('en-US', enUS);
registerLocale('zh-TW', zhTW);

export function useLanguage() {
  return useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
    document.title = t('智慧營運數位儀表板｜作品展示');
    const updateFrame = (frame: HTMLIFrameElement) => {
      if (frame.src.startsWith('data:text/html')) frame.contentWindow?.postMessage({ type: 'demo-language', language }, '*');
    };
    document.querySelectorAll('iframe').forEach(updateFrame);
    const loaded = (event: Event) => { if (event.target instanceof HTMLIFrameElement) updateFrame(event.target); };
    document.addEventListener('load', loaded, true);
    return () => document.removeEventListener('load', loaded, true);
  }, [language]);
  return <>{children}</>;
}

export { getLocale };
