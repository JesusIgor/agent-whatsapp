interface ProblemaCardProps {
  title: string;
  description: string;
  imageSrc?: string;
}

export function ProblemaCard({
  title,
  description,
  imageSrc,
}: ProblemaCardProps) {
  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-[#727B8E]/10 p-5 bg-[#FFFFFF]">
      <div className="relative aspect-[4/3] rounded-tr-xl rounded-tl-xl w-full overflow-hidden bg-[#D9D9D9]">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3
          className="text-lg font-bold text-[#070707]"
          style={{ letterSpacing: "-0.5px" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[#727B8E]">{description}</p>
      </div>
    </div>
  );
}
