'use client'

import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { greeting } from '@/lib/greemoer/format'
import { usePortal } from './portal-provider'
import { ActionButton, CompletionBar, Eyebrow } from './primitives'
import { Avatar } from './sidebar'

export function WelcomeHero() {
  const { profile, completion, navigate } = usePortal()
  const firstName = profile.fullName.split(' ')[0] || profile.stageName
  const primaryStyles = profile.danceStyles
    .filter((s) => s.level === 'Primary')
    .map((s) => s.style)
  const isComplete = completion.missing.length === 0
  const nextSteps = completion.missing.slice(0, 3)

  const goToCheck = (index: number) => {
    const check = completion.missing[index]
    if (check) navigate(check.view, undefined, check.fieldId)
  }

  return (
    <section
      aria-labelledby="welcome-heading"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch"
    >
      <div className="flex flex-col justify-between gap-10 py-2">
        <div className="flex items-center gap-3">
          <Avatar src={profile.photoUrl} name={profile.stageName} className="size-11 ring-2 ring-card" />
          <div className="flex flex-col">
            <Eyebrow>Greemoer dancer portal</Eyebrow>
            <span className="text-sm text-muted-foreground">
              {profile.performerType ?? 'Performer'} · {profile.city || 'India'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h1
            id="welcome-heading"
            className="font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl xl:text-7xl"
          >
            {greeting()}, <em className="italic">{firstName}.</em>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            This is where you build the profile bookers see, show your performance work and apply for
            paid gigs.{' '}
            {primaryStyles.length > 0 ? (
              <>
                We match you to briefs looking for{' '}
                <span className="text-foreground">{primaryStyles.join(' and ')}</span> performers.
              </>
            ) : (
              'Add your dance styles to start receiving matched opportunities.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton tone="ink" size="lg" onClick={() => navigate('opportunities')}>
            Browse opportunities
            <ArrowRight aria-hidden="true" />
          </ActionButton>
          <ActionButton tone="outline" size="lg" onClick={() => navigate('portfolio')}>
            Manage portfolio
          </ActionButton>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl bg-ink p-6 text-ink-foreground sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] tracking-[0.18em] text-ink-muted uppercase">Profile strength</p>
            <p className="font-display text-6xl leading-none tabular-nums">
              {completion.percent}
              <span className="text-3xl text-ink-muted">%</span>
            </p>
          </div>
          <p className="max-w-[10rem] text-right text-xs leading-relaxed text-ink-muted">
            {isComplete
              ? 'Your profile is complete and ranks first in booker searches.'
              : 'Complete profiles are shown to bookers first.'}
          </p>
        </div>

        <CompletionBar percent={completion.percent} tone="dark" />

        {isComplete ? (
          <p className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-brand" aria-hidden="true" />
            Every section is filled in.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/10" aria-label="Next steps">
            {nextSteps.map((check, index) => (
              <li key={check.id}>
                <button
                  type="button"
                  onClick={() => goToCheck(index)}
                  className="group flex w-full items-center justify-between gap-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="flex flex-col">
                    <span className="text-sm">{check.label}</span>
                    <span className="text-xs text-ink-muted">{check.hint}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-ink-muted">
                    +{check.weight}%
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <ActionButton
          tone="brand"
          size="lg"
          className="mt-auto w-full"
          onClick={() => (isComplete ? navigate('profile') : goToCheck(0))}
        >
          {isComplete ? 'View my profile' : 'Complete your profile'}
          <ArrowRight aria-hidden="true" />
        </ActionButton>
      </div>
    </section>
  )
}
