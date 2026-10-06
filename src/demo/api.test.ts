/// <reference types="jest" />
import { demoRequest as requestType } from './api';

let request: typeof requestType;
beforeEach(() => {
  localStorage.clear();
  jest.resetModules();
  request = require('./api').demoRequest;
});

test('dashboard selection returns different populated chart sets without network', () => {
  const first = request('/chart/dashboard', 'GET', {}, { dashboardId: 1 }).data;
  const second = request('/chart/dashboard', 'GET', {}, { dashboardId: 2 }).data;
  expect(first).toHaveLength(4);
  expect(second).toHaveLength(4);
  expect(first[0].id).not.toBe(second[0].id);
  expect(first[0].chartHTML).toMatch(/^data:text\/html/);
});

test('new dashboards can be renamed, assigned charts, persisted and deleted', () => {
  const row = request('/dashboard', 'POST', { name: '測試儀表板' }).data;
  request(`/dashboard/${row.id}`, 'PATCH', { name: '改善追蹤' });
  request('/chart/dashboard', 'POST', { dashboardCharts: [10, 12] }, { dashboardId: row.id });
  expect(request('/chart/dashboard', 'GET', {}, { dashboardId: row.id }).data.map((c: any) => c.id)).toEqual([10, 12]);
  jest.resetModules();
  request = require('./api').demoRequest;
  expect(request(`/dashboard/${row.id}`).data.name).toBe('改善追蹤');
  request(`/dashboard/${row.id}`, 'DELETE');
  expect(request('/dashboard').data.some((d: any) => d.id === row.id)).toBe(false);
});

test('group membership and chart assignment round trip', () => {
  const group = request('/group', 'POST', { name: '示範群組' }).data;
  request('/group/user', 'POST', null, { groupId: group.id, userId: '2' });
  const member = request(`/group/user/${group.id}`).data[0];
  expect(member.name).toBe('陳怡安');
  request('/group/user', 'DELETE', {}, { userGroupId: member.userGroupId });
  expect(request(`/group/user/${group.id}`).data).toEqual([]);
  request('/group/chart', 'POST', {}, { groupId: group.id, chartId: 10 });
  const chart = request(`/group/chart/${group.id}`).data[0];
  expect(chart.chartName).toBe('產量達成率');
  request('/group/chart', 'DELETE', {}, { userGroupId: chart.chartGroupId });
  expect(request(`/group/chart/${group.id}`).data).toEqual([]);
});

test('user filtering, approval, status and profile edits work locally', () => {
  expect(request('/user-account/list', 'GET', {}, { identity: '0' }).data).toHaveLength(1);
  request('/user-account/admit', 'PATCH', {}, { userId: '5' });
  expect(request('/user-account/list', 'GET', {}, { identity: '0' }).data).toHaveLength(0);
  request('/user-account/able?userId=2', 'PATCH');
  expect(request('/user-account/2').data.available).toBe(false);
  request('/user-account', 'PATCH', { userId: '1', userName: '新名稱' });
  expect(request('/user-account').data.name).toBe('新名稱');
});

test('mail creation, reply, completion and deletion work without sending real mail', () => {
  const mail = request('/mail', 'POST', { name: '改善追蹤', receiver: '2', chartId: 10, firstMessage: { content: '請追蹤' } }).data;
  request('/mail/message', 'POST', { content: '已完成' }, { mailId: mail.id });
  expect(request(`/mail/${mail.id}`).data.messageList[0].content).toBe('已完成');
  request(`/mail/message/status/${mail.id}`, 'PATCH', {}, { status: 3 });
  expect(request('/mail', 'GET', {}, { status: '3' }).data.some((m: any) => m.id === mail.id)).toBe(true);
  request(`/mail/${mail.id}`, 'DELETE');
  expect(request('/mail').data.some((m: any) => m.id === mail.id)).toBe(false);
});

test('permissions, alert limits and application closure persist', () => {
  request('/export', 'POST', { exporterList: ['3'] }, { chartId: 10 });
  request('/assigned-task/sponsor', 'POST', { sponsorList: ['2'], exporterList: [] }, { chartId: 10 });
  expect(request('/export', 'GET', {}, { chartId: 10 }).data.exporterList).toEqual(['3']);
  request('/export', 'POST', { exporterList: ['4'], sponsorList: [] }, { chartId: 10 });
  expect(request('/assigned-task/sponsor', 'GET', {}, { chartId: 10 }).data.sponsorList).toEqual(['2']);
  request('/assigned-task/10', 'PATCH', { lowerLimit: 75 });
  expect(request('/assigned-task', 'GET', {}, { chartId: 10 }).data[0].lowerLimit).toBe(75);
  request('/application/close/4', 'PATCH');
  expect(request('/application', 'GET', {}, { status: '0' }).data.some((a: any) => a.id === 4)).toBe(true);
});

test('CSV export is a real CSV Blob and AI replies disclose simulation', () => {
  const blob = request('/export/export', 'POST', {}, { chartId: 10 });
  expect(blob).toBeInstanceOf(Blob);
  expect(blob.type).toBe('text/csv;charset=utf-8');
  expect(request('/ai/chat', 'POST', { chartId: 10, content: '如何改善？' }).data.newChat).toContain('未呼叫 AI 服務');
});

test('responses cannot mutate the store and unsupported operations fail visibly', () => {
  request('/dashboard').data[0].name = '不應儲存';
  expect(request('/dashboard').data[0].name).toBe('營運總覽');
  expect(() => request('/unknown')).toThrow('尚未支援');
});
