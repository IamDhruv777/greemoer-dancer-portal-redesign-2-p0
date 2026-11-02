'use client'

import { ArrowRight, Send } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { formatDate, formatINR } from '@/lib/greemoer/format'
import type { Application, ApplicationStatus } from '@/lib/greemoer/types'
import { ConfirmDialog } from '../confirm-dialog'
import { usePortal } from '../portal-provider'
import { ActionButton, SectionHeader } from '../primitives'

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

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-input py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Send className="size-5" aria-hidden="true" />
          </span>
          <p className="font-display text-2xl">No applications yet</p>
          <ActionButton tone="ink" onClick={() => navigate('opportunities')}>
            Find a gig
            <ArrowRight aria-hidden="true" />
          </ActionButton>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map(({ app, opp }) => (
            <li key={app.id}>
              <article className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
                <img
                  src={opp!.imageUrl || '/placeholder.svg'}
                  alt=""
                  className="aspect-[16/10] w-full rounded-2xl object-cover sm:w-40"
                />
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
                          <span
                            className={cn('size-2 rounded-full', reached ? 'bg-ink' : 'bg-input')}
                            aria-hidden="true"
                          />
                          <span className={reached ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
                          {i < PIPELINE.length - 1 ? (
                            <span className="h-px w-4 bg-input sm:w-8" aria-hidden="true" />
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
              </article>
            </li>
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
