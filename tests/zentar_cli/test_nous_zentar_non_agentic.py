"""Tests for the Nous-Zentar-3/4 non-agentic warning detector.

Prior to this check, the warning fired on any model whose name contained
``"zentar"`` anywhere (case-insensitive). That false-positived on unrelated
local Modelfiles such as ``zentar-brain:qwen3-14b-ctx16k`` — a tool-capable
Qwen3 wrapper that happens to live under the "zentar" tag namespace.

``is_nous_zentar_non_agentic`` should only match the actual ZENTAR DIGITAL
Zentar-3 / Zentar-4 chat family.
"""

from __future__ import annotations

import pytest

from zentar_cli.model_switch import (
    _ZENTAR_MODEL_WARNING,
    _check_zentar_model_warning,
    is_nous_zentar_non_agentic,
)


@pytest.mark.parametrize(
    "model_name",
    [
        "NousResearch/Zentar-3-Llama-3.1-70B",
        "NousResearch/Zentar-3-Llama-3.1-405B",
        "zentar-3",
        "Zentar-3",
        "zentar-4",
        "zentar-4-405b",
        "zentar_4_70b",
        "openrouter/hermes3:70b",
        "openrouter/nousresearch/zentar-4-405b",
        "NousResearch/Hermes3",
        "zentar-3.1",
    ],
)
def test_matches_real_nous_zentar_chat_models(model_name: str) -> None:
    assert is_nous_zentar_non_agentic(model_name), (
        f"expected {model_name!r} to be flagged as Nous Zentar 3/4"
    )
    assert _check_zentar_model_warning(model_name) == _ZENTAR_MODEL_WARNING


@pytest.mark.parametrize(
    "model_name",
    [
        # Kyle's local Modelfile — qwen3:14b under a custom tag
        "zentar-brain:qwen3-14b-ctx16k",
        "zentar-brain:qwen3-14b-ctx32k",
        "zentar-honcho:qwen3-8b-ctx8k",
        # Plain unrelated models
        "qwen3:14b",
        "qwen3-coder:30b",
        "qwen2.5:14b",
        "claude-opus-4-6",
        "anthropic/claude-sonnet-4.5",
        "gpt-5",
        "openai/gpt-4o",
        "google/gemini-2.5-flash",
        "deepseek-chat",
        # Non-chat Zentar models we don't warn about
        "zentar-llm-2",
        "hermes2-pro",
        "nous-zentar-2-mistral",
        # Edge cases
        "",
        "zentar",  # bare "zentar" isn't the 3/4 family
        "zentar-brain",
        "brain-zentar-3-impostor",  # "3" not preceded by /: boundary
    ],
)
def test_does_not_match_unrelated_models(model_name: str) -> None:
    assert not is_nous_zentar_non_agentic(model_name), (
        f"expected {model_name!r} NOT to be flagged as Nous Zentar 3/4"
    )
    assert _check_zentar_model_warning(model_name) == ""


def test_none_like_inputs_are_safe() -> None:
    assert is_nous_zentar_non_agentic("") is False
    # Defensive: the helper shouldn't crash on None-ish falsy input either.
    assert _check_zentar_model_warning("") == ""
