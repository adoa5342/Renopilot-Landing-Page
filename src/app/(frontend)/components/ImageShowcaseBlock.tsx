"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = (x: number) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
});

type Props = {
  title: string;
  content?: any; 
  images: { image: { url: string }; alt?: string }[];
  cta_button?: { label: string; url: string };
  reverseLayout?: boolean;
};

export default function ImageShowcaseBlock({
  title,
  content,
  images,
  cta_button,
  reverseLayout = false,
}: Props) {
  return (
    <section
      className={`bg-[rgb(24,24,27)] flex flex-col md:flex-row ${
        reverseLayout ? "md:flex-row-reverse" : ""
      } items-center gap-12 px-6 md:px-20 py-16`}
    >
      <motion.div
        className={`w-full md:w-7/12 space-y-6 ${
          reverseLayout ? "md:pl-32" : "md:pr-12"
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

        {content && (
          <motion.div
            className="prose prose-lg text-[rgb(161,161,170)]"
            variants={item(reverseLayout ? 100 : -100)}
          >
            <RichText data={content} />
          </motion.div>
        )}

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
        className="w-full md:w-5/12 flex gap-4"
        initial={{ opacity: 0, x: reverseLayout ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {images?.[0]?.image?.url && (
          <img
            src={images[0].image.url}
            alt={images[0].alt ?? ""}
            className="aspect-square w-1/2 rounded-lg object-cover shadow-lg"
          />
        )}
        <div className="flex flex-col w-1/2 gap-4">
          {images?.[1]?.image?.url && (
            <img
              src={images[1].image.url}
              alt={images[1].alt ?? ""}
              className="aspect-video rounded-lg object-cover shadow-lg"
            />
          )}
          {images?.[2]?.image?.url && (
            <img
              src={images[2].image.url}
              alt={images[2].alt ?? ""}
              className="aspect-video rounded-lg object-cover shadow-lg"
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
