import { SectionLabel } from "@/components/atoms/SectionLabel";
import { getImage } from "@/assets/images";
import { Icon } from "@/components/atoms/Icon/Icon";

const STAR_COUNT = 15;

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-10 px-6 pb-0 pt-16 lg:px-0 lg:pt-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <SectionLabel>Atendimento Inteligente</SectionLabel>
        <div className="flex flex-col items-center gap-3">
          <h1
            className="max-w-[560px] text-3xl font-bold leading-tight text-[#070707] md:text-[40px] md:leading-[42px]"
            style={{ letterSpacing: "var(--tracking-heading)" }}
          >
            Trazemos método a um mercado movido por amor.
          </h1>
          <p className="max-w-[514px] font-sans text-base leading-relaxed text-[#727B8E]">
            O mercado pet é movido por amor. Nós trazemos método para
            transformar esse amor em crescimento — com uma plataforma de IA que
            agenda, responde e converte clientes direto no WhatsApp.
          </p>
        </div>
      </div>

      <div className="relative w-full min-w-0 max-w-[1070px] px-2 sm:px-0">
        <div className="relative overflow-hidden rounded-[16px] border border-[#727B8E]/10 bg-[#727B8E]/10 backdrop-blur-sm sm:rounded-[20px] lg:rounded-[30px]">
          <div className="absolute left-[17.6%] right-[17.4%] top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#2E93FF] to-transparent" />
          <div
            className="relative w-full overflow-hidden rounded-[15px] sm:rounded-[19px] lg:rounded-[26px]"
            style={{ aspectRatio: "1070/640" }}
          >
            <img
              src={getImage("hero_dashboard").src}
              alt="Painel do Auzap mostrando conversas no WhatsApp, agendamentos e mensagens em andamento"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative flex w-full max-w-[1440px] items-center justify-center overflow-hidden border-y border-[#727B8E1A] p-3.5">
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-10"
          style={{
            width: 482,
            height: 54,
            background:
              "linear-gradient(90deg, #FAFAFA 0%, rgba(250, 250, 250, 0.24) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-10"
          style={{
            width: 482,
            height: 54,
            background:
              "linear-gradient(270deg, #FAFAFA 0%, rgba(250, 250, 250, 0.24) 100%)",
          }}
        />
        <div className="flex items-center gap-14">
          {Array.from({ length: STAR_COUNT }).map((_, i) => (
            <Icon name="star" key={`star-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
