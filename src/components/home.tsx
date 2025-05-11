import { useState, useEffect } from "react";
import JsonEditor from "./JsonEditor";
import VersionHistory from "./VersionHistory";
import DiffViewer from "./DiffViewer";
import { JsonDocument, JsonVersion } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Plus, FolderOpen, Code } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { getDocuments, getDocument, getVersions } from "../services/api";

function Home() {
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const [currentVersionId, setCurrentVersionId] = useState<string | undefined>(
    undefined,
  );
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
  const [initialDocumentName, setInitialDocumentName] =
    useState<string>("New JSON Document");
  const [versionRefreshKey, setVersionRefreshKey] = useState(false);
  const [toBeUpdatedVersionId, setToBeUpdatedVersionId] = useState<
    string | null
  >(null);
  const { user, logout } = useAuth();

  // Fetch available documents (moved outside useEffect for reuse)
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

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocumentSave = async (id: string) => {
    console.log("Document saved with ID:", id);
    setDocumentId(id);
    setShowDocumentSelector(false);
    fetchDocuments(); // Refresh after creating a new document
    // Fetch latest version for the new document
    const versions = await getVersions(id);
    if (versions && versions.length > 0) {
      // Sort by createdAt descending
      const sortedVersions = versions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setCurrentVersionId(sortedVersions[0].id);
    }
  };

  const handleCreateNewDocument = () => {
    setDocumentId(undefined);
    setShowDocumentSelector(false);
  };

  const handleSelectDocument = async (id: string) => {
    try {
      // Fetch the document to get its name
      const document = await getDocument(id);
      // Fetch all versions to get the latest one
      const versions = await getVersions(id);
      let contentToUse = document.content;
      if (versions && versions.length > 0) {
        // Sort versions by date (newest first)
        const sortedVersions = versions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        // Use the content from the latest version (HEAD)
        console.log("Using latest version content", sortedVersions[0].id);
        contentToUse = sortedVersions[0].content;
        setCurrentVersionId(sortedVersions[0].id);
      } else {
        // If no versions exist, use the document's content
        console.log("No versions found, using document content");
        setCurrentVersionId(undefined);
      }
      // Set all state variables AFTER we have the data
      setInitialContent(contentToUse);
      setInitialDocumentName(document.name);
      setDocumentId(id);
      setShowDocumentSelector(false);
      console.log(
        "Document loaded with content:",
        contentToUse.substring(0, 50) + "...",
      );
    } catch (error) {
      console.error("Error fetching document or versions:", error);
      setDocumentId(id);
      setShowDocumentSelector(false);
      setCurrentVersionId(undefined);
    }
  };

  const handleSelectVersion = (version: JsonVersion) => {
    setSelectedVersion(version);
  };

  const handleVersionCreated = () => {
    // Trigger refresh of version history once
    setVersionRefreshKey((prev) => !prev);
  };

  // New: handle document name update
  const handleDocumentNameUpdated = () => {
    fetchDocuments(); // Refresh after renaming a document
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 blur-sm"></div>
            <Code className="relative h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold ml-2">JsonVerse Dashboard</h1>
          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-700/50 rounded-full px-3 py-1 mr-2">
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm">Welcome, {user?.name || "User"}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowDocumentSelector(true)}
            size="sm"
            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 transition-colors"
          >
            Browse Documents
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            size="sm"
            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 transition-colors"
          >
            Logout
          </Button>
        </div>
      </header>

      {showDocumentSelector ? (
        <div className="h-[calc(100vh-4rem)] p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Select a Document
            </h2>
            <p className="text-slate-500 mb-8">
              Choose an existing document or create a new one
            </p>

            <div className="mb-8">
              <Button
                onClick={handleCreateNewDocument}
                className="mb-4 w-full py-8 text-lg group relative overflow-hidden bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-30 transition-transform group-hover:translate-x-0"></span>
                <span className="relative flex items-center">
                  <Plus className="mr-2 h-5 w-5" /> Create New JSON Document
                </span>
              </Button>
            </div>

            {loadingDocuments ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading documents...
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {/* Skeleton loading animation */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-5 border border-slate-200 rounded-lg animate-pulse flex justify-between items-center bg-slate-50/50"
                    >
                      <div className="w-full">
                        <div className="h-5 bg-slate-200 rounded-full w-3/4 mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded-full w-1/2 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded-full w-1/4"></div>
                      </div>
                      <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : documents.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Your documents
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer flex justify-between items-center transition-all group shadow-sm hover:shadow-md"
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div>
                        <p className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                          {doc.name || "Untitled Document"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(doc.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {doc.id.substring(0, 8)}...
                          {doc.id.substring(doc.id.length - 4)}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex rounded-full bg-slate-100 p-3 mb-4">
                  <FolderOpen className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No documents found</p>
                <p className="text-slate-400 text-sm mt-1">
                  Create your first JSON document to get started
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-4rem)]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="border-r border-slate-200"
            >
              <JsonEditor
                documentId={documentId}
                initialContent={initialContent}
                initialName={initialDocumentName}
                currentVersionId={currentVersionId}
                setCurrentVersionId={setCurrentVersionId}
                onSave={handleDocumentSave}
                onVersionCreated={handleVersionCreated}
                onDocumentsChanged={handleDocumentNameUpdated}
                toBeUpdatedVersionId={toBeUpdatedVersionId}
                setRefreshKey={setVersionRefreshKey}
                refreshKey={versionRefreshKey}
              />
            </ResizablePanel>

            <ResizableHandle
              className="bg-slate-200 hover:bg-blue-400 transition-colors"
              withHandle
            />

            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel
                  defaultSize={50}
                  className="border-b border-slate-200"
                >
                  {documentId && (
                    <VersionHistory
                      documentId={documentId}
                      onSelectVersion={handleSelectVersion}
                      refreshKey={versionRefreshKey}
                      setToBeUpdatedVersionId={setToBeUpdatedVersionId}
                    />
                  )}
                </ResizablePanel>

                <ResizableHandle
                  className="bg-slate-200 hover:bg-blue-400 transition-colors"
                  withHandle
                />

                <ResizablePanel defaultSize={50}>
                  <DiffViewer
                    version={selectedVersion}
                    refreshKey={versionRefreshKey}
                  />
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
