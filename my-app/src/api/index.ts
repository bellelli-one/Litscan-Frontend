import { Api } from './Api';
import { getApiBase } from '../config'; 


export const api = new Api({
    baseURL: getApiBase(),
});

api.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});