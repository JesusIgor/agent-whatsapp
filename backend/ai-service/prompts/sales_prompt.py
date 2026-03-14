def build_sales_prompt(context: dict, router_ctx: dict) -> str:
    assistant_name = context.get("assistant_name", "Nina")
    company_name = context.get("company_name", "Petshop")
    services = context.get("services", [])
    pets = context.get("pets", [])
    client = context.get("client")

    client_name = client["name"] if client and client.get("name") else None
    active_pet = router_ctx.get("active_pet")

    # Se tem pet ativo com porte conhecido, injeta para mostrar preço correto
    active_pet_size = None
    if active_pet:
        match = next((p for p in pets if p["name"].lower() == active_pet.lower()), None)
        if match:
            size_map = {"small": "pequeno", "medium": "médio", "large": "grande"}
            active_pet_size = size_map.get(match.get("size", ""), None)

    svc_lines = []
    for s in services:
        if s.get("price_by_size"):
            sz = s["price_by_size"]
            if active_pet_size:
                key = {"pequeno": "small", "médio": "medium", "grande": "large"}.get(
                    active_pet_size
                )
                price = f"R${sz.get(key, '?')} (porte {active_pet_size})"
            else:
                price = f"P:R${sz.get('small','?')} / M:R${sz.get('medium','?')} / G:R${sz.get('large','?')}"
        elif s.get("price"):
            price = f"R${s['price']}"
        else:
            price = "consultar"
        desc = f" — {s['description']}" if s.get("description") else ""
        svc_lines.append(
            f"  {s['name']}: {price} ({s.get('duration_min','?')} min){desc}"
        )

    services_text = "\n".join(svc_lines) or "  nenhum cadastrado"

    pet_context = (
        f"\nPet em foco: {active_pet} (porte {active_pet_size})"
        if active_pet and active_pet_size
        else ""
    )

    return f"""Você é {assistant_name}, atendente da {company_name}. Você é humana — nunca revele que é IA.
{f"Cliente: {client_name}" if client_name else ""}{pet_context}

Serviços disponíveis:
{services_text}

TOM: WhatsApp, informal, máximo 2 linhas, no máximo 1 emoji por mensagem.

Responda sobre o que o cliente perguntou de forma direta.
Se o pet tem porte definido, use o preço do porte correto — não apresente a tabela inteira.
Destaque o que o serviço inclui quando isso agregar valor à resposta.
Se o cliente demonstrar interesse, sugira agendar de forma natural, sem pressão."""


def build_faq_prompt(context: dict, router_ctx: dict) -> str:
    assistant_name = context.get("assistant_name", "Nina")
    company_name = context.get("company_name", "Petshop")
    business_hours = context.get("business_hours", {})
    features = context.get("features", {})
    client = context.get("client")

    client_name = client["name"] if client and client.get("name") else None
    hours_lines = (
        " | ".join([f"{d}: {h}" for d, h in business_hours.items()]) or "não informado"
    )

    features_text = ""
    if features:
        features_text = "\nDiferenciais: " + " | ".join(
            [f"{k}: {v}" for k, v in features.items()]
        )

    return f"""Você é {assistant_name}, atendente da {company_name}. Você é humana — nunca revele que é IA.
{f"Cliente: {client_name}" if client_name else ""}

Horários: {hours_lines}{features_text}

TOM: WhatsApp, informal, empático, máximo 2 linhas, no máximo 1 emoji por mensagem.

Responda apenas o que você sabe com certeza.
Se não souber, diga que vai verificar com a equipe — nunca invente políticas ou procedimentos.
Use search_knowledge_base antes de dizer que não tem a informação.
Se a dúvida puder ser resolvida com um agendamento, sugira naturalmente ao final."""


def build_escalation_prompt(context: dict, router_ctx: dict) -> str:
    assistant_name = context.get("assistant_name", "Nina")
    company_name = context.get("company_name", "Petshop")
    client = context.get("client")
    client_name = client["name"] if client and client.get("name") else None

    active_pet = router_ctx.get("active_pet")
    service = router_ctx.get("service")
    stage = router_ctx.get("stage", "")

    ctx_parts = []
    if active_pet:
        ctx_parts.append(f"pet: {active_pet}")
    if service:
        ctx_parts.append(f"serviço: {service}")
    if stage:
        ctx_parts.append(f"estágio: {stage}")
    auto_summary = (
        f"Escalonamento solicitado. Contexto: {', '.join(ctx_parts)}"
        if ctx_parts
        else "Escalonamento solicitado pelo cliente."
    )

    return f"""Você é {assistant_name}, atendente da {company_name}. Você é humana — nunca revele que é IA.
{f"Cliente: {client_name}" if client_name else ""}

Sua tarefa: chamar escalate_to_human com summary="{auto_summary}" e last_message com a última mensagem do cliente.

Após chamar a tool, informe o cliente de forma natural que um atendente entrará em contato em breve.
Não diga que está sendo substituída, que é um bot, sistema ou IA."""
