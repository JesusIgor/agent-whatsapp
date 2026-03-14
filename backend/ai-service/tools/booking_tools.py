from datetime import date, datetime, timedelta
from db import get_connection


def get_services(company_id: int) -> dict:
    """
    Retorna lista de serviços ativos do petshop.
    Chamar EM SILÊNCIO para validar serviço antes de pedir dados do pet.
    """
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, name, description, duration_min, price, price_by_size, duration_multiplier_large
            FROM petshop_services
            WHERE company_id = %s AND is_active = TRUE
            ORDER BY name
        """,
            (company_id,),
        )
        services = cur.fetchall()

    return {
        "services": [dict(s) for s in services],
        "count": len(services),
    }


def get_available_times(company_id: int, target_date: str) -> dict:
    """
    Retorna horários disponíveis para uma data específica.
    Chamar SEMPRE que cliente mencionar uma data — nunca inventar horários.

    Args:
        company_id: ID da company
        target_date: Data no formato YYYY-MM-DD

    Returns:
        dict com available_times, closed_days, full_days
    """
    try:
        parsed_date = date.fromisoformat(target_date)
    except ValueError:
        return {
            "available": False,
            "message": "Data inválida. Use o formato YYYY-MM-DD.",
        }

    # Não agendar no passado nem além de 60 dias
    today = date.today()
    if parsed_date < today:
        return {
            "available": False,
            "message": "Não é possível agendar em datas passadas.",
        }
    if parsed_date > today + timedelta(days=60):
        return {
            "available": False,
            "message": "Só é possível agendar com até 60 dias de antecedência.",
            "beyond_limit": True,
        }

    # 0=Dom, 1=Seg ... 6=Sab (padrão Postgres)
    weekday = parsed_date.isoweekday() % 7

    with get_connection() as conn:
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                sch.id,
                sch.start_time,
                sch.end_time,
                sch.capacity,
                COUNT(a.id) AS booked
            FROM petshop_schedules sch
            LEFT JOIN petshop_appointments a
                ON a.schedule_id = sch.id
                AND a.scheduled_date = %s
                AND a.status NOT IN ('cancelled', 'no_show')
            WHERE sch.company_id = %s
              AND sch.weekday = %s
              AND sch.is_active = TRUE
            GROUP BY sch.id, sch.start_time, sch.end_time, sch.capacity
            ORDER BY sch.start_time
        """,
            (target_date, company_id, weekday),
        )

        all_slots = cur.fetchall()

    if not all_slots:
        return {
            "available": False,
            "closed_days": [target_date],
            "full_days": [],
            "available_times": [],
            "message": "Petshop fechado neste dia.",
        }

    available_slots = []
    full = True

    now = datetime.now()

    for s in all_slots:
        vacancies = s["capacity"] - s["booked"]
        slot_dt = datetime.combine(parsed_date, s["start_time"])

        # Só mostrar horários com 2h+ de antecedência
        if slot_dt <= now + timedelta(hours=2):
            continue

        if vacancies > 0:
            full = False
            available_slots.append(
                {
                    "schedule_id": s["id"],
                    "start_time": str(s["start_time"])[:5],
                    "end_time": str(s["end_time"])[:5],
                    "vacancies": vacancies,
                    "booking_date": target_date,
                }
            )

    if full:
        return {
            "available": False,
            "closed_days": [],
            "full_days": [target_date],
            "available_times": [],
            "message": "Sem vagas disponíveis neste dia.",
        }

    return {
        "available": True,
        "date": target_date,
        "closed_days": [],
        "full_days": [],
        "available_times": available_slots,
    }


def create_appointment(
    company_id: int,
    client_id: str,
    pet_id: str,
    service_id: int,
    schedule_id: int,
    scheduled_date: str,
    confirmed: bool = False,
    notes: str = None,
) -> dict:
    """
    Cria um agendamento. Exige confirmed=True — a tool bloqueia sem confirmação explícita.
    """
    if not confirmed:
        return {
            "success": False,
            "message": "Aguardando confirmação explícita do cliente antes de criar o agendamento.",
        }

    with get_connection() as conn:
        cur = conn.cursor()

        # Verifica vaga ainda disponível
        cur.execute(
            """
            SELECT sch.capacity - COUNT(a.id) AS vacancies
            FROM petshop_schedules sch
            LEFT JOIN petshop_appointments a
                ON a.schedule_id = sch.id
                AND a.scheduled_date = %s
                AND a.status NOT IN ('cancelled', 'no_show')
            WHERE sch.id = %s AND sch.company_id = %s
            GROUP BY sch.capacity
        """,
            (scheduled_date, schedule_id, company_id),
        )

        row = cur.fetchone()
        if not row or row["vacancies"] <= 0:
            return {
                "success": False,
                "message": "Horário não disponível. Por favor, escolha outro.",
            }

        # Busca preço do serviço
        cur.execute("SELECT price FROM petshop_services WHERE id = %s", (service_id,))
        service = cur.fetchone()
        price_charged = service["price"] if service else None

        cur.execute(
            """
            INSERT INTO petshop_appointments
                (company_id, client_id, pet_id, service_id, schedule_id,
                 scheduled_date, status, notes, price_charged)
            VALUES (%s, %s, %s, %s, %s, %s, 'confirmed', %s, %s)
            RETURNING id
        """,
            (
                company_id,
                client_id,
                pet_id,
                service_id,
                schedule_id,
                scheduled_date,
                notes,
                price_charged,
            ),
        )

        appointment_id = cur.fetchone()["id"]

    return {
        "success": True,
        "appointment_id": str(appointment_id),
        "message": "Agendamento confirmado com sucesso! 🐾",
    }


def cancel_appointment(
    company_id: int, appointment_id: str, reason: str = None
) -> dict:
    """Cancela um agendamento existente."""
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE petshop_appointments
            SET status = 'cancelled', cancelled_at = NOW(), cancel_reason = %s
            WHERE id = %s AND company_id = %s
              AND status NOT IN ('completed', 'cancelled')
            RETURNING id
        """,
            (reason, appointment_id, company_id),
        )
        updated = cur.fetchone()

    if not updated:
        return {
            "success": False,
            "message": "Agendamento não encontrado ou já finalizado.",
        }
    return {"success": True, "message": "Agendamento cancelado com sucesso."}
