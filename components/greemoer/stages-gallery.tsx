'use client'

import { FocusCards } from '@/components/ui/focus-cards'
import { usePortal } from './portal-provider'
import { SectionHeader } from './primitives'

export function StagesGallery() {
  const { opportunities } = usePortal()
  const seen = new Set<string>()
  const cards = opportunities
    .filter((o) => o.imageUrl)
    .map((o) => ({ title: `${o.city} · ${o.title}`, src: o.imageUrl }))
    .filter((c) => (seen.has(c.title) ? false : (seen.add(c.title), true)))
    .slice(0, 6)

  if (cards.length === 0) return null

  return (
    <section aria-labelledby="stages-heading" className="flex flex-col gap-8">
      <SectionHeader
        eyebrow="On the circuit"
        title="Stages across India"
        description="A look at where Greemoer artists are being booked right now. Hover a frame to bring it into focus."
      />
      <div id="stages-heading" className="sr-only">
        Stages across India
      </div>
      <FocusCards cards={cards} />
    </section>
  )
}
