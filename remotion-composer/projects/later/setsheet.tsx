import React from "react";
import { Camera, Room, ChairBack, Desk, Laptop, Lamp, Sky, INK } from "./art";
import { TheoPuppet, POSES } from "./rig";
import { Kitchen, RoadSet, StageSet, PaperMountain, Beanbag, Whiteboard, Vacuum, Mug, StickyNote, Pens, KitchenTimer, Checklist, PhoneChat, LaptopFront, Keyboard, UnderBed } from "./sets";

// Review-only previews of sets and props (asset stage filmstrip). Not part of the film.
const Svg: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />{children}
  </svg>
);
const F = 40;

export const PrevKitchen: React.FC = () => (
  <Svg><Camera cx={960} cy={560} zoom={0.95}><Kitchen frame={F} drawerOpen={0.6} />
    <TheoPuppet x={980} y={990} s={1.15} pose={POSES.drawer_push} expr="determined" frame={F} /></Camera></Svg>
);
export const PrevRoad: React.FC = () => (
  <Svg><Camera cx={960} cy={540} zoom={1}><RoadSet frame={F} />
    <TheoPuppet x={760} y={940} s={0.9} pose={POSES.stand_small} expr="smile" frame={F} lookX={10} /></Camera></Svg>
);
export const PrevStage: React.FC = () => (
  <Svg><Camera cx={960} cy={540} zoom={1}><StageSet frame={F} lean={0.7} spot={0.4} />
    <TheoPuppet x={960} y={640} s={0.55} pose={POSES.stand_small} expr="anxious" frame={F} /></Camera></Svg>
);
export const PrevMountain: React.FC = () => (
  <Svg><Camera cx={960} cy={200} zoom={0.62}><PaperMountain frame={F} />
    <TheoPuppet x={960} y={1000} s={0.45} pose={POSES.stand_small} expr="overwhelmed" frame={F} /></Camera></Svg>
);
export const PrevBedroom: React.FC = () => {
  const skies: Sky[] = ["morning", "afternoon", "dusk", "dawn"];
  return (
    <Svg>
      {skies.map((s, i) => (
        <svg key={s} x={(i % 2) * 960} y={Math.floor(i / 2) * 540} width={960} height={540} viewBox="0 0 1920 1080">
          <Camera cx={960} cy={540} zoom={1}>
            <Room sky={s} frame={F} clockH={10} clockM={0} lampOn={s === "dusk"} /><ChairBack /><Desk /><Laptop screenOn={false} /><Lamp on={s === "dusk"} />
            {i === 1 && <><Beanbag x={1250} y={900} s={1.1} /><Whiteboard x={700} y={330} blocks={14} /></>}
            {i === 0 && <Vacuum x={1200} y={900} cord={[1700, 820]} />}
          </Camera>
          <text x={40} y={80} fontFamily="Helvetica, Arial" fontWeight={700} fontSize={56} fill="#FFFFFF" stroke={INK} strokeWidth={3}>{s}</text>
        </svg>
      ))}
    </Svg>
  );
};
export const PrevProps: React.FC = () => (
  <Svg bg="#F3E9D8">
    <g transform="translate(0 0) scale(0.33)"><LaptopFront frame={F} open={1} mode="doc" lines={3} /></g>
    <g transform="translate(640 0) scale(0.33)"><LaptopFront frame={F} open={1} mode="error" errorPop={1} /></g>
    <g transform="translate(1280 0) scale(0.33)"><Keyboard frame={F} pressed={[17, 30]} /></g>
    <Mug x={140} y={560} frame={F} />
    <StickyNote x={330} y={500} />
    <g transform="translate(470 330) scale(0.6)"><Pens x={0} y={0} last={0.5} /></g>
    <KitchenTimer x={900} y={520} s={0.9} dial={60} ring={1} frame={F} />
    <g transform="translate(1100 380) scale(0.55)"><Checklist x={0} y={0} ticks={2} draw={0.6} /></g>
    <g transform="translate(1660 560) scale(0.5)"><PhoneChat x={0} y={0} reply={1} /></g>
    <svg x={0} y={700} width={634} height={356} viewBox="0 0 1920 1080"><UnderBed frame={F} light={0} /></svg>
    <svg x={660} y={700} width={634} height={356} viewBox="0 0 1920 1080"><UnderBed frame={F} light={0.8} /></svg>
  </Svg>
);
