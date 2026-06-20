"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type FeaturedProject = {
  id: string | number;
  title: string;
  summary?: string;
  coverImageUrl: string;
  href?: string;
};

export type FeaturedProjectsCarouselProps = {
  title?: string;
  blurb?: string;
  cta_button?: { label: string; url: string };
  projects?: FeaturedProject[];
  linkLabel?: string;
  linkUrl?: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = (x: number) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
});



export default function FeaturedProjectsCarousel({
  title = "Featured Projects",
  blurb,
  cta_button,
  projects = [],
  linkLabel,
  linkUrl,
}: FeaturedProjectsCarouselProps) {
  const scroller = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const [maxScroll, setMaxScroll] = React.useState(1);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const [trackW, setTrackW] = React.useState(1);
  const [thumbW, setThumbW] = React.useState(48);

  const measure = React.useCallback(() => {
    const el = scroller.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const max = Math.max(1, el.scrollWidth - el.clientWidth);
    setMaxScroll(max);
    setScrollLeft(Math.min(el.scrollLeft, max));

    const tw = track.clientWidth;
    setTrackW(tw);

    const ratio = el.clientWidth / Math.max(1, el.scrollWidth);
    const minThumb = 36;
    setThumbW(Math.max(minThumb, Math.round(tw * ratio)));
  }, []);

  React.useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, projects.length]);

  const raf = React.useRef<number>(0);
  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = scroller.current;
      if (!el) return;
      setScrollLeft(el.scrollLeft);
    });
  };

  const scrollPct = React.useMemo(
    () => (maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0),
    [scrollLeft, maxScroll]
  );

  const innerThumbW = Math.max(24, Math.round(thumbW * 0.4));
  const innerThumbLeftPx = Math.round((thumbW - innerThumbW) * scrollPct);

  const setScrollByTrackPx = (px: number) => {
    const el = scroller.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const usable = Math.max(1, track.clientWidth - thumbW);
    const pct = Math.min(1, Math.max(0, px / usable));
    const nextLeft = pct * maxScroll;

    el.scrollTo({ left: nextLeft, behavior: "smooth" });
  };

  const onThumbDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    window.addEventListener("mousemove", onThumbMove);
    window.addEventListener("mouseup", onThumbUp);
    e.preventDefault();
  };

  const onThumbMove = (e: MouseEvent) => {
    const el = scroller.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const rect = track.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    setScrollByTrackPx(dx - thumbW / 2);
  };

  const onThumbUp = () => {
    window.removeEventListener("mousemove", onThumbMove);
    window.removeEventListener("mouseup", onThumbUp);
  };

  const onTrackClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current!;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setScrollByTrackPx(x - thumbW / 2);
  };

  const thumbLeftPx = () => {
    const usable = Math.max(1, trackW - thumbW);
    const pct = Math.min(1, Math.max(0, scrollLeft / maxScroll));
    return usable * pct;
  };

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const cta = React.useMemo(() => {
    const rawUrl =
      (typeof cta_button?.url === "string"
        ? cta_button?.url
        : typeof (cta_button as any)?.href === "string"
        ? (cta_button as any)?.href
        : typeof (cta_button as any)?.link === "string"
        ? (cta_button as any)?.link
        : typeof (cta_button as any)?.url?.url === "string"
        ? (cta_button as any)?.url?.url
        : linkUrl) ?? "";

    const rawLabel = cta_button?.label ?? linkLabel ?? "Explore All Projects";

    const url = (rawUrl || "").trim();
    const label = (rawLabel || "").trim();

    return label ? { url: url || "#", label } : undefined;
  }, [cta_button, linkUrl, linkLabel]);

  return (
    <section className="bg-[rgb(24,24,27)] w-full py-20">
        <div className="w-full px-6 md:px-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div
            className="w-full md:w-7/12 space-y-6 md:pr-12"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold leading-snug text-[rgb(243,244,246)]"
              variants={item(-100)}
            >
              {title}
            </motion.h2>

            {blurb && (
              <motion.div
                className="prose prose-lg text-[rgb(161,161,170)]"
                variants={item(-100)}
              >
                <p>{blurb}</p>
              </motion.div>
            )}

            {cta && (
              <motion.div variants={item(-100)}>
                <Link
                  href={cta.url}
                  className="inline-block bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-[rgb(243,244,246)] font-medium px-6 py-3 rounded transition"
                >
                  {cta.label}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Carousel */}
          <motion.div
            className="w-full md:w-5/12"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div
              ref={scroller}
              onScroll={onScroll}
              role="region"
              aria-label="Featured projects"
              className="scrollbar-hide overflow-x-auto overflow-y-hidden pb-4"
            >
              {/* Stagger children inside the scroller */}
              <motion.div
                className="flex gap-6 py-2 items-stretch"
                style={{ minWidth: "max-content" }}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {projects.map((p) => (
                  <motion.article
                    key={p.id}
                    className="flex-none w-80"
                    variants={item(60)}
                  >
                    <a
                      href={p.href || "#"}
                      className="flex flex-col rounded-xl overflow-hidden border border-[rgb(63,63,70)] bg-[rgb(39,39,42)] shadow-sm hover:shadow-md transition-all duration-300 w-80 min-h-[23rem]"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[rgb(63,63,70)]">
                        <img
                          src={p.coverImageUrl}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-4 pt-4 pb-1 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-[rgb(243,244,246)] line-clamp-2">
                            {p.title}
                          </h3>
                          <p className="mt-2 text-sm text-[rgb(161,161,170)] line-clamp-2">
                            {p.summary ?? ""}
                          </p>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                ))}
              </motion.div>
            </div>

            {/* Scrollbar */}
            {projects.length > 0 && maxScroll > 0 && (
              <div className="mt-6 flex justify-center">
                <div
                  ref={trackRef}
                  onClick={onTrackClick}
                  className="relative h-2 rounded-full bg-[rgb(63,63,70)] cursor-pointer mx-auto"
                  style={{ width: "min(100%, 400px)" }}
                >
                  <div
                    onMouseDown={onThumbDown}
                    className="absolute top-0 h-2 rounded-full bg-transparent cursor-grab"
                    style={{
                      width: `${thumbW}px`,
                      left: `${thumbLeftPx()}px`,
                      minWidth: "36px",
                      position: "absolute",
                    }}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={maxScroll}
                    aria-valuenow={Math.round(scrollLeft)}
                  >
                    <div
                      className="h-full rounded-full shadow-sm transition-all duration-150 bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)]"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${innerThumbLeftPx}px`,
                        width: `${innerThumbW}px`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}