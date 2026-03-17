import { cn } from "@/lib/cn";

type AppointmentStatus = "concluido" | "confirmado" | "pendente" | "cancelado";

export interface WeekAppointment {
  id: string;
  initials: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface WeekDay {
  label: string;
  date: number;
  fullDate: string;
  isToday?: boolean;
}

interface CalendarWeekViewProps {
  weekDays: WeekDay[];
  appointments: WeekAppointment[];
  onDayClick?: (date: number) => void;
  selectedDay?: number | null;
}

const STATUS_DOT: Record<AppointmentStatus, string> = {
  concluido: "bg-[#3CD057]",
  confirmado: "bg-[#3C6BD0]",
  pendente: "bg-[#D0B33C]",
  cancelado: "bg-[#EF4444]",
};

const STATUS_BG: Record<AppointmentStatus, string> = {
  concluido:
    "bg-[#EAFBEB] border-l-[#3CD057] dark:bg-[#1e3d22] dark:border-l-[#3CD057]",
  confirmado:
    "bg-[#EBF1FB] border-l-[#3C6BD0] dark:bg-[#1e2d4a] dark:border-l-[#3C6BD0]",
  pendente:
    "bg-[#FBFBEB] border-l-[#D0B33C] dark:bg-[#3d381e] dark:border-l-[#D0B33C]",
  cancelado:
    "bg-[#FEF2F2] border-l-[#EF4444] dark:bg-[#3d1e1e] dark:border-l-[#EF4444]",
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function CalendarWeekView({
  weekDays,
  appointments,
  onDayClick,
  selectedDay,
}: CalendarWeekViewProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        <div className="border-b border-r border-[rgba(114,123,142,0.1)] bg-[#FAFBFC] dark:border-[#40485A] dark:bg-[#212225]" />

        {weekDays.map((day) => (
          <button
            key={day.date}
            onClick={() => onDayClick?.(day.date)}
            className={cn(
              "flex flex-col items-center gap-0.5 border-b border-r border-[rgba(114,123,142,0.1)] py-2.5 transition-colors dark:border-[#40485A]",
              selectedDay === day.date
                ? "bg-[#F0F4FF] hover:bg-[#E8EFFF] dark:bg-[#2172e5]/20 dark:hover:bg-[#2172e5]/25"
                : "bg-white hover:bg-[#F0F4FF] dark:bg-[#1A1B1D] dark:hover:bg-[#212225]",
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#727B8E] dark:text-[#8a94a6]">
              {day.label}
            </span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                day.isToday
                  ? "bg-[#1B5FE9] text-white dark:bg-[#2172e5]"
                  : selectedDay === day.date
                    ? "text-[#1B5FE9] dark:text-[#6ba3f7]"
                    : "text-[#434A57] dark:text-[#f5f9fc]",
              )}
            >
              {String(day.date).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {HOURS.map((hour) => {
          const hourStr = formatHour(hour);

          return (
            <div
              key={hour}
              className="grid min-h-[64px] grid-cols-[80px_repeat(7,1fr)]"
            >
              <div className="flex items-start justify-end border-b border-r border-[rgba(114,123,142,0.1)] bg-[#FAFBFC] px-3 pt-2 dark:border-[#40485A] dark:bg-[#212225]">
                <span className="text-[11px] font-medium text-[#727B8E] dark:text-[#8a94a6]">
                  {hourStr}
                </span>
              </div>

              {weekDays.map((day) => {
                const cellAppointments = appointments.filter(
                  (a) => a.date === day.fullDate && a.time === hourStr,
                );

                return (
                  <div
                    key={day.date}
                    className={cn(
                      "flex flex-col gap-1 border-b border-r border-[rgba(114,123,142,0.1)] p-1 dark:border-[#40485A]",
                      selectedDay === day.date
                        ? "bg-[rgba(27,95,233,0.02)] dark:bg-[#2172e5]/10"
                        : "bg-white dark:bg-[#1A1B1D]",
                    )}
                  >
                    {cellAppointments.map((appt) => (
                      <div
                        key={appt.id}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg border-l-2 px-2 py-1.5",
                          STATUS_BG[appt.status],
                        )}
                      >
                        <div
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            STATUS_DOT[appt.status],
                          )}
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate text-[11px] font-medium text-[#434A57] dark:text-[#f5f9fc]">
                            {appt.name}
                          </span>
                          <span className="truncate text-[10px] text-[#727B8E] dark:text-[#8a94a6]">
                            {appt.service}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
