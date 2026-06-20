"use client";

import React from "react";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <section className="bg-[rgba(27,27,29,1)] w-full py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(245,245,245)]">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="relative group">
              <button className="w-full text-left px-6 py-4 bg-[rgb(190,18,60)] hover:bg-[rgba(227,26,76,1)] rounded-lg focus:outline-none text-[rgb(245,245,245)]">
                {faq.question}
              </button>
              <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white text-gray-800 border rounded shadow-lg p-3 w-80 z-50">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
