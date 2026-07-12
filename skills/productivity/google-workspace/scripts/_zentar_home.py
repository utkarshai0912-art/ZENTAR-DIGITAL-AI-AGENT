"""Resolve ZENTAR_HOME for standalone skill scripts.

Skill scripts may run outside the Zentar process (e.g. system Python,
nix env, CI) where ``zentar_constants`` is not importable.  This module
provides the same ``get_zentar_home()`` and ``display_zentar_home()``
contracts as ``zentar_constants`` without requiring it on ``sys.path``.

When ``zentar_constants`` IS available it is used directly so that any
future enhancements (profile resolution, Docker detection, etc.) are
picked up automatically.  The fallback path replicates the core logic
from ``zentar_constants.py`` using only the stdlib.

All scripts under ``google-workspace/scripts/`` should import from here
instead of duplicating the ``ZENTAR_HOME = Path(os.getenv(...))`` pattern.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from zentar_constants import display_zentar_home as display_zentar_home
    from zentar_constants import get_zentar_home as get_zentar_home
except (ModuleNotFoundError, ImportError):

    def get_zentar_home() -> Path:
        """Return the Zentar home directory (default: ~/.zentar).

        Mirrors ``zentar_constants.get_zentar_home()``."""
        val = os.environ.get("ZENTAR_HOME", "").strip()
        return Path(val) if val else Path.home() / ".zentar"

    def display_zentar_home() -> str:
        """Return a user-friendly ``~/``-shortened display string.

        Mirrors ``zentar_constants.display_zentar_home()``."""
        home = get_zentar_home()
        try:
            return "~/" + str(home.relative_to(Path.home()))
        except ValueError:
            return str(home)
