import { useLocation } from "react-router-dom";
import ScientificUniverseCanvas from "../3d/ScientificUniverseCanvas";
import NeuralConstellationCanvas from "./NeuralConstellationCanvas";
import FloatingLabElements from "./FloatingLabElements";

export default function BackgroundManager() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/") {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <ScientificUniverseCanvas density="high" showFloatingObjects={true} />
        <NeuralConstellationCanvas variant="hero" />
        <FloatingLabElements />
      </div>
    );
  }

  if (path.includes("/analyzer")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <ScientificUniverseCanvas density="subtle" showFloatingObjects={false} />
        <NeuralConstellationCanvas variant="neural" />
        <div className="absolute top-1/4 left-1/3 h-80 w-80 rounded-full bg-purple-glow/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-cyan-glow/15 blur-[120px] animate-pulse-glow" />
      </div>
    );
  }

  if (path.startsWith("/admin")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <NeuralConstellationCanvas variant="analytics" />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-blue-neon/15 blur-[100px]" />
      </div>
    );
  }

  if (path.startsWith("/faculty")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <NeuralConstellationCanvas variant="subtle" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-purple-glow/10 blur-[100px]" />
      </div>
    );
  }

  // Default student / equipment discovery / booking calendar
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <ScientificUniverseCanvas density="subtle" showFloatingObjects={false} />
      <NeuralConstellationCanvas variant="subtle" />
      <div className="absolute top-1/3 left-10 h-72 w-72 rounded-full bg-cyan-glow/10 blur-[110px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-glow/10 blur-[110px]" />
    </div>
  );
}
