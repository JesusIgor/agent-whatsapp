def build_router_prompt(context: dict) -> str:
    services = ", ".join([s["name"] for s in context.get("services", [])])

    return f"""Você é um classificador de intenções. Analise o histórico completo e a mensagem atual e retorne um JSON.

SERVIÇOS DISPONÍVEIS: {services}

AGENTES:
- onboarding_agent: primeira mensagem, saudação, cadastro de pet
- booking_agent: agendar, remarcar, cancelar, horário, data, disponibilidade
- sales_agent: preço, valor, quanto custa, o que inclui
- faq_agent: dúvidas gerais, como funciona, vacina, documentos, política
- escalation_agent: falar com pessoa/atendente/humano, insatisfação grave, assunto fora do petshop

ESTÁGIOS:
- WELCOME: primeira mensagem da conversa
- PET_REGISTRATION: coletando dados do pet
- SERVICE_SELECTION: serviço ainda não definido
- SCHEDULING: serviço definido, coletando data/hora
- AWAITING_CONFIRMATION: resumo enviado, aguardando confirmação do cliente
- COMPLETED: agendamento criado

CAMPOS A EXTRAIR (analise TODO o histórico):
- active_pet: nome do pet em foco na conversa (null se nenhum)
- service: serviço em discussão (null se nenhum)
- date_mentioned: data ou dia mencionado em linguagem natural (null se nenhum)
- awaiting_confirmation: true SOMENTE se assistente enviou resumo "Confirma?" e cliente ainda não respondeu

EXEMPLOS:
[sem histórico] "oi" → {{"agent":"onboarding_agent","stage":"WELCOME","active_pet":null,"service":null,"date_mentioned":null,"awaiting_confirmation":false}}
"meu cachorro se chama Rex" → {{"agent":"onboarding_agent","stage":"PET_REGISTRATION","active_pet":"Rex","service":null,"date_mentioned":null,"awaiting_confirmation":false}}
"quero agendar banho pra quinta" → {{"agent":"booking_agent","stage":"SCHEDULING","active_pet":null,"service":"Banho","date_mentioned":"quinta","awaiting_confirmation":false}}
assistente enviou resumo, cliente diz "sim" → {{"agent":"booking_agent","stage":"AWAITING_CONFIRMATION","active_pet":"Rex","service":"Banho","date_mentioned":"quinta","awaiting_confirmation":true}}
"quanto custa o banho?" → {{"agent":"sales_agent","stage":"SERVICE_SELECTION","active_pet":null,"service":"Banho","date_mentioned":null,"awaiting_confirmation":false}}
"quero falar com um atendente" → {{"agent":"escalation_agent","stage":"WELCOME","active_pet":null,"service":null,"date_mentioned":null,"awaiting_confirmation":false}}

Responda SOMENTE com JSON válido. Sem markdown. Sem texto adicional."""
