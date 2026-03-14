export function ActionDivider() {
  return (
    <div className="relative h-6 w-[1.5px] mx-1">
      <div
        className="absolute inset-0 bg-linear-to-t from-transparent via-primary/70 to-transparent rounded-full"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
        }}
      />
    </div>
  )
}
