import { useState } from "react";

import { getImage } from "@/assets/images";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FaqItem } from "@/components/molecules/FaqItem";

interface FaqData {
  question: string;
  answer: string;
}

const faqs: FaqData[] = [
  {
    question: "A Auzap vai substituir minha recepcionista?",
    answer:
      "De forma alguma! A Auzap cuida das respostas imediatas, agendamentos e lembretes automáticos, 24 horas por dia. Isso libera sua recepcionista para focar no que realmente importa: o atendimento presencial, os detalhes dos clientes e o cuidado humano. É como ter uma ajudante digital que trabalha lado a lado com sua equipe.",
  },
  {
    question: "Preciso de alguém de TI para configurar?",
    answer:
      "Não! A configuração é simples e intuitiva. Nossa equipe te acompanha em todo o processo de implementação.",
  },
  {
    question: "Funciona para qualquer tipo de negócio pet?",
    answer:
      "Sim! A Auzap foi desenvolvida para atender petshops, clínicas veterinárias, hotéis pet, creches e qualquer negócio do segmento pet.",
  },
  {
    question: "Posso testar antes de contratar?",
    answer:
      "Claro! Oferecemos um período de teste gratuito para você conhecer todas as funcionalidades da plataforma.",
  },
  {
    question: "A Auzap é um robô?",
    answer:
      "A Auzap utiliza inteligência artificial avançada para automatizar conversas, mas sempre com um toque humano e personalizado para o seu negócio.",
  },
];

export function FaqSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="mx-auto w-full px-6 py-20 lg:px-10">
      <div className="rounded-2xl bg-[#202026] px-6 py-10 md:px-[148px] md:py-[91px]">
        <div className="flex flex-col gap-10">
          <SectionHeader
            titleColor="white"
            label="F.A.Q"
            title="Tem alguma dúvida? Não se preocupe!"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <div className="grid items-start gap-6 md:grid-cols-2">
            <img
              className="h-full w-full rounded-[14px] object-cover"
              src={getImage("dog").src}
              alt="Dog"
              width={1200}
              height={800}
            />
            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isExpandable
                  isExpanded={expandedIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
