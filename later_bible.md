# LATER. — Production Bible

Source doc: https://claude.ai/artifact/XxLuY7ovcSggKcNrWf8Xv2 (Nov 22, 2026)

## Overview

**LATER.** is a 3:20 animated short about a student, Theo, who is slowly swallowed by a shadow creature called Later — until he beats it with one 5-minute timer. It replaces "Why We Procrastinate" (5 reasons + 5 fixes) with one story that shows the same lessons in action.

**Chosen path: Option A (vector, Remotion).** The approved look is the Stage 1 test in `remotion-composer/projects/later/` (art.tsx, shots.tsx, later_optionA_test.mp4). See the section "Option A: vector version" at the end. Sections that mention image/video generation (reference sheets, STYLE_BLOCK, negative prompt) apply to Option B; for Option A, use them as the character and art-direction spec.

| Setting | Value |
| --- | --- |
| Runtime | 3:20 (±10 s) |
| Format | 16:9, 1920×1080, 24 fps |
| Shots | 52 shots, avg 3.8 s |
| OpenMontage pipeline | character-animation (atelier mode) |
| Composer | Remotion, hard cuts + a few match cuts; no title cards |
| Voice | Piper (local, free) for now |
| Music | music_library/Better Hands - The Soundlings.mp3 (see Sound) |

## Characters

### Theo (hero)

> **THEO_DESC:** Theo, a 19-year-old student, chibi-leaning proportions (head about 1/3 of body height), round cream-colored face, huge expressive white eyes with small black pupils and a thin highlight, round black-rimmed glasses, messy dark-brown hair with one cowlick sticking up, small nose, oversized mustard-yellow hoodie with the hood down, dark grey sweatpants, white sneakers.

Expressions needed: neutral, panicked (pupils tiny, sweat drop), guilty, exhausted (dark eye bags), crying (big tears), determined (small smile).

### Later (the villain)

Procrastination personified. Small and cute at first, then grows every time Theo gives in. Its size is the story's scoreboard.

> **LATER_DESC:** Later, a soft shadow creature made of smoky black ink, round blob body with no legs, two large glowing magenta eyes and a wide magenta crescent grin, thin wispy arms, faint magenta rim light, edges dissolve into smoke.

Sizes: SMALL (cat-sized, cute), MEDIUM (person-sized), LARGE (fills the room, leaning over), SHRINKING (fading, eyes dimmed). Expressions: friendly sly smile, triumphant grin, scared wide eyes.

### Mochi (the cat)

Mochi reacts to what Theo does: sleeps when he slacks, sits beside him when he works.

> **MOCHI_DESC:** Mochi, a small round orange tabby cat, big round eyes, white chest patch, short tail with a white tip.

## Style bible

> **STYLE_BLOCK:** 2D cartoon illustration, bold clean black outlines of even thickness, flat cel shading with one soft shadow tone, slightly exaggerated expressive faces, simple rounded shapes, detailed but uncluttered room backgrounds, cinematic lighting with strong warm/cool contrast, soft glow on light sources, subtle paper grain, 16:9 widescreen composition, high contrast, YouTube animated short film style.

### Color script

| Act | Time | Key light | Palette | Later's size |
| --- | --- | --- | --- | --- |
| 1 Hook | 0:00–0:15 | Laptop screen only, midnight | Deep navy + cold blue + magenta | Huge |
| 2 The deal | 0:15–1:05 | Warm morning sun through window | Peach, cream, mustard | Cat-sized |
| 3 The slide | 1:05–2:00 | Sun → orange sunset → phone glow | Orange fading to purple | Person-sized → room-sized |
| 4 Rock bottom | 2:00–2:25 | Almost none, red deadline glow | Black, navy, red | Fills the room |
| 5 The turn | 2:25–3:05 | Desk lamp, then sunrise | Warm yellow pushing out magenta | Shrinking |
| 6 End | 3:05–3:20 | Clean dawn light | Soft gold and blue | Tiny, then gone |

### Camera rules

- Mix shot sizes: at least one close-up in every three shots; emotional lines are always close-ups.
- Every shot moves: slow push-in, drift, parallax, or a character action. No locked-off stills.
- Theo is usually off-center (rule of thirds); Later enters from frame edges and shadows.
- Hard cuts by default; a match cut only where the shot list says so. No zoom transitions, no wipes.

## Script

