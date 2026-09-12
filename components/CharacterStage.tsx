"use client";

import { useRef } from "react";
import { Box, Braces, Code2 } from "lucide-react";

export function CharacterStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stageRef.current?.style.setProperty("--shift-x", `${x * 9}px`);
    stageRef.current?.style.setProperty("--shift-y", `${y * 7}px`);
  };

  const resetParallax = () => {
    stageRef.current?.style.setProperty("--shift-x", "0px");
    stageRef.current?.style.setProperty("--shift-y", "0px");
  };

  return (
    <div ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={resetParallax} className="relative mx-auto aspect-[0.96] w-full max-w-[620px] [--shift-x:0px] [--shift-y:0px]" aria-label="Future 3D character stage placeholder">
      <div className="absolute inset-[6%] rounded-[48%_48%_44%_44%/42%_42%_52%_52%] border border-[var(--rule)] bg-[rgba(249,248,244,0.62)] shadow-[inset_0_0_80px_rgba(132,205,183,0.09)]" />
      <div className="absolute left-[13%] top-[16%] font-mono text-xs text-[var(--muted-ink)] transition-transform duration-500" style={{ transform: "translate(var(--shift-x), var(--shift-y))" }}><span className="rounded-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2">&lt;future.glb /&gt;</span></div>
      <Code2 aria-hidden="true" className="absolute right-[13%] top-[25%] size-7 text-[var(--mint-dark)] opacity-70 transition-transform duration-500" style={{ transform: "translate(calc(var(--shift-x) * -1), var(--shift-y))" }} />
      <Braces aria-hidden="true" className="absolute bottom-[27%] left-[11%] size-6 rotate-[-8deg] text-[var(--muted-ink)] opacity-45 transition-transform duration-500" style={{ transform: "translate(var(--shift-x), calc(var(--shift-y) * -1))" }} />
      <div className="stage-float absolute inset-x-[22%] bottom-[20%] top-[17%] transition-transform duration-500" style={{ translate: "var(--shift-x) var(--shift-y)" }}>
        <div className="relative grid h-full place-items-center overflow-hidden rounded-[45%_45%_40%_40%/34%_34%_48%_48%] border border-[rgba(32,35,31,0.18)] bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(220,238,232,0.72))] shadow-[0_34px_70px_rgba(32,35,31,0.12)]">
          <div className="absolute inset-4 rounded-[inherit] border border-dashed border-[rgba(53,119,98,0.23)]" />
          <div className="text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full border border-[var(--rule)] bg-[var(--paper)] shadow-sm sm:size-24"><Box aria-hidden="true" className="size-8 text-[var(--mint-dark)] sm:size-10" strokeWidth={1.4} /></div>
            <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--mint-dark)]">Character slot</p>
            <p className="mx-auto mt-2 max-w-44 text-sm leading-6 text-[var(--muted-ink)]">3D librarian assistant<br />will live here.</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-[14%] bottom-[11%] h-[13%] rounded-[50%] border border-[rgba(32,35,31,0.16)] bg-[rgba(233,230,222,0.85)] shadow-[0_25px_35px_rgba(32,35,31,0.13),inset_0_8px_18px_rgba(255,255,255,0.65)]" />
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted-ink)]">Model dock · ready</div>
    </div>
  );
}
