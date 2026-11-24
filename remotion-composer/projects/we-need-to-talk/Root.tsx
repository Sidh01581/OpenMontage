import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { HOOK, ShotDef, ShotProps } from "./shots_hook";
import { WordCaptions, HookCaption, CapGroup } from "./captions";
import CAP_SAMPLE from "./captions_sample.json";
import { SheetPriyaWhatIf, SheetTheoMochi } from "./modelsheet";
import { REST } from "./shots_rest";
import { ThumbnailV } from "./thumbnail";
import CAP_FILM from "./captions_film.json";

// WE NEED TO TALK. — vertical Short, 1080x1920, 24 fps. Hard cuts only; one pre-mixed voices+SFX track (no music).
const FPS = 24;

const Live: React.FC<{ C: React.FC<ShotProps>; duration: number; frameOverride?: number }> = ({ C, duration, frameOverride }) => {
  const frame = useCurrentFrame();
  return <C frame={frameOverride ?? frame} duration={duration} />;
};

const Shots: React.FC<{ list: ShotDef[] }> = ({ list }) => (
  <Series>
    {list.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={s.duration}>
        <Live C={s.Component} duration={s.duration} />
      </Series.Sequence>
    ))}
  </Series>
);

const Overlay: React.FC<{ groups: CapGroup[]; hookUntil: number }> = ({ groups, hookUntil }) => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <HookCaption t={t} until={hookUntil} />
      <WordCaptions t={t} groups={groups} />
    </>
  );
};

const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={HOOK} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={4.0} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);
const sampleTotal = HOOK.reduce((n, s) => n + s.duration, 0);

export const FILM: ShotDef[] = [...HOOK, ...REST];
const filmTotal = FILM.reduce((n, s) => n + s.duration, 0);
const Film: React.FC<{ audio?: string }> = ({ audio = "film_mix.wav" }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={4.0} />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
// Storyboard: one still per shot at 55% of the shot, for scene-plan review.
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const s = FILM[Math.min(f, FILM.length - 1)];
  return <Live C={s.Component} duration={s.duration} frameOverride={Math.floor(s.duration * 0.55)} />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="WNTTSample" component={Sample} durationInFrames={sampleTotal} fps={FPS} width={1080} height={1920} />
    <Composition id="WNTTFilm" component={Film} durationInFrames={filmTotal} fps={FPS} width={1080} height={1920} />
    <Composition id="WNTTBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="WNTTThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="WNTTSheetA" component={SheetPriyaWhatIf} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="WNTTSheetB" component={SheetTheoMochi} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    {FILM.map((s) => (
      <Composition key={s.id} id={`WNTT-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />}
        durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
