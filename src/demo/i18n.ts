export type Language = 'zh' | 'en';
export const LANGUAGE_KEY = 'smart-dashboard-language';
function readLanguage(): Language { try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh'; } catch { return 'zh'; } }
let language = readLanguage();
const listeners = new Set<() => void>();
export const getLanguage = () => language;
export const getLocale = () => language === 'en' ? 'en-US' : 'zh-TW';
export const subscribeLanguage = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function setLanguage(next: Language) {
  if (next !== 'zh' && next !== 'en') return;
  if (language === next) return;
  language = next;
  try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Preference remains available in memory. */ }
  listeners.forEach(listener => listener());
}

// Canonical Chinese values stay in storage and filters; only displayed text changes.
export const englishMessages: Record<string, string> = Object.fromEntries(String.raw`
作品展示版|Portfolio demo
展示版說明|About this demo
· 全站使用虛構示範資料，操作僅保存在此瀏覽器；郵件與 AI 回覆為模擬。|· All data is fictional. Changes stay in this browser; messages and AI replies are simulated.
重設示範資料|Reset demo data
重設此瀏覽器的示範資料？|Reset the demo data in this browser?
語言|Language
智慧儀表板系統|Smart Operations Dashboard
智慧營運數位儀表板|Smart Operations Dashboard
智慧營運數位儀表板｜作品展示|Smart Operations Dashboard | Demo
數位儀表板|Dashboard
交辦事項|Tasks
圖表管理|Chart management
權限管理|Permissions
帳號管理|Accounts
查看圖表申請|KPI requests
群組管理|Groups
個人資料|Profile
營運總覽|Operations overview
品質與採購|Quality & procurement
營運績效與生產效率的示範儀表板|A demo dashboard for operational performance and production efficiency
品質及供應鏈指標|Quality and supply chain metrics
產量達成率|Production target achievement
工時效率|Labor efficiency
退貨率|Return rate
委外退貨率|Subcontractor return rate
成本差異率|Cost variance rate
採購單價|Purchase unit price
周轉率|Turnover rate
庫存水位|Inventory levels
長條圖|Bar chart
圓餅圖|Pie chart
折線圖|Line chart
圖表類型|Chart type
顯示月份|Period
全年|Full year
近六個月|Last 6 months
近三個月|Last 3 months
12 月指標 · 2026 年模擬數據|December metric · Simulated data for 2026
滑鼠移至圖形或以 Tab 選取，查看數值|Hover or use Tab to inspect values
各月數值比較|Monthly comparison
月度變化趨勢|Monthly trend
月度長條圖| monthly bar chart
月度折線圖| monthly line chart
分類占比|Category breakdown
各產線產量占比|Production share by line
A 產線|Line A
B 產線|Line B
C 產線|Line C
D 產線|Line D
工時分配占比|Working hours breakdown
生產作業|Production
設備換線|Changeovers
保養維護|Maintenance
等待時間|Idle time
退貨原因占比|Returns by reason
外觀瑕疵|Visual defects
尺寸誤差|Size deviations
包裝破損|Packaging damage
其他原因|Other reasons
委外退貨供應商占比|Subcontractor returns by supplier
供應商 A|Supplier A
供應商 B|Supplier B
供應商 C|Supplier C
供應商 D|Supplier D
成本差異來源占比|Cost variance breakdown
原料成本|Materials
人工成本|Labor
製造費用|Overheads
物流成本|Logistics
採購金額占比|Purchase spend breakdown
原物料|Raw materials
零組件|Components
包裝材料|Packaging
耗材|Consumables
商品銷售量占比|Sales volume by category
A 類商品|Category A
B 類商品|Category B
C 類商品|Category C
D 類商品|Category D
庫存品類占比|Inventory by category
半成品|Work in progress
成品|Finished goods
備品|Spare parts
元|TWD
件|units
次|times
小時|hours
展示管理員|Demo administrator
陳怡安|Yi-An Chen
林柏宇|Po-Yu Lin
王佳蓉|Chia-Jung Wang
許承恩|Cheng-En Hsu
營運管理部|Operations
生產管理部|Production
營運主管|Operations manager
專員|Specialist
營運管理團隊|Operations team
生產與品質團隊|Production & quality team
追蹤本月產量達成率|Track this month's production target
工時效率改善計畫|Labor efficiency improvement plan
退貨原因檢討|Review return reasons
品質改善成果確認|Review quality improvement results
請確認本月指標，整理改善方向並回覆。此為展示訊息。|Review this month's metrics and reply with improvement ideas. This is a demo message.
申請季度營運分析所需的 KPI|Request KPIs for quarterly operations analysis
追蹤營運改善成效|Track operational improvements
示範操作已完成（僅儲存於此瀏覽器）|Demo action completed (saved only in this browser)
這是預先編寫的示範分析，未呼叫 AI 服務。\n\n本期指標整體上升，建議持續追蹤工時效率、品質異常與庫存水位，並將改善任務交辦給負責人。|This is a prewritten demo analysis. No AI service was called.\n\nOverall performance is improving. Continue monitoring labor efficiency, quality issues, and inventory levels, and assign follow-up tasks to the responsible team members.
新儀表板|New dashboard
儀表板名稱|Dashboard name
請輸入儀表板名稱|Enter a dashboard name
請輸入儀表板說明文字|Enter a dashboard description
填寫儀表板說明文字|Add a dashboard description
設定儀表板|Configure dashboard
刪除儀表板|Delete dashboard
設定名稱|Rename
說明文字|Description
選擇想顯示在此儀表板的圖表|Choose charts for this dashboard
或是點此申請無權限圖表|Request access to a restricted chart
選擇圖表|Select charts
圖表|Chart
圖表名稱|Chart name
(不可觀察)|(restricted)
沒有可用的圖表|No charts available
您還未新增任何圖表，請點設定儀表板以新增圖表。|No charts yet. Configure the dashboard to add charts.
申請KPI圖表|Request KPI access
申請表單|Request form
欲申請圖表|Requested chart
您的保證人|Your sponsor
請填寫此次申請理由|Describe why you need access
請選擇圖表|Select a chart
開始日期|Start date
結束日期|End date
請選擇開始時間|Choose a start date
請選擇結束時間|Choose an end date
上一步|Back
下一步|Next
確定|OK
刪除|Delete
重新嘗試|Try again
id 缺失|ID is missing.
確認|Confirm
取消|Cancel
關閉|Close
關閉表單|Close form
關閉側邊欄|Close sidebar
新增|Add
新增圖表|Add chart
匯出|Export
交辦|Assigned by me
被交辦|Assigned to me
待處理|Pending
已完成|Completed
進階分析|Advanced analysis
撰寫郵件交辦|Assign a task
標題|Subject
指定負責人|Assignee
請輸入郵件內容...|Enter a message...
提交|Submit
發送|Send
傳送|Send
輸入你的内容...|Type your message...
尚無訊息|No messages yet
今天|Today
將此任務標記為已完成|Mark task as completed
刪除已完成的郵件|Delete completed task
不可更改為相同的處理狀態|This task already has that status.
此信件已經是已完成狀態|This task is already completed.
確定要將此郵件標記為已完成嗎？|Mark this task as completed?
確定要刪除此郵件嗎？|Delete this task?
郵件非已完成狀態，無法刪除|Only completed tasks can be deleted.
無法刪除郵件，請稍後再試|Could not delete the task. Please try again.
無法更新狀態，請稍後再試|Could not update the status. Please try again.
狀態已更新為已完成|Task marked as completed.
使用者控制|User management
待審核帳號列表|Pending account requests
待審核清單|Pending approvals
姓名|Name
所屬部門|Department
職稱|Position
職位|Position
信箱|Email
信箱 (Gmail)|Email (Gmail)
電子郵箱|Email
身份|Role
狀態|Status
操作|Actions
開通|Approve
移除|Remove
全部|All
部門：全部|All departments
啟用|Enable
停用|Disabled
啟用中|Active
停用中|Disabled
篩選狀態|Filter by status
搜尋|Search
輸入以快速搜尋|Type to search
沒有更多了|No more results
沒有更多用戶|No more users
新增群組|New group
請輸入群組名稱|Enter a group name
編輯群組名稱|Rename group
請輸入新的群組名稱|Enter a new group name
群組成員|Members
群組可視圖表|Visible charts
新增成員|Add members
刪除群組|Delete group
目前查無群組|No groups found
查無成員|No members found
查無圖表|No charts found
可選用戶|Available users
已選用戶|Selected users
選擇用戶|Select users
或輸入文字以查找...|Type to search...
確定要刪除此群組嗎？|Delete this group?
確定要刪除此圖表嗎？|Remove this chart?
確定要刪除嗎？|Delete this item?
群組 1|Group 1
交辦權限管理|Assignment permissions
匯出權限管理|Export permissions
交辦事項權限設置|Assignment access
匯出資料權限設置|Export access
設置交辦權限|Configure assignment access
設置匯出權限|Configure export access
無權限設置|No permissions configured
點擊可以設定警訊上下限|Configure KPI alert thresholds
警訊|Alert
最低值|Lower limit
最高值|Upper limit
若數值超過此區間|When a value falls outside this range,
系統會發送異常信件通知您|the system sends an alert message.
選擇稽核者|Select a reviewer
選擇處理者|Select an assignee
未指定|Unassigned
申請記錄 －|Request history —
正在啓用|Currently active
申請未通過|Rejected
申請已通過|Approved
已關閉|Closed
申請人|Applicant
保證人|Sponsor
開始日|Start date
到期日|Expiry date
申請內容|Request details
核准|Approve
申請人:|Applicant:
保證人:|Sponsor:
開始日期:|Start date:
結束日期:|End date:
申請內容:|Request details:
您的個人資料|Your profile
修改資料|Edit profile
員工編號|Employee number
工號|Employee number
非必填|Optional
選擇您的部門|Choose your department
選擇部門|Select a department
請選擇|Select an option
保存變更|Save changes
登出|Sign out
新圖表名稱|New chart name
請輸入新圖表的名稱|Enter a chart name
圖表程式碼上傳|Upload chart code
圖表示意圖上傳|Upload a chart preview
上傳示意圖|Upload preview
圖表程式碼|Chart code
查看圖表|View chart
示意圖缺失|Preview unavailable
圖片圖標|Image icon
程式碼圖標|Code icon
更多|More
更多操作|More actions
選擇|Select
智慧分析對話框|Analysis chat
清空|Clear history
請輸入您的問題|Ask a question
AI 建議正在生成中|Generating analysis...
加載中|Loading...
發生錯誤，請稍後再試。|Something went wrong. Please try again.
您確定要刪除 AI 分析紀錄嗎？|Clear the analysis history?
無法發送訊息，因為 AI 分析 ID 為 null。|Start a new analysis before sending a message.
對話|Chat
分析|Analysis
以展示帳號進入|Enter the demo
探索營運圖表、交辦事項與管理功能。無需 Google 帳號，所有內容均為示範資料。|Explore operational charts, tasks, and management features. No Google account is needed; all data is simulated.
回首頁|Back to home
抱歉 我們找不到您要的頁面|Sorry, we could not find that page.
歡迎回到智慧儀表板系統!|Welcome to the Smart Operations Dashboard!
填寫資料以完成註冊|Complete your profile to register
等待管理員審核|Awaiting approval
您的資料已經提交，請等待管理員審核。|Your information has been submitted. Please wait for administrator approval.
訪客|Guest
日期|Date
完成|Done
返回|Back
無權限|No access
無權限者|No access
一般使用者|User
職員|User
管理員|Administrator
開發者|Developer
DEVELOPER|Developer
ADMIN|Administrator
USER|User
NO_PERMISSION|No access
您的資料更新成功！|Your profile was updated.
無法更新資料，請重新嘗試|Could not update the profile. Please try again.
找不到用戶或用戶ID缺失。|The user could not be found.
未填寫使用者ID|User ID is required.
未填寫所屬部門|Department is required.
用戶ID缺失。|User ID is missing.
數據匯出成功！|Data exported successfully.
匯出過程中發生錯誤。請再試一次。|Export failed. Please try again.
請先選擇一個圖表。|Select a chart first.
請輸入儀表板名稱。|Enter a dashboard name.
請選擇一個圖表進行申請|Select a chart to request access.
請選擇一個圖表進行申請。|Select a chart to request access.
請求提交成功|Request submitted.
提交失敗，請重試。|Submission failed. Please try again.
提交 KPI 請求失敗。請重試。|Could not submit the KPI request. Please try again.
儀表板創建成功|Dashboard created.
儀表板更新成功|Dashboard updated.
儀表板創建或更新失敗。請重試。|Could not save the dashboard. Please try again.
無效的儀表板 ID|Invalid dashboard ID.
圖表已成功新增到儀表板|Charts added to the dashboard.
新增圖表失敗 請重試|Could not add the chart. Please try again.
您沒有查看此圖表的權限，若有需要請點擊申請|You do not have access to this chart. Submit an access request if needed.
您沒有權限交辦此圖表|You do not have permission to assign this chart.
您沒有權限可以操作此功能|You do not have permission to use this feature.
交辦發送成功|Task assigned successfully.
創建郵件失敗，且無法取得錯誤訊息。|Could not create the task.
申請已批准|Request approved.
申請已刪除|Request deleted.
申請已關閉|Request closed.
批准申請失敗|Could not approve the request.
刪除申請失敗|Could not delete the request.
關閉申請失敗|Could not close the request.
獲取申請失敗|Could not load requests.
加載數據時出錯|Could not load data.
加載用戶信息失敗，請稍後再試。|Could not load users. Please try again.
未知錯誤|Unknown error
無法獲取儀表板圖表。請稍後再試。|Could not load dashboard charts. Please try again.
進行進階分析時發生錯誤。請稍後再試。|Could not open advanced analysis. Please try again.
獲取儀表板詳情失敗，請稍後再試|Could not load the dashboard. Please try again.
獲取可用圖表失敗 請稍後再試|Could not load available charts. Please try again.
無法取得圖表 請稍後再試|Could not load charts. Please try again.
無法取得用戶資料 請稍後再試|Could not load users. Please try again.
無法找到有效的 userGroupId，無法移除該成員|Could not identify the member to remove.
更新圖表狀態失敗|Could not update chart status.
查詢圖表狀態失敗|Could not load chart status.
圖表新增失敗|Could not add the chart.
月份|Month
指標|Metric
示範指標|Demo metric
品號|Item number
偏差率 (%)|Variance (%)
工時效率 (%)|Labor efficiency (%)
平均產量達成率 (%)|Average target achievement (%)
庫存水位 (%)|Inventory levels (%)
委外加工退貨率|Subcontractor return rate
生產成本偏差率|Production cost variance
進貨單價|Purchase unit price
進貨單價 (元)|Purchase unit price (TWD)
退貨率 (%)|Return rate (%)
離職率|Employee turnover
離職率 (%)|Employee turnover (%)
示範數值|Sample value
單位|Unit
Fetching sync time...|Fetching sync time...
Click to close sidebar|Close sidebar
`.trim().split('\n').map(row => {
  const separator = row.indexOf('|');
  return [row.slice(0, separator).replace(/\\n/g, '\n'), row.slice(separator + 1).replace(/\\n/g, '\n')];
}));

