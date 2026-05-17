import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ── URL de base du serveur (à modifier ici en cas de changement d'IP) ─────────
export const BASE_URL = 'https://residence.groupealpha1.com';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Client API basé sur Axios pour l'application mobile.
 */
const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Intercepteur de requête : 
 * Utilise 'expo-secure-store' pour récupérer le token de manière sécurisée 
 * et l'ajoute à l'en-tête Authorization.
 */
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
