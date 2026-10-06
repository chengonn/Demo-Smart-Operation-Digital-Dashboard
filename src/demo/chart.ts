// Self-contained interactive chart: no chart server or CDN is required.
export const chartValues = [82, 86, 84, 91, 89, 95, 93, 96, 94, 98, 97, 99];

export function chartSeries(id: number) {
  return chartValues.map((value, i) => {
    const scaled = id === 12 ? 4.1 - i * 0.15 : id === 13 ? 3.2 - i * 0.1 : id === 14 ? 7 - i * 0.4 : id === 15 ? 120 + i * 3 : id === 16 ? 2.4 + i * 0.15 : id === 17 ? 3200 - i * 80 : id === 11 ? value - 5 : value;
    return Math.round(scaled * 100) / 100;
  });
}
export const chartUnit = (id: number) => id === 15 ? '元' : id === 16 ? '次' : id === 17 ? '件' : '%';

export function chartHTML(name: string, id: number): string {
  const safeName = name.replace(/[<>&"']/g, '');
  const values = chartSeries(id);
  const unit = chartUnit(id);
  return `<!DOCTYPE html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>*{box-sizing:border-box}body{margin:0;padding:18px;font:14px system-ui;color:#26354b;background:#fff}header{display:flex;align-items:center;justify-content:space-between;gap:10px}h2{font-size:18px;margin:0}select{padding:6px;border:1px solid #ddd;border-radius:6px}small{color:#68778c}.metric{font-size:30px;font-weight:700;margin:10px 0 0;color:#3163b3}svg{width:100%;height:150px}circle{cursor:pointer}footer{display:flex;justify-content:space-between;font-size:12px;color:#68778c}</style>
  <header><h2>${safeName}</h2><select aria-label="顯示月份"><option value="12">全年</option><option value="6">近六個月</option><option value="3">近三個月</option></select></header>
  <div class="metric"></div><small>2026 年 · 示範資料</small><svg viewBox="0 0 600 150" role="img" aria-label="${safeName}月度趨勢"></svg><footer><span id="range"></span><span id="detail">將滑鼠移至資料點查看數值</span></footer>
  <script>const all=${JSON.stringify(values)};const select=document.querySelector('select');function draw(){const n=Number(select.value),v=all.slice(-n);document.querySelector('.metric').textContent=v[v.length-1]+'${unit}';document.querySelector('#range').textContent=(13-n)+'月 — 12月';const low=Math.min(...all)*0.85,high=Math.max(...all)*1.08;const points=v.map((y,i)=>[30+i*540/(n-1),130-(y-low)/(high-low)*110]);document.querySelector('svg').innerHTML='<path d="M30 130H570 M30 80H570 M30 30H570" stroke="#e8edf5" fill="none"/><polyline points="'+points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#3163b3" stroke-width="3"/>'+points.map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#e4b624"><title>'+(13-n+i)+'月：'+v[i]+'${unit}</title></circle>').join('');}select.onchange=draw;draw();</script></html>`;
}

export function chartURL(name: string, id: number): string {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(chartHTML(name, id));
}

export function chartPreview(name: string): string {
  const label = name.replace(/[<>&"']/g, '');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#f4f7fc"/><polyline points="20,160 80,130 140,145 200,90 260,105 320,60 380,30" fill="none" stroke="#3163b3" stroke-width="5"/><text x="20" y="30" font-size="18" fill="#26354b">${label}</text></svg>`);
}
