'use client'

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  IndianRupee,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react'
import { deadlineLabel, daysUntil, formatDate, formatFeeRange } from '@/lib/greemoer/format'
import { useApplyDialog } from '../apply-dialog'
import { matchingStyles } from '../opportunity-card'
import { usePortal } from '../portal-provider'
import { ActionButton, Chip, Eyebrow, Panel } from '../primitives'

export function OpportunityDetailView({ opportunityId }: { opportunityId: string }) {
  const { opportunities, profile, applications, navigate } = usePortal()
  const apply = useApplyDialog()
  const opportunity = opportunities.find((o) => o.id === opportunityId)

  if (!opportunity) {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-display text-4xl">This opportunity is no longer listed</h1>
        <ActionButton tone="outline" onClick={() => navigate('opportunities')}>
          <ArrowLeft aria-hidden="true" />
          Back to opportunities
        </ActionButton>
      </div>
    )
  }

  const application = applications.find((a) => a.opportunityId === opportunity.id)
  const matches = matchingStyles(opportunity, profile)
  const closed = daysUntil(opportunity.deadline) < 0

  const facts = [
    { icon: CalendarDays, label: 'Event date', value: formatDate(opportunity.eventDate) },
    { icon: MapPin, label: 'Location', value: `${opportunity.venue}, ${opportunity.city}` },
    { icon: IndianRupee, label: 'Fee per performer', value: formatFeeRange(opportunity.feeMin, opportunity.feeMax) },
    { icon: Users, label: 'Performers needed', value: String(opportunity.performersNeeded) },
    { icon: Clock3, label: 'Duration', value: opportunity.durationLabel },
  ]

  return (
    <article className="flex flex-col gap-8">
      <button
        type="button"
        onClick={() => navigate('opportunities')}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All opportunities
      </button>

      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted sm:aspect-[21/9]">
        <img src={opportunity.imageUrl || '/placeholder.svg'} alt="" className="size-full object-cover" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Chip>{opportunity.eventType}</Chip>
              {matches.length > 0 ? (
                <Chip tone="brand">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Matches your {matches.join(' & ')}
                </Chip>
              ) : null}
            </div>
            <h1 className="font-display text-4xl leading-[1.02] text-balance md:text-5xl">
              {opportunity.title}
            </h1>
            <p className="text-muted-foreground">Posted by {opportunity.client}</p>
          </header>

          <section className="flex flex-col gap-3" aria-labelledby="brief-heading">
            <h2 id="brief-heading" className="font-display text-2xl">
              The brief
            </h2>
            <p className="max-w-2xl leading-relaxed text-pretty">{opportunity.description}</p>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="req-heading">
            <h2 id="req-heading" className="font-display text-2xl">
              What they need
            </h2>
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {opportunity.requirements.map((req) => (
                <li key={req} className="flex items-start gap-3 py-3.5">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="styles-heading">
            <h2 id="styles-heading" className="font-display text-2xl">
              Styles requested
            </h2>
            <ul className="flex flex-wrap gap-2">
              {opportunity.danceStyles.map((style) => (
                <li key={style}>
                  <Chip tone={matches.includes(style) ? 'ink' : 'outline'} className="px-3 py-1.5 text-sm">
                    {style}
                  </Chip>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Panel className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-1">
              <Eyebrow>{deadlineLabel(opportunity.deadline)}</Eyebrow>
              <p className="text-sm text-muted-foreground">
                Apply by {formatDate(opportunity.deadline)}
              </p>
            </div>

            <dl className="flex flex-col gap-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="text-sm">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {application ? (
              <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Check className="size-4" aria-hidden="true" />
                  {application.status === 'Submitted' ? 'Application sent' : application.status}
                </p>
                <p className="text-xs text-muted-foreground">Submitted {formatDate(application.submittedAt)}</p>
                <ActionButton tone="outline" size="sm" onClick={() => navigate('applications')}>
                  View in My Applications
                </ActionButton>
              </div>
            ) : (
              <ActionButton
                tone="brand"
                size="lg"
                className="w-full"
                disabled={closed}
                onClick={() => apply.openApply(opportunity)}
              >
                {closed ? 'Applications closed' : 'Apply for this gig'}
              </ActionButton>
            )}
          </Panel>
        </aside>
      </div>

      {apply.dialog}
    </article>
  )
}
