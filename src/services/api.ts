import axios from "axios";
import { JsonDocument, JsonVersion } from "../types";
import { create } from "jsondiffpatch";

/**
 * API Service Module
 *
 * This module provides functions for interacting with the JSON document versioning API.
 * It currently uses a mock implementation for demonstration purposes, but is designed
 * to be easily replaced with real API calls in a production environment.
 *
 * @module api
 */

// In a real application, this would be an environment variable
const API_URL = "http://localhost:5000/api";

// Helper to get JWT token from cookies
function getAuthToken(): string | null {
  const name = "auth_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
}

// Create an axios instance with interceptor to add Authorization header
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock implementation for demo purposes
let documents: JsonDocument[] = [];
let versions: JsonVersion[] = [];
let currentDocumentId = "";

// Create jsondiffpatch instance
const jsondiffpatch = create({
  objectHash: (obj: any) => obj.id || JSON.stringify(obj),
  propertyFilter: (name: string) => name !== "$hashKey",
});

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize with example document and versions
const initializeExamples = () => {
  // Reset collections to ensure clean state
  documents = [];
  versions = [];

  if (documents.length === 0) {
    // Create an example document
    const exampleDocument: JsonDocument = {
      id: "example-doc-1",
      name: "Example JSON Document",
      content: JSON.stringify(
        {
          name: "Example JSON",
          version: 1,
          properties: {
            active: true,
            count: 42,
          },
          items: [
            { id: 1, label: "Item 1" },
            { id: 2, label: "Item 2" },
          ],
        },
        null,
        2,
      ),
      createdAt: new Date().toISOString(),
    };
    documents.push(exampleDocument);
    currentDocumentId = exampleDocument.id;

    // Create two example versions
    const version1Content = JSON.stringify(
      {
        name: "Example JSON",
        version: 1,
        properties: {
          active: true,
          count: 42,
        },
        items: [
          { id: 1, label: "Item 1" },
          { id: 2, label: "Item 2" },
        ],
      },
      null,
      2,
    );

    const version2Content = JSON.stringify(
      {
        name: "Updated Example",
        version: 2,
        properties: {
          active: true,
          count: 50,
          newProperty: "added",
        },
        items: [
          { id: 1, label: "Item 1 Updated" },
          { id: 2, label: "Item 2" },
          { id: 3, label: "Item 3" },
        ],
      },
      null,
      2,
    );

    // Create first version (base version)
    const version1: JsonVersion = {
      id: "example-version-1",
      documentId: exampleDocument.id,
      content: version1Content,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isAutoSave: false,
    };
    versions.push(version1);

    // Create second version with diff
    try {
      const oldContent = JSON.parse(version1Content);
      const newContent = JSON.parse(version2Content);
      const diff = jsondiffpatch.diff(oldContent, newContent);

      const version2: JsonVersion = {
        id: "example-version-2",
        documentId: exampleDocument.id,
        content: version2Content,
        createdAt: new Date().toISOString(),
        isAutoSave: false,
        diff: diff,
        parentId: "example-version-1",
      };
      versions.push(version2);

      // Create a third version with merge
      const version3Content = JSON.stringify(
        {
          name: "Merged Example",
          version: 3,
          properties: {
            active: true,
            count: 55,
            newProperty: "modified",
            additionalProp: true,
          },
          items: [
            { id: 1, label: "Item 1 Updated" },
            { id: 2, label: "Item 2 Modified" },
            { id: 3, label: "Item 3" },
            { id: 4, label: "Item 4" },
          ],
        },
        null,
        2,
      );

      const newContentForV3 = JSON.parse(version3Content);
      const diffForV3 = jsondiffpatch.diff(newContent, newContentForV3);

      const version3: JsonVersion = {
        id: "example-version-3",
        documentId: exampleDocument.id,
        content: version3Content,
        createdAt: new Date().toISOString(),
        isAutoSave: false,
        diff: diffForV3,
        parentId: "example-version-2",
      };
      versions.push(version3);

      // Create a fourth version that's a merge
      const version4Content = JSON.stringify(
        {
          name: "Merged Example",
          version: 4,
          properties: {
            active: true,
            count: 60,
            newProperty: "modified",
            additionalProp: true,
            mergedProp: "from version 1",
          },
          items: [
            { id: 1, label: "Item 1 Updated" },
            { id: 2, label: "Item 2 Modified" },
            { id: 3, label: "Item 3 Enhanced" },
            { id: 4, label: "Item 4" },
          ],
        },
        null,
        2,
      );

      const newContentForV4 = JSON.parse(version4Content);
      const diffForV4 = jsondiffpatch.diff(newContentForV3, newContentForV4);

      const version4: JsonVersion = {
        id: "example-version-4",
        documentId: exampleDocument.id,
        content: version4Content,
        createdAt: new Date().toISOString(),
        isAutoSave: false,
        diff: diffForV4,
        parentId: "example-version-3",
        mergedFrom: "example-version-1", // This version merges in changes from version 1
      };
      versions.push(version4);

      // Update the document to the latest version
      exampleDocument.content = version4Content;
    } catch (e) {
      console.error("Error creating example versions:", e);
    }
  }
};

