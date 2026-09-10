# Junkyard Build 32 — Refactored Blender Generator

This is a structural refactor of the original one-file Blender Python script.

## Structure

- `junkyard_build32.py` — launcher; preserves the original output-path rule.
- `junkyard_builder/main.py` — high-level build sequence.
- `junkyard_builder/scene_types.py` — typed scene state and material containers.
- `junkyard_builder/materials.py` — material and generated-texture creation.
- `junkyard_builder/geometry.py` — reusable box/cylinder/ring/collision helpers.
- `junkyard_builder/environment.py` — fence, shed, path, decks, salvage clusters, clutter.
- `junkyard_builder/props.py` — fridge, washer, spool, wheelbarrow, furniture, pipes, cones, pots, bottles, tins.
- `junkyard_builder/output.py` — beveling, mesh merging, GLB/JSON export, Blender save, and preview rendering.

## Why it was split

The old script mixed several responsibilities in one global namespace and relied on
global mutable lists. The refactor keeps mutable build data in `SceneState`, uses
typed material containers, gives helper functions explicit inputs and outputs, and
keeps the top-level build sequence short enough to understand at a glance.

## Running it

Put `junkyard_build32.py` and the `junkyard_builder/` folder in the directory where
the original script lived, then run the launcher with Blender in the same way you
ran the original script.

For example:

```bash
blender --background --python junkyard_build32.py
```

The launcher intentionally retains the original output rule:

```python
Path(__file__).resolve().parents[2] / "generated" / "junkyard-build32"
```

## Compatibility note

The files are syntax-validated outside Blender. Blender-specific runtime behavior
cannot be executed in this environment because the `bpy` module and Blender
runtime are not available here.
