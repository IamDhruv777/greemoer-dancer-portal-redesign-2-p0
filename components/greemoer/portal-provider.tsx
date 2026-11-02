'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import * as api from '@/lib/greemoer/api'
import {
  mockApplications,
  mockOpportunities,
  mockPortfolio,
  mockProfile,
} from '@/lib/greemoer/mock-data'
import {
  calculateProfileCompletion,
  type CompletionResult,
} from '@/lib/greemoer/profile-completion'
import type {
  Application,
  DancerProfile,
  Opportunity,
  PortalRoute,
  PortalView,
  PortfolioItem,
} from '@/lib/greemoer/types'

const VIEWS: PortalView[] = [
  'dashboard',
  'profile',
  'portfolio',
  'styles',
  'opportunities',
  'applications',
  'settings',
]

function parseHash(hash: string): PortalRoute {
  const [view, id] = hash.replace(/^#\/?/, '').split('/')
  if (view === 'opportunities' && id) return { view: 'opportunities', opportunityId: id }
  if (VIEWS.includes(view as PortalView)) return { view: view as PortalView }
  return { view: 'dashboard' }
}

function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export interface Toast {
  id: number
  message: string
}

interface PortalContextValue {
  route: PortalRoute
  navigate: (view: PortalView, opportunityId?: string, focusFieldId?: string) => void
  profile: DancerProfile
  updateProfile: (next: DancerProfile) => Promise<void>
  portfolio: PortfolioItem[]
  addPortfolioItem: (item: PortfolioItem) => Promise<void>
  updatePortfolioItem: (item: PortfolioItem) => Promise<void>
  removePortfolioItem: (id: string) => Promise<void>
  opportunities: Opportunity[]
  applications: Application[]
  applyToOpportunity: (input: { opportunityId: string; note: string; quote: number | null }) => Promise<void>
  withdrawApplication: (id: string) => Promise<void>
  completion: CompletionResult
  toasts: Toast[]
  notify: (message: string) => void
  dismissToast: (id: number) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  )
  const route = useMemo(() => parseHash(hash), [hash])

  const [profile, setProfile] = useState<DancerProfile>(mockProfile)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(mockPortfolio)
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message: string) => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current.slice(-2), { id, message }])
      window.setTimeout(() => dismissToast(id), 3500)
    },
    [dismissToast],
  )

  const navigate = useCallback(
    (view: PortalView, opportunityId?: string, focusFieldId?: string) => {
      window.location.hash = opportunityId ? `/${view}/${opportunityId}` : `/${view}`
      window.scrollTo({ top: 0 })
      if (focusFieldId) {
        window.setTimeout(() => {
          const el = document.getElementById(focusFieldId)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el?.focus({ preventScroll: true })
        }, 80)
      }
    },
    [],
  )

  const updateProfile = useCallback(async (next: DancerProfile) => {
    setProfile(await api.saveDancerProfile(next))
  }, [])

  const addPortfolioItem = useCallback(async (item: PortfolioItem) => {
    const saved = await api.savePortfolioItem(item)
    setPortfolio((current) => [saved, ...current])
  }, [])

  const updatePortfolioItem = useCallback(async (item: PortfolioItem) => {
    const saved = await api.savePortfolioItem(item)
    setPortfolio((current) => current.map((p) => (p.id === saved.id ? saved : p)))
  }, [])

  const removePortfolioItem = useCallback(async (id: string) => {
    await api.deletePortfolioItem(id)
    setPortfolio((current) => current.filter((p) => p.id !== id))
  }, [])

  const applyToOpportunity = useCallback(
    async (input: { opportunityId: string; note: string; quote: number | null }) => {
      const created = await api.submitApplication(input)
      setApplications((current) => [created, ...current])
    },
    [],
  )

  const withdrawApplication = useCallback(async (id: string) => {
    await api.withdrawApplication(id)
    setApplications((current) => current.filter((a) => a.id !== id))
  }, [])

  const completion = useMemo(
    () => calculateProfileCompletion(profile, portfolio),
    [profile, portfolio],
  )

  const value: PortalContextValue = {
    route,
    navigate,
    profile,
    updateProfile,
    portfolio,
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
    opportunities: mockOpportunities,
    applications,
    applyToOpportunity,
    withdrawApplication,
    completion,
    toasts,
    notify,
    dismissToast,
  }

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}
