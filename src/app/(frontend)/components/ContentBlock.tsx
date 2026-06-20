'use client'

import { Page } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FilmstripBlock from './FilmstripBlock'

type ContentProps = Extract<Page['layout'][0], { blockType: 'content' }>

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = (x: number) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
})

export default function ContentBlock({ block }: { block: ContentProps }) {
  const {
    title,
    content,
    cta_button,
    image,
    reverseLayout,
    useFilmstrip,
    images,
    filmstripOptions,
  } = block

  return (
    <section
      className={`bg-[rgb(24,24,27)] flex flex-col md:flex-row ${
        reverseLayout ? 'md:flex-row-reverse' : ''
      } items-center gap-12 px-6 md:px-20 py-16`}
      {...(block.blockName ? { id: block.blockName } : {})}
    >
      <motion.div
        className={`w-full md:w-7/12 space-y-6 ${
          reverseLayout ? 'md:pl-32' : 'md:pr-12'
        }`}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold leading-snug text-[rgb(243,244,246)]"
          variants={item(reverseLayout ? 100 : -100)}
        >
          {title}
        </motion.h2>

        <motion.div
          className="prose prose-lg text-[rgb(161,161,170)]"
          variants={item(reverseLayout ? 100 : -100)}
        >
          <RichText data={content} />
        </motion.div>

        {cta_button?.url && (
          <motion.div variants={item(reverseLayout ? 100 : -100)}>
            <Link
              href={cta_button.url}
              className="inline-block bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-[rgb(243,244,246)] font-medium px-6 py-3 rounded transition"
            >
              {cta_button.label}
            </Link>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="w-full md:w-5/12"
        initial={{ opacity: 0, x: reverseLayout ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {useFilmstrip ? (
          <FilmstripBlock
            images={images || []}
            speedPxPerSec={filmstripOptions?.speedPxPerSec}
            visibleCount={filmstripOptions?.visibleCount}
            gapPx={filmstripOptions?.gapPx}
            heightPx={filmstripOptions?.heightPx}
          />
        ) : (
          image && (
            <img
              src={image.url}
              alt={image.alt || 'Content image'}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          )
        )}
      </motion.div>
    </section>
  )
}
