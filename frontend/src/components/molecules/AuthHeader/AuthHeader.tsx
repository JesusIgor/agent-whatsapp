import { getImage } from "@/assets/images";

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src={getImage("logo_main").src}
        alt="AuZap.IA logo"
        width={55}
        height={60}
      />
      <h1 className="mt-4 text-center font-be-vietnam-pro text-2xl font-semibold leading-[38px] text-[#3F4655] dark:text-[#f5f9fc]">
        {title}
      </h1>
      <p className="text-center font-be-vietnam-pro text-sm leading-6 text-[#727B8E] dark:text-[#8a94a6]">
        {subtitle}
      </p>
    </div>
  );
}