About 380 spoken words. Three voices: a calm Narrator, Theo, and Later (a soft, friendly whisper that turns smug).

| Time | Act | Voice | Line |
| --- | --- | --- | --- |
| 0:00 | 1 Hook | SFX | Clock ticking. Keyboard clatter. |
| 0:03 | 1 Hook | Narrator | 11:58 PM. The essay is due at midnight. |
| 0:07 | 1 Hook | Theo | (whispering) How did this happen… again? |
| 0:10 | 1 Hook | Later | (right in his ear) You said… later. |
| 0:13 | 1 Hook | — | Music hit. Title on black: LATER. |
| 0:16 | 2 The deal | Narrator | Fourteen hours earlier, Theo had a plan. Wake up. Write two thousand words. Done by lunch. |
| 0:24 | 2 The deal | Narrator | He opened the laptop. The blank page stared back. |
| 0:29 | 2 The deal | Narrator | And something small crawled out from under the bed. |
| 0:34 | 2 The deal | Later | Hey… you've got all day. Just five minutes first? |
| 0:40 | 2 The deal | Narrator | Later never asks for the whole day. Only five minutes. That's the trick. |
| 0:47 | 2 The deal | Narrator | Your brain grabs the reward it can feel right now. The essay pays off tomorrow. The scroll pays off this second. |
| 0:57 | 2 The deal | Theo | Okay. Five minutes. |
| 1:05 | 3 The slide | Narrator | Five minutes became an hour. |
| 1:10 | 3 The slide | Narrator | He typed one sentence. Then deleted it. |
| 1:15 | 3 The slide | Later | That's not good enough. Wait until you're ready. |
| 1:21 | 3 The slide | Narrator | Later sounds like a friend. But it talks like your fear. If you never start, you can never fail. |
| 1:31 | 3 The slide | Narrator | So Theo did everything except the one thing. Cleaned his room. Organized his pens. Made a plan for the plan. |
| 1:41 | 3 The slide | Narrator | The essay didn't get any bigger. It just felt bigger. Like a mountain he'd have to climb all at once. |
| 1:51 | 3 The slide | Later | (laughing softly) Tomorrow-you can handle it. |
| 2:00 | 4 Rock bottom | SFX | Hard cut. Clock ticking, louder. |
| 2:02 | 4 Rock bottom | Narrator | 11:59. |
| 2:06 | 4 Rock bottom | SFX | Frantic typing. Clock strikes 12. Error chime. |
| 2:11 | 4 Rock bottom | Narrator | Later never shows up to help. It just leaves you alone with the deadline. |
| 2:19 | 4 Rock bottom | — | Silence. Only rain. Mochi walks over and sits beside him. |
| 2:25 | 5 The turn | Narrator | A week later. A new essay. And Later was already waiting. |
| 2:31 | 5 The turn | Later | Just five minutes first? |
| 2:34 | 5 The turn | Theo | Yeah. Five minutes. (sets a timer) On this. |
| 2:39 | 5 The turn | Narrator | Not the whole essay. One sentence. One source. One paragraph. |
| 2:45 | 5 The turn | Narrator | Phone in another room. A text to a friend: check on me at six. |
| 2:51 | 5 The turn | SFX | Timer rings. He keeps typing. |
| 2:53 | 5 The turn | Narrator | Here's the secret. Motivation doesn't come first. It shows up after you start. |
| 3:00 | 5 The turn | Narrator | With every sentence, Later got a little smaller. |
| 3:05 | 6 End | Narrator | Later will always ask for five minutes. |
| 3:10 | 6 End | Narrator | Give them to the work instead. |
| 3:15 | 6 End | — | Text on black: Start now. |

## Shot list

Shot sizes: ECU extreme close-up, CU close-up, MCU medium close-up, MS medium, WS wide, OTS over-the-shoulder. Shots 1, 3, 13, 38, 49 already exist in `remotion-composer/projects/later/shots.tsx`.

### Act 1 — Hook (0:00–0:15)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 1 | 0:00 | ECU | Theo's eyes behind his glasses, pupils tiny with panic, sweat drop, blue laptop light, dark room | Slow push-in; eyes dart left and right | Clock ticking, keyboard clatter |
| 2 | 0:03 | CU | Wall clock showing 11:58 in a dark room, faint magenta glow creeping over its edge | Minute hand twitches; shadow creeps across the clock face | Narrator: 11:58 PM… |
| 3 | 0:06 | MS | Theo hunched at his desk typing frantically, snack wrappers, Mochi asleep on the bed; on the wall a huge shadow with two magenta eyes (Later, LARGE) | Fast typing; camera pulls back to reveal the shadow | Theo: How did this happen… |
| 4 | 0:10 | ECU | Later's wide magenta grin right beside Theo's ear, his glasses soft in the foreground | Grin slowly widens; smoke wisps curl | Later: You said… later. |
| 5 | 0:13 | — | Black frame; title LATER. | Title slams in with a small camera shake | Music hit |

