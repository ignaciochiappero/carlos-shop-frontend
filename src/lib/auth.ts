//front-new\src\lib\auth.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      setUser: (user) => 
        set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => 
        set({ accessToken: token, isAuthenticated: !!token }),
      logout: () => 
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

// Authentication helper functions
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// Protected route middleware
export const requireAuthentication = async () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  return token;
};

// Auth status check
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

// Role-based authorization
export const hasRole = (requiredRole: string) => {
  const { user } = useAuthStore.getState();
  return user?.role === requiredRole;
};

// Auth redirect helper
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  }
};

// Auth middleware for protected routes
export const withAuth = (gssp: any) => {
  return async (context: any) => {
    const { req, res } = context;
    
    // Check for token in cookies or headers
    const token = req.cookies['access_token'] || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      // Redirect to login if no token found
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // If there is a token, pass it to the page via props
    return {
      props: {
        ...(await gssp(context)),
        token,
      },
    };
  };
};