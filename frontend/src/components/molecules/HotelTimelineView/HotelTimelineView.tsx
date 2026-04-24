import type { LodgingReservation } from "@/services/lodgingService";
import { cn } from "@/lib/cn";

interface HotelTimelineViewProps {
  /** Data usada pra definir o mês visível (ano + mês). Reusa o `currentDate` da agenda comum. */
  currentDate: Date;
  reservations: LodgingReservation[];
  onReservationClick?: (r: LodgingReservation) => void;
}

/** Helpers locais de data — todos trabalham em YYYY-MM-DD para evitar fuso. */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toDate(s: string): Date {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date(NaN);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / msPerDay);
}

const WEEKDAY_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"]; // Dom, Seg, Ter...

/** Paleta fixa para colorir os blocos — rotaciona por index. */
const PALETTE = [
  { bg: "bg-emerald-500/90", text: "text-white" },
  { bg: "bg-sky-500/90", text: "text-white" },
  { bg: "bg-amber-500/90", text: "text-white" },
  { bg: "bg-rose-500/90", text: "text-white" },
  { bg: "bg-violet-500/90", text: "text-white" },
  { bg: "bg-teal-500/90", text: "text-white" },
  { bg: "bg-fuchsia-500/90", text: "text-white" },
  { bg: "bg-orange-500/90", text: "text-white" },
  { bg: "bg-lime-600/90", text: "text-white" },
  { bg: "bg-pink-500/90", text: "text-white" },
  { bg: "bg-indigo-500/90", text: "text-white" },
  { bg: "bg-cyan-500/90", text: "text-white" },
] as const;

/** Hash estável: usa o id da reserva pra cair sempre na mesma cor. */
function colorForId(id: string): (typeof PALETTE)[number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length]!;
}

interface PositionedReservation {
  res: LodgingReservation;
  startCol: number;      // 1-based, relativo ao primeiro dia do mês
  endCol: number;        // exclusivo (checkout = primeiro dia sem o pet)
  lane: number;          // linha empilhada quando há sobreposição
  clippedLeft: boolean;  // true se o check-in é antes do mês visível
  clippedRight: boolean; // true se o check-out é depois do mês visível
}

