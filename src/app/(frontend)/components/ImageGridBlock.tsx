import { Page } from "@/payload-types";

type ContentProps = Extract<Page['layout'][0], { blockType: 'grid' }>

export default function ImageGridBlock({ block }: { block: ContentProps }) {
  return (
    <section className="bg-[rgb(24,24,27)] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[rgb(245,245,245)]">Explore Project Types</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {block.images.slice(0, 9).map((item) => (
            <div key={item.id} className="relative w-full h-64 overflow-hidden rounded shadow-md">
              <img
                src={item.image.url}
                alt={item.image.alt || item.label || `Image ${item.id}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[rgb(243,244,246)] text-lg font-medium bg-[rgb(190,18,60)] px-2 py-1 rounded">
                {item.label || item.image?.alt || 'Untitled'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}