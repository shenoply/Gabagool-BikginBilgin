"""Low-level Blender geometry helpers used by the scene builders."""

import math

import bpy

from junkyard_builder.scene_types import CollisionVolume, SceneState


def to_blender_coords(
    x: float,
    y: float,
    z: float,
) -> tuple[float, float, float]:
    """Convert game-space coordinates into Blender-space coordinates."""
    return (x, -z, y)


def create_box(
    state: SceneState,
    name: str,
    x: float,
    y: float,
    z: float,
    width: float,
    height: float,
    depth: float,
    material: bpy.types.Material,
    bevel: float = 0.0,
) -> bpy.types.Object:
    """Create a box mesh, assign a material, and register it in scene state."""
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(
        [
            (-0.5, -0.5, -0.5),
            (0.5, -0.5, -0.5),
            (0.5, 0.5, -0.5),
            (-0.5, 0.5, -0.5),
            (-0.5, -0.5, 0.5),
            (0.5, -0.5, 0.5),
            (0.5, 0.5, 0.5),
            (-0.5, 0.5, 0.5),
        ],
        [],
        [
            (0, 3, 2, 1),
            (4, 5, 6, 7),
            (0, 1, 5, 4),
            (1, 2, 6, 5),
            (2, 3, 7, 6),
            (3, 0, 4, 7),
        ],
    )
    mesh.update()

    uv_layer = mesh.uv_layers.new(name="UVMap")
    uv_coords = [(0, 0), (1, 0), (1, 1), (0, 1)]
    for face in mesh.polygons:
        for loop_index, uv_coord in zip(face.loop_indices, uv_coords):
            uv_layer.data[loop_index].uv = uv_coord

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = to_blender_coords(x, y, z)
    obj.scale = (width, depth, height)
    obj.data.materials.append(material)

    if bevel:
        modifier = obj.modifiers.new("Worn edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 1
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)

    state.objects.append(obj)
    return obj


def create_cylinder(
    state: SceneState,
    name: str,
    x: float,
    y: float,
    z: float,
    radius: float,
    height: float,
    material: bpy.types.Material,
) -> bpy.types.Object:
    """Create a 16-sided cylinder and register it in scene state."""
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=16,
        radius=radius,
        depth=height,
        location=to_blender_coords(x, y, z),
    )

    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    state.objects.append(obj)
    return obj


def create_ring(
    state: SceneState,
    name: str,
    x: float,
    y: float,
    z: float,
    radius: float,
    thickness: float,
    material: bpy.types.Material,
    vertical: bool = False,
) -> bpy.types.Object:
    """Create a torus used for tyres, rims, pipe mouths, and cable coils."""
    bpy.ops.mesh.primitive_torus_add(
        major_segments=20,
        minor_segments=8,
        location=to_blender_coords(x, y, z),
        major_radius=radius,
        minor_radius=thickness,
    )

    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)

    if vertical:
        obj.rotation_euler.x = math.pi / 2

    state.objects.append(obj)
    return obj


def collision_volume(
    x: float,
    z: float,
    half_width: float,
    half_depth: float,
    height: float,
) -> CollisionVolume:
    """Create an axis-aligned collision volume in the JSON-compatible shape."""
    return {
        "x": x,
        "z": z,
        "hx": half_width,
        "hz": half_depth,
        "h": height,
    }


def add_obstacle(
    state: SceneState,
    x: float,
    z: float,
    half_width: float,
    half_depth: float,
    height: float,
) -> None:
    """Append an obstacle collision volume to the current scene state."""
    state.obstacles.append(
        collision_volume(x, z, half_width, half_depth, height)
    )
