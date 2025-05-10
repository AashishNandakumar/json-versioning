import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { JsonVersion } from "../types";
import { getDocument, mergeVersions } from "../services/api";
import { create } from "jsondiffpatch";
import { Button } from "./ui/button";
import { Minus, Plus, GitMerge } from "lucide-react";

interface DiffViewerProps {
  version: JsonVersion | null;
}

const DiffViewer = ({ version }: DiffViewerProps) => {
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
        const document = await getDocument(version.documentId);
        console.log("DiffViewer: Fetched current document:", document);
        setCurrentContent(document.content);
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

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener(
        "versionMerged",
        handleMergeEvent as EventListener,
      );
    };
  }, [version?.id]); // Use version.id as dependency to ensure re-fetch when version changes

  if (!version) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-slate-500">Select a version to view differences</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600">Loading document content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-red-500">{error}</p>
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
      <div className="flex justify-between items-center p-4 bg-slate-100">
        <h2 className="text-xl font-semibold">Diff View</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoomLevel >= 1.5}
          >
            <Plus className="h-4 w-4" />
          </Button>
          {version && (
            <div className="flex items-center ml-4">
              {mergeSuccess && (
                <span className="text-green-600 text-sm mr-2">
                  ✓ Merged successfully
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleMergeVersions}
                disabled={merging}
              >
                {merging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div>
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
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No differences to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffViewer;
