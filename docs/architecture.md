# Architecture and editing notes

## Runtime

`index.html` remains the public game entry point. Styles load in order: `base.css`, `theme.css`, then `overrides.css`. Embedded image data remains in the original style and game content.

Scripts are classic browser scripts with shared global state. They execute synchronously in their original order after the game markup:

| File in `src/game/` | Responsibility |
| --- | --- |
| `startup.js` | Startup failure messages and error listener |
| `main.js` | Core game, renderer, assets, input, saves, scenes, audio, and main loop |
| `workbench.js` | Later workbench previews and crafting UI changes |
| `collision.js` | Collision registration for visible scenery |
| `interactions.js` | Later neighbour framing and interaction overrides |
| `world-updates.js` | Later raycast, world, movement, animation, and audio updates |

The bundled engine and loader execute between `startup.js` and `main.js`. Later scripts replace or extend earlier functions. Do not reorder scripts or switch them to modules, `async`, or `defer` without checking initialization and override dependencies. HTML event handlers also depend on globals.

This is a structural first pass: existing script boundaries and code were retained. `main.js` is still large, and `world-updates.js` still contains several coupled systems. Build-number suffixes on symbols and assets are preserved because removing them is a separate behavior-sensitive refactor.

## Paths and persistence

Game JavaScript asset URLs resolve relative to `index.html`. External stylesheet URLs resolve relative to `src/styles/`, so their asset references begin with `../../assets/`. The historical preview uses `../assets/`. Dynamic scenery and surface-texture loaders also use the new asset directories.

Save keys and game logic are unchanged. Browser saves are tied to the site's origin; switching hostnames or ports can make an existing save appear absent. Use the same origin when comparing against the previous layout.

## Validation and next refactors

`npm run check` checks syntax and local references without initializing the game. The development server supports byte-range requests for video seeking and serves only public game directories on localhost.

After gameplay changes, manually verify startup, opening film/skip, saved-game loading, movement and climbing, area transitions, crafting and placement, neighbour audio, and touch controls. Automated structure checks cannot validate these interactions.

Good subsequent steps are to isolate asset loading, save serialization, input, and scene lifecycle one at a time, with gameplay checks for each. Before converting to ES modules, make shared state and override ownership explicit. Update old asset versions only after determining which historical previews or tools need them.
