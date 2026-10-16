import { englishMessages, getLanguage } from './i18n';
// Self-contained SVG charts; the demo needs no chart server or CDN.
export type ChartKind = 'bar' | 'pie' | 'line';
export const chartValues = [82, 86, 84, 91, 89, 95, 93, 96, 94, 98, 97, 99];
export const defaultChartKind = (id: number): ChartKind => id === 12 || id === 14 ? 'pie' : id === 11 || id === 16 ? 'line' : 'bar';
export function chartSeries(id: number) {
  return chartValues.map((value, i) => {
    const scaled = id === 12 ? 4.1 - i * 0.15 : id === 13 ? 3.2 - i * 0.1 : id === 14 ? 7 - i * 0.4 : id === 15 ? 120 + i * 3 : id === 16 ? 2.4 + i * 0.15 : id === 17 ? 3200 - i * 80 : id === 11 ? value - 5 : value;
    return Math.round(scaled * 100) / 100;
  });
}
export const chartUnit = (id: number) => id === 15 ? '元' : id === 16 ? '次' : id === 17 ? '件' : '%';

export function chartComposition(id: number, months = 12) {
  const definitions: Record<number, { title: string; labels: string[]; base: number[]; unit: string }> = {
    10: { title: '各產線產量占比', labels: ['A 產線', 'B 產線', 'C 產線', 'D 產線'], base: [420, 310, 180, 90], unit: '件' },
    11: { title: '工時分配占比', labels: ['生產作業', '設備換線', '保養維護', '等待時間'], base: [160, 32, 20, 12], unit: '小時' },
    12: { title: '退貨原因占比', labels: ['外觀瑕疵', '尺寸誤差', '包裝破損', '其他原因'], base: [42, 28, 18, 12], unit: '件' },
    13: { title: '委外退貨供應商占比', labels: ['供應商 A', '供應商 B', '供應商 C', '供應商 D'], base: [32, 25, 18, 10], unit: '件' },
    14: { title: '成本差異來源占比', labels: ['原料成本', '人工成本', '製造費用', '物流成本'], base: [4200, 2800, 1800, 1200], unit: '元' },
    15: { title: '採購金額占比', labels: ['原物料', '零組件', '包裝材料', '耗材'], base: [5200, 3100, 1400, 800], unit: '元' },
    16: { title: '商品銷售量占比', labels: ['A 類商品', 'B 類商品', 'C 類商品', 'D 類商品'], base: [340, 260, 190, 120], unit: '件' },
    17: { title: '庫存品類占比', labels: ['原物料', '半成品', '成品', '備品'], base: [1200, 820, 960, 220], unit: '件' },
  };
  const definition = definitions[id] || definitions[10];
  const count = Math.max(1, Math.min(12, Math.floor(months)));
  const values = definition.base.map((base, category) => Array.from({ length: count }, (_, index) => {
    const month = 12 - count + index;
    return Math.round(base * (1 + ((month * (category + 2) + category * 3) % 9 - 4) * 0.035));
  }).reduce((sum, value) => sum + value, 0));
  return { title: definition.title, labels: definition.labels, unit: definition.unit, values };
}

