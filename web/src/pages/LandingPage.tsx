import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Code,
  Database,
  Terminal,
  Sparkles,
} from "lucide-react";

const suggestions = [
  {
    icon: Code,
    label: "Open a repository",
    description: "Explore code, review PRs, debug issues",
  },
  {
    icon: Bug,
    label: "Debug an issue",
    description: "Find and fix bugs with AI assistance",
  },
  {
    icon: BookOpen,
    label: "Learn something new",
    description: "Get guided tutorials and explanations",
  },
  {
    icon: Database,
    label: "Analyze data",
    description: "Process, visualize, and derive insights",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Brand / Logo */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-midground/10">
          <Sparkles className="h-5 w-5 text-midground" />
        </div>
      </div>

      {/* Hero heading */}
      <h1 className="mb-4 text-center text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        How can I help you today?
      </h1>

      {/* Decorative prompt bar */}
      <button
        onClick={() => navigate("/chat")}
        className={cn(
          "group flex w-full max-w-xl items-center gap-3 rounded-xl border border-current/15 px-5 py-3.5 text-left",
          "bg-background-base/60 backdrop-blur-sm",
          "transition-all duration-200",
          "hover:border-current/30 hover:bg-background-base/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midground/40",
        )}
      >
        <Terminal className="h-4 w-4 shrink-0 text-current/40 group-hover:text-current/60 transition-colors" />
        <span className="flex-1 text-sm text-current/40 group-hover:text-current/60 transition-colors">
          Ask anything — code, debug, research, or automate...
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-current/30 group-hover:text-current/60 transition-colors" />
      </button>

      {/* Suggested actions */}
      <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate("/chat")}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-current/10 px-4 py-3.5 text-left",
              "bg-background-base/40 backdrop-blur-sm",
              "transition-all duration-150",
              "hover:border-current/20 hover:bg-background-base/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midground/40",
            )}
          >
            <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-current/40 group-hover:text-midground transition-colors" />
            <div>
              <div className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {s.label}
              </div>
              <div className="mt-0.5 text-xs text-current/40 group-hover:text-current/60 transition-colors">
                {s.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-current/25">
        ZENTAR DIGITAL AGENT &mdash; Powered by Nous Research
      </p>
    </div>
  );
}
