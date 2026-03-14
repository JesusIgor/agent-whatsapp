import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/cn";

interface SupportChatButtonProps {
  className?: string;
}

export function SupportChatButton({ className }: SupportChatButtonProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/chat") return null;

  const handleClick = () => {
    navigate("/chat?mode=support");
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#1E62EC] text-white shadow-lg hover:shadow-xl transition-shadow",
        "dark:bg-[#2172e5] dark:hover:opacity-90",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-label="Suporte"
    >
      <Headphones className="h-6 w-6" />
    </motion.button>
  );
}
