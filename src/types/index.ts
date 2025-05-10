export interface JsonDocument {
  id: string;
  content: string;
  createdAt: string;
  userId?: string; // Added for authentication
}

export interface JsonVersion {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
  isAutoSave: boolean;
  userId?: string; // Added for authentication
  diff?: any; // Store jsondiffpatch diff output
  mergedFrom?: string; // ID of the version that was merged, if this version is a result of a merge
}
