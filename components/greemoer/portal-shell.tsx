'use client'

import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useSyncExternalStore } from 'react'
import { PortalProvider, usePortal } from './portal-provider'
import { PortalSidebar } from './sidebar'
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
  const { route } = usePortal()

  return (
    <div className="min-h-dvh md:pl-[60px]">
      <PortalSidebar />

      <ScrollProgress />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 lg:py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${route.view}-${route.opportunityId ?? ''}`}
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <ActiveView />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-brand via-[#ffa62c] to-brand shadow-[0_0_12px_var(--brand)] md:left-[60px]"
      style={{ scaleX }}
    />
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
