import { cn } from "@/lib/cn";
import { getImage } from "@/assets/images";
import { Button } from "@/components/atoms/Button";

export interface EmptyStateProps {
  image:
    | "bored"
    | "video_call"
    | "pets_not_found"
    | "not_found_clientes_ativos";
  title?: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  className?: string;
  buttonClassName?: string;
  imageSize?: number;
}

export function EmptyState({
  image,
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
  className,
  buttonClassName,
  imageSize = 200,
}: EmptyStateProps) {
  const imageData = getImage(image);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-4 py-8 animate-fade-in-up",
        className,
      )}
    >
      <img
        src={imageData.src}
        alt=""
        width={imageSize}
        height={imageSize}
        className="h-auto w-full"
        style={{ maxWidth: `${imageSize}px` }}
      />

      <div className="flex flex-col items-center gap-2 text-center">
        {title && (
          <h3 className="text-lg font-semibold text-[#434A57] dark:text-[#f5f9fc]">
            {title}
          </h3>
        )}
        <p className="max-w-[300px] text-sm text-[#727B8E] dark:text-[#8a94a6]">
          {description}
        </p>
      </div>

      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} className={buttonClassName}>
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
}
