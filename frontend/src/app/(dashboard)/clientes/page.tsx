import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MoreVertical,
  MessageCircle,
  Trash2,
  Edit,
  PawPrint,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  maskPhone,
  unmaskDigits,
  maskDate,
  maskTime,
  dateToISO,
  dateFromISO,
} from "@/lib/masks";
import { useAddressByCep } from "@/hooks";
import { useAuthContext } from "@/contexts";
import { clientService, petService } from "@/services";
import type { Client, Pet as PetType } from "@/types";

import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Modal } from "@/components/molecules/Modal";
import { Input } from "@/components/atoms/Input";
import { TextArea } from "@/components/atoms/TextArea";
import { TextAreaField } from "@/components/molecules/TextAreaField";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";

interface Pet {
  id: string;
  customerId: string;
  name: string;
  species: "cachorro" | "gato" | "ave" | "roedor" | "outro";
  breed: string;
  age: string;
  weight: string;
  size: "pequeno" | "medio" | "grande";
  color: string;
  notes: string;
}

interface Appointment {
  id: string;
  customerId: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  service: string;
  status: "confirmado" | "pendente" | "cancelado" | "concluido";
  notes: string;
}

interface ConversationHistory {
  id: string;
  date: string;
  preview: string;
  channel: "whatsapp" | "email" | "telefone";
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ativo" | "inativo";
  address?: string;
  notes?: string;
  totalAppointments: number;
  lastVisit: string;
  pets: Pet[];
  appointments: Appointment[];
  conversations: ConversationHistory[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getSpeciesEmoji(species: Pet["species"]) {
  switch (species) {
    case "cachorro":
      return "🐕";
    case "gato":
      return "🐱";
    case "ave":
      return "🐦";
    case "roedor":
      return "🐹";
    default:
      return "🐾";
  }
}

function getStatusBadgeStyle(status: Appointment["status"]) {
  const styles = {
    confirmado: "bg-[#1E62EC]/20 text-[#1E62EC] border-[#1E62EC]/30",
    pendente: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
    cancelado: "bg-red-500/20 text-red-500 border-red-500/30",
    concluido: "bg-[#3DCA21]/20 text-[#3DCA21] border-[#3DCA21]/30",
  };
  return styles[status];
}

function getChannelIcon(channel: ConversationHistory["channel"]) {
  switch (channel) {
    case "whatsapp":
      return <MessageCircle className="h-4 w-4 text-[#25D366]" />;
    case "email":
      return <Mail className="h-4 w-4 text-[#1E62EC]" />;
    case "telefone":
      return <Phone className="h-4 w-4 text-[#9333EA]" />;
  }
}

function ClientsSidebar({
  customers,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  onNewCustomer,
  loading,
  error,
}: {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewCustomer: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-[#727B8E]/10 dark:border-[#40485A]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#434A57] dark:text-[#f5f9fc]">
            Clientes
          </h2>
          <button
            type="button"
            onClick={onNewCustomer}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] transition-colors hover:bg-[#F4F6F9] dark:text-[#8a94a6] dark:hover:bg-[#212225]"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#727B8E] dark:text-[#8a94a6]" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg bg-[#F4F6F9] dark:bg-[#212225] border-none pl-10 pr-4 py-2.5 text-sm text-[#434A57] dark:text-[#f5f9fc] placeholder:text-[#727B8E] dark:placeholder:text-[#8a94a6] outline-none focus:ring-2 focus:ring-[#1E62EC]/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-32 items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#1E62EC]" />
          </div>
        ) : error ? (
          <div className="flex flex-col h-full items-center justify-center gap-3 p-4 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button size="sm" variant="outline" onClick={onNewCustomer}>
              Novo Cliente
            </Button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <EmptyState
              image="not_found_clientes_ativos"
              description="Nenhum cliente encontrado."
              buttonText="Novo Cliente"
              buttonIcon={<Plus className="h-4 w-4" />}
              onButtonClick={onNewCustomer}
            />
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <motion.button
              key={customer.id}
              type="button"
              onClick={() => onSelect(customer.id)}
              whileHover={{ backgroundColor: "rgba(244, 246, 249, 0.5)" }}
              className={`w-full p-4 text-left border-b border-[#727B8E]/5 dark:border-[#40485A]/50 transition-colors ${
                selectedId === customer.id
                  ? "bg-[#F4F6F9] dark:bg-[#212225]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E62EC]/20">
                  <span className="text-sm font-medium text-[#1E62EC]">
                    {getInitials(customer.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-[#434A57] dark:text-[#f5f9fc]">
                      {customer.name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        customer.status === "ativo"
                          ? "bg-[#3DCA21]/20 text-[#3DCA21] border-[#3DCA21]/30"
                          : "bg-[#727B8E]/20 text-[#727B8E] border-[#727B8E]/30"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#727B8E] dark:text-[#8a94a6] mt-1">
                    {customer.pets.length} pet
                    {customer.pets.length !== 1 ? "s" : ""} • {customer.phone}
                  </p>
                  <p className="text-xs text-[#727B8E] dark:text-[#8a94a6] mt-0.5">
                    {customer.totalAppointments} agendamentos
                  </p>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

interface PetFormData {
  name: string;
  species: Pet["species"];
  breed: string;
  age: string;
  weight: string;
  size: Pet["size"];
  color: string;
  notes: string;
}

const emptyPetForm: PetFormData = {
  name: "",
  species: "cachorro",
  breed: "",
  age: "",
  weight: "",
  size: "medio",
  color: "",
  notes: "",
};

function CustomerDetails({
  customer,
  onBack,
  onEditCustomer,
  onDeleteCustomer,
  onDeletePet,
  onDeleteAppointment,
  onSavePet,
  onSaveAppointment,
  onOpenConversation,
  onTabChange,
  loadingPets,
  loadingAppointments,
  loadingConversations,
}: {
  customer: Customer | null;
  onBack: () => void;
  onEditCustomer: () => void;
  onDeleteCustomer: (id: string) => void;
  onDeletePet: (petId: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onSavePet: (pet: Omit<Pet, "id" | "customerId">, petId?: string) => void;
  onSaveAppointment: (
    appointment: Omit<Appointment, "id" | "customerId">,
    appointmentId?: string,
  ) => void;
  onOpenConversation: (conversationId: string) => void;
  onTabChange: (tab: "pets" | "agendamentos" | "conversas") => void;
  loadingPets?: boolean;
  loadingAppointments?: boolean;
  loadingConversations?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<
    "pets" | "agendamentos" | "conversas"
  >("pets");

  const handleTabChange = (tab: "pets" | "agendamentos" | "conversas") => {
    setActiveTab(tab);
    onTabChange(tab);
  };
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petForm, setPetForm] = useState<PetFormData>(emptyPetForm);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    petId: "",
    petName: "",
    date: "",
    time: "",
    service: "",
    status: "pendente" as Appointment["status"],
    notes: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  if (!customer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex flex-1 items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E62EC]/10">
            <PawPrint className="h-8 w-8 text-[#1E62EC]" />
          </div>
          <h2 className="text-xl font-medium text-[#434A57] dark:text-[#f5f9fc] mb-2">
            Gestão de Clientes
          </h2>
          <p className="text-[#727B8E] dark:text-[#8a94a6] mb-4">
            Selecione um cliente para ver detalhes
          </p>
        </div>
      </motion.div>
    );
  }

  const handleOpenPetModal = (pet?: Pet) => {
    setEditingPet(pet || null);
    if (pet) {
      setPetForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight,
        size: pet.size,
        color: pet.color,
        notes: pet.notes,
      });
    } else {
      setPetForm(emptyPetForm);
    }
    setPetModalOpen(true);
  };

  const handleSavePet = () => {
    if (!petForm.name.trim()) return;
    onSavePet(petForm, editingPet?.id);
    setPetModalOpen(false);
    setPetForm(emptyPetForm);
    setEditingPet(null);
  };

  const handleOpenAppointmentModal = (appointment?: Appointment) => {
    setEditingAppointment(appointment || null);
    if (appointment) {
      setAppointmentForm({
        petId: appointment.petId,
        petName: appointment.petName,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        status: appointment.status,
        notes: appointment.notes,
      });
    } else {
      setAppointmentForm({
        petId: customer?.pets[0]?.id || "",
        petName: customer?.pets[0]?.name || "",
        date: "",
        time: "",
        service: "",
        status: "pendente",
        notes: "",
      });
    }
    setAppointmentModalOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!appointmentForm.service.trim() || !appointmentForm.petId) return;
    onSaveAppointment(appointmentForm, editingAppointment?.id);
    setAppointmentModalOpen(false);
    setEditingAppointment(null);
  };

  return (
    <motion.div
      key={customer.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-1 flex-col min-h-0"
    >
      <div className="p-4 border-b border-[#727B8E]/10 dark:border-[#40485A]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-[#727B8E] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E62EC]/20">
            <span className="text-sm font-medium text-[#1E62EC]">
              {getInitials(customer.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-[#434A57] dark:text-[#f5f9fc]">
              {customer.name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-[#727B8E] dark:text-[#8a94a6]">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {customer.phone}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEditCustomer}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#727B8E] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
            >
              <Edit className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#727B8E] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[#727B8E]/10 dark:border-[#40485A] bg-white dark:bg-[#1A1B1D] shadow-lg z-10">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#434A57] dark:text-[#f5f9fc] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Abrir conversa
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
                    onClick={() => {
                      onDeleteCustomer(customer.id);
                      setMenuOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir cliente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex gap-1 mx-4 mt-4 p-1 bg-[#F4F6F9] dark:bg-[#212225] rounded-lg">
          <button
            type="button"
            onClick={() => handleTabChange("pets")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "pets"
                ? "bg-white dark:bg-[#1A1B1D] text-[#434A57] dark:text-[#f5f9fc] shadow-sm"
                : "text-[#727B8E] dark:text-[#8a94a6]"
            }`}
          >
            <PawPrint className="h-4 w-4" />
            Pets ({customer.pets.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("agendamentos")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "agendamentos"
                ? "bg-white dark:bg-[#1A1B1D] text-[#434A57] dark:text-[#f5f9fc] shadow-sm"
                : "text-[#727B8E] dark:text-[#8a94a6]"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Agendamentos
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("conversas")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "conversas"
                ? "bg-white dark:bg-[#1A1B1D] text-[#434A57] dark:text-[#f5f9fc] shadow-sm"
                : "text-[#727B8E] dark:text-[#8a94a6]"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Conversas
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "pets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-[#727B8E] dark:text-[#8a94a6]">
                  Pets cadastrados
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenPetModal()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Pet
                </Button>
              </div>
              {loadingPets ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1E62EC]" />
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.pets.map((pet) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#F4F6F9]/50 dark:bg-[#212225]/50 rounded-xl border border-[#727B8E]/10 dark:border-[#40485A]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#1E62EC]/20 flex items-center justify-center text-2xl">
                            {getSpeciesEmoji(pet.species)}
                          </div>
                          <div>
                            <p className="font-medium text-[#434A57] dark:text-[#f5f9fc]">
                              {pet.name}
                            </p>
                            <p className="text-sm text-[#727B8E] dark:text-[#8a94a6]">
                              {pet.breed} • {pet.age} • {pet.weight} • Porte{" "}
                              {pet.size === "pequeno"
                                ? "P"
                                : pet.size === "medio"
                                  ? "M"
                                  : "G"}
                            </p>
                            {pet.notes && (
                              <p className="text-xs text-[#727B8E] dark:text-[#8a94a6] mt-1">
                                {pet.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenPetModal(pet)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePet(pet.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {customer.pets.length === 0 && (
                    <div className="text-center py-8 text-[#727B8E] dark:text-[#8a94a6]">
                      <PawPrint className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum pet cadastrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "agendamentos" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-[#727B8E] dark:text-[#8a94a6]">
                  Histórico de agendamentos
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenAppointmentModal()}
                  disabled={customer.pets.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Agendamento
                </Button>
              </div>
              {loadingAppointments ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1E62EC]" />
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.appointments.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#F4F6F9]/50 dark:bg-[#212225]/50 rounded-xl border border-[#727B8E]/10 dark:border-[#40485A]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1E62EC]/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[#1E62EC]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#434A57] dark:text-[#f5f9fc]">
                              {apt.service}
                            </p>
                            <p className="text-sm text-[#727B8E] dark:text-[#8a94a6]">
                              {apt.petName} • {apt.date} às {apt.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusBadgeStyle(apt.status)}`}
                          >
                            {apt.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenAppointmentModal(apt)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#727B8E] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteAppointment(apt.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {customer.appointments.length === 0 && (
                    <div className="text-center py-8 text-[#727B8E] dark:text-[#8a94a6]">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum agendamento registrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "conversas" &&
            (loadingConversations ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1E62EC]" />
              </div>
            ) : (
              <div className="space-y-3">
                {customer.conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    type="button"
                    onClick={() => onOpenConversation(conv.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 bg-[#F4F6F9]/50 dark:bg-[#212225]/50 rounded-xl border border-[#727B8E]/10 dark:border-[#40485A] cursor-pointer hover:bg-[#F4F6F9] dark:hover:bg-[#212225] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F4F6F9] dark:bg-[#212225] flex items-center justify-center">
                        {getChannelIcon(conv.channel)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[#434A57] dark:text-[#f5f9fc] capitalize">
                            {conv.channel}
                          </p>
                          <span className="text-xs text-[#727B8E] dark:text-[#8a94a6]">
                            {conv.date}
                          </span>
                        </div>
                        <p className="text-sm text-[#727B8E] dark:text-[#8a94a6] truncate mt-1">
                          {conv.preview}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
                {customer.conversations.length === 0 && (
                  <div className="text-center py-8 text-[#727B8E] dark:text-[#8a94a6]">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma conversa registrada</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <Modal
        isOpen={petModalOpen}
        onClose={() => {
          setPetModalOpen(false);
          setPetForm(emptyPetForm);
          setEditingPet(null);
        }}
        title={editingPet ? "Editar pet" : "Novo pet"}
        onSubmit={handleSavePet}
        submitText="Salvar"
        className="max-w-[400px] max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px]">
          <Input
            label="Nome do pet"
            placeholder="Nome"
            value={petForm.name}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Select
            label="Espécie"
            placeholder="Selecione"
            value={petForm.species}
            onChange={(e) =>
              setPetForm((prev) => ({
                ...prev,
                species: e.target.value as Pet["species"],
              }))
            }
            options={[
              { value: "cachorro", label: "Cachorro" },
              { value: "gato", label: "Gato" },
              { value: "ave", label: "Ave" },
              { value: "roedor", label: "Roedor" },
              { value: "outro", label: "Outro" },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Raça"
              placeholder="Raça"
              value={petForm.breed}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, breed: e.target.value }))
              }
            />
            <Input
              label="Idade"
              placeholder="Idade"
              value={petForm.age}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, age: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Peso"
              placeholder="Peso"
              value={petForm.weight}
              onChange={(e) =>
                setPetForm((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
            <Select
              label="Porte"
              placeholder="Selecione"
              value={petForm.size}
              onChange={(e) =>
                setPetForm((prev) => ({
                  ...prev,
                  size: e.target.value as Pet["size"],
                }))
              }
              options={[
                { value: "pequeno", label: "Pequeno" },
                { value: "medio", label: "Médio" },
                { value: "grande", label: "Grande" },
              ]}
            />
          </div>
          <Input
            label="Cor/Pelagem"
            placeholder="Cor"
            value={petForm.color}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, color: e.target.value }))
            }
          />
          <TextAreaField
            id="pet-notes"
            label="Observações"
            placeholder="Observações"
            value={petForm.notes}
            onChange={(e) =>
              setPetForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
          />
        </div>
      </Modal>

      <Modal
        isOpen={appointmentModalOpen}
        onClose={() => {
          setAppointmentModalOpen(false);
          setEditingAppointment(null);
        }}
        title={editingAppointment ? "Editar agendamento" : "Novo agendamento"}
        onSubmit={handleSaveAppointment}
        submitText="Salvar"
        className="max-w-[400px] max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px]">
          <Select
            label="Pet"
            placeholder="Selecione o pet"
            value={appointmentForm.petId}
            onChange={(e) => {
              const pet = customer.pets.find((p) => p.id === e.target.value);
              setAppointmentForm((prev) => ({
                ...prev,
                petId: e.target.value,
                petName: pet?.name || "",
              }));
            }}
            options={customer.pets.map((pet) => ({
              value: pet.id,
              label: pet.name,
            }))}
          />
          <Input
            label="Serviço"
            placeholder="Serviço"
            value={appointmentForm.service}
            onChange={(e) =>
              setAppointmentForm((prev) => ({
                ...prev,
                service: e.target.value,
              }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data"
              placeholder="DD/MM/AAAA"
              value={appointmentForm.date}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  date: maskDate(e.target.value),
                }))
              }
              maxLength={10}
            />
            <Input
              label="Horário"
              placeholder="HH:MM"
              value={appointmentForm.time}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  time: maskTime(e.target.value),
                }))
              }
              maxLength={5}
            />
          </div>
          <Select
            label="Status"
            placeholder="Selecione"
            value={appointmentForm.status}
            onChange={(e) =>
              setAppointmentForm((prev) => ({
                ...prev,
                status: e.target.value as Appointment["status"],
              }))
            }
            options={[
              { value: "pendente", label: "Pendente" },
              { value: "confirmado", label: "Confirmado" },
              { value: "concluido", label: "Concluído" },
              { value: "cancelado", label: "Cancelado" },
            ]}
          />
          <TextAreaField
            id="appointment-notes"
            label="Observações"
            placeholder="Observações"
            value={appointmentForm.notes}
            onChange={(e) =>
              setAppointmentForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
          />
        </div>
      </Modal>
    </motion.div>
  );
}

const emptyCustomerForm = {
  name: "",
  email: "",
  phone: "",
  status: "ativo" as "ativo" | "inativo",
  address: "",
  notes: "",
};

function clientToCustomer(c: Client): Customer {
  const digits = c.phone?.replace(/\D/g, "") ?? "";
  const phoneDisplay = digits.length >= 10 ? maskPhone(digits) : c.phone;
  return {
    id: c.id,
    name: c.name ?? "",
    email: c.email ?? "",
    phone: phoneDisplay,
    status: c.is_active ? "ativo" : "inativo",
    address: undefined,
    notes: c.notes ?? undefined,
    totalAppointments: c.total_appointments ?? 0,
    lastVisit: "",
    pets: [],
    appointments: [],
    conversations: [],
  };
}

function buildNotes(addressStr: string, notes: string): string {
  const parts: string[] = [];
  if (addressStr.trim()) parts.push("Endereço: " + addressStr.trim());
  if (notes.trim()) parts.push(notes.trim());
  return parts.join("\n");
}

function parseNotesForEdit(notes?: string | null): {
  address: string;
  notes: string;
} {
  if (!notes?.trim()) return { address: "", notes: "" };
  const firstLine = notes.split("\n")[0]?.trim() ?? "";
  if (firstLine.startsWith("Endereço:")) {
    const address = firstLine.replace(/^Endereço:\s*/i, "").trim();
    const rest = notes.split("\n").slice(1).join("\n").trim();
    return { address, notes: rest };
  }
  return { address: "", notes: notes.trim() };
}

export default function ClientesPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [customerStep, setCustomerStep] = useState<1 | 2>(1);
  const {
    address,
    setField,
    handleCepChange,
    cepLoading,
    cepError,
    isFieldDisabled,
    reset: resetAddress,
  } = useAddressByCep();

  const [loadingPets, setLoadingPets] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "pets" | "agendamentos" | "conversas"
  >("pets");
  const [loadedTabs, setLoadedTabs] = useState<Record<string, Set<string>>>({});

  const selectedCustomer = customers.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    let cancelled = false;
    setCustomersLoading(true);
    setCustomersError(null);
    clientService
      .listClients({ limit: 500 })
      .then((list) => {
        if (!cancelled) setCustomers(list.map(clientToCustomer));
      })
      .catch((err: any) => {
        if (!cancelled)
          setCustomersError(
            err.response?.data?.detail ?? "Erro ao carregar clientes.",
          );
      })
      .finally(() => {
        if (!cancelled) setCustomersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (customerModalOpen) {
      setSaveError(null);
      setCustomerStep(1);
      if (editingCustomer) {
        const { address: addrLine, notes: notesOnly } = parseNotesForEdit(
          editingCustomer.notes,
        );
        setCustomerForm({
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          status: editingCustomer.status,
          address: addrLine,
          notes: notesOnly,
        });
        resetAddress({ rua: addrLine });
      } else {
        setCustomerForm(emptyCustomerForm);
        resetAddress();
      }
    }
  }, [customerModalOpen, editingCustomer, resetAddress]);

  const loadPets = useCallback(
    async (customerId: string) => {
      const alreadyLoaded = loadedTabs[customerId]?.has("pets");
      if (alreadyLoaded) return;

      setLoadingPets(true);
      try {
        const pets = await clientService.getClientPets(
          customerId,
          user?.petshop_id,
        );
        const mappedPets: Pet[] = pets.map((p) => ({
          id: p.id,
          customerId,
          name: p.name,
          species: (p.species as Pet["species"]) || "outro",
          breed: p.breed || "",
          age: p.age?.toString() || "",
          weight: p.weight?.toString() || "",
          size: (p.size as Pet["size"]) || "medio",
          color: p.color || "",
          notes:
            typeof p.medical_info === "object" && p.medical_info !== null
              ? (p.medical_info as { notes?: string }).notes || ""
              : "",
        }));
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId ? { ...c, pets: mappedPets } : c,
          ),
        );
        setLoadedTabs((prev) => ({
          ...prev,
          [customerId]: new Set([...(prev[customerId] || []), "pets"]),
        }));
      } catch (error) {
        console.error("Erro ao carregar pets:", error);
      } finally {
        setLoadingPets(false);
      }
    },
    [user?.petshop_id, loadedTabs],
  );

  const loadConversations = useCallback(
    async (customerId: string) => {
      const alreadyLoaded = loadedTabs[customerId]?.has("conversas");
      if (alreadyLoaded) return;

      setLoadingConversations(true);
      try {
        const result = await clientService.getClientConversations(customerId);
        const mappedConversations: ConversationHistory[] =
          result.conversations.map((conv) => ({
            id: conv.conversation_id,
            date: new Date(conv.last_message_at).toLocaleDateString("pt-BR"),
            preview: `${conv.message_count} mensagens`,
            channel: "whatsapp" as const,
          }));
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId
              ? { ...c, conversations: mappedConversations }
              : c,
          ),
        );
        setLoadedTabs((prev) => ({
          ...prev,
          [customerId]: new Set([...(prev[customerId] || []), "conversas"]),
        }));
      } catch (error) {
        console.error("Erro ao carregar conversas:", error);
      } finally {
        setLoadingConversations(false);
      }
    },
    [loadedTabs],
  );

  const loadAppointments = useCallback(
    async (customerId: string, phone: string) => {
      const alreadyLoaded = loadedTabs[customerId]?.has("agendamentos");
      if (alreadyLoaded) return;

      setLoadingAppointments(true);
      try {
        const { appointmentService } = await import("@/services");
        const phoneDigits = phone.replace(/\D/g, "");
        const appointments = await appointmentService.listAppointments({
          phone: phoneDigits,
        });
        const mappedAppointments: Appointment[] = appointments.map((apt) => {
          const scheduledDate = new Date(apt.scheduled_at);
          const dateStr = scheduledDate.toLocaleDateString("pt-BR");
          const timeStr = scheduledDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: apt.id,
            customerId,
            petId: "",
            petName: apt.pet_name || "",
            date: dateStr,
            time: timeStr,
            service: apt.specialty || "",
            status: (apt.status as Appointment["status"]) || "pendente",
            notes: "",
          };
        });
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId
              ? { ...c, appointments: mappedAppointments }
              : c,
          ),
        );
        setLoadedTabs((prev) => ({
          ...prev,
          [customerId]: new Set([...(prev[customerId] || []), "agendamentos"]),
        }));
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setLoadingAppointments(false);
      }
    },
    [loadedTabs],
  );

  const handleTabChange = useCallback(
    (tab: "pets" | "agendamentos" | "conversas") => {
      setActiveTab(tab);
      if (!selectedId) return;

      const customer = customers.find((c) => c.id === selectedId);
      if (!customer) return;

      if (tab === "pets") {
        loadPets(selectedId);
      } else if (tab === "agendamentos") {
        loadAppointments(selectedId, customer.phone);
      } else if (tab === "conversas") {
        loadConversations(selectedId);
      }
    },
    [selectedId, customers, loadPets, loadAppointments, loadConversations],
  );

  useEffect(() => {
    if (selectedId) {
      setActiveTab("pets");
      loadPets(selectedId);
    }
  }, [selectedId, loadPets]);

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (selectedId === customerId) {
      setSelectedId(null);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!selectedCustomer) return;
    try {
      await petService.deletePet(petId);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, pets: c.pets.filter((p) => p.id !== petId) }
            : c,
        ),
      );
    } catch (error: any) {
      console.error("Erro ao excluir pet:", error);
      alert(error.response?.data?.detail || "Erro ao excluir pet");
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!selectedCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomer.id
          ? {
              ...c,
              appointments: c.appointments.filter(
                (a) => a.id !== appointmentId,
              ),
            }
          : c,
      ),
    );
  };

  const handleSavePet = useCallback(
    async (petData: Omit<Pet, "id" | "customerId">, petId?: string) => {
      if (!selectedCustomer) return;

      try {
        if (petId) {
          const updated = await petService.updatePet(petId, {
            name: petData.name,
            species: petData.species,
            breed: petData.breed || undefined,
            age: petData.age ? parseInt(petData.age) : undefined,
            weight: petData.weight ? parseFloat(petData.weight) : undefined,
            size: petData.size,
            color: petData.color || undefined,
            medical_info: petData.notes
              ? { conditions: [petData.notes] }
              : undefined,
          });
          setCustomers((prev) =>
            prev.map((c) => {
              if (c.id !== selectedCustomer.id) return c;
              return {
                ...c,
                pets: c.pets.map((p) =>
                  p.id === petId ? { ...p, ...petData, id: updated.id } : p,
                ),
              };
            }),
          );
        } else {
          const created = await petService.createPet({
            petshop_id: user?.petshop_id || 1,
            client_id: selectedCustomer.id,
            name: petData.name,
            species: petData.species,
            breed: petData.breed || undefined,
            age: petData.age ? parseInt(petData.age) : undefined,
            weight: petData.weight ? parseFloat(petData.weight) : undefined,
            size: petData.size,
            color: petData.color || undefined,
            medical_info: petData.notes
              ? { conditions: [petData.notes] }
              : undefined,
          });
          const newPet: Pet = {
            id: created.id,
            customerId: selectedCustomer.id,
            name: created.name,
            species: (created.species as Pet["species"]) || "outro",
            breed: created.breed || "",
            age: created.age?.toString() || "",
            weight: created.weight?.toString() || "",
            size: (created.size as Pet["size"]) || "medio",
            color: created.color || "",
            notes:
              typeof created.medical_info === "string"
                ? created.medical_info
                : "",
          };
          setCustomers((prev) =>
            prev.map((c) => {
              if (c.id !== selectedCustomer.id) return c;
              return {
                ...c,
                pets: [...c.pets, newPet],
              };
            }),
          );
        }
      } catch (error: any) {
        console.error("Erro ao salvar pet:", error);
        alert(error.response?.data?.detail || "Erro ao salvar pet");
      }
    },
    [selectedCustomer, user],
  );

  const handleSaveAppointment = useCallback(
    (
      appointmentData: Omit<Appointment, "id" | "customerId">,
      appointmentId?: string,
    ) => {
      if (!selectedCustomer) return;

      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCustomer.id) return c;

          if (appointmentId) {
            return {
              ...c,
              appointments: c.appointments.map((a) =>
                a.id === appointmentId ? { ...a, ...appointmentData } : a,
              ),
            };
          } else {
            const newAppointment: Appointment = {
              id: `apt-${Date.now()}`,
              customerId: selectedCustomer.id,
              ...appointmentData,
            };
            return {
              ...c,
              appointments: [...c.appointments, newAppointment],
            };
          }
        }),
      );
    },
    [selectedCustomer],
  );

  const handleOpenConversation = useCallback(
    (conversationId: string) => {
      navigate(`/chat?id=${encodeURIComponent(conversationId)}`);
    },
    [navigate],
  );

  const handleSaveCustomer = useCallback(async () => {
    const { name, email, phone, status, notes } = customerForm;
    const phoneDigits = unmaskDigits(phone);
    if (!name.trim() || !phoneDigits) return;

    const addr = address;
    const addressStr = [
      addr.rua,
      addr.numero,
      addr.complemento,
      addr.bairro,
      addr.cidade,
      addr.uf,
    ]
      .filter(Boolean)
      .join(", ")
      .trim();
    const notesValue = buildNotes(addressStr, notes);

    setSaveError(null);
    setIsSaving(true);
    try {
      if (editingCustomer) {
        const updated = await clientService.updateClient(editingCustomer.id, {
          name: name.trim(),
          email: email.trim() || undefined,
          is_active: status === "ativo",
          notes: notesValue || undefined,
        });
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === editingCustomer.id ? clientToCustomer(updated) : c,
          ),
        );
        setCustomerModalOpen(false);
      } else {
        const newClient = await clientService.createClient({
          phone: phoneDigits,
          name: name.trim(),
          email: email.trim() || undefined,
          source: "manual",
        });
        if (notesValue) {
          await clientService.updateClient(newClient.id, { notes: notesValue });
        }
        const withNotes = notesValue
          ? { ...newClient, notes: notesValue }
          : newClient;
        setCustomers((prev) => [clientToCustomer(withNotes), ...prev]);
        setSelectedId(newClient.id);
        setCustomerModalOpen(false);
      }
    } catch (err: any) {
      setSaveError(err.response?.data?.detail ?? "Erro ao salvar cliente.");
    } finally {
      setIsSaving(false);
    }
  }, [customerForm, editingCustomer, address]);

  return (
    <DashboardLayout
      sidebar={
        <ClientsSidebar
          customers={customers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewCustomer={() => {
            setEditingCustomer(null);
            setCustomerModalOpen(true);
          }}
          loading={customersLoading}
          error={customersError}
        />
      }
    >
      <AnimatePresence mode="wait">
        <CustomerDetails
          customer={selectedCustomer}
          onBack={() => setSelectedId(null)}
          onEditCustomer={() => {
            setEditingCustomer(selectedCustomer);
            setCustomerModalOpen(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
          onDeletePet={handleDeletePet}
          onDeleteAppointment={handleDeleteAppointment}
          onSavePet={handleSavePet}
          onSaveAppointment={handleSaveAppointment}
          onOpenConversation={handleOpenConversation}
          onTabChange={handleTabChange}
          loadingPets={loadingPets}
          loadingAppointments={loadingAppointments}
          loadingConversations={loadingConversations}
        />
      </AnimatePresence>

      <Modal
        isOpen={customerModalOpen}
        onClose={() =>
          customerStep === 2 ? setCustomerStep(1) : setCustomerModalOpen(false)
        }
        title={editingCustomer ? "Editar cliente" : "Novo cliente"}
        onSubmit={
          customerStep === 1
            ? () => setCustomerStep(2)
            : () => void handleSaveCustomer()
        }
        submitText={
          customerStep === 1
            ? "Próximo"
            : editingCustomer
              ? "Salvar"
              : "Cadastrar"
        }
        cancelText={customerStep === 2 ? "Voltar" : "Cancelar"}
        isLoading={isSaving && customerStep === 2}
        className="max-w-[400px] max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px]">
          {saveError && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {saveError}
            </p>
          )}
          <div className="flex gap-1" aria-label={`Etapa ${customerStep} de 2`}>
            {[1, 2].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step <= customerStep
                    ? "bg-[#1E62EC] dark:bg-[#2172e5]"
                    : "bg-[#727B8E]/25 dark:bg-[#40485A]",
                )}
              />
            ))}
          </div>

          {customerStep === 1 && (
            <>
              <Input
                label="Nome"
                placeholder="Nome do tutor"
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm((f) => ({
                    ...f,
                    phone: maskPhone(e.target.value),
                  }))
                }
                required
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="email@exemplo.com (opcional)"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </>
          )}

          {customerStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={address.cep}
                  onChange={handleCepChange}
                />
                {cepLoading && (
                  <div className="absolute right-3 top-9">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1E62EC]" />
                  </div>
                )}
                {cepError && (
                  <p className="mt-1 text-xs text-red-500">{cepError}</p>
                )}
              </div>
              <Input
                label="Rua"
                placeholder="Logradouro"
                value={address.rua}
                onChange={(e) => setField("rua", e.target.value)}
                disabled={isFieldDisabled("rua")}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Número"
                  placeholder="Nº"
                  value={address.numero}
                  onChange={(e) => setField("numero", e.target.value)}
                />
                <Input
                  label="Complemento"
                  placeholder="Apto, sala..."
                  value={address.complemento}
                  onChange={(e) => setField("complemento", e.target.value)}
                  disabled={isFieldDisabled("complemento")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Bairro"
                  placeholder="Bairro"
                  value={address.bairro}
                  onChange={(e) => setField("bairro", e.target.value)}
                  disabled={isFieldDisabled("bairro")}
                />
                <Input
                  label="Cidade"
                  placeholder="Cidade"
                  value={address.cidade}
                  onChange={(e) => setField("cidade", e.target.value)}
                  disabled={isFieldDisabled("cidade")}
                />
              </div>
              <Input
                label="UF"
                placeholder="UF"
                value={address.uf}
                onChange={(e) =>
                  setField("uf", e.target.value.toUpperCase().slice(0, 2))
                }
                disabled={isFieldDisabled("uf")}
              />
              <Select
                label="Status"
                placeholder="Selecione"
                value={customerForm.status}
                onChange={(e) =>
                  setCustomerForm((f) => ({
                    ...f,
                    status: e.target.value as "ativo" | "inativo",
                  }))
                }
                options={[
                  { value: "ativo", label: "Ativo" },
                  { value: "inativo", label: "Inativo" },
                ]}
              />
              <div className="flex flex-col gap-2">
                <label className="font-be-vietnam-pro text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">
                  Observações
                </label>
                <TextArea
                  placeholder="Observações sobre o cliente"
                  value={customerForm.notes}
                  onChange={(e) =>
                    setCustomerForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
