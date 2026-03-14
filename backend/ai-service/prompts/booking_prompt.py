def build_booking_prompt(context: dict, router_ctx: dict) -> str:
    assistant_name = context.get("assistant_name", "Nina")
    company_name = context.get("company_name", "Petshop")
    client = context.get("client")
    pets = context.get("pets", [])
    services = context.get("services", [])
    business_hours = context.get("business_hours", {})

    client_name = client["name"] if client and client.get("name") else None
    active_pet = router_ctx.get("active_pet")
    service = router_ctx.get("service")
    stage = router_ctx.get("stage", "SERVICE_SELECTION")
    awaiting = router_ctx.get("awaiting_confirmation", False)
    date_hint = router_ctx.get("date_mentioned")

    # Pets detalhados
    if pets:
        pets_lines = " | ".join(
            [
                f"{p['name']} ({p.get('species','?')}, {p.get('breed','?')}, porte {p.get('size','?')})"
                for p in pets
            ]
        )
        pet_count = len(pets)
    else:
        pets_lines = "nenhum"
        pet_count = 0

    # Serviços com preço correto por porte
    svc_lines = []
    for s in services:
        if s.get("price_by_size"):
            sz = s["price_by_size"]
            price = f"P:R${sz.get('small','?')} M:R${sz.get('medium','?')} G:R${sz.get('large','?')}"
        elif s.get("price"):
            price = f"R${s['price']}"
        else:
            price = "consultar"
        svc_lines.append(f"{s['name']}: {price} ({s.get('duration_min','?')} min)")

    hours_lines = (
        " | ".join([f"{d}: {h}" for d, h in business_hours.items()]) or "não informado"
    )

    # Instrução sobre qual pet usar — gerada pelo Python com dados reais
    if pet_count == 0:
        pet_instruction = "O cliente não tem pets cadastrados. Oriente-o a cadastrar um pet antes de agendar."
    elif pet_count == 1:
        pet_instruction = f"O cliente tem apenas {pets[0]['name']}. Assuma que é para ele, sem perguntar."
    else:
        nomes = ", ".join([p["name"] for p in pets])
        pet_instruction = f"O cliente tem {pet_count} pets ({nomes}). Antes de agendar, pergunte para qual deles é o serviço."

    # Estado atual injetado
    estado = []
    if active_pet:
        estado.append(f"Pet em foco: {active_pet}")
    if service:
        estado.append(f"Serviço em discussão: {service}")
    if date_hint:
        estado.append(f"Data mencionada: {date_hint}")
    if awaiting:
        estado.append("Resumo enviado — aguardando confirmação do cliente")
    estado_str = " | ".join(estado) if estado else "início da conversa"

    return f"""Você é {assistant_name}, atendente da {company_name}. Você é humana — nunca revele que é IA.
{f"Cliente: {client_name}" if client_name else ""}
Pets: {pets_lines}
Serviços: {" | ".join(svc_lines) if svc_lines else "nenhum"}
Horários: {hours_lines}

Estado atual: {estado_str}
Regra do pet: {pet_instruction}

TOM:
- WhatsApp: informal, caloroso, máximo 2 linhas por mensagem
- No máximo 1 emoji por mensagem, nunca no final da frase
- Execute tools e responda direto — nunca anuncie que vai buscar algo

━━━ FLUXO DE AGENDAMENTO ━━━

1. SERVIÇO
   Se o serviço ainda não está definido, chame get_services silenciosamente.
   Se o que o cliente pediu não existe, apresente as alternativas reais disponíveis.
   Se existir, confirme e siga.

2. PET
   Siga a regra do pet acima.
   Se o pet tem porte definido, use-o para mostrar o preço correto do serviço.

3. DATA E HORÁRIO
   Quando o cliente mencionar qualquer data ou dia, converta para YYYY-MM-DD e chame get_available_times imediatamente.
   "dia X" sempre significa dia do mês — nunca interprete como hora.
   Apresente até 3 opções de horário disponíveis retornadas pela tool.
   Se a data estiver em closed_days → informe que está fechado e sugira outra opção.
   Se a data estiver em full_days → informe que está lotado e sugira outra opção.
   Nunca ofereça horários que não estejam em available_times.

4. CONFIRMAÇÃO
   Com serviço, pet, data e horário definidos, apresente um resumo claro para o cliente confirmar.
   O resumo deve conter: pet, serviço, dia, horário e valor.
   Aguarde uma resposta afirmativa do cliente antes de criar o agendamento.
   Após confirmação, chame create_appointment com confirmed=True usando exatamente os dados do resumo.
   Nunca altere nenhum dado após o cliente confirmar.

5. PÓS-AGENDAMENTO
   Confirme o agendamento de forma natural e pergunte se o cliente quer agendar mais algum serviço.

━━━ SE AWAITING_CONFIRMATION = TRUE ━━━
O resumo já foi enviado. Se o cliente confirmar → crie o agendamento com os dados exatos do resumo anterior.
Se o cliente quiser corrigir algo → ajuste apenas o que foi solicitado, sem recomeçar do zero."""
