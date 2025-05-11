import axios from "axios";
import { User } from "../types/auth";

// API base URL - should be configured from environment variables in production
const API_URL = "http://localhost:5000/api";

/**
 * Authentication API Service
 *
 * This module provides functions for interacting with the authentication API endpoints.
 * It handles login, registration, token validation, and logout operations.
 */

/**
 * Interface for login request payload
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for registration request payload
 */
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Interface for authentication response
 */
interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Logs in a user with email and password
 *
 * @param credentials - Object containing email and password
 * @returns Promise resolving to AuthResponse containing token and user data
 *
 * @example
 * const { token, user } = await login({ email: "user@example.com", password: "password123" });
 */
export const login = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  try {
    // API endpoint: POST /api/auth/login
    // Request body: { email: string, password: string }
    // Response: { token: string, user: User }
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

/**
 * Registers a new user
 *
 * @param userData - Object containing name, email, and password
 * @returns Promise resolving to AuthResponse containing token and user data
 *
 * @example
 * const { token, user } = await register({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securepass123"
 * });
 */
export const register = async (
  userData: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    // API endpoint: POST /api/auth/register
    // Request body: { name: string, email: string, password: string }
    // Response: { token: string, user: User }
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/register`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.error("Registration API error:", error);
    throw error;
  }
};

/**
 * Validates an authentication token
 *
 * @param token - JWT token to validate
 * @returns Promise resolving to User object if token is valid
 *
 * @example
 * const user = await validateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 */
export const validateToken = async (token: string): Promise<User> => {
  try {
    // API endpoint: GET /api/auth/validate
    // Headers: { Authorization: `Bearer ${token}` }
    // Response: { user: User }
    const response = await axios.get<{ user: User }>(
      `${API_URL}/auth/validate`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data.user;
  } catch (error) {
    console.error("Token validation API error:", error);
    throw error;
  }
};

/**
 * Logs out a user by invalidating their token on the server
 *
 * @param token - JWT token to invalidate
 * @returns Promise resolving to void
 *
 * @example
 * await logout("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 */
export const logout = async (token: string): Promise<void> => {
  try {
    // API endpoint: POST /api/auth/logout
    // Headers: { Authorization: `Bearer ${token}` }
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    console.error("Logout API error:", error);
    throw error;
  }
};
