import { cn } from '@/lib/cn'

interface ServiceCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ServiceCheckbox({ label, checked, onChange }: ServiceCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-[4px] border px-4 py-3 transition-colors text-left',
        checked
          ? 'border-[#1E62EC]/30 bg-[#1E62EC]/5'
          : 'border-[#727B8E]/10 bg-[#FAFAFA]'
      )}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="shrink-0">
        <circle cx="2" cy="2" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
        <circle cx="8" cy="2" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
        <circle cx="2" cy="8" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
        <circle cx="8" cy="8" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
        <circle cx="2" cy="14" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
        <circle cx="8" cy="14" r="1.5" fill={checked ? '#1E62EC' : '#727B8E'} fillOpacity={checked ? 0.6 : 0.3} />
      </svg>

      <span className={cn(
        'flex-1 font-be-vietnam-pro text-sm',
        checked ? 'text-[#1E62EC]' : 'text-[#434A57]'
      )}>
        {label}
      </span>

      <div className={cn(
        'h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
        checked ? 'border-[#1E62EC]' : 'border-[#727B8E]/20'
      )}>
        {checked && (
          <div className="h-[10px] w-[10px] rounded-full bg-[#1E62EC]" />
        )}
      </div>
    </button>
  )
}
