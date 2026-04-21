import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ── Changer uniquement ici pour toute l'app ──────────────────────────────────
export const BASE_URL = 'http://192.168.1.79:8000';
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
