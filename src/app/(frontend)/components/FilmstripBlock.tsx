"use client"

import FilmstripCarousel, { SliderImage } from "./FilmstripCarousel"

type Props = {
  images: SliderImage[]
  speedPxPerSec?: number
  visibleCount?: number
  gapPx?: number
  heightPx?: number
  className?: string
  reverseLayout?: boolean
}

export default function FilmstripBlock({
  images,
  speedPxPerSec = 120,
  visibleCount = 2,
  gapPx = 24,
  heightPx = 160,
  className = "",
}: Props) {
  const normalized = images.map((i) => ({
    image: { url: i.image?.url ?? "" },
    alt: i.alt ?? "",
  }))

  if (normalized.length < 2) {
    return (
      <div className="text-sm text-yellow-400">
        Add at least 2 images to display a filmstrip
      </div>
    )
  }

  return (
    <section className={`w-full py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <FilmstripCarousel
          images={normalized}
          speedPxPerSec={speedPxPerSec}
          visibleCount={visibleCount}
          gapPx={gapPx}
          heightPx={heightPx}
        />
      </div>
    </section>
  )
}
