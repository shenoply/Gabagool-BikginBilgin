"""Construction of the junkyard environment and repeated salvage clusters."""

import math
import random

import bpy

from junkyard_builder.geometry import (
    add_obstacle,
    collision_volume,
    create_box,
    create_cylinder,
    to_blender_coords,
)
from junkyard_builder.scene_types import BaseMaterials, SceneState


def build_environment(
    state: SceneState,
    materials: BaseMaterials,
    rng: random.Random,
) -> None:
    """Build the fence, shed, path, platforms, salvage piles, and ground clutter."""
    _build_foundation_and_fence(state, materials, rng)
    _build_shed_and_path(state, materials)
    _build_platforms_and_salvage(state, materials)
    _build_scrap_bay_and_clutter(state, materials, rng)


def _build_foundation_and_fence(
    state: SceneState,
    materials: BaseMaterials,
    rng: random.Random,
) -> None:
    """Build the ground foundation and perimeter fence with two gate openings."""
    create_box(
        state,
        "Foundation",
        5,
        -0.2,
        12,
        54,
        0.4,
        54,
        materials.soil,
    )

    for side in ("back", "front", "left", "right"):
        length = 54 if side in ("back", "front") else 42
        board_count = round(length / 0.44)

        for index in range(board_count):
            offset = (
                -length / 2
                + (index + 0.5) * length / board_count
            )

            if side in ("back", "front"):
                x = 5 + offset
                z = -15 if side == "back" else 27
            else:
                x = -22 if side == "left" else 32
                z = 6 + offset

            is_front_gate = side == "front" and abs(x - 1) < 2.6
            is_right_gate = side == "right" and abs(z - 19) < 2.3
            if is_front_gate or is_right_gate:
                continue

            height = 3.1 + rng.uniform(-0.18, 0.18)
            paling = create_box(
                state,
                "Fence paling",
                x,
                height / 2,
                z,
                0.40,
                height,
                0.12,
                materials.teal,
            )

            if side in ("left", "right"):
                paling.rotation_euler.z = math.pi / 2

        for rail_height in (0.75, 2.3):
            spans = _fence_rail_spans(side)
            for start, end in spans:
                if side in ("back", "front"):
                    create_box(
                        state,
                        "Fence rail",
                        5 + (start + end) / 2,
                        rail_height,
                        -14.85 if side == "back" else 26.85,
                        end - start,
                        0.15,
                        0.16,
                        materials.wood,
                    )
                else:
                    create_box(
                        state,
                        "Fence rail",
                        -21.85 if side == "left" else 31.85,
                        rail_height,
                        6 + (start + end) / 2,
                        0.16,
                        0.15,
                        end - start,
                        materials.wood,
                    )


def _fence_rail_spans(side: str) -> list[tuple[float, float]]:
    """Return rail segments for a fence side while preserving gate openings."""
    if side == "back":
        return [(-27, 27)]
    if side == "front":
        return [(-27, -6.6), (-1.4, 27)]
    if side == "right":
        return [(-21, 10.7), (15.3, 21)]
    return [(-21, 21)]


def _build_shed_and_path(
    state: SceneState,
    materials: BaseMaterials,
) -> None:
    """Build the shed, shrink it into Pip's shelter, and connect it by a path."""
    home_start = len(state.objects)

    create_box(
        state,
        "Shed",
        22,
        2.45,
        -6,
        11,
        4.9,
        9,
        materials.wood,
    )
    add_obstacle(state, 22, -6, 5.5, 4.5, 8)

    for x in (16.5 + index * 0.42 for index in range(27)):
        create_box(
            state,
            "Shed siding",
            x,
            2.45,
            -1.46,
            0.36,
            4.9,
            0.065,
            materials.wood,
        )

    create_box(
        state,
        "Shed door",
        22,
        1.7,
        -1.38,
        2.5,
        3.4,
        0.12,
        materials.rust,
    )
    create_cylinder(
        state,
        "Porch light",
        22,
        3.85,
        -1.1,
        0.25,
        0.28,
        materials.glass,
    )

    for x in (18.6, 25.4):
        create_box(
            state,
            "Window frame",
            x,
            2.5,
            -1.30,
            1.95,
            1.75,
            0.15,
            materials.wood,
        )
        create_box(
            state,
            "Window glow",
            x,
            2.5,
            -1.20,
            1.6,
            1.4,
            0.04,
            materials.glass,
        )
        create_box(
            state,
            "Window mullion",
            x,
            2.5,
            -1.14,
            0.10,
            1.5,
            0.09,
            materials.wood,
        )
        create_box(
            state,
            "Window crossbar",
            x,
            2.5,
            -1.14,
            1.7,
            0.10,
            0.09,
            materials.wood,
        )

    _build_shed_roof(state, materials)

    for obj in state.objects[home_start:]:
        obj.location.x = 12 + (obj.location.x - 22) * 0.24
        obj.location.y = -33 + (obj.location.y - 6) * 0.24
        obj.location.z *= 0.24
        obj.scale *= 0.24

    state.obstacles[-1] = collision_volume(
        x=12,
        z=33,
        half_width=1.32,
        half_depth=1.08,
        height=2,
    )

    state.obstacles.extend(
        [
            collision_volume(-11.8, 27, 10.2, 0.10, 3.5),
            collision_volume(17.8, 27, 14.2, 0.10, 3.5),
        ]
    )

    for index in range(18):
        create_box(
            state,
            "Path to Pip home",
            1 + index * 0.60,
            0.025,
            28 + index * 0.34,
            0.65,
            0.05,
            0.7,
            materials.stone,
        )


