"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ImageSliderBlockProps = {
  images: { image: { url: string }; alt?: string }[];
};

export default function ImageSliderBlock({ images }: ImageSliderBlockProps) {
  const swiperOptions: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation], // must be named imports!
    spaceBetween: 30,
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { clickable: true },
    navigation: true,
  };

  return (
    <section className="w-full py-30 bg-black/70">
      <div className="max-w-6xl mx-auto">
        <Swiper {...swiperOptions}>
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-120 md:h-160">
                <Image
                  src={img.image.url}
                  alt={img.alt || "Slide Image"}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
