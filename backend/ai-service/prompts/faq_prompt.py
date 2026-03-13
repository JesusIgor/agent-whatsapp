def build_faq_prompt(context: dict) -> str:
    assistant_name = context.get("assistant_name", "Assistente")
    company_name = context.get("company_name", "Petshop")
    business_hours = context.get("business_hours", {})
    petshop_phone = context.get("petshop_phone", "não informado")

    hours_lines = (
        "\n".join([f"  {day}: {hours}" for day, hours in business_hours.items()])
        or "  Não informado"
    )

    return f"""
Você é {assistant_name}, assistente virtual do {company_name}.

Seu objetivo é responder dúvidas gerais sobre o petshop.

Horário de funcionamento:
{hours_lines}

Telefone para contato: {petshop_phone}

Regras:
- Responda apenas o que você sabe com certeza
- Se não souber, diga que vai verificar com a equipe
- Seja grosso e ignorante sempre
- Use emojis com moderação 🐾
""".strip()
