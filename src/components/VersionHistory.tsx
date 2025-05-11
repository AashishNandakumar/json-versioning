import { useEffect, useState } from "react";
import { getVersions } from "../services/api";
import { JsonVersion } from "../types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import VersionGraph from "./VersionGraph";
import { History, Clock, GitBranch, GitCommit, GitMerge } from "lucide-react";

interface VersionHistoryProps {
  documentId: string;
  onSelectVersion: (version: JsonVersion) => void;
  refreshKey?: boolean;
  setToBeUpdatedVersionId: (id: string) => void;
}

const VersionHistory = ({
  documentId,
  onSelectVersion,
  refreshKey,
  setToBeUpdatedVersionId,
}: VersionHistoryProps) => {
  const [versions, setVersions] = useState<JsonVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("list");

  // Set up event listeners for updates
  useEffect(() => {
    const fetchVersions = async () => {
      if (!documentId) {
        console.log("No documentId provided to VersionHistory component");
        return;
      }

      console.log(
        "VersionHistory: Fetching versions for document ID:",
        documentId,
      );
      setLoading(true);
      try {
        const fetchedVersions = await getVersions(documentId);
        console.log("VersionHistory: Fetched versions:", fetchedVersions);

        if (fetchedVersions.length === 0) {
          console.log(
            "VersionHistory: No versions found for document ID:",
            documentId,
          );
        }

        setVersions(
          fetchedVersions.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        setError(null);
      } catch (err) {
        console.error("Failed to fetch versions:", err);
        setError("Failed to load version history");
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();

    // Listen for merge events
    const handleMergeEvent = (event: CustomEvent) => {
      if (event.detail.documentId === documentId) {
        console.log("Merge event detected, refreshing versions");
        fetchVersions();
      }
    };

    window.addEventListener("versionMerged", handleMergeEvent as EventListener);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener(
        "versionMerged",
        handleMergeEvent as EventListener,
      );
    };
  }, [documentId, refreshKey]);

  const handleSelectVersion = (version: JsonVersion) => {
    setSelectedVersionId(version.id);
    onSelectVersion(version);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white h-full">
        <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 flex items-center">
          <div className="p-1.5 rounded-md bg-blue-100 mr-3">
            <History className="h-5 w-5 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold">Version History</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-slate-600 font-medium">
              Loading version history...
            </span>
          </div>
          {/* Skeleton loading animation */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 mb-3 border border-slate-200 rounded-lg animate-pulse bg-slate-50/50"
            >
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    {i === 1 && (
                      <div className="h-5 w-12 bg-green-200 rounded-full mr-2"></div>
                    )}
                    <div className="h-5 bg-slate-200 rounded-full w-32"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full w-24 mb-1"></div>
                  {i === 2 && (
                    <div className="h-3 bg-blue-100 rounded-full w-20 mt-1"></div>
                  )}
                </div>
                <div className="h-8 bg-slate-200 rounded-md w-16 flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="p-4 rounded-full bg-red-100 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-red-600 font-medium">
          Error loading version history
        </p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="p-4 rounded-full bg-slate-100 mb-4">
          <History className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium">No versions available yet</p>
        <p className="text-slate-400 text-sm mt-2">
          Save your first version to start tracking changes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-blue-100 mr-3">
                <History className="h-5 w-5 text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold">Version History</h2>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                List View
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                Graph View
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="list"
          className="flex-grow overflow-hidden m-0 border-0"
        >
          <ScrollArea className="h-full">
            <div className="p-2">
              {versions.map((version, index) => {
                const isHead = index === 0; // First version is the HEAD (most recent)
                if (isHead) {
                  setToBeUpdatedVersionId(version.id);
                }
                return (
                  <div
                    key={version.id}
                    className={`p-4 mb-3 border rounded-lg cursor-pointer transition-all ${selectedVersionId === version.id ? "bg-blue-50 border-blue-300 shadow-sm" : "hover:bg-slate-50 border-slate-200"} ${isHead ? "border-green-500 border-2" : ""}`}
                    onClick={() => handleSelectVersion(version)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium flex items-center">
                          {isHead && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                              HEAD
                            </span>
                          )}
                          <span className="text-slate-800">
                            {formatDate(version.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center">
                          {version.isAutoSave ? (
                            <>
                              <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              Auto-saved
                            </>
                          ) : (
                            <>
                              <GitCommit className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              Manual save
                            </>
                          )}
                        </div>
                        {version.mergedFrom && (
                          <div className="text-xs text-blue-600 mt-1 flex items-center">
                            <GitMerge className="h-3 w-3 mr-1" />
                            Merged version
                          </div>
                        )}
                      </div>
                      <Button
                        variant={
                          selectedVersionId === version.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVersion(version);
                        }}
                        className={
                          selectedVersionId === version.id
                            ? "bg-blue-600"
                            : "border-slate-300 hover:bg-slate-100"
                        }
                      >
                        {selectedVersionId === version.id ? "Selected" : "View"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="graph"
          className="flex-grow overflow-hidden m-0 border-0"
        >
          <VersionGraph
            versions={versions}
            selectedVersionId={selectedVersionId}
            onSelectVersion={handleSelectVersion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VersionHistory;
