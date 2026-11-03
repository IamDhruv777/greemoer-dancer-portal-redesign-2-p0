'use client'

import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from '@/components/ui/text-reveal-card'
import { Reveal } from '@/components/ui/reveal'

export function RevealBand({
  title,
  description,
  text,
  revealText,
}: {
  title: string
  description: string
  text: string
  revealText: string
}) {
  return (
    <Reveal>
      <section aria-label={`${text} ${revealText}`}>
        <TextRevealCard
          text={text}
          revealText={revealText}
          className="w-full max-w-none rounded-3xl border-white/10 bg-ink p-6 sm:p-10"
        >
          <TextRevealCardTitle className="font-display text-2xl font-normal sm:text-3xl">{title}</TextRevealCardTitle>
          <TextRevealCardDescription className="max-w-xl text-ink-muted">{description}</TextRevealCardDescription>
        </TextRevealCard>
      </section>
    </Reveal>
  )
}
