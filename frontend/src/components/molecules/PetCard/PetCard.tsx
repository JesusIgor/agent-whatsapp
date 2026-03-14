import { Cat, Dog, Bird, Fish, Rabbit, Edit2, Trash2, Calendar, Weight, Ruler } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Pet } from '@/types'

export interface PetCardProps {
  pet: Pet
  onEdit?: (pet: Pet) => void
  onDelete?: (pet: Pet) => void
  className?: string
}

const speciesIcons: Record<string, React.ElementType> = {
  cachorro: Dog,
  gato: Cat,
  ave: Bird,
  peixe: Fish,
  roedor: Rabbit,
}

const speciesColors: Record<string, string> = {
  cachorro: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  gato: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  ave: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  peixe: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  roedor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
}

export function PetCard({ pet, onEdit, onDelete, className }: PetCardProps) {
  const species = pet.species?.toLowerCase() || 'default'
  const Icon = speciesIcons[species] || Cat
  const colorClass = speciesColors[species] || speciesColors.default

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-[#E5E7EB] bg-white p-4 transition-all hover:shadow-md dark:border-[#40485A] dark:bg-[#1A1B1D]',
        className
      )}
    >
      {}
      {(onEdit || onDelete) && (
        <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(pet)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F6F9] text-[#727B8E] transition-colors hover:bg-[#1E62EC] hover:text-white dark:bg-[#212225] dark:hover:bg-[#1E62EC]"
              aria-label="Editar pet"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(pet)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F6F9] text-[#727B8E] transition-colors hover:bg-red-500 hover:text-white dark:bg-[#212225] dark:hover:bg-red-500"
              aria-label="Excluir pet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {}
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', colorClass)}>
          <Icon className="h-6 w-6" />
        </div>

        {}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#434A57] dark:text-[#f5f9fc] truncate">
            {pet.name}
          </h3>
          <p className="text-sm text-[#727B8E] dark:text-[#8a94a6]">
            {pet.breed || pet.species || 'Espécie não informada'}
          </p>
        </div>
      </div>

      {}
      <div className="mt-3 flex flex-wrap gap-2">
        {pet.age && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6F9] px-2.5 py-1 text-xs text-[#727B8E] dark:bg-[#212225] dark:text-[#8a94a6]">
            <Calendar className="h-3 w-3" />
            {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
          </span>
        )}
        {pet.weight && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6F9] px-2.5 py-1 text-xs text-[#727B8E] dark:bg-[#212225] dark:text-[#8a94a6]">
            <Weight className="h-3 w-3" />
            {pet.weight}kg
          </span>
        )}
        {pet.size && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6F9] px-2.5 py-1 text-xs text-[#727B8E] dark:bg-[#212225] dark:text-[#8a94a6]">
            <Ruler className="h-3 w-3" />
            {pet.size}
          </span>
        )}
        {pet.color && (
          <span className="inline-flex items-center rounded-full bg-[#F4F6F9] px-2.5 py-1 text-xs text-[#727B8E] dark:bg-[#212225] dark:text-[#8a94a6]">
            {pet.color}
          </span>
        )}
      </div>

      {}
      {pet.vaccination_date && (
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">
            <span className="font-medium">Vacinação:</span> {formatDate(pet.vaccination_date)}
          </p>
        </div>
      )}
    </div>
  )
}
