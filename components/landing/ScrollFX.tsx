/**
 * ScrollFX — one-shot ScrollTrigger reveals for [data-reveal] elements.
 *
 * Kept as a single tiny client island: everything else on the landing page
 * stays server-rendered. Disabled entirely for prefers-reduced-motion.
 */
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollFX() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (reduced || targets.length === 0) {
      targets.forEach((t) => (t.style.opacity = "1"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
