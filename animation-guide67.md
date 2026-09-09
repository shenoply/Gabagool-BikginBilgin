# Rat animation pack — first pass

The supplied character now has 35 joints (24 original + 11 tail joints). Its original mesh, texture and 14 original animation entries are retained. The initial 13 additions and this expansion of 34 clips bring the total to 61 entries: 60 motion clips and the original static pose.

These are custom procedural keyframes, not motion capture. The exported mesh was rendered for visual review. The roll and falls remain first-pass motions: body contact, hand placement and transitions should be polished in the actual game. The tail has automatically fitted weights; extreme poses may expose creasing near its attachment.

| Clip | Seconds | Playback |
| --- | ---: | --- |
| Rope_Climb_Loop | 1.8 | Loop, in place |
| Swim_Forward_Loop | 2.0 | Loop, in place |
| Swim_Tread_Loop | 2.0 | Loop, in place |
| Forward_Roll | 1.5 | Once, forward root movement |
| Fall_Forward | 1.15 | Once, hold final pose |
| Fall_Backward | 1.25 | Once, hold final pose |
| Hide_Enter | 0.7 | Once |
| Hide_Idle_Loop | 3.0 | Loop |
| Hide_Exit | 0.8 | Once |
| Sneak_Walk_Loop | 1.8 | Loop, in place |
| Tail_Idle_Sway_Loop | 3.0 | Loop |
| Tail_Alert_Flick | 0.85 | Once |
| Tail_Whip_Attack | 1.25 | Once |

## Connecting the clips to a game

- Play Hide_Enter, then Hide_Idle_Loop while hiding, then Hide_Exit. The lowered tail reduces the standing silhouette. These clips do not change enemy detection or collision bounds by themselves.
- Rope climbing needs a rope attachment point, character alignment and upward movement from game code. There are no finger bones, so the hands cannot close around the rope independently.
- Swimming needs buoyancy, water-level placement, forward movement and splash effects from game code. Swim_Tread_Loop is the stationary alternative.
- Tail_Whip_Attack contains the visible wind-up, swing and recovery. A suggested damage window is 0.43–0.64 seconds, recorded in the animation extras. Add a hitbox following the tail and apply damage in the game.
- Forward_Roll moves approximately 1.55 metres along the asset's forward +Z direction. Falls move approximately 0.45 metres forwards/backwards. Handle root motion once: either extract it into the character controller or remove that travel and drive movement in code. Rig translations use centimetres beneath the original 0.01-scale Armature.
- For one-shot clips, use one playback and hold the last frame where appropriate. Blend into/out of clips over roughly 0.12–0.2 seconds, then tune for the game.
- All new clips include full-body pose channels. To use a tail clip as an overlay while walking, first filter it to the Tail_01 through Tail_11 tracks; otherwise it also applies the standing body pose.

## Checks completed

- Decoded all exported accessors and checked finite numeric values.
- Checked skin weights and joint-index bounds.
- Checked quaternion normalization, strictly increasing keyframe times and matching sampler lengths.
- Checked that new looping clips have matching first and last frames.
- Rendered the actual skinned character at multiple points in each requested motion.

No game project was supplied with this task, so controller integration and in-engine verification are not included.

## Tail whip revision 2

Reworked at 60 fps with a lowered tail wind-up, broad lateral sweep, delayed motion along the tail, body rotation, follow-through and recovery. The attack remains in place and starts and ends at the same idle pose. Watch Tail_Whip_Preview.mp4 for the revised clip at normal and half speed; the earlier full-pack preview shows the first version of this attack.

## Full expansion — 34 new clips

All twelve requested animation categories are included. These remain custom procedural animations requiring contact and transition tuning in the game. The character has short arms and no finger bones; close hand-to-face actions are approximate and tools cannot be gripped with separately animated fingers.

