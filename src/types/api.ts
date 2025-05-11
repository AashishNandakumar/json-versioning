/**
 * API Response Types
 *
 * This file contains TypeScript interfaces for API responses used throughout the application.
 */

import { User } from "./auth";
import { JsonDocument, JsonVersion } from "./index";

/**
 * Base API response interface that all responses extend
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
}

/**
 * Authentication response containing user data and token
 */
export interface AuthResponse extends ApiResponse {
  token: string;
  user: User;
}

/**
 * Response for document operations
 */
export interface DocumentResponse extends ApiResponse {
  document: JsonDocument;
}

/**
 * Response for listing multiple documents
 */
export interface DocumentListResponse extends ApiResponse {
  documents: JsonDocument[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Response for version operations
 */
export interface VersionResponse extends ApiResponse {
  version: JsonVersion;
}

/**
 * Response for listing multiple versions
 */
export interface VersionListResponse extends ApiResponse {
  versions: JsonVersion[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Error response from API
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}
