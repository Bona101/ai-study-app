// src/types.ts

// User Interface
export interface User {
  id: number;
  email: string;
  created_at?: string; // Optional, as it might not always be returned or needed by frontend
}

// Auth Context Interface
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
}

// API Response Interfaces
export interface ApiResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

// TanStack Router Context Interface
// This is crucial for correctly typing the router's context in loaders and beforeLoad
export interface RouterContext {
  auth: AuthContextType;
}