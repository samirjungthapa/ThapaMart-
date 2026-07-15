import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh');
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : {};
        userInfo.token = data.token;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired -> log out
        localStorage.removeItem('userInfo');
        // Dispatching custom event or simple reload/redirect
        window.dispatchEvent(new Event('auth_logout'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
