"""Recognizable junkyard salvage props."""

import math
import random

import bpy

from junkyard_builder.geometry import (
    add_obstacle,
    create_box,
    create_cylinder,
    create_ring,
    to_blender_coords,
)
from junkyard_builder.scene_types import (
    BaseMaterials,
    PropMaterials,
    SceneState,
)


def build_salvage_props(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
    rng: random.Random,
) -> None:
    """Build the larger recognizable salvage objects and small loose props."""
    _build_fridge(state, base, props)
    _build_washing_machine(state, base, props)
    _build_cable_spool(state, base, props)
    _build_wheelbarrow(state, base)
    _build_chair_and_cupboard(state, base, props)
    _build_pipes(state, base)
    _build_traffic_cones(state, base, props)
    _build_flowerpots(state, base)
    _build_bottles_and_tins(state, base, props, rng)


def _build_fridge(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
) -> None:
    """Build the abandoned fridge with separate doors and handles."""
    create_box(
        state,
        "Abandoned fridge",
        23,
        1.7,
        -7,
        1.5,
        3.4,
        1.4,
        props.cream,
    )
    add_obstacle(state, 23, -7, 0.75, 0.7, 3.4)

    for y, height in ((2.75, 1.0), (1.15, 2.05)):
        create_box(
            state,
            "Fridge door",
            23,
            y,
            -6.26,
            1.43,
            height,
            0.12,
            props.cream,
        )
        create_box(
            state,
            "Fridge handle",
            23.5,
            y,
            -6.14,
            0.075,
            0.40,
            0.10,
            base.dark,
        )


def _build_washing_machine(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
) -> None:
    """Build the front-loading washing machine and its controls."""
    create_box(
        state,
        "Washing machine",
        19,
        0.85,
        -6,
        1.7,
        1.7,
        1.4,
        base.blue,
    )
    add_obstacle(state, 19, -6, 0.85, 0.7, 1.7)

    create_ring(
        state,
        "Washer rim",
        19,
        0.77,
        -5.26,
        0.49,
        0.08,
        props.cream,
        vertical=True,
    )

    drum = create_cylinder(
        state,
        "Washer drum",
        19,
        0.77,
        -5.23,
        0.42,
        0.06,
        base.dark,
    )
    drum.rotation_euler.x = math.pi / 2

    for x in (18.55, 18.85, 19.4):
        dial = create_cylinder(
            state,
            "Washer dial",
            x,
            1.45,
            -5.23,
            0.07,
            0.06,
            props.cream,
        )
        dial.rotation_euler.x = math.pi / 2


def _build_cable_spool(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
) -> None:
    """Build the wooden cable spool and repeated wound-cable rings."""
    for y in (0.10, 1.35):
        create_cylinder(
            state,
            "Cable spool disc",
            20,
            y,
            17,
            1.15,
            0.16,
            base.wood,
        )

    create_cylinder(
        state,
        "Cable spool core",
        20,
        0.72,
        17,
        0.45,
        1.2,
        base.wood,
    )
    add_obstacle(state, 20, 17, 1.15, 1.15, 1.45)

    for index in range(11):
        create_ring(
            state,
            "Wound cable",
            20,
            0.3 + index * 0.08,
            17,
            0.63,
            0.055,
            props.cable,
        )


def _build_wheelbarrow(
    state: SceneState,
    base: BaseMaterials,
) -> None:
    """Build the wheelbarrow tray, handles, supports, and front wheel."""
    create_box(
        state,
        "Wheelbarrow tray",
        14,
        1.0,
        4,
        1.15,
        0.12,
        1.5,
        base.rust,
    )
    add_obstacle(state, 14, 4, 0.75, 1.1, 1.4)

    for x in (13.4, 14.6):
        create_box(
            state,
            "Tray side",
            x,
            1.2,
            4,
            0.12,
            0.40,
            1.5,
            base.rust,
        )
        create_box(
            state,
            "Wheelbarrow handle",
            x,
            0.9,
            5,
            0.09,
            0.09,
            1.8,
            base.wood,
        )

    create_box(
        state,
        "Tray front",
        14,
        1.2,
        3.25,
        1.3,
        0.40,
        0.12,
        base.rust,
    )

    wheel = create_ring(
        state,
        "Wheelbarrow wheel",
        14,
        0.42,
        3.0,
        0.32,
        0.11,
        base.rubber,
        vertical=True,
    )
    wheel.rotation_euler.z = math.pi / 2

    for x in (13.6, 14.4):
        create_box(
            state,
            "Barrow support",
            x,
            0.4,
            4.5,
            0.08,
            0.8,
            0.08,
            base.dark,
        )


