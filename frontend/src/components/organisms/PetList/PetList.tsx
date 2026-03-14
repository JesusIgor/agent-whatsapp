import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { PetCard } from '@/components/molecules/PetCard'
import { PetFormModal } from '@/components/molecules/PetFormModal'
import { EmptyState } from '@/components/molecules/EmptyState'
import { Modal } from '@/components/molecules/Modal'
import type { Pet } from '@/types'
import type { PetCreate, PetUpdate } from '@/services/petService'

export interface PetListProps {
  pets: Pet[]
  clientId: string
  petshopId: number
  isLoading?: boolean
  onCreatePet: (data: PetCreate) => Promise<void>
  onUpdatePet: (petId: string, data: PetUpdate) => Promise<void>
  onDeletePet: (petId: string) => Promise<void>
}

export function PetList({
  pets,
  clientId,
  petshopId,
  isLoading = false,
  onCreatePet,
  onUpdatePet,
  onDeletePet,
}: PetListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet)
    setIsFormOpen(true)
  }

  const handleDelete = (pet: Pet) => {
    setDeletingPet(pet)
  }

  const handleSubmit = async (data: PetCreate | PetUpdate) => {
    if (editingPet) {
      await onUpdatePet(editingPet.id, data as PetUpdate)
    } else {
      await onCreatePet(data as PetCreate)
    }
    setEditingPet(null)
  }

  const confirmDelete = async () => {
    if (!deletingPet) return
    setIsDeleting(true)
    try {
      await onDeletePet(deletingPet.id)
      setDeletingPet(null)
    } catch (error) {
      console.error('Erro ao excluir pet:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPet(null)
  }

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-[#F4F6F9] dark:bg-[#212225]"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">
          Pets ({pets.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFormOpen(true)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Adicionar Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          image="pets_not_found"
          title="Nenhum pet cadastrado"
          description="Adicione o primeiro pet deste cliente"
          buttonText="Cadastrar Pet"
          onButtonClick={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {}
      <PetFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        pet={editingPet}
        clientId={clientId}
        petshopId={petshopId}
      />

      {}
      <Modal
        isOpen={!!deletingPet}
        onClose={() => setDeletingPet(null)}
        title="Excluir Pet"
        onSubmit={confirmDelete}
        submitText="Excluir"
        isLoading={isDeleting}
        className="sm:max-w-md"
      >
        <p className="text-[#727B8E] dark:text-[#8a94a6]">
          Tem certeza que deseja excluir <strong className="text-[#434A57] dark:text-[#f5f9fc]">{deletingPet?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
