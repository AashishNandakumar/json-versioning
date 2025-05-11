import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { JsonVersion } from "../types";
import { getDocument, getVersions, mergeVersions } from "../services/api";
import { create } from "jsondiffpatch";
import { Button } from "./ui/button";
import { Minus, Plus, GitMerge, GitCompare, CheckCircle } from "lucide-react";

interface DiffViewerProps {
  version: JsonVersion | null;
  refreshKey: boolean;
}

const DiffViewer = ({ version, refreshKey }: DiffViewerProps) => {
  // Create jsondiffpatch instance
  const jsondiffpatch = create({
    objectHash: (obj: any) => obj.id || JSON.stringify(obj),
    propertyFilter: (name: string) => name !== "$hashKey",
  });
  const [currentContent, setCurrentContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.8); // Default zoom level
  const [merging, setMerging] = useState<boolean>(false);
  const [mergeSuccess, setMergeSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentContent = async () => {
      if (!version) {
        console.log("No version provided to DiffViewer");
        return;
      }

      console.log(
        "DiffViewer: Fetching current content for document ID:",
        version.documentId,
        "Version ID:",
        version.id,
      );
      setLoading(true);
      try {
        // const document = await getDocument(version.documentId);
        const versions = await getVersions(version.documentId);
        const headVersion = versions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

        console.log("DiffViewer: Fetched current document:", headVersion);
        setCurrentContent(headVersion.content);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch current document:", err);
        setError("Failed to load current document");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentContent();

    // Listen for merge events to update content
    const handleMergeEvent = (event: CustomEvent) => {
      if (version && event.detail.documentId === version.documentId) {
        console.log("Merge event detected in DiffViewer, refreshing content");
        fetchCurrentContent();
      }
    };

    window.addEventListener("versionMerged", handleMergeEvent as EventListener);

    // Clean up event listener on unmoun
    return () => {
      window.removeEventListener(
        "versionMerged",
        handleMergeEvent as EventListener,
      );
    };
  }, [version?.id, refreshKey]); // Use version.id as dependency to ensure re-fetch when version changes

  if (!version) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="p-4 rounded-full bg-slate-100 mb-4">
          <GitCompare className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium">
          Select a version to view differences
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Choose a version from the history above
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 opacity-50"></div>
        <p className="text-slate-600 font-medium">
          Loading document content...
        </p>
        <p className="text-slate-400 text-sm mt-2">Preparing diff view</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
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
        <p className="text-red-600 font-medium">Error loading content</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // Format JSON for better diff viewing
  const formatJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  // Generate diff view content
  const generateDiffContent = () => {
    if (!version || !currentContent) {
      console.log("Missing version or currentContent", {
        version,
        currentContent,
      });
      return { oldValue: "", newValue: "" };
    }

    try {
      console.log("Generating diff content for version:", version.id);

      // Always try to parse as JSON first for better formatting
      try {
        const oldJson = JSON.parse(version.content);
        const currentJson = JSON.parse(currentContent);

        // Format for display
        const oldFormatted = JSON.stringify(oldJson, null, 2);
        const currentFormatted = JSON.stringify(currentJson, null, 2);

        console.log("Successfully parsed both contents as JSON");
        return {
          oldValue: oldFormatted,
          newValue: currentFormatted,
        };
      } catch (jsonError) {
        console.warn(
          "Could not parse as JSON, falling back to text diff",
          jsonError,
        );
        // Fallback to simple text diff
        return {
          oldValue: formatJson(version.content),
          newValue: formatJson(currentContent),
        };
      }
    } catch (e) {
      console.error("Error generating diff:", e);
      return {
        oldValue: version.content,
        newValue: currentContent,
      };
    }
  };

  const diffContent = generateDiffContent();

  console.log("Rendering DiffViewer with version:", version?.id);
  console.log("Diff content:", diffContent);

  // Handle merging versions
  const handleMergeVersions = async () => {
    if (!version) return;

    setMerging(true);
    setMergeSuccess(false);
    try {
      await mergeVersions(version.documentId, version.id);
      // Refresh the current content after merge
      const document = await getDocument(version.documentId);
      setCurrentContent(document.content);
      setError(null);
      setMergeSuccess(true);

      // Trigger a custom event to notify other components about the merge
      const mergeEvent = new CustomEvent("versionMerged", {
        detail: { documentId: version.documentId },
      });
      window.dispatchEvent(mergeEvent);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setMergeSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to merge versions:", err);
      setError("Failed to merge versions");
    } finally {
      setMerging(false);
    }
  };

  // Handle zoom in/out
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="h-full bg-white">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-blue-100 mr-3">
            <GitCompare className="h-5 w-5 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold">Diff View</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200 rounded-md p-0.5 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoomLevel >= 1.5}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {version && (
            <div className="flex items-center">
              {mergeSuccess && (
                <span className="text-green-600 text-sm mr-2 bg-green-50 px-2 py-1 rounded-md border border-green-200 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Merged successfully
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleMergeVersions}
                disabled={merging}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {merging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Merging...
                  </>
                ) : (
                  <>
                    <GitMerge className="h-4 w-4 mr-2" />
                    Merge Version
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div
        className="p-4 h-[calc(100%-4rem)] overflow-auto"
        style={{ fontSize: `${zoomLevel * 100}%` }}
      >
        {diffContent.oldValue && diffContent.newValue ? (
          <ReactDiffViewer
            oldValue={diffContent.oldValue}
            newValue={diffContent.newValue}
            splitView={true}
            leftTitle="Selected Version"
            rightTitle="Current Version"
            useDarkTheme={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-slate-600 font-medium">
              No differences to display
            </p>
            <p className="text-slate-400 text-sm mt-2">
              The selected version is identical to the current version
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffViewer;
