import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Globe,
  Terminal,
  FileText,
  Search,
  Code,
  XCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";

const toolIconMap: Record<string, LucideIcon> = {
  web_search: Globe,
  web_extract: Globe,
  browser_navigate: Globe,
  terminal: Terminal,
  execute_code: Code,
  read_file: FileText,
  write_file: FileText,
  patch: FileText,
  search_files: Search,
  grep: Search,
};

const defaultIcon = Terminal;

export interface ToolExecutionCardProps {
  toolName: string;
  status: "running" | "completed" | "failed";
  description?: string;
  duration?: number;
}

export function ToolExecutionCard({
  toolName,
  status,
  description,
  duration,
}: ToolExecutionCardProps) {
  const Icon = toolIconMap[toolName] || defaultIcon;

  const statusIcon = () => {
    switch (status) {
      case "running":
        return <Loader2 className="h-3 w-3 animate-spin text-amber-400" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
      case "failed":
        return <XCircle className="h-3 w-3 text-red-400" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
        "border-current/10 bg-background-base/40 backdrop-blur-sm",
        "transition-all duration-150",
        status === "running" && "border-amber-500/20 bg-amber-500/5",
        status === "completed" && "border-emerald-500/15",
        status === "failed" && "border-red-500/20",
      )}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-current/50" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-foreground/80">
            {toolName}
          </span>
          {statusIcon()}
        </div>
        {description && (
          <p className="mt-0.5 truncate text-[11px] text-current/40">
            {description}
          </p>
        )}
        {duration !== undefined && status !== "running" && (
          <p className="mt-0.5 text-[11px] text-current/30">
            {(duration / 1000).toFixed(1)}s
          </p>
        )}
      </div>
    </div>
  );
}
