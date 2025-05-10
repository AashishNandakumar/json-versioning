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
      };
      versions.push(version2);

      // Update the document to the latest version
      exampleDocument.content = version2Content;
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
): Promise<JsonDocument> => {
  try {
    const response = await axios.post(`${API_URL}/documents`, { content });
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
    const response = await axios.get(`${API_URL}/documents`);
    return response.data;
    // Mock implementation:
    // return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
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
    const response = await axios.get(`${API_URL}/documents/${id}`);
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
    const response = await axios.post(`${API_URL}/documents/${documentId}/versions`, { content, isAutoSave });
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error("Error creating version:", error);
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
    const response = await axios.get(`${API_URL}/documents/${documentId}/versions`);
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
    const response = await axios.post(`${API_URL}/documents/${documentId}/versions/${versionId}/merge`);
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
    const response = await axios.get(`${API_URL}/documents/${documentId}/versions/${versionId}`);
    return response.data;
    // Mock implementation:
    // ...
  } catch (error) {
    console.error(`Error fetching version ${versionId}:`, error);
    throw error;
  }
};
