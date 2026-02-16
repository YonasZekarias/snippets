import axios from "axios";
import useAuthStore from "./authStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.request.use(
  async (config) => {
    const { token, refreshTokenFn, setToken } = useAuthStore.getState();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newToken = await refreshTokenFn();
              if (newToken) {
                setToken(newToken); // Use the setToken method
                onTokenRefreshed(newToken);
              }
            } catch (error) {
              console.error("Error refreshing token:", error);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve) => {
            addRefreshSubscriber((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(config);
            });
          });
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing token in interceptor:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;