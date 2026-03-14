export type PipelineStage =
  | 'welcome'
  | 'situation'
  | 'problem'
  | 'implication'
  | 'scheduling'
  | 'completed'

export interface PipelineCard {
  id: string
  name: string
  initials: string
  pets: string
  description: string
  time: string
  stage: PipelineStage
}

export const PIPELINE_COLUMNS: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'welcome', label: 'Boas-vindas', color: '#1E62EC' },
  { id: 'situation', label: 'Situação', color: '#1E62EC' },
  { id: 'problem', label: 'Problema', color: '#F59E0B' },
  { id: 'implication', label: 'Implicação', color: '#F59E0B' },
  { id: 'scheduling', label: 'Agendamento', color: '#8B5CF6' },
  { id: 'completed', label: 'Concluído', color: '#3CD057' },
]

export const MOCK_PIPELINE_CARDS: PipelineCard[] = [
  { id: '1', name: 'Patrícia Costa', initials: 'PC', pets: 'Mingau, Frajola', description: 'Vocês fazem hotel para gatos também?', time: '09:30', stage: 'welcome' },
  { id: '2', name: 'Roberto Almeida', initials: 'RA', pets: 'Buddy, Max', description: 'Quanto custa a consulta veterinária?', time: '10:15', stage: 'situation' },
  { id: '3', name: 'João Santos', initials: 'JS', pets: 'Bob', description: 'O Bob está com a vacinação em dia?', time: '13:45', stage: 'situation' },
  { id: '4', name: 'Carlos Mendes', initials: 'CM', pets: 'Rex', description: 'Qual o preço do banho para cachorro?', time: 'Ontem', stage: 'problem' },
  { id: '5', name: 'Ricardo Martins', initials: 'RM', pets: 'Spike', description: 'O Spike tomou todas as vacinas?', time: 'Seg', stage: 'problem' },
  { id: '6', name: 'Camila Rodrigues', initials: 'CR', pets: 'Bella, Nina', description: 'A Bella precisa de tosa urgente, ela tá r', time: '08:45', stage: 'implication' },
  { id: '7', name: 'Maria Silva', initials: 'MS', pets: 'Thor, Mia', description: 'Perfeito! Confirmado o banho do Thor', time: '14:32', stage: 'scheduling' },
  { id: '8', name: 'Juliana Souza', initials: 'JS', pets: 'Princesa, Duquesa', description: 'Perfeito! A Princesa vai adorar a hidrata', time: 'Dom', stage: 'scheduling' },
  { id: '9', name: 'Fernanda Lima', initials: 'FL', pets: 'Mel, Pipoca', description: 'Obrigada pelo atendimento! 🙌', time: 'Ontem', stage: 'completed' },
  { id: '10', name: 'Lucas Ferreira', initials: 'LF', pets: 'Toby', description: 'Beleza, confirmo o banho do Toby pra', time: 'Ontem', stage: 'completed' },
  { id: '11', name: 'Ana Oliveira', initials: 'AO', pets: 'Luna, Simba, Piu', description: 'A Luna adorou a tosa! Ficou linda 💕', time: '12:00', stage: 'completed' },
  { id: '12', name: 'Marcos Pereira', initials: 'MP', pets: 'Zeus, Apolo, Hera', description: 'Show! Valeu pelo desconto no combo', time: 'Sáb', stage: 'completed' },
]
