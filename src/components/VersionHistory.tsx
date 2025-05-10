import { useEffect, useState } from "react";
import { getVersions } from "../services/api";
import { JsonVersion } from "../types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface VersionHistoryProps {
  documentId: string;
  onSelectVersion: (version: JsonVersion) => void;
}

const VersionHistory = ({
  documentId,
  onSelectVersion,
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
  }, [documentId]);

  const handleSelectVersion = (version: JsonVersion) => {
    setSelectedVersionId(version.id);
    onSelectVersion(version);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="p-4">Loading version history...</div>;
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
