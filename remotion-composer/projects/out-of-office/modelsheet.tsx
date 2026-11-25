import React from "react";
import { PhoneBody } from "../sure/sets";
import { DevLounge, VacationTag, BeachSet, Crab } from "./oart";
import { PriyaPhone, ManagerCall, StatusScreen, ServerRoom, LapLaptop, LaptopScreen, DevBeachWalk, DevInSea, OpenSea, ITDept, BeachBag } from "./oart2";

const Sheet: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill="#F3ECDD" />
    <text x={40} y={60} fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={40} fill="#141018">{title}</text>
    {children}
  </svg>
);
const Label: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={700} fontSize={22} fill="#4A4040">{t}</text>
);
const L = (x: number, y: number, props: Partial<React.ComponentProps<typeof DevLounge>>, id: string) => (
  <DevLounge x={x} y={y} s={0.6} frame={3} id={id} {...props} />
);

export const SheetDev: React.FC = () => (
  <Sheet title="OUT OF OFFICE. — Dev (vacation outfit): lounge, call, laptop, walk to the sea">
    {L(240, 380, { arm: "sip", k: 1 }, "s1")}<Label x={230} y={500} t="lounge + sip" />
    {L(560, 380, { arm: "toast", k: 1 }, "s2")}<Label x={550} y={500} t="toast" />
    {L(880, 380, { serious: true, smile: false, shades: 1, lookX: 16 }, "s3")}<Label x={870} y={500} t="'Seriously?' (shades down)" />
    {L(1200, 380, { arm: "phone", k: 1, serious: true, smile: false, backArm: "rest" }, "s4")}<Label x={1190} y={500} t="phone on speaker" />
    {L(1520, 380, { arm: "rest", smile: false, serious: false, backArm: "rest", sitUp: 0.4 }, "s5")}<Label x={1510} y={500} t="smile fades" />
    {L(240, 860, { arm: "laptop", k: 1, backArm: "rest", typeSpeed: 1.2, serious: true, smile: false, sitUp: 0.5, holding: <LapLaptop /> }, "s6")}<Label x={230} y={980} t="laptop on lap, typing" />
    {L(560, 860, { arm: "phone", k: 1, smile: true, backArm: "rest", sitUp: 0.5, shades: 0 }, "s7")}<Label x={550} y={980} t="'Day off next week?' (hopeful)" />
    <DevBeachWalk x={880} y={760} s={0.55} frame={3} phase={0.5} id="s8" /><Label x={880} y={980} t="walks to the sea (bag + coconut)" />
    <g transform="translate(1100 560) scale(0.24)"><OpenSea frame={2} /><DevInSea frame={2} raise={1} /></g><Label x={1230} y={1040} t="waist-deep, to camera" />
    <BeachBag x={1500} y={900} s={0.9} laptopIn={1} /><Label x={1500} y={980} t="beach bag" />
    <Crab x={1720} y={900} s={0.8} frame={4} wave={1} /><Label x={1720} y={980} t="crab" />
  </Sheet>
);

export const SheetCast: React.FC = () => (
  <Sheet title="OUT OF OFFICE. — Priya (on the phone), screens, sets, VACATION meter">
    <PriyaPhone x={170} y={260} s={0.62} frame={4} expr="neutral" talk={0.8} panic={1} /><Label x={170} y={510} t="Priya: panic (alarm)" />
    <PriyaPhone x={450} y={260} s={0.62} frame={4} expr="smile" talk={0.6} /><Label x={450} y={510} t="overjoyed" />
    <PriyaPhone x={730} y={260} s={0.62} frame={4} expr="smile" headTilt={8} /><Label x={730} y={510} t="'Monday's meeting'" />
    <PhoneBody x={980} y={300} s={0.36} id="shph"><ManagerCall frame={2} /></PhoneBody><Label x={980} y={520} t="MANAGER CALLING" />
    <g transform="translate(1110 120) scale(0.36)"><StatusScreen frame={2} up={0} /></g>
    <g transform="translate(1110 360) scale(0.36)"><StatusScreen frame={2} up={1} /></g><Label x={1272} y={600} t="status: down / online" />
    <g transform="translate(1480 110) scale(0.2)"><ServerRoom frame={2} up={0.5} /></g><Label x={1588} y={520} t="server room (red -> green)" />
    <g transform="translate(1720 140) scale(0.2)"><rect width={1080} height={1920} fill="#E6E9EC" /><ITDept frame={2} /></g><Label x={1828} y={560} t="IT dept" />
    {[["vac", 100], ["vac", 60], ["vac", 10], ["work", 0], ["404", 0]].map(([m, p], i) => (
      <VacationTag key={i} x={-60 + i * 300} y={620} pct={p as number} mode={m as "vac"} age={20} s={0.48} />
    ))}
    <Label x={700} y={780} t="VACATION meter: 100% -> 60% -> 10% -> WORK MODE: ON -> 404" />
    <g transform="translate(60 820) scale(0.12)"><BeachSet frame={2} /></g>
    <g transform="translate(220 830) scale(0.38)"><LaptopScreen frame={2} t={0.5} /></g>
    <g transform="translate(580 830) scale(0.38)"><LaptopScreen frame={2} t={1} /></g><Label x={750} y={1070} t="laptop screen: typing / ALL SYSTEMS ONLINE" />
    <text x={1000} y={850} fontFamily="'Helvetica Neue', Arial" fontSize={24} fill="#4A4040">
      <tspan x={1000} dy={0}>Dev on vacation: coral Hawaiian shirt with white/yellow flowers, teal swim shorts,</tspan>
      <tspan x={1000} dy={34}>flip-flops, sunglasses in perspective (face toward the sea). Same head and outline as BUSY.</tspan>
      <tspan x={1000} dy={34}>Priya keeps her teal blazer; phone at her right ear; voice phone-filtered on calls.</tspan>
      <tspan x={1000} dy={34}>Beach: turquoise sea, sand, striped umbrella, palm. Office scenes get a red alarm wash.</tspan>
    </text>
  </Sheet>
);
