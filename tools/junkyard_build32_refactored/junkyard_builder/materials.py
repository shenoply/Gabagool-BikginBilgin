"""Material creation helpers for the junkyard scene."""

from typing import Literal

import bpy
import numpy as np

from junkyard_builder.scene_types import BaseMaterials, ColorRGB, PropMaterials


TextureKind = Literal["wood", "soil"]


def create_material(
    name: str,
    color: ColorRGB,
    texture: TextureKind | None = None,
    emission_strength: float = 0.0,
) -> bpy.types.Material:
    """Create a Principled BSDF material with an optional procedural texture.

    The texture is generated deterministically so repeated builds use the same
    painted/noisy appearance as the original script.
    """
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True

    principled = material.node_tree.nodes.get("Principled BSDF")
    if principled is None:
        raise RuntimeError(
            f"Material {name!r} has no Principled BSDF node."
        )

    principled.inputs["Base Color"].default_value = (*color, 1.0)
    principled.inputs["Roughness"].default_value = 0.88

    if emission_strength:
        principled.inputs["Emission Color"].default_value = (*color, 1.0)
        principled.inputs["Emission Strength"].default_value = emission_strength

    if texture is not None:
        _attach_generated_texture(material, principled, name, color, texture)

    return material


def _attach_generated_texture(
    material: bpy.types.Material,
    principled: bpy.types.Node,
    name: str,
    color: ColorRGB,
    texture: TextureKind,
) -> None:
    """Generate and connect the deterministic 128×128 texture used originally."""
    rng = np.random.default_rng(4)
    noise = rng.random((128, 128))
    yy, xx = np.mgrid[:128, :128]

    if texture == "wood":
        values = (
            0.86
            + 0.035 * noise
            + 0.07 * np.sin(xx * 0.3 + np.sin(yy * 0.06))
        )
    else:
        values = (
            0.82
            + 0.12 * np.sin(xx * 0.065 + np.sin(yy * 0.054) * 2)
            + 0.025 * noise
        )

    pixel_data = np.ones((128, 128, 4), dtype=np.float32)
    pixel_data[:, :, :3] = (
        values[:, :, None] * np.array(color)[None, None, :]
    )

    image = bpy.data.images.new(f"{name} painted texture", 128, 128)
    image.pixels.foreach_set(pixel_data.ravel())
    image.pack()

    texture_node = material.node_tree.nodes.new("ShaderNodeTexImage")
    texture_node.image = image
    material.node_tree.links.new(
        texture_node.outputs["Color"],
        principled.inputs["Base Color"],
    )


def create_base_materials() -> BaseMaterials:
    """Create materials needed before the environment is assembled."""
    return BaseMaterials(
        wood=create_material(
            "Weathered timber",
            (0.60, 0.39, 0.18),
            "wood",
        ),
        teal=create_material(
            "Peeling teal fence",
            (0.22, 0.52, 0.43),
            "wood",
        ),
        soil=create_material(
            "Mottled yard dirt",
            (0.48, 0.48, 0.31),
            "soil",
        ),
        stone=create_material(
            "Worn paving",
            (0.52, 0.53, 0.43),
            "soil",
        ),
        blue=create_material(
            "Blue galvanized steel",
            (0.25, 0.49, 0.62),
            "wood",
        ),
        rust=create_material(
            "Rusty drums",
            (0.61, 0.26, 0.10),
            "soil",
        ),
        rubber=create_material(
            "Old rubber",
            (0.035, 0.044, 0.038),
        ),
        roof=create_material(
            "Slate blue roofing",
            (0.15, 0.25, 0.29),
            "wood",
        ),
        glass=create_material(
            "Warm window glass",
            (0.95, 0.54, 0.15),
            emission_strength=0.7,
        ),
        dark=create_material(
            "Dark iron",
            (0.065, 0.075, 0.060),
        ),
        brick=create_material(
            "Broken brick",
            (0.39, 0.20, 0.10),
            "soil",
        ),
    )


def create_prop_materials() -> PropMaterials:
    """Create the additional materials used by the detailed salvage props."""
    return PropMaterials(
        cream=create_material(
            "Cream enamel",
            (0.76, 0.73, 0.56),
        ),
        red=create_material(
            "Cartoon coral",
            (0.68, 0.22, 0.13),
        ),
        green=create_material(
            "Bottle green",
            (0.13, 0.40, 0.25),
        ),
        cable=create_material(
            "Cable ink",
            (0.055, 0.075, 0.075),
        ),
    )
