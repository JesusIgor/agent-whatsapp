export interface BlogCardProps {
  author: string
  date: string
  title: string
  excerpt: string
  tag: string
}

export function BlogCard({ author, date, title, excerpt, tag }: BlogCardProps) {
  return (
    <div className="relative isolate flex w-[293px] shrink-0 flex-col items-center gap-3 rounded-xl border border-[rgba(114,123,142,0.1)] bg-white p-3.5">
      <div className="h-[137px] self-stretch rounded-t-xl rounded-b-none bg-[#D9D9D9]" />

      <div className="absolute left-5 top-[23px] z-[2] flex items-center justify-center rounded-xl border border-[rgba(114,123,142,0.1)] bg-white px-2.5 py-[3px]">
        <span className="font-manrope text-[10px] font-extrabold tracking-[3px] text-[#727B8E]">
          {tag}
        </span>
      </div>

      <div className="z-[1] flex w-full self-stretch flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-xs font-normal leading-[18px] text-[#8E90A1]">{author}</span>
          <span className="inline-block h-[2px] w-[2px] shrink-0 rounded-full bg-[#8E90A1]" />
          <span className="text-xs font-normal leading-[18px] text-[#8E90A1]">{date}</span>
        </div>

        <p className="h-[21px] overflow-hidden text-base font-bold text-[#202026]">
          {title}
        </p>

        <p className="h-[60px] overflow-hidden text-sm font-normal leading-5 text-[#727B8E]">
          {excerpt}
        </p>
      </div>
    </div>
  )
}
