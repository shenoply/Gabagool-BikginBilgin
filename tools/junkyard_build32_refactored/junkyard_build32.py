"""Launcher for the refactored junkyard Blender scene generator."""

from pathlib import Path

from junkyard_builder.main import build_junkyard


def default_output_dir() -> Path:
    """Return the output directory used by the original monolithic script."""
    return (
        Path(__file__).resolve().parents[2]
        / "generated"
        / "junkyard-build32"
    )


if __name__ == "__main__":
    build_junkyard(default_output_dir())
