/// <reference types="jest" />
import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LanguageProvider, { useLanguage } from './LanguageProvider';
import DemoBanner from './DemoBanner';
import { getLanguage, getLocale, LANGUAGE_KEY, setLanguage, subscribeLanguage, t, translateText } from './i18n';

beforeEach(() => { setLanguage('zh'); localStorage.clear(); });
afterEach(() => { cleanup(); setLanguage('zh'); });

test('language is persisted and changing it leaves custom content intact', () => {
  const notify = jest.fn();
  const unsubscribe = subscribeLanguage(notify);
  setLanguage('en');
  setLanguage('en');
  expect(notify).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe('en');
  expect(getLocale()).toBe('en-US');
  expect(t('營運總覽')).toBe('Operations overview');
  expect(t('我自行建立的儀表板')).toBe('我自行建立的儀表板');
  jest.isolateModules(() => { expect(require('./i18n').getLanguage()).toBe('en'); });
  unsubscribe();
});

test('dynamic messages and SVG previews translate without altering canonical data', () => {
  expect(translateText('assignment.action', 'zh')).toBe('交辦');
  expect(translateText('assignment.action', 'en')).toBe('Assign');
  expect(translateText('擁有權限者：展示管理員, 陳怡安', 'en')).toBe('Authorized: Demo administrator, Yi-An Chen');
  expect(translateText('確定要移除 陳怡安 嗎？', 'en')).toBe('Remove Yi-An Chen?');
  expect(translateText('2 陳怡安', 'en')).toBe('2 Yi-An Chen');
  const image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg><text>工時效率</text></svg>');
  expect(decodeURIComponent(translateText(image, 'en'))).toContain('Labor efficiency');
  expect(translateText(image, 'zh')).toBe(image);
});

function Probe() {
  useLanguage();
  const [draft, setDraft] = useState('Draft');
  return <><DemoBanner /><h1>{t('營運總覽')}</h1><input aria-label="Draft" value={draft} onChange={event => setDraft(event.target.value)} /></>;
}

test('the language buttons update the interface and page metadata without clearing form state', () => {
  render(<LanguageProvider><Probe /></LanguageProvider>);
  fireEvent.change(screen.getByLabelText('Draft'), { target: { value: 'My quarterly dashboard' } });
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(screen.getByRole('heading').textContent).toBe('Operations overview');
  expect(screen.getByRole('button', { name: 'English' }).getAttribute('aria-pressed')).toBe('true');
  expect((screen.getByLabelText('Draft') as HTMLInputElement).value).toBe('My quarterly dashboard');
  expect(document.documentElement.lang).toBe('en');
  expect(document.title).toContain('Smart Operations');
  fireEvent.click(screen.getByRole('button', { name: '中文' }));
  expect(screen.getByRole('heading').textContent).toBe('營運總覽');
  expect(getLanguage()).toBe('zh');
});
