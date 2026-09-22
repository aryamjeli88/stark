import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import WorkflowVisual from "./WorkflowVisual.tsx";
import { AreaItem } from "../data.ts";
import { StarkLogo } from "./StarkLogo.tsx";

interface WorkflowDetailModalProps {
  module: AreaItem | null;
  onClose: () => void;
  onSelectModule: (module: AreaItem) => void;
  allModules: AreaItem[];
}

const MODULE_TECH_SPECS: Record<
  string,
  {
    subtitle: string;
    engineType: string;
    inputs: string[];
    formula: string;
    formulaLabel: string;
    outputArtifact: string;
    latency: string;
    complianceCode: string;
  }
> = {
  "01": {
    subtitle: "On-Device Optical & Ultrasonic Wall Capture",
    engineType: "STARK EdgeCV Tensor v2.4 (Metal / CUDA / Vulkan)",
    inputs: [
      "4K 60FPS Raw Optical Sensor Stream (Local YUV420)",
      "High-Frequency Ultrasonic Thickness (UT) Dual-Element Transducer",
      "Field Terminal Barcode & GPS Coordinate Lock"
    ],
    formula: "Res(X, Y) = BilinearRectify(Sensor_in) ⊗ LocalEdgeMask",
    formulaLabel: "Deterministic Coordinate Rectification",
    outputArtifact: "Normalized Shell Plate Tile (2048x2048) + Georeferenced UT Point Cloud",
    latency: "< 340ms per quadrant frame",
    complianceCode: "API 653 Section 4.3.2 (Inspection Planning)"
  },
  "02": {
    subtitle: "Longitudinal Tank Shell Degradation Record",
    engineType: "Local Deterministic SQLite & Temporal Spline Fitter",
    inputs: [
      "Historical Inspection Archives (2012 - 2024 CSV / XML / PDF)",
      "Original Equipment Manufacturer (OEM) Plate Thickness Schedule",
      "Welded Ring Course Orientation & Height Datums"
    ],
    formula: "CR_longitudinal = (t_initial - t_current) / ΔYears_service",
    formulaLabel: "Long-term Corrosion Rate Model",
    outputArtifact: "Unbroken Shell Plate Wear Trajectory & Multi-Year Thickness History",
    latency: "< 45ms instant local query",
    complianceCode: "API 653 Section 4.4.2 (Corrosion Rate Assessment)"
  },
  "03": {
    subtitle: "API 653 Deterministic Formula Engine",
    engineType: "Deterministic Mathematical Core (Zero Heuristic Drift)",
    inputs: [
      "Tank Nominal Diameter (D = 120.0 ft)",
      "Liquid Fill Height Design Maximum (H = 48.0 ft)",
      "Stored Fluid Specific Gravity (G = 0.92)",
      "Material Allowable Stress (S = 23,600 PSI)",
      "Joint Efficiency Factor (E = 0.85)"
    ],
    formula: "t_min = (2.6 · D · (H - 1) · G) / (S · E)",
    formulaLabel: "API 653 Eq. 4-1 Minimum Thickness",
    outputArtifact: "t_min = 0.285 in • Corrosion Margin = +0.065 in • Risk Index = 82/100",
    latency: "< 8ms deterministic execution",
    complianceCode: "API 653 Section 4.3.3.1 (Shell Minimum Thickness)"
  },
  "04": {
    subtitle: "Human-in-the-Loop Cryptographic Sign-Off",
    engineType: "Air-Gapped FIPS 186-4 ECDSA P-256 Engine",
    inputs: [
      "Certified Inspector Hardware Keycard / NFC Token",
      "Engineering Calibration Override & Thickness Confirmation",
      "Immutable Device Timestamp & Cryptographic Nonce"
    ],
    formula: "Signature = ECDSA_Sign(SHA256(InspectionPayload), PrivateKey_Inspector)",
    formulaLabel: "Air-Gapped Audit Seal",
    outputArtifact: "Tamper-Evident API 653 Inspection Certificate (PDF/A + Raw JSON Ledger)",
    latency: "Immediate signed seal verification",
    complianceCode: "API 653 Section 6.4 (Certified Inspection Reports)"
  }
};

