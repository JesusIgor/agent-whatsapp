from datetime import date
from db import get_connection


def check_availability(company_id: int, target_date: str) -> dict:
    """Verifica slots disponíveis para uma data específica."""
    parsed_date = date.fromisoformat(target_date)
    weekday = parsed_date.isoweekday() % 7  # 0=Dom, 1=Seg ... 6=Sab

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
            HAVING sch.capacity > COUNT(a.id)
            ORDER BY sch.start_time
        """,
            (target_date, company_id, weekday),
        )

        slots = cur.fetchall()

    if not slots:
        return {
            "available": False,
            "slots": [],
            "message": "Sem horários disponíveis nesta data.",
        }

    return {
        "available": True,
        "date": target_date,
        "slots": [
            {
                "schedule_id": s["id"],
                "start_time": str(s["start_time"]),
                "end_time": str(s["end_time"]),
                "vacancies": s["capacity"] - s["booked"],
            }
            for s in slots
        ],
    }


def create_appointment(
    company_id: int,
    client_id: str,
    pet_id: str,
    service_id: int,
    schedule_id: int,
    scheduled_date: str,
    notes: str = None,
) -> dict:
    """Cria um agendamento no banco."""
    with get_connection() as conn:
        cur = conn.cursor()

        # Verifica vaga
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

        # Preço do serviço
        cur.execute("SELECT price FROM petshop_services WHERE id = %s", (service_id,))
        service = cur.fetchone()
        price_charged = service["price"] if service else None

        cur.execute(
            """
            INSERT INTO petshop_appointments
                (company_id, client_id, pet_id, service_id, schedule_id, scheduled_date, status, notes, price_charged)
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
