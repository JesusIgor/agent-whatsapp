from agents.router_tool_plan import router_wants_category
from prompts.shared.service_cadastro import (
    DEFAULT_MAX_CADASTRO_DESCRIPTION_CHARS,
    build_lodging_room_types_cadastro_block,
    build_petshop_services_cadastro_block,
)


def pet_state_line(pets: list) -> str:
    if not pets:
        return "Nenhum pet cadastrado ainda."
    if len(pets) == 1:
        p = pets[0]
        return (
            f"1 pet cadastrado: {p['name']} ({p.get('species', '?')}, {p.get('breed', '?')}, "
            f"porte {p.get('size', '?')})."
        )
    detail = " | ".join(
        f"{p['name']} ({p.get('species', '?')}, porte {p.get('size', '?')})" for p in pets
    )
    return f"{len(pets)} pets cadastrados: {detail}."


def build_catalog_context(context: dict, router_ctx: dict) -> tuple[str, str, str]:
    rt = router_ctx.get("required_tools")
    inc_svc = rt is None or router_wants_category(router_ctx, "services")
    inc_lodg = rt is None or router_wants_category(router_ctx, "lodging")
    cadastro_servicos = (
        build_petshop_services_cadastro_block(
            context.get("services"),
            max_description_chars=DEFAULT_MAX_CADASTRO_DESCRIPTION_CHARS,
        )
        if inc_svc
        else ""
    )
    cadastro_lodging = (
        build_lodging_room_types_cadastro_block(
            context.get("lodging_room_types"),
            max_description_chars=DEFAULT_MAX_CADASTRO_DESCRIPTION_CHARS,
        )
        if inc_lodg
        else ""
    )
    cadastro_note = ""
    if not inc_svc and not inc_lodg:
        cadastro_note = (
            "\n(Catálogo de serviços/hospedagem omitido neste turno — não invente nomes de serviços; "
            "se o cliente pedir lista ou preço, diga que confirma na sequência.)\n"
        )
    elif not inc_svc:
        cadastro_note = (
            "\n(Sem bloco de serviços de banho/tosa neste turno — não invente pacotes.)\n"
        )
    elif not inc_lodg:
        cadastro_note = "\n(Sem bloco de hospedagem/creche neste turno.)\n"
    return cadastro_servicos, cadastro_lodging, cadastro_note

