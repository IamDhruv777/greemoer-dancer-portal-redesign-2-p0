'use client'

import { Menu } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { PortalProvider, usePortal } from './portal-provider'
import { Avatar, SidebarIdentity, SidebarNav, Wordmark } from './sidebar'
import { Toaster } from './toaster'
import { ApplicationsView } from './views/applications-view'
import { DanceStylesView } from './views/dance-styles-view'
import { DashboardView } from './views/dashboard-view'
import { OpportunitiesView } from './views/opportunities-view'
import { OpportunityDetailView } from './views/opportunity-detail-view'
import { PortfolioView } from './views/portfolio-view'
import { ProfileView } from './views/profile-view'
import { SettingsView } from './views/settings-view'

const noopSubscribe = () => () => {}

export function GreemoerPortal() {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  if (!isClient) {
    return <div className="min-h-dvh bg-background" aria-busy="true" />
  }

  return (
    <PortalProvider>
      <PortalLayout />
      <Toaster />
    </PortalProvider>
  )
}

function PortalLayout() {
  const { profile, navigate } = usePortal()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh md:pl-[76px] lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col bg-sidebar px-3 py-6 text-sidebar-foreground md:flex lg:w-64 lg:px-4">
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          className="mb-10 flex h-10 items-center rounded-lg px-3 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring md:justify-center lg:justify-start"
          aria-label="Greemoer dashboard"
        >
          <span className="hidden lg:inline">
            <Wordmark />
          </span>
          <span className="lg:hidden">
            <Wordmark compact />
          </span>
        </button>
        <p className="mb-3 hidden px-3 text-[11px] tracking-[0.18em] text-ink-muted uppercase lg:block">
          Dancer portal
        </p>
        <div className="flex-1">
          <SidebarNav collapsible />
        </div>
        <SidebarIdentity collapsible />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => navigate('dashboard')} aria-label="Greemoer dashboard">
          <Wordmark />
        </button>
        <button
          type="button"
          onClick={() => navigate('profile')}
          aria-label="Open my profile"
          className="rounded-full"
        >
          <Avatar src={profile.photoUrl} name={profile.stageName} className="size-9" />
        </button>
      </header>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen} title="Navigation" variant="drawer">
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-8 px-3">
            <Wordmark />
          </div>
          <div className="flex-1">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
          <SidebarIdentity />
        </div>
      </Dialog>

      <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 lg:py-12">
        <ActiveView />
      </main>
    </div>
  )
}

function ActiveView() {
  const { route } = usePortal()

  if (route.view === 'opportunities' && route.opportunityId) {
    return <OpportunityDetailView opportunityId={route.opportunityId} />
  }

  switch (route.view) {
    case 'profile':
      return <ProfileView />
    case 'portfolio':
      return <PortfolioView />
    case 'styles':
      return <DanceStylesView />
    case 'opportunities':
      return <OpportunitiesView />
    case 'applications':
      return <ApplicationsView />
    case 'settings':
      return <SettingsView />
    default:
      return <DashboardView />
  }
}