def _build_chair_and_cupboard(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
) -> None:
    """Build the discarded chair and the low cupboard."""
    for x in (-19.6, -18.4):
        for z in (-5.5, -4.5):
            create_box(
                state,
                "Chair leg",
                x,
                0.43,
                z,
                0.12,
                0.86,
                0.12,
                base.wood,
            )

    create_box(
        state,
        "Chair seat",
        -19,
        0.9,
        -5,
        1.5,
        0.15,
        1.4,
        props.red,
    )
    create_box(
        state,
        "Chair back",
        -19,
        1.55,
        -5.6,
        1.5,
        1.2,
        0.12,
        props.red,
    )
    add_obstacle(state, -19, -5, 0.75, 0.7, 2.2)

    create_box(
        state,
        "Old cupboard",
        26,
        0.85,
        -10,
        3.0,
        1.7,
        1.1,
        base.wood,
    )
    add_obstacle(state, 26, -10, 1.5, 0.55, 1.7)

    for x in (25.25, 26.75):
        create_box(
            state,
            "Cupboard door",
            x,
            0.85,
            -9.42,
            1.4,
            1.55,
            0.07,
            base.teal,
        )
        create_box(
            state,
            "Drawer pull",
            x,
            1.05,
            -9.35,
            0.3,
            0.06,
            0.07,
            base.dark,
        )


def _build_pipes(
    state: SceneState,
    base: BaseMaterials,
) -> None:
    """Build five hollow pipe sections with visible torus mouths."""
    for index in range(5):
        x = 17 + index * 0.55
        z = -11.5

        create_ring(
            state,
            "Pipe mouth",
            x,
            0.4,
            z,
            0.27,
            0.08,
            base.blue,
            vertical=True,
        )

        pipe = create_cylinder(
            state,
            "Pipe section",
            x,
            0.4,
            z - 0.8,
            0.34,
            1.6,
            base.blue,
        )
        pipe.rotation_euler.x = math.pi / 2


def _build_traffic_cones(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
) -> None:
    """Build three traffic cones with dark feet and cream bands."""
    for x, z in ((-17, 13), (-16, 15), (27, 13)):
        create_box(
            state,
            "Cone foot",
            x,
            0.05,
            z,
            0.75,
            0.1,
            0.75,
            base.dark,
        )

        bpy.ops.mesh.primitive_cone_add(
            vertices=16,
            radius1=0.30,
            radius2=0.07,
            depth=0.85,
            location=to_blender_coords(x, 0.52, z),
        )
        cone = bpy.context.object
        cone.name = "Traffic cone"
        cone.data.materials.append(props.red)
        state.objects.append(cone)

        create_cylinder(
            state,
            "Cone stripe",
            x,
            0.6,
            z,
            0.17,
            0.14,
            props.cream,
        )


def _build_flowerpots(
    state: SceneState,
    base: BaseMaterials,
) -> None:
    """Build three flowerpots with visible soil caps."""
    for x, z in ((10, 33), (13.8, 34), (26, 17)):
        create_cylinder(
            state,
            "Flowerpot",
            x,
            0.3,
            z,
            0.34,
            0.6,
            base.rust,
        )
        create_cylinder(
            state,
            "Pot soil",
            x,
            0.61,
            z,
            0.28,
            0.025,
            base.soil,
        )


def _build_bottles_and_tins(
    state: SceneState,
    base: BaseMaterials,
    props: PropMaterials,
    rng: random.Random,
) -> None:
    """Scatter deterministic glass bottles and food tins."""
    for _ in range(18):
        x = rng.choice((-17, 25)) + rng.uniform(-1, 1)
        z = rng.choice((7, 21)) + rng.uniform(-1, 1)

        create_cylinder(
            state,
            "Bottle body",
            x,
            0.21,
            z,
            0.11,
            0.42,
            props.green,
        )
        create_cylinder(
            state,
            "Bottle neck",
            x,
            0.5,
            z,
            0.05,
            0.17,
            props.green,
        )

    for _ in range(14):
        create_cylinder(
            state,
            "Discarded food tin",
            -15 + rng.random() * 3,
            0.13,
            18 + rng.random() * 3,
            0.12,
            0.26,
            base.blue,
        )
