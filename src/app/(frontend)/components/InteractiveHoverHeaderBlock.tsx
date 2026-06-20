"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveHoverHeaderBlockData } from "@/blocks/InteractiveHoverHeaderBlock";

type Props = {
  block: InteractiveHoverHeaderBlockData;
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

const InteractiveHoverHeaderBlock: React.FC<Props> = ({ block }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Get the current image URL based on hover state
  const currentImage =
    activeIndex !== null && block.hoverOptions[activeIndex]
      ? block.hoverOptions[activeIndex].image.url
      : block.defaultImage.url;

  // Determine transition duration based on speed setting
  const transitionDuration = {
    fast: 0.3,
    medium: 0.5,
    slow: 0.8,
  }[block.transitionSpeed];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage}
            alt={
              activeIndex !== null && block.hoverOptions[activeIndex]
                ? block.hoverOptions[activeIndex].image.alt || block.hoverOptions[activeIndex].label
                : block.defaultImage.alt || "Background"
            }
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-start pt-24 md:pt-32 px-6 md:px-12 lg:px-20 text-white">
        {/* Title - Top Left aligned */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-2xl"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
            {block.title}
          </h1>
        </motion.div>

        {/* Hover Options - No boxes, just text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-3 md:gap-4"
        >
          {block.hoverOptions.map((option, index) => (
            <div
              key={index}
              onMouseEnter={() => {
                setActiveIndex(index);
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setActiveIndex(null);
                setIsHovering(false);
              }}
              className="group cursor-pointer"
            >
              <motion.div
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
                className="relative inline-block"
              >
                <h3 
                  className={`text-6xl md:text-7xl lg:text-8xl font-black transition-all duration-300 ${
                    activeIndex === index
                      ? "text-transparent [-webkit-text-stroke:2px_white] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                      : "opacity-60 hover:opacity-80 drop-shadow-lg"
                  }`}
                  style={activeIndex === index ? {
                    WebkitTextStroke: '2px white',
                  } as React.CSSProperties : {}}
                >
                  {option.label}
                </h3>
                
                {/* Optional underline on hover */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: activeIndex === index ? '100%' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-white/80 mt-1"
                />
                {option.linkUrl && option.linkText && activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Link
                      href={option.linkUrl.startsWith('#') ? option.linkUrl : `#${option.linkUrl}`}
                      scroll={false}
                      onClick={(e) => {
                        e.preventDefault();                 // stop Next.js navigation
                        scrollToId(option.linkUrl);         // supports "#id" or "id"
                      }}
                      className="inline-flex items-center text-sm font-semibold text-white hover:text-gray-200 transition-colors mt-3"
                    >
                      {option.linkText}
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Optional: Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-white/80 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default InteractiveHoverHeaderBlock;
