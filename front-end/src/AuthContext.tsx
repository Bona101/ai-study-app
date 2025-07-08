// // src/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from './api'; // Import your API service

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
//   const [isAuthenticated, setIsAuthenticated] = useState(!!token);
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   // Function to save auth data
//   const saveAuthData = (newToken, newUser) => {
//     localStorage.setItem('token', newToken);
//     localStorage.setItem('user', JSON.stringify(newUser));
//     setToken(newToken);
//     setUser(newUser);
//     setIsAuthenticated(true);
//   };

//   // Login function
//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       saveAuthData(response.data.token, response.data.user);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Login failed:', error.response?.data?.error || error.message);
//       return { success: false, error: error.response?.data?.error || 'Login failed.' };
//     }
//   };

//   // Register function
//   const register = async (email, password) => {
//     try {
//       const response = await api.post('/auth/register', { email, password });
//       saveAuthData(response.data.token, response.data.user);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       console.error('Registration failed:', error.response?.data?.error || error.message);
//       return { success: false, error: error.response?.data?.error || 'Registration failed.' };
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   // Verify token on app load (optional, but robust)
//   useEffect(() => {
//     const verifyToken = async () => {
//       if (token) {
//         try {
//           // Attempt to fetch user profile with the token
//           await api.get('/user/profile');
//           setIsAuthenticated(true);
//         } catch (error) {
//           // Token invalid or expired, log out
//           console.error("Token verification failed:", error.response?.data?.error || error.message);
//           logout();
//         }
//       } else {
//         setIsAuthenticated(false);
//       }
//       setLoadingAuth(false);
//     };

//     verifyToken();
//   }, [token]); // Re-run if token changes (e.g., set manually)

//   const value = {
//     isAuthenticated,
//     user,
//     token,
//     loadingAuth,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// src/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, type FC } from 'react';
import api from './api';
import { type User, type AuthContextType } from './types'; // Import your types

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // Function to save auth data
  const saveAuthData = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      saveAuthData(response.data.token, response.data.user);
      return { success: true, message: response.data.message };
    } catch (error: any) { // Use 'any' here as AxiosError is complex, or define specific error interface
      console.error('Login failed:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || 'Login failed.' };
    }
  };

  // Register function
  const register = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      saveAuthData(response.data.token, response.data.user);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || 'Registration failed.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verify token on app load (optional, but robust)
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await api.get('/user/profile');
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed:", (error as any).response?.data?.error || (error as any).message);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoadingAuth(false);
    };

    verifyToken();
  }, [token]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loadingAuth,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};