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
import { useState } from 'react'
import { DesktopSidebar, MobileSidebar, Sidebar, SidebarLink, useSidebar } from '@/components/ui/sidebar'
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

function SidebarContents({ animatePill }: { animatePill: boolean }) {
  const { open, setOpen } = useSidebar()
  const { route, navigate, applications, opportunities, profile, completion } = usePortal()
  const appliedIds = new Set(applications.map((a) => a.opportunityId))
  const openCount = opportunities.filter((o) => !appliedIds.has(o.id)).length

  const counts: Partial<Record<PortalView, number>> = {
    opportunities: openCount,
    applications: applications.length,
  }

  const go = (view: PortalView) => {
    navigate(view)
    setOpen(false)
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <button
          type="button"
          onClick={() => go('dashboard')}
          aria-label="Greemoer dashboard"
          className="mb-8 flex h-10 w-fit items-center rounded-lg px-2 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Wordmark compact={!open} />
        </button>
        {open ? (
          <p className="mb-3 px-2 text-[11px] tracking-[0.18em] text-ink-muted uppercase">Dancer portal</p>
        ) : null}
        <nav aria-label="Dancer portal" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
            const active = route.view === view
            const count = counts[view]
            return (
              <SidebarLink
                key={view}
                active={active}
                pillId={animatePill ? 'portal-nav-pill' : undefined}
                title={label}
                onClick={(event) => {
                  event.preventDefault()
                  go(view)
                }}
                link={{
                  label,
                  href: `#/${view}`,
                  icon: (
                    <Icon
                      className={cn('size-5 shrink-0 transition-colors', active ? 'text-brand' : 'text-ink-muted')}
                      aria-hidden="true"
                    />
                  ),
                }}
                badge={
                  count ? (
                    <span
                      className={cn(
                        'rounded-full px-1.5 text-[11px] tabular-nums',
                        active ? 'bg-brand text-brand-foreground' : 'bg-sidebar-accent text-ink-muted',
                      )}
                    >
                      {count}
                    </span>
                  ) : null
                }
                className={cn(
                  'rounded-xl px-2 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  !active && 'hover:bg-sidebar-accent/60',
                )}
              />
            )
          })}
        </nav>
      </div>

      <SidebarLink
        title={profile.stageName}
        onClick={(event) => {
          event.preventDefault()
          go('profile')
        }}
        className="rounded-xl px-1 hover:bg-sidebar-accent"
        badge={<span className="text-[11px] tabular-nums text-ink-muted">{completion.percent}%</span>}
        link={{
          label: profile.stageName,
          href: '#/profile',
          icon: (
            <span className="relative inline-flex shrink-0 rounded-full p-[2px]">
              <span
                className="absolute inset-0 rounded-full [animation:spin-slow_6s_linear_infinite]"
                style={{ background: 'conic-gradient(from 0deg, var(--brand), transparent 55%, var(--brand))' }}
                aria-hidden="true"
              />
              <Avatar src={profile.photoUrl} name={profile.stageName} className="relative size-7 ring-2 ring-sidebar" />
            </span>
          ),
        }}
      />
    </>
  )
}

export function PortalSidebar() {
  const [open, setOpen] = useState(false)
  const { navigate } = usePortal()

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <DesktopSidebar className="fixed inset-y-0 left-0 z-40 h-dvh justify-between gap-10 border-r border-white/5">
        <SidebarContents animatePill />
      </DesktopSidebar>
      <MobileSidebar
        barClassName="sticky top-0 z-30 h-16 border-b border-white/10 py-0"
        leading={
          <button type="button" onClick={() => navigate('dashboard')} aria-label="Greemoer dashboard" className="text-sidebar-foreground">
            <Wordmark />
          </button>
        }
        className="justify-between gap-10"
      >
        <SidebarContents animatePill={false} />
      </MobileSidebar>
    </Sidebar>
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