### Act 2 — The deal (0:15–1:05)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 6 | 0:16 | WS | Bedroom in the morning, warm sunbeams, Theo stretching beside his bed, Mochi on the windowsill | Big stretch; dust floats in the sunbeams | Narrator: Fourteen hours earlier… |
| 7 | 0:19 | MS | Theo at his desk with a confident grin, sticking a yellow note on his monitor, thumbs up | Sticks the note, thumbs up | …Theo had a plan. |
| 8 | 0:22 | CU | Steaming coffee mug beside a closed laptop in morning sun | Steam rises; his hand slides the mug aside | …Done by lunch. |
| 9 | 0:24 | CU | Laptop opening to a blank white document, white light hitting Theo's face | Lid opens; light spreads over his face | Narrator: He opened the laptop… |
| 10 | 0:27 | ECU | Theo's smile fading into a blank stare, the empty page reflected in his glasses | Smile slowly drops; cursor blinks in the reflection | …the blank page stared back. |
| 11 | 0:29 | Low angle | Darkness under the bed, two small magenta eyes opening | Eyes blink open and glow | Low synth swell |
| 12 | 0:32 | MS | Later, SMALL and cute, sliding out from under the bed; Mochi on the bed with fur standing up | Later slides out; Mochi arches and hisses | Mochi hiss |
| 13 | 0:34 | CU | Later, SMALL, on the desk edge holding Theo's phone out with both arms, sweet smile | Pushes the phone toward camera | Later: Hey… you've got all day… |
| 14 | 0:40 | OTS | Over Theo's shoulder: phone glowing in his hand, blank laptop behind it | Thumb hovers, then taps | Narrator: Later never asks for the whole day… |
| 15 | 0:44 | CU | Theo's face lit by the phone, small smile, colorful reflections in his glasses | Reflections scroll upward | …That's the trick. |
| 16 | 0:47 | WS | Surreal: Theo on a road; a tiny graduation cap glows far away on the horizon; right next to him a giant glowing phone covered in sparkles | Sparkles pulse; parallax drift toward the phone | Narrator: Your brain grabs the reward… |
| 17 | 0:53 | CU | Theo lying on the bed with the phone, Later, SMALL, curled on his shoulder whispering | Later nuzzles closer; his eyelids droop | …pays off this second. |
| 18 | 0:57 | MS | Theo sinking into a beanbag with the phone, Mochi giving him a judging stare | He sinks down; Mochi's eyes narrow | Theo: Okay. Five minutes. |

### Act 3 — The slide (1:05–2:00)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 19 | 1:05 | WS | Bedroom in golden afternoon light, Theo upside-down on the bed scrolling, Later, MEDIUM, beside him like a friend | Shadows sweep across the floor like a time-lapse | Narrator: Five minutes became an hour. |
| 20 | 1:08 | CU | Wall clock showing 3:47, afternoon light | Clock hands spin fast | Whoosh |
| 21 | 1:10 | MCU | Theo back at the laptop typing, hopeful | Types a short line | Narrator: He typed one sentence… |
| 22 | 1:13 | ECU | Theo's finger holding down the backspace key | Presses and holds | …Then deleted it. Backspace clicks |
| 23 | 1:15 | MS | Later, MEDIUM, leaning over the back of Theo's chair, hand on his shoulder, frowning at the screen | Leans in closer | Later: That's not good enough… |
| 24 | 1:19 | CU | Theo's anxious face; a paper with a red failing grade reflected in his glasses | Push-in; lip trembles | Narrator: Later sounds like a friend… |
| 25 | 1:24 | WS | Surreal: tiny Theo alone on a stage in a spotlight, giant faceless shadow audience leaning in and pointing | Shadows lean closer; spotlight narrows | …it talks like your fear. |
| 26 | 1:28 | MS | Theo gently closing the laptop with a relieved exhale; Later, MEDIUM, grinning behind him | Lid closes; room dims slightly | …you can never fail. |
| 27 | 1:31 | MS | Theo vacuuming his room energetically, Later, MEDIUM, holding the vacuum cord like a leash | Vacuums back and forth | Narrator: So Theo did everything… |
| 28 | 1:34 | CU | Theo's hands lining up colored pens perfectly | Last pen slides into place | …Organized his pens. |
| 29 | 1:37 | MS | Theo proudly drawing a colorful schedule on a whiteboard, Mochi asleep | Draws one more colored block | …Made a plan for the plan. |
| 30 | 1:41 | WS | Surreal: Theo at the foot of an enormous mountain of stacked paper, summit lost in orange sunset clouds | Slow tilt up the mountain | Narrator: The essay didn't get any bigger… |
| 31 | 1:47 | CU | Theo looking up, overwhelmed, pupils tiny, wind in his hair | Push-in; hair blows | …all at once. |
| 32 | 1:51 | Low angle | Dusk, purple light; Theo on his bed with his phone while Later, LARGE, looms over the bed, laughing | Later expands to the frame edges; light dims | Later: Tomorrow-you can handle it. |

