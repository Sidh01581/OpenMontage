import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { REST } from "./shots_b";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import { loadSpaceGrotesk } from "../../src/lib/localFonts";
import CAP_SAMPLE from "./captions_sample.json";
import CAP_FILM from "./captions_film.json";
import { SheetDev, SheetCast } from "./modelsheet";
import { ThumbnailV } from "./thumbnail";

// OUT OF OFFICE. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
const { fontFamily } = loadSpaceGrotesk(["700"]);
export const COLORS: Record<string, string> = { theo: "#FFC93C", dev: "#7FE08A", priya: "#5FF0DF" };

const Live: React.FC<{ C: React.FC<ShotProps>; duration: number; frameOverride?: number }> = ({ C, duration, frameOverride }) => {
  const frame = useCurrentFrame();
  return <C frame={frameOverride ?? frame} duration={duration} />;
};
const Shots: React.FC<{ list: ShotDef[] }> = ({ list }) => (
  <Series>{list.map((s) => <Series.Sequence key={s.id} durationInFrames={s.duration}><Live C={s.Component} duration={s.duration} /></Series.Sequence>)}</Series>
);

// End-screen card (user script): "WORK-LIFE BALANCE: 404 NOT FOUND! 😂"
const EndCard: React.FC<{ t: number; from: number }> = ({ t, from }) => {
  if (t < from + 0.15) return null;
  const age = t - from - 0.15;
  const pop = 1 + 0.12 * Math.exp(-age * 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 140, width: 800, top: 640, padding: "34px 30px", boxSizing: "border-box",
        background: "#1C2A33", borderRadius: 30, border: "6px solid #111018", boxShadow: "0 12px 0 rgba(17,16,24,0.85)",
        fontFamily, fontWeight: 700, color: "#FFFFFF", textAlign: "center", letterSpacing: "-0.02em",
        transform: `rotate(-2deg) scale(${pop})`,
      }}>
        <div style={{ fontSize: 58, lineHeight: 1.1 }}>WORK-LIFE BALANCE:</div>
        <div style={{ fontSize: 96, lineHeight: 1.1, color: "#FF6B6B", marginTop: 8 }}>404</div>
        <div style={{ fontSize: 58, lineHeight: 1.1 }}>NOT FOUND! 😂</div>
      </div>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{ groups: CapGroup[]; hookUntil: number; hideAfter?: number; endAt?: number }> = ({ groups, hookUntil, hideAfter, endAt }) => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <HookCaption t={t} until={hookUntil}>POV: you finally<br />take a day off</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
      {endAt !== undefined && <EndCard t={t} from={endAt} />}
    </>
  );
};
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);

const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={2.5} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);

export const FILM: ShotDef[] = [...SAMPLE, ...REST];
const END_AT = total(FILM.slice(0, -1)) / FPS;
const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={2.5} hideAfter={END_AT} endAt={END_AT} />
    <Audio src={staticFile("film_mix.wav")} />
  </AbsoluteFill>
);
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const s = FILM[Math.min(f, FILM.length - 1)];
  return <Live C={s.Component} duration={s.duration} frameOverride={Math.floor(s.duration * 0.6)} />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="OooSample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    <Composition id="OooFilm" component={Film} durationInFrames={total(FILM)} fps={FPS} width={1080} height={1920} />
    <Composition id="OooBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="OooThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="OooSheetA" component={SheetDev} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="OooSheetB" component={SheetCast} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    {FILM.map((s) => (
      <Composition key={s.id} id={`Ooo-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
