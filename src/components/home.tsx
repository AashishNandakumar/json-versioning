import { useState, useEffect } from "react";
import JsonEditor from "./JsonEditor";
import VersionHistory from "./VersionHistory";
import DiffViewer from "./DiffViewer";
import { JsonDocument, JsonVersion } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Plus, FolderOpen } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { getDocuments } from "../services/api";

function Home() {
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const [selectedVersion, setSelectedVersion] = useState<JsonVersion | null>(
    null,
  );
  const [documents, setDocuments] = useState<JsonDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);
  const [showDocumentSelector, setShowDocumentSelector] =
    useState<boolean>(true);
  const [initialContent, setInitialContent] = useState<string>(
    JSON.stringify(
      {
        name: "JSON Versioning Editor",
        version: "1.0.0",
        description:
          "A web application that provides a JSON editor with versioning capabilities",
        features: [
          "JSON editing with syntax highlighting",
          "Automatic validation",
          "Version history",
          "Visual diff between versions",
        ],
      },
      null,
      2,
    ),
  );
  const [versionRefreshKey, setVersionRefreshKey] = useState(false);
  const { user, logout } = useAuth();

  // Fetch available documents when component mounts
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        // TODO: Add proper error handling UI
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
    // In a real app, you might want to refresh this list periodically
    // or when certain actions are performed
  }, []);

  const handleDocumentSave = (id: string) => {
    console.log("Document saved with ID:", id);
    setDocumentId(id);
    setShowDocumentSelector(false);
  };

  const handleCreateNewDocument = () => {
    setDocumentId(undefined);
    setShowDocumentSelector(false);
  };

  const handleSelectDocument = (id: string) => {
    setDocumentId(id);
    setShowDocumentSelector(false);
    // TODO: In a real app, fetch the document content here and set it as initialContent
    // This would require an API call to get the document by ID
  };

  const handleSelectVersion = (version: JsonVersion) => {
    setSelectedVersion(version);
  };

  const handleVersionCreated = () => {
    setVersionRefreshKey((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen bg-slate-50">
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">JSON Versioning Editor</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name || "User"}</span>
          <Button
            variant="outline"
            onClick={() => setShowDocumentSelector(true)}
            size="sm"
          >
            Browse Documents
          </Button>
          <Button variant="outline" onClick={logout} size="sm">
            Logout
          </Button>
        </div>
      </header>

      {showDocumentSelector ? (
        <div className="h-[calc(100vh-4rem)] p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Select a Document</h2>

            <div className="mb-8">
              <Button
                onClick={handleCreateNewDocument}
                className="mb-4 w-full py-8 text-lg"
              >
                <Plus className="mr-2 h-5 w-5" /> Create New JSON Document
              </Button>
            </div>

            {loadingDocuments ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Loading documents...
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {/* Skeleton loading animation */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-md animate-pulse flex justify-between items-center"
                    >
                      <div className="w-full">
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : documents.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Or select an existing document:
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-md hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div>
                        <p className="font-medium">Document ID: {doc.id}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(doc.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No existing documents found.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-4rem)]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={30}>
              <JsonEditor
                documentId={documentId}
                initialContent={initialContent}
                onSave={handleDocumentSave}
                onVersionCreated={handleVersionCreated}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  {documentId && (
                    <VersionHistory
                      documentId={documentId}
                      onSelectVersion={handleSelectVersion}
                      refreshKey={versionRefreshKey}
                    />
                  )}
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={50}>
                  <DiffViewer version={selectedVersion} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}

export default Home;
