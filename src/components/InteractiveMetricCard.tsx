import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  isSquare: boolean;
}

interface InteractiveMetricCardProps {
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
  delay?: number;
  isAccent?: boolean;
  telemetryCode?: string;
}

const GLYPHS = "0123456789ABCDEF!@#$%&*<>[]{}~/\\";
const PARTICLE_COLORS = ["#10B981", "#A1FFCB", "#073B34", "#34D399", "#059669"];

export default function InteractiveMetricCard({
  prefix = "",
  value,
  suffix = "",
  label,
  delay = 0,
  isAccent = false,
  telemetryCode = "CH-01"
}: InteractiveMetricCardProps) {
  const [displayText, setDisplayText] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [hasBursted, setHasBursted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Micro-burst particle emitter
  const triggerBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const count = 32;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5.5;
      newParticles.push({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 1,
        decay: 0.025 + Math.random() * 0.025,
        isSquare: Math.random() > 0.4
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (!animFrameRef.current) {
      const renderParticles = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const activeParticles: Particle[] = [];

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.alpha -= p.decay;

          if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = "#10B981";
            ctx.shadowBlur = 8;

            if (p.isSquare) {
              ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
            activeParticles.push(p);
          }
        }

        particlesRef.current = activeParticles;

        if (particlesRef.current.length > 0) {
          animFrameRef.current = requestAnimationFrame(renderParticles);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(renderParticles);
    }
  }, []);

  // Resize canvas to match card dimensions
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current && cardRef.current) {
        canvasRef.current.width = cardRef.current.offsetWidth;
        canvasRef.current.height = cardRef.current.offsetHeight;
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Trigger burst on scroll entrance into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBursted) {
          setHasBursted(true);
          // slight stagger before burst
          setTimeout(() => {
            triggerBurst();
          }, 250 + delay * 800);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasBursted, triggerBurst, delay]);

  // Telemetry decode / glitch effect on hover / tap
  const runDecodeEffect = useCallback(() => {
    triggerBurst();
    const original = value;
    const length = original.length;
    let iteration = 0;
    const maxIterations = 14;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return original
          .split("")
          .map((char, index) => {
            if (char === " " || char === "<" || char === ">" || char === "%") {
              return char;
            }
            if (index < (iteration / maxIterations) * length) {
              return original[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
      });

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(original);
      }
    }, 28);
  }, [value, triggerBurst]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    runDecodeEffect();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseEnter}
      className={`group relative card-hover-lift flex flex-col justify-between p-8 xl:p-10 min-h-[260px] overflow-hidden select-none cursor-pointer transition-colors duration-300 border-t-2 ${
        isAccent
          ? "bg-gradient-to-br from-emerald-50/90 via-white to-[#A1FFCB]/30 text-[#073B34] border-t-emerald-500"
          : "bg-white text-[#0F172A] border-t-transparent hover:border-t-emerald-500/80"
      }`}
      data-cursor="Telemetry"
    >
      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />

      {/* Subtle telemetry channel header */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-2">
        <span className="flex items-center gap-1.5 font-bold text-[#073B34]">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              isHovered ? "bg-[#10B981] animate-ping" : "bg-slate-300"
            }`}
          />
          {telemetryCode}
        </span>
        <span className="text-emerald-700 font-bold transition-opacity duration-200">
          {isHovered ? "LIVE TELEMETRY" : "AIR-GAPPED"}
        </span>
      </div>

      {/* Main Metric Digits with Burst Trigger */}
      <div ref={numberRef} className="relative z-10 my-auto py-2">
        <div
          className={`font-mono text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight transition-transform duration-300 ${
            isHovered ? "scale-[1.02]" : "scale-100"
          } ${isAccent ? "text-[#10B981]" : "text-[#0B2B26]"}`}
        >
          <span className="inline-flex items-center">
            {prefix && (
              <span className="mr-1 text-slate-600 text-3xl sm:text-4xl xl:text-5xl font-normal">
                {prefix}
              </span>
            )}
            <span className="font-mono tracking-tight font-bold">{displayText}</span>
            {suffix && (
              <span className="ml-0.5 text-emerald-700 text-3xl sm:text-4xl xl:text-5xl">
                {suffix}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Metric Label & Status Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold group-hover:text-[#073B34] transition-colors">
          {label}
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span>VERIFIED ON STEEL</span>
          <span className="text-[#10B981] font-bold">API 653</span>
        </div>
      </div>
    </motion.div>
  );
}
