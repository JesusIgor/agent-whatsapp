import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthContext } from "@/contexts/AuthContext";

const SUPPORT_WHATSAPP_PREFILL_MESSAGE =
  "Olá! Preciso de ajuda com o produto Auzap.";
import { petshopService } from "@/services";

interface SupportChatButtonProps {
  className?: string;
}

function useSupportPhone() {
  const { user } = useAuthContext();
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user?.petshop_id) return;
    petshopService
      .getPetshop(user.petshop_id)
      .then((p) => setPhone(p.company?.pangeiaSupport ?? ""))
      .catch(() => {});
  }, [user?.petshop_id]);

  return phone;
}

export function SupportChatButton({ className }: SupportChatButtonProps) {
  const { pathname } = useLocation();
  const phone = useSupportPhone();

  if (pathname === "/chat") return null;
  if (!phone) return null;

  const handleClick = () => {
    const text = encodeURIComponent(SUPPORT_WHATSAPP_PREFILL_MESSAGE);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
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
      title="Falar com o suporte Auzap no WhatsApp"
    >
      <Headphones className="h-6 w-6" />
    </motion.button>
  );
}
