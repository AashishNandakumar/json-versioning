# JSON Versioning Editor - Backend Implementation Logic

## Overview

This document provides detailed information about the frontend logic that needs to be replicated in the backend for the JSON Versioning Editor application. The backend should implement the same functionality for document management, versioning, diffing, and merging operations.

## Core Data Models

### JsonDocument

```typescript
interface JsonDocument {
  id: string;           // Unique identifier for the document
  content: string;      // Current JSON content as a string
  createdAt: string;    // ISO timestamp of creation
  // Optional additional fields for production:
  // title?: string;    // User-friendly title
  // description?: string; // Optional description
  // ownerId?: string;  // User ID of the owner
  // collaborators?: string[]; // List of user IDs with access
}
```

### JsonVersion

```typescript
interface JsonVersion {
  id: string;           // Unique identifier for this version
  documentId: string;   // Reference to the parent document
  content: string;      // The JSON content at this version
  createdAt: string;    // ISO timestamp of creation
  isAutoSave: boolean;  // Whether this was auto-saved or manually saved
  diff?: any;           // The diff object between this and previous version
  mergedFrom?: string;  // If this version was created by merging, the source version ID
}
```

## Core Functionality

### 1. Document Management

#### Creating Documents

When a new document is created:

1. Generate a unique ID for the document
2. Store the initial content as provided by the user
3. Set the creation timestamp
4. Return the created document object

```javascript
// Example implementation
function createDocument(content) {
  const newDocument = {
    id: generateUniqueId(),
    content,
    createdAt: new Date().toISOString(),
  };
  
  // Store in database
  saveDocumentToDatabase(newDocument);
  
  return newDocument;
}
```

#### Retrieving Documents

1. Implement authentication and authorization to ensure users can only access their documents
2. Support pagination for listing documents
3. Support filtering and sorting options

### 2. Version Control

#### Creating Versions

When a new version is saved:

1. Generate a unique ID for the version
2. Store the full content at this point in time
3. Calculate and store the diff between this version and the previous version
4. Update the parent document with the new content
5. Set metadata (timestamp, auto-save flag)

```javascript
// Example implementation using jsondiffpatch
function createVersion(documentId, content, isAutoSave) {
  // Get the current document
  const document = getDocumentById(documentId);
  if (!document) throw new Error("Document not found");
  
  // Parse JSON content
  let oldContent, newContent;
  try {
    oldContent = JSON.parse(document.content);
    newContent = JSON.parse(content);
  } catch (e) {
    // Fallback to treating as plain text if parsing fails
    oldContent = document.content;
    newContent = content;
  }
  
  // Generate diff using jsondiffpatch
  const jsondiffpatch = createDiffPatcher();
  const diff = jsondiffpatch.diff(oldContent, newContent);
  
  // Create new version
  const newVersion = {
    id: generateUniqueId(),
    documentId,
    content,
    createdAt: new Date().toISOString(),
    isAutoSave,
    diff,
  };
  
  // Store version in database
  saveVersionToDatabase(newVersion);
  
  // Update document with new content
  document.content = content;
  updateDocumentInDatabase(document);
  
  return newVersion;
}

// Create jsondiffpatch instance with appropriate configuration
function createDiffPatcher() {
  return jsondiffpatch.create({
    objectHash: (obj) => obj.id || JSON.stringify(obj),
    propertyFilter: (name) => name !== "$hashKey",
  });
}
```

#### Retrieving Versions

1. Implement filtering to get versions for a specific document
2. Sort versions by creation time (newest first by default)
3. Support pagination for documents with many versions

### 3. Diffing and Merging

#### Calculating Diffs

The application uses the `jsondiffpatch` library to calculate differences between JSON objects:

```javascript
// Configure jsondiffpatch
const jsondiffpatch = jsondiffpatch.create({
  objectHash: (obj) => obj.id || JSON.stringify(obj),
  propertyFilter: (name) => name !== "$hashKey",
});

// Calculate diff between two JSON objects
function calculateDiff(oldJson, newJson) {
  return jsondiffpatch.diff(oldJson, newJson);
}
```

#### Merging Versions

When merging a version into the current document:

1. Retrieve the specified version
2. Update the document with the version's content
3. Create a new version that represents this merge operation
4. Add metadata about which version was merged

```javascript
function mergeVersions(documentId, versionId) {
  // Get the document and version
  const document = getDocumentById(documentId);
  const version = getVersionById(versionId);
  
  if (!document || !version || version.documentId !== documentId) {
    throw new Error("Document or version not found");
  }
  
  // Update the document with the version content
  document.content = version.content;
  updateDocumentInDatabase(document);
  
  // Create a new version that represents the merge
  const newVersion = {
    id: generateUniqueId(),
    documentId,
    content: version.content,
    createdAt: new Date().toISOString(),
    isAutoSave: false,
    mergedFrom: versionId,
  };
  
  // Store the new version
  saveVersionToDatabase(newVersion);
  
  return document;
}
```

## API Endpoints to Implement

Based on the frontend implementation, the backend should provide these RESTful API endpoints:

### Documents

- `POST /api/documents` - Create a new document
  - Request body: `{ content: string }`
  - Response: JsonDocument object

- `GET /api/documents` - List all documents for the current user
  - Query parameters: pagination, sorting, filtering options
  - Response: Array of JsonDocument objects

- `GET /api/documents/:id` - Get a specific document by ID
  - Response: JsonDocument object

### Versions

- `POST /api/documents/:documentId/versions` - Create a new version
  - Request body: `{ content: string, isAutoSave: boolean }`
  - Response: JsonVersion object

- `GET /api/documents/:documentId/versions` - List all versions for a document
  - Query parameters: pagination, sorting options
  - Response: Array of JsonVersion objects

- `GET /api/documents/:documentId/versions/:versionId` - Get a specific version
  - Response: JsonVersion object

- `POST /api/documents/:documentId/versions/:versionId/merge` - Merge a version into the current document
  - Response: Updated JsonDocument object

## Authentication and Authorization

The backend should implement:

1. User authentication (login/register)
2. Session management
3. Document ownership and access control
4. Permission checks for all operations

## Performance Considerations

1. **Efficient Storage**: Consider storing diffs instead of full content for each version to save space
2. **Caching**: Implement caching for frequently accessed documents and versions
3. **Pagination**: Ensure all list endpoints support pagination for large datasets
4. **Indexing**: Create appropriate database indexes for document and version queries

## Error Handling

Implement consistent error handling with appropriate HTTP status codes:

- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication required
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Document or version not found
- 500 Internal Server Error - Unexpected errors

Each error response should include:
- Error code
- Human-readable message
- Additional details when appropriate

## Websocket Considerations (Optional)

For real-time collaboration features:

1. Implement WebSocket connections for document updates
2. Broadcast changes to all connected clients
3. Handle conflict resolution for simultaneous edits

## Testing Recommendations

1. Unit tests for core logic (document creation, versioning, diffing, merging)
2. Integration tests for API endpoints
3. Load testing for performance under heavy usage
4. Security testing for authentication and authorization
