'use client'

import { ArrowRight, Plus } from 'lucide-react'
import { daysUntil } from '@/lib/greemoer/format'
import { useApplyDialog } from '../apply-dialog'
import { matchingStyles, OpportunityCard } from '../opportunity-card'
import { PortfolioGrid, usePortfolioDialogs } from '../portfolio-manager'
import { usePortal } from '../portal-provider'
import { ProfilePreviewCard } from '../profile-preview-card'
import { ActionButton, Eyebrow, SectionHeader } from '../primitives'
import { WelcomeHero } from '../welcome-hero'

export function DashboardView() {
  const { profile, portfolio, opportunities, applications, navigate } = usePortal()
  const portfolioDialogs = usePortfolioDialogs()
  const apply = useApplyDialog()

  const applicationByOpp = new Map(applications.map((a) => [a.opportunityId, a]))
  const recommended = opportunities
    .filter((o) => daysUntil(o.deadline) >= 0)
    .sort((a, b) => {
      const matchDiff = matchingStyles(b, profile).length - matchingStyles(a, profile).length
      return matchDiff !== 0 ? matchDiff : a.deadline.localeCompare(b.deadline)
    })
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <WelcomeHero />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <section aria-labelledby="preview-heading" className="flex flex-col gap-5 lg:col-span-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>How bookers see you</Eyebrow>
              <h2 id="preview-heading" className="font-display text-3xl leading-none">
                Artist profile
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('profile')}
              className="text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              Edit
            </button>
          </div>
          <ProfilePreviewCard profile={profile} onOpen={() => navigate('profile')} />
        </section>

        <section aria-labelledby="portfolio-heading" className="flex flex-col gap-5 lg:col-span-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{portfolio.length} pieces</Eyebrow>
              <h2 id="portfolio-heading" className="font-display text-3xl leading-none">
                Performance portfolio
              </h2>
            </div>
            <div className="flex gap-2">
              <ActionButton tone="outline" size="sm" onClick={() => navigate('portfolio')}>
                View all
              </ActionButton>
              <ActionButton tone="ink" size="sm" onClick={portfolioDialogs.openAdd}>
                <Plus aria-hidden="true" />
                Upload
              </ActionButton>
            </div>
          </div>
          <PortfolioGrid
            items={portfolio.slice(0, 4)}
            layout="feature"
            onAdd={portfolioDialogs.openAdd}
            onEdit={portfolioDialogs.openEdit}
            onDelete={portfolioDialogs.requestDelete}
          />
        </section>
      </div>

      <section aria-labelledby="opps-heading" className="flex flex-col gap-6">
        <SectionHeader
          eyebrow="Recommended opportunities"
          title="Gigs matched to your styles"
          description="Briefs from event planners, brands and production houses, ranked by how well they fit your profile."
          action={
            <ActionButton tone="outline" onClick={() => navigate('opportunities')}>
              See all opportunities
              <ArrowRight aria-hidden="true" />
            </ActionButton>
          }
        />
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((opp) => (
            <li key={opp.id}>
              <OpportunityCard
                opportunity={opp}
                profile={profile}
                application={applicationByOpp.get(opp.id)}
                onOpen={() => navigate('opportunities', opp.id)}
                onApply={() => apply.openApply(opp)}
              />
            </li>
          ))}
        </ul>
      </section>

      {portfolioDialogs.dialogs}
      {apply.dialog}
    </div>
  )
}
