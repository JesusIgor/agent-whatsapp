import { LandingHeader } from "@/components/organisms/LandingHeader";
import { HeroSection } from "@/components/organisms/HeroSection";
import { ProblemaSection } from "@/components/organisms/ProblemaSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { PorqueSection } from "@/components/organisms/PorqueSection";
import { ChegouSection } from "@/components/organisms/ChegouSection";
import { JornadaSection } from "@/components/organisms/JornadaSection";
import { FeedbacksSection } from "@/components/organisms/FeedbacksSection";
import { AnaliseSection } from "@/components/organisms/AnaliseSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { CtaCard } from "@/components/molecules/CtaCard";
import { PlanosSection } from "@/components/organisms/PlanosSection";
import { BlogSection } from "@/components/organisms/BlogSection";
import { Footer } from "@/components/organisms/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <LandingHeader />
      <main className="animate-fade-in flex flex-col items-center">
        <HeroSection />
        <ProblemaSection />
        <FeaturesSection />
        <PorqueSection />
        <ChegouSection />
        <AnaliseSection />
        <JornadaSection />
        <FeedbacksSection />
        <FaqSection />
        <CtaCard className="mx-auto w-full max-w-[720px] px-4" />
        <PlanosSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
