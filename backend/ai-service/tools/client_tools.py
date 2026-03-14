from db import get_connection


def get_client_pets(company_id: int, client_id: str) -> dict:
    """
    Retorna todos os pets ativos do cliente.
    Usar SEMPRE antes de cadastrar para evitar duplicatas.
    """
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, name, species, breed, size, weight_kg, gender
            FROM petshop_pets
            WHERE company_id = %s AND client_id = %s AND is_active = TRUE
            ORDER BY name
        """,
            (company_id, client_id),
        )
        pets = cur.fetchall()
    return {"pets": [dict(p) for p in pets], "count": len(pets)}


def create_pet(
    company_id: int,
    client_id: str,
    name: str,
    species: str,
    breed: str,
    size: str,
) -> dict:
    """
    Cadastra um novo pet. Valida TODOS os campos obrigatórios antes de inserir.
    Retorna erro detalhado se faltar qualquer campo.
    """
    # Validação rigorosa — a tool bloqueia antes do banco
    missing = []
    if not name:
        missing.append("nome")
    if not species:
        missing.append("espécie (cachorro ou gato)")
    if not breed:
        missing.append("raça (ou SRD se não souber)")
    if not size:
        missing.append("porte (pequeno, médio ou grande)")

    if missing:
        return {
            "success": False,
            "missing_fields": missing,
            "message": f"Faltam dados obrigatórios: {', '.join(missing)}. Não é possível cadastrar sem eles.",
        }

    # Normaliza valores
    species_norm = species.lower().strip()
    size_norm = size.lower().strip()

    if species_norm not in ("cachorro", "gato"):
        return {
            "success": False,
            "message": "Espécie inválida. Use 'cachorro' ou 'gato'.",
        }

    size_map = {
        "pequeno": "small",
        "médio": "medium",
        "medio": "medium",
        "grande": "large",
        "small": "small",
        "medium": "medium",
        "large": "large",
    }
    size_db = size_map.get(size_norm)
    if not size_db:
        return {
            "success": False,
            "message": "Porte inválido. Use 'pequeno', 'médio' ou 'grande'.",
        }

    with get_connection() as conn:
        cur = conn.cursor()

        # Verifica duplicata
        cur.execute(
            """
            SELECT id FROM petshop_pets
            WHERE company_id = %s AND client_id = %s
              AND LOWER(name) = LOWER(%s) AND is_active = TRUE
        """,
            (company_id, client_id, name),
        )
        if cur.fetchone():
            return {
                "success": False,
                "message": f"Já existe um pet chamado {name} cadastrado.",
            }

        cur.execute(
            """
            INSERT INTO petshop_pets (company_id, client_id, name, species, breed, size)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """,
            (company_id, client_id, name, species_norm, breed, size_db),
        )

        pet_id = cur.fetchone()["id"]

    return {
        "success": True,
        "pet_id": str(pet_id),
        "message": f"{name} cadastrado com sucesso!",
    }


def get_client(company_id: int, phone: str) -> dict:
    """Retorna dados do cliente pelo telefone."""
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, name, phone, email, conversation_stage, kanban_column, ai_paused
            FROM clients
            WHERE company_id = %s AND phone = %s
        """,
            (company_id, phone),
        )
        client = cur.fetchone()
    return dict(client) if client else {}


def get_upcoming_appointments(company_id: int, client_id: str) -> list:
    """Retorna os próximos agendamentos confirmados do cliente."""
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                a.id,
                a.scheduled_date,
                a.status,
                sch.start_time,
                svc.name AS service_name,
                p.name   AS pet_name
            FROM petshop_appointments a
            JOIN petshop_schedules sch ON sch.id = a.schedule_id
            JOIN petshop_services  svc ON svc.id = a.service_id
            JOIN petshop_pets      p   ON p.id   = a.pet_id
            WHERE a.company_id = %s
              AND a.client_id  = %s
              AND a.status IN ('pending', 'confirmed')
              AND a.scheduled_date >= CURRENT_DATE
            ORDER BY a.scheduled_date, sch.start_time
        """,
            (company_id, client_id),
        )
        rows = cur.fetchall()
    return [dict(r) for r in rows]
