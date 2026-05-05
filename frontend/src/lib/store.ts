import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

interface AIState {
  activeProvider: 'gemini' | 'openai' | 'groq';
  setProvider: (provider: 'gemini' | 'openai' | 'groq') => void;
}

export const useAIStore = create<AIState>((set) => ({
  activeProvider: 'gemini',
  setProvider: (activeProvider) => set({ activeProvider }),
}));
