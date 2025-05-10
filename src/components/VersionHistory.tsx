import { useEffect, useState } from "react";
import { getVersions } from "../services/api";
import { JsonVersion } from "../types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface VersionHistoryProps {
  documentId: string;
  onSelectVersion: (version: JsonVersion) => void;
  refreshKey?: boolean;
}

const VersionHistory = ({
  documentId,
  onSelectVersion,
  refreshKey,
}: VersionHistoryProps) => {
  const [versions, setVersions] = useState<JsonVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );

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
        // console.log("VersionHistory: Setting versions:", fetchedVersions);
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
        <h2 className="text-xl font-semibold p-4 bg-slate-100">
          Version History
        </h2>
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-slate-600">Loading version history...</span>
          </div>
          {/* Skeleton loading animation */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 mb-2 border rounded animate-pulse">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (versions.length === 0) {
    return <div className="p-4">No versions available yet.</div>;
  }

  return (
    <div className="bg-white h-full">
      <h2 className="text-xl font-semibold p-4 bg-slate-100">
        Version History
      </h2>
      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="p-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-3 mb-2 border rounded cursor-pointer ${selectedVersionId === version.id ? "bg-blue-100 border-blue-300" : "hover:bg-slate-50"}`}
              onClick={() => handleSelectVersion(version)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {formatDate(version.createdAt)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {version.isAutoSave ? "Auto-saved" : "Manual save"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectVersion(version);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VersionHistory;
