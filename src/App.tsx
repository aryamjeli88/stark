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
} from "./data";
import { content, Language, TranslatedValueCard } from "./translations";
import { StarkLogo } from "./components/StarkLogo";
import CustomCursor from "./components/CustomCursor";
import InteractiveMetricCard from "./components/InteractiveMetricCard";
import WorkflowVisual from "./components/WorkflowVisual";
import WorkflowDetailModal from "./components/WorkflowDetailModal";
import heroVideoSrc from "./assets/hero_video.mp4";

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

export default function App() {
  const [lang, setLang] = useState<Language>("ar");
  const t = (content && content[lang]) ? content[lang] : (content && content["ar"]) ? content["ar"] : {} as any;

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay restricted:", err);
      });
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = lang === "en" ? "ar" : "en";
    setLang(nextLang);
    const nextDir = nextLang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = nextDir;
    document.documentElement.lang = nextLang;
    document.body.dir = nextDir;
  };

  useEffect(() => {
    const currentDir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = currentDir;
    document.documentElement.lang = lang;
    document.body.dir = currentDir;
  }, [lang]);

  useEffect(() => {
    try {
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
    } catch (e) {
      console.warn("Lenis initialization skipped:", e);
    }
  }, []);

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

  const navLinksList = (t.nav && t.nav.navLinks) 
    ? [
        { href: "#workflow", label: t.nav.navLinks.workflow },
        { href: "#metrics", label: t.nav.navLinks.metrics },
        { href: "#standards", label: t.nav.navLinks.standards },
        { href: "#value", label: t.nav.navLinks.value }
      ]
    : NAV_LINKS;

  return (
    <div
      className={`relative min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#A1FFCB] selection:text-[#073B34] overflow-x-hidden ${
        lang === "ar" ? "font-['Tajawal',sans-serif]" : "font-sans"
      }`}
    >
      <CustomCursor />

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] flex h-screen items-center justify-center opacity-30 transition-transform duration-700 ease-out"
        style={{ perspective: "1000px" }}
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
            <span>{t.nav?.systemBadge || "STARK SYSTEM"}</span>
          </span>
        </div>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex font-mono text-xs uppercase tracking-wider text-[#073B34]">
          {navLinksList.map((link: any) => (
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs font-mono font-medium text-slate-500 hover:text-[#073B34] transition-colors cursor-pointer tracking-wider uppercase"
            data-cursor="Language"
          >
            {t.nav?.langToggle || (lang === "en" ? "عربي" : "ENGLISH")}
          </button>

          <button
            type="button"
            onClick={() => {
              setContactSubject(t.nav?.requestDemo || "Request Access");
              setIsContactOpen(true);
            }}
            className="group relative isolate inline-flex h-10 items-center overflow-hidden border border-[#073B34] bg-[#073B34] px-4 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-400 before:absolute before:inset-0 before:-z-1 before:origin-left before:scale-x-0 before:bg-mint before:transition-transform before:duration-400 hover:text-[#073B34] hover:border-[#10B981] hover:before:scale-x-100 shadow-sm"
            data-cursor="Access"
          >
            <span className="flex items-center gap-2 font-bold">
              {t.nav?.requestDemo || "Request Access"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15.953 15.953"
                className={`w-4 h-4 shrink-0 stroke-current transition-transform duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
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

      <main className="relative z-10 w-full">
        <section data-page-builder-section="heroSection" className="relative border-b border-emerald-500/15 overflow-hidden bg-[#F8FAFC]">
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

          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#F8FAFC]/90" />

          <div className="relative z-10 w-full">
            <div className="hidden lg:block">
              <div className="grid min-h-[calc(100vh-64px)] grid-rows-2">
                <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                  <div className="flex flex-col justify-end bg-transparent backdrop-blur-none p-12 xl:p-16">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="h-2 w-2 bg-[#10B981] animate-pulse"></span>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#073B34] drop-shadow-sm">
                        {t.hero?.badge || "FIELD-READY SYSTEM"}
                      </span>
                    </div>
                    <h1 className="font-heading text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tighter text-[#0B2B26] leading-[1.12] drop-shadow-sm whitespace-pre-line">
                      {t.hero?.titleLine1} {t.hero?.titleLine2}
                    </h1>
                  </div>

                  <div className="bg-transparent backdrop-blur-none p-12 flex flex-col justify-between text-[#0F172A]">
                    <div className="flex justify-between items-start font-mono text-xs uppercase tracking-wider text-slate-700 drop-shadow-sm">
                      <span className="text-[#073B34] font-bold">{t.nav?.systemBadge || "STARK SYSTEM"}</span>
                      <span className="flex items-center gap-2 font-bold text-emerald-800">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        {t.nav?.offlineMode || "API 653 COMPLIANT • OFFLINE-FIRST AI"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 font-mono text-xs border border-emerald-600/30 bg-white/40 backdrop-blur-sm p-6 shadow-sm">
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hero?.stats?.stat1Label || "Calculation Engine"}</span>
                        <span className="font-bold text-sm text-[#0B2B26]">{t.hero?.stats?.stat1Value || "API 653 Standards"}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">{t.hero?.stats?.stat2Label || "Report Turnaround"}</span>
                        <span className="font-bold text-sm text-[#10B981] font-extrabold">{t.hero?.stats?.stat2Value || "< 20 Mins"}</span>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] text-slate-700 font-medium tracking-wider drop-shadow-sm">
                      {t.hero?.version || "System Version V2.6.4"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                  <div className="bg-transparent flex items-center justify-center p-8">
                    <div className="w-full max-w-lg border border-emerald-600/30 bg-white/40 backdrop-blur-sm p-8 shadow-sm">
                      <p className="font-mono text-xs uppercase tracking-widest text-[#10B981] mb-2 font-bold">
                        {t.mission?.tag || "CORE MISSION STATEMENT"}
                      </p>
                      <p className="text-base text-slate-800 leading-relaxed font-semibold">
                        {t.mission?.text || t.hero?.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-slate-200/80">
                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="card-hover-lift flex flex-col justify-between bg-white/45 backdrop-blur-md p-8 xl:p-10 text-[#0F172A] border border-emerald-500/30 shadow-lg hover:shadow-[0_8px_30px_rgb(16,185,129,0.18)]"
                    >
                      <p className="text-base xl:text-lg font-medium leading-relaxed text-slate-800">
                        {t.hero?.description}
                      </p>
                      <a
                        href="#workflow"
                        className="group relative isolate mt-8 inline-flex h-11 w-full items-center justify-between overflow-hidden border border-slate-300 bg-white/80 px-4 font-mono text-xs uppercase tracking-wider text-[#073B34] font-bold transition-all duration-300 hover:border-[#10B981] hover:bg-[#10B981] hover:text-white"
                        data-cursor="Demo"
                      >
                        <span className="flex w-full items-center justify-between">
                          {t.hero?.primaryCta || "Explore Live Field Demo"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 15.953 15.953"
                            className="w-4 h-4 shrink-0 stroke-current transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path fill="none" strokeWidth="1.5" d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071" />
                          </svg>
                        </span>
                      </a>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="card-hover-lift flex flex-col justify-between bg-white/45 backdrop-blur-md p-8 xl:p-10 text-[#073B34] overflow-hidden border border-emerald-500/30 shadow-lg hover:shadow-[0_8px_30px_rgb(16,185,129,0.18)]"
                    >
                      <div>
                        <p className="text-base xl:text-lg font-semibold leading-relaxed text-[#073B34]">
                          {t.featureCards?.card1Title}: {t.featureCards?.card1Desc}
                        </p>
                        <div className="mt-6">
                          <a
                            href="#workflow"
                            className="inline-flex items-center gap-2 border border-[#073B34] bg-[#073B34] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-[#10B981] hover:border-[#10B981] transition-colors shadow-sm"
                            data-cursor="Standard"
                          >
                            <span>{t.hero?.secondaryCta || "Technical Architecture"}</span>
                            <span>→</span>
                          </a>
                        </div>
                      </div>

                      <div className="relative mt-8 w-full overflow-hidden border-t border-emerald-500/20 pt-4">
                        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest text-[#073B34]">
                          {(STANDARDS_MARQUEE || []).concat(STANDARDS_MARQUEE || []).map((item, idx) => (
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

              <div className="grid">
                <div className="grid min-h-[35vh] grid-cols-2 divide-x divide-slate-200/80">
                  <div className="bg-transparent flex items-center p-12 font-mono text-sm uppercase tracking-widest text-[#073B34] font-bold drop-shadow-sm">
                    <span>{lang === 'ar' ? "مثبت ومشغل على أجهزة طرفية مخصصة ومحمية" : "DEPLOYED ON RUGGEDIZED EDGE HARDWARE"}</span>
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
                        <RevealText delay={0.15}>{lang === 'ar' ? "بدون سحابة" : "INTELLIGENCE"}</RevealText>
                      </span>
                    </div>
                  </div>
                  <div className="bg-transparent"></div>
                </div>
              </div>
            </div>

            <div className="block lg:hidden divide-y divide-slate-200/80">
              <div className="p-6 pt-12 pb-10 bg-white/40 backdrop-blur-sm text-[#0F172A]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#10B981] animate-pulse"></span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#073B34] drop-shadow-sm">
                    {t.hero?.badge || "FIELD-READY SYSTEM"}
                  </span>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tighter text-[#0B2B26] leading-tight drop-shadow-sm whitespace-pre-line">
                  {t.hero?.titleLine1} {t.hero?.titleLine2}
                </h1>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-6 text-[#0F172A] border-y border-emerald-500/20">
                <p className="text-base leading-relaxed text-slate-800 font-medium">
                  {t.hero?.description}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#workflow"
                    className="flex h-11 items-center justify-between border border-[#10B981] bg-[#10B981] px-4 font-mono text-xs uppercase tracking-wider text-white font-bold shadow-sm"
                  >
                    <span>{t.hero?.primaryCta || "Explore Live Field Demo"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 15.953 15.953"
                      className="w-4 h-4 shrink-0 stroke-current"
                    >
                      <path fill="none" strokeWidth="1.5" d="M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metrics" data-page-builder-section="statsSection" className="relative border-b border-slate-200/80 bg-white scroll-mt-[64px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-slate-200/80 border-b border-slate-200/80">
            <div className="p-6 md:p-12 lg:p-16">
              <div className="flex items-center gap-3">
                <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
                <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                  {t.nav?.navLinks?.metrics || "02 Metrics"}
                </p>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[#0B2B26] mt-4">
                {lang === 'ar' ? "معايير الأداء المحققة ميدانيًّا" : "Field-Verified Benchmarks"}
              </h2>
            </div>
            <div className="p-6 md:p-12 lg:p-16 flex items-center bg-slate-50/70">
              <p className="text-lg md:text-xl text-slate-700 font-normal leading-relaxed">
                {t.hero?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
            <InteractiveMetricCard
              prefix="< "
              value="20"
              suffix={lang === 'ar' ? " دقيقة" : " Min"}
              label={t.hero?.stats?.stat2Label || "Report Turnaround"}
              delay={0}
              telemetryCode={lang === 'ar' ? "معيار 01" : "BENCHMARK 01"}
            />

            <InteractiveMetricCard
              value={t.hero?.stats?.stat1Value || "API 653"}
              label={t.hero?.stats?.stat1Label || "Calculation Engine"}
              delay={0.1}
              isAccent={true}
              telemetryCode={lang === 'ar' ? "معيار 02" : "BENCHMARK 02"}
            />
          </div>
        </section>

        <section id="workflow" data-page-builder-section="insightsSection" className="relative border-b border-slate-200/80 scroll-mt-[64px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            <div className="relative flex flex-col justify-between bg-[#F8FAFC] p-6 md:p-12 lg:p-16 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="block h-2 w-2 shrink-0 bg-[#10B981]"></span>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#073B34] font-bold">
                    {t.nav?.navLinks?.workflow || "01 Workflow"}
                  </p>
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#0B2B26] leading-none">
                  <RevealText>{lang === 'ar' ? "من الفحص الميداني" : "From Field Inspection"}</RevealText>
                  <div className={`text-[#10B981] ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                    <RevealText delay={0.1}>{lang === 'ar' ? "إلى القرار الهندسي" : "To Engineering Decision"}</RevealText>
                  </div>
                </h2>
              </div>
            </div>

            <div className="divide-y divide-slate-200/80 bg-[#F8FAFC] text-[#0F172A]">
              {(WORKFLOW_AREAS || []).map((area: AreaItem, idx: number) => {
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
                    onClick={() => setActiveWorkflowNumber(area.number)}
                    className={`workflow-glass-card group relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 lg:p-12 transition-all duration-400 cursor-pointer ${
                      isActive ? "is-active-stage bg-white/95" : "hover:bg-white/90"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-6 relative z-10">
                      <div>
                        <span className="font-mono text-xs text-[#10B981] tracking-widest font-bold">
                          {lang === 'ar' ? `المرحلة ${area.number}` : `STAGE ${area.number}`}
                        </span>
                        <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#0B2B26] mt-2">
                          {area.title}
                        </h3>
                      </div>
                      <WorkflowVisual moduleNumber={area.number} />
                    </div>

                    <div className="flex flex-col justify-between gap-6 relative z-10">
                      <p className="text-base text-slate-700 leading-relaxed font-normal">
                        {area.description}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveWorkflowNumber(area.number);
                          setInspectingWorkflowModule(area);
                        }}
                        className="group/btn inline-flex items-center justify-between w-full sm:w-auto gap-4 border border-slate-200 bg-white/90 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#073B34] hover:bg-[#073B34] hover:text-white transition-all shadow-sm font-bold"
                      >
                        <span>{lang === 'ar' ? "معاينة التفاصيل الهندسية" : "INSPECT SPECIFICATIONS"}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

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
              className="relative w-full max-w-lg border border-emerald-500/30 bg-white p-6 md:p-10 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#073B34] hover:text-white`}
              >
                ✕
              </button>
              <h3 className="font-heading text-2xl font-bold text-[#0B2B26]">
                {t.nav?.requestDemo || "Request Access"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="mt-6 space-y-4 font-mono text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? "اسم المهندس / المفتش" : "Certified Engineer Name"}
                  className="w-full border border-slate-300 p-3 text-sm"
                />
                <button
                  type="submit"
                  className="w-full border border-[#073B34] bg-[#073B34] p-3 text-center uppercase text-white font-bold"
                >
                  {lang === 'ar' ? "إرسال الطلب" : "Submit Request"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inspectingWorkflowModule && (
          <WorkflowDetailModal
            module={inspectingWorkflowModule}
            onClose={() => setInspectingWorkflowModule(null)}
            onSelectModule={(mod) => {
              setInspectingWorkflowModule(mod);
              setActiveWorkflowNumber(mod.number);
            }}
            allModules={WORKFLOW_AREAS}
          />
        )}
      </AnimatePresence>
    </div>
  );
}