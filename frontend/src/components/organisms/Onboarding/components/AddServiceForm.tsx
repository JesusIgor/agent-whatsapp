import { useState } from 'react'

interface AddServiceFormProps {
  namePlaceholder?: string
  pricePlaceholder?: string
  onAdd: (service: { name: string; price: string }) => void
}

export function AddServiceForm({
  namePlaceholder = 'Nome do serviço',
  pricePlaceholder = 'Preço',
  onAdd,
}: AddServiceFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), price: price.trim() })
    setName('')
    setPrice('')
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-be-vietnam-pro text-sm font-semibold text-[#434A57]">
        Adicionar outro serviço
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#727B8E" strokeOpacity="0.3" />
          </svg>
          <input
            type="text"
            placeholder={namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-transparent font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#727B8E" strokeOpacity="0.3" />
          </svg>
          <input
            type="text"
            placeholder={pricePlaceholder}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex-1 bg-transparent font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="self-center rounded-[4px] border border-[#727B8E]/10 bg-white px-6 py-2 font-be-vietnam-pro text-sm font-medium text-[#434A57] transition-colors hover:bg-gray-50"
      >
        Adicionar
      </button>
    </div>
  )
}
