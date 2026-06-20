"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";


export type SliderImage = { image: { url: string }; alt?: string };

type Props = {
  images: SliderImage[];
  speedPxPerSec?: number;
  visibleCount?: number; 
  gapPx?: number;
  heightPx?: number;
  className?: string;
};

export default function FilmstripCarousel({
  images,
  speedPxPerSec = 120, 
  visibleCount = 2,
  gapPx = 24,
  heightPx = 160,
  className = "",
}: Props) {
  const slides = [...images, ...images];

  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const originalWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateOriginalWidth = () => {
      originalWidthRef.current = track.scrollWidth / 2 || 1;
    };

    updateOriginalWidth();
    const ro = new ResizeObserver(updateOriginalWidth);
    ro.observe(track);

    const step = (time: number) => {
      if (prevRef.current === null) prevRef.current = time;
      const dt = time - prevRef.current;
      prevRef.current = time;

      const move = (speedPxPerSec * dt) / 1000;
      posRef.current += move;

      if (posRef.current >= originalWidthRef.current) {
        posRef.current -= originalWidthRef.current;
      }

      if (track) {
        track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      prevRef.current = null;
    };
  }, [speedPxPerSec]);

  return (
    <div className={`w-full ${className}`} style={{ maxWidth: "100%" }}>
      <style>{`
        .filmstrip-wrapper { overflow: hidden; position: relative; }
        .filmstrip-track {
          display: flex;
          gap: ${gapPx}px;
          align-items: center;
          flex-wrap: nowrap;
          will-change: transform;
          transform: translate3d(0,0,0);
          pointer-events: none; /* prevents track from being interactable */
        }
        .filmstrip-item {
          /* use visibleCount to size items so exactly visibleCount items fit */
          flex: 0 0 calc(${100 / visibleCount}% - ${gapPx / visibleCount}px);
          box-sizing: border-box;
          pointer-events: auto; /* allow interaction inside cards */
        }
        .filmstrip-card {
          height: ${heightPx}px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          overflow: hidden;
          background: #e5e7eb;
          box-shadow: 0 6px 18px rgba(15,23,42,0.08);
        }
        .filmstrip-wrapper {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .filmstrip-track { will-change: auto; transition: none !important; }
        }
      `}</style>

      <div className="filmstrip-wrapper">
        <div className="filmstrip-track" ref={trackRef} role="list" aria-hidden="false">
          {slides.map((s, idx) => {
            const ariaHidden = idx >= images.length ? "true" : "false";
            const url = s.image?.url || "";
            return (
              <div role="listitem" aria-hidden={ariaHidden} className="filmstrip-item" key={`${idx}-${url}`}>
                <div className="filmstrip-card">
                  {url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={url}
                        alt={s.alt || ""}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 33vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div style={{ padding: 12 }}>{s.alt ?? `Item ${idx + 1}`}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
