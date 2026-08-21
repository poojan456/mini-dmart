import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Spring Boot Backend URL
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
