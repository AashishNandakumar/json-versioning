import axios from "axios";
import { JsonDocument, JsonVersion } from "../types";
import { create } from "jsondiffpatch";

// In a real application, this would be an environment variable
const API_URL = "https://jsonplaceholder.typicode.com";

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

// Create a new document
export const createDocument = async (
  content: string,
): Promise<JsonDocument> => {
  try {
    // In a real app, this would be an API call to your backend
    // const response = await axios.post(`${API_URL}/documents`, { content });
    // return response.data;

    // TODO: BACKEND INTEGRATION
    // 1. Make an authenticated API call to create a new document
    // 2. Send the content to the server
    // 3. Handle validation on the server side
    // 4. Return the created document with its ID
    // 5. Add metadata like title, description, tags, etc.

    const newDocument: JsonDocument = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
    };

    documents = [...documents, newDocument];
    currentDocumentId = newDocument.id;

    return newDocument;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

// Get all documents
export const getDocuments = async (): Promise<JsonDocument[]> => {
  try {
    // In a real app, this would be an API call to your backend
    // const response = await axios.get(`${API_URL}/documents`);
    // return response.data;

    // TODO: BACKEND INTEGRATION
    // 1. Make an authenticated API call to fetch all documents for the current user
    // 2. Handle pagination if there are many documents
    // 3. Add filtering options (by date, name, etc.)
    // 4. Add sorting options

    console.log("Fetching all documents");
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (id: string): Promise<JsonDocument> => {
  try {
    // In a real app, this would be an API call to your backend
    // const response = await axios.get(`${API_URL}/documents/${id}`);
    // return response.data;

    // TODO: BACKEND INTEGRATION
    // 1. Make an authenticated API call to fetch a specific document
    // 2. Ensure the user has permission to access this document
    // 3. Return the document with its content and metadata
    // 4. Handle not found errors appropriately

    const document = documents.find((doc) => doc.id === id);
    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    throw error;
  }
};

// Create a new version
export const createVersion = async (
  documentId: string,
  content: string,
  isAutoSave: boolean,
): Promise<JsonVersion> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/documents/${documentId}/versions`, { content, isAutoSave });
    // return response.data;

    // Get the previous version of the document
    const document = documents.find((doc) => doc.id === documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Parse the JSON content
    let oldContent;
    let newContent;
    try {
      oldContent = JSON.parse(document.content);
      newContent = JSON.parse(content);
    } catch (e) {
      // If parsing fails, treat as plain text
      oldContent = document.content;
      newContent = content;
    }

    // Generate diff using jsondiffpatch
    const diff = jsondiffpatch.diff(oldContent, newContent);

    const newVersion: JsonVersion = {
      id: generateId(),
      documentId,
      content,
      createdAt: new Date().toISOString(),
      isAutoSave,
      diff: diff,
    };

    versions = [...versions, newVersion];

    // Update the document content
    documents = documents.map((doc) =>
      doc.id === documentId ? { ...doc, content } : doc,
    );

    return newVersion;
  } catch (error) {
    console.error("Error creating version:", error);
    throw error;
  }
};

// Get all versions for a document
export const getVersions = async (
  documentId: string,
): Promise<JsonVersion[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.get(`${API_URL}/documents/${documentId}/versions`);
    // return response.data;

    console.log("Fetching versions for document ID:", documentId);
    console.log("Available versions:", versions);

    const filteredVersions = versions.filter(
      (version) => version.documentId === documentId,
    );
    console.log("Filtered versions:", filteredVersions);

    return filteredVersions;
  } catch (error) {
    console.error(`Error fetching versions for document ${documentId}:`, error);
    throw error;
  }
};

// Merge a version into the current document
export const mergeVersions = async (
  documentId: string,
  versionId: string,
): Promise<JsonDocument> => {
  try {
    // In a real app, this would be an API call to your backend
    // const response = await axios.post(`${API_URL}/documents/${documentId}/versions/${versionId}/merge`);
    // return response.data;

    // TODO: BACKEND INTEGRATION
    // 1. Make an authenticated API call to merge the specified version into the current document
    // 2. The backend should:
    //    a. Get the specified version content
    //    b. Update the current document with this content
    //    c. Create a new version that represents the merge
    //    d. Add metadata about the merge (which version was merged, by whom, etc.)
    // 3. Handle conflicts if they arise during the merge
    // 4. Return the updated document

    // For the mock implementation, we'll simply update the document with the version content
    const version = versions.find(
      (v) => v.documentId === documentId && v.id === versionId,
    );
    if (!version) {
      throw new Error("Version not found");
    }

    // Update the document with the version content
    const document = documents.find((doc) => doc.id === documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Update the document content
    document.content = version.content;

    // Create a new version that represents the merge
    const newVersion: JsonVersion = {
      id: generateId(),
      documentId,
      content: version.content,
      createdAt: new Date().toISOString(),
      isAutoSave: false,
      mergedFrom: versionId, // Add metadata about the merge
    };

    versions.push(newVersion);

    return document;
  } catch (error) {
    console.error(`Error merging version ${versionId}:`, error);
    throw error;
  }
};

// Get a specific version
export const getVersion = async (
  documentId: string,
  versionId: string,
): Promise<JsonVersion> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.get(`${API_URL}/documents/${documentId}/versions/${versionId}`);
    // return response.data;

    const version = versions.find(
      (v) => v.documentId === documentId && v.id === versionId,
    );
    if (!version) {
      throw new Error("Version not found");
    }

    return version;
  } catch (error) {
    console.error(`Error fetching version ${versionId}:`, error);
    throw error;
  }
};
