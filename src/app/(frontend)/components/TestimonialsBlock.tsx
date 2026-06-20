"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export type Testimonials = {
  quote: string;
  name: string;
  location?: string;
  avatar?: { url: string };
};

// scroll function
function scrollToId(target: string) {
 const id = target.startsWith('#') ? target.slice(1) : target
 const el = document.getElementById(id)	
 if (!el) return
 const header = document.getElementById('header')
 const headerHeight = header ? parseInt(window.getComputedStyle(header).height) : 0
 const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight
 window.scrollTo({ top: y, behavior: 'smooth' })
}

type Props = {
 title?: string;
 content?: string;
 cta_button?: { label: string; url: string };
 testimonials?: Testimonials[];
 linkLabel?: string;
 linkUrl?: string;
};

export default function CenteredTestimonialCarousel({
 title = "Testimonials",
 content,
 cta_button,
 testimonials = [],
 linkLabel,
 linkUrl,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // switch every 2.5 seconds, stay on current if hovered
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [testimonials, isHovered]);

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((current + 1) % testimonials.length);

  if (!testimonials || testimonials.length === 0) return null;

  const cta = React.useMemo(() => {
  const rawUrl =
    (typeof cta_button?.url === "string"
      ? cta_button?.url
      : linkUrl) ?? "";

  const rawLabel = cta_button?.label ?? linkLabel ?? "Get Started";

  const url = (rawUrl || "").trim();
  const label = (rawLabel || "").trim();

  return label ? { url: url || "#", label } : undefined;
}, [cta_button, linkUrl, linkLabel]);


 return (
   <section className="bg-[rgb(24,24,27)] w-full py-20">
     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <div className="flex flex-col md:flex-row items-center gap-12">
         {/* Left: text content */}
         <div className="w-full md:w-7/12 space-y-6 md:pr-12">
           <h2 className="text-3xl md:text-4xl font-bold leading-snug text-[rgb(243,244,246)]">
             {title}
           </h2>
           {content && (
             <div className="prose prose-lg text-[rgb(161,161,170)]">
               <p>{content}</p>
             </div>
           )}
           {cta && (
             <div>
               <Link
                 href={cta.url}
                 scroll={false} // avoid Next’s auto-scroll
                 onClick={(e) => {
                   e.preventDefault();
                   scrollToId(cta.url);
                 }}
                 className="inline-block bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-[rgb(243,244,246)] font-medium px-6 py-3 rounded transition"
               >
                 {cta.label}
               </Link>
             </div>
           )}
         </div>

         {/* Right: carousel */}
          <div
            className="relative w-full flex justify-center overflow-hidden py-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(calc(50% - ${(current + 0.5) * 352}px))`, // 320 + 32 (mx-4 * 2)
              }}
            >
              {testimonials.map((t, i) => {
                const isActive = i === current;
                return (
                  <div
                    key={i}
                    className={`relative flex-none w-80 mx-4 rounded-2xl border border-gray-700 bg-zinc-800 text-gray-100 shadow-lg transform transition-all duration-700 ease-in-out ${
                      isActive ? "scale-105 opacity-100 z-10" : "scale-95 opacity-50 z-0"
                    }`}
                  >
 
                    <div className="p-6 flex flex-col justify-between h-full">
                      <p className="text-sm mb-4">“{t.quote}”</p>
                      <div className="flex items-center gap-4 mt-auto">
                        {t.avatar?.url && (
                          <img
                            src={t.avatar.url}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-700"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white">{t.name}</p>
                          {t.location && (
                            <p className="text-xs text-gray-400">{t.location}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrows */}
                    {isActive && (
                      <>
                        <button
                          onClick={prev}
                          className="absolute left-[-48px] top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition"
                          aria-label="Previous"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={next}
                          className="absolute right-[-48px] top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition"
                          aria-label="Next"
                        >
                          &gt;
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          

          

         </div>
       </div>
   </section>
 );
}
