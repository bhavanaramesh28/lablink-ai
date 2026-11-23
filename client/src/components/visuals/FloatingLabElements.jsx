import { Cpu, FlaskConical, Atom, Binary, CircuitBoard, Sparkles, Box } from "lucide-react";

export default function FloatingLabElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {/* 1. Transparent Beaker & Flask with glowing liquid - Left upper */}
      <div className="absolute top-20 left-[4%] hidden lg:flex flex-col items-center animate-float">
        <div className="relative p-4 rounded-2xl bg-[#101A35]/40 backdrop-blur-md border border-cyan-glow/30 shadow-cyan">
          <FlaskConical size={34} className="text-cyan-glow" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-cyan-glow rounded-full blur-[3px]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-aqua-glow rounded-full animate-ping" />
        </div>
        <span className="mt-2 text-[10px] font-mono tracking-wider text-cyan-glow/70 uppercase">Reagent Lab</span>
      </div>

      {/* 2. Microchip & AI Processor - Right upper */}
      <div className="absolute top-28 right-[5%] hidden lg:flex flex-col items-center animate-float-delay">
        <div className="relative p-4 rounded-2xl bg-[#101A35]/40 backdrop-blur-md border border-purple-glow/30 shadow-purple">
          <Cpu size={34} className="text-purple-glow" />
          <div className="absolute inset-0 border border-purple-glow/20 rounded-2xl animate-pulse" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-glow rounded-full animate-ping" />
        </div>
        <span className="mt-2 text-[10px] font-mono tracking-wider text-purple-glow/70 uppercase">Neural Tensor</span>
      </div>

      {/* 3. Arduino / Circuit Board Component - Left lower */}
      <div className="absolute bottom-32 left-[6%] hidden xl:flex flex-col items-center animate-float-slow">
        <div className="relative p-4 rounded-2xl bg-[#101A35]/40 backdrop-blur-md border border-aqua-glow/30 shadow-aqua">
          <CircuitBoard size={34} className="text-aqua-glow" />
          <div className="absolute top-1 right-2 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-aqua-glow animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-cyan-glow animate-pulse" />
          </div>
        </div>
        <span className="mt-2 text-[10px] font-mono tracking-wider text-aqua-glow/70 uppercase">Embedded Bus</span>
      </div>

      {/* 4. Digital Scientific Molecule - Right lower */}
      <div className="absolute bottom-36 right-[7%] hidden xl:flex flex-col items-center animate-float-drift">
        <div className="relative p-4 rounded-2xl bg-[#101A35]/40 backdrop-blur-md border border-cyan-glow/30 shadow-cyan">
          <Atom size={34} className="text-cyan-glow animate-spin-slow" />
          <div className="absolute -top-1 -right-1">
            <Sparkles size={14} className="text-aqua-glow" />
          </div>
        </div>
        <span className="mt-2 text-[10px] font-mono tracking-wider text-cyan-glow/70 uppercase">Biochem Bond</span>
      </div>

      {/* 5. Holographic Data Cube - Far Top Left */}
      <div className="absolute top-1/2 left-[2%] -translate-y-1/2 hidden 2xl:flex flex-col items-center animate-float">
        <div className="relative p-3.5 rounded-2xl bg-[#101A35]/30 backdrop-blur-sm border border-white/10">
          <Box size={26} className="text-blue-neon" />
        </div>
        <span className="mt-1 text-[9px] font-mono text-white/40">3D LATTICE</span>
      </div>

      {/* 6. Binary / Logic Sensor - Far Right */}
      <div className="absolute top-1/2 right-[2%] -translate-y-1/2 hidden 2xl:flex flex-col items-center animate-float-delay">
        <div className="relative p-3.5 rounded-2xl bg-[#101A35]/30 backdrop-blur-sm border border-white/10">
          <Binary size={26} className="text-purple-glow" />
        </div>
        <span className="mt-1 text-[9px] font-mono text-white/40">LOGIC I/O</span>
      </div>

      {/* Soft Ambient Light Orbs with slow breathing pulse */}
      <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-glow/12 blur-[130px] animate-pulse-glow" />
      <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-blue-neon/10 blur-[140px] animate-pulse-glow" />
    </div>
  );
}
