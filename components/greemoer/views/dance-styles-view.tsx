'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  DANCE_STYLES,
  type DanceStyle,
  type DanceStyleSelection,
  type StyleLevel,
} from '@/lib/greemoer/types'
import { usePortal } from '../portal-provider'
import { ActionButton, SectionHeader } from '../primitives'

const MAX_STYLES = 6
const CLASSICAL: DanceStyle[] = ['Bharatanatyam', 'Kathak', 'Odissi', 'Kuchipudi', 'Mohiniyattam', 'Semi-classical']
const FOLK: DanceStyle[] = ['Bhangra', 'Garba', 'Folk']

const GROUPS: { label: string; styles: DanceStyle[] }[] = [
  { label: 'Indian classical', styles: CLASSICAL },
  { label: 'Indian folk', styles: FOLK },
  {
    label: 'Commercial & global',
    styles: DANCE_STYLES.filter((s) => !CLASSICAL.includes(s) && !FOLK.includes(s)),
  },
]

export function DanceStylesView() {
  const { profile, updateProfile, notify } = usePortal()
  const [selected, setSelected] = useState<DanceStyleSelection[]>(profile.danceStyles)

  const dirty = JSON.stringify(selected) !== JSON.stringify(profile.danceStyles)
  const atLimit = selected.length >= MAX_STYLES
  const hasPrimary = selected.some((s) => s.level === 'Primary')

  const toggle = (style: DanceStyle) => {
    setSelected((current) =>
      current.some((s) => s.style === style)
        ? current.filter((s) => s.style !== style)
        : current.length >= MAX_STYLES
          ? current
          : [...current, { style, level: current.length === 0 ? 'Primary' : 'Secondary' }],
    )
  }

  const setLevel = (style: DanceStyle, level: StyleLevel) => {
    setSelected((current) => current.map((s) => (s.style === style ? { ...s, level } : s)))
  }

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        as="h1"
        eyebrow="Dance styles"
        title="What do you perform?"
        description={`Choose up to ${MAX_STYLES} styles. Mark your strongest as Primary — those drive the opportunities we match you with.`}
        action={
          <>
            <ActionButton tone="ghost" disabled={!dirty} onClick={() => setSelected(profile.danceStyles)}>
              Reset
            </ActionButton>
            <ActionButton
              tone="ink"
              disabled={!dirty || !hasPrimary}
              onClick={async () => {
                await updateProfile({ ...profile, danceStyles: selected })
                notify('Dance styles updated.')
              }}
            >
              Save styles
            </ActionButton>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="tabular-nums">
          {selected.length}/{MAX_STYLES} selected
        </span>
        {!hasPrimary && selected.length > 0 ? (
          <span role="alert" className="text-destructive">
            Mark at least one style as Primary.
          </span>
        ) : null}
      </div>

      {GROUPS.map((group) => (
        <section key={group.label} className="flex flex-col gap-4" aria-labelledby={`group-${group.label}`}>
          <h2 id={`group-${group.label}`} className="font-display text-2xl">
            {group.label}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.styles.map((style) => {
              const selection = selected.find((s) => s.style === style)
              const isSelected = Boolean(selection)
              const disabled = !isSelected && atLimit
              return (
                <li key={style}>
                  <div
                    className={cn(
                      'flex h-full items-center justify-between gap-3 rounded-2xl border p-4 transition-colors',
                      isSelected ? 'border-ink bg-card' : 'border-border bg-card/50',
                      disabled && 'opacity-50',
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      disabled={disabled}
                      onClick={() => toggle(style)}
                      className="flex flex-1 items-center gap-3 text-left outline-none disabled:cursor-not-allowed"
                    >
                      <span
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-full',
                          isSelected ? 'bg-ink text-ink-foreground' : 'border border-input',
                        )}
                      >
                        {isSelected ? <Check className="size-3.5" aria-hidden="true" /> : null}
                      </span>
                      <span className="font-medium">{style}</span>
                    </button>
                    {selection ? (
                      <div role="group" aria-label={`${style} level`} className="flex rounded-full bg-muted p-0.5">
                        {(['Primary', 'Secondary'] as StyleLevel[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            aria-pressed={selection.level === level}
                            onClick={() => setLevel(style, level)}
                            className={cn(
                              'h-7 rounded-full px-2.5 text-xs transition-colors',
                              selection.level === level
                                ? level === 'Primary'
                                  ? 'bg-brand text-brand-foreground'
                                  : 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
