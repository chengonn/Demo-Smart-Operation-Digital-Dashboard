import axios from 'axios';
import { demoAdapter } from '../demo/api';

// Every application request is resolved locally; this build has no backend.
const apiClient = axios.create({ adapter: demoAdapter });
export default apiClient;
