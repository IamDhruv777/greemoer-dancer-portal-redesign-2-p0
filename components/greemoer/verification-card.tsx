'use client'

import { EvervaultCard, Icon } from '@/components/ui/evervault-card'
import { usePortal } from './portal-provider'
import { Eyebrow, VerificationBadge } from './primitives'

export function VerificationCard() {
  const { profile } = usePortal()

  return (
    <section
      aria-labelledby="verification-heading"
      className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:p-8"
    >
      <div className="relative size-56 shrink-0 border border-border/80">
        <Icon className="absolute -top-3 -left-3 size-6 text-foreground" aria-hidden="true" />
        <Icon className="absolute -bottom-3 -left-3 size-6 text-foreground" aria-hidden="true" />
        <Icon className="absolute -top-3 -right-3 size-6 text-foreground" aria-hidden="true" />
        <Icon className="absolute -right-3 -bottom-3 size-6 text-foreground" aria-hidden="true" />
        <EvervaultCard text="ID" />
      </div>
      <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
        <Eyebrow>Trust &amp; safety</Eyebrow>
        <h2 id="verification-heading" className="font-display text-3xl leading-none">
          Your artist ID
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          Bookers filter for verified artists first. Hover the card to preview the encrypted ID
          Greemoer issues once our team has reviewed your documents and portfolio.
        </p>
        <VerificationBadge status={profile.verification} />
      </div>
    </section>
  )
}
