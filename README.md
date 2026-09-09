# Wet Whiskers — Build 66: Climbing, swimming and backyard voices

Play at https://shenoply.github.io/Gabagool/index.html?build=66

Single-file Three.js r128 game, with no build step. Serve `index.html` with `GLTFLoader.js`, `fat-rat.glb`, `bigrat.mp3`, and `opening-scene.webp` alongside it.

## Build 30 — approved animated Pip in game

- Loads the approved `pip-animated.glb` with Idle, Walk, Run and Jump clips. This is the reviewed 28-bone model, including its fur geometry, with no substitute or reshaping.
- One cached download and separate skeleton instances for each scene. Detailed meshes cast no shadows. The title shows download progress and enables Begin/New game when the approved asset is ready; Retry reloads after a download failure.
- Crossfades between idle/walk/run, removes the Jump root-position track so existing game physics control height, and preserves pickup, bite, roll, climbing, cutscene and save behavior. Roll, bite and climbing use small procedural additions to the approved rig.
- Shared model geometry survives scene disposal, and late downloads cannot attach to discarded scenes. Rendering uses sRGB output and painted colour textures are marked sRGB.
- Keep `pip-animated.glb` beside index.html, along with existing GLTFLoader.js, fat-rat.glb, bigrat.mp3 and opening-scene.webp. The model is approximately 13 MB; this release retains the approved detailed asset. Mobile optimization remains future work.

Validation: 24 existing logic/geometry checks plus 6 real-GLB integration checks pass under Three.js r128 with stubbed DOM/WebGL/audio. The reviewed animations were previously rendered after GLB import in Blender. Final live gameplay rendering and touch interaction have not been visually verified because the available browser cannot create a WebGL context.

## Build 29

- Pip's torso, neck, head and limbs now form one connected, smoothly shaded surface: 3,674 vertices / 7,312 triangles, weighted to 13 bones. Facial features, ears, scarf and paws remain attached details. Original mesh generated for this project, embedded directly in index.html; no external model service or download at runtime.
- A subtle procedural fur bump texture, blended colour markings and soft contact shadow. Distance-driven footsteps, reduced arm swing and gentler body bounce. Existing action poses deform the new skin.
- Alley paving uses lower-contrast irregular stones without repeated white highlights. Larger texture coverage plus a single non-repeating dirt/moss wash breaks up the surface. Added instanced wall plants, fallen leaves and dumpster contact shade.
- Cooler sky fill, gentler warm sunlight, and a closer, lower portrait camera.
- Smaller mobile joystick and action group, with at least 48px action targets and responsive joystick centring. Compact settings row.
- Existing opening artwork, neighbour/audio, inventory/save format, crafting and areas retained.

24 logic/geometry checks passed, including normalized skin weights, 13 real bones, connected surface topology checked separately, and CPU skin deformation through walk/run/jump/roll/bite/climb. GPU animation and phone touch interaction remain unverified: the available preview browser cannot create a WebGL context. The title illustration is pre-rendered artwork and does not represent gameplay graphics.

## Build 28

- Rounded original Pip with sculpted body, expressive eyes, scarf, articulated legs and a continuous flexible tail. Distance-driven strides, eased movement, blinking, breathing and secondary ear/scarf motion. Existing jump, roll, bite and climbing actions remain.
- Smoother cat and crow surfaces, softer diffuse environment shading, rounded furnishings, an arched home doorway and a moonlit circular window.
- New original generated opening artwork on the title screen and a slow-moving prologue, fading into the playable 3D flood sequence. The full introduction lasts 32 seconds and can be skipped. The illustration is pre-rendered artwork; gameplay remains real-time Three.js.
- Existing neighbour model and recorded dialogue, crafting, storage, home placement, courtyard and garden are retained. Saves continue using `ww-save`.
- Phone rendering remains capped at 1.5 pixel ratio and 1024 sun shadows; detailed character meshes do not cast shadows.

The changes below describe the retained Build 27 systems. The separate exported cat/crow GLBs remain Build 27 assets; Build 28's smoother models are inline in the game.

## What changed

- The existing big rat and voice recording remain available in the Build 27 portable HTML; the live game loads the original local files. Recorded dialogue begins from a user interaction, avoids overlapping device speech, and stops when muted. A temporary procedural neighbour appears while the original model loads.
- The workbench groups 20 recipes into furniture, lighting and decoration, lists missing parts, puts affordable recipes first, and lets you pin a shopping list.
- Crafting now puts a finished item in Furniture. Place it when ready. Cancelling placement does not lose it. Tap existing furniture to move, store or recycle it; recycling returns the original parts.
- Tap the floor to position a placement ghost; toggle a quarter-unit grid; rotate before confirming. Wall items snap and reject overlaps. Old version-1 saves remain supported; finished furniture is saved in `home.storage`.
- New pieces: spool sofa, teacup fern, button pendant and matchbox bookcase. New finishes: honey oak, woven linen, sage plaster and rose plaster. Cloth gets weave detail; garden soil gets a separate procedural texture. The home has timber details and Pip's nameplate.
- Two playable areas: Laundry Courtyard (cloth, thread, buttons, paper and household parts) and Rain Garden (sticks, cork, teacups, coins and shed finds). Use Areas or the alley's right-hand exit. Both have loot and routes back. Loot refreshes on re-entry, matching the existing endless scavenging loop.
- The sitting cat watches from a fence and swishes its hanging tail. The crow looks around, lifts off when Pip approaches and returns to its perch. The original roaming predator cat remains a separate NPC.
- Existing cutscene, controls, audio station, home decoration and photo mode are retained. Light quality disables shadows and motes; the usual 1.5 pixel-ratio cap and 1024 sun shadows remain.

## Cat and crow assets

| File | Triangles | Animation clips |
|---|---:|---|
| `fence-cat.glb` | 2,811 | Idle |
| `crow.glb` | 2,252 | Idle, Flap |

Original procedural models made for Wet Whiskers. No third-party animal model, texture or recording was added. Both use a colour palette, Y-up, +Z forward, and a feet/perch origin. The cat's tail intentionally hangs below that origin. The GLBs retain named part hierarchies and transform animation clips, not skin/skeleton rigs. The crow's flight path is implemented in the game; its GLB contains the flap animation. The fence/post in the model preview is a display prop, not part of either GLB.

`animal-models.js` contains reusable Three.js r128 constructors (`makeFenceCat`, `makeCrow`). Their returned groups have `.animate(dt)` / `.animate(dt, flying)` methods. The game's copies are inline to preserve the single-file source architecture.

## Credits