export function HotelTimelineView({
  currentDate,
  reservations,
  onReservationClick,
}: HotelTimelineViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  const days: Date[] = [];
  for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));

  // ─── 1. Filtra reservas ativas que tocam o mês visível ──────────────
  // Status ativos: confirmed, needs_reschedule, checked_in. Ignora cancelled, checked_out, etc.
  // "toca o mês" = último dia real do período >= primeiro dia do mês E check-in <= último dia.
  //
  // Atenção ao tipo:
  //   - Hotel: checkout_date é o próprio último dia visual → usar cout.
  //   - Creche: backend grava checkout_date como "dia seguinte ao último" → último dia real = cout - 1.
  const ACTIVE_STATUSES = new Set(["confirmed", "needs_reschedule", "checked_in"]);
  const relevant = reservations.filter((r) => {
    if (!ACTIVE_STATUSES.has(r.status)) return false;
    const cin = toDate(r.checkin_date);
    const cout = toDate(r.checkout_date);
    const lastRealDay =
      r.type === "daycare"
        ? new Date(cout.getFullYear(), cout.getMonth(), cout.getDate() - 1)
        : cout;
    return lastRealDay >= firstDay && cin <= lastDay;
  });

  // ─── 2. Ordena por data de check-in pra alimentar o lane assignment ──
  const sorted = [...relevant].sort((a, b) =>
    daysBetween(toDate(a.checkin_date), toDate(b.checkin_date)),
  );

  // ─── 3. Lane assignment (greedy): caçar a primeira lane que já encerrou antes do novo check-in ──
  const laneEndDays: number[] = []; // índice = lane, valor = último dia ocupado (exclusivo)
  const positioned: PositionedReservation[] = sorted.map((r) => {
    const cin = toDate(r.checkin_date);
    const cout = toDate(r.checkout_date);
    const startDay = daysBetween(firstDay, cin); // 0-based dentro do mês (pode ser negativo)
    // Fim da barra (exclusivo) depende do tipo:
    //   - Hotel: checkout_date é o dia real de saída → +1 pra cobrir esse dia visualmente.
    //   - Creche: backend já armazena como "dia seguinte ao último" → não somar nada.
    const endDay =
      r.type === "daycare"
        ? daysBetween(firstDay, cout)
        : daysBetween(firstDay, cout) + 1;
    const clippedLeft = startDay < 0;
    const clippedRight = endDay > totalDays;
    const startClamped = Math.max(0, startDay);
    const endClamped = Math.min(totalDays, endDay);

    let lane = laneEndDays.findIndex((end) => end <= startClamped);
    if (lane === -1) {
      lane = laneEndDays.length;
      laneEndDays.push(endClamped);
    } else {
      laneEndDays[lane] = endClamped;
    }

    return {
      res: r,
      startCol: startClamped + 1, // CSS grid é 1-based
      endCol: endClamped + 1,
      lane,
      clippedLeft,
      clippedRight,
    };
  });

  const laneCount = Math.max(laneEndDays.length, 1);
  const ROW_H = 44; // altura de cada lane em px
  // Colunas sem largura mínima rígida — deixa o grid distribuir o mês inteiro
  // na largura do container. Caso o container fique muito estreito (mobile),
  // o outer tem overflow-auto e acaba gerando scroll horizontal naturalmente.

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-xl border border-[#727B8E]/10 bg-white p-3 dark:border-[#40485A] dark:bg-[#1A1B1D]">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `80px repeat(${totalDays}, minmax(0, 1fr))`,
        }}
      >
        {/* ── Header: canto superior esquerdo + dias ── */}
        <div className="sticky left-0 z-10 flex items-center justify-start border-b border-[#727B8E]/15 bg-white px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[#727B8E] dark:border-[#40485A] dark:bg-[#1A1B1D] dark:text-[#8a94a6]">
          Pet
        </div>
        {days.map((d) => {
          const isToday = ymd(d) === ymd(new Date());
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "flex flex-col items-center justify-center border-b border-l border-[#727B8E]/10 py-1.5 text-[11px] font-medium dark:border-[#40485A]",
                isWeekend
                  ? "bg-[#F4F6F9]/60 dark:bg-[#212225]/50"
                  : "bg-white dark:bg-[#1A1B1D]",
                isToday && "bg-[#1E62EC]/10 dark:bg-[#2172e5]/20",
              )}
            >
              <span
                className={cn(
                  "text-[9px] uppercase tracking-wider",
                  isToday
                    ? "font-bold text-[#1E62EC] dark:text-[#5b9aff]"
                    : "text-[#727B8E] dark:text-[#8a94a6]",
                )}
              >
                {WEEKDAY_SHORT[d.getDay()]}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[13px]",
                  isToday
                    ? "font-bold text-[#1E62EC] dark:text-[#5b9aff]"
                    : "text-[#434A57] dark:text-[#f5f9fc]",
                )}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}

        {/* ── Background: linhas vazias pra desenhar gridlines ── */}
        {Array.from({ length: laneCount }).map((_, laneIdx) => (
          <div
            key={`lane-label-${laneIdx}`}
            className="sticky left-0 z-10 border-b border-[#727B8E]/5 bg-white px-2 py-1 text-[11px] text-[#727B8E] dark:border-[#40485A] dark:bg-[#1A1B1D] dark:text-[#8a94a6]"
            style={{ gridRow: laneIdx + 2, height: ROW_H }}
          >
            {/* label intencionalmente vazio — pode virar número da lane se quiser */}
          </div>
        ))}

        {Array.from({ length: laneCount }).flatMap((_, laneIdx) =>
          days.map((d, colIdx) => {
            const isToday = ymd(d) === ymd(new Date());
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <div
                key={`cell-${laneIdx}-${colIdx}`}
                className={cn(
                  "border-b border-l border-[#727B8E]/5 dark:border-[#40485A]/60",
                  isWeekend && "bg-[#F4F6F9]/40 dark:bg-[#212225]/30",
                  isToday && "bg-[#1E62EC]/5 dark:bg-[#2172e5]/10",
                )}
                style={{
                  gridRow: laneIdx + 2,
                  gridColumn: colIdx + 2, // +1 pela coluna Pet, +1 pelo 1-based
                  height: ROW_H,
                }}
              />
            );
          }),
        )}

        {/* ── Barras das reservas ── */}
        {positioned.map((p) => {
          const color = colorForId(p.res.id);
          const label = `${p.res.pet_name ?? "Pet"}${p.res.pet_breed ? ` · ${p.res.pet_breed}` : ""}`;
          const tooltip = [
            p.res.pet_name ?? "Pet",
            p.res.client_name ? `Tutor: ${p.res.client_name}` : null,
            `${p.res.checkin_date.slice(0, 10)} → ${p.res.checkout_date.slice(0, 10)}`,
            p.res.type === "daycare" ? "Creche" : "Hotel",
          ]
            .filter(Boolean)
            .join("\n");

          return (
            <button
              key={p.res.id}
              type="button"
              onClick={() => onReservationClick?.(p.res)}
              title={tooltip}
              className={cn(
                "m-1 flex items-center gap-2 overflow-hidden rounded-md px-2 text-left text-[11px] font-medium shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md",
                color.bg,
                color.text,
                p.clippedLeft && "rounded-l-none",
                p.clippedRight && "rounded-r-none",
              )}
              style={{
                gridRow: p.lane + 2,
                gridColumnStart: p.startCol + 1, // +1 pela coluna Pet
                gridColumnEnd: p.endCol + 1,
                height: ROW_H - 8,
              }}
            >
              <span className="truncate">
                <span className="opacity-80">
                  {p.res.type === "daycare" ? "CRECHE" : "HOTEL"}
                </span>{" "}
                — {label}
              </span>
            </button>
          );
        })}
      </div>

      {positioned.length === 0 && (
        <p className="mt-6 py-8 text-center text-sm text-[#727B8E] dark:text-[#8a94a6]">
          Nenhuma reserva neste mês.
        </p>
      )}
    </div>
  );
}
