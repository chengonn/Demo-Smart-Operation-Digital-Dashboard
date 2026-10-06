import { AxiosAdapter } from 'axios';
import { chartURL, chartPreview, chartSeries, chartUnit } from './chart';

export const STORAGE_KEY = 'smart-dashboard-demo-v1';
const stamp = '2026-10-01 09:00:00';
const audit = { available: true, createId: '1', createDate: stamp, modifyId: '1', modifyDate: stamp };
const mailStatuses = ['交辦', '被交辦', '待處理', '已完成'];
const names = ['產量達成率', '工時效率', '退貨率', '委外退貨率', '成本差異率', '採購單價', '周轉率', '庫存水位'];
export const demoUser = { id: '1', userId: '1', name: '展示管理員', userName: '展示管理員', email: 'demo@example.com', gmail: 'demo@example.com', role: 'DEVELOPER', identity: 'DEVELOPER', departmentId: '1', departmentName: '營運管理部', department: '營運管理部', position: '營運主管', jobNumber: 'DEMO001', googleId: '', ...audit };

type Row = Record<string, any>;
interface Store {
  users: Row[]; charts: Row[]; dashboards: Row[]; groups: Row[];
  members: Row[]; groupCharts: Row[]; applications: Row[]; tasks: Row[]; mails: Row[];
  permissions: Record<string, Row>; conversations: Record<string, Row[]>;
}

function seed(): Store {
  const charts = names.map((name, i) => ({ id: i + 10, name, chartImage: chartURL(name, i + 10), chartHTML: chartURL(name, i + 10), showcaseImage: chartPreview(name), observable: true, canAssign: true, canExport: true, ...audit }));
  const users = [demoUser, ...['陳怡安', '林柏宇', '王佳蓉', '許承恩'].map((name, i) => ({ ...demoUser, id: String(i + 2), userId: String(i + 2), name, userName: name, email: `member${i + 2}@example.com`, gmail: `member${i + 2}@example.com`, identity: i === 3 ? 'NO_PERMISSION' : 'USER', departmentId: i % 2 ? '2' : '1', departmentName: i % 2 ? '生產管理部' : '營運管理部', department: i % 2 ? '生產管理部' : '營運管理部', position: '專員', jobNumber: `DEMO00${i + 2}` }))];
  return {
    users, charts,
    dashboards: [{ id: '1', dashboardId: 1, name: '營運總覽', description: '營運績效與生產效率的示範儀表板', chartIds: [10, 11, 14, 17] }, { id: '2', dashboardId: 2, name: '品質與採購', description: '品質及供應鏈指標', chartIds: [12, 13, 15, 16] }],
    groups: [{ id: 1, name: '營運管理團隊', ...audit }, { id: 2, name: '生產與品質團隊', ...audit }],
    members: users.slice(0, 4).map((user, i) => ({ groupId: i % 2 + 1, userId: user.userId, userGroupId: i + 1 })),
    groupCharts: charts.map((chart, i) => ({ groupId: i % 2 + 1, chartId: chart.id, chartGroupId: i + 1 })),
    applications: [0, 1, 2, 3].map((applyStatus, i) => ({ id: i + 1, chartId: i + 10, chartName: names[i], applicant: '陳怡安', guarantor: '展示管理員', startDate: '2026-10-01 09:00:00', endDate: '2026-12-31 18:00:00', content: '申請季度營運分析所需的 KPI', reason: '追蹤營運改善成效', applyStatus, groupId: 1, ...audit })),
    tasks: charts.map(chart => ({ id: chart.id, chartId: chart.id, name: chart.name, defaultProcessor: '2', defaultAuditor: '1', upperLimit: 100, lowerLimit: 80, ...audit })),
    mails: [0, 1, 2, 3].map((status, i) => ({ id: i + 1, assignedTaskId: i + 10, chartId: i + 10, name: ['追蹤本月產量達成率', '工時效率改善計畫', '退貨原因檢討', '品質改善成果確認'][i], status: mailStatuses[status], publisher: '展示管理員', receiver: '陳怡安', emailSendTime: stamp, showcaseImage: charts[i].showcaseImage, ...audit, firstMessage: { content: '請確認本月指標，整理改善方向並回覆。此為展示訊息。' }, messageList: [{ id: 1, messageId: 1, mailId: i + 1, content: '請確認本月指標，整理改善方向並回覆。此為展示訊息。', ...audit }] })),
    permissions: {}, conversations: {},
  };
}

