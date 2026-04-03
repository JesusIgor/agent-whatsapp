"""One-off / regen: syncs compat wrapper to the new prompts/router/segments.py source."""
from pathlib import Path

HERE = Path(__file__).resolve().parent


def main() -> None:
    out = HERE / "router_prompt_segments.py"
    out.write_text(
        "from prompts.router.segments import (  # noqa: F401\n"
        "    ROUTER_CONTEXT_TEMPLATE,\n"
        "    ROUTER_STATIC_A,\n"
        "    ROUTER_STATIC_B_TEMPLATE,\n"
        ")\n\n"
        "__all__ = [\n"
        '    "ROUTER_STATIC_A",\n'
        '    "ROUTER_CONTEXT_TEMPLATE",\n'
        '    "ROUTER_STATIC_B_TEMPLATE",\n'
        "]\n",
        encoding="utf-8",
    )
    print("Wrote compat wrapper", out)


if __name__ == "__main__":
    main()
