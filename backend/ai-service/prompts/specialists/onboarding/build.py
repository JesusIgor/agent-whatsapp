from agents.router_tool_plan import router_says_conversation_only
from prompts.specialists.onboarding.completed import (
    build_onboarding_prompt_completed,
)
from prompts.specialists.onboarding.registration import (
    build_onboarding_registration_prompt,
)
from prompts.specialists.onboarding.welcome import (
    build_onboarding_welcome_minimal,
)


def build_onboarding_prompt(context: dict, router_ctx: dict) -> str:
    stage = router_ctx.get("stage", "WELCOME")
    if stage == "COMPLETED":
        return build_onboarding_prompt_completed(context, router_ctx)

    if stage == "WELCOME" and router_says_conversation_only(router_ctx):
        return build_onboarding_welcome_minimal(context, router_ctx)

    return build_onboarding_registration_prompt(context, router_ctx)

