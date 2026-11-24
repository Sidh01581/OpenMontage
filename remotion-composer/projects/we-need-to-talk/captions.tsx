import React from "react";
import { AbsoluteFill } from "remotion";
import { loadSpaceGrotesk } from "../../src/lib/localFonts";

// Big word-by-word Shorts captions + the 0:00 hook caption. HTML overlay above the SVG shots.
// Safe zone: centered, max width 648 px (middle 60% of 1080), never below y = 1536 (bottom 20%).

const { fontFamily } = loadSpaceGrotesk(["700"]);

export type CapWord = { w: string; s: number; e: number };
export type CapGroup = { speaker: string; y: number; words: CapWord[] };

export const SPEAKER_COLOR: Record<string, string> = {
  priya: "#5FF0DF",
  theo: "#FFC93C",
  whatif: "#C9A2FF",
  narrator: "#FFFFFF",
};

const groupEnd = (groups: CapGroup[], i: number) => {
  const last = groups[i].words[groups[i].words.length - 1].e;
  const next = groups[i + 1]?.words[0].s ?? Infinity;
  return Math.min(next, last + 0.45);
};

export const WordCaptions: React.FC<{ t: number; groups: CapGroup[]; hideAfter?: number }> = ({ t, groups, hideAfter = Infinity }) => {
  if (t >= hideAfter) return null;
  const gi = groups.findIndex((g, i) => t >= g.words[0].s && t < groupEnd(groups, i));
  if (gi < 0) return null;
  const g = groups[gi];
  const color = SPEAKER_COLOR[g.speaker] ?? "#FFFFFF";
  const chars = g.words.reduce((n, w) => n + w.w.length, 0) + g.words.length - 1;
  const size = chars > 16 ? 82 : chars > 11 ? 96 : 112;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 216, width: 648, top: g.y, transform: "translateY(-50%)",
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: 22, rowGap: 0,
        fontFamily, fontWeight: 700, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.02em", textAlign: "center",
      }}>
        {g.words.map((w, i) => {
          if (t < w.s) return null; // true word-by-word reveal
          const age = t - w.s;
          const active = t < w.e + 0.08 || i === g.words.length - 1;
          const pop = 1 + 0.22 * Math.exp(-age * 16);
          return (
            <span key={i} style={{
              display: "inline-block", transform: `scale(${pop})`,
              color: active ? color : "#FFFFFF",
              WebkitTextStroke: "14px #111018", paintOrder: "stroke fill",
              textShadow: "0 8px 0 rgba(0,0,0,0.35)",
            }}>{w.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// "POV: your boss says ..." hook card, visible from frame 0 (no fade-in: the first frame must read).
export const HookCaption: React.FC<{ t: number; until: number }> = ({ t, until }) => {
  if (t >= until) return null;
  const out = Math.max(0, (t - (until - 0.12)) / 0.12);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 150, width: 780, top: 250, padding: "22px 30px", boxSizing: "border-box",
        background: "#FFFFFF", borderRadius: 26, border: "6px solid #111018", boxShadow: "0 10px 0 rgba(17,16,24,0.85)",
        fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: "#111018", textAlign: "center",
        letterSpacing: "-0.02em", opacity: 1 - out, transform: `rotate(-1.5deg) scale(${1 - out * 0.1})`,
      }}>
        POV: your boss says<br />“we need to talk tomorrow”
      </div>
    </AbsoluteFill>
  );
};
