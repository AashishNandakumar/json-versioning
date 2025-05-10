import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthState } from "../types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for development
const dummyUsers = [
  {
    id: "1",
    email: "user@example.com",
    name: "Test User",
    password: "password",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing token in cookies
    const token = getCookie("auth_token");
    if (token) {
      try {
        // In a real app, we would validate the token here
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.id) {
          setAuthState({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(user.id);

      // Store in cookies and localStorage
      setCookie("auth_token", token, 7); // 7 days
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      setAuthState({
        user: userWithoutPassword,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    }

    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Check if user already exists
    const userExists = dummyUsers.some((u) => u.email === email);

    if (userExists) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `${dummyUsers.length + 1}`,
      email,
      name,
      password,
    };

    // In a real app, we would save this to a database
    dummyUsers.push(newUser);

    // Auto login after registration
    return login(email, password);
  };

  const logout = () => {
    // Clear cookies and localStorage
    deleteCookie("auth_token");
    localStorage.removeItem("user");

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
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

// Helper functions for JWT and cookies
function generateToken(userId: string): string {
  // In a real app, we would use a proper JWT library
  // This is just a dummy implementation
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now() }));
  const signature = btoa(`dummy-signature-${userId}-${Date.now()}`);

  return `${header}.${payload}.${signature}`;
}

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