// Initialize examples
initializeExamples();

/**
 * Creates a new JSON document with the provided content.
 *
 * @param content - The initial JSON content for the document as a string
 * @returns A Promise that resolves to the created JsonDocument object
 *
 * @example
 * // Create a new document with some initial content
 * const initialContent = JSON.stringify({ name: "Example", value: 42 }, null, 2);
 * const newDocument = await createDocument(initialContent);
 * console.log("Created document with ID:", newDocument.id);
 */
export const createDocument = async (
  content: string,
  name: string = "Untitled Document",
): Promise<JsonDocument> => {
  try {
    const response = await api.post('/documents', {
      content,
      name,
    });
    return response.data;
    // Mock implementation:
    // const newDocument: JsonDocument = { ... };
    // documents = [...documents, newDocument];
    // return newDocument;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

/**
 * Retrieves all documents available to the current user.
 *
 * @returns A Promise that resolves to an array of JsonDocument objects
 *
 * @example
 * // Fetch all documents
 * const documents = await getDocuments();
 * console.log(`Found ${documents.length} documents`);
 */
export const getDocuments = async (): Promise<JsonDocument[]> => {
  try {
    const response = await api.get('/documents');
    return response.data;
    // Mock implementation:
    // return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

/**
 * Updates a document's name.
 *
 * @param id - The unique identifier of the document to update
 * @param name - The new name for the document
 * @returns A Promise that resolves to the updated JsonDocument object
 * @throws Error if the document is not found or the user doesn't have permission
 *
 * @example
 * // Update a document's name
 * try {
 *   const updatedDocument = await updateDocumentName("doc-123", "New Document Name");
 *   console.log("Document updated:", updatedDocument);
 * } catch (error) {
 *   console.error("Failed to update document name:", error);
 * }
 */
export const updateDocumentName = async (
  id: string,
  name: string,
): Promise<JsonDocument> => {
  try {
    const response = await api.patch(`/documents/${id}`, { name });
    return response.data;
    // Mock implementation:
    // const documentIndex = documents.findIndex((doc) => doc.id === id);
    // if (documentIndex === -1) throw new Error("Document not found");
    // documents[documentIndex].name = name;
    // return documents[documentIndex];
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves a specific document by its ID.
 *
 * @param id - The unique identifier of the document to retrieve
 * @returns A Promise that resolves to the requested JsonDocument object
 * @throws Error if the document is not found or the user doesn't have access
 *
 * @example
 * // Fetch a specific document
 * try {
 *   const document = await getDocument("doc-123");
 *   console.log("Document content:", document.content);
 * } catch (error) {
 *   console.error("Failed to fetch document:", error);
 * }
 */
export const getDocument = async (id: string): Promise<JsonDocument> => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
    // Mock implementation:
    // const document = documents.find((doc) => doc.id === id);
    // if (!document) throw new Error("Document not found");
    // return document;
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new version of a document with the provided content.
 *
 * This function automatically generates a diff between the current document content
 * and the new content being saved. The diff is stored with the version to enable
 * efficient comparison and merging operations.
 *
 * @param documentId - The ID of the document to create a version for
 * @param content - The new content for this version as a string
 * @param isAutoSave - Boolean flag indicating if this is an automatic save (true) or manual save (false)
 * @returns A Promise that resolves to the created JsonVersion object
 * @throws Error if the document is not found or the user doesn't have permission
 *
 * @example
 * // Create a new version of a document
 * const newContent = JSON.stringify({ name: "Updated Example", value: 43 }, null, 2);
 * const newVersion = await createVersion("doc-123", newContent, false);
 * console.log("Created version with ID:", newVersion.id);
 */
export const createVersion = async (
  documentId: string,
  content: string,
  isAutoSave: boolean,
): Promise<JsonVersion> => {
  try {
    const response = await api.post(
      `/documents/${documentId}/versions`,
      { content, isAutoSave },
    );
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error("Error creating version:", error);
    throw error;
  }
};

/**
 * Updates the current version of a document without creating a new version.
 * Used for auto-saving changes to the current working version.
 *
 * @param documentId - The ID of the document to update
 * @param content - The new content to save
 * @returns A Promise that resolves to the updated document
 * @throws Error if the document is not found or the user doesn't have permission
 */
export const updateCurrentVersion = async (
  documentId: string,
  content: string,
): Promise<JsonDocument> => {
  try {
    console.log("Updating current version:", documentId, content);
    const response = await api.put(
      `/documents/${documentId}/current-version`,
      { content },
    );
    console.log("Updated current version:", response.data);
    return response.data;
    // Mock implementation would update the document content directly
  } catch (error) {
    console.error("Error updating current version:", error);
    throw error;
  }
};

/**
 * Retrieves all versions for a specific document.
 *
 * The versions are typically returned in chronological order, with the most recent versions first.
 * Each version contains the full content at that point in time, as well as metadata about when
 * it was created and whether it was an auto-save or manual save.
 *
 * @param documentId - The ID of the document to retrieve versions for
 * @returns A Promise that resolves to an array of JsonVersion objects
 * @throws Error if the document is not found or the user doesn't have permission
 *
 * @example
 * // Fetch all versions of a document
 * try {
 *   const versions = await getVersions("doc-123");
 *   console.log(`Document has ${versions.length} versions`);
 * } catch (error) {
 *   console.error("Failed to fetch versions:", error);
 * }
 */
export const getVersions = async (
  documentId: string,
): Promise<JsonVersion[]> => {
  try {
    const response = await api.get(
      `/documents/${documentId}/versions`,
    );
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error(`Error fetching versions for document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Merges a specific version into the current document.
 *
 * This operation takes the content from the specified version and makes it the current
 * content of the document. It also creates a new version that represents this merge operation,
 * with metadata indicating which version was merged.
 *
 * @param documentId - The ID of the document to merge a version into
 * @param versionId - The ID of the version to merge into the current document
 * @returns A Promise that resolves to the updated JsonDocument object
 * @throws Error if the document or version is not found, or if the user doesn't have permission
 *
 * @example
 * // Merge a specific version into the current document
 * try {
 *   const updatedDocument = await mergeVersions("doc-123", "version-456");
 *   console.log("Document updated with merged content:", updatedDocument.content);
 * } catch (error) {
 *   console.error("Failed to merge version:", error);
 * }
 */
export const mergeVersions = async (
  documentId: string,
  versionId: string,
): Promise<JsonDocument> => {
  try {
    const response = await api.post(
      `/documents/${documentId}/versions/${versionId}/merge`,
    );
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error(`Error merging version ${versionId}:`, error);
    throw error;
  }
};

/**
 * Retrieves a specific version of a document.
 *
 * @param documentId - The ID of the document the version belongs to
 * @param versionId - The ID of the specific version to retrieve
 * @returns A Promise that resolves to the requested JsonVersion object
 * @throws Error if the document or version is not found, or if the user doesn't have permission
 *
 * @example
 * // Fetch a specific version of a document
 * try {
 *   const version = await getVersion("doc-123", "version-456");
 *   console.log("Version content:", version.content);
 * } catch (error) {
 *   console.error("Failed to fetch version:", error);
 * }
 */
export const getVersion = async (
  documentId: string,
  versionId: string,
): Promise<JsonVersion> => {
  try {
    const response = await api.get(
      `/documents/${documentId}/versions/${versionId}`,
    );
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error(`Error fetching version ${versionId}:`, error);
    throw error;
  }
};
