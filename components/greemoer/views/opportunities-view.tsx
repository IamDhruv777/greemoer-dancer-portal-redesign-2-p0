'use client'

import { SearchX } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import type { EventType } from '@/lib/greemoer/types'
import { useApplyDialog } from '../apply-dialog'
import { matchingStyles, OpportunityCard } from '../opportunity-card'
import { usePortal } from '../portal-provider'
import { SectionHeader } from '../primitives'

type Filter = 'matched' | 'all' | EventType

export function OpportunitiesView() {
  const { opportunities, profile, applications, navigate } = usePortal()
  const apply = useApplyDialog()
  const [filter, setFilter] = useState<Filter>('all')

  const eventTypes = Array.from(new Set(opportunities.map((o) => o.eventType)))
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All gigs' },
    { id: 'matched', label: 'Matches my styles' },
    ...eventTypes.map((t) => ({ id: t as Filter, label: t })),
  ]

  const applicationByOpp = new Map(applications.map((a) => [a.opportunityId, a]))
  const visible = opportunities
    .filter((o) => {
      if (filter === 'all') return true
      if (filter === 'matched') return matchingStyles(o, profile).length > 0
      return o.eventType === filter
    })
    .sort((a, b) => a.deadline.localeCompare(b.deadline))

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        as="h1"
        eyebrow="Opportunities"
        title="Open gigs across India"
        description="Every brief is reviewed by the Greemoer team before it reaches you. Fees are the client's stated budget."
      />

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter opportunities" className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'relative h-9 shrink-0 rounded-full border px-4 text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95',
                filter === f.id
                  ? 'border-ink text-ink-foreground'
                  : 'border-border bg-card/60 text-foreground backdrop-blur hover:border-ink',
              )}
            >
              {filter === f.id ? (
                <motion.span
                  layoutId="opp-filter-pill"
                  className="absolute inset-0 rounded-full bg-ink shadow-[0_8px_24px_-8px_rgb(20_20_19/0.6)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((opp, index) => (
            <Reveal as="li" key={`${filter}-${opp.id}`} delay={(index % 3) * 0.08}>
              <OpportunityCard
                opportunity={opp}
                profile={profile}
                application={applicationByOpp.get(opp.id)}
                onOpen={() => navigate('opportunities', opp.id)}
                onApply={() => apply.openApply(opp)}
              />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-input py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-display text-2xl">No gigs in this category yet</p>
          <p className="text-sm text-muted-foreground">New briefs are added every week.</p>
        </div>
      )}

      {apply.dialog}
    </div>
  )
}
