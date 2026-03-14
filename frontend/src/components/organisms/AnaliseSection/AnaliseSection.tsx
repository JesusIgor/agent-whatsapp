import type { CSSProperties } from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Icon } from "@/components/atoms/Icon";
import { getImage } from "@/assets/images";

function StatCard() {
  return (
    <div className="flex relative min-h-40 items-center gap-4 rounded-xl border border-[#1E62EC]/30 bg-[#272A3A] p-6 px-8">
      <Icon
        name="footprint_left"
        className="absolute left-0 bottom-0"
        width={68.006}
        height={90.727}
      />

      <div className="m-auto z-10">
        <p className="text-3xl font-bold text-[#FFFFFF]">{"+200%"}</p>
        <p className="text-sm text-[#A0A5B3]">Potencial de aumento ROI</p>
      </div>

      <Icon
        name="footprint_right"
        className="absolute right-0 top-0"
        width={83.131}
        height={89.782}
      />
    </div>
  );
}

export function AnaliseSection() {
  return (
    <section className="mx-auto w-full px-6 py-20 lg:px-10">
      <div className="rounded-2xl bg-[#202026] px-6 py-10 md:px-[125px] md:py-[91px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard />
            <StatCard />
            <StatCard />
            <StatCard />
          </div>

          <div className="flex max-w-[400px] flex-col">
            <SectionHeader
              titleColor="white"
              title="Visão geral"
              label="Analise e Resultados"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
            <div
              className="mt-3 flex items-center overflow-hidden rounded-lg"
              style={{
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
                maskImage:
                  "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            >
              <div
                className="animate-marquee flex shrink-0 items-center gap-1 py-2 pointer-events-none"
                style={{ "--marquee-duration": "25s" } as CSSProperties}
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <img
                    width={120}
                    height={40}
                    alt="Logotipo Auzap"
                    key={`analise-logo-${i}`}
                    src={getImage("logo_dark").src}
                    className="shrink-0 pointer-events-none"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
