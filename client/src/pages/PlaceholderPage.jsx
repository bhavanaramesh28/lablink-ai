import { Hammer } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";

export default function PlaceholderPage({ title, stage, description }) {
  return (
    <PageTransition>
      <h1 className="text-2xl font-semibold lg:text-3xl">{title}</h1>
      <GlassCard className="mt-6 flex flex-col items-center py-16 text-center">
        <Hammer className="mb-4 text-aqua-glow" size={36} />
        <p className="text-lg font-medium">Coming in Stage {stage}</p>
        <p className="mt-2 max-w-md text-sm text-white/60">{description}</p>
      </GlassCard>
    </PageTransition>
  );
}
