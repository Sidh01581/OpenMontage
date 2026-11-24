import React from "react";
import { Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, ShotProps } from "./shots";
import { ACT1 } from "./act1";
import { ACT2 } from "./act2";
import { ACT3 } from "./act3";
import { ACT4 } from "./act4";
import { ACT56 } from "./act56";
import { Thumbnail } from "./thumbnail";
import { SheetBodies, SheetFaces, SheetLaterMochi } from "./modelsheet";
import { PrevKitchen, PrevRoad, PrevStage, PrevMountain, PrevBedroom, PrevProps } from "./setsheet";

// Wraps a pure shot so it reads its frame from Remotion.
const Live: React.FC<{ C: React.FC<ShotProps>; duration: number }> = ({ C, duration }) => {
  const frame = useCurrentFrame();
  return <C frame={frame} duration={duration} />;
};

const TestReel: React.FC = () => (
  <Series>
    {SHOTS.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={s.duration}>
        <Live C={s.Component} duration={s.duration} />
      </Series.Sequence>
    ))}
  </Series>
);

const total = SHOTS.reduce((n, s) => n + s.duration, 0);

// Act 1 sample (0:00–0:15) with the pre-mixed voice + SFX track. Hard cuts only.
const Act1Sample: React.FC = () => (
  <>
    <Series>
      {ACT1.map((s) => (
        <Series.Sequence key={s.id} durationInFrames={s.duration}>
          <Live C={s.Component} duration={s.duration} />
        </Series.Sequence>
      ))}
    </Series>
    <Audio src={staticFile("sample_act1_mix.wav")} />
  </>
);
const act1Total = ACT1.reduce((n, s) => n + s.duration, 0);

const ShotSeries: React.FC<{ list: typeof ACT2 }> = ({ list }) => (
  <Series>
    {list.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={s.duration}>
        <Live C={s.Component} duration={s.duration} />
      </Series.Sequence>
    ))}
  </Series>
);
const Act2Review: React.FC = () => (<><ShotSeries list={ACT2} /><Audio src={staticFile("review_act2_mix.wav")} /></>);
const act2Total = ACT2.reduce((n, s) => n + s.duration, 0);
const Act3Review: React.FC = () => (<><ShotSeries list={ACT3} /><Audio src={staticFile("review_act3_mix.wav")} /></>);
const act3Total = ACT3.reduce((n, s) => n + s.duration, 0);
const Act4Review: React.FC = () => (<><ShotSeries list={ACT4} /><Audio src={staticFile("review_act4_mix.wav")} /></>);
const act4Total = ACT4.reduce((n, s) => n + s.duration, 0);
const Act56Review: React.FC = () => (<><ShotSeries list={ACT56} /><Audio src={staticFile("review_act56_mix.wav")} /></>);
const act56Total = ACT56.reduce((n, s) => n + s.duration, 0);

// The full film: 68 shots, hard cuts (S2 -> S33 match cut is in the framing), one pre-mixed soundtrack (voices + SFX, no music).
export const FILM = [...ACT1, ...ACT2, ...ACT3, ...ACT4, ...ACT56];
const Film: React.FC = () => (<><ShotSeries list={FILM} /><Audio src={staticFile("final_mix.wav")} /></>);
const filmTotal = FILM.reduce((n, s) => n + s.duration, 0);

export const Root: React.FC = () => (
  <>
    <Composition id="LaterTest" component={TestReel} durationInFrames={total} fps={24} width={1920} height={1080} />
    <Composition id="LaterAct1Sample" component={Act1Sample} durationInFrames={act1Total} fps={24} width={1920} height={1080} />
    <Composition id="LaterAct2Review" component={Act2Review} durationInFrames={act2Total} fps={24} width={1920} height={1080} />
    <Composition id="LaterAct3Review" component={Act3Review} durationInFrames={act3Total} fps={24} width={1920} height={1080} />
    <Composition id="LaterAct4Review" component={Act4Review} durationInFrames={act4Total} fps={24} width={1920} height={1080} />
    <Composition id="LaterThumbnail" component={Thumbnail} durationInFrames={1} fps={24} width={1920} height={1080} />
    <Composition id="LaterFilm" component={Film} durationInFrames={filmTotal} fps={24} width={1920} height={1080} />
    <Composition id="LaterAct56Review" component={Act56Review} durationInFrames={act56Total} fps={24} width={1920} height={1080} />
    {[...ACT2, ...ACT3, ...ACT4, ...ACT56].filter((s) => s.id !== "S38a" && s.id !== "S49a").map((s) => (
      <Composition key={s.id} id={`Later-${s.id.replace("_", "")}`} component={() => <Live C={s.Component} duration={s.duration} />}
        durationInFrames={s.duration} fps={24} width={1920} height={1080} />
    ))}
    <Composition id="ModelSheet1" component={() => <SheetBodies frame={0} />} durationInFrames={1} fps={24} width={1920} height={1080} />
    <Composition id="ModelSheet2" component={() => <SheetFaces frame={0} />} durationInFrames={1} fps={24} width={1920} height={1080} />
    {([["SetKitchen", PrevKitchen], ["SetRoad", PrevRoad], ["SetStage", PrevStage], ["SetMountain", PrevMountain], ["SetBedroom", PrevBedroom], ["SetProps", PrevProps]] as [string, React.FC][]).map(([id, Cmp]) => (
      <Composition key={id} id={id} component={Cmp} durationInFrames={1} fps={24} width={1920} height={1080} />
    ))}
    <Composition id="ModelSheet3" component={() => <SheetLaterMochi frame={0} />} durationInFrames={1} fps={24} width={1920} height={1080} />
    {ACT1.filter((s) => !SHOTS.some((x) => x.id === s.id)).map((s) => (
      <Composition key={s.id} id={`Later-${s.id.replace("_", "")}`} component={() => <Live C={s.Component} duration={s.duration} />}
        durationInFrames={s.duration} fps={24} width={1920} height={1080} />
    ))}
    {SHOTS.map((s) => (
      <Composition
        key={s.id}
        id={`Later-${s.id.replace("_", "")}`}
        component={() => <Live C={s.Component} duration={s.duration} />}
        durationInFrames={s.duration}
        fps={24}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
