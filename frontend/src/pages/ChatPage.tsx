import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sendMessage, getHistory } from '../services/agentService'
import type { Message } from '../types'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const clientPhone = user?.clientPhone ?? null

  // Carrega histórico ao montar
  useEffect(() => {
    if (!clientPhone) {
      setHistoryLoading(false)
      return
    }
    getHistory(clientPhone)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setHistoryLoading(false))
  }, [clientPhone])

  // Auto-scroll ao receber novas mensagens ou enquanto aguarda resposta
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || !clientPhone) return

    setInput('')
    setError(null)

    const tempId = `temp-${Date.now()}`
    const userMsg: Message = {
      id: tempId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setSending(true)

    try {
      const res = await sendMessage(text, clientPhone)
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, agentMsg])
    } catch {
      setError('Erro ao enviar mensagem. Tente novamente.')
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e as unknown as FormEvent)
    }
  }

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🐾</span>
          <span className={styles.brandName}>Petshop AI</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name}</span>
          <span className={styles.companyBadge}>{user?.companyName}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* Área de mensagens */}
      <main className={styles.main}>
        {!clientPhone ? (
          <div className={styles.noPhone}>
            <p>Nenhum telefone configurado para o agente.</p>
            <small>Defina ownerPhone no perfil do petshop para usar o chat.</small>
          </div>
        ) : historyLoading ? (
          <div className={styles.loadingHistory}>Carregando histórico...</div>
        ) : (
          <div className={styles.messages}>
            {messages.length === 0 && !sending && (
              <div className={styles.empty}>
                <p>Nenhuma conversa ainda.</p>
                <small>Digite uma mensagem para iniciar.</small>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.userMessage : styles.agentMessage
                }`}
              >
                <div className={styles.bubble}>{msg.content}</div>
                <time className={styles.time}>{formatTime(msg.createdAt)}</time>
              </div>
            ))}

            {/* Indicador de digitação */}
            {sending && (
              <div className={`${styles.message} ${styles.agentMessage}`}>
                <div className={`${styles.bubble} ${styles.typingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Input */}
      {clientPhone && (
        <footer className={styles.footer}>
          {error && <div className={styles.errorBar}>{error}</div>}
          <form onSubmit={handleSend} className={styles.inputForm}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              className={styles.textarea}
              rows={1}
              disabled={sending}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || sending}
            >
              {sending ? '...' : 'Enviar'}
            </button>
          </form>
        </footer>
      )}
    </div>
  )
}
