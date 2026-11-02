'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MIN_PORTFOLIO_ITEMS } from '@/lib/greemoer/profile-completion'
import { PortfolioGrid, usePortfolioDialogs } from '../portfolio-manager'
import { usePortal } from '../portal-provider'
import { ActionButton, SectionHeader } from '../primitives'

type Filter = 'all' | 'video' | 'image'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'video', label: 'Videos' },
  { id: 'image', label: 'Photos' },
]

export function PortfolioView() {
  const { portfolio } = usePortal()
  const dialogs = usePortfolioDialogs()
  const [filter, setFilter] = useState<Filter>('all')

  const items = filter === 'all' ? portfolio : portfolio.filter((p) => p.mediaType === filter)
  const counts = {
    all: portfolio.length,
    video: portfolio.filter((p) => p.mediaType === 'video').length,
    image: portfolio.filter((p) => p.mediaType === 'image').length,
  }

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        as="h1"
        eyebrow="Portfolio"
        title="Your performance work"
        description={`Upload stage recordings, showreels and performance photos. Profiles with at least ${MIN_PORTFOLIO_ITEMS} pieces get significantly more booking requests.`}
        action={
          <ActionButton tone="ink" size="lg" onClick={dialogs.openAdd}>
            <Plus aria-hidden="true" />
            Upload performance
          </ActionButton>
        }
      />

      <div role="tablist" aria-label="Filter portfolio" className="flex gap-2 border-b border-border">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              '-mb-px border-b-2 px-1 pb-3 text-sm transition-colors mr-4',
              filter === f.id
                ? 'border-ink font-medium text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label} <span className="tabular-nums text-muted-foreground">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <PortfolioGrid
        items={items}
        onAdd={dialogs.openAdd}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.requestDelete}
      />

      {dialogs.dialogs}
    </div>
  )
}
