import { Link } from "react-router-dom";
import { MessageSquare, LayoutGrid, MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

interface ConversationsPipelineHeaderProps {
  title: "Conversas" | "Pipeline";
  activeTab: "chat" | "pipeline";
}

export function ConversationsPipelineHeader({
  title,
  activeTab,
}: ConversationsPipelineHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#727B8E]/10 bg-[#F7F8FC] dark:border-[#40485A] dark:bg-[#212225] px-4 py-3 sm:px-6 sm:py-4">
      <h1 className="text-xl font-bold text-[#434A57] dark:text-[#f5f9fc]">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <Link
          to="/chat"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "chat"
              ? "bg-[#0e1629] text-white dark:bg-[#2172e5]"
              : "text-[#727B8E] hover:bg-[#E8EAED] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]",
          )}
        >
          <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
          Chat
        </Link>
        <Link
          to="/pipeline"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "pipeline"
              ? "bg-[#0e1629] text-white dark:bg-[#2172e5]"
              : "text-[#727B8E] hover:bg-[#E8EAED] hover:text-[#434A57] dark:text-[#8a94a6] dark:hover:bg-[#212225] dark:hover:text-[#f5f9fc]",
          )}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          Pipeline
        </Link>
      </div>
    </div>
  );
}
