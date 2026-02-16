import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // Add this new method
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username,
        password
      })
      const { access, refresh } = response.data

      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
      localStorage.setItem('user', username)

      set({
        token: access,
        refreshToken: refresh,
        isAuthenticated: true,
        user: username
      })

      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      set({ isAuthenticated: false })
      return { success: false, error }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    set({ token: null, refreshToken: null, isAuthenticated: false, user: null })
  },

  startTokenRefresh: () => {
    const interval = setInterval(async () => {
      const { token, refreshTokenFn } = get();
      if (!token) return;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp - 60 < now) {
          await refreshTokenFn();
        }
      } catch (error) {
        console.error("Token parse error:", error);
      }
    }, 30000);
  
    return () => clearInterval(interval);
  },

  refreshTokenFn: async () => {
    const refresh = get().refreshToken
    if (refresh) {
      try {
        const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh })
        const { access } = response.data

        localStorage.setItem('token', access)
        // Use the setToken method here for consistency
        get().setToken(access)

        return access
      } catch (error) {
        console.error('Token refresh failed:', error)
        get().logout()
      }
    }
  },

  checkAuth: async () => {
    const token = get().token; 
    const refresh = get().refreshToken;

    if (!token || !refresh) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); 
      const now = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp < now) {
        console.log("Access token expired. Attempting to refresh...");
        await get().refreshTokenFn(); 
      } else {
        set({ isAuthenticated: true });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      get().logout();
    }
  }
}))

export default useAuthStore