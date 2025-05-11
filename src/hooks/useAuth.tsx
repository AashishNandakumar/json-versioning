import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthState } from "../types/auth";
import axios from "axios";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - should be configured from environment variables in production
const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const validateToken = async () => {
      // Check for existing token in cookies
      const token = getCookie("auth_token");
      if (!token) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Validate token with backend
        // API endpoint: GET /api/auth/validate
        // Headers: { Authorization: `Bearer ${token}` }
        // Response: { user: User }
        const response = await axios.get(`${API_URL}/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If token is valid, set auth state
        setAuthState({
          user: response.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error validating token:", error);
        // If token validation fails, clear auth state
        deleteCookie("auth_token");
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // API endpoint: POST /api/auth/login
      // Request body: { email: string, password: string }
      // Response: { token: string, user: User }
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in cookies and user data in localStorage
      setCookie("auth_token", token, 7); // 7 days
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // API endpoint: POST /api/auth/register
      // Request body: { name: string, email: string, password: string }
      // Response: { token: string, user: User }
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in cookies and user data in localStorage
      setCookie("auth_token", token, 7); // 7 days
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // API endpoint: POST /api/auth/logout
      // Headers: { Authorization: `Bearer ${token}` }
      // This is optional - some implementations handle logout only on client side
      if (authState.token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          },
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear cookies and localStorage regardless of API response
      deleteCookie("auth_token");
      localStorage.removeItem("user");

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper functions for cookies
function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
