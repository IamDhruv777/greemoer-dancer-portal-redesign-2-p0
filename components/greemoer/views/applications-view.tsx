'use client'

import { ArrowRight, PartyPopper, Send, Star } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { cn } from '@/lib/utils'
import { formatDate, formatINR } from '@/lib/greemoer/format'
import type { Application, ApplicationStatus } from '@/lib/greemoer/types'
import { ConfirmDialog } from '../confirm-dialog'
import { usePortal } from '../portal-provider'
import { ActionButton, SectionHeader } from '../primitives'
import { RevealBand } from '../reveal-band'
import { WobbleEmpty, WobbleStats } from '../wobble-stats'

const statusStyles: Record<ApplicationStatus, string> = {
  Submitted: 'bg-muted text-foreground',
  Shortlisted: 'bg-brand text-brand-foreground',
  Booked: 'bg-ink text-ink-foreground',
  'Not selected': 'bg-muted text-muted-foreground',
}

const PIPELINE: ApplicationStatus[] = ['Submitted', 'Shortlisted', 'Booked']

export function ApplicationsView() {
  const { applications, opportunities, navigate, withdrawApplication, notify } = usePortal()
  const [withdrawing, setWithdrawing] = useState<Application | null>(null)

  const rows = applications
    .map((app) => ({ app, opp: opportunities.find((o) => o.id === app.opportunityId) }))
    .filter((r) => r.opp)

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        as="h1"
        eyebrow="My applications"
        title="Track every gig you've pitched"
        description="Bookers usually respond within five working days. You'll be notified here and by email when a status changes."
      />

      <WobbleStats
        label="Application summary"
        stats={[
          { label: 'Pitched', value: applications.length, hint: 'Applications sent', tone: 'ink', icon: <Send className="size-5 text-brand" /> },
          {
            label: 'Shortlisted',
            value: applications.filter((a) => a.status === 'Shortlisted').length,
            hint: 'Bookers want a closer look',
            tone: 'brand',
            icon: <Star className="size-5" />,
          },
          {
            label: 'Booked',
            value: applications.filter((a) => a.status === 'Booked').length,
            hint: 'Confirmed performances',
            tone: 'graphite',
            icon: <PartyPopper className="size-5 text-brand" />,
          },
        ]}
      />

      <RevealBand
        title="From pitch to performance"
        description="Hover to see where every application is headed."
        text="Pitched."
        revealText="Booked."
      />

      {rows.length === 0 ? (
        <WobbleEmpty icon={<Send className="size-5" aria-hidden="true" />} title="No applications yet">
          <ActionButton tone="brand" onClick={() => navigate('opportunities')}>
            Find a gig
            <ArrowRight aria-hidden="true" />
          </ActionButton>
        </WobbleEmpty>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map(({ app, opp }, index) => (
            <Reveal as="li" key={app.id} delay={index * 0.07}>
              <SpotlightCard
                as="article"
                className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-30px_rgb(20_20_19/0.45)] sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
                  <img
                    src={opp!.imageUrl || '/placeholder.svg'}
                    alt=""
                    className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', statusStyles[app.status])}>
                      {app.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Applied {formatDate(app.submittedAt)}
                      {app.quote ? ` · Quoted ${formatINR(app.quote)}` : ''}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl leading-tight text-balance">{opp!.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {opp!.client} · {opp!.city} · {formatDate(opp!.eventDate)}
                  </p>
                  <ol className="flex items-center gap-2" aria-label="Application progress">
                    {PIPELINE.map((step, i) => {
                      const reached = PIPELINE.indexOf(app.status) >= i
                      return (
                        <li key={step} className="flex items-center gap-2 text-xs">
                          <span className="relative flex size-2.5" aria-hidden="true">
                            {PIPELINE.indexOf(app.status) === i ? (
                              <span className="absolute inset-0 rounded-full bg-brand [animation:ping-ring_2s_ease-out_infinite]" />
                            ) : null}
                            <span
                              className={cn(
                                'relative size-2.5 rounded-full transition-colors duration-500',
                                reached ? 'bg-brand shadow-[0_0_10px_var(--brand)]' : 'bg-input',
                              )}
                            />
                          </span>
                          <span className={reached ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
                          {i < PIPELINE.length - 1 ? (
                            <span className="relative h-0.5 w-4 overflow-hidden rounded-full bg-input sm:w-8" aria-hidden="true">
                              <span
                                className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-1000"
                                style={{ width: PIPELINE.indexOf(app.status) > i ? '100%' : '0%' }}
                              />
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ol>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <ActionButton tone="outline" size="sm" onClick={() => navigate('opportunities', opp!.id)}>
                    View brief
                  </ActionButton>
                  {app.status === 'Submitted' ? (
                    <ActionButton tone="ghost" size="sm" onClick={() => setWithdrawing(app)}>
                      Withdraw
                    </ActionButton>
                  ) : null}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={withdrawing !== null}
        onOpenChange={(open) => !open && setWithdrawing(null)}
        title="Withdraw this application?"
        description="The booker will no longer see your pitch. You can apply again while the brief is open."
        confirmLabel="Withdraw application"
        onConfirm={async () => {
          if (!withdrawing) return
          await withdrawApplication(withdrawing.id)
          notify('Application withdrawn.')
        }}
      />
    </div>
  )
}
