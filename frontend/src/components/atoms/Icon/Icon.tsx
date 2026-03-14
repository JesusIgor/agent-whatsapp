import { getIcons, IIcons } from "@/assets/icons";
import { cn } from "@/lib/cn";

interface IconProps {
  name: IIcons;
  width?: number;
  height?: number;
  className?: string;
}

export function Icon({ name, width = 24, height = 24, className }: IconProps) {
  return (
    <img
      width={width}
      height={height}
      src={getIcons(name)}
      className={cn("object-cover", className)}
      alt={`Ícone ${name} representando o mercado pet`}
    />
  );
}
