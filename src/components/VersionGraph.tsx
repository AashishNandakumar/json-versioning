import { useEffect, useRef, useState } from "react";
import { JsonVersion } from "../types";
import { Button } from "./ui/button";
import { GitCommit, GitMerge, GitBranch } from "lucide-react";

interface VersionGraphProps {
  versions: JsonVersion[];
  selectedVersionId: string | null;
  onSelectVersion: (version: JsonVersion) => void;
}

const VersionGraph = ({
  versions,
  selectedVersionId,
  onSelectVersion,
}: VersionGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphHeight, setGraphHeight] = useState<number>(0);

  // Sort versions by date (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Calculate graph dimensions
  useEffect(() => {
    if (versions.length === 0) return;

    // Height based on number of versions
    const height = Math.max(versions.length * 80, 300);
    setGraphHeight(height);
  }, [versions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (versions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No versions available</div>
    );
  }

  return (
    <div className="bg-white h-full overflow-auto">
      <div className="p-4 bg-slate-100 sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Version Graph</h2>
      </div>

      <div className="p-4 overflow-auto flex justify-center">
        <svg
          ref={svgRef}
          width="90%"
          height={graphHeight}
          className="version-graph"
        >
          {/* Main timeline line */}
          <line
            x1="150"
            y1="10"
            x2="150"
            y2={graphHeight - 10}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Version nodes and connections */}
          {sortedVersions.map((version, index) => {
            const y = 40 + index * 80;
            const isHead = index === 0;
            const isMerge = Boolean(version.mergedFrom);
            const isSelected = version.id === selectedVersionId;

            // Find the source version if this is a merge
            const mergeSourceIndex = isMerge
              ? sortedVersions.findIndex((v) => v.id === version.mergedFrom)
              : -1;

            return (
              <g key={version.id}>
                {/* Draw merge line if applicable */}
                {isMerge && mergeSourceIndex > -1 && (
                  <path
                    d={`M 150 ${y} C 100 ${y}, 100 ${40 + mergeSourceIndex * 80}, 150 ${40 + mergeSourceIndex * 80}`}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                  />
                )}

                {/* Version node */}
                <circle
                  cx="150"
                  cy={y}
                  r={isSelected ? "16" : "14"}
                  fill={isHead ? "#22c55e" : isSelected ? "#3b82f6" : "#f1f5f9"}
                  stroke={isSelected ? "#1d4ed8" : "#94a3b8"}
                  strokeWidth={isSelected ? "3" : "2"}
                  onClick={() => onSelectVersion(version)}
                  className="cursor-pointer hover:stroke-blue-500 transition-colors"
                />

                {/* Version icon */}
                <foreignObject x="142" y={y - 8} width="16" height="16">
                  <div className="h-full flex items-center justify-center">
                    {isMerge ? (
                      <GitMerge
                        size={12}
                        className={
                          isHead
                            ? "text-white"
                            : isSelected
                              ? "text-white"
                              : "text-gray-600"
                        }
                      />
                    ) : (
                      <GitCommit
                        size={12}
                        className={
                          isHead
                            ? "text-white"
                            : isSelected
                              ? "text-white"
                              : "text-gray-600"
                        }
                      />
                    )}
                  </div>
                </foreignObject>

                {/* Version info */}
                <foreignObject x="180" y={y - 20} width="300" height="40">
                  <div className="flex flex-col">
                    <div className="font-medium flex items-center">
                      {isHead && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded">
                          HEAD
                        </span>
                      )}
                      <span className="text-sm">
                        {formatDate(version.createdAt)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {version.isAutoSave ? "Auto-saved" : "Manual save"}
                    </div>
                  </div>
                </foreignObject>

                {/* Version selection button */}
                <foreignObject x="480" y={y - 15} width="100" height="30">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onSelectVersion(version)}
                  >
                    {isSelected ? "Selected" : "View"}
                  </Button>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default VersionGraph;
