/// <reference types="jest" />
import { chartHTML, chartComposition } from './chart';
import { setLanguage } from './i18n';

const messageHandlers: EventListener[] = [];
const originalAddEventListener = window.addEventListener.bind(window);
beforeEach(() => {
  setLanguage('zh');
  jest.spyOn(window, 'addEventListener').mockImplementation((type: string, listener: any, options?: any) => {
    if (type === 'message') messageHandlers.push(listener);
    originalAddEventListener(type, listener, options);
  });
});

function renderChart(id: number) {
  document.body.innerHTML = chartHTML('測試指標', id);
  const script = document.querySelector('script')!.textContent!;
  // Execute the same self-contained script that runs inside the real iframe.
  new Function(script)();
}

function select(selector: string, value: string) {
  const control = document.querySelector(selector) as HTMLSelectElement;
  control.value = value;
  control.dispatchEvent(new Event('change'));
}

afterEach(() => {
  messageHandlers.splice(0).forEach(handler => window.removeEventListener('message', handler));
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

test('the overview has distinct bar, line and pie charts on first render', () => {
  renderChart(10);
  expect(document.querySelectorAll('rect')).toHaveLength(12);
  expect(document.querySelector('svg')!.getAttribute('aria-label')).toContain('長條圖');
  renderChart(11);
  expect(document.querySelector('polyline')).not.toBeNull();
  expect(document.querySelectorAll('circle')).toHaveLength(12);
  renderChart(14);
  expect(document.querySelectorAll('path[data-slice]')).toHaveLength(4);
  expect(document.querySelector('.caption')!.textContent).toContain('成本差異來源占比');
  expect(document.querySelector('.legend')!.textContent).toContain('原料成本');
});

test('switching chart types retains the chosen month range and updates data points', () => {
  renderChart(10);
  select('#months', '3');
  expect(document.querySelectorAll('rect')).toHaveLength(3);
  expect(document.querySelector('.caption')!.textContent).toContain('10月 — 12月');
  select('#kind', 'line');
  expect(document.querySelectorAll('circle')).toHaveLength(3);
  select('#kind', 'pie');
  expect(document.querySelectorAll('path[data-slice]')).toHaveLength(4);
  expect(document.querySelector('.caption')!.textContent).toContain('10月 — 12月');
  select('#kind', 'bar');
  expect(document.querySelectorAll('rect')).toHaveLength(3);
});

test('pie categories use period-specific totals and reveal amounts through keyboard focus', () => {
  const annual = chartComposition(14, 12);
  const quarter = chartComposition(14, 3);
  expect(quarter.values.every(value => value > 0)).toBe(true);
  expect(quarter.values.reduce((a, b) => a + b, 0)).toBeLessThan(annual.values.reduce((a, b) => a + b, 0));
  renderChart(14);
  const first = document.querySelector('g[tabindex]')!;
  first.dispatchEvent(new Event('focus'));
  expect(document.querySelector('#detail')!.textContent).toContain('原料成本');
  expect(document.querySelector('#detail')!.textContent).toContain('元');
  const oldLabel = first.getAttribute('aria-label');
  select('#months', '3');
  expect(document.querySelector('g[tabindex]')!.getAttribute('aria-label')).not.toBe(oldLabel);
});

test('chart titles cannot inject executable HTML into the iframe', () => {
  const html = chartHTML('<img src=x onerror="alert(1)">', 10);
  document.body.innerHTML = html;
  expect(document.querySelector('img')).toBeNull();
});

test('live language changes translate charts and retain their selected type and period', () => {
  renderChart(14);
  select('#months', '3');
  window.dispatchEvent(new MessageEvent('message', { source: window, data: { type: 'demo-language', language: 'en' } }));
  expect(document.querySelector('.caption')!.textContent).toBe('Cost variance breakdown · Oct — Dec');
  expect(document.querySelector('.legend')!.textContent).toContain('Materials');
  expect((document.querySelector('#kind') as HTMLSelectElement).value).toBe('pie');
  expect((document.querySelector('#months') as HTMLSelectElement).value).toBe('3');
  expect(document.querySelector('#kind')!.getAttribute('aria-label')).toBe('Chart type');
  select('#kind', 'bar');
  expect(document.querySelectorAll('rect')).toHaveLength(3);
  expect(document.querySelector('svg')!.textContent).toContain('Oct');
  window.dispatchEvent(new MessageEvent('message', { source: window, data: { type: 'demo-language', language: 'zh' } }));
  expect(document.querySelector('.caption')!.textContent).toContain('10月 — 12月');
  expect((document.querySelector('#kind') as HTMLSelectElement).value).toBe('bar');
});
