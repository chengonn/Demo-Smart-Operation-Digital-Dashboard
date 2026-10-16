# 智慧營運數位儀表板｜靜態作品展示

展示網址：https://chengonn.github.io/Demo-Smart-Operation-Digital-Dashboard/

本分支 `codex/static-demo` 由原專案的 development 分支建立，保留既有 React 頁面，改用瀏覽器內的虛構資料；無需啟動後端或登入 Google。

## 展示功能

- 營運總覽與品質採購儀表板，預設混合長條圖、圓餅圖與折線圖；各圖皆可切換圖型、篩選月份及查看數值，並保留 CSV 匯出。
- 圓餅圖使用對應的分類模擬數據（例如成本差異來源、退貨原因、庫存品類），顯示占比與原始數值。更新圖型時會保留瀏覽器中既有的儀表板與操作資料。
- 示範交辦事項：建立訊息、回覆、完成與刪除。
- 群組、成員、圖表權限、使用者申請、KPI 申請與警示設定。
- 智慧分析頁：明確標示為預先編寫的模擬回覆，不使用 AI API。
- 頁面預設使用開發者展示帳號，所有管理功能可瀏覽。

修改僅存在訪客自己的 localStorage，其他人不會看到；可用頁面上方「重設示範資料」還原。首次開啟直接顯示儀表板。使用者自行輸入的展示内容僅保存在該瀏覽器。

頁面上方提供中文 / English 切換，語言選擇會保存在此瀏覽器；導覽、表單、示範內容、操作提示、圖表與匯出欄位皆提供雙語顯示。切換語言會保留表單內容，以及圖表目前的圖型和月份篩選。

## 本機執行

```sh
npm ci --legacy-peer-deps
npm start
```

## 驗證與建置

```sh
npm test -- --watchAll=false --runInBand --testMatch '**/src/**/*.test.ts' '**/src/**/*.test.tsx'
npx tsc --noEmit
npm run build
node scripts/preview.cjs
```

預覽會在 `http://127.0.0.1:4173/Demo-Smart-Operation-Digital-Dashboard/` 提供 build 靜態檔案，模擬 GitHub Pages 子路徑。

## 部署

`.github/workflows/pages.yml` 在推送 `codex/static-demo` 時建置與部署。儲存庫 Settings → Pages 的 Source 使用 GitHub Actions。

`homepage` 使用相對路徑，HashRouter 保留 `#/home` 等連結。API 請求經由 `src/demo/api.ts` 的 Axios adapter 在本機回覆；互動圖表由 `src/demo/chart.ts` 產生，不依賴外部圖表伺服器或 CDN。示範版不上傳圖表程式碼；新增圖表會產生內建示範圖表。

原專案：https://github.com/chengonn/smart-operation-digital-dashboard-frontend