### Act 4 — Rock bottom (2:00–2:25)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 33 | 2:00 | CU | Wall clock at 11:59, framed exactly like shot 2, lit red | Match cut from shot 2; second hand ticks | Ticking, louder |
| 34 | 2:02 | MCU | Theo typing frantically, sweating, Later's magenta eyes in the dark behind him | Frantic typing; slight handheld shake | Narrator: 11:59. |
| 35 | 2:05 | ECU | Theo's fingers on the keyboard, motion-blurred | Very fast typing | Frantic typing |
| 36 | 2:07 | CU | Laptop screen with a big red X error icon on an upload page | Icon pops in | Clock strikes 12, error chime |
| 37 | 2:09 | CU | Theo's face frozen in shock, lit red, glasses slipping down his nose | Glasses slide down slowly | Silence |
| 38 | 2:13 | WS | Dark room, rain on the window, Theo slumped on the desk, Later, LARGE, towering over him, grinning | Rain streaks; grin pulses | Narrator: Later never shows up to help… |
| 39 | 2:19 | MS | Theo crying at the desk; Mochi hops up and presses her head against his arm | Mochi nuzzles; one tear falls | Rain only, soft piano note |

### Act 5 — The turn (2:25–3:05)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 40 | 2:25 | WS | Soft morning light, Theo at his desk holding a new assignment sheet, Later, SMALL, peeking from under the desk | Later peeks out slowly | Narrator: A week later… |
| 41 | 2:31 | CU | Later, SMALL, holding Theo's phone out again with a sweet smile | Holds out the phone | Later: Just five minutes first? |
| 42 | 2:33 | CU | Theo's face, determined, small smile | Subtle nod | Theo: Yeah. Five minutes… |
| 43 | 2:36 | ECU | Theo's hand twisting a red mechanical kitchen timer | Twists the dial; it starts ticking | …On this. Timer crank |
| 44 | 2:39 | MCU | Theo typing steadily under a warm desk lamp; Later, SMALL, on the desk edge looking confused | Types; Later tilts its head | Narrator: Not the whole essay… |
| 45 | 2:42 | CU | Paper checklist with three boxes, two ticked | Pencil ticks the third box | Pencil tick |
| 46 | 2:45 | CU | Theo's phone: his message and a friend's thumbs-up reply | Reply bubble pops in | Narrator: Phone in another room… |
| 47 | 2:48 | MS | Kitchen: Theo shutting his phone in a drawer, Later, SMALL, clinging to it and getting shut in | Drawer closes; Later's eyes squish | Drawer thud |
| 48 | 2:51 | CU | Red kitchen timer ringing and bouncing, Theo typing behind it | Timer rings and bounces; he doesn't look up | Timer bell, typing continues |
| 49 | 2:53 | MS | Theo typing in flow, warm lamp light spreading, Mochi asleep beside the laptop | Warm light grows across the room | Narrator: Here's the secret… |
| 50 | 3:00 | WS | Later, SHRINKING, faded in the corner of the desk, smoke drifting away; Theo working behind | Later shrinks and dissolves | …a little smaller. |

### Act 6 — End (3:05–3:20)