export function chartHTML(name: string, id: number): string {
  const safeName = name.replace(/[<>&"']/g, '');
  const compositions = [12, 6, 3].map(months => [months, chartComposition(id, months)]);
  const composition = chartComposition(id);
  const keys = [safeName, composition.title, ...composition.labels, chartUnit(id), composition.unit, '圖表類型', '顯示月份', '長條圖', '圓餅圖', '折線圖', '全年', '近六個月', '近三個月', '12 月指標 · 2026 年模擬數據', '滑鼠移至圖形或以 Tab 選取，查看數值', '各月數值比較', '月度變化趨勢', '月度長條圖', '月度折線圖', '分類占比'];
  const words = Object.fromEntries(keys.map(key => [key, englishMessages[key] || key]));
  return `<!DOCTYPE html><html lang="${getLanguage() === 'en' ? 'en' : 'zh-Hant'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
  *{box-sizing:border-box}body{margin:0;padding:14px;font:13px system-ui;color:#26354b;background:#fff;height:100vh;display:flex;flex-direction:column;gap:6px}
  header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;padding-right:42px;flex-shrink:0}h2{font-size:16px;margin:0;line-height:1.4}.controls{display:flex;gap:6px}select{max-width:125px;padding:4px;border:1px solid #d7deea;border-radius:6px;background:#fff;color:#334765;font:12px system-ui;cursor:pointer}select:focus-visible{outline:2px solid #3163b3;outline-offset:2px}
  .summary{display:flex;align-items:baseline;gap:10px;flex-shrink:0}.metric{font-size:26px;line-height:32px;font-weight:700;color:#3163b3}small,.caption{font-size:11px;color:#68778c}.caption{margin:0;flex-shrink:0}.visual{flex:1;min-height:65px}svg{width:100%;height:100%;display:block;overflow:visible}.pie-grid{display:grid;grid-template-columns:43% 57%;height:100%;align-items:center;gap:5px}.legend{list-style:none;margin:0;padding:0 8px 0 0;font-size:11px}.legend li{display:grid;grid-template-columns:9px 1fr auto;gap:6px;align-items:center;padding:4px 0}.swatch{width:9px;height:9px;border-radius:3px}.legend strong{font-variant-numeric:tabular-nums}footer{font-size:10px;color:#68778c;min-height:14px;flex-shrink:0}g[tabindex]{cursor:crosshair;outline:none}g[tabindex]:hover,g[tabindex]:focus{filter:brightness(.85)}
  @media(max-width:360px){body{padding:10px}h2{font-size:14px}.legend{font-size:10px}.summary{gap:6px}small{font-size:10px}}
  </style>
  <header><h2>${safeName}</h2><div class="controls"><select id="kind" aria-label="圖表類型"><option value="bar">長條圖</option><option value="pie">圓餅圖</option><option value="line">折線圖</option></select><select id="months" aria-label="顯示月份"><option value="12">全年</option><option value="6">近六個月</option><option value="3">近三個月</option></select></div></header>
  <div class="summary"><span class="metric"></span><small>12 月指標 · 2026 年模擬數據</small></div><p class="caption"></p><div class="visual" id="chart"></div><footer id="detail" aria-live="polite">滑鼠移至圖形或以 Tab 選取，查看數值</footer>
  <script>
  (function(){
    const all=${JSON.stringify(chartSeries(id))},unit=${JSON.stringify(chartUnit(id))},name=${JSON.stringify(safeName)};
    const compositions=Object.fromEntries(${JSON.stringify(compositions)}),palette=['#3163b3','#24a69a','#e4b624','#9677cb'];
    const kind=document.querySelector('#kind'),months=document.querySelector('#months'),chart=document.querySelector('#chart'),caption=document.querySelector('.caption'),detail=document.querySelector('#detail');
    kind.value=${JSON.stringify(defaultChartKind(id))};
    let language=${JSON.stringify(getLanguage())};const words=${JSON.stringify(words)};
    const tr=text=>language==='en'?(words[text]||text):text;
    const monthLabel=number=>language==='en'?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][number-1]:number+'月';
    const fmt=value=>value.toLocaleString(language==='en'?'en-US':'zh-TW',{maximumFractionDigits:2});
    const valueLabel=(value,unit)=>fmt(value)+(language==='en'&&unit!=='%'?' ':'')+tr(unit);
    function mark(shape,text){return '<g tabindex="0" role="img" aria-label="'+text+'" data-tip="'+text+'">'+shape+'<title>'+text+'</title></g>';}
    function draw(){
      const n=Number(months.value),values=all.slice(-n),start=13-n,range=monthLabel(start)+' — '+monthLabel(12);
      document.documentElement.lang=language==='en'?'en':'zh-Hant';
      document.querySelector('h2').textContent=tr(name);
      document.querySelector('.summary small').textContent=tr('12 月指標 · 2026 年模擬數據');
      kind.setAttribute('aria-label',tr('圖表類型'));months.setAttribute('aria-label',tr('顯示月份'));
      ['長條圖','圓餅圖','折線圖'].forEach((label,i)=>kind.options[i].textContent=tr(label));
      ['全年','近六個月','近三個月'].forEach((label,i)=>months.options[i].textContent=tr(label));
      document.querySelector('.metric').textContent=valueLabel(all[11],unit);
      detail.textContent=tr('滑鼠移至圖形或以 Tab 選取，查看數值');
      chart.dataset.kind=kind.value;
      if(kind.value==='pie'){
        const data=compositions[n],total=data.values.reduce((a,b)=>a+b,0);let angle=-Math.PI/2;
        const slices=data.values.map((value,i)=>{
          const next=angle+value/total*2*Math.PI,x1=90+70*Math.cos(angle),y1=85+70*Math.sin(angle),x2=90+70*Math.cos(next),y2=85+70*Math.sin(next);
          const path='M90 85 L'+x1+' '+y1+' A70 70 0 '+(next-angle>Math.PI?1:0)+' 1 '+x2+' '+y2+' Z';angle=next;
          return mark('<path data-slice="'+i+'" d="'+path+'" fill="'+palette[i]+'" stroke="white" stroke-width="2"/>',tr(data.labels[i])+(language==='en'?': ':'：')+valueLabel(value,data.unit)+(language==='en'?' (':'（')+(value/total*100).toFixed(1)+(language==='en'?'%)':'%）'));
        }).join('');
        const legend=data.labels.map((label,i)=>'<li><span class="swatch" style="background:'+palette[i]+'"></span><span>'+tr(label)+'</span><strong>'+(data.values[i]/total*100).toFixed(1)+'%</strong></li>').join('');
        chart.innerHTML='<div class="pie-grid"><svg viewBox="0 0 190 170" role="img" aria-label="'+tr(data.title)+'">'+slices+'</svg><ul class="legend" aria-label="'+tr('分類占比')+'">'+legend+'</ul></div>';
        caption.textContent=tr(data.title)+' · '+range;
      }else{
        const floor=kind.value==='bar'?0:Math.floor(Math.min(...all)*.85*100)/100,ceiling=Math.max(...all)*1.12,span=ceiling-floor;
        const y=value=>142-(value-floor)/span*130;
        let grid='';for(let i=0;i<3;i++){const value=floor+span*i/2,pos=y(value);grid+='<path d="M48 '+pos+'H590" stroke="#e8edf5"/><text x="42" y="'+(pos+4)+'" text-anchor="end" font-size="10" fill="#68778c">'+fmt(value)+'</text>';}
        const step=540/values.length,points=values.map((value,i)=>[48+step*(i+.5),y(value)]);
        let shapes='';
        if(kind.value==='bar')shapes=points.map((point,i)=>mark('<rect data-bar="'+i+'" x="'+(point[0]-step*.3)+'" y="'+point[1]+'" width="'+step*.6+'" height="'+(142-point[1])+'" rx="3" fill="'+(i===values.length-1?palette[2]:palette[0])+'"/>',monthLabel(start+i)+(language==='en'?': ':'：')+valueLabel(values[i],unit))).join('');
        else shapes='<polyline data-line="true" points="'+points.map(point=>point.join(',')).join(' ')+'" fill="none" stroke="'+palette[0]+'" stroke-width="3"/>'+points.map((point,i)=>mark('<circle cx="'+point[0]+'" cy="'+point[1]+'" r="4" fill="'+palette[1]+'"/>',monthLabel(start+i)+(language==='en'?': ':'：')+valueLabel(values[i],unit))).join('');
        const labels=points.map((point,i)=>'<text x="'+point[0]+'" y="161" text-anchor="middle" font-size="10" fill="#68778c">'+monthLabel(start+i)+'</text>').join('');
        chart.innerHTML='<svg viewBox="0 0 600 170" role="img" aria-label="'+tr(name)+tr(kind.value==='bar'?'月度長條圖':'月度折線圖')+'">'+grid+shapes+labels+'</svg>';
        caption.textContent=range+' · '+tr(kind.value==='bar'?'各月數值比較':'月度變化趨勢')+' ('+tr(unit)+')';
      }
      chart.querySelectorAll('[data-tip]').forEach(node=>{const show=()=>{detail.textContent=node.dataset.tip;};node.addEventListener('mouseenter',show);node.addEventListener('focus',show);});
    }
    window.addEventListener('message',event=>{if(event.source===window.parent&&event.data?.type==='demo-language'&&['zh','en'].includes(event.data.language)){language=event.data.language;draw();}});
    kind.addEventListener('change',draw);months.addEventListener('change',draw);draw();
  })();
  </script></html>`;
}

export function chartURL(name: string, id: number): string {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(chartHTML(name, id));
}

export function chartPreview(name: string, id = 10): string {
  const label = name.replace(/[<>&"']/g, '');
  const kind = defaultChartKind(id);
  const shape = kind === 'pie'
    ? '<circle cx="200" cy="115" r="60" fill="#3163b3"/><path d="M200 115 L200 55 A60 60 0 0 1 260 115 Z" fill="#e4b624"/><path d="M200 115 L260 115 A60 60 0 0 1 200 175 Z" fill="#24a69a"/>'
    : kind === 'bar'
    ? '<g fill="#3163b3"><rect x="40" y="100" width="45" height="70" rx="4"/><rect x="110" y="75" width="45" height="95" rx="4"/><rect x="180" y="90" width="45" height="80" rx="4"/><rect x="250" y="50" width="45" height="120" rx="4"/></g><rect x="320" y="40" width="45" height="130" rx="4" fill="#e4b624"/>'
    : '<polyline points="20,160 80,130 140,145 200,90 260,105 320,60 380,50" fill="none" stroke="#3163b3" stroke-width="5"/>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#f4f7fc"/>'+shape+'<text x="20" y="30" font-size="18" fill="#26354b">'+label+'</text></svg>');
}
