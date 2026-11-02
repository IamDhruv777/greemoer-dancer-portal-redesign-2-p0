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
import { motion } from 'motion/react'
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
      <span className="relative inline-flex size-1.5" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-brand [animation:ping-ring_2.2s_ease-out_infinite]" />
        <span className="relative size-1.5 rounded-full bg-brand" />
      </span>
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
                  'group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition-all duration-300 outline-none hover:translate-x-0.5 focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  collapsible && 'md:justify-center md:px-0 lg:justify-start lg:px-3 md:hover:translate-x-0',
                  active
                    ? 'text-sidebar-foreground'
                    : 'text-ink-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={`${collapsible ? 'rail' : 'drawer'}-nav-pill`}
                    className="absolute inset-0 rounded-xl bg-sidebar-accent shadow-[inset_0_0_0_1px_rgb(255_199_44/0.25),0_0_24px_-6px_rgb(255_199_44/0.35)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
                  </motion.span>
                ) : null}
                <span className="relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className={cn('size-[18px]', active && 'text-brand')} aria-hidden="true" />
                </span>
                <span className={cn('relative flex-1 text-left', collapsible && 'md:sr-only lg:not-sr-only lg:relative')}>
                  {label}
                </span>
                {count ? (
                  <span
                    className={cn(
                      'relative rounded-full px-1.5 text-[11px] tabular-nums',
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
      <span className="relative inline-flex shrink-0 rounded-full p-[2px]">
        <span
          className="absolute inset-0 rounded-full [animation:spin-slow_6s_linear_infinite]"
          style={{ background: 'conic-gradient(from 0deg, var(--brand), transparent 55%, var(--brand))' }}
          aria-hidden="true"
        />
        <Avatar src={profile.photoUrl} name={profile.stageName} className="relative size-10 ring-2 ring-sidebar" />
      </span>
      <span className={cn('flex min-w-0 flex-1 flex-col gap-1.5', collapsible && 'md:hidden lg:flex')}>
        <span className="truncate text-sm font-medium text-sidebar-foreground">{profile.stageName}</span>
        <span className="flex items-center gap-2">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-brand to-[#ffa62c] shadow-[0_0_10px_var(--brand)] transition-[width] duration-1000"
              style={{ width: `${completion.percent}%` }}
            />
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
