import { getImage } from "@/assets/images";

interface FounderCardProps {
  name: string;
  role: string;
  imageSrc?: string;
}

export function FounderCard({ name, role, imageSrc }: FounderCardProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#727B8E]/10 bg-[#202026]">
      <div className="relative h-[220px] w-full overflow-hidden">
        <img
          src={imageSrc ?? getImage("fallback").src}
          alt={`Foto de ${name}`}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>

      <div className="flex flex-col gap-1 px-5 py-4">
        <span className="text-base font-medium text-white">{name}</span>
        <span className="text-sm font-light text-[#727B8E]">{role}</span>
      </div>
    </div>
  );
}