export function translateText(text: string, target: Language = language): string {
  if (target === 'zh') return text;
  if (englishMessages[text]) return englishMessages[text];
  const trimmed = text.trim();
  if (englishMessages[trimmed]) return text.replace(trimmed, englishMessages[trimmed]);
  if (text.startsWith('data:image/svg+xml')) {
    try { const comma = text.indexOf(','); const svg = decodeURIComponent(text.slice(comma + 1)); return text.slice(0, comma + 1) + encodeURIComponent(svg.replace(/>([^<>]+)</g, (_, label) => '>' + translateText(label, target) + '<')); } catch { return text; }
  }
  const owners = text.match(/^擁有權限者：(.+)$/);
  if (owners) return 'Authorized: ' + owners[1].split(', ').map(name => translateText(name, target)).join(', ');
  const userOption = text.match(/^(\d+)\s+(.+)$/);
  if (userOption && englishMessages[userOption[2]]) return userOption[1] + ' ' + englishMessages[userOption[2]];
  const names = text.split(', ');
  if (names.length > 1 && names.every(name => englishMessages[name])) return names.map(name => englishMessages[name]).join(', ');
  const statusChange = text.match(/^確定要將 (.+) 的狀態切換為 (啟用中|停用) 嗎？$/);
  if (statusChange) return 'Set ' + translateText(statusChange[1], target) + ' to ' + translateText(statusChange[2], target).toLowerCase() + '?';
  const removal = text.match(/^確定要移除 (.+) 嗎？$/);
  if (removal) return 'Remove ' + translateText(removal[1], target) + '?';
  const toggle = text.match(/^確定要(啟用|停用)這個功能嗎？$/);
  if (toggle) return toggle[1] === '啟用' ? 'Enable this feature?' : 'Disable this feature?';
  const prefixes: [string, string][] = [['最後同步時間:', 'Last synced:'], ['請求提交失敗：', 'Request failed: '], ['匯出失敗:', 'Export failed:'], ['導出失敗:', 'Export failed:'], ['交辦失敗:', 'Assignment failed:'], ['無法開通用戶 錯誤訊息：', 'Could not approve user: '], ['無法移除用戶 錯誤訊息：', 'Could not remove user: ']];
  for (const [prefix, translated] of prefixes) if (text.startsWith(prefix)) return translated + translateText(text.slice(prefix.length), target);
  return text;
}
export function t<T>(value: T): T { return (typeof value === 'string' ? translateText(value) : value) as T; }
