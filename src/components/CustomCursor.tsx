import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for fine pointer devices (desktop)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let targetRingX = -100;
    let targetRingY = -100;
    let animationFrameId: number;

    const lerpFactor = 0.16;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, .card-hover-lift, [data-cursor], .interactive-hover'
        );

        if (interactive) {
          setIsHovered(true);
          const dataText = interactive.getAttribute("data-cursor");
          setCursorText(dataText || "");

          // Magnetic snap toward element center
          const rect = interactive.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          targetRingX = centerX + (mouseX - centerX) * 0.25;
          targetRingY = centerY + (mouseY - centerY) * 0.25;
        } else {
          setIsHovered(false);
          setCursorText("");
          targetRingX = mouseX;
          targetRingY = mouseY;
        }
      } else {
        targetRingX = mouseX;
        targetRingY = mouseY;
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const renderLoop = () => {
      // Smooth physics lerp
      ringX += (targetRingX - ringX) * lerpFactor;
      ringY += (targetRingY - ringY) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-[999999] overflow-hidden"
    >
      {/* 1. Crisp Center Dot */}
      <div
        ref={dotRef}
        className="cursor-dot fixed pointer-events-none top-0 left-0 w-[6px] h-[6px] bg-[#10B981] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          boxShadow: "0 0 10px #10B981, 0 0 4px #A1FFCB",
          borderRadius: "9999px"
        }}
      />

      {/* 2. Luxury Trailing Outer Ring with STARK Emerald Glow */}
      <div
        ref={ringRef}
        className={`cursor-ring fixed pointer-events-none top-0 left-0 flex items-center justify-center transition-[width,height,background-color,border-color,box-shadow,opacity] duration-300 ease-out ${
          isHovered ? "is-hovered" : ""
        }`}
        style={{
          opacity: isVisible ? 1 : 0,
          width: isHovered ? (cursorText ? "76px" : "56px") : "36px",
          height: isHovered ? (cursorText ? "76px" : "56px") : "36px",
          borderRadius: "9999px",
          borderColor: "#10B981",
          borderWidth: "1.5px",
          borderStyle: "solid",
          backgroundColor: isHovered ? "rgba(161, 255, 203, 0.22)" : "rgba(161, 255, 203, 0.04)",
          boxShadow: isHovered
            ? "0 0 28px rgba(16, 185, 129, 0.55), inset 0 0 12px rgba(161, 255, 203, 0.3)"
            : "0 0 16px rgba(16, 185, 129, 0.4), inset 0 0 8px rgba(161, 255, 203, 0.15)"
        }}
      >
        {cursorText && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#073B34] select-none text-center px-1 drop-shadow-sm">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
