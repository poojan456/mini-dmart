import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://mini-dmart.onrender.com/api' : 'http://localhost:8080/api'),
    timeout: 60000, // 60s timeout to gracefully handle Render cold starts
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add the JWT token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
