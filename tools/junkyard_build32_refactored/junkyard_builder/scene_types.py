"""Shared types and mutable build state for the junkyard scene."""

from dataclasses import dataclass, field
from typing import TypeAlias, TypedDict

import bpy


ColorRGB: TypeAlias = tuple[float, float, float]


class CollisionVolume(TypedDict):
    """Axis-aligned collision volume written to the map collision JSON."""

    x: float
    z: float
    hx: float
    hz: float
    h: float


@dataclass
class SceneState:
    """Mutable scene state accumulated while geometry is being generated."""

    objects: list[bpy.types.Object] = field(default_factory=list)
    obstacles: list[CollisionVolume] = field(default_factory=list)
    platforms: list[CollisionVolume] = field(default_factory=list)


@dataclass(frozen=True)
class BaseMaterials:
    """Materials used by the environment and common junkyard objects."""

    wood: bpy.types.Material
    teal: bpy.types.Material
    soil: bpy.types.Material
    stone: bpy.types.Material
    blue: bpy.types.Material
    rust: bpy.types.Material
    rubber: bpy.types.Material
    roof: bpy.types.Material
    glass: bpy.types.Material
    dark: bpy.types.Material
    brick: bpy.types.Material


@dataclass(frozen=True)
class PropMaterials:
    """Additional materials used by the recognizable salvage props."""

    cream: bpy.types.Material
    red: bpy.types.Material
    green: bpy.types.Material
    cable: bpy.types.Material
