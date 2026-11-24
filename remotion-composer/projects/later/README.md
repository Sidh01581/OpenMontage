# LATER. — Option A, Stage 1 test

Five test shots from the 52-shot list, drawn as SVG and animated in Remotion
(no AI images or video, no API keys needed).

| Shot | What it tests |
| --- | --- |
| 01 | Extreme close-up: Theo's panicked eyes, laptop light, push-in, darting pupils |
| 03 | Medium shot: frantic typing, camera pulls back to reveal Later on the wall |
| 13 | Close-up: small Later on the desk pushing the phone forward, morning light |
| 38 | Wide: rock bottom, rain, Theo slumped, Later filling the room |
| 49 | Medium: Theo typing in flow under the lamp, Mochi asleep |

## Files

- `art.tsx` — characters (Theo, Later, Mochi), bedroom set, lighting, camera. Pure SVG, no Remotion imports.
- `shots.tsx` — the five shots; each is a function of (frame, duration).
- `Root.tsx` / `index.tsx` — Remotion compositions.
- `stills/` — preview frames rendered at 60% of each shot.

## Render on your Mac

From `OpenMontage/remotion-composer`:

```bash
# watch it live and scrub
npx remotion studio projects/later/index.tsx

# render the 20-second test reel
npx remotion render projects/later/index.tsx LaterTest out/later_test.mp4
```

## Next (Stage 2)

If the look is approved: add the kitchen and surreal sets, more Theo poses
(standing, lying on bed, walking), the remaining 47 shots, Piper voice lines,
music, sound effects and captions, following later_bible.md.
