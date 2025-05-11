import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import {
  createDocument,
  createVersion,
  updateDocumentName,
  getVersions,
  updateCurrentVersion,
} from "../services/api";
import { Upload, Edit } from "lucide-react";

interface JsonEditorProps {
  documentId?: string;
  initialContent?: string;
  initialName?: string;
  currentVersionId?: string;
  setCurrentVersionId?: (id: string) => void;
  onSave?: (documentId: string) => void;
  onVersionCreated?: () => void;
  onDocumentsChanged?: () => void;
  toBeUpdatedVersionId?: string;
  setRefreshKey?: (key: boolean) => void;
  refreshKey?: boolean;
}

const JsonEditor = ({
  documentId,
  initialContent = "{}",
  initialName = "Untitled Document",
  currentVersionId,
  setCurrentVersionId,
  onSave,
  onVersionCreated,
  onDocumentsChanged,
  toBeUpdatedVersionId,
  setRefreshKey,
  refreshKey,
}: JsonEditorProps) => {
  console.log(
    "JsonEditor rendered with initialContent:",
    initialContent.substring(0, 50) + "...",
  );
  const [content, setContent] = useState<string>(initialContent);
  const [documentName, setDocumentName] = useState<string>(initialName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState<boolean>(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<
    string | undefined
  >(documentId);
  const autoSaveTimerRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>(initialContent);
  const hasChangesRef = useRef<boolean>(false);
  const contentRef = useRef(content);

  // Format JSON on initial load or when initialContent changes
  useEffect(() => {
    try {
      if (initialContent) {
        const parsed = JSON.parse(initialContent);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
        // Reset the last saved content reference to match the new initial content
        lastSavedContentRef.current = formatted;
        hasChangesRef.current = false;
      }
    } catch (err) {
      console.error("Error formatting initial JSON:", err);
      // If parsing fails, still update the content
      setContent(initialContent);
      lastSavedContentRef.current = initialContent;
      hasChangesRef.current = false;
    }
  }, [initialContent]);

  // Initialize document if none exists
  useEffect(() => {
    const initializeDocument = async () => {
      if (!currentDocumentId) {
        setIsCreatingDocument(true);
        try {
          const newDocument = await createDocument(
            initialContent,
            documentName,
          );
          const versions = await getVersions(newDocument.id);
          setCurrentDocumentId(newDocument.id);
          if (onSave) {
            onSave(newDocument.id);
          }
          setError(null);
        } catch (err) {
          console.error("Failed to create document:", err);
          setError("Failed to create document");
        } finally {
          setIsCreatingDocument(false);
        }
      }
    };

    initializeDocument();
  }, [currentDocumentId, documentName, onSave]);

  // Set up auto-save timer
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      window.clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setInterval(() => {
      if (currentVersionId && hasChangesRef.current && isValid) {
        // Get the latest content from the ref
        let latestContent = contentRef.current;
        // Try to format it
        try {
          const parsed = JSON.parse(latestContent);
          latestContent = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // If invalid, you can skip or save as-is
          // return; // Uncomment to skip saving invalid JSON
        }
        updateCurrentVersionMain(latestContent);
        if (setRefreshKey) {
          setRefreshKey(!refreshKey);
        }
      }
    }, 5000);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [currentVersionId, isValid]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid JSON");
      }
      return false;
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    console.log("handleEditorChange", value);
    if (value !== undefined) {
      setContent(value);
      const valid = validateJson(value);
      setIsValid(valid);
      hasChangesRef.current = value !== lastSavedContentRef.current;
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      setContent(formatted);
    } catch (err) {
      // If JSON is invalid, don't format
      console.error("Cannot format invalid JSON");
    }
  };

  const saveVersion = async (isAutoSave: boolean = false) => {
    if (!currentDocumentId || !isValid) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const newVersion = await createVersion(currentDocumentId, content, isAutoSave);
      if (!isAutoSave && setCurrentVersionId) {
        setCurrentVersionId(newVersion.id);
      }
      lastSavedContentRef.current = content;
      hasChangesRef.current = false;
      setError(null);

      if (!isAutoSave) {
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);

        // Notify parent component that a new version was created
        if (onVersionCreated) {
          onVersionCreated();
        }
      }
    } catch (err) {
      console.error("Failed to save version:", err);
      setError("Failed to save version");
    } finally {
      setIsSaving(false);
    }
  };

  // Update the current version without creating a new one (for auto-save)
  const updateCurrentVersionMain = async (contentToSave: string) => {
    console.log("updateCurrentVersionMain", contentToSave);
    if (!toBeUpdatedVersionId || !isValid) return;
    // Log the changes since last save

    if (contentToSave !== lastSavedContentRef.current) {
      console.log("Changes since last save:");
      console.log("Previous content:", lastSavedContentRef.current);
      console.log("Current content:", contentToSave);
      // Simple line-by-line diff
      const prevLines = lastSavedContentRef.current.split('\n');
      const currLines = contentToSave.split('\n');
      prevLines.forEach((line, idx) => {
        if (currLines[idx] !== line) {
          console.log(`Line ${idx + 1} changed from:`, line, "to:", currLines[idx]);
        }
      });
      if (currLines.length > prevLines.length) {
        for (let i = prevLines.length; i < currLines.length; i++) {
          console.log(`Line ${i + 1} added:`, currLines[i]);
        }
      }
    }
    setIsSaving(true);
    try {
      await updateCurrentVersion(toBeUpdatedVersionId, contentToSave);
      lastSavedContentRef.current = contentToSave;
      hasChangesRef.current = false;
      setError(null);
      console.log("Auto-saved changes to current version");
      // Notify parent to refresh VersionHistory and DiffViewer
      if (onVersionCreated) {
        onVersionCreated();
      }
      if (onDocumentsChanged) {
        onDocumentsChanged();
      }
    } catch (err) {
      console.error("Failed to auto-save changes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    saveVersion(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Try to parse and format the JSON
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
        setIsValid(true);
        setError(null);
        hasChangesRef.current = true;
      } catch (err) {
        if (err instanceof Error) {
          setError(`Invalid JSON file: ${err.message}`);
        } else {
          setError("Invalid JSON file");
        }
        setIsValid(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 bg-slate-100">
        <div>
          {isEditingName ? (
            <div className="flex items-center">
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="text-xl font-semibold border border-blue-300 rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    setIsEditingName(false);
                    await updateDocumentName(currentDocumentId, documentName);
                    if (onDocumentsChanged) {
                      onDocumentsChanged();
                    }
                  }
                }}
              />
              {/* <button
                onClick={async () => {
                  setIsEditingName(false);
                  if (currentDocumentId) {
                    try {
                      await updateDocumentName(currentDocumentId, documentName);
                      if (onDocumentsChanged) {
                        onDocumentsChanged();
                      }
                    } catch (err) {
                      console.error("Failed to update document name:", err);
                      setError("Failed to update document name");
                    }
                  }
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Save
              </button> */}
            </div>
          ) : (
            <h2
              className="text-xl font-semibold cursor-pointer hover:text-blue-600 flex items-center"
              onClick={() => setIsEditingName(true)}
            >
              {documentName}
              <Edit className="h-4 w-4 ml-2 text-gray-500" />
            </h2>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saveSuccess && (
            <p className="text-green-600 text-sm">
              ✓ Version saved successfully
            </p>
          )}
          {isCreatingDocument && (
            <p className="text-blue-500 text-sm flex items-center">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>{" "}
              Creating document...
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="json-file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("json-file-upload")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" /> Upload JSON
          </Button>
          <Button onClick={formatJson} variant="outline" disabled={!isValid}>
            Format JSON
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || isSaving || !hasChangesRef.current}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Version"
            )}
          </Button>
          {hasChangesRef.current && (
            <span className="text-xs text-slate-500 self-center ml-2">
              Auto-save enabled (30s)
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={content}
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: false,
            tabSize: 2,
            wordWrap: "on",
            wrappingIndent: "indent",
            wrappingStrategy: "advanced",
            lineNumbers: "on",
            folding: true,
            foldingStrategy: "auto",
            language: "json",
          }}
        />
      </div>
    </div>
  );
};

export default JsonEditor;
