'use client'

import { Page } from "@/payload-types"
import { RichText } from '@payloadcms/richtext-lexical/react'
import { motion } from 'framer-motion'

type HeroProps = Extract<Page['layout'][0], { blockType: 'hero' }>

const SPLASH_DURATION = 1;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: SPLASH_DURATION + 0.2,
    },
  },
}

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const handleScroll = (id: string) => {
  const el = document.getElementById(id);
  const header = document.getElementById("header");
  if (el && header) {
    const headerHeight = parseInt(window.getComputedStyle(header).height);
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  }
};

export default function HeroBlock({ block }: { block: HeroProps }) {
  const { heading, subheading, image, cta_buttons, centered } = block;

  return (
    <div
      className="relative h-screen flex flex-col justify-center w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${image?.url})` }}
    >
      {/* overlay */}
      <div className="bg-black/50 absolute inset-0 z-0"></div>

      <motion.div
        className={`relative z-10 px-6 md:px-12 ${
          centered ? "mx-auto text-center items-center max-w-4xl" : "max-w-3xl"
        }`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.h2
          className={`font-bold text-white drop-shadow-lg leading-tight ${
            centered
              ? "text-4xl md:text-6xl font-extrabold"
              : "text-2xl md:text-5xl"
          }`}
          variants={itemAnim}
        >
          {heading}
        </motion.h2>

        {/* Subheading */}
        {subheading && (
          <motion.div
            className={`mt-6 text-white drop-shadow-lg leading-relaxed ${
              centered
                ? "text-lg md:text-2xl mx-auto max-w-2xl"
                : "text-base md:text-xl"
            }`}
            variants={itemAnim}
          >
            <RichText data={subheading} />
          </motion.div>
        )}

        {/* Buttons */}
        {cta_buttons && (
          <motion.ul
            className={`mt-10 flex flex-wrap gap-6 ${
              centered ? "justify-center" : ""
            }`}
            variants={container}
          >
            {cta_buttons.map((btn) => (
              <motion.li
                key={btn.id}
                className={`cursor-pointer transition ${
                  centered
                    ? "bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
                    : "bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-white px-5 py-2.5 rounded text-sm"
                }`}
                variants={itemAnim}
                onClick={() => handleScroll(btn.url)}
              >
                {btn.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  )
}
