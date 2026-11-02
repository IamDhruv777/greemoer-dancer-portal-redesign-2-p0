'use client'

import { CalendarDays, Check, IndianRupee, MapPin, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { daysUntil, deadlineLabel, formatDate, formatFeeRange } from '@/lib/greemoer/format'
import type { Application, DancerProfile, Opportunity } from '@/lib/greemoer/types'
import { ActionButton, Chip } from './primitives'

export function matchingStyles(opportunity: Opportunity, profile: DancerProfile) {
  const mine = new Set(profile.danceStyles.map((s) => s.style))
  return opportunity.danceStyles.filter((s) => mine.has(s))
}

export function OpportunityCard({
  opportunity,
  profile,
  application,
  onOpen,
  onApply,
}: {
  opportunity: Opportunity
  profile: DancerProfile
  application?: Application
  onOpen: () => void
  onApply: () => void
}) {
  const matches = matchingStyles(opportunity, profile)
  const urgent = daysUntil(opportunity.deadline) <= 7
  const closed = daysUntil(opportunity.deadline) < 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={opportunity.imageUrl || '/placeholder.svg'}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <Chip className="bg-card/95 backdrop-blur">{opportunity.eventType}</Chip>
          {matches.length > 0 ? (
            <Chip tone="brand">
              <Sparkles className="size-3" aria-hidden="true" />
              Matches you
            </Chip>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">{opportunity.client}</p>
          <h3 className="font-display text-2xl leading-tight text-balance">
            <button
              type="button"
              onClick={onOpen}
              className="text-left outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {opportunity.title}
            </button>
          </h3>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Location</dt>
            <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
            <dd>{opportunity.city}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Event date</dt>
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <dd>{formatDate(opportunity.eventDate)}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Fee</dt>
            <IndianRupee className="size-4 text-muted-foreground" aria-hidden="true" />
            <dd className="tabular-nums">{formatFeeRange(opportunity.feeMin, opportunity.feeMax)}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5" aria-label="Dance styles required">
          {opportunity.danceStyles.map((style) => (
            <li key={style}>
              <Chip tone={matches.includes(style) ? 'ink' : 'outline'}>{style}</Chip>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium',
              urgent && !closed ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {urgent && !closed ? <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" /> : null}
            {deadlineLabel(opportunity.deadline)}
          </p>
          {application ? (
            <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
              <Check className="size-3.5" aria-hidden="true" />
              {application.status === 'Submitted' ? 'Applied' : application.status}
            </span>
          ) : (
            <ActionButton
              tone="ink"
              size="sm"
              className="relative z-10"
              onClick={onApply}
              disabled={closed}
            >
              Apply now
            </ActionButton>
          )}
        </div>
      </div>
    </article>
  )
}
