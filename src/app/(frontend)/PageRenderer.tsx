import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import { Page } from '@/payload-types'
import config from '@/payload.config'
import './styles.css'

import HeroBlock from './components/HeroBlock'
import ContentBlock from './components/ContentBlock'
import HeaderBlock from './components/HeaderBlock'
import InteractiveBlock from './components/InteractiveBlock'
import ImageGridBlock from './components/ImageGridBlock'
import FAQAccordion from './components/FAQAccordion'
import FooterBlock from './components/FooterBlock'
import ImageSliderBlock from './components/ImageSliderBlock'
import ProjectGridBlock from './components/ProjectGrid'
import { Project } from './components/ProjectGrid'
import FeaturedCarouselBlock from './components/FeaturedCarouselBlock'
import ImageShowcaseBlock from './components/ImageShowcaseBlock'
import StartBlockComponent from './components/StartBlock'
import PopupForm from './components/PopupForm'
import ProvidersFinderBlock from './components/ProvidersFinderBlock'
import InteractiveHoverHeaderBlockComponent from './components/InteractiveHoverHeaderBlock'
import TestimonialsBlock from './components/TestimonialsBlock'
import Form from './components/Form'

export default async function PageRenderer({ slug }: { slug: string }) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
  })

  if (!page) return <div>Page not found</div>

  const renderBlocks = (block: Page['layout'][0]) => {
    switch (block.blockType) {
      case 'hero':
        return <HeroBlock block={block} key={block.id} />

    case 'start-block':
      return <StartBlockComponent key={block.id} block={block} />;



      case 'content':
        return <ContentBlock block={block} key={block.id} />

      case 'header':
        return <HeaderBlock block={block} key={block.id} />

      case 'interactive':
        return <InteractiveBlock block={block} key={block.id} />

      case 'grid':
        return <ImageGridBlock block={block} key={block.id} />

      case 'footer':
        return <FooterBlock block={block} key={block.id} />

      case 'faq-block':
        return <FAQAccordion faqs={block.faqs} key={block.id} />

      case 'image-slider': {
        const sliderBlock = block as {
          images: { image: { url: string }; alt?: string }[]
          id: string
        }
        return <ImageSliderBlock images={sliderBlock.images} key={sliderBlock.id} />
      }

      case 'featuredCarousel': {
        const b = block as any

        const asUrl = (v: any): string | undefined =>
          typeof v === 'string' ? v : v && typeof v === 'object' ? v.url : undefined

        const projects = Array.isArray(b.projects)
          ? b.projects.filter(Boolean).map((p: any) => ({
              id: p.id ?? Math.random().toString(36),
              title: p.title ?? 'Untitled',
              summary: p.summary ?? undefined,
              href: p.href ?? undefined,
              coverImageUrl:
                asUrl(p.coverImage) ??
                asUrl(p.image) ??
                '/placeholder.png',
            }))
          : []

        return (
          <FeaturedCarouselBlock
            key={b.id}
            title={b.title ?? 'Featured Projects'}
            blurb={b.content ?? undefined}
            cta_button={
              b?.cta_button
                ? { label: b.cta_button.label ?? '', url: b.cta_button.url ?? '' }
                : undefined
            }
            projects={projects}
          />
        )
      }

      case 'projectGrid': {
        const gridBlock = block as { projects?: any[] | null; id: string }

        const projects: Project[] = (gridBlock.projects ?? [])
          .filter(Boolean)
          .map((p) => ({
            id: p.id || Math.random().toString(),
            title: p.title,
            imageUrl:
              typeof p.imageUrl === 'object'
                ? p.imageUrl.url
                : String(p.imageUrl),
            category: p.category,
            budget: p.budget ?? 0,
            link: p.link ?? undefined,
          }))

        return <ProjectGridBlock projects={projects} key={gridBlock.id} />
      }

      case 'imageShowcase': {
        const showcaseBlock = block as any
        return (
          <ImageShowcaseBlock
            key={showcaseBlock.id}
            title={showcaseBlock.title}
            content={showcaseBlock.content}
            images={showcaseBlock.images}
            cta_button={showcaseBlock.cta_button}
            reverseLayout={showcaseBlock.reverseLayout}
          />
        )
      }

      case 'popup-form':
        return <PopupForm block={block} key={block.id} />
    
      case 'providersFinder': {
        const b = block as any;
        const asUrl = (v: any) => (typeof v === 'string' ? v : v?.url ?? undefined);
      
        const services = Array.isArray(b.services)
          ? b.services.map((s: any) => ({ label: s.label ?? '', providerType: s.providerType ?? 'other' }))
          : [];
      
        const items = Array.isArray(b.items)
          ? b.items.map((it: any) => {
              const rel = it.providerPage;
              const href = it?.href ?? (rel?.slug ? `/${rel.slug}` : undefined);
              return {
                title: it.title ?? 'Untitled',
                image: it.image ? { url: asUrl(it.image), alt: it.image?.alt } : undefined,
                href,
                providerType: it.providerType,
                services: (it.serviceTags ?? []).map((t: any) => String(t?.value || '')).filter(Boolean),
                postcodes: (it.postcodes ?? []).map((p: any) => String(p?.value || '')).filter(Boolean),
              };
            })
          : [];
      
        return (
          <ProvidersFinderBlock
            key={b.id}
            heading={b.heading ?? 'Providers of goods and services'}
            postcodeLabel={b.postcodeLabel ?? 'Postcode'}
            services={services}
            items={items}
            blockName={b.blockName}
          />
        );
      }
      
      case 'interactiveHoverHeader': {
        const hoverHeaderBlock = block as any
        return (
          <InteractiveHoverHeaderBlockComponent
            key={hoverHeaderBlock.id}
            block={hoverHeaderBlock}
          />
        )
      }

      case 'testimonialsBlock': {
        return (
          <TestimonialsBlock
            key={block.id}
            title={block.title}
            content={block.content}
            testimonials={block.testimonials}
            cta_button={block.cta_button}
          />
        )
      }

      case 'form':
        return <Form block={block} key={block.id} />

      default: 
        return null 
    } 
  }


  return (
    <div className="home">
      <div className="page">{page.layout?.map((block) => renderBlocks(block))}</div>
    </div>
  )
}
