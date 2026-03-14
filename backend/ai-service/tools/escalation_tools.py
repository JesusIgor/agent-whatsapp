from db import get_connection


def escalate_to_human(
    company_id: int, client_id: str, summary: str, last_message: str
) -> dict:
    """
    Pausa o agente de IA para este cliente e registra o motivo do escalonamento.
    Deve ser chamada quando:
    - Cliente quer falar com humano
    - Assunto fora do escopo do petshop
    - Insatisfação grave

    Args:
        company_id: ID da company
        client_id: ID do cliente
        summary: Resumo claro do motivo do escalonamento
        last_message: Última mensagem do cliente
    """
    with get_connection() as conn:
        cur = conn.cursor()

        # Pausa o agente para este cliente
        cur.execute(
            """
            UPDATE clients
            SET ai_paused = TRUE,
                ai_paused_at = NOW(),
                ai_pause_reason = %s
            WHERE id = %s AND company_id = %s
            RETURNING id
        """,
            (
                f"[ESCALONAMENTO] {summary} | Última msg: {last_message}",
                client_id,
                company_id,
            ),
        )

        updated = cur.fetchone()

    if not updated:
        return {"success": False, "message": "Cliente não encontrado."}

    # TODO: Aqui você pode adicionar notificação ao responsável
    # Ex: enviar mensagem WhatsApp para o dono, webhook, email, etc.

    return {
        "success": True,
        "message": "Cliente encaminhado para atendimento humano. IA pausada.",
        "summary": summary,
    }
