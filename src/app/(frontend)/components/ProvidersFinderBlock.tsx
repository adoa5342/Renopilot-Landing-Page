// File: src/app/(frontend)/components/ProvidersFinderBlock.tsx
"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// ---------- Types ----------
type ProviderType = "contractor" | "manufacturer" | "retailer" | "other";

type Service = { label: string; providerType: ProviderType };

type ProviderCard = {
  title: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  href?: string | null;

  // filter metadata (populated from Payload items)
  providerType?: ProviderType | string;
  services?: string[];   // serviceTags (e.g., ["Wardrobes", "Decking"])
  postcodes?: string[];  // e.g., ["3240", "2165"]
};

// ---------- Picker (top) ----------
type ProvidersPickerProps = {
  heading?: string;
  postcodeLabel?: string;
  services: Service[];
  onPicked?: () => void; // notify parent to scroll to results
};

const columns: { key: ProviderType; title: string }[] = [
  { key: "contractor", title: "Contractors" },
  { key: "manufacturer", title: "Manufacturers" },
  { key: "retailer", title: "Retailers" },
  { key: "other", title: "Other" },
];

function ProvidersPickerBlock({
  heading,
  postcodeLabel = "Postcode",
  services,
  onPicked,
}: ProvidersPickerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [postcode, setPostcode] = React.useState<string>(params.get("postcode") || "");

  function pick(svc: Service) {
    const next = new URLSearchParams(params.toString());
  
    const val = postcode.trim();
    if (val) next.set("postcode", val);
    else next.delete("postcode"); // <— remove it when empty
  
    next.set("service", svc.label);
    next.set("type", svc.providerType);
  
    router.push(`?${next.toString()}#providers-results`);
    onPicked?.();
    
    router.push(`?${next.toString()}`, { scroll: false });

    // Wait for layout to settle so measurements are correct,
    // then trigger the smooth, header-aware scroll in the parent.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onPicked?.();
      });
    });
  }
  
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="providers-picker">
      {heading && (
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6 text-white">
          {heading}
        </h2>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm font-medium text-white">{postcodeLabel}</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g. 3240"
          className="w-40 rounded-xl border border-neutral-300 bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <p className="text-xs text-neutral-400">Select a service below to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const items = services.filter((s) => s.providerType === col.key);
          return (
            <div
              key={col.key}
              className="rounded-2xl border border-neutral-700/30 bg-white/10 backdrop-blur p-4 shadow-sm"
            >
              <h3 className="font-semibold mb-3 text-white">{col.title}</h3>
              <ul className="space-y-2 max-h-[460px] overflow-auto pr-1">
                {items.map((s) => (
                  <li key={`${col.key}-${s.label}`}>
                    <button
                      onClick={() => pick(s)}
                      className="w-full text-left text-sm px-2 py-1 rounded-md hover:bg-white/10 hover:underline hover:underline-offset-4 text-white"
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-sm text-neutral-400">
                   No {col.title.toLowerCase()} available at this time
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Grid (bottom) ----------
type ProvidersGridProps = {
  heading?: string;
  items: ProviderCard[];
  onChangeRequested?: () => void; // scroll back up
};

function ProvidersGridBlock({
  heading = "Providers",
  items,
  onChangeRequested,
}: ProvidersGridProps) {
  const params = useSearchParams();
  const postcode = (params.get("postcode") || "").trim();
  const service = (params.get("service") || "").trim();
  const type = (params.get("type") || "").trim();

  // Filter logic
  const filtered = useMemo(() => {
    const svcLower = service.toLowerCase();
    return (items || []).filter((card) => {
      const typeOK =
        !type || (String(card.providerType || "").toLowerCase() === type.toLowerCase());
      const svcOK =
        !service ||
        (card.services || []).some((s) => String(s).toLowerCase() === svcLower);
      const pcOK =
        !postcode ||
        (card.postcodes && card.postcodes.length > 0
          ? card.postcodes.includes(postcode)
          : true); // if provider has no postcodes set, treat as "serves all"
      return typeOK && svcOK && pcOK;
    });
  }, [items, postcode, service, type]);

  const displayed = filtered.slice(0, 4);

  return (
    <section id="providers-results" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
              {heading}
            </h2>
            {(postcode || service || type) && (
              <div className="space-y-1">
                {postcode && (
                  <p className="text-lg md:text-xl text-white">
                    Postcode: <span className="font-bold">{postcode}</span>
                  </p>
                )}
                {service && (
                  <p className="text-lg md:text-xl text-white">
                    Project / Product / Service:{" "}
                    <span className="font-bold">{service}</span>
                  </p>
                )}
                {type && (
                  <p className="text-lg md:text-xl text-white">
                    Provider category:{" "}
                    <span className="font-bold capitalize">{type}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {service && (
            <button
              onClick={onChangeRequested}
              className="text-sm underline underline-offset-4 hover:opacity-80 text-white"
            >
              Change
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayed.length > 0 ? (
          displayed.map((item, i) => (
            <article
              key={`${item.title}-${i}`}
              className="group rounded-2xl border border-neutral-700/30 bg-white/10 p-0 shadow-sm overflow-hidden
                         transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] relative border-b border-neutral-700/30">
                {item.image?.url ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-neutral-400 text-sm">
                    {item.title}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-white group-hover:underline">
                  {item.title}
                </h3>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-2 inline-block text-sm underline underline-offset-4 text-white"
                  >
                    View provider
                  </Link>
                ) : (
                  <span className="mt-2 inline-block text-sm text-neutral-400">
                    No link provided
                  </span>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center text-neutral-400 text-sm py-10">
            No providers match this selection.
          </div>
        )}

        {/* keep empty placeholders if fewer than 4 */}
        {Array.from({ length: Math.max(0, 4 - displayed.length) }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="rounded-2xl border border-dashed border-neutral-700/30 bg-white/5 h-60"
          />
        ))}
      </div>
    </section>
  );
}

// ---------- Wrapper (exports default) ----------
export type ProvidersFinderProps = ProvidersPickerProps & {
  items: ProviderCard[];           // cards to render (with filter metadata)
  blockName?: string;              // pass Payload blockName for anchors
};

export default function ProvidersFinderBlock({
  services,
  heading,
  postcodeLabel,
  items,
  blockName,
}: ProvidersFinderProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const header = document.getElementById('header');
    const headerHeight = header ? parseInt(window.getComputedStyle(header).height) : 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // derive stable ids
  const anchorId = blockName || 'providers';
  const resultsAnchorId = `${anchorId}-results`;

  return (
    <section id={anchorId} className="space-y-8 scroll-mt-24">
      <div ref={pickerRef as any} id="providers-picker">
        <ProvidersPickerBlock
          services={services}
          heading={heading}
          postcodeLabel={postcodeLabel}
          onPicked={() => scrollTo(resultsRef as any)}
        />
      </div>

      <div ref={resultsRef as any} id={resultsAnchorId}>
        <ProvidersGridBlock
          items={items}
          onChangeRequested={() => scrollTo(pickerRef as any)}
        />
      </div>
    </section>
  );
}
