import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence } from "motion/react";
import {
  NAV_LINKS,
  STANDARDS_MARQUEE,
  METRICS,
  WORKFLOW_AREAS,
  STRATEGIC_VALUES,
  COMPARISON_DATA,
  ValueCard,
  AreaItem
} from "./data.ts";
import { content, Language, TranslatedValueCard } from "./translations.ts";
import { StarkLogo } from "./components/StarkLogo.tsx";
import CustomCursor from "./components/CustomCursor.tsx";
import InteractiveMetricCard from "./components/InteractiveMetricCard.tsx";
import WorkflowVisual from "./components/WorkflowVisual.tsx";
import WorkflowDetailModal from "./components/WorkflowDetailModal.tsx";
import heroVideoSrc from "./assets/hero_video.mp4";

// Smooth line-mask & blur-to-focus text reveal component
function RevealText({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden align-top ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "85%", opacity: 0, filter: "blur(6px)" }}
        whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "0px 0px -20px 0px" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Blur-to-focus transition wrapper for cards and paragraphs
function BlurFade({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Mechanical slot-machine ticker roll component for numbers
function RollingNumber({
  value,
  prefix = "",
  suffix = "",
  className = ""
}: {
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const characters = value.split("");

  return (
    <span ref={containerRef} className={`inline-flex items-center font-mono font-bold ${className}`}>
      {prefix && <span>{prefix}</span>}
      {characters.map((char, index) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return <span key={index}>{char}</span>;
        }

        const digit = parseInt(char, 10);
        return (
          <span
            key={index}
            className="relative inline-block overflow-hidden"
            style={{ height: "1em", lineHeight: "1em" }}
          >
            <span className="invisible">{char}</span>
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              initial={{ y: "0%" }}
              animate={{ y: inView ? `-${digit * 10}%` : "0%" }}
              transition={{
                duration: 1.6 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <span
                  key={num}
                  className="flex items-center justify-center"
                  style={{ height: "1em", lineHeight: "1em" }}
                >
                  {num}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const t = content[lang];

  const [activeValueIndex, setActiveValueIndex] = useState(0);
  const [activeWorkflowNumber, setActiveWorkflowNumber] = useState<string>("01");
  const [inspectingWorkflowModule, setInspectingWorkflowModule] = useState<AreaItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("System Access");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // إجبار تشغيل الفيديو برمجياً لتجنب مشكلة الشاشة السوداء في المتصفحات
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay restricted:", err);
      });
    }
  }, []);

  // مزامنة اتجاه الصفحة واللغة مع الحالة الحالية (تعمل عند أول تحميل وعند كل تبديل)
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // تبديل اللغة
  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  // 1. SMOOTH MOMENTUM SCROLL: LENIS INTEGRATION
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    } as any);
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.hash.startsWith("#")) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -64,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // 2. MOUSE TRACKING FOR 3D PERSPECTIVE WATERMARK
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Subtle interactive engineering grid canvas in background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const points: { x: number; y: number; vx: number; vy: number }[] = [];
    const numPoints = Math.min(30, Math.floor(width / 50));

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Coordinate engineering grid lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
      ctx.lineWidth = 1;
      const gridSize = 90;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.05 * (1 - dist / 130)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const strategicValuesList = t.strategicValues || STRATEGIC_VALUES;
  const activeValue = strategicValuesList[activeValueIndex] || strategicValuesList[0];

  return (
    <div
      className={`relative min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#A1FFCB] selection:text-[#073B34] overflow-x-hidden ${
        lang === "ar" ? "font-['Tajawal',sans-serif]" : "font-sans"
      }`}
    >
      {/* 2. CUSTOM TWO-TIER LUXURY TRAILING CURSOR */}
      <CustomCursor />

      {/* BACKGROUND 3D CANVAS GRID */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
      />

      {/* 3D PERSPECTIVE WATERMARK STARK EMBLEM */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] flex h-screen items-center justify-center opacity-30 transition-transform duration-700 ease-out"
        style={{
          perspective: "1000px"
        }}
      >
        <div
          className="transition-transform duration-500 ease-out"
          style={{
            transform: `translateZ(1px) rotateY(${mousePos.x * 14 - 8.64}deg) rotateX(${-mousePos.y * 10}deg)`
          }}
        >
          <StarkLogo variant="icon" className="h-auto w-[min(65vw,38rem)] max-w-full opacity-20" />
        </div>
      </div>

      {/* 1. NAVIGATION BAR WITH LANGUAGE TOGGLE */}
      <header className="sticky top-0 z-50 flex h-[64px] w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 sm:px-6 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center transition-opacity hover:opacity-90 py-1"
            data-cursor="STARK"
            title="STARK - SMART TANK ASSESSMENT & RISK KEEPER"
          >
            <StarkLogo variant="full" inverted={false} className="h-10 sm:h-11 w-auto" />
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-50 text-[10px] font-mono font-bold text-[#073B34]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>STARK // ستارك</span>
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex font-mono text-xs uppercase tracking-wider text-[#073B34]">
          {t.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 font-semibold text-[#073B34] hover:text-[#10B981] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#10B981] hover:after:w-full after:transition-all after:duration-300"
              data-cursor="Navigate"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* RIGHT CONTROLS: LANGUAGE TOGGLE & SYSTEM ACCESS CTA */}
        <div className="flex items-center gap-3">
          {/* زر لغة نصي بسيط جداً بخط رمادي بدون أي إطارات أو مربعات */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs font-mono font-medium text-slate-500 hover:text-[#073B34] transition-colors cursor-pointer tracking-wider uppercase"
            data-cursor="Language"
          >
            {lang === "en" ? "عربي" : "English"}
          </button>

          {/* CTA BUTTON */}
          <button
            type="button"
            onClick={() => {
              setContactSubject(t.systemAccessBtn);
              setIsContactOpen(true);
            }}
            className="group relative isolate inline-flex h-10 items-center overflow-hidden border border-[#073B34] bg-[#073B34] px-4 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-400 before:absolute before:inset-0 before:-z-1 before:origin-left before:scale-x-0 before:bg-mint before:transition-transform before:duration-400 hover:text-[#073B34] hover:border-[#10B981] hover:before:scale-x-100 shadow-sm"
            data-cursor="Access"
          >
            <span className="flex items-center gap-2 font-bold">
              {t.systemAccessBtn}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15.953 15.953"
                className={`h-3 w-3 stroke-current transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
              >
                <path
                  fill="none"
                  strokeWidth="1.5"
                  d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071"
                />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 w-full">
        {/* 2. HERO SECTION */}
        <section data-page-builder-section="heroSection" className="relative border-b border-emerald-500/15 overflow-hidden bg-[#F8FAFC]">
          {/* 1. HTML5 BACKGROUND VIDEO */}
          <div className="hero-video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="opacity-100"
            >
              <source src="/turn_the_picture_to_smothe_vid.mp4" type="video/mp4" />
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </div>

          {/* 2. SUBTLE VIGNETTE GRADIENT OVERLAY */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#F8FAFC]/90"
            aria-hidden="true"
          />

          {/* 3. HERO CONTENT CONTAINER (z-10) */}
          <div className="relative z-10 w-full">
            {/* DESKTOP HERO GRID */}
            <div className="hidden lg:block">
              <div className="grid min-h-[calc(100vh-64px)] grid-rows-2">
                {/* ROW 1: CATEGORY TAG & MAIN HEADLINE */}
                <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                  <div className="flex flex-col justify-end bg-transparent backdrop-blur-none p-12 xl:p-16">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="h-2 w-2 bg-[#10B981] animate-pulse"></span>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#073B34] drop-shadow-sm">
                        {t.badge}
                      </span>
                    </div>
                    <h1 className="font-heading text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tighter text-[#0B2B26] leading-[1.12] drop-shadow-sm whitespace-pre-line">
                      {t.h1}
                    </h1>
                  </div>

                  {/* ROW 1 RIGHT: AIR-GAPPED HUD SYSTEM TELEMETRY */}
                  <div className="bg-transparent backdrop-blur-none p-12 flex flex-col justify-between text-[#0F172A]">
                    <div className="flex justify-between items-start font-mono text-xs uppercase tracking-wider text-slate-700 drop-shadow-sm">
                      <span className="text-[#073B34] font-bold">{t.hudSysCore}</span>
                      <span className="flex items-center gap-2 font-bold text-emerald-800">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        {t.hudAirGapped}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-mono text-xs border border-emerald-600/30 bg-white/40 backdrop-blur-sm p-6 shadow-sm">
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hudStandardLabel}</span>
                        <span className="font-bold text-sm text-[#0B2B26]">{t.hudStandardVal}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hudNetworkLabel}</span>
                        <span className="font-bold text-sm text-[#0B2B26]">{t.hudNetworkVal}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hudTurnaroundLabel}</span>
                        <span className="font-bold text-sm text-[#10B981] font-extrabold">{t.hudTurnaroundVal}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hudVerificationLabel}</span>
                        <span className="font-bold text-sm text-[#0B2B26]">{t.hudVerificationVal}</span>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] text-slate-700 font-medium tracking-wider drop-shadow-sm">
                      {t.hudSubtext}
                    </div>
                  </div>
                </div>

                {/* ROW 2: CARDS & ACTION BUTTONS */}
                <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                  <div className="bg-transparent flex items-center justify-center p-8">
                    <div className="w-full max-w-lg border border-emerald-600/30 bg-white/40 backdrop-blur-sm p-8 shadow-sm">
                      <p className="font-mono text-xs uppercase tracking-widest text-[#10B981] mb-2 font-bold">
                        {lang === 'ar' ? "الرسالة التشغيلية الأساسية" : "Core Mission Statement"}
                      </p>
                      <p className="text-base text-slate-800 leading-relaxed font-semibold">
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                    {/* WHITE CARD: SUB-HEADLINE & EXPLORE ARCHITECTURE */}
                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="card-hover-lift flex flex-col justify-between bg-white/45 backdrop-blur-md p-8 xl:p-10 text-[#0F172A] border border-emerald-500/30 shadow-lg hover:shadow-[0_8px_30px_rgb(16,185,129,0.18)]"
                    >
                      <p className="text-base xl:text-lg font-medium leading-relaxed text-slate-800">
                        {t.desc}
                      </p>
                      <a
                        href="#capabilities"
                        className="group relative isolate mt-8 inline-flex h-11 w-full items-center justify-between overflow-hidden border border-slate-300 bg-white/80 px-4 font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold transition-all duration-300 hover:border-[#10B981] hover:bg-[#10B981] hover:text-white"
                        data-cursor="Demo"
                      >
                        <span className="flex w-full items-center justify-between">
                          {t.ctaPrimary}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 15.953 15.953"
                            className="h-3.5 w-3.5 stroke-current transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              fill="none"
                              strokeWidth="1.5"
                              d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071"
                            />
                          </svg>
                        </span>
                      </a>
                    </motion.div>

                    {/* MINT CARD: API 653 STANDARD & MARQUEE */}
                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="card-hover-lift flex flex-col justify-between bg-white/45 backdrop-blur-md p-8 xl:p-10 text-[#073B34] overflow-hidden border border-emerald-500/30 shadow-lg hover:shadow-[0_8px_30px_rgb(16,185,129,0.18)]"
                    >
                      <div>
                        <p className="text-base xl:text-lg font-semibold leading-relaxed text-[#073B34]">
                          {lang === 'ar' 
                            ? "حسابات API 653 محددة هندسيًا بالكامل مع معالجة الرؤية الحاسوبية على الطرفية، بدون الحاجة لأي اتصال سحابي في المحطات النائية."
                            : "Deterministic API 653 calculations paired with edge vision. Zero cloud uplinks required in remote tank batteries."}
                        </p>
                        <div className="mt-6">
                          <a
                            href="#workflow"
                            className="inline-flex items-center gap-2 border border-[#073B34] bg-[#073B34] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-[#10B981] hover:border-[#10B981] transition-colors shadow-sm"
                            data-cursor="Standard"
                          >
                            <span>{t.ctaSecondary}</span>
                            <span>→</span>
                          </a>
                        </div>
                      </div>

                      {/* STANDARDS MARQUEE */}
                      <div className="relative mt-8 w-full overflow-hidden border-t border-emerald-500/20 pt-4">
                        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest text-[#073B34]">
                          {STANDARDS_MARQUEE.concat(STANDARDS_MARQUEE).map((item, idx) => (
                            <span key={idx} className="flex items-center gap-4">
                              <span>{item}</span>
                              <span className="text-emerald-600/60">•</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* LOWER HERO GRID */}
              <div className="grid">
                <div className="grid min-h-[35vh] grid-cols-2 divide-x divide-slate-200/80">
                  <div className="bg-transparent flex items-center p-12 font-mono text-sm uppercase tracking-widest text-[#073B34] font-bold drop-shadow-sm">
                    <span>{lang === 'ar' ? "مُثبّت ومُشغّل على أجهزة طرفية مخصصة ومحمية" : "DEPLOYED ON RUGGEDIZED EDGE HARDWARE"}</span>
                  </div>
                  <div className="flex items-end bg-transparent p-12 xl:p-16 border-l border-slate-200/80">
                    <p className="font-heading text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-[#0B2B26] drop-shadow-sm">
                      <RevealText>API 653</RevealText>
                    </p>
                  </div>
                </div>

                <div className="grid min-h-[40vh] grid-cols-2 divide-x divide-slate-200/80">
                  <div className="flex flex-col justify-center bg-transparent p-12 xl:p-16 text-[#0F172A]">
                    <div className="flex flex-col gap-2 uppercase">
                      <span className="font-heading text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-left text-[#0B2B26] drop-shadow-sm">
                        <RevealText>{lang === 'ar' ? "ذكاء اصطناعي" : "OFFLINE-FIRST"}</RevealText>
                      </span>
                      <span className="font-heading text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-right text-[#10B981] drop-shadow-sm">
                        <RevealText delay={0.15}>{lang === 'ar' ? "بدون سحابة." : "INTELLIGENCE."}</RevealText>
                      </span>
                    </div>
                  </div>
                  <div className="bg-transparent"></div>
                </div>
              </div>
            </div>

            {/* MOBILE HERO */}
            <div className="block lg:hidden divide-y divide-slate-200/80">
              <div className="p-6 pt-12 pb-10 bg-white/40 backdrop-blur-sm text-[#0F172A]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#10B981] animate-pulse"></span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#073B34] drop-shadow-sm">
                    {t.badge}
                  </span>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tighter text-[#0B2B26] leading-tight drop-shadow-sm whitespace-pre-line">
                  {t.h1}
                </h1>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-6 text-[#0F172A] border-y border-emerald-500/20">
                <p className="text-base leading-relaxed text-slate-800 font-medium">
                  {t.desc}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#capabilities"
                    className="flex h-11 items-center justify-between border border-[#10B981] bg-[#10B981] px-4 font-mono text-xs uppercase tracking-wider text-white font-bold shadow-sm"
                  >
                    <span>{t.ctaPrimary}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.953 15.953" className="h-3 w-3 stroke-current">
                      <path fill="none" strokeWidth="1.5" d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071" />
                    </svg>
                  </a>
                  <a
                    href="#workflow"
                    className="flex h-11 items-center justify-between border border-slate-300 bg-white/80 px-4 font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold"
                  >
                    <span>{t.ctaSecondary}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-6 text-[#073B34] border-b border-emerald-500/20">
                <p className="text-sm font-semibold leading-relaxed">
                  {lang === 'ar' 
                    ? "فحص وتدقيق مباشر في الموقع بمعزل تام عن الإنترنت وبأعلى معايير الأمان."
                    : "Air-gapped verification executed directly on site without internet connection."}
                </p>
                <div className="mt-4 overflow-hidden pt-2 border-t border-emerald-500/20">
                  <div className="animate-marquee flex items-center gap-6 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wider text-[#073B34]">
                    {STANDARDS_MARQUEE.concat(STANDARDS_MARQUEE).map((item, idx) => (
                      <span key={idx} className="flex items-center gap-3">
                        <span>{item}</span>
                        <span className="text-emerald-600/60">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. NUMERICAL STATS / METRICS STRIP (#metrics) */}
        <section id="metrics" data-page-builder-section="statsSection" className="relative border-b border-slate-200/80 bg-white scroll-mt-[64px]">
          {/* SECTION HEADER ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-slate-200/80 border-b border-slate-200/80">
            <div className="p-6 md:p-12 lg:p-16">
              <div className="flex items-center gap-3">
                <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
                <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                  {lang === 'ar' ? "02 المؤشرات الفنية" : "02 Metrics"}
                </p>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[#0B2B26] mt-4">
                {lang === 'ar' ? "معايير الأداء المحققة ميدانيًا" : "Field-Verified Benchmarks"}
              </h2>
            </div>
            <div className="p-6 md:p-12 lg:p-16 flex items-center bg-slate-50/70">
              <p className="text-lg md:text-xl text-slate-700 font-normal leading-relaxed">
                {lang === 'ar'
                  ? "تسريع موثوق لعمليات التفتيش تم قياسه في محطات التخزين البترولية النائية، مقارنةً بتأخير ��لمعاملات الورقية التقليدية مقابل التحقق الطرفي اللحظي."
                  : "Empirical inspection acceleration measured across remote storage terminals, contrasting legacy paperwork latency against real-time on-device edge verification."}
              </p>
            </div>
          </div>

          {/* 4 STATS BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
            {/* Metric 1: < 20 Min */}
            <InteractiveMetricCard
              prefix="< "
              value="20"
              suffix={lang === 'ar' ? " دقيقة" : " Min"}
              label={lang === 'ar' ? "زمن إنجاز التقرير (بدلًا من 48 ساعة)" : "Report Turnaround (from 48 Hours)"}
              delay={0}
              telemetryCode={lang === 'ar' ? "معيار 01" : "BENCHMARK 01"}
            />

            {/* Metric 2: 100% */}
            <InteractiveMetricCard
              value={t.stat1Val}
              suffix={t.stat1Val.includes("%") ? "" : "%"}
              label={t.stat1Label}
              delay={0.1}
              isAccent={true}
              telemetryCode={lang === 'ar' ? "معيار 02" : "BENCHMARK 02"}
            />

            {/* Metric 3: API 653 */}
            <InteractiveMetricCard
              value={t.stat2Val}
              label={t.stat2Label}
              delay={0.2}
              telemetryCode={lang === 'ar' ? "معيار 03" : "BENCHMARK 03"}
            />

            {/* Metric 4: Real-time / Human-in-the-Loop */}
            <InteractiveMetricCard
              value={t.stat3Val}
              label={t.stat3Label}
              delay={0.3}
              telemetryCode={lang === 'ar' ? "معيار 04" : "BENCHMARK 04"}
            />
          </div>
        </section>

        {/* 3.5 CORE CAPABILITIES FEATURE SECTION (#capabilities) */}
        <section id="capabilities" data-page-builder-section="capabilitiesSection" className="py-20 md:py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-slate-200/80 scroll-mt-[64px]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block h-2 w-2 bg-[#10B981] animate-pulse"></span>
            <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
              {lang === 'ar' ? "القدرات الفنية والتشغيلية" : "CORE SYSTEM CAPABILITIES"}
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-14 tracking-tight text-[#0B2B26] font-heading">
            {t.featureTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-emerald-500/20 bg-white/90 backdrop-blur-sm hover:border-[#10B981] hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition-all card-top-accent flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#10B981]">01 // YOLO-VISION</span>
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                </div>
                <h3 className="text-xl font-bold text-[#0B2B26] mb-3 font-heading">{t.f1Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.f1Desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-[11px] text-[#073B34] uppercase font-semibold">
                TENSORRT • LOCAL GPU INFERENCE
              </div>
            </div>

            <div className="p-8 border border-emerald-500/20 bg-white/90 backdrop-blur-sm hover:border-[#10B981] hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition-all card-top-accent flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#10B981]">02 // DETERMINISTIC</span>
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                </div>
                <h3 className="text-xl font-bold text-[#0B2B26] mb-3 font-heading">{t.f2Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.f2Desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-[11px] text-[#073B34] uppercase font-semibold">
                API 653 SEC 4.3.3 • ZERO DRIFT
              </div>
            </div>

            <div className="p-8 border border-emerald-500/20 bg-white/90 backdrop-blur-sm hover:border-[#10B981] hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition-all card-top-accent flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#10B981]">03 // DATA SOVEREIGNTY</span>
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                </div>
                <h3 className="text-xl font-bold text-[#0B2B26] mb-3 font-heading">{t.f3Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.f3Desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-[11px] text-[#073B34] uppercase font-semibold">
                ENCRYPTED SQLITE • ZERO CLOUD
              </div>
            </div>
          </div>
        </section>

        {/* 4. INSIGHTS / NUMBERED MODULES (01 - 04) (#workflow) */}
        <section id="workflow" data-page-builder-section="insightsSection" className="relative border-b border-slate-200/80 scroll-mt-[64px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            {/* STICKY LEFT COLUMN */}
            <div className="relative flex flex-col justify-between bg-[#F8FAFC] p-6 md:p-12 lg:p-16 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                    {t.workflowPre}
                  </p>
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#0B2B26] leading-none">
                  <RevealText>{lang === 'ar' ? "من الفحص" : "From Field"}</RevealText>
                  <div className={`text-[#10B981] ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                    <RevealText delay={0.1}>{lang === 'ar' ? "الميداني" : "Inspection"}</RevealText>
                  </div>
                  <RevealText delay={0.2}>{lang === 'ar' ? "إلى القرار" : "To Auditable"}</RevealText>
                  <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                    <RevealText delay={0.3}>{lang === 'ar' ? "الهندسي المعتمد" : "Decision"}</RevealText>
                  </div>
                </h2>
              </div>

              <div className="mt-12 lg:mt-auto space-y-8 max-w-md">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  {t.workflowDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubject(t.systemAccessBtn);
                    setIsContactOpen(true);
                  }}
                  className="group relative isolate inline-flex h-11 items-center justify-between overflow-hidden border border-[#073B34] bg-[#073B34] px-5 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-400 before:absolute before:inset-0 before:-z-1 before:origin-left before:scale-x-0 before:bg-mint before:transition-transform before:duration-400 hover:text-[#073B34] hover:border-[#10B981] hover:before:scale-x-100 min-w-[200px] shadow-sm"
                  data-cursor="Access"
                >
                  <span className="flex w-full items-center justify-between gap-4 font-bold">
                    {t.systemAccessBtn}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 15.953 15.953"
                      className={`h-3 w-3 stroke-current transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                    >
                      <path
                        fill="none"
                        strokeWidth="1.5"
                        d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 OPERATIONAL WORKFLOW MODULES */}
            <div className="divide-y divide-slate-200/80 bg-[#F8FAFC] text-[#0F172A]">
              {t.modules.map((area: AreaItem, idx: number) => {
                const isActive = activeWorkflowNumber === area.number;
                return (
                  <motion.div
                    key={area.number}
                    id={`workflow-stage-${area.number}`}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                    transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => {
                      setActiveWorkflowNumber(area.number);
                    }}
                    className={`workflow-glass-card group relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 lg:p-12 transition-all duration-400 cursor-pointer ${
                      isActive ? "is-active-stage bg-white/95" : "hover:bg-white/90"
                    }`}
                    data-cursor="Inspect"
                  >
                    {/* TOP ACCENT LINE WITH GLOW */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 ${
                        isActive
                          ? "bg-[#10B981] opacity-100 shadow-[0_2px_12px_rgba(16,185,129,0.6)]"
                          : "bg-[#10B981] opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {/* SUBTLE INTERNAL EMERALD AMBIENT GLOW */}
                    <div
                      className={`absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none transition-opacity duration-500 ${
                        isActive
                          ? "bg-emerald-500/10 blur-2xl opacity-100"
                          : "bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {/* LEFT SUB-COL: Number + Status Pill + Title + Dynamic Technical Visual */}
                    <div className="flex flex-col justify-between gap-6 relative z-10">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs text-[#10B981] tracking-widest font-bold">
                            {t.stageLabel} {area.number}
                          </span>
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#073B34] bg-[#A1FFCB] px-2 py-0.5 font-bold shadow-sm">
                              <span className="block h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                              {t.engagedLabel}
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-[#10B981] transition-colors">
                              {t.clickToEngage}
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight whitespace-pre-line text-[#0B2B26] group-hover:text-[#073B34] transition-colors">
                          {area.title}
                        </h3>
                      </div>

                      {/* DYNAMIC TECHNICAL ANIMATED CIRCULAR GRAPHIC */}
                      <div className="mt-2 self-center md:self-start">
                        <WorkflowVisual moduleNumber={area.number} />
                      </div>
                    </div>

                    {/* RIGHT SUB-COL: Description + Monospace Bullets + Inspection Button */}
                    <div className="flex flex-col justify-between gap-6 relative z-10">
                      <div>
                        <p className="text-base text-slate-700 leading-relaxed font-normal">
                          {area.description}
                        </p>
                        <ul className="mt-4 space-y-2.5 font-mono text-xs uppercase tracking-wider text-[#073B34]">
                          {area.bullets.map((bullet, bidx) => (
                            <li key={bidx} className="flex items-center gap-3">
                              <span
                                className={`block h-2 w-2 shrink-0 transition-transform duration-300 ${
                                  isActive
                                    ? "bg-[#10B981] scale-110 shadow-[0_0_8px_#10B981]"
                                    : "bg-[#10B981] group-hover:scale-110"
                                }`}
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* INTERACTIVE INSPECT SPECS BUTTON */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWorkflowNumber(area.number);
                            setInspectingWorkflowModule(area);
                          }}
                          className="group/btn inline-flex items-center justify-between w-full sm:w-auto gap-4 border border-slate-200 bg-white/90 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#073B34] group-hover:border-[#10B981] hover:bg-[#073B34] hover:!text-white transition-all shadow-sm"
                          data-cursor="Inspect"
                        >
                          <span className="font-bold">
                            {t.inspectBtn}
                          </span>
                          <span className={`text-[#10B981] transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`}>
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. CORE PRINCIPLE (THE FORMULA / REALITY MATRIX) (#architecture) */}
        <section id="architecture" data-page-builder-section="architectureSection" className="relative border-b border-slate-200/80 bg-white scroll-mt-[64px]">
          {/* PHILOSOPHY HEADER */}
          <div className="p-6 md:p-12 lg:p-16 border-b border-slate-200/80">
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
              <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                {lang === 'ar' ? "03 البنية التقنية ومقارنة الأداء" : COMPARISON_DATA.tag}
              </p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B2B26] max-w-5xl leading-tight">
              <RevealText>
                {lang === 'ar'
                  ? "معالجة طرفية فورية مقابل التأخيرات السحابية التقليدية"
                  : COMPARISON_DATA.headline}
              </RevealText>
            </h2>
          </div>

          {/* REALITY MATRIX: COMPARISON CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            {/* LEFT: LEGACY PROCESS */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-12 lg:p-16 bg-slate-50/70 flex flex-col justify-between min-h-[420px]"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                    {lang === 'ar' ? "الإجراءات التقليدية السابقة" : COMPARISON_DATA.legacy.tag}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 border border-red-500/40 text-red-700 bg-red-50 font-bold">
                    {lang === 'ar' ? "عالي التكلفة والبطء" : "INEFFICIENT"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mt-6">
                  {lang === 'ar' ? "فحص يعتمد على السحابة وإجراءات ورقية مجزأة" : COMPARISON_DATA.legacy.title}
                </h3>
                <ul className="mt-8 space-y-4 font-mono text-xs sm:text-sm text-slate-600">
                  {(lang === 'ar' ? [
                    "تأخير في معالجة الصور عبر السحابة يستغرق من 48 إلى 72 ساعة",
                    "انقطاع كامل في مناطق الخزانات البترولية المعزولة عن الشبكة",
                    "احتمالية عالية للأخطاء البشرية أثناء نقل قراءات السماكة يدويًا",
                    "غياب التدقيق التشفيري الفوري لسلامة التقارير الصادرة"
                  ] : COMPARISON_DATA.legacy.bullets).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="block h-2 w-2 mt-1.5 shrink-0 bg-red-400"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 font-mono text-xs text-slate-500">
                {lang === 'ar' ? "زمن الإنجاز: 48 إلى 72 ساعة • مخاطر تشغيلية متزايدة" : "TURNAROUND: 48 TO 72 HOURS • RISK EXPOSURE ELEVATED"}
              </div>
            </motion.div>

            {/* RIGHT: STARK STANDARD */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-12 lg:p-16 bg-white text-[#0F172A] flex flex-col justify-between min-h-[420px] card-top-accent border border-emerald-500/30 shadow-sm hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold">
                    {lang === 'ar' ? "معيار نظام STARK" : COMPARISON_DATA.stark.tag}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 border border-[#10B981] text-[#073B34] bg-[#A1FFCB]/30 font-bold">
                    {lang === 'ar' ? "معزول ومحمي 100%" : "AIR-GAPPED"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#0B2B26] mt-6">
                  {lang === 'ar' ? "ذكاء اصطناعي طرفي بمعايير API 653 الحتمية" : COMPARISON_DATA.stark.title}
                </h3>
                <ul className="mt-8 space-y-4 font-mono text-xs sm:text-sm text-slate-700">
                  {(lang === 'ar' ? [
                    "إنجاز تقرير الفحص المكتمل في أقل من 20 دقيقة على الجهاز مباشرة",
                    "عمليات معالجة طرفية 100% دون أي اعتمادية على اتصال الإنترنت",
                    "حسابات حتمية صارمة لمعايير API 653 بدون أي تزييف أو انحراف",
                    "توقيع تشفيري رقمي من المهندس المعتمد غير قابل للتلاعب"
                  ] : COMPARISON_DATA.stark.bullets).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="block h-2 w-2 mt-1.5 shrink-0 bg-[#10B981]"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/80 font-mono text-xs text-[#10B981] font-bold">
                {lang === 'ar' ? "زمن الإنجاز: أقل من 20 دقيقة • مطابقة تدقيق هندسي كاملة" : "TURNAROUND: < 20 MINUTES • DETERMINISTIC AUDIT COMPLIANCE"}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. VALUE & IMPACT (CLIENTS / CARDS SECTION) (#impact) */}
        <section id="impact" data-page-builder-section="clientsSection" className="relative border-b border-slate-200/80 bg-white scroll-mt-[64px]">
          {/* SECTION HEADER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 border-b border-slate-200/80">
            <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                    {t.impactTag}
                  </p>
                </div>
                <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B2B26]">
                  <RevealText>{t.impactTitle}</RevealText>
                </h2>
              </div>

              <div className="mt-8 space-y-6 max-w-md">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                  {t.impactDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubject(t.deploySolutionBtn);
                    setIsContactOpen(true);
                  }}
                  className="group relative isolate inline-flex h-11 items-center justify-between overflow-hidden border border-[#073B34] bg-[#073B34] px-5 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-400 before:absolute before:inset-0 before:-z-1 before:origin-left before:scale-x-0 before:bg-mint before:transition-transform before:duration-400 hover:text-[#073B34] hover:border-[#10B981] hover:before:scale-x-100 min-w-[200px] shadow-sm"
                  data-cursor="Connect"
                >
                  <span className="flex w-full items-center justify-between gap-4 font-bold">
                    {t.deploySolutionBtn}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 15.953 15.953"
                      className={`h-3 w-3 stroke-current transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                    >
                      <path
                        fill="none"
                        strokeWidth="1.5"
                        d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE VALUE ACTIVE SPOTLIGHT PREVIEW */}
            <motion.div
              key={activeValue.id}
              initial={{ opacity: 0.85, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col justify-between p-8 md:p-14 min-h-[380px] relative transition-colors duration-500 text-white shadow-inner"
              style={{ backgroundColor: activeValue.bgColor }}
            >
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-white/80">
                <span>0{activeValueIndex + 1} — 0{strategicValuesList.length}</span>
                <span className="font-bold text-mint">{activeValue.category}</span>
              </div>

              <div className="my-8 space-y-4">
                <span className="inline-block p-3 border border-white/20 bg-white/10 rounded-sm">
                  <StarkLogo variant="icon" inverted={true} className="h-8 w-auto" />
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {activeValue.name}
                </h3>
                <p className="text-lg text-white/95 leading-relaxed max-w-lg">
                  {activeValue.description}
                </p>
              </div>

              <div className="font-mono text-xs uppercase tracking-wider text-white/70">
                {t.valueCardSubtitle}
              </div>
            </motion.div>
          </div>

          {/* INTERACTIVE STRATEGIC VALUE SELECTOR TABS */}
          <ul aria-label="Strategic values list" className="divide-y divide-slate-200/80">
            {strategicValuesList.map((card: TranslatedValueCard | ValueCard, idx: number) => {
              const isActive = idx === activeValueIndex;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => setActiveValueIndex(idx)}
                    onMouseEnter={() => setActiveValueIndex(idx)}
                    className={`relative isolate grid h-24 w-full grid-cols-2 items-center px-6 md:px-12 transition-all duration-300 ${
                      isActive ? "bg-[#073B34] text-white border-l-4 border-l-[#10B981]" : "bg-white text-slate-800 hover:bg-slate-50 border-l-4 border-l-transparent"
                    }`}
                    data-cursor="Select"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span className={`font-mono text-xs tracking-wider ${isActive ? "text-[#10B981]" : "text-slate-400"}`}>0{idx + 1}</span>
                      <h4 className="font-heading text-xl md:text-2xl font-bold tracking-tight">
                        {card.name}
                      </h4>
                    </div>
                    <span className="text-right font-mono text-xs uppercase tracking-wider opacity-75">
                      {card.category}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 7. FOOTER / FINAL CTA BANNER */}
        <section
          data-page-builder-section="bannerSection"
          className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#073B34] via-[#084C42] to-[#052924] p-6 md:p-12 lg:p-20 border-b border-emerald-500/20 text-white"
        >
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A1FFCB] mb-6 font-bold">
              {t.bannerPre}
            </span>

            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[1.1] text-white max-w-4xl">
              <RevealText>{t.bannerH2Part1}</RevealText>
              <br />
              <span className="text-[#10B981]">
                <RevealText delay={0.15}>{t.bannerH2Part2}</RevealText>
              </span>
            </h2>

            <p className="mt-8 font-mono text-xs sm:text-sm uppercase tracking-wider text-white/80 max-w-xl">
              {t.bannerSub}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setContactSubject(t.whitepaperBtn);
                  setIsContactOpen(true);
                }}
                className="group relative isolate inline-flex h-12 items-center gap-3 overflow-hidden border border-mint bg-mint px-8 font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold transition-all duration-400 hover:bg-white hover:border-white shadow-xl"
                data-cursor="Whitepaper"
              >
                <span>{t.whitepaperBtn}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15.953 15.953"
                  className={`h-3.5 w-3.5 stroke-current transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                >
                  <path
                    fill="none"
                    strokeWidth="1.5"
                    d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  setContactSubject(t.terminalAccessBtn);
                  setIsContactOpen(true);
                }}
                className="inline-flex h-12 items-center gap-3 border border-white/40 bg-transparent px-8 font-mono text-xs uppercase tracking-wider text-white hover:border-mint hover:text-mint transition-colors"
                data-cursor="Terminal"
              >
                <span>{t.terminalAccessBtn}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 bg-white px-6 py-8 md:px-12 font-mono text-xs uppercase tracking-wider text-slate-600">
        <div className="flex items-center gap-4">
          <StarkLogo variant="full" className="h-8 sm:h-9 w-auto" />
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>{t.footerCopyright}</span>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-4 font-bold text-[#073B34]">
          <span className="inline-flex items-center gap-1.5 bg-[#073B34]/5 border border-[#073B34]/15 px-2.5 py-1 text-[#073B34] text-[11px] font-mono tracking-wider">
            TEAM STARK-YIC // ENERGY HACKATHON 2026
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>{t.footerLocation}</span>
        </div>
      </footer>

      {/* INTERACTIVE INQUIRY MODAL WITH FRAMER MOTION POPUP */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg border border-emerald-500/30 bg-white p-6 md:p-10 shadow-2xl card-top-accent"
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setIsContactOpen(false);
                  setContactSubmitted(false);
                }}
                className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#073B34] hover:text-white transition-colors`}
                data-cursor="Close"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <StarkLogo variant="icon" className="h-6 w-auto" />
                <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                  ENERGY HACKATHON 2026 • STARK EDGE OS
                </p>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2B26]">
                {contactSubject}
              </h3>

              {contactSubmitted ? (
                <div className="mt-6 border border-emerald-300 bg-emerald-50/80 p-6 text-[#073B34]">
                  <div className="flex items-center gap-3 mb-3">
                    <StarkLogo variant="full" className="h-7 w-auto" />
                  </div>
                  <p className="font-heading text-lg font-bold text-[#073B34]">
                    {lang === 'ar' ? "تم إرسال طلب الوصول للطرفية بنجاح" : "Terminal Access Request Dispatched"}
                  </p>
                  <p className="mt-2 text-sm text-emerald-900">
                    {lang === 'ar'
                      ? "تم توجيه بيانات الاعتماد وحزمة التحقق الخاصة بمعايير API 653 إلى فريق STARK-YIC. سيتم إرسال حزمة التثبيت المستقلة قريبًا."
                      : "Your credentials and API 653 verification package have been routed to Team STARK-YIC. Standalone installer package will be dispatched shortly."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsContactOpen(false);
                      setContactSubmitted(false);
                    }}
                    className="mt-4 border border-[#073B34] bg-[#073B34] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#10B981] transition-colors"
                  >
                    {lang === 'ar' ? "إغلاق النافذة" : "Close Terminal"}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="mt-6 space-y-4 font-mono text-xs"
                >
                  <div>
                    <label className="block uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                      {lang === 'ar' ? "اسم المهندس / مفتش الفحص المعتمد" : "Certified Engineer / Inspector Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ar' ? "مثال: طارق المنصور" : "e.g. Tariq Al-Mansoor"}
                      className="w-full border border-slate-300 p-3 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                      {lang === 'ar' ? "المنشأة / موقع المحطة" : "Facility / Terminal Location"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ar' ? "مثال: محطة ينبع للصهاريج #4" : "e.g. Yanbu Terminal #4"}
                      className="w-full border border-slate-300 p-3 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                      {lang === 'ar' ? "البريد الإلكتروني المهني" : "Organization Email"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="inspector@energy.gov.sa"
                      className="w-full border border-slate-300 p-3 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                      {lang === 'ar' ? "نطاق الفحص / الاعتماد المهني" : "Inspection Scope / Certification"}
                    </label>
                    <select
                      className="w-full border border-slate-300 p-3 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none bg-white"
                    >
                      <option>{lang === 'ar' ? "مفتش معتمد وفق معايير API 653" : "API 653 Certified Inspector"}</option>
                      <option>{lang === 'ar' ? "مهندس اختبارات غير إتلافية ASNT NDT المستوى 3" : "ASNT NDT Level III Engineer"}</option>
                      <option>{lang === 'ar' ? "مدير سلامة الأصول والمعدات" : "Asset Integrity Manager"}</option>
                      <option>{lang === 'ar' ? "مراجع تدقيق فني من وزارة الطاقة" : "Ministry of Energy Auditor"}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full border border-[#073B34] bg-[#073B34] p-3 text-center uppercase tracking-wider text-white hover:bg-[#10B981] hover:border-[#10B981] font-bold transition-colors shadow-sm"
                  >
                    {lang === 'ar' ? "طلب تصريح الوصول للنظام" : "Request System Access Key"}
                  </button>


                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORKFLOW STAGE DETAIL INSPECTOR MODAL WITH BUTTERY-SMOOTH ANIMATION */}
      <AnimatePresence>
        {inspectingWorkflowModule && (
          <WorkflowDetailModal
            module={inspectingWorkflowModule}
            onClose={() => setInspectingWorkflowModule(null)}
            onSelectModule={(mod) => {
              setInspectingWorkflowModule(mod);
              setActiveWorkflowNumber(mod.number);
            }}
            allModules={t.modules}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