def _build_shed_roof(
    state: SceneState,
    materials: BaseMaterials,
) -> None:
    """Build the two sloped roof faces and the visible gable ends."""
    vertices = [
        to_blender_coords(15.9, 4.9, -11),
        to_blender_coords(28.1, 4.9, -11),
        to_blender_coords(28.1, 6.75, -6),
        to_blender_coords(15.9, 6.75, -6),
        to_blender_coords(15.9, 4.9, -1),
        to_blender_coords(28.1, 4.9, -1),
    ]

    mesh = bpy.data.meshes.new("Roof")
    mesh.from_pydata(
        vertices,
        [],
        [(0, 1, 2, 3), (3, 2, 5, 4)],
    )

    roof = bpy.data.objects.new("Pitched roof", mesh)
    bpy.context.collection.objects.link(roof)
    roof.data.materials.append(materials.roof)
    state.objects.append(roof)

    for x in (15.9, 28.1):
        gable_mesh = bpy.data.meshes.new("Gable")
        gable_mesh.from_pydata(
            [
                to_blender_coords(x, 4.9, -11),
                to_blender_coords(x, 6.75, -6),
                to_blender_coords(x, 4.9, -1),
            ],
            [],
            [(0, 1, 2)],
        )

        gable = bpy.data.objects.new("Shed gable", gable_mesh)
        bpy.context.collection.objects.link(gable)
        gable.data.materials.append(materials.wood)
        state.objects.append(gable)


def _build_platforms_and_salvage(
    state: SceneState,
    materials: BaseMaterials,
) -> None:
    """Build wooden decks and the repeated crate, tyre, and barrel groups."""
    _create_deck(state, materials, -11, -9, 9, 4, 1.6)
    _create_deck(state, materials, -12, 2, 6, 4)
    _create_deck(state, materials, 7, 13, 6, 4)

    for x, z in (
        (-16, -11),
        (-12, -11),
        (-18, 7),
        (26, 22),
        (-17, 21),
        (10, -11),
    ):
        _create_crate(state, materials, x, z)
        _create_crate(state, materials, x + 0.18, z, 1.5, 1.8)
        _create_crate(state, materials, x + 2, z + 0.8, 1.4)

    for x, z in (
        (-19, -11),
        (-17, -12),
        (7, -12),
        (10, -12),
        (-19, 21),
        (28, 23),
        (25, 23),
    ):
        _create_tyre(state, materials, x, z)
        _create_tyre(state, materials, x, z, 0.45)
        _create_tyre(state, materials, x + 0.8, z + 0.3)

    for x, z, material in (
        (-18, 10, materials.blue),
        (-16, 18, materials.rust),
        (11, -10, materials.rust),
        (13, -9, materials.blue),
        (12, 14, materials.blue),
        (27, 20, materials.rust),
        (-8, 7, materials.blue),
        (-18, -5, materials.blue),
        (28, 1, materials.blue),
    ):
        _create_barrel(state, materials, x, z, material)


def _create_crate(
    state: SceneState,
    materials: BaseMaterials,
    x: float,
    z: float,
    size: float = 1.8,
    y: float = 0.0,
) -> None:
    """Create a timber crate and its collision volume when resting on the ground."""
    create_box(
        state,
        "Crate core",
        x,
        y + size / 2,
        z,
        size,
        size,
        size,
        materials.wood,
    )

    for index in range(5):
        offset = (index - 2) * size / 5
        create_box(
            state,
            "Crate boards",
            x + offset,
            y + size / 2,
            z + size / 2 + 0.02,
            size * 0.18,
            size,
            0.055,
            materials.wood,
        )

    for strap_y in (0.13, size - 0.13):
        create_box(
            state,
            "Crate straps",
            x,
            y + strap_y,
            z + size / 2 + 0.06,
            size + 0.07,
            0.16,
            0.11,
            materials.wood,
        )

    if y == 0:
        add_obstacle(
            state,
            x,
            z,
            size / 2,
            size / 2,
            size,
        )