| Clip | Seconds | Playback |
| --- | ---: | --- |
| Peek_Left | 1.4 | Once |
| Peek_Right | 1.4 | Once |
| Ledge_Grab | 0.5 | Once |
| Ledge_Hang_Loop | 2 | Loop |
| Ledge_Pull_Up | 1.8 | Once |
| Shake_Off_Water | 1.65 | Once |
| Carry_Pickup | 1.5 | Once |
| Carry_Heavy_Walk_Loop | 1.6 | Loop |
| Carry_Idle_Loop | 2.4 | Loop |
| Carry_Put_Down | 1.4 | Once |
| Get_Up_Front | 1.8 | Once |
| Get_Up_Back | 2 | Once |
| Tail_Combo_First | 1.25 | Once |
| Tail_Combo_Reverse | 1.15 | Once |
| Tail_Combo_Spin_Finisher | 1.35 | Once |
| Dodge_Left | 0.65 | Once |
| Dodge_Right | 0.65 | Once |
| Squeeze_Enter | 0.75 | Once |
| Squeeze_Shuffle_Loop | 1.6 | Loop |
| Squeeze_Exit | 0.75 | Once |
| Rummage_Loop | 1.5 | Loop |
| Inspect_Find | 1.6 | Once |
| Pocket_Find | 1.2 | Once |
| Craft_Hammer_Loop | 0.85 | Loop |
| Craft_Saw_Loop | 1.1 | Loop |
| Cook_Stir_Loop | 1.5 | Loop |
| Warm_Hands_Loop | 2 | Loop |
| Idle_Sniff | 1.8 | Once |
| Idle_Scratch_Ear | 2 | Once |
| Idle_Rub_Nose | 1.6 | Once |
| Idle_Look_Around | 2.5 | Once |
| Danger_Freeze | 0.4 | Once |
| Danger_Lower | 0.75 | Once |
| Danger_Back_Away | 1.8 | Once |

### Sequences and placement

- Peeking: enter the existing Hide_Idle_Loop, play Peek_Left or Peek_Right, then return to Hide_Idle_Loop.
- Ledges: Ledge_Grab → Ledge_Hang_Loop → Ledge_Pull_Up. The authored ledge is approximately 1.45 m high, facing +Z; pull-up ends about 0.75 m forward and 1.45 m higher. Align the ledge to hand targets and fit collision in the game. These are first-pass pull-up poses, not a physics-driven climb.
- Carrying: Carry_Pickup → Carry_Idle_Loop / Carry_Heavy_Walk_Loop → Carry_Put_Down. Add the carried object between the hands; it is not embedded in the character file.
- Recovery: Get_Up_Front begins at the end pose of Fall_Forward. Get_Up_Back begins at the end pose of Fall_Backward. Their forward/backward offsets match those fall clips; do not apply the displacement twice.
- Combat: chain Tail_Combo_First → Tail_Combo_Reverse → Tail_Combo_Spin_Finisher. Suggested hit windows are stored in animation extras. Damage, knockback and hitboxes are game logic. The finisher includes a full body turn, with no forward travel.
- Dodges: Dodge_Left and Dodge_Right travel approximately 0.65 m along the character's local X axis. Extract the root motion or drive the controller and remove the animated travel.
- Gaps: Squeeze_Enter → Squeeze_Shuffle_Loop → Squeeze_Exit. The character turns approximately 80 degrees. Collision geometry must still fit the gap; this animation does not make the mesh physically narrower.
- Searching: Rummage_Loop → Inspect_Find → Pocket_Find. Attach and hide/show the found item at the appropriate moment. The character has no modelled pocket; fit the pocket gesture to clothing or a bag in the game.
- Crafting: attach a hammer, saw or spoon to RightHand, and position the table, pot or fire to fit. Warm_Hands_Loop does not include a fire. The preview intentionally shows the character motion without those props.
- Danger: Danger_Freeze and Danger_Lower finish in alert poses; blend from there into Danger_Back_Away. Backing away travels approximately 0.35 m toward local -Z.
- Shake_Off_Water contains body and tail motion; water droplets, sound and wet materials need game effects.
- Blend loops and one-shots over roughly 0.1–0.2 seconds as a starting point. Get-ups, ledges and squeeze transitions need particular care with contacts. Full-body channels mean these clips should not be layered indiscriminately over locomotion.

### Verification of this expansion

The 27 previously saved animation entries were preserved while adding this set. The exported file contains 61 unique clip names. All 34 new clips were checked for valid quaternion lengths, finite outputs, strictly increasing timestamps, matching sampler lengths and matching loop endpoints. Multiple mesh poses were rendered for each clip, with additional right-side checks for hand actions. No game project was supplied, so these checks do not establish in-engine controller behaviour.
