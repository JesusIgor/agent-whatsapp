import { cn } from "@/lib/cn";

export interface CalendarEvent {
  id: string;
  petName: string;
  petInitials: string;
  type: string;
  time: string;
  date: string;
  status: "concluido" | "confirmado" | "pendente" | "cancelado";
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  };

  const days = getMonthDays();
  const weeks: { date: Date; isCurrentMonth: boolean }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const formatDateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const isSelected = (d: Date) =>
    selectedDate && formatDateKey(d) === formatDateKey(selectedDate);

  const isToday = (d: Date) => formatDateKey(d) === formatDateKey(new Date());

  const getEventsForDate = (d: Date) =>
    events.filter((e) => e.date === formatDateKey(d));

  const statusColor: Record<string, string> = {
    concluido: "text-[#3DCA21]",
    confirmado: "text-[#1E62EC]",
    pendente: "text-[#F59E0B]",
    cancelado: "text-[#EF4444]",
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="grid grid-cols-7 border-b border-[#727B8E]/10 dark:border-[#40485A]">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-[#727B8E] dark:text-[#8a94a6]"
          >
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div
          key={wi}
          className="grid grid-cols-7 border-b border-[#727B8E]/10 last:border-b-0"
        >
          {week.map((day, di) => {
            const dayEvents = getEventsForDate(day.date);
            const selected = isSelected(day.date);
            return (
              <button
                key={di}
                onClick={() => onSelectDate(day.date)}
                className={cn(
                  "min-h-[100px] p-2 text-left border-r border-[#727B8E]/10 dark:border-[#40485A] last:border-r-0 transition-colors duration-200 hover:bg-[#1E62EC]/5 dark:hover:bg-[#2172e5]/20",
                  selected && "bg-[#1E62EC]/10 dark:bg-[#2172e5]/20",
                  !day.isCurrentMonth && "bg-[#F4F6F9]/50 dark:bg-[#212225]/50",
                )}
              >
                <span
                  key={selected ? formatDateKey(day.date) : undefined}
                  className={cn(
                    "inline-block text-sm font-medium",
                    selected && "animate-calendar-day-select",
                    !day.isCurrentMonth
                      ? "text-[#727B8E]/50 dark:text-[#8a94a6]/50"
                      : isToday(day.date)
                        ? "text-[#1E62EC] dark:text-[#2172e5] font-bold"
                        : "text-[#434A57] dark:text-[#f5f9fc]",
                  )}
                >
                  {day.date.getDate() < 10
                    ? `0${day.date.getDate()}`
                    : day.date.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-xs font-medium truncate ${statusColor[ev.status]}`}
                    >
                      {ev.time} - {ev.petName}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