def _create_tyre(
    state: SceneState,
    materials: BaseMaterials,
    x: float,
    z: float,
    y: float = 0.0,
) -> None:
    """Create a discarded tyre torus."""
    bpy.ops.mesh.primitive_torus_add(
        major_segments=20,
        minor_segments=8,
        location=to_blender_coords(x, y + 0.22, z),
        major_radius=0.57,
        minor_radius=0.23,
    )
    tyre = bpy.context.object
    tyre.name = "Discarded tyre"
    tyre.data.materials.append(materials.rubber)
    state.objects.append(tyre)


def _create_barrel(
    state: SceneState,
    materials: BaseMaterials,
    x: float,
    z: float,
    material: bpy.types.Material,
) -> None:
    """Create a steel barrel with rims, lid, bung, and collision volume."""
    create_cylinder(
        state,
        "Steel barrel",
        x,
        0.85,
        z,
        0.65,
        1.7,
        material,
    )

    for y in (0.12, 0.53, 1.2, 1.61):
        create_cylinder(
            state,
            "Rolled barrel rim",
            x,
            y,
            z,
            0.68,
            0.07,
            material,
        )

    create_cylinder(
        state,
        "Barrel lid",
        x,
        1.71,
        z,
        0.61,
        0.03,
        material,
    )
    create_cylinder(
        state,
        "Bung",
        x + 0.22,
        1.75,
        z,
        0.065,
        0.035,
        materials.dark,
    )
    add_obstacle(state, x, z, 0.65, 0.65, 1.75)


def _create_deck(
    state: SceneState,
    materials: BaseMaterials,
    x: float,
    z: float,
    width: float = 6.0,
    depth: float = 4.0,
    height: float = 1.35,
) -> None:
    """Create a raised wooden platform with legs and three access steps."""
    plank_count = round(width / 0.28)

    for index in range(plank_count):
        create_box(
            state,
            "Deck plank",
            x - width / 2
            + (index + 0.5) * width / plank_count,
            height - 0.10,
            z,
            width / plank_count - 0.022,
            0.2,
            depth,
            materials.wood,
        )

    for x_sign in (-1, 1):
        for z_sign in (-1, 1):
            create_box(
                state,
                "Platform leg",
                x + x_sign * (width / 2 - 0.25),
                height / 2,
                z + z_sign * (depth / 2 - 0.25),
                0.23,
                height,
                0.23,
                materials.wood,
            )

    state.platforms.append(
        collision_volume(
            x,
            z,
            width / 2,
            depth / 2,
            height,
        )
    )

    for index in range(3):
        step_height = height * (index + 1) / 4
        step_z = z + depth / 2 + 1.8 - index * 0.6

        create_box(
            state,
            "Wooden access step",
            x,
            step_height / 2,
            step_z,
            2.2,
            step_height,
            0.6,
            materials.wood,
        )
        state.platforms.append(
            collision_volume(
                x,
                step_z,
                1.1,
                0.3,
                step_height,
            )
        )


def _build_scrap_bay_and_clutter(
    state: SceneState,
    materials: BaseMaterials,
    rng: random.Random,
) -> None:
    """Build the scrap bay plus deterministic timber, brick, and paving clutter."""
    for x, z, width, depth in (
        (28, 8, 5, 0.12),
        (25.5, 10, 0.12, 4),
        (30.5, 10, 0.12, 4),
    ):
        create_box(
            state,
            "Scrap bay",
            x,
            1.0,
            z,
            width,
            2,
            depth,
            materials.teal,
        )
        add_obstacle(
            state,
            x,
            z,
            width / 2,
            depth / 2,
            2,
        )

    clutter_origins = (
        (-18, 1),
        (-17, 17),
        (26, 22),
        (-8, -12),
    )

    for index in range(80):
        x, z = rng.choice(clutter_origins)
        x += rng.uniform(-2, 2)
        z += rng.uniform(-2, 2)

        if index % 3:
            obj = create_box(
                state,
                "Broken timber",
                x,
                0.09,
                z,
                rng.uniform(0.7, 2),
                0.12,
                0.16,
                materials.wood,
            )
        else:
            obj = create_box(
                state,
                "Brick fragment",
                x,
                0.15,
                z,
                0.65,
                0.3,
                0.35,
                materials.brick,
            )

        obj.rotation_euler.z = rng.random() * math.tau

    for _ in range(210):
        x = rng.uniform(-20, 30)
        z = rng.uniform(-13, 25)

        if 16 < x < 28 and -11 < z < 0:
            continue

        paving = create_box(
            state,
            "Scattered paving",
            x,
            0.016,
            z,
            rng.uniform(0.35, 0.8),
            0.032,
            rng.uniform(0.3, 0.7),
            materials.stone,
        )
        paving.rotation_euler.z = rng.uniform(-0.5, 0.5)