| # | Time | Size | Picture | Motion | Audio |
| --- | --- | --- | --- | --- | --- |
| 51 | 3:05 | WS | Sunrise, Theo leaning back with the laptop closed, Mochi on his lap, golden light | Sun rises; he exhales and smiles | Narrator: Later will always ask… |
| 52 | 3:10 | Low angle | Under the bed, tiny magenta eyes; Theo's hand switching on a lamp | Light floods under the bed; the eyes blink out | …Give them to the work instead. |
| end | 3:15 | — | Black frame; text Start now. | Fade in, hold 4 s | Music resolves |

## Sound

### Voices

| Voice | Direction |
| --- | --- |
| Narrator | Calm, low, close to the mic, like telling a story at night; slight pauses before key words |
| Theo | Young adult male, tired and anxious; whispered in Act 1, steady and quiet in Act 5 |
| Later | Soft, sweet, almost friendly whisper that turns smug; slight reverb, plus a low pitched-down double in Act 4 |

Generate each line separately so it can be retimed. Leave 0.3–0.6 s of silence before emotional lines.

### Music

Track: `music_library/Better Hands - The Soundlings.mp3` (4:19). Measured loudness: quiet intro 0:00–0:40, build 0:40–1:20, short breakdown around 1:30, full 1:40–3:10, softer outro 3:10–4:05.

| Film time | Music |
| --- | --- |
| 0:00–0:15 | No music: ticking, keyboard, then a hit on the title |
| 0:16–2:00 | Track from 0:00 (quiet intro under the morning, build under the slide) |
| 2:00–2:25 | Silence (rock bottom) |
| 2:25–3:20 | Track resumes from its 1:30 breakdown, builds under the turn, fades out under "Start now." |

Duck music about 10 dB under voice. True silence at 2:09 and 2:19.

### Sound effects

Clock tick, keyboard typing (calm and frantic), backspace clicks, phone tap and notification, Mochi hiss and purr, vacuum, pen click, whiteboard marker, wind, rain on window, error chime, clock strike, kitchen timer crank and bell, drawer thud, lamp click, soft smoke whoosh for every Later entrance, a small "shimmer" whenever Later grows or shrinks.

## Title, thumbnail and checklist

**Title:** LATER. | An Animated Short Film About Procrastination

**Thumbnail:** close-up of Theo's terrified face on the right third, lit cold blue by a laptop; Later's huge magenta grin and glowing eyes looming from the dark on the left. Text: LATER. — huge, bold white, slight tilt, top-left. Must read at phone size (~300 px wide).

### Before you publish

- [ ] Theo looks the same in all 52 shots (hair, glasses, mustard hoodie, eyes)
- [ ] Later's size matches the color script in every act
- [ ] No shot sits still for more than about 1 s
- [ ] At least one close-up in every three shots
- [ ] First 5 seconds show panic and Later's grin, no logo or intro
- [ ] No title cards, numbered lists, or like/subscribe graphics
- [ ] Voice is clear over the music on phone speakers
- [ ] True silence lands at 2:09 and 2:19
- [ ] Captions are small and never cover faces
- [ ] Thumbnail reads at phone size with one word

## Option A: vector version (no AI video)

Same film (script, 52 shots, sound) drawn and animated in Remotion. The approved Stage 1 test lives in `remotion-composer/projects/later/`:

- `art.tsx` — Theo, Later (with `size` and `layer` props), Mochi, bedroom set, lighting (`LightPool`, `Vignette`), virtual `Camera`. Pure SVG, no Remotion imports.
- `shots.tsx` — shots 1, 3, 13, 38, 49, each a function of (frame, duration).
- `Root.tsx` / `index.tsx` — Remotion compositions (`LaterTest` reel + one per shot).

What to build next:

1. **Story, not list.** No "Reason 01" / "Fix #2" title cards.
2. **Real sets.** Extend the bedroom; add the kitchen and one surreal set (road / stage / paper mountain). Every shot happens in a set.
3. **More Theo poses.** Standing, stretching, lying on the bed, walking, holding phone, vacuuming, drawing on whiteboard, crying — keep the approved head, glasses, hoodie and proportions.
4. **Virtual camera.** Each shot gets a framing (ECU, CU, MS, WS) and a slow move. Cut every 2–4 s.
5. **Lighting layers.** Follow the color script; dark vignette in Acts 1 and 4.
6. **Later's size follows the color script.**
7. **Secondary motion everywhere.** Blinks, breathing, hair bounce, dust, rain, steam.
8. **Sound plan above applies unchanged.**
