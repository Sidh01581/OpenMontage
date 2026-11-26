import React from "react";
import { VFrame, VCamera, VVignette } from "../we-need-to-talk/vart";
import { Desk, rulesUpTo, ShotDef, ShotProps } from "./shots_a";
import { Monitor, PwWindow } from "./part";
import { MochiWalk, MochiYawn, PriyaOverWall, TheoRolledOver } from "./part2";
import { DeskBack, DeskPartition, DEV } from "./part";
import { DevSeated } from "../busy/bart2";

// Character-design sheet panels (one still each). Desk top in world = 1190; keyboard world x 510..690.
const M = (id: string, C: React.FC<ShotProps>): ShotDef => ({ id, Component: C, duration: 48 });
export const MODEL: ShotDef[] = [
  M("dev-facedown", ({ frame }) => <VFrame><VCamera cx={560} cy={1000} zoom={1.5}><Desk frame={frame} dev={{ pose: "facedown", down: 1 }} /></VCamera><VVignette id="m1" strength={0.25} /></VFrame>),
  M("dev-popup", ({ frame }) => <VFrame><VCamera cx={560} cy={930} zoom={1.4}><Desk frame={frame} dev={{ pose: "upright", serious: false, lookX: 12, lookY: 10 }} /></VCamera><VVignette id="m2" strength={0.25} /></VFrame>),
  M("dev-alarmed", ({ frame }) => <VFrame><VCamera cx={480} cy={880} zoom={1.9}><Desk frame={frame} dev={{ pose: "upright", serious: false, sweat: 2, lookX: 18, lookY: 0 }} /></VCamera><VVignette id="m3" strength={0.25} /></VFrame>),
  M("dev-deadeyed", ({ frame }) => <VFrame><VCamera cx={480} cy={880} zoom={1.9}><Desk frame={frame + 30} dev={{ pose: "type", serious: true, lookX: 16, lookY: 6 }} /></VCamera><VVignette id="m4" strength={0.25} /></VFrame>),
  M("mochi-walk", ({ frame }) => <VFrame><VCamera cx={640} cy={1060} zoom={1.6}><Desk frame={frame} dev={{ pose: "facedown", down: 1 }} /><MochiWalk x={600} y={1166} s={1.1} frame={frame} phase={frame / 8} /></VCamera><VVignette id="m5" strength={0.25} /></VFrame>),
  M("mochi-yawn", ({ frame }) => <VFrame><VCamera cx={760} cy={1060} zoom={1.6}><Desk frame={frame} dev={{ pose: "type", serious: true, lookX: 14, lookY: 10 }} /><MochiYawn x={1010} y={1190} s={1.1} frame={frame} k={1} /></VCamera><VVignette id="m6" strength={0.25} /></VFrame>),
  M("priya-wall", ({ frame }) => <VFrame><VCamera cx={1080} cy={880} zoom={1.4}><Desk frame={frame} /><PriyaOverWall x={1300} frame={frame} up={1} talk={0.5} /></VCamera><VVignette id="m7" strength={0.25} /></VFrame>),
  M("theo-nextdesk", ({ frame }) => <VFrame><VCamera cx={250} cy={900} zoom={1.35}><DeskBack frame={frame} /><DeskPartition /><TheoRolledOver frame={frame} talk={0.5} /><DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose="type" lookX={17} lookY={3} natural /></VCamera><VVignette id="m8" strength={0.25} /></VFrame>),
  M("screen-rules", ({ frame }) => <VFrame bg="#1C1F28"><Monitor cx={540} cy={900} s={1.08} rot={-1}><PwWindow frame={frame} typed="M0chi🌔𓂀1!" rules={rulesUpTo(6, frame, -99)} status="error" caret={false} /></Monitor></VFrame>),
  M("screen-strong", ({ frame }) => <VFrame bg="#1C1F28"><Monitor cx={540} cy={900} s={1.08} rot={1}><PwWindow frame={frame} typed="jk;LL@@8#%vvv" rules={[]} status="ok" caret={false} /></Monitor></VFrame>),
];
