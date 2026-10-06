import { demoRequest } from '../demo/api';
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> =>
  demoRequest(url, options.method || 'GET', options.body);
