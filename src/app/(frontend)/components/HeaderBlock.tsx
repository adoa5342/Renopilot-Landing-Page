"use client";

import { Page } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

import logo from "../../Images/r-logo.png";
import scrolledLogo from "../../Images/logo-3.png";

type HeaderProps = Extract<Page["layout"][0], { blockType: "header" }>;

export default function HeaderBlock({ block }: { block: HeaderProps }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 h-30 transition-[background,padding,transform] duration-700 ${scrolled ? "bg-black/70 backdrop-blur-md py-0" : "bg-transparent py-0"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      id="header"
    >
      <div className="max-w-[1400px] flex flex-col items-center px-6">
        <div className="w-full flex items justify-between">
          <Link href="/" aria-label="Home">
            <div className="relative w-[250px] h-[150px] -ml-12 -mt-3">
              {/* Monogram (initial) */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={scrolled ? { opacity: 0, scale: 0.9, x: -6 } : { opacity: 1, scale: 1, x: 0 }}
                transition={t}
                style={{ transformOrigin: "left center", willChange: "transform, opacity" }}
              >
                <Image
                  src={logo}
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 180px, 250px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Full logo (revealed on scroll) */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={
                  scrolled
                    ? { opacity: 1, scale: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)" }
                    : { opacity: 0, scale: 0.98, x: 6, clipPath: "inset(0% 60% 0% 0%)" }
                }
                transition={t}
                style={{ transformOrigin: "left center", willChange: "transform, opacity, clip-path" }}
              >
                <Image
                  src={scrolledLogo}
                  alt="Scrolled Logo"
                  fill
                  sizes="(max-width: 768px) 180px, 250px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </Link>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 list-none sm:gap-4">
            {block.loginLink && (
              <li
                onClick={() => {
                  const popup = document.getElementById(block.loginLink);
                  if (popup) {
                    const popups = document.getElementsByClassName("popup");
                    for (let possiblePopups of popups) {
                      possiblePopups.style.display = "none";
                    }
                    popup.style.display = "flex";
                  }
                }}
                className="bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-[rgb(245,245,245)] px-6 py-2 rounded transition"
              >
                Login
              </li>
            )}
            {block.signupLink && (
              <li
                onClick={() => {
                  const popup = document.getElementById(block.signupLink);
                  if (popup) {
                    const popups = document.getElementsByClassName("popup");
                    for (let possiblePopups of popups) {
                      possiblePopups.style.display = "none";
                    }
                    popup.style.display = "flex";
                  }
                }}
                className="bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] text-[rgb(245,245,245)] px-4 py-2 rounded transition"
              >
                Signup
              </li>
            )}
          </div>
        </div>

        {block.navigationLinks && block.navigationLinks.length > 0 && (
          <ul className="flex justify-center gap-12 text-white absolute top-[80px] left-1/2 transform -translate-x-1/2 -mt-6">
            {block.navigationLinks.map((item) => (
              <li key={item.id} className="hover:underline text-2xl font-semibold">
                <Link href={item.url}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
