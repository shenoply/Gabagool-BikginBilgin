"""High-level orchestration for building the complete junkyard scene."""

import random
from pathlib import Path

import bpy

from junkyard_builder.environment import build_environment
from junkyard_builder.materials import (
    create_base_materials,
    create_prop_materials,
)
from junkyard_builder.output import (
    bevel_large_props,
    export_assets,
    merge_meshes_by_material,
    render_preview,
)
from junkyard_builder.props import build_salvage_props
from junkyard_builder.scene_types import SceneState


RANDOM_SEED = 22


def reset_scene() -> None:
    """Delete all objects from the current Blender scene."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def build_junkyard(output_dir: Path) -> None:
    """Build, optimize, export, save, and render the complete junkyard scene.

    Args:
        output_dir:
            Directory receiving ``junkyard.glb``, ``map-collision.json``,
            ``Junkyard.blend``, and ``Junkyard-preview.png``.
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    rng = random.Random(RANDOM_SEED)
    state = SceneState()

    reset_scene()

    base_materials = create_base_materials()
    build_environment(state, base_materials, rng)

    prop_materials = create_prop_materials()
    build_salvage_props(
        state,
        base_materials,
        prop_materials,
        rng,
    )

    bevel_large_props(state)
    merge_meshes_by_material()
    export_assets(state, output_dir)
    render_preview(output_dir)
