"use client";
import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-animate]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.staggerDelay || "0", 10) * 100;
          setTimeout(() => el.classList.add("is-visible"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => {
      // Never observe inside the marquee ribbon — is-visible would override translateX
      if (el.closest("[class*='ribbon']") || el.closest("[class*='marquee']") || el.closest("[class*='trusted']")) return;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}