export default function WorkflowDetailModal({
  module,
  onClose,
  onSelectModule,
  allModules
}: WorkflowDetailModalProps) {
  const [simulationState, setSimulationState] = useState<"idle" | "running" | "complete">("idle");
  const [simProgress, setSimProgress] = useState(0);

  useEffect(() => {
    // Reset simulation on module change
    setSimulationState("idle");
    setSimProgress(0);
  }, [module?.number]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!module) return null;

  const specs = MODULE_TECH_SPECS[module.number] || MODULE_TECH_SPECS["01"];
  const currentIndex = allModules.findIndex((m) => m.number === module.number);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : allModules[allModules.length - 1];
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : allModules[0];

  const handleRunSimulation = () => {
    if (simulationState === "running") return;
    setSimulationState("running");
    setSimProgress(0);

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationState("complete");
          return 100;
        }
        return prev + 20;
      });
    }, 160);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/65 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col border border-emerald-500/40 bg-white/95 backdrop-blur-xl shadow-2xl card-top-accent overflow-hidden text-[#0F172A]"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center gap-4">
            <StarkLogo variant="icon" className="h-8 w-auto hidden sm:block" />
            <span className="flex items-center justify-center h-8 w-10 bg-[#073B34] text-white font-mono text-xs font-bold tracking-wider">
              {module.number}
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#10B981] font-bold">
                SYSTEM WORKFLOW ARCHITECTURE
              </p>
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#0B2B26]">
                {module.title.replace("\n", " ")}
              </h3>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-[#073B34] hover:text-white transition-colors"
            data-cursor="Close"
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar">
          {/* TOP SECTION: GRAPHIC PREVIEW & CORE TELEMETRY */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-emerald-50/40 border border-emerald-500/20 p-6 sm:p-8">
            <div className="md:col-span-5 flex flex-col items-center justify-center gap-4">
              <WorkflowVisual moduleNumber={module.number} size="lg" />
              <div className="flex items-center gap-2 font-mono text-xs text-[#073B34] font-bold">
                <span className="block h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{specs.complianceCode}</span>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <span className="font-mono text-xs text-[#10B981] uppercase tracking-wider font-bold">
                  {specs.subtitle}
                </span>
                <p className="mt-2 text-base text-slate-700 leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* ENGINE TELEMETRY BAR */}
              <div className="border border-slate-200 bg-white p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">ENGINE:</span>
                  <span className="font-bold text-[#073B34]">{specs.engineType}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">LATENCY:</span>
                  <span className="font-bold text-[#10B981]">{specs.latency}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">NETWORK:</span>
                  <span className="font-bold text-slate-800">100% AIR-GAPPED (OFFLINE)</span>
                </div>
              </div>

              {/* SIMULATION ACTION BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={simulationState === "running"}
                  className="group inline-flex items-center justify-between w-full h-10 px-4 border border-[#073B34] bg-[#073B34] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#10B981] hover:border-[#10B981] transition-colors disabled:opacity-60"
                >
                  <span className="font-bold">
                    {simulationState === "running"
                      ? "Executing Deterministic Stage..."
                      : simulationState === "complete"
                      ? "Stage Verification Complete ✓"
                      : "Run Simulated Diagnostics"}
                  </span>
                  <span className="text-mint font-mono">{simProgress}%</span>
                </button>
                {simulationState === "running" && (
                  <div className="w-full bg-slate-200 h-1 mt-1 overflow-hidden">
                    <div
                      className="bg-[#10B981] h-full transition-all duration-150"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LOWER SECTION: SPECIFICATION BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INPUT TELEMETRY */}
            <div className="border border-slate-200 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="block h-2 w-2 bg-[#10B981]" />
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold">
                    Ingestion & Sensor Input Feeds
                  </h4>
                </div>
                <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
                  {specs.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#10B981] font-bold">›</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DETERMINISTIC FORMULA / OUTPUT */}
            <div className="border border-slate-200 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="block h-2 w-2 bg-[#10B981]" />
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold">
                    {specs.formulaLabel}
                  </h4>
                </div>
                <div className="mt-4 bg-slate-50 border border-slate-200 p-3 font-mono text-xs text-[#073B34] font-bold overflow-x-auto">
                  <code>{specs.formula}</code>
                </div>
                <div className="mt-4">
                  <p className="font-mono text-xs text-slate-400 uppercase">Deterministic Output Artifact:</p>
                  <p className="mt-1 font-mono text-xs text-[#0B2B26] font-semibold">
                    {specs.outputArtifact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER WITH PREV / NEXT NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-slate-200/80 bg-slate-50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectModule(prevModule)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white font-mono text-xs text-[#073B34] hover:bg-slate-100 transition-colors"
            >
              <span>← Module {prevModule.number}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModule(nextModule)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white font-mono text-xs text-[#073B34] hover:bg-slate-100 transition-colors"
            >
              <span>Module {nextModule.number} →</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 border border-[#073B34] bg-[#073B34] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#10B981] hover:border-[#10B981] transition-colors"
          >
            Close Stage Inspector
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
