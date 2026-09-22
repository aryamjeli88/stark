import React from "react";

interface WorkflowVisualProps {
  moduleNumber: string;
  size?: "sm" | "md" | "lg";
}

export default function WorkflowVisual({ moduleNumber, size = "md" }: WorkflowVisualProps) {
  const sizeClasses =
    size === "lg"
      ? "w-48 h-48 sm:w-56 sm:h-56 p-3.5"
      : size === "sm"
      ? "w-28 h-28 p-2"
      : "w-36 h-36 sm:w-40 sm:h-40 p-2.5";

  return (
    <div className={`relative ${sizeClasses} rounded-full bg-slate-50/90 border border-emerald-500/25 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-500/60 group-hover:shadow-[0_0_24px_rgba(16,185,129,0.18)] transition-all duration-300 select-none`}>
      {/* Outer subtle calibration ring background */}
      <div className="absolute inset-1 rounded-full border border-dashed border-slate-300/80 pointer-events-none" />

      {moduleNumber === "01" && <Module01Visual />}
      {moduleNumber === "02" && <Module02Visual />}
      {moduleNumber === "03" && <Module03Visual />}
      {moduleNumber === "04" && <Module04Visual />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODULE 01: Field Image Ingestion (Scanning Laser Line over Vision Grid)
// ---------------------------------------------------------------------------
function Module01Visual() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10"
      aria-label="Field Image Ingestion Vision Scanner"
    >
      <defs>
        {/* Laser beam gradient sweep */}
        <linearGradient id="laserGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#A1FFCB" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>

        <clipPath id="circleClip01">
          <circle cx="100" cy="100" r="92" />
        </clipPath>
      </defs>

      <style>{`
        @keyframes scanMove {
          0%, 100% { transform: translateY(32px); }
          50% { transform: translateY(148px); }
        }
        @keyframes reticlePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes nodeBlink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .laser-line-group {
          animation: scanMove 3.4s ease-in-out infinite;
        }
        .reticle-box {
          transform-origin: 100px 100px;
          animation: reticlePulse 3s ease-in-out infinite;
        }
        .node-pulse {
          animation: nodeBlink 1.8s ease-in-out infinite;
        }
      `}</style>

      <g clipPath="url(#circleClip01)">
        {/* Sub-surface Vision Matrix Grid */}
        <g stroke="#073B34" strokeOpacity="0.12" strokeWidth="1">
          <line x1="40" y1="0" x2="40" y2="200" />
          <line x1="70" y1="0" x2="70" y2="200" />
          <line x1="100" y1="0" x2="100" y2="200" strokeDasharray="3 3" strokeOpacity="0.25" />
          <line x1="130" y1="0" x2="130" y2="200" />
          <line x1="160" y1="0" x2="160" y2="200" />

          <line x1="0" y1="40" x2="200" y2="40" />
          <line x1="0" y1="70" x2="200" y2="70" />
          <line x1="0" y1="100" x2="200" y2="100" strokeDasharray="3 3" strokeOpacity="0.25" />
          <line x1="0" y1="130" x2="200" y2="130" />
          <line x1="0" y1="140" x2="200" y2="160" />
        </g>

        {/* Viewfinder Target Reticle */}
        <g className="reticle-box" stroke="#10B981" strokeWidth="1.8" fill="none">
          {/* Top-Left Bracket */}
          <path d="M 68 82 L 68 68 L 82 68" />
          {/* Top-Right Bracket */}
          <path d="M 132 82 L 132 68 L 118 68" />
          {/* Bottom-Left Bracket */}
          <path d="M 68 118 L 68 132 L 82 132" />
          {/* Bottom-Right Bracket */}
          <path d="M 132 118 L 132 132 L 118 132" />
          {/* Target Central Crosshair */}
          <circle cx="100" cy="100" r="3" fill="#10B981" stroke="none" />
        </g>

        {/* Key Vision Detected Feature Points */}
        <circle cx="70" cy="85" r="2.5" fill="#10B981" className="node-pulse" />
        <circle cx="130" cy="75" r="2.5" fill="#10B981" className="node-pulse" style={{ animationDelay: "0.6s" }} />
        <circle cx="85" cy="125" r="2.5" fill="#10B981" className="node-pulse" style={{ animationDelay: "1.2s" }} />
        <circle cx="125" cy="120" r="2.5" fill="#10B981" className="node-pulse" style={{ animationDelay: "0.9s" }} />

        {/* Animated Laser Scanning Line with Trailing Beam */}
        <g className="laser-line-group">
          {/* Soft trailing illumination field */}
          <rect x="25" y="-18" width="150" height="18" fill="url(#laserGlow)" />
          {/* Crisp laser beam */}
          <line x1="25" y1="0" x2="175" y2="0" stroke="#10B981" strokeWidth="2.2" />
          {/* Core high-intensity laser center */}
          <line x1="75" y1="0" x2="125" y2="0" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Left/Right beam origin ticks */}
          <circle cx="28" cy="0" r="2" fill="#10B981" />
          <circle cx="172" cy="0" r="2" fill="#10B981" />
        </g>
      </g>

      {/* Static Perimeter Angle Calibration Marks */}
      <g stroke="#073B34" strokeWidth="1.2" opacity="0.35">
        <line x1="100" y1="6" x2="100" y2="12" />
        <line x1="100" y1="188" x2="100" y2="194" />
        <line x1="6" y1="100" x2="12" y2="100" />
        <line x1="188" y1="100" x2="194" y2="100" />
      </g>

      {/* Monospace Micro Readout */}
      <text
        x="100"
        y="172"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="8"
        fontWeight="bold"
        fill="#073B34"
        letterSpacing="1"
      >
        CV_OPTICAL: ACTIVE
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MODULE 02: Historical Asset Context (Multi-Year Wall Degradation Trend Lines)
// ---------------------------------------------------------------------------
function Module02Visual() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10"
      aria-label="Historical Degradation Multi-Year Trend"
    >
      <defs>
        <clipPath id="circleClip02">
          <circle cx="100" cy="100" r="92" />
        </clipPath>
        <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#073B34" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#A1FFCB" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseNode {
          0%, 100% { r: 3.5; opacity: 0.8; }
          50% { r: 5; opacity: 1; }
        }
        .trend-animated-line {
          stroke-dasharray: 240;
          animation: dashFlow 4.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .active-year-node {
          animation: pulseNode 2s ease-in-out infinite;
        }
      `}</style>

      <g clipPath="url(#circleClip02)">
        {/* Polar Distance Rings & Grid */}
        <circle cx="100" cy="100" r="75" fill="none" stroke="#073B34" strokeOpacity="0.08" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#073B34" strokeOpacity="0.08" />
        <circle cx="100" cy="100" r="25" fill="none" stroke="#073B34" strokeOpacity="0.08" />

        {/* Reference Axis Lines */}
        <line x1="30" y1="145" x2="170" y2="145" stroke="#073B34" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="35" y1="40" x2="35" y2="145" stroke="#073B34" strokeOpacity="0.2" strokeWidth="1" />

        {/* API 653 Minimum Critical Wall Limit (t_min) */}
        <line
          x1="35"
          y1="120"
          x2="165"
          y2="120"
          stroke="#EF4444"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <text
          x="162"
          y="117"
          textAnchor="end"
          fontFamily="monospace"
          fontSize="7"
          fill="#EF4444"
          fontWeight="bold"
        >
          t_min LIMIT
        </text>

        {/* Historical Degradation Baseline (Dashed older record) */}
        <path
          d="M 40 65 Q 75 75, 100 88 T 160 115"
          fill="none"
          stroke="#64748B"
          strokeWidth="1.6"
          strokeDasharray="3 3"
          opacity="0.5"
        />

        {/* Continuous Active Measured Trend Curve */}
        <path
          d="M 40 60 Q 75 68, 105 84 T 160 108"
          fill="none"
          stroke="url(#trendGradient)"
          strokeWidth="2.8"
          strokeLinecap="round"
          className="trend-animated-line"
        />

        {/* Multi-Year Inspection Sampling Nodes */}
        {/* Node 1: 2012 */}
        <circle cx="40" cy="60" r="3" fill="#073B34" stroke="#FFFFFF" strokeWidth="1" />
        {/* Node 2: 2018 */}
        <circle cx="85" cy="72" r="3" fill="#073B34" stroke="#FFFFFF" strokeWidth="1" />
        {/* Node 3: 2024 */}
        <circle cx="125" cy="94" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
        {/* Node 4: 2026 (Active Real-Time Point) */}
        <circle cx="160" cy="108" r="4" fill="#10B981" stroke="#A1FFCB" strokeWidth="2" className="active-year-node" />

        {/* Year Ticks on X Axis */}
        <text x="40" y="156" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#64748B">
          &apos;12
        </text>
        <text x="85" y="156" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#64748B">
          &apos;18
        </text>
        <text x="125" y="156" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#64748B">
          &apos;24
        </text>
        <text x="160" y="156" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#10B981" fontWeight="bold">
          &apos;26
        </text>
      </g>

      {/* Header Telemetry Badge */}
      <text
        x="100"
        y="32"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="7.5"
        fontWeight="bold"
        fill="#073B34"
        letterSpacing="0.8"
      >
        YEARS: 14-YR TREND
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MODULE 03: Risk Calculation & Priority (Circular Dial with Animated Progress Stroke)
// ---------------------------------------------------------------------------
function Module03Visual() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10"
      aria-label="API 653 Risk Calculation Gauge"
    >
      <defs>
        <linearGradient id="gaugeGradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#073B34" />
          <stop offset="70%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#A1FFCB" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes gaugeStrokeAnim {
          0% { stroke-dashoffset: 380; }
          50% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 140; }
        }
        @keyframes tickPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .progress-stroke {
          stroke-dasharray: 410;
          animation: gaugeStrokeAnim 4s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
        }
        .gauge-ticks {
          animation: tickPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Radial 24 Calibration Ticks */}
      <g className="gauge-ticks" stroke="#073B34" strokeWidth="1.2">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const isMajor = i % 6 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={isMajor ? "16" : "20"}
              x2="100"
              y2="25"
              transform={`rotate(${angle} 100 100)`}
              strokeOpacity={isMajor ? "0.6" : "0.25"}
              strokeWidth={isMajor ? "1.8" : "1"}
            />
          );
        })}
      </g>

      {/* Gauge Background Track */}
      <circle
        cx="100"
        cy="100"
        r="65"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Inner Calculation Grid Matrix */}
      <circle cx="100" cy="100" r="48" fill="none" stroke="#073B34" strokeOpacity="0.07" />

      {/* Dynamic Animated Progress Stroke (API 653 Wall Ratio) */}
      <circle
        cx="100"
        cy="100"
        r="65"
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="6.5"
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
        className="progress-stroke"
      />

      {/* Central Telemetry Value Display */}
      <g textAnchor="middle">
        <text
          x="100"
          y="93"
          fontFamily="monospace"
          fontSize="18"
          fontWeight="bold"
          fill="#0B2B26"
          letterSpacing="-0.5"
        >
          0.285″
        </text>
        <text
          x="100"
          y="110"
          fontFamily="monospace"
          fontSize="7"
          fontWeight="bold"
          fill="#10B981"
          letterSpacing="1"
        >
          t_act / t_req
        </text>
        <text
          x="100"
          y="124"
          fontFamily="monospace"
          fontSize="6.5"
          fill="#64748B"
          fontWeight="bold"
        >
          API 653 COMPLIANT
        </text>
      </g>

      {/* Corner Status Badges */}
      <circle cx="100" cy="172" r="2.5" fill="#10B981" />
      <text
        x="100"
        y="183"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="7"
        fontWeight="bold"
        fill="#073B34"
        letterSpacing="0.8"
      >
        SAFETY MARGIN: PASS
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MODULE 04: Engineer Verification & Audit (Cryptographic Shield with Verification Pulse)
// ---------------------------------------------------------------------------
function Module04Visual() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10"
      aria-label="Engineer Cryptographic Audit Shield"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#073B34" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes radarRipple {
          0% { r: 24; opacity: 0.8; stroke-width: 1.5; }
          100% { r: 76; opacity: 0; stroke-width: 0.5; }
        }
        @keyframes shieldGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(16,185,129,0.3)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 0 8px rgba(16,185,129,0.6)); }
        }
        .verification-pulse {
          animation: radarRipple 2.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .shield-container {
          transform-origin: 100px 100px;
          animation: shieldGlow 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Rotating Outer Security Verification Hashes */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="#073B34" strokeOpacity="0.12" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="#10B981"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* Concentric Verification Ripple Pulses */}
      <circle cx="100" cy="100" r="30" fill="none" stroke="#10B981" className="verification-pulse" />
      <circle
        cx="100"
        cy="100"
        r="30"
        fill="none"
        stroke="#10B981"
        className="verification-pulse"
        style={{ animationDelay: "1.4s" }}
      />

      {/* Central Certified Engineering Shield */}
      <g className="shield-container">
        {/* Shield Geometry */}
        <path
          d="M 100 52 
             L 136 66 
             C 136 102, 122 130, 100 144 
             C 78 130, 64 102, 64 66 
             Z"
          fill="url(#shieldGrad)"
          stroke="#073B34"
          strokeWidth="2"
        />

        {/* Inner Emerald Accent Border */}
        <path
          d="M 100 58 
             L 130 70 
             C 130 99, 118 123, 100 135 
             C 82 123, 70 99, 70 70 
             Z"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
        />

        {/* Human-In-The-Loop Checkmark & Key Node */}
        <path
          d="M 87 97 L 97 107 L 115 87"
          fill="none"
          stroke="#10B981"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Shield Core Node */}
        <circle cx="100" cy="74" r="3" fill="#073B34" />
      </g>

      {/* Top & Bottom Audit Sign-Off Labels */}
      <text
        x="100"
        y="36"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="7.5"
        fontWeight="bold"
        fill="#073B34"
        letterSpacing="1"
      >
        API 653 LEVEL III
      </text>
      <text
        x="100"
        y="172"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="7"
        fontWeight="bold"
        fill="#10B981"
        letterSpacing="0.8"
      >
        SHA-256 AIR-GAP AUDIT
      </text>
    </svg>
  );
}
