"use client";

import { Page } from "@/payload-types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules"; 
import { useEffect, useRef, useState } from "react";


type ContentProps = Extract<Page["layout"][0], { blockType: "interactive" }>;

function BeforeAfterSlider({
  before,
  after,
  altBefore = "Before",
  altAfter = "After",
}: {
  before: string;
  after: string;
  altBefore?: string;
  altAfter?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setPos((x / rect.width) * 100);
    };

    let dragging = false;

    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      update(clientX);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      update(clientX);
    };
    const onUp = () => {
      dragging = false;
    };

    el.addEventListener("mousedown", onDown as any);
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);

    el.addEventListener("touchstart", onDown as any, { passive: true });
    window.addEventListener("touchmove", onMove as any, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown as any);
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);

      el.removeEventListener("touchstart", onDown as any);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow"
      style={{ aspectRatio: "16 / 9" }}
      aria-label="Before and after image comparison"
      role="region"
    >
      {/* BEFORE */}
      <img
        src={before}
        alt={altBefore}
        className="absolute inset-0 h-full w-full object-cover select-none"
        draggable={false}
      />

      {/* AFTER */}
      <img
        src={after}
        alt={altAfter}
        className="absolute inset-0 h-full w-full object-cover select-none"
        draggable={false}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <button
        aria-label="Drag to compare before and after"
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center h-18 w-18 rounded-full bg-white shadow-md border border-black/10 cursor-ew-resize"
        style={{ left: `calc(${pos}% - 36px)` }}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <span className="pointer-events-none flex items-center gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-7 w-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-7 w-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default function InteractiveBlock({ block }: { block: ContentProps }) {
  const swiperRef = useRef<any>(null);

  const EDGE_SPEED = 350;

  const handleNext = () => {
    const s = swiperRef.current;
    if (!s) return;
    if (s.isEnd) {
      s.slideTo(0, EDGE_SPEED);
    } else {
      s.slideNext();
    }
  };

  const handlePrev = () => {
    const s = swiperRef.current;
    if (!s) return;
    if (s.isBeginning) {
      const lastIndex = s.slides.length - 1;
      s.slideTo(lastIndex, EDGE_SPEED);
    } else {
      s.slidePrev();
    }
  };

  if (!block.pairs || block.pairs.length === 0) {
    return (
      <section className="p-6 text-sm text-red-600">
        InteractiveBlock: no before/after pairs found. Add some in Payload CMS.
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center p-8 bg-[rgba(27,27,29,1)]">
      <div className="relative max-w-5xl w-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          spaceBetween={40}
          slidesPerView={1}
          allowTouchMove={false}
          rewind
          speed={700}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full"
        >
          {block.pairs.map((pair, idx) => {
            const before =
              typeof pair.beforeImage === "object" && pair.beforeImage?.url
                ? pair.beforeImage.url
                : "";
            const after =
              typeof pair.afterImage === "object" && pair.afterImage?.url
                ? pair.afterImage.url
                : "";

            if (!before || !after) return null;

            return (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center gap-4">
                  <BeforeAfterSlider
                    before={before}
                    after={after}
                    altBefore={
                      typeof pair.beforeImage === "object" && pair.beforeImage?.alt
                        ? pair.beforeImage.alt
                        : "Before"
                    }
                    altAfter={
                      typeof pair.afterImage === "object" && pair.afterImage?.alt
                        ? pair.afterImage.alt
                        : "After"
                    }
                  />
                  {pair.caption && (
                    <p className="text-sm text-gray-400 text-center">
                      {pair.caption}
                    </p>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          type="button"
          onClick={handlePrev}
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 z-10 
                     flex items-center justify-center h-12 w-12 rounded-full 
                     bg-[rgb(190,18,60)] shadow-md border border-black/10 
                     hover:bg-[rgba(227,26,76,1)]"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               className="h-7 w-7 text-[rgb(243,244,246)]" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10 
                     flex items-center justify-center h-12 w-12 rounded-full 
                     bg-[rgb(190,18,60)] shadow-md border border-black/10 
                     hover:bg-[rgba(227,26,76,1)]"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               className="h-7 w-7 text-[rgb(243,244,246)]" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}