import { useState } from "react";
import {
  Sparkles, Cpu, CheckCircle2, ShieldAlert, ArrowRight, Clock, MapPin, Zap, RefreshCw, Send,
  Layers, ShieldCheck, HelpCircle, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { analyzeProjectWithAI } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import BookingModal from "../components/modals/BookingModal";
import PageTransition from "../components/ui/PageTransition";

const SAMPLE_PROMPTS = [
  "Building an autonomous agricultural quadcopter drone with TensorRT obstacle avoidance and multispectral crop analysis.",
  "Developing an IoT LoRaWAN solar-powered water quality node with micro-PCB trace routing and sensor calibration.",
  "Culturing fluorescent mammalian cells with fluorescence microscopy to study CRISPR gene-editing transfection efficiency.",
  "Designing a high-voltage brushless DC motor ESC controller with regenerative braking and sub-nanosecond oscilloscope diagnostics.",
];

export default function AIProjectAnalyzer() {
  const [prompt, setPrompt] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedEqToBook, setSelectedEqToBook] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleAnalyze = (textToAnalyze) => {
    const text = textToAnalyze || prompt;
    if (!text.trim()) {
      toast.error("Please describe your project idea or research goal.");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    // Simulate Claude API reasoning latency
    setTimeout(() => {
      const res = analyzeProjectWithAI(text);
      setAnalysisResult(res);
      setAnalyzing(false);
      toast.success("AI project synthesis complete!", { icon: "🤖" });
    }, 950);
  };

  const handleQuickPrompt = (sample) => {
    setPrompt(sample);
    handleAnalyze(sample);
  };

  const handleBookItem = (eq) => {
    setSelectedEqToBook(eq);
    setBookingModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-glow/40 bg-gradient-to-r from-[#101A35]/90 via-[#0B1224]/85 to-[#101A35]/90 p-6 lg:p-8 backdrop-blur-xl shadow-purple">
          <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-purple-glow/20 blur-3xl animate-pulse-glow" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="badge-purple">Claude 3.5 Sonnet Integration</span>
              <span className="text-xs text-white/50">• 10-Point Technical Evaluation</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl text-white">
              AI-Powered <span className="text-gradient">Project Analyzer</span>
            </h1>
            <p className="mt-1 text-sm text-white/65">
              Describe your engineering thesis, research concept or capstone project. Our AI scans real campus lab inventories to suggest matched equipment, alternative substitutes, safe lab spaces, and protocols.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="glass-card p-6">
          <label className="block text-xs font-medium text-white/80 mb-2">
            Describe your project, experimental methodology, or required outcomes
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I am building a computer vision payload for an autonomous delivery drone. I need to calibrate motor PWM signals, mill a custom power board, and test neural network latency on an embedded GPU..."
              className="input-field resize-none text-sm"
            />
          </div>

          {/* Quick suggestions */}
          <div className="mt-3">
            <p className="text-[11px] font-medium text-white/50 mb-1.5">Try an example project thesis:</p>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(sample)}
                  className="rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1 text-[11px] text-white/70 hover:text-white border border-white/5 transition"
                >
                  {sample.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <GlowButton
              onClick={() => handleAnalyze()}
              disabled={analyzing}
              className="py-2.5 px-6 text-xs flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Synthesizing Instruments & Specifications...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Analyze Project with Claude AI
                </>
              )}
            </GlowButton>
          </div>
        </div>

        {/* Analysis Results View */}
        {analysisResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Domain Classification Banner */}
            <div className="glass p-6 border-cyan-glow/40 shadow-cyan relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40">
                    <Zap size={18} />
                  </span>
                  <div>
                    <span className="badge-cyan text-[10px] uppercase font-bold tracking-wider">
                      {analysisResult.category}
                    </span>
                    <h3 className="mt-1 font-bold text-white text-base">
                      AI Resource Recommendation Synthesis
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Feasibility: {analysisResult.feasibilityScore}%
                  </span>
                  <span className="rounded-xl bg-purple-glow/10 border border-purple-glow/30 px-3 py-1 text-xs font-semibold text-purple-glow">
                    Fair Allocation: {analysisResult.fairnessPriorityScore}/100
                  </span>
                  <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    ~{analysisResult.estimatedTotalHours} Lab Hours
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-white/85 leading-relaxed font-body">
                {analysisResult.summary}
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-cyan-300 font-mono">
                <ShieldCheck size={13} className="text-cyan-glow" />
                <span>{analysisResult.allocationRemarks}</span>
              </div>
            </div>

            {/* Matched Laboratory Instruments with Priority & Alternatives */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <Cpu size={16} className="text-cyan-glow" /> Matched Laboratory Instruments & Specifications
                </h3>
                <span className="text-xs text-white/50">Cross-verified against live campus inventory</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analysisResult.recommendedEquipment.map((eq) => {
                  const isCritical = eq.priority === "CRITICAL";
                  const isHigh = eq.priority === "HIGH";
                  return (
                    <div
                      key={eq.id}
                      className="glass-card flex flex-col justify-between p-5 border-white/15 hover:border-cyan-glow/40 transition relative overflow-hidden"
                    >
                      {/* Priority Tag */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                              isCritical
                                ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                                : isHigh
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                                : "bg-cyan-glow/15 text-cyan-300 border-cyan-glow/40"
                            }`}
                          >
                            {eq.priority} Priority
                          </span>
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                            <CheckCircle2 size={12} /> {eq.availableUnits} available
                          </span>
                        </div>

                        <h4 className="mt-2.5 text-sm font-bold text-white leading-tight">{eq.name}</h4>
                        
                        <p className="mt-1 text-xs text-white/50 flex items-center gap-1">
                          <MapPin size={11} className="text-aqua-glow flex-shrink-0" />
                          <span>{eq.lab}</span>
                        </p>

                        {/* Rationale */}
                        <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-white/80 border border-white/5">
                          <strong className="text-cyan-glow text-[11px] block mb-0.5">Why it's needed:</strong>
                          <span>{eq.reason}</span>
                        </div>

                        {/* Specifications */}
                        {eq.requiredSpecs && (
                          <div className="mt-2 text-[11px] text-white/60 font-mono">
                            <span className="text-white/40">Required Specs:</span> {eq.requiredSpecs}
                          </div>
                        )}

                        {/* Alternative Recommendation */}
                        {eq.alternative && (
                          <div className="mt-2.5 rounded-lg border border-purple-glow/20 bg-purple-glow/5 p-2 text-[11px] text-purple-200">
                            <span className="font-semibold text-purple-400 block mb-0.5">
                              Alternative Suggestion (if busy):
                            </span>
                            <span>{eq.alternative}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="badge-purple text-[10px]">{eq.department.split(" ")[0]}</span>
                        <GlowButton
                          onClick={() => handleBookItem(eq)}
                          className="py-1.5 px-3.5 text-xs shadow-cyan"
                        >
                          Reserve Slot <ArrowRight size={13} />
                        </GlowButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested Facilities & Safety Protocols */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="glass p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-2">
                  <MapPin size={15} className="text-purple-glow" /> Approved Campus Research Facilities
                </h4>
                <ul className="mt-3 space-y-2">
                  {analysisResult.labSpaces.map((lab, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" /> {lab}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass p-5 border-amber-500/20">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-2">
                  <ShieldAlert size={15} className="text-amber-400" /> Mandatory Safety Protocols & PPE Clearance
                </h4>
                <ul className="mt-3 space-y-2">
                  {analysisResult.safety.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        initialEquipment={selectedEqToBook}
        onClose={() => setBookingModalOpen(false)}
      />
    </PageTransition>
  );
}
