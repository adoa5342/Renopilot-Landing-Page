"use client";

import { Page } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

type FooterProps = Extract<Page["layout"][0], { blockType: "footer" }>;

export default function FooterBlock({ block }: { block: FooterProps }) {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Company / Intro */}
          <div className="col-span-1 md:col-span-2">
            {block.logo && typeof block.logo === "object" ? (
              <div className="mb-2">
                <img
                  src={block.logo.url || ""}
                  alt={block.logo.alt || "RenoPilot Logo"}
                  className="h-24 w-auto max-w-full"
                  style={{ height: "6rem", maxWidth: "100%", width: "auto" }}
                />
              </div>
            ) : (
              <h3 className="text-xl font-bold mb-2 text-white">RenoPilot</h3>
            )}
            <p className="text-[#be123c] font-medium mb-4">
              Your Trusted Renovation Partner
            </p>
            <p className="mb-4 text-sm">
              Transforming homes with expert craftsmanship, innovative design, and personalized service.
              From kitchen remodels to complete home renovations, we bring your vision to life.
            </p>
            {block.content && (
              <div>
                <RichText data={block.content} />
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {block.about_us_url && (
                <li>
                  <a
                    href={block.about_us_url}
                    className="text-gray-300 hover:text-[#be123c] transition-colors"
                  >
                    About Us
                  </a>
                </li>
              )}
              {block.our_team_url && (
                <li>
                  <a
                    href={block.our_team_url}
                    className="text-gray-300 hover:text-[#be123c] transition-colors"
                  >
                    Our Team
                  </a>
                </li>
              )}
              <li><a href="/services" className="text-gray-300 hover:text-[#be123c] transition-colors">Services</a></li>
              <li><a href="/projects" className="text-gray-300 hover:text-[#be123c] transition-colors">Projects</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-[#be123c] transition-colors">Gallery</a></li>
              <li><a href="/testimonials" className="text-gray-300 hover:text-[#be123c] transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-300 hover:text-[#be123c] transition-colors">Get Help</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-[#be123c] transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-[#be123c] transition-colors">FAQ</a></li>
              <li><a href="/careers" className="text-gray-300 hover:text-[#be123c] transition-colors">Careers</a></li>
              <li><a href="/support-center" className="text-gray-300 hover:text-[#be123c] transition-colors">Support Center</a></li>
              <li><a href="/warranty" className="text-gray-300 hover:text-[#be123c] transition-colors">Warranty</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2 mb-4">
              {block.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto:${block.email}`} className="hover:text-[#be123c] transition-colors">
                    {block.email}
                  </a>
                </p>
              )}
              {block.phone && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  <a href={`tel:${block.phone}`} className="hover:text-[#be123c] transition-colors">
                    {block.phone}
                  </a>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Follow Us</h4>
              <div className="flex flex-col space-y-1">
                {block.facebook_url && <a href={block.facebook_url} className="text-gray-300 hover:text-[#be123c] transition-colors text-sm">Facebook</a>}
                {block.instagram_url && <a href={block.instagram_url} className="text-gray-300 hover:text-[#be123c] transition-colors text-sm">Instagram</a>}
                {block.linkedin_url && <a href={block.linkedin_url} className="text-gray-300 hover:text-[#be123c] transition-colors text-sm">LinkedIn</a>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} RenoPilot. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-[#be123c] transition-colors">Privacy Statement</a>
              <a href="/terms" className="text-gray-400 hover:text-[#be123c] transition-colors">Terms of Use</a>
              <a href="/cookies" className="text-gray-400 hover:text-[#be123c] transition-colors">Cookie Policy</a>
              <a href="/accessibility" className="text-gray-400 hover:text-[#be123c] transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
