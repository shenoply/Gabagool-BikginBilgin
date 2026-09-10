"""Post-processing, export, and render configuration for the junkyard scene."""

import json
from pathlib import Path

import bpy
from mathutils import Vector

from junkyard_builder.geometry import to_blender_coords
from junkyard_builder.scene_types import SceneState


_BEVELED_PREFIXES = (
    "Abandoned fridge",
    "Washing machine",
    "Old cupboard",
    "Crate core",
    "Chair seat",
    "Fridge door",
)


def bevel_large_props(state: SceneState) -> None:
    """Apply a small two-segment bevel to selected large solid props."""
    for obj in state.objects:
        if obj.type != "MESH":
            continue
        if not obj.name.startswith(_BEVELED_PREFIXES):
            continue

        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.transform_apply(
            location=False,
            rotation=False,
            scale=True,
        )

        modifier = obj.modifiers.new(
            "Soft cartoon edges",
            "BEVEL",
        )
        modifier.width = 0.055
        modifier.segments = 2
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        obj.select_set(False)


def merge_meshes_by_material() -> None:
    """Join meshes sharing a first material to reduce static draw-call count."""
    for material in list(bpy.data.materials):
        group = [
            obj
            for obj in list(bpy.data.objects)
            if (
                obj.type == "MESH"
                and len(obj.data.materials)
                and obj.data.materials[0] == material
            )
        ]

        if not group:
            continue

        bpy.ops.object.select_all(action="DESELECT")
        for obj in group:
            obj.select_set(True)

        bpy.context.view_layer.objects.active = group[0]
        bpy.ops.object.join()
        group[0].name = material.name


def export_assets(
    state: SceneState,
    output_dir: Path,
) -> None:
    """Export the GLB and JSON collision data into the requested directory."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=str(output_dir / "junkyard.glb"),
        export_format="GLB",
        export_yup=True,
        export_animations=False,
    )

    collision_payload = {
        "obstacles": state.obstacles,
        "platforms": state.platforms,
    }
    (output_dir / "map-collision.json").write_text(
        json.dumps(collision_payload)
    )


def render_preview(output_dir: Path) -> None:
    """Configure Cycles, save the Blend file, and render the preview image."""
    world = bpy.context.scene.world
    world.use_nodes = True

    background = world.node_tree.nodes["Background"]
    background.inputs[0].default_value = (0.075, 0.12, 0.13, 1)
    background.inputs[1].default_value = 0.7

    bpy.ops.object.light_add(
        type="AREA",
        location=(0, -5, 45),
    )
    area_light = bpy.context.object
    area_light.data.energy = 25000
    area_light.data.size = 35

    bpy.ops.object.camera_add(
        location=to_blender_coords(65, 60, 78)
    )
    camera = bpy.context.object
    camera.rotation_euler = (
        Vector(to_blender_coords(5, 0, 12)) - camera.location
    ).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 83

    scene = bpy.context.scene
    scene.camera = camera
    scene.render.engine = "CYCLES"
    scene.view_settings.exposure = 0.5
    scene.cycles.samples = 12
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.filepath = str(output_dir / "Junkyard-preview.png")

    bpy.ops.wm.save_as_mainfile(
        filepath=str(output_dir / "Junkyard.blend")
    )
    bpy.ops.render.render(write_still=True)