- Opening illustration: AI-generated original artwork for Wet Whiskers; no third-party character assets added.
- Original neighbour: **The Fat Rat**, Ryan Honey / Raditsys, [creator page](https://sketchfab.com/Raditsys), CC-BY 4.0. The existing project recording `bigrat.mp3` is retained byte-for-byte.
- Three.js r128 and GLTFLoader: Three.js contributors, MIT.
- Pip, procedural environments, new cat and crow: built in code for this project.
- The optional Quaternius rat is not used.

## Validation

22 logic and geometry checks passed using Three.js r128 with stubbed DOM, WebGL renderer and audio. Covers gameplay/save compatibility, the complete intro transition, character geometry and animated action transforms. These checks do not validate GPU rendering, actual sound playback or mobile touch interaction.

Approved GLB SHA-256: d94551a2d15b2d2549aed06038e8fee1c58a5acab29c2cce32ac71de0f190df7


## Build 31 — reference-led junkyard

The main scavenging area now uses an original 3D junkyard built from the owner’s supplied layout reference: teal perimeter fencing, a timber shed, three stepped platforms, crates, tyres, drums and scattered paving. The shed door returns to the existing decorated home; the right gate leads to the courtyard. Pip, dumpster access, Fat Rat and bigrat.mp3 dialogue remain in place.

`junkyard.glb` contains original geometry and procedural colour textures, with meshes combined by material for mobile rendering. Map collision is embedded in index.html. The reference-driven map asset was created for Wet Whiskers; no third-party models or music were added.


## Build 32 — scale, outside home and cartoon salvage

Pip now uses quarter scale outdoors, with the neighbour, cats, crow, boombox and loot resized to match. Outdoor cameras follow closer; pickup and bite ranges fit the smaller character. The yard uses a consistent design scale of one unit per half metre: the rat is about 25 cm upright, drums about 85 cm high. These are gameplay scale targets, not a biological simulation.

Pip’s rat-sized shelter is outside the front fence, connected by a paved path. The former shed site now holds discarded appliances. Added fridge, washing machine, wheelbarrow, cupboard, chair, cable spool, pipes, cones, bottles, tins and pots. Colours are brighter, major props have softened edges, and the loaded map uses Three.js toon materials. Existing saves, crafting and the Fat Rat recording are retained.

Verified JavaScript syntax, gate and fence collision, house approach, platform steps, spawn and fridge collision; inspected actual 3D asset renders. Browser GPU gameplay was not verified in this environment.


## Build 33 — Zaytona follows Pip

Zaytona uses the owner-provided Meshy_AI_Zaytona_biped model and its Walking and Running animations. Both animations share one GLB mesh/texture set. A held pose supplies idle; the biped movement is retained from the supplied asset. Credit: owner-provided Meshy model and animations.

She spawns with Pip in the junkyard, courtyard and garden, follows at roughly two game units, catches up when farther away, and pauses facing Pip. Ground navigation routes around scenery and through gates; she stays on the ground while Pip climbs. The previous attacking cat loop is disabled. Indoor scenes retain their existing behaviour; Zaytona rejoins on returning outside. Existing saves and Fat Rat audio are unchanged.

Validation: actual Three.js r128 GLB parsing and animation evaluation, posed-skin scale measurement, finite skeleton transforms, obstacle/gate navigation and a simulated follow-and-stop sequence. Browser GPU gameplay was not available for verification.

## Build 34 — new Pip and ambient Zaytona

Pip now uses the owner's supplied Meshy merged-animation character. All 14 source clips remain in the asset. Gameplay selects idle, walk, run, sprint, jump and upward/downward climbing where appropriate; root travel is controlled by game physics. Roll and bite retain procedural action overlays because the supplied pack has no dedicated clips for those actions. Door, pushing and failed-climb clips are retained for future matching interactions rather than playing them at unrelated moments.

Zaytona now wanders between nearby camera-preferred destinations, completes her route and pauses for an activity. She uses Walking, Confident Walk, Confident Strut, Crawl and Look Back, and Don't You Dare, plus a held standing idle. There is no chase, attack or catch-up sprint. Sitting is omitted because the current routes have no validated seats. Shared geometry/textures keep the five-clip cat download near 8.2 MB.

Pip and Zaytona models and animation packs supplied by the project owner (Meshy). Existing Fat Rat creator credit and audio remain unchanged.

Validation: Three.js r128 parsed both GLBs; animated skinning, Pip grounding/scale and seven gameplay clips checked; a five-minute stationary-player simulation exercised all six Zaytona states without blocked-cell intersections. JavaScript syntax checked. Browser rendering and mobile performance were not verified in this environment.

## Build 35 — facing, contextual climbing and full animation mapping

Corrects the owner-reported inverted Pip facing by rotating the imported visual 180 degrees, retaining movement controls and physics direction.

Nearby junkyard surfaces and courtyard props offer Up, Down, Left, Right and Let go controls. Hold touch buttons, or attach with E and use movement keys/joystick. Jump releases the grip. Climbing supports sideways movement, descent, platform top-out and returning down from edges. Candidate positions and sideways paths reject overlapping props; very smooth refrigerator sides trigger the failed attempt animation. Climb controls pause with photo mode, hidden tabs and modals. Home transitions play the door animation.

All 13 substantive clips now have contextual mappings: Idle_4 (idle), Walking, Running, Run_03 (initial jog), Lean_Forward_Sprint_inplace (sustained sprint), Regular_Jump, climbing_up_wall, climbing_down_wall, both Climb_Left clips (traverse/grip adjustment), Climb_Attempt_and_Fall_5 (slippery failure), Push_and_Walk_Forward (blocked pushing), open_door_3 (door interaction). The one-frame clip0 reference pose is intentionally not played as an action. Movement remains physics-driven; root translation is removed from climbing clips. Native roll/bite clips were not supplied, so these remain procedural overlays.

Validation: JavaScript syntax, Three r128 parsing/skinning for all 13 mapped clips, outdoor scale and grounding, wall attach/up/sideways/down/top-out/descent/failure/photo-pause checks. Zaytona's existing ambient behavior remains. No browser GPU or mobile playtest was available; the facing correction follows the owner's live observation.

## Build 36 — pocket crafting and garden scavenging

Adds an original 3×3 shapeless crafting grid with manual ingredient selection/removal, recipe auto-fill, missing-material hints, batch crafting and shopping-list pinning. Grid slots are a preview: inventory is consumed only after a validated craft. Crafting is accessible from the top Craft button as well as the home recipe panel. Existing furniture recipes remain available; crafted furniture goes to home storage.

Adds plant fibre, leaf scraps, pebbles, sap, dew and acorn shells, plus braided twine, a permanent pebble-axe unlock, a placeable scrap workbench, leaf hammock, amber lantern, acorn seat and dew refreshment. Advanced garden furniture requires a workbench placed at home. Nature recipes become known through collecting their ingredients. Sap requires the axe; harvest nodes regrow after 75 active seconds. Dew refreshment provides a visible 60-second running boost. Oversized foliage and harvest nodes appear in the rain garden and outside the junkyard. All geometry is original procedural art; no Minecraft or Grounded assets are used.

Existing ww-save v1 inventories and homes migrate with empty discovery/tool fields; newly learned materials and tools autosave. Character models, climbing, Zaytona, Fat Rat and audio remain in place.

Validation: JS syntax; grid matching; batch accounting/output; permanent-tool and placed-workbench gates; legacy furniture crafting; discovery; procedural asset creation; harvest gating, yields, duplicate prevention and regrowth. Browser/mobile rendering has not been verified in this environment.

## Build 37 — camera, survival, useful home stations and wildlife

The owner's supplied rat photograph is now a framed collectible called **Working From Home**, highlighted beside Pip's normal starting position at (1.65, 28.55). It is within pickup distance immediately on entering the junkyard. Grab it once, then place it on any available home wall from Furniture. Its collected flag and storage/placement state autosave; recycling returns this unique picture to storage. Resuming an existing home save can find it by going outside.

Gameplay camera: drag empty scene space to orbit, pinch or scroll to zoom, or use +/− and Reset view. Movement follows the camera's horizontal direction. House taps still select/place furniture; dragging does not trigger those taps. Camera obstruction checks shorten the view against mapped walls/props. Touch controls remain independent, and camera buttons move above the climbing controls when those appear.

Survival: slowly declining hunger and thirst during active scavenging, a running/climbing energy meter, food/drink consumption through Supplies, gentle low-supply warnings and restricted running at very low needs. Needs pause at home, in menus/photo mode, during dialogue and when the tab is hidden. No offline depletion or inventory-loss death. Bread crumbs, seeds, berry pieces and dew are available close to the starting gate and in the other outdoor areas. All needs autosave in the existing ww-save v1 home data.

Useful home stations: a pantry stores food and raw materials and supplies crafting/finish purchases while home; a cooking station makes nourishing seed stew; a leaf collector accumulates up to six clean-water portions while exploring; a bed/hammock/sofa restores energy. The leaf backpack raises collecting capacity from 60 to 120 parts. Existing oversized inventories are retained. Crafting gains Tools/Furniture/Food/Materials categories, generated 3D recipe thumbnails using the existing renderer, station checks and pantry-aware ingredient counts and spending.

Wildlife: the supplied animated crow now perches on its own bin, plays its native take-off animation, flies a short route and occasionally uncovers a coin. **Crow** by Alexei Ostapenko: [original source](https://sketchfab.com/3d-models/crow-d5a9b0df4da3493688b63ce42c8a83e2), [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). Runtime changes: scale normalization and root-translation removal for the game flight path. **Rowan** is an original procedural four-legged raccoon with eye mask, ringed tail and animated walking/resting/rummaging poses. He becomes active at dusk and trades two bread crumbs for two strings, with a one-minute restock. Lighting warms through the active-play day cycle. The owner-uploaded COTW-ripped raccoon was inspected but is not included. Existing Zaytona, Fat Rat and bigrat.mp3 remain.

Validation: full game script executed with actual Three r128 geometry/skinning and native asset parsing, a stub renderer and Canvas2D textures; tested startup pickup, unique collectible persistence, wall placement, food/drink, active/home survival, pantry/cooking transactions, menu construction, save reloads, wildlife loop, area/dumpster transitions, camera-relative movement, obstruction math, drag/pinch/cancel handlers. JavaScript syntax passed. This is logic/model verification: the cloud browser's WebGL context creation fails even on the prior live build, so GPU rendering, gesture feel and phone performance have not been visually playtested.

## Build 38 — clearer crafting, 100 finds and a larger playable dumpster

Removed Rowan the raccoon, his procedural model/behaviour and trading. Zaytona, the licensed crow, Fat Rat and the starting framed rat picture remain.

Crafting is redesigned as a searchable recipe browser with category tabs, selected-item preview, compact ingredient counts and a fixed action footer. Close is available in the footer and as a labelled top-right ×; Escape also closes menus. The 3×3 recipe is an optional view. The Your items tab lets owned finds be inspected, placed at home or reclaimed into crafting materials. New tool previews depict the axe, scissors and crowbar.

Adds exactly 100 named collectible salvage items across metal, glass, kitchen, paper, fabric, wood, toys, electronics, garden and stone families. Every find has a procedural model, can decorate the home and can be reclaimed into a useful existing material. All 100 appear in the enlarged dumpster, alongside 12 core supplies: 112 actual pickups, replacing the old non-collectible junk heaps. The exterior dumpster is scaled by 1.3; the interior expands from 9×6 to 20×14 units. Ramp height, lid entry, handles, body collision, camera lid obstruction and Zaytona's navigation footprint are updated accordingly.

Earlier ideas now implemented in this release: additional planters/flowers and findable objects around the map; picnic/toy/flowerpot scenes in the garden; axe/scissors/crowbar resource interactions; a crowbar-gated rain drain under the garden with 25 finds, a nest and an unlockable route home. Outdoor rain makes puddles grow, fills the water collector faster, wets Pip and sends animals toward shelter; home dries him. Zaytona rests between outings and the crow carries a shiny find during flight. Furniture styling supports size, height, tint and stacking on tables/shelves, persisted in saves. Packed lunches and garden broth provide distinct nutrition benefits.

**Little Whiskers Waltz** is a new original classical-style piano composition/performance synthesised in Web Audio. Toggle it with Piano at the top. It has bounded voices, pauses scheduling/cleans up while hidden or muted and yields to the radio. No third-party music recording is included: a public-domain composition does not automatically make every recording free to redistribute.

Validation: JS syntax; real Three r128 assets/geometry with a renderer stub and Canvas2D texture generation; full-game startup and save flow; 100 unique IDs; all 112 unique dumpster pickups; menu closing; reclaiming; tool-gated drain and home shortcut; wet/dry weather; furniture stack/scale; enlarged ramp ascent; camera gestures/collision; survival and station crafting regressions. A separate simulated audio-clock test checked one minute of piano scheduling, a peak of 33 simultaneous oscillators and cleanup on hide/off. The cloud browser's WebGL failure still prevents a rendered phone playtest; visual layout and feel need checking on a supported device.

## Build 39 — quiet home, lived-in salvage
- Home crafting/decoration panel has Hide menu and a persistent Decorate home toggle; it starts closed. Starting placement reopens the controls. Escape closes it and cancels placement safely.
- Dumpster pickups no longer rotate. 126 collectible pieces sit on the floor in seven irregular groups, including collectible cardboard liners and tipped cans, with walking gaps.
- Original canvas-painted, non-repeating ground for the junkyard, garden, courtyard and dumpster: dirt washes, worn paths, wheel ruts, cracks, broken paving and instanced leaf litter.
- Existing owner-supplied Pip and Zaytona models retained. Licensed crow flies between nearby perches using its native animation, lands before leaving shiny loot, and flies to rain shelter instead of teleporting.
- Discoverable picnic supplies and nests persist as searched in the save. Cooked meals and packed lunches reduce stamina use for three minutes of active exploration.
- Raccoon remains removed. Earlier tool interactions, rain drain, home shortcut, rain collector, home styling and original piano soundtrack retained.
- Validation: full Three.js/canvas logic harness including home hide/reopen and save, grounded non-spinning pickups, discoveries, meal benefit and crow travel. The browser environment has no WebGL context, so this is not a completed GPU/mobile visual playtest.

## Build 40 — picture-led workshop and planted map
- Crafting now has three clear screens: eight illustrated recipe cards per page; an ingredient detail screen with explicit Have/Need/Find more labels and gathering hints; then a success screen with Place it now for furniture made at home.
- One Make action, category/search/ready filters, a required-station link, recipe Back and Close controls. Removed the confusing 3×3 blueprint and the competing home recipe strip; the home panel now opens the same workshop.
- Found objects remain accessible in Supplies → Found treasures for placement or reclaiming materials.
- Added instanced swaying foliage, coloured flowers, collectible forage among vegetation, irregular stone footpaths, warmer ground pigments and three bottle lanterns at the junkyard gate. Existing animals, audio, save format and gameplay retained.
- Verified with the real Three.js/canvas logic harness, including browse/detail/craft/success and prior regression checks. GPU rendering is unavailable in the test browser, so mobile visual quality still requires an in-game check.

## Build 41 — searchable containers and usable furniture
- Search a lunchbox near the starting gate, a sewing tin, an old toolbox and garden supply boxes. Open lids expose miniature contents; take individual items, leave the rest, and retain container contents across saves. No automatic replenishment or rummaging animation is claimed.
- Small decorations snap to the tops of nearby tables, workbenches, stools and shelves when grid snapping is enabled. Overlapping decorations at the same height are rejected.
- Undo up to ten placements in the current scene. Inventory changes after a placement invalidate undo to prevent item duplication. Other scene transitions reset undo.
- Beds and seats offer Rest here / Sit here. Stand up or movement returns Pip to his previous position. Rest restores energy; bed rest also dries him. Sitting uses a basic procedural leg pose over the supplied rig, not a new seated animation asset.
- Zaytona favours nearby resting locations and takes longer pauses using the existing Idle, LookBack and Gesture clips; existing walking variants and crow routines remain.
- Verified persistent container contents, surface placement, undo inventory safety, furniture use/exit and the existing game regression harness. Full GPU/mobile appearance remains unverified in this browser environment.

## Build 42 — weather and playful discoveries
- Added a gradient sky, moving cloud sprites, day/evening colour shifts, distant building and branch silhouettes; no external art assets.
- Natural clear/windy/rain cycle plus a Weather menu for choosing Clear, Wind, Rain, Evening or Automatic. Animated collectible paper, swaying cloth and vegetation share the weather wind intensity.
- Rain streaks, roof-edge drips, puddle rings and footstep ripples; ground darkening and metal specular highlights. Puddle shaders approximate sky reflections and glints; they do not reflect actual scene geometry. Rain audio softens beneath the existing gate shelter.
- Low quality reduces streaks, cloud and ripple counts and disables evening moths. Weather resources are disposed on area changes; no reflection render targets are used.
- Pushable spools/cans with damped motion and static-obstacle checks. Occasional paper gust / small-find events during active outdoor play.
- Crow exchange: offer one carried coin or foil, explore for 90 seconds, then collect a saved gift. Bag capacity is checked before consuming the gift.
- Enter the old boot near (-5,19) for a decorated refuge with a one-time collectible; leave by the marked front exit.
- Verified game regression checks, weather/shelter transitions, reflection materials, pushing, saved crow trades and hideout entry/exit/gift persistence using the Three.js logic harness. Weather shaders and full mobile appearance remain unverified because the browser has no WebGL context.

## Build 43 — rainwater, footprints and playful scavenging
- Hollow modelled rain cups near the junkyard entrance and in outdoor areas visibly fill during rain. Collect one drink at a time; remaining water persists in the save. Capacity is three drinks; rain fills one in 35 seconds of active outdoor play.
- Instanced wet pawprints trail behind Pip on wet ground and fade; soft splash sounds accompany rain footsteps. Low quality reduces the displayed footprints.
- A rolling spool conceals a one-time collectible cache in each outdoor area; moving it aside reveals the object. Collected caches remain cleared after loading.
- Springy sponge pads bounce Pip using the existing jump motion and normal air controls.
- Instanced drifting leaves and quiet synthesised rustling, plus wind chimes near shelter that sway and ring when nearby in wind.
- Regression harness verifies rainwater/save, cache persistence, bounce launch, footprints and cleanup. Rain cups use an original hollow lathe mesh, so the rising water is visible rather than hidden inside a solid cup.
- GPU/mobile visual quality still needs an in-game check; no new third-party art or music added.

## Build 44 — supplied blossom trees and wildlife

Seven supplied GLBs are integrated as mobile adaptations (approximately 13.2 MB combined, versus 364 MB supplied). All are static meshes: the files contain no animation clips or skin rigs. Flying models follow gliding routes with banking; stationary animals have subtle whole-model breathing/sway and optional treat interactions. These are not new skeletal walking, flapping or eating animations.

- Junkyard: Sakura near the lane, a cherry-tree row beyond the fence, golden-eared hound outside the yard and an osprey overhead.
- Rain garden: Sakura, curious squirrel and a kingfisher on a small flying route.
- Laundry courtyard: cherry trees and the supplied cartoon bird group on a perch.
- Wind-responsive blossom petals; models load by area with at most two simultaneous downloads. Heavy model shadows are disabled; low quality hides the overhead osprey.
- Models were simplified and normalised in Blender; textures reduced to at most 768 px and compressed. Identical secondary UV sets were remapped to UV0 for Three.js r128 compatibility. Source base colours and supported material maps retained.

### New asset credits

These five models carry CC-BY 4.0 metadata in their supplied files; original source attribution is retained inside the adapted GLBs. [CC-BY 4.0 licence](https://creativecommons.org/licenses/by/4.0/).

| Adapted file | Original work | Creator |
|---|---|---|
| `sakura-build44.glb` | [Sakura Tree 01 – Low Poly Model](https://sketchfab.com/3d-models/sakura-tree-01-low-poly-model-147ae7d0d332456a99ec6195e9b0cd4f) | Jogoss |
| `kingfisher-build44.glb` | [Common Kingfisher – Flying 3D Bird](https://sketchfab.com/3d-models/common-kingfisher-flying-3d-bird-44ef45b642164284af3fe15837f0b7c6) | Pigcraft |
| `osprey-build44.glb` | [Osprey – Flying Raptor Rigged Bird](https://sketchfab.com/3d-models/osprey-flying-raptor-rigged-bird-9e65ce0542a24ea388e81e3e6e9c9054) | Pigcraft |
| `hound-build44.glb` | [Golden-Eared Hound Dog](https://sketchfab.com/3d-models/golden-eared-hound-dog-3d-model-free-8269f0b38a04400cad281b48696674ab) | iRahulRajput |
| `squirrel-build44.glb` | [Curious Squirrel](https://sketchfab.com/3d-models/curious-squirrel-0b5e2372910c4bd18e5c2fe2f1ee0b4c) | iRahulRajput |

`cherry-build44.glb` is adapted from the owner's supplied `jersey_lowpoly_cherry_trees.glb`; `songbirds-build44.glb` is adapted from the owner's supplied Meshy cartoon-bird model. No third-party licence is asserted for these two files.

Validation: rendered individual optimised models in Blender; checked normalisation and bird heading. All seven GLBs parse in Three.js r128; scene-specific loading, finite motion, interactions and cleanup pass alongside existing regression checks. Full game GPU/mobile visual performance remains unverified because the cloud browser has no WebGL context.

## Build 45 — Everyone in the main backyard

All seven supplied models now appear together in the main backyard: Sakura inside the front fence, cherry trees along the rear boundary, the hound and perched cartoon birds on the right, squirrel beside the Sakura, kingfisher over the front clearing and osprey overhead. These additions no longer require visiting the garden or courtyard. Existing animal interactions and mobile asset optimisations are retained.

## Build 46 — Animal proportions and backyard additions

- Rescaled Zaytona, the fence cat, crow, hound, squirrel, kingfisher, osprey and cartoon bird group against Pip's outdoor height (about 0.5 world units). These are consistent stylised gameplay proportions, not biological measurements.
- Added the supplied animated five-bird flock, retaining its original skeletal animation, plus 16 grass patches around fence edges and scrap piles. All additions are in the main backyard.
- Added the supplied Meshy scrap-corner scene at the right of the yard: dumpster, bags, stairs, railings and hydrant. Search near its front for supplies; remaining contents persist in the save. Conservative collision bounds also keep Zaytona's route clear. The original enterable dumpster remains available.
- The re-supplied osprey is represented by the existing optimised osprey asset, now at a smaller span; it has no animation clips in the supplied source.
- Reduced the 120 MB scrap-corner source to an 18,000-triangle model of about 0.8 MB with compressed textures. Shared grass geometry, two concurrent model downloads, and no heavy-mesh shadows retain mobile limits.

Additional credits (source metadata retained in adapted files):

| File | Creator / source | Licence |
|---|---|---|
| `bird-build46.glb` | [Bird — Blender Artist](https://sketchfab.com/3d-models/bird-e93a906eb38343c4a14458a637136329) | CC-BY 4.0 |
| `grass-build46.glb` | [Low Poly Grass — Natural_Disbuster](https://sketchfab.com/3d-models/low-poly-grass-c7b3cadd101245d899ca49fa587b2745) | CC-BY 4.0 |
| `dumpster-build46.glb` | Owner-supplied Meshy steel-dumpster scene | Owner supplied |

Validation: actual grass, flock and scrap-corner meshes inspected through Blender renders; all ten optional asset types parse with Three.js r128. Checked animation advancement, scale settings, grass count, searchable contents, collision registration and scene cleanup alongside the existing gameplay regression checks. Full-game GPU/mobile visual performance remains unverified in this environment.

## Build 47 — The planted backyard

### Environment
- Replaced the old dirt/paving appearance with a continuous, non-repeating grass-and-earth surface. Thousands of instanced grass blades cover the yard, with worn paths around the gate and scavenging routes. Removed the older yard ground overlays and paving layer; softened procedural wood and steel finishes.
- Added eight leafy trees and daisy clusters extracted from the supplied vegetation collection; five squirrels now sit by trees. New tree meshes share cached geometry and have no shadows; grass density drops on low quality.
- Added an original wooden doghouse and water bowl beside the hound. Moved the supplied perched cartoon-bird group onto a power pole with crossarms and suspended cables.
- Added two original procedural raccoons beside the main dumpster, with head, tail and leg motion. The previously supplied game-ripped raccoon is not used.
- Added wind sway to new trees and grass, drifting pollen in dry weather and animated cloud shadows over the lawn. Existing rain, wind, sky and wet-weather effects are retained.

### Movement and menus
- Movement uses the camera orientation currently on screen. Indoor movement is slower, re-clamps after furniture collisions and drives walking/idle animation from actual displacement. Removed the competing house camera update; arrow keys can also leave a seat or bed.
- Larger menu typography, readable ingredient counts, larger buttons and sticky action controls.
- Inventory now has visual item rows, search, categories, pagination, a capacity meter and separate furniture/tool views. Item details offer eating/drinking, placement and reclaiming. At home, materials can be moved to the pantry while food stays in the satchel.
- Crafting adds batch quantities, maximum craftable amount, scaled ingredient requirements and saved favourite recipes. Ingredient-to-output growth is capacity-limited when no pantry is available. Search fields no longer trigger gameplay keyboard shortcuts.

### Additional assets
[Low poly trees, flowers and grass](https://sketchfab.com/3d-models/low-poly-trees-flowers-and-grass-442904f26b87407d98871b50b49c4169) by **Márcio Meireles**, CC-BY 4.0: selected trees and daisies, base-centred and normalised, with textures reduced to 512 px and compressed. Adapted files: `broadleaf-build47.glb`, `slender-build47.glb`, `flowers-build47.glb`. Original source credit is retained inside each GLB.

The re-supplied `low_poly_grass.glb` is represented by the existing credited grass asset. The separate `grass.glb` lists Sketchfab Standard licensing and is not included under this project's CC0/CC-BY-only rule. Raccoons and doghouse are original code-created models.

Validation: new vegetation inspected through actual Blender renders; all 13 optional asset types parse with Three.js r128. Checked grass/tree/animal counts and finite animation, indoor input across four camera headings, furniture/wall bounds, stop-to-idle, batch crafting, saved favourites, inventory categories and closing, existing dumpster pickups, scene cleanup and reload. Full-game GPU/mobile appearance remains unverified: this environment's browser cannot create a WebGL context.

## Build 48 — Beyond the garden fence

- Fixed imported dirt/paving visibility checks to recognize GLTFLoader's underscore-normalized node names. Removed the overlapping cloud-shadow plane, primitive backyard stem bundle and sponge billboard. Shorter, darker curved grass replaces the oversized pale spikes.
- Moved the kennel to a clear area and separated the hound and water bowl from its doorway.
- Used the supplied cinematic Pip artwork on the title/opening display. The supplied rat photo now has a wood frame and cream mount with its original aspect ratio. First home entry installs it once; existing placed portraits and later decoration choices are preserved. New-game resets this migration.
- Added the city set beyond the front boundary. Added the supplied MMA animation on a raised neighbouring gym platform beyond the right fence, with the tracksuit tabby as a spectator. These props are outside the playable bounds. MMA retains its original rig and clip; the supplied tabby is static with subtle procedural breathing.
- Replaced wood and steel finishes with 1024px photographic texture maps, including imported timber, drums, craft materials and the kennel. Optional models retain cached loading and no heavy-mesh shadows. Optimized tabby: about 18,000 triangles / 0.57 MB; city: about 31,000 triangles / 2.25 MB; MMA: 3.16 MB with its original animation.

Additional credits:

| Asset | Creator / source | Licence / adaptation |
|---|---|---|
| `city-build48.glb` | [CCity Building Set 1 — Neberkenezer](https://sketchfab.com/3d-models/ccity-building-set-1-a2d5c7bfcc2148fb8994864c43dfcc97) | CC-BY 4.0; normalized and textures compressed |
| `mma-build48.glb` | [MMA Ground and Pound — mortaleiros](https://sketchfab.com/3d-models/mma-ground-and-pound-25a4f48cc84a41078aa41109f02fe3a2) | CC-BY 4.0; textures compressed, rig and animation retained |
| `tabby-build48.glb` | Owner-supplied Meshy tracksuit tabby | Mesh simplified, normalized and textures compressed |
| `wood_planks-build48.jpg` | [Wood Planks — Amal Kumar / Poly Haven](https://polyhaven.com/a/wood_planks) | CC0; resized to 1024px |
| `rusty_metal_sheet-build48.jpg` | [Rusty Metal Sheet — Amal Kumar / Poly Haven](https://polyhaven.com/a/rusty_metal_sheet) | CC0; resized to 1024px |
| `opening-build48.png`, `rat-picture-build48.jpg` | Images supplied by the owner for this game | Used as supplied |

Validation: actual optimized city/tabby meshes inspected in Blender. Three.js r128 parses all 16 optional asset types; checked MMA animation advancement, city/MMA bounds, dog/kennel separation, hidden original paving/dirt, one-time photo installation, indoor movement at four camera headings, inventory, batch crafting, save persistence, dumpster pickups and scene reload. JavaScript syntax passes. Full-game GPU/mobile appearance remains unverified because this environment's browser cannot create a WebGL context; the flicker fix is verified structurally, not by a GPU rendering test.

## Build 49 — Room to breathe

- Removed the small shed's triangles from the merged yard geometry and removed its collision box. Kept the home interior and Home control. Removed the obsolete block skyline and roof-drip effect attached to the shed.
- Replaced towering primitive resource plants and large coloured food blobs with low, rat-sized collectible leaves, cut fibres, pebbles, seed/crumb clusters, acorns and small water caps. Gathering and survival supplies remain available.
- Added a permanent **Climb out** button inside the dumpster. Exit takes priority over nearby loot, including when the bag is full. Pip now emerges on clear ground beside the dumpster rather than inside its re-entry trigger.
- Removed the dumpster's competing fixed-camera updates. House and dumpster controls use the orbit heading; their cameras follow without positional lag that can cross over Pip and flip the apparent input direction. Both interior cameras initialize before movement.
- Big Rat is 1.35 units tall (previously 0.8), near the entrance at (5, 24.8), with a small identifying sign. Model, dialogue and collision positions are updated together. The existing recorded dialogue is retained.
- Moved the supplied perched bird group to a low bracket on the entrance fence, where it is closer to eye level. The existing kingfisher and osprey assets represent the re-supplied files; neither source has animation clips.
- Added the supplied low-poly city collection behind the opposite/rear fence, retaining the previous front-side city. The new collection has about 7,150 triangles and is normalized, base-centered and compressed to about 1 MB. It stays outside the playable area.

Additional credit: [Low-poly City Buildings](https://sketchfab.com/3d-models/low-poly-city-buildings-e0209ac5bb684d2d85e5ade96c92d2ff) by **smooth998**, CC-BY 4.0. Adaptation: normalized origin/scale, 512px compressed textures, unsupported secondary-UV metallic/roughness texture replaced with scalar roughness for Three.js r128. File: `cityrear-build49.glb`; original credit retained in metadata.

The supplied City Props Collection volume 1 by TampaJoey lists Sketchfab Standard licensing. It is not published under the project's CC0/CC-BY-only rule.

Validation: Three.js r128 runtime checks confirm shed geometry/collision removal, low resource bounds, rear-city bounds, all 17 optional asset types, four joystick directions at four camera headings in both interiors, exit priority and no immediate dumpster re-entry, existing house movement/bounds, inventory, batch crafting, save persistence and scene reload. JavaScript syntax passes. Full-game GPU/mobile visuals remain unverified.

## Build 50 — A moment next door

- Moved the neighbouring gym closer to the right fence, with its platform at 3.7 units and fighters at 3.8, above the 3.5-unit fence. The entire platform remains outside the playable bounds.
- MMA is a one-time neighbourhood event per save. The original clip waits until Pip is nearby and its focal point is within the camera view and clear of gameplay collision boxes. It pauses offscreen, resumes when watched, plays with `LoopOnce`, holds the final pose for a second, then fades out. The save records it when started, so leaving/reloading does not restart it. New Game resets it. No forced camera movement or player lock.
- Raised both city backdrops vertically by 60% while preserving their footprints and out-of-bounds locations.
- Removed the pink cherry-tree row outside the rear fence. The sakura inside the backyard is retained.

Validation: runtime tests cover waiting until visible, starting and saving once, offscreen pause, clip completion/fade, no replay on backyard revisit, taller city transforms, removal of the outside cherry row, and existing movement, inventory, dumpster exit and scene-reload checks. JavaScript syntax passes. Full-game mobile/GPU visuals remain unverified.

## Build 51 — Opening film

- Added the owner's supplied five-second PixVerse MP4 as the opening film when starting or continuing a game. The 640×360 H.264 video has no audio track. Its original video stream is retained; the MP4 metadata is moved to the front for progressive playback.
- Plays inline on phones, keeps the full image visible, and provides a permanent Skip intro control. A Play opening button appears if the browser rejects playback without another gesture.
- Completion or skipping enters gameplay. Continue preserves the loaded save; New Game follows the existing fresh-game reset. Gameplay simulation pauses while the film is shown.
- Video failure falls back to the original generated opening for new games, or directly to the saved house for Continue.
- Asset: `opening-build51.mp4`, owner-supplied `pixverse-v6-image (1).mp4`.

Validation: ffprobe confirms H.264 format and 5.04-second duration; full ffmpeg decode completes without errors. JavaScript syntax and runtime checks cover completion, skip/idempotence, save preservation, new-game reset, simulation pause, playback rejection UI and media-error fallbacks. Existing regression checks pass. Actual mobile browser video playback and GPU game rendering remain unverified.

## Build 52 — Trouble next door

- Replaced the once-per-save ambient MMA event with an automatically framed opening sequence after the supplied MP4. It plays on every Start/Continue, irrespective of the old `gymSeen50` save flag.
- Waits for the actual MMA model and clip before playback, gives the camera a short settling interval, frames the stage for portrait and landscape, hides the HUD and locks gameplay input. The game-loop visibility guard pauses the scene in a hidden tab. Skip scene/Escape remains available; missing-asset errors offer Skip to avoid trapping the player.
- Rebuilt the platform using timber posts, beams and ten individual planks. Near the clip's end, boards shake with a synthesized creak. They collapse after the clip, and the fighters drop behind the fence and disappear amid dust and a synthesized crash.
- The broken platform remains for the current play session. Starting again restores the platform and replays the scene. The supplied clip itself plays once per sequence, without looping.
- Continue returns to the saved house without resetting inventory; New Game returns to the backyard. The opening MP4 from build 51 is included in this release.

Validation: runtime tests check portrait/landscape framing, load/warmup delay, hidden-tab pause, completed animation, plank collapse, fighter removal, preserved inventory, broken-platform revisit, replay on another Start, Skip, new-game reset and dumpster exit. JavaScript syntax passes. Full-game mobile/GPU visual rendering remains unverified.

## Build 53 — Sounds of home

- Added an original synthesized felt-key melody, soft window rain, a water swell and quiet wooden creaks to the supplied opening video. Audio is embedded as stereo AAC in `opening-build53.mp4` alongside the unchanged H.264 video stream, keeping playback/Skip synchronized. No commercial recording or third-party music is used. The game's Sound setting controls video muting.
- Removed the automatically framed MMA opening cutscene. Opening-video completion now enters ordinary gameplay directly, preserving Continue saves.
- The fight is a backyard event: it waits until Pip is nearby and the platform is in view, gives a short location hint, and pauses offscreen. Player movement and camera control remain available; the event never takes over the camera.
- Retained the creaking, collapsing timber platform, dust, crash and disappearing fighters. It plays once during that play session and resets on the next Start/Continue. The collapsed platform remains on backyard revisits.

Validation: H.264 video/stereo AAC confirmed and the complete MP4 decodes without errors. Runtime checks cover save/new-game transitions, video mute, no forced cutscene, proximity/view gating, unchanged camera/player control, offscreen pause, completed collapse, session replay reset and dumpster exit. JavaScript syntax passes. Actual mobile playback and full-game GPU visuals remain unverified.


## Build 54 — Rooftop rumble

Moved the gameplay fight onto a raised timber platform directly above the dumpster. Fighters are 40% larger; the location hint points up. Platform supports sit outside the dumpster footprint. Collapsing boards disappear before obstructing the scavenging space. The event still waits for visibility, keeps player control and plays once each session.


## Build 55 — A clearer view

- Excluded the MMA asset's oversized static floor from rendering and character normalization. The actual pair now spans 4.6 world units, faces side-on and sits on a lower platform at the front of the dumpster. Extra HUD panels hide while the nearby fight is in view; movement and camera remain available.
- Bundled the existing MIT-licensed Three.js r128 locally, disabled expensive startup antialiasing, added WebGL1 recovery and explicit graphics/load error messages. Core downloads have a 45-second deadline; optional animal downloads no longer gate Start. Failed downloads expose Retry instead of leaving a permanent loading message.

Validation: actual skinned fighter bounds verified at 3.82 units tall and 4.6 units across the pair; gameplay/collapse/session-reset checks pass. Stalled optional downloads no longer gate Start, and core-download deadlines pass. Full GPU visual verification remains unavailable because the test browser cannot create a WebGL context.


## Build 56 — Keep swinging

Reduced the fighters from 4.6 to 3 world units across (35% smaller). Removed proximity and camera-visibility playback gates: the fight starts during backyard gameplay as soon as the asset is ready and runs through to the platform collapse, even when Pip turns or walks away. Standard game pauses remain. The fight still runs once per session.


## Build 57 — Solid footing

Ramp collision uses the visible plank angle, thickness and scale. Grounded feet snap to support surfaces. Sponge and imported tyre meshes provide downward landing contacts; spring impulses follow a brief sponge compression or rubber landing, capped for high falls. Zaytona and spectator cat are 25% smaller. The doghouse-side gap has an opening timber gate. The spectator platform has posts. Added landing squash/knee bend, surface sounds and a compact radio panel which closes when walking away.

Validation: real Three.js raycasts verify ramp surface agreement, sponge support/launch and imported tyre high-speed landings with capped bounce. Gate latch and radio walk-away checks pass. GPU/mobile visual verification remains unavailable.


## Build 58 — Backyard sounds

Added synthesized wind/foliage ambience, spaced bird calls, nearby dog barks and clip-time fight thuds. Effects attenuate with distance and pan across the camera; mute/hidden-tab/scene changes stop them. A newly synthesized piano arrangement of Beethoven's 1824 Ode to Joy theme plays during gameplay, independently toggleable with Music. No third-party sound recording is used.

Pip orientation is now measured in model-local coordinates, independent of the spawn heading; this corrects the house/backyard mismatch. House stride follows actual movement, with no walking animation from furniture pushout while idle or footsteps in midair.

Validation: real rig head direction checked against all four spawn headings, indoor movement checked, and Web Audio scheduling/mute logic checked with an instrumented audio context. Audible balance and full mobile rendering remain unverified.


## Build 59 — Steady steps

Removed competing legacy backyard camera updates, reduced the camera near plane and increased its minimum collision distance. Mobile running activates at 72% joystick deflection, runs at 2.05x walk speed, and uses a consistent Run clip. Backyard walking increased to 3.15 units/second.

Big Rat is 1.85 units high at the main entrance, with posed geometry used for grounding and source root-motion animation removed. Crow destinations no longer include a floating shelf coordinate; landing recalculates the resting model's base. Added eight collectible steel rods to salvage piles, recovered as metal/nail crafting parts.


## Build 60 — Treasures worth finding

Wider Big Rat dialogue framing and restored cat sizes. Added a permanent home storage chest for materials, furniture and unique treasures, with home crafting drawing from stored materials. The workshop separates Craft/Place/Repair/Recycle and renders larger 256px lit previews with rotation and size inspection. Added an old brown entry door and a display shelf populated by discoveries.

Five unique finds persist once per save: a damaged turntable, three Beethoven-theme records with distinct synthesized arrangements, and a brass star. The player must uncover and collect them along tyre, sponge, fence and dumpster climbing routes. Added crates, narrow beams, hidden box/drawer/loose-board reveals, a lowered shortcut, ledge recovery, higher capped spring jumps and pickup cards. Unique items are stored safely as furniture, never consumed by ordinary crafting.

Validation: runtime checks cover reveal-before-reward, unique reward idempotence and persistence across scenes, chest material consumption, home props, workshop/repair/record menus, preview rendering calls, dumpster route creation and ledge recovery. JavaScript syntax passes. Mobile/GPU visuals and full route playthrough remain unverified.


## Build 61 — Scrap Workbench

Implements the selected workbench concept: warm illustrated workshop backdrop, large rotatable previews of actual game models, illustrated ingredient counts, missing-material hints, one Craft action, and related recipes. Backpack/chest consumption, batch crafting, station requirements, save data and placement retain the existing game logic. Clear close control and scrollable mobile layout. The original AI-generated workshop backdrop is compressed and embedded in the HTML; no new external asset dependency. The mockup is art direction, not a promise of photorealistic world graphics.

Validation: JavaScript syntax and runtime checks passed for available/missing materials, backpack plus chest consumption, rotating previews, craft success, recipe browsing, closing, and backpack-only crafting outdoors. Runtime harness uses real Three.js math with a stub renderer. Browser preview was blocked by ERR_BLOCKED_BY_CLIENT for the local preview address, so actual GPU rendering and mobile visual fidelity remain unverified.


## Build 62 — Grounding and collision consistency

Removes floating decorative map signs. Imported yard props and the supplied dumpster use visible mesh geometry for body collision and ground support, avoiding obsolete invisible cuboids and preserving openings under raised objects. Climb candidates without matching visible tops are excluded. Parkour platforms block at their actual deck height rather than extending an invisible solid column to ground. Shortcut steps now have visible matching geometry. Stepping off a surface starts falling; automatic ledge recovery requires explicit grab input and respects a drop cooldown. Jump can release a ledge recovery. Dumpster side resolution no longer freezes vertical falling. Existing mesh textures do not control collisions. Grass, foliage and loose pickup items remain nonblocking.

Validation uses real Three.js meshes, raycasts and imported yard geometry: falls from raised yard and interior routes, no automatic recapture, release during ledge recovery, visible versus hidden solid collision, support height, texture-independent solidity, and no snap onto overhead platforms. This is a targeted collision audit, not a claim that every scene prop has had a full phone playthrough. Browser visual verification remains unavailable in this environment.


## Build 63
Dialogue camera fits the actual posed Big Rat bounds and portrait field of view. Wider default gameplay camera. Continuous ground and adjoining streets conceal the abrupt yard/city ground edge. Raccoons removed. Central imported table/stairs removed together with their mesh collision. Parkour tables become solid crate supports with corresponding collision. A single edge-hinged house door replaces the center-pivot door. Home controls start closed and open a three-choice menu; finish controls move to the bottom. Workbench detail hides advanced controls and related recipe clutter, keeping one recipe, materials, craft action and recipe browser. Includes unpublished build 62 collision fixes.

Validation: actual Big Rat posed bounds fit the portrait camera projection (maximum screen coordinate 0.523, safely inside ±1). Tests passed for raccoon removal, continuous ground creation, door hinge position, closed-by-default home UI, recipe navigation, and inherited collision/falling checks. Mobile visual fidelity and the city transition still require a rendered phone playthrough; no new screenshot is claimed.


## Build 64 — Collision performance fix
Static scenery collision triangles are indexed into nearby spatial cells without changing rendered meshes or collision shape. Removes duplicate player collision resolution and caches the static Big Rat posed bounds for dialogue. Existing collision and UI regression checks pass. A matched CPU query benchmark (180 ground/body queries, same imported yard, warmed once) improved from 1957 ms to 52 ms, about 38 times faster for this workload. This measures collision CPU time, not phone FPS; GPU performance and full phone rendering are not verified.


## Build 65 — Clear controls, physical water and home crafting

- Compact Bag / Craft / Menu controls, readable recipe sheets, and settings moved off the main view. Bag shows used / capacity (60 parts; 120 with the backpack upgrade). Tracked ingredients are shown in the bag.
- Cup shell and interior floor use the visible mesh for collision. Landing in its water produces a pooled ripple, droplets and an original synthesized splash. The rat can jump back above the rim.
- Home furniture, chest and display shelf use mesh collisions; removed the old circular furniture barriers. Returning or recycling decorations sends any bag overflow to the chest.
- Crafting table unlocks a functional oven, fueled fireplace and homemade vinyl player. Oven recipes produce food. A lit fireplace dries nearby Pip and restores stamina. Vinyl player uses existing original synthesized Beethoven performances and collected records.
- Three craftable window shapes, two craftable door shapes with the edge hinge preserved, and direct wall-paint / floor-finish controls. Crafting a door installs it; owned styles can be refitted without another recipe.
- Crafting takes material counts from the bag and home chest. Recipe success can lead directly into furniture placement.

Validation: Node syntax check and real Three.js runtime checks for mesh collision, cup landing/exit, splash lifetime, bag capacity and overflow, crafting station gates, recipe consumption/output, fireplace effects, modal navigation, placement and door hinge. Existing collision/falling/portrait-camera regressions also pass. The runtime harness does not render GPU pixels; mobile appearance and device frame rate are not verified by these checks.


## Build 66 — Contextual motion and neighbourhood audio

- Two new procedural skeletal clips on the existing Pip rig: rope climbing and swimming. The original 14 imported clips remain. Rope paw contact uses a small iterative arm solver while the legs alternate.
- A knotted rope beside the final crate on the tyre route: Grab to attach, joystick up/down to climb, Jump or Grab to release. Reaching the top transfers Pip onto the actual crate surface.
- Deep water in the rain cup triggers buoyancy and paddling. Jump leaves the water; existing splash/ripple effects remain.
- Original synthesized distant traffic and occasional horns; hound barks on approaching within five world units, with cooldowns. Zaytona has three meow contours and occasional expressive device-voice chatter.
- The perched songbird trio discuss fictional backyard politics. Nearby speech uses available English device voices and subtitles, with cooldowns and no overlapping ambient speakers. Leaving hearing range, muting, menus, dialogue, scene changes and backgrounding stop ambient speech/audio.
- Removed the stale part count from the Home button and the large gust-description toast. Moving paper remains visible.

Validation: syntax and real Three.js runtime checks for clip attachment, rope ascent/pause/descent/release/top transfer, swimming/jump exit, muted rope prompts, bark cooldowns and subtitle fallback. A Web Audio/speech API mock checks audio graph creation/teardown and single-speaker scheduling. Prior falling, collision and dialogue-camera regressions pass. Animation appearance and audio timbre have not been verified on a physical phone; speech voices differ between browsers/devices.
