"use client";

import React, { useEffect, useRef, useState } from "react";
import { StartBlockData } from "../../../blocks/StartBlock";

type Props = {
  block: StartBlockData;
};

const StartBlockComponent: React.FC<Props> = ({ block }) => {
  const { description, buttonText, buttonLink, backgroundImage } = block;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center py-80 mt-15 bg-gray-100"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: backgroundImage ? undefined : "transparent",
      }}
    >
      
      <p
        className={`font-heading max-w-2xl text-white font-bold text-xl md:text-2xl transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {description}
      </p>

      {buttonText && buttonLink && (
        <a
          href={buttonLink}
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-extrabold rounded-full animate-pulse hover:bg-blue-700 transition-colors font-heading"
          style={{
            backgroundColor: 'rgba(227,26,76,1)',
          }}
        >
          {buttonText}
        </a>
      )}
    </section>
  );
};

export default StartBlockComponent;