function load(): Store {
  try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) { const parsed = JSON.parse(stored); if (Array.isArray(parsed.charts) && Array.isArray(parsed.users)) return parsed; } } catch { /* Reset malformed or unavailable browser storage. */ }
  return seed();
}
let store = load();
function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* Demo still works in memory if storage is unavailable. */ } }
const ok = (data: any) => ({ result: true, errorCode: '', message: '示範操作已完成（僅儲存於此瀏覽器）', data });
const nextId = (rows: Row[]) => Math.max(0, ...rows.map(row => Number(row.id))) + 1;
const find = (rows: Row[], id: any) => rows.find(row => String(row.id) === String(id));
const aiText = '這是預先編寫的示範分析，未呼叫 AI 服務。\n\n本期指標整體上升，建議持續追蹤工時效率、品質異常與庫存水位，並將改善任務交辦給負責人。';

export function demoRequest(rawURL: string, method = 'GET', body: any = {}, extra: Row = {}): any {
  const url = new URL(rawURL, 'https://demo.invalid');
  const path = url.pathname;
  const params: Row = { ...Object.fromEntries(url.searchParams.entries()), ...extra };
  const verb = method.toUpperCase();
  let data = body;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch { data = {}; } }
  if (data instanceof FormData) data = Object.fromEntries(data.entries());
  data = data || {};
  const id = path.split('/').pop();
  const mutate = verb !== 'GET';
  let result: any;

  if (path === '/login') result = ok(demoUser);
  else if (path === '/dropdown') result = ok({ departmentList: [{ key: '1', value: '營運管理部' }, { key: '2', value: '生產管理部' }], identityList: [{ key: '0', value: '無權限' }, { key: '1', value: '一般使用者' }, { key: '2', value: '管理員' }, { key: '3', value: '開發者' }] });
  else if (path === '/dashboard/sync-time') result = ok({ lastSyncTime: '2026-10-01T09:00:00+08:00' });
  else if (verb === 'GET' && ['/chart/all', '/chart/available', '/chart/dashboard', '/chart'].includes(path)) {
    let rows = store.charts;
    const dashboard = find(store.dashboards, params.dashboardId);
    if (path === '/chart/dashboard') rows = rows.filter(row => dashboard?.chartIds.includes(row.id));
    if (params.available !== undefined && params.available !== null) rows = rows.filter(row => row.available === (String(params.available) === 'true'));
    result = ok(rows.map(row => ({ ...row, isAdded: dashboard?.chartIds.includes(row.id) || false })));
  } else if (path === '/chart/dashboard' && mutate) {
    const dashboard = find(store.dashboards, params.dashboardId);
    if (dashboard) dashboard.chartIds = (data.dashboardCharts || []).map(Number);
    result = ok(dashboard);
  } else if (path.startsWith('/chart/')) {
    const chart = find(store.charts, id);
    if (!chart) throw new Error(`示範圖表不存在：${id}`);
    if (mutate) Object.assign(chart, data);
    result = ok(chart);
  } else if (path === '/chart' && verb === 'POST') {
    const chartId = nextId(store.charts), name = String(data.name || '新示範圖表');
    const chart = { id: chartId, name, chartImage: chartURL(name, chartId), chartHTML: chartURL(name, chartId), showcaseImage: chartPreview(name), canAssign: true, canExport: true, observable: true, ...audit };
    store.charts.push(chart); result = ok(chart);
  } else if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    if (verb === 'POST') { const dashboardId = nextId(store.dashboards); const row = { ...data, id: String(dashboardId), dashboardId, chartIds: [] }; store.dashboards.push(row); result = ok(row); }
    else if (path === '/dashboard') result = ok(store.dashboards);
    else { const row = find(store.dashboards, id); if (verb === 'DELETE') store.dashboards = store.dashboards.filter(d => d !== row); else if (mutate && row) Object.assign(row, data); result = ok(row); }
  } else if (path.startsWith('/user-account')) {
    if (path.endsWith('/pages')) result = ok({ totalPages: 1 });
    else if (path.endsWith('/all') || path.endsWith('/list')) {
      const roles: Row = { '0': 'NO_PERMISSION', '1': 'USER', '2': 'ADMIN', '3': 'DEVELOPER' };
      const rows = store.users.filter(row => (!params.identity || row.identity === (roles[params.identity] || params.identity)) && (!params.departmentId || row.departmentId === params.departmentId) && (!params.name || row.name.includes(params.name)) && (!params.keyword || `${row.name} ${row.gmail} ${row.jobNumber}`.includes(params.keyword)));
      result = ok(Number(params.nowPage || 0) > 1 ? [] : rows);
    } else {
      const userId = params.userId || data.userId || (/^\d+$/.test(id || '') ? id : '1');
      const row = find(store.users, userId);
      if (verb === 'DELETE') store.users = store.users.filter(user => user !== row);
      else if (row && mutate) { Object.assign(row, data); if (data.userName) row.name = data.userName; if (path.endsWith('/admit')) row.identity = 'USER'; if (path.endsWith('/able')) row.available = data.available ?? !row.available; }
      result = ok(row);
    }
  } else if (path === '/group/user' && verb === 'GET') result = ok(store.groups);
  else if (/^\/group\/user\/\d+$/.test(path)) result = ok(store.members.filter(row => String(row.groupId) === id).map(row => ({ ...find(store.users, row.userId), ...row })));
  else if (path === '/group/user') {
    if (verb === 'POST' && !store.members.some(row => String(row.groupId) === String(params.groupId) && row.userId === params.userId)) store.members.push({ groupId: Number(params.groupId), userId: params.userId, userGroupId: Math.max(0, ...store.members.map(row => row.userGroupId)) + 1 });
    if (verb === 'DELETE') store.members = store.members.filter(row => String(row.userGroupId) !== String(params.userGroupId));
    result = ok(null);
  } else if (/^\/group\/chart\/\d+$/.test(path)) result = ok(store.groupCharts.filter(row => String(row.groupId) === id).map(row => ({ ...find(store.charts, row.chartId), ...row, chartName: find(store.charts, row.chartId)?.name })));
  else if (path === '/group/chart') {
    if (verb === 'POST' && !store.groupCharts.some(row => String(row.groupId) === String(params.groupId) && String(row.chartId) === String(params.chartId))) store.groupCharts.push({ groupId: Number(params.groupId), chartId: Number(params.chartId), chartGroupId: Math.max(0, ...store.groupCharts.map(row => row.chartGroupId)) + 1 });
    if (verb === 'DELETE') store.groupCharts = store.groupCharts.filter(row => String(row.chartGroupId) !== String(params.userGroupId));
    result = ok(null);
  } else if (path === '/group' || /^\/group\/\d+$/.test(path)) {
    if (verb === 'POST') { const row = { ...audit, ...data, id: nextId(store.groups) }; store.groups.push(row); result = ok(row); }
    else { const row = find(store.groups, id); if (verb === 'DELETE') store.groups = store.groups.filter(group => group !== row); else if (row && mutate) Object.assign(row, data); result = ok(row || store.groups); }
  } else if (path.startsWith('/application')) {
    if (verb === 'GET') result = ok(store.applications.filter(row => params.status === undefined || String(row.applyStatus) === String(params.status)));
    else if (verb === 'POST') { const row = { ...audit, id: nextId(store.applications), startDate: data.startDateStr || stamp, endDate: data.endDateStr || stamp, applyStatus: 1, content: data.reason, groupId: 1, ...data }; store.applications.push(row); result = ok(row); }
    else { const row = find(store.applications, id); if (verb === 'DELETE') store.applications = store.applications.filter(app => app !== row); else if (row) Object.assign(row, data, path.includes('/close/') ? { applyStatus: 0 } : {}); result = ok(row); }
  } else if (path === '/assigned-task/sponsor' || path === '/export') {
    const key = String(params.chartId);
    if (mutate) { const field = path === '/export' ? 'exporterList' : 'sponsorList'; store.permissions[key] = { ...store.permissions[key], [field]: data[field] || [] }; }
    result = ok({ sponsorList: ['1', '2'], exporterList: ['1', '2'], ...store.permissions[key] });
  } else if (path.startsWith('/assigned-task')) {
    if (verb === 'GET') result = ok(store.tasks.filter(row => !params.chartId || row.chartId === Number(params.chartId)));
    else if (verb === 'POST') { const row = { ...audit, ...data, id: nextId(store.tasks) }; store.tasks.push(row); result = ok(row); }
    else { const row = find(store.tasks, id); if (row) Object.assign(row, data); if (verb === 'DELETE') store.tasks = store.tasks.filter(task => task !== row); result = ok(row); }
  } else if (path === '/export/export') {
    const chart = find(store.charts, params.chartId);
    result = new Blob(['\uFEFF月份,指標,示範數值,單位\n' + chartSeries(Number(params.chartId)).map((value, i) => `${i + 1},${chart?.name || '示範指標'},${value},${chartUnit(Number(params.chartId))}`).join('\n')], { type: 'text/csv;charset=utf-8' });
  } else if (path === '/mail/message') {
    const mail = find(store.mails, params.mailId || data.mailId);
    if (!mail) throw new Error('找不到示範交辦事項');
    const row = { ...audit, ...data, id: nextId(mail.messageList), mailId: mail.id, messageId: nextId(mail.messageList) };
    mail.messageList.push(row); result = ok(row);
  } else if (path.startsWith('/mail/message/status/')) {
    const mail = find(store.mails, id); if (mail) mail.status = mailStatuses[Number(params.status)]; result = ok(mail);
  } else if (path === '/mail' || /^\/mail\/\d+$/.test(path)) {
    if (verb === 'GET') result = ok(path === '/mail' ? store.mails.filter(row => !params.status || String(params.status).split(',').map(code => mailStatuses[Number(code)]).includes(row.status)) : find(store.mails, id));
    else if (verb === 'POST') { const mailId = nextId(store.mails); const row = { ...audit, ...data, id: mailId, status: '交辦', publisher: '展示管理員', receiver: find(store.users, data.receiver)?.name || data.receiver, emailSendTime: stamp, showcaseImage: find(store.charts, data.chartId)?.showcaseImage, messageList: [] }; store.mails.push(row); result = ok(row); }
    else { const row = find(store.mails, id); if (row) Object.assign(row, data); if (verb === 'DELETE') store.mails = store.mails.filter(mail => mail !== row); result = ok(row); }
  } else if (path.startsWith('/ai')) {
    const key = String(params.chartId || data.chartId);
    if (verb === 'DELETE') { store.conversations[key] = []; result = ok(null); }
    else if (path === '/ai/chat') { const rows = store.conversations[key] || []; const messageId = nextId(rows); rows.push({ id: messageId, content: data.content, generator: 'user' }, { id: messageId + 1, content: aiText, generator: 'ai' }); store.conversations[key] = rows; result = ok({ id: messageId + 1, newChat: aiText }); }
    else { if (!store.conversations[key]) store.conversations[key] = [{ id: 1, content: aiText, generator: 'ai' }]; result = ok(store.conversations[key]); }
  } else throw new Error(`尚未支援的示範操作：${verb} ${path}`);

  if (mutate) persist();
  // Match real API semantics: consumers receive copies, not references into storage.
  return result instanceof Blob ? result : JSON.parse(JSON.stringify(result));
}

export const demoAdapter: AxiosAdapter = async config => ({
  data: demoRequest(config.url || '/', config.method, config.data, config.params),
  status: 200, statusText: 'OK', headers: {}, config,
});

export function resetDemo() { store = seed(); localStorage.removeItem(STORAGE_KEY); window.location.hash = '/home'; window.location.reload(); }
