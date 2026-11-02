'use client'

import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { usePortal } from './portal-provider'

export function BookerPreview() {
  const { profile, portfolio } = usePortal()
  const image = portfolio[0]?.thumbnailUrl || profile.photoUrl || '/placeholder.svg'

  return (
    <section
      aria-labelledby="booker-preview-heading"
      className="overflow-hidden rounded-3xl bg-ink text-ink-foreground"
    >
      <ContainerScroll
        titleComponent={
          <h2 id="booker-preview-heading" className="font-display text-4xl font-normal">
            This is how bookers see your <br />
            <em className="text-brand text-5xl italic md:text-[5rem] md:leading-none">first impression.</em>
          </h2>
        }
      >
        <img
          src={image}
          alt={`${profile.stageName} featured performance`}
          draggable={false}
          className="mx-auto size-full rounded-2xl object-cover object-top"
        />
      </ContainerScroll>
    </section>
  )
}
