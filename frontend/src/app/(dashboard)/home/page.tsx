import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { DashboardChatInput } from "@/components/molecules/DashboardChatInput";
import { SpeechVisualization } from "@/components/molecules/SpeechVisualization";
import { StatCards } from "@/components/molecules/StatCards";
import { RevenueChart } from "@/components/molecules/RevenueChart";
import { CategoriesChart } from "@/components/molecules/CategoriesChart";
import { VisitsChart } from "@/components/molecules/VisitsChart";
import { SalesChart } from "@/components/molecules/SalesChart";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Markdown } from "@/components/atoms/Markdown";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { getImage } from "@/assets/images";
import { chatBusinessService, dashboardService } from "@/services";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/cn";
import type {
  ChatBusinessContext,
  ChatBusinessHistoryMessage,
  DashboardStats,
} from "@/types";

interface DashboardMessage {
  id: string;
  variant: "sent" | "received";
  message: string;
  time: string;
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RatingStars({
  count = 5,
  filled = 0,
}: {
  count?: number;
  filled?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < filled ? "fill-[#FFB800] text-[#FFB800]" : "text-[#727B8E] dark:text-[#8a94a6]"}`}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

function DashboardChatBubble({
  message,
  variant,
}: {
  message: DashboardMessage;
  variant: "sent" | "received";
}) {
  const isSent = variant === "sent";

  return (
    <div
      className={`flex min-w-0 items-end gap-2 sm:gap-4 ${isSent ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isSent && (
        <img
          src={getImage("logo_main").src}
          alt="AuZap.IA logo"
          width={55}
          height={60}
          className="hidden shrink-0 sm:block"
        />
      )}
      <div className="flex flex-col gap-3">
        <div
          className={`px-6 py-3.5 text-sm leading-6 ${isSent
              ? "rounded-[23px_0px_23px_23px] bg-[#0F172A] text-white"
              : "rounded-[0px_23px_23px_23px] border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] text-[#434A57] dark:text-[#f5f9fc]"
            }`}
          style={{ maxWidth: "min(100%, 586px)" }}
        >
          <Markdown
            className={cn(
              isSent
                ? "prose-invert [&_*]:text-white [&_code]:bg-white/10 [&_pre]:bg-white/10"
                : "[&_*]:text-[#434A57] dark:[&_*]:text-[#f5f9fc] [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-800",
            )}
          >
            {message.message}
          </Markdown>
        </div>
        <RatingStars count={isSent ? 3 : 6} />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex min-w-0 items-end gap-2 sm:gap-4 flex-row">
      <img
        src={getImage("logo_main").src}
        alt="AuZap.IA"
        width={55}
        height={60}
        className="hidden shrink-0 sm:block"
      />
      <div
        className="rounded-[0px_23px_23px_23px] border border-[#727B8E1A] bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] px-5 py-4"
        style={{ maxWidth: "min(100%, 586px)" }}
      >
        <div className="flex items-center gap-1.5" aria-label="IA digitando">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-[#727B8E] dark:bg-[#8a94a6]"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<DashboardMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatBusinessHistoryMessage[]>(
    [],
  );
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [showChat, setShowChat] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name?.split(" ")[0] || "usuário";

  const [revenueChartData, setRevenueChartData] = useState<Array<{
    date: string;
    revenue: number;
    appointments: number;
  }> | null>(null);
  const [categoriesChartData, setCategoriesChartData] = useState<Array<{
    category: string;
    value: number;
    percentage: number;
  }> | null>(null);
  const [visitsChartData, setVisitsChartData] = useState<Array<{
    date: string;
    visits: number;
    new_clients: number;
    returning_clients: number;
  }> | null>(null);
  const [salesChartData, setSalesChartData] = useState<Array<{
    service: string;
    sales: number;
    revenue: number;
  }> | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [stats, revenueChart, categoriesChart, visitsChart, salesChart] =
          await Promise.allSettled([
            dashboardService.getStats(),
            dashboardService.getRevenueChart({
              period: "month",
              group_by: "day",
            }),
            dashboardService.getCategoriesChart(),
            dashboardService.getVisitsChart({
              period: "month",
              group_by: "day",
            }),
            dashboardService.getSalesChart(),
          ]);
        if (stats.status === "fulfilled") setDashboardStats(stats.value);
        if (revenueChart.status === "fulfilled")
          setRevenueChartData(revenueChart.value);
        if (categoriesChart.status === "fulfilled")
          setCategoriesChartData(categoriesChart.value);
        if (visitsChart.status === "fulfilled")
          setVisitsChartData(visitsChart.value);
        if (salesChart.status === "fulfilled")
          setSalesChartData(salesChart.value);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      setTimeout(() => {
        const el = chatContainerRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  const buildContext = useCallback((): ChatBusinessContext => {
    return {
      dashboard_stats: {
        appointments_today: dashboardStats?.appointments_today ?? 0,
        appointments_week: dashboardStats?.appointments_week ?? 0,
        active_clients: dashboardStats?.total_clients ?? 0,
        messages_today: 0,
        conversion_rate: dashboardStats?.conversion_rate ?? 0,
      },
      payment_stats: {},
    };
  }, [dashboardStats]);

  const handleSendMessage = async (text: string) => {
    if (!showChat) setShowChat(true);

    const userMessage: DashboardMessage = {
      id: Date.now().toString(),
      variant: "sent",
      message: text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaiting(true);

    const newHistoryEntry: ChatBusinessHistoryMessage = {
      role: "user",
      content: text,
    };
    const updatedHistory = [...chatHistory, newHistoryEntry];
    setChatHistory(updatedHistory);

    try {
      const context = buildContext();
      const response = await chatBusinessService.sendMessage(
        text,
        context,
        updatedHistory,
      );

      const aiResponse: DashboardMessage = {
        id: (Date.now() + 1).toString(),
        variant: "received",
        message: response.response,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: DashboardMessage = {
        id: (Date.now() + 1).toString(),
        variant: "received",
        message:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <DashboardLayout contentClassName="mx-0!">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "mx-auto flex w-full flex-col items-center px-4 lg:px-6 xl:px-10",
          !showChat
            ? "min-h-[calc(100vh-75px)] relative"
            : "mt-4 pb-16 sm:mt-6 sm:pb-24 lg:mt-[54px] lg:pb-32",
        )}
      >
        <div className="my-auto">
          {!showChat && (
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="mb-5">
                <SpeechVisualization size={120} idlePulse className="gap-0" />
              </div>

              <h1 className="mb-1 text-2xl font-medium text-[#434A57] dark:text-[#f5f9fc]">
                Bom te ver novamente, {firstName}!
              </h1>
              <p className="mb-10 text-sm text-[#727B8E] dark:text-[#8a94a6]">
                Auzap seu melhor amigo - Pergunte qualquer coisa sobre o comercial
                do seu negócio
              </p>
            </div>
          )}

          {showChat && (
            <div
              ref={chatContainerRef}
              className="mb-8 flex w-full max-w-[775px] flex-col gap-7 overflow-y-auto h-[min(50vh,450px)] sm:h-[450px] scrollbar-hide"
            >
              {messages.map((msg) => (
                <DashboardChatBubble
                  key={msg.id}
                  message={msg}
                  variant={msg.variant}
                />
              ))}
              {isWaiting && <TypingIndicator />}
            </div>
          )}

          <div ref={inputRef} className="w-full">
            <DashboardChatInput
              onSend={handleSendMessage}
              showQuickActions={!showChat || messages.length < 2}
              disabled={isWaiting}
            />
          </div>
        </div>

        {!showChat && (
          <div className="mt-auto py-8 flex justify-center w-full">
            <ScrollIndicator />
          </div>
        )}
      </motion.div>

      <div className="w-full rounded-[24px_24px_0_0] bg-white dark:bg-[#272A34] sm:rounded-[40px_40px_0_0] pt-8 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 xl:px-10"
        >
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-white mb-2">
              Métricas e Dashboards
            </h2>
            <p className="text-sm sm:text-base text-[#727B8E] dark:text-[#8a94a6]">
              Acompanhe as principais métricas do seu negócio em tempo real e
              tome decisões informadas para impulsionar seu crescimento.
            </p>
          </div>
          <StatCards dashboardStats={dashboardStats} />
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart className="h-full" data={revenueChartData} />
            </div>
            <CategoriesChart className="h-full" data={categoriesChartData} />
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VisitsChart className="h-full" data={visitsChartData} />
            </div>
            <SalesChart className="h-full" data={salesChartData} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
