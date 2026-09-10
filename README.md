# Wet Whiskers

A browser-based Three.js game. The project runs as a static site with locally bundled dependencies; no build step or package installation is required.

## Run locally

Install Node.js 20 or newer, then run from this folder:

```sh
npm start
```

Open **http://127.0.0.1:8080**. Stop the server with Ctrl+C. `npm run dev` runs the same server; set `PORT` to change its port. You can also use any static HTTP server rooted at this folder. Opening the HTML with `file://` is insufficient for model loading.

```sh
npm run check
```

Checks JavaScript syntax, script order, and local asset references, including dynamically constructed model and texture paths. These checks do not exercise WebGL, audio playback, or gameplay.

## Project layout

```text
index.html          Game markup and ordered script/style entry points
src/game/           Game JavaScript, extracted along existing script boundaries
src/styles/         Base styles, theme, and final overrides in cascade order
vendor/             Existing Three.js r128 and matching GLTFLoader
assets/models/      GLB characters, scenery, and retained earlier versions
assets/audio/       Music and voice recordings
assets/images/      Textures, artwork, and reference renders
assets/video/       Opening films
previews/           Historical standalone crafting preview
tools/blender/      Blender Python asset generators
scripts/            Dependency-free development server and project checks
docs/               Architecture, animation guide, and original project history
generated/          Ignored Blender output, created when generators run
```

See [architecture and editing notes](docs/architecture.md) before splitting game systems further. Earlier assets are retained intentionally; their versioned names are still useful for provenance. The [original README](docs/history/original-readme.md) preserves release notes and credits; its old paths and validation claims describe earlier builds.

## Deploy

Serve the repository root as a static site, including `index.html`, `src/`, `vendor/`, and `assets/`. Relative asset paths support hosting beneath a subdirectory, such as GitHub Pages. There is no generated `dist/` folder. Deploy all folders together; copying only `index.html` will not work.

## Asset tooling

The scripts in `tools/blender/` run inside Blender's Python environment (`bpy`, `mathutils`, and NumPy), not ordinary Node.js or Python. For example, with Blender on your PATH:

```sh
blender --background --python tools/blender/junkyard-build32.py
```

Each generator writes to its own `generated/junkyard-buildNN/` directory. Review the generated model, render, and collision data before deliberately copying outputs into the versioned assets and game data. Generators clear the active Blender scene, so use a fresh background process as shown.

## Credits

- Original neighbour: **The Fat Rat**, Ryan Honey / Raditsys, [creator page](https://sketchfab.com/Raditsys), CC-BY 4.0.
- Three.js r128 and GLTFLoader: Three.js contributors, MIT; bundled sources retained unchanged.
- Pip and Zaytona model/animation sources: supplied by the project owner (Meshy), as recorded in the original release notes.
- Opening illustration: AI-generated artwork for Wet Whiskers.

Additional asset and build provenance is preserved in [the original project history](docs/history/original-readme.md) and [animation guide](docs/animation-guide67.md).
