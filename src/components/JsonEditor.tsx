import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { createDocument, createVersion } from "../services/api";
import { Upload } from "lucide-react";

interface JsonEditorProps {
  documentId?: string;
  initialContent?: string;
  onSave?: (documentId: string) => void;
}

const JsonEditor = ({
  documentId,
  initialContent = "{}",
  onSave,
}: JsonEditorProps) => {
  const [content, setContent] = useState<string>(initialContent);
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

  // Format JSON on initial load
  useEffect(() => {
    try {
      if (initialContent) {
        const parsed = JSON.parse(initialContent);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
      }
    } catch (err) {
      console.error("Error formatting initial JSON:", err);
    }
  }, []);

  // Initialize document if none exists
  useEffect(() => {
    const initializeDocument = async () => {
      if (!currentDocumentId) {
        setIsCreatingDocument(true);
        try {
          const newDocument = await createDocument(initialContent);
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
  }, [currentDocumentId, initialContent, onSave]);

  // Set up auto-save timer
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      window.clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setInterval(() => {
      if (currentDocumentId && hasChangesRef.current && isValid) {
        saveVersion(true);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [currentDocumentId, isValid]);

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
      await createVersion(currentDocumentId, content, isAutoSave);
      lastSavedContentRef.current = content;
      hasChangesRef.current = false;
      setError(null);

      if (!isAutoSave) {
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to save version:", err);
      setError("Failed to save version");
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
          <h2 className="text-xl font-semibold">JSON Editor</h2>
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
