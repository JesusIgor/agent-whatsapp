import type { CSSProperties } from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { JornadaStep } from "@/components/molecules/JornadaStep";
import { getImage } from "@/assets/images";

const steps = [
  {
    title: "Fale conosco!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Mapeamos seu negócio",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

function FounderBlock() {
  return (
    <div className="rounded-2xl bg-[#202026] px-6 py-10 md:px-[125px] md:py-[91px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex w-[325px] shrink-0 items-start rounded-xl border border-[#727B8E]/10 bg-[#29292D] p-[14px]">
          <div className="flex flex-col items-center gap-[19px]">
            <div className="relative h-[261px] w-[297px] shrink-0 overflow-hidden rounded-xl rounded-bl-none rounded-br-none">
              <img
                src={getImage("cleber_santos").src}
                alt="Foto de Cleber Santos"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col pl-7 w-full">
              <span
                className="text-[20px] font-medium text-[#FAFAFA]"
                style={{ letterSpacing: "-0.78px" }}
              >
                Cleber Santos
              </span>
              <span className="text-[14px] font-normal text-[#727B8E]">
                CEO &amp; Founder Comport
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 max-w-[720px]">
          <SectionHeader
            titleColor="white"
            label="ÁGIL, HUMANO E INTELIGENTE"
            title="Quem está a frente"
            description="A Auzap nasceu a partir da visão de Cléber, CEO da Comport Pet e referência no mercado. Ao perceber que clínicas, hotéis e pet shops perdiam clientes pela demora no atendimento, Cléber uniu sua experiência no setor com a Link School of Business e a Pange.ia para criar uma solução prática, escalável e focada em resultados."
          />

          <div
            className="mt-2 flex items-center overflow-hidden rounded-lg"
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
                  key={`founder-logo-${i}`}
                  src={getImage("logo_dark").src}
                  width={120}
                  height={40}
                  alt="Logotipo Auzap"
                  className="shrink-0 pointer-events-none"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JornadaSection() {
  return (
    <section className="mx-auto w-full px-6 py-20 lg:px-10">
      <SectionHeader
        label="Jornada"
        title={
          <>
            O futuro do seu comércio pet{" "}
            <span className="text-[#1E62EC]">começa aqui</span>
          </>
        }
        description="Conheça a jornada para integrar nossa IA e maximizar suas conversões."
        align="center"
      />

      <div className="mt-16 m-auto max-w-[1200px] flex flex-col gap-16">
        {steps.map((step, i) => (
          <JornadaStep key={`step-${i}`} {...step} />
        ))}
      </div>

      <div className="mt-16">
        <FounderBlock />
      </div>
    </section>
  );
}
