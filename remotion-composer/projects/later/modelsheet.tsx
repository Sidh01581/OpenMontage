import React from "react";
import { C, INK, Head, Later, Mochi, Expr, LaterMood } from "./art";
import { TheoPuppet, TheoBackHead, InsertHand, POSES } from "./rig";

// Review-only model sheets (not part of the film). Three 1920x1080 pages.
const Page: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill="#F3E9D8" />
    <text x={40} y={56} fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={34} fill={INK}>{title}</text>
    {children}
  </svg>
);
const Label: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fill="#5A4A3A">{t}</text>
);

const F = 30; // fixed frame so blinks don't land on the sheet

export const SheetBodies: React.FC<{ frame: number }> = () => {
  const row1: [string, string, Expr][] = [["stand_idle", "idle", "neutral"], ["stretch_up", "stretch", "relieved"], ["thumbs_up", "thumbs up", "grin"],
    ["walk_contact_a", "walk A", "neutral"], ["vacuum_push", "vacuum", "focused"], ["reach_board", "whiteboard", "smile"], ["drawer_push", "drawer", "determined"]];
  const row2: [string, string, Expr, number][] = [["phone_hold", "phone", "smile", 0], ["sit_low", "beanbag", "guilty", 0], ["stand_small", "small (surreal)", "overwhelmed", 0], ["hold_sheet", "assignment", "determined", 0]];
  return (
    <Page title="LATER. model sheet 1/3 — Theo body poses (data presets, approved head reused)">
      {row1.map(([k, l, e], i) => (
        <g key={k}>
          <TheoPuppet x={150 + i * 262} y={430} s={0.62} pose={POSES[k]} expr={e} frame={F} />
          <Label x={150 + i * 262} y={578} t={l} />
        </g>
      ))}
      {row2.map(([k, l, e], i) => (
        <g key={k}>
          <TheoPuppet x={150 + i * 262} y={930} s={0.62} pose={POSES[k]} expr={e} frame={F} />
          <Label x={150 + i * 262} y={1068} t={l} />
        </g>
      ))}
      <g>
        <TheoPuppet x={1340} y={880} s={0.62} rot={-90} pose={POSES.lie_back_phone} expr="smile" frame={F} lookX={10} lookY={-8} />
        <Label x={1250} y={1000} t="lying on bed (rot -90)" />
        <TheoBackHead x={1740} y={800} s={0.55} frame={F} />
        <Label x={1740} y={1000} t="back of head (OTS)" />
      </g>
    </Page>
  );
};

export const SheetFaces: React.FC<{ frame: number }> = () => {
  const ex: Expr[] = ["neutral", "panic", "focused", "sad", "smile", "grin", "blank", "guilty", "exhausted", "anxious", "relieved", "overwhelmed", "shock", "determined"];
  return (
    <Page title="LATER. model sheet 2/3 — Theo expressions (new ones from 'grin') + insert hands">
      {ex.map((e, i) => {
        const col = i % 7, row = Math.floor(i / 7);
        const cx = 150 + col * 262, cy = 230 + row * 300;
        return (
          <g key={e}>
            <g transform={`translate(${cx} ${cy}) scale(0.95) translate(-985 -425)`}>
              <Head expr={e} frame={F} lookX={e === "guilty" ? 0 : 6} lookY={e === "guilty" ? 12 : e === "overwhelmed" ? -12 : 4} glassesY={e === "shock" ? 14 : 0} wind={e === "overwhelmed" ? 14 : 0} />
            </g>
            <Label x={cx} y={cy + 150} t={e} />
          </g>
        );
      })}
      {(["point", "pinch", "flat", "curl"] as const).map((g, i) => (
        <g key={g}>
          <InsertHand x={260 + i * 440} y={880} s={0.85} grip={g} />
          <Label x={260 + i * 440} y={1020} t={`hand: ${g}`} />
        </g>
      ))}
    </Page>
  );
};

export const SheetLaterMochi: React.FC<{ frame: number }> = () => {
  const moods: LaterMood[] = ["sly", "grin", "laugh", "frown", "confused", "scared", "dim"];
  return (
    <Page title="LATER. model sheet 3/3 — Later moods, arms, sizes · Mochi poses">
      <rect x={0} y={90} width={1920} height={560} fill="#1A1626" />
      {moods.map((m, i) => (
        <g key={m}>
          <Later x={150 + i * 262} y={240} s={0.8} mood={m} frame={F} tilt={m === "confused" ? 14 : 0} />
          <text x={150 + i * 262} y={390} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fill="#E8DCEB">{m}</text>
        </g>
      ))}
      <Later x={260} y={520} s={0.75} mood="sly" frame={F} arms={{ r: [150, -40] }} />
      <text x={300} y={630} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fill="#E8DCEB">arm: hand on shoulder</text>
      <Later x={640} y={520} s={0.75} mood="grin" frame={F} arms={{ l: [-150, 40], r: [150, 40] }} />
      <text x={640} y={630} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fill="#E8DCEB">arms: leash / cling</text>
      {/* sizes to scale against a standing Theo (scale 0.42) */}
      <TheoPuppet x={1000} y={630} s={0.42} pose={POSES.stand_idle} expr="neutral" frame={F} />
      {[["SMALL", 0.3, 1130], ["MEDIUM", 0.75, 1330], ["LARGE", 1.2, 1700]].map(([l, sc, x]) => (
        <g key={l as string}>
          <Later x={x as number} y={630 - 110 * (sc as number) - 10} s={sc as number} mood="sly" frame={F} />
          <text x={x as number} y={642} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fill="#E8DCEB">{l as string}</text>
        </g>
      ))}
      <Mochi x={220} y={930} s={1.1} frame={F} />
      <Label x={220} y={1010} t="sleep (approved)" />
      <Mochi x={560} y={960} s={1.1} frame={F} pose="sit" mood="open" />
      <Label x={560} y={1010} t="sit" />
      <Mochi x={860} y={960} s={1.1} frame={F} pose="sit" mood="judge" />
      <Label x={860} y={1010} t="sit · judging" />
      <Mochi x={1160} y={960} s={1.1} frame={F} pose="sit" mood="closed" headTilt={-18} />
      <Label x={1160} y={1010} t="nuzzle" />
      <Mochi x={1560} y={960} s={1.1} frame={F} pose="arch" />
      <Label x={1560} y={1010} t="arch + hiss" />
    </Page>
  );
};
