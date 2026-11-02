'use client'

import {
  Briefcase,
  Film,
  LayoutGrid,
  Music2,
  Send,
  Settings,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortalView } from '@/lib/greemoer/types'
import { usePortal } from './portal-provider'

export const NAV_ITEMS: { view: PortalView; label: string; icon: LucideIcon }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { view: 'profile', label: 'My Profile', icon: UserRound },
  { view: 'portfolio', label: 'Portfolio', icon: Film },
  { view: 'styles', label: 'Dance Styles', icon: Music2 },
  { view: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { view: 'applications', label: 'My Applications', icon: Send },
  { view: 'settings', label: 'Settings', icon: Settings },
]

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 font-display text-2xl leading-none tracking-tight">
      {compact ? 'g' : 'greemoer'}
      <span className="inline-block size-1.5 rounded-full bg-brand" aria-hidden="true" />
    </span>
  )
}

export function SidebarNav({
  collapsible = false,
  onNavigate,
}: {
  collapsible?: boolean
  onNavigate?: () => void
}) {
  const { route, navigate, applications, opportunities } = usePortal()
  const appliedIds = new Set(applications.map((a) => a.opportunityId))
  const openCount = opportunities.filter((o) => !appliedIds.has(o.id)).length

  const counts: Partial<Record<PortalView, number>> = {
    opportunities: openCount,
    applications: applications.length,
  }

  return (
    <nav aria-label="Dancer portal">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = route.view === view
          const count = counts[view]
          return (
            <li key={view}>
              <button
                type="button"
                onClick={() => {
                  navigate(view)
                  onNavigate?.()
                }}
                aria-current={active ? 'page' : undefined}
                title={collapsible ? label : undefined}
                className={cn(
                  'group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  collapsible && 'md:justify-center md:px-0 lg:justify-start lg:px-3',
                  active
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-ink-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                )}
              >
                <span className="relative">
                  <Icon className="size-[18px]" aria-hidden="true" />
                  {active ? (
                    <span
                      className="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className={cn('flex-1 text-left', collapsible && 'md:sr-only lg:not-sr-only')}>
                  {label}
                </span>
                {count ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[11px] tabular-nums',
                      active ? 'bg-brand text-brand-foreground' : 'bg-sidebar-accent text-ink-muted',
                      collapsible && 'md:hidden lg:inline',
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SidebarIdentity({ collapsible = false }: { collapsible?: boolean }) {
  const { profile, completion, navigate } = usePortal()
  return (
    <button
      type="button"
      onClick={() => navigate('profile')}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        collapsible && 'md:justify-center lg:justify-start',
      )}
    >
      <Avatar src={profile.photoUrl} name={profile.stageName} className="size-10" />
      <span className={cn('flex min-w-0 flex-1 flex-col gap-1.5', collapsible && 'md:hidden lg:flex')}>
        <span className="truncate text-sm font-medium text-sidebar-foreground">{profile.stageName}</span>
        <span className="flex items-center gap-2">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${completion.percent}%` }} />
          </span>
          <span className="text-[11px] tabular-nums text-ink-muted">{completion.percent}%</span>
        </span>
      </span>
    </button>
  )
}

export function Avatar({
  src,
  name,
  className,
}: {
  src: string | null
  name: string
  className?: string
}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-medium text-brand-foreground',
        className,
      )}
    >
      {src ? (
        <img src={src || '/placeholder.svg'} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  )
}
