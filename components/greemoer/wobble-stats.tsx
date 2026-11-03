'use client'

import { animate } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { WobbleCard } from '@/components/ui/wobble-card'
import { cn } from '@/lib/utils'

export type StatTone = 'ink' | 'brand' | 'graphite'

const toneClasses: Record<StatTone, { container: string; hint: string }> = {
  ink: { container: 'bg-ink text-ink-foreground', hint: 'text-ink-muted' },
  brand: { container: 'bg-brand text-brand-foreground', hint: 'text-brand-foreground/70' },
  graphite: { container: 'bg-[#2b2a27] text-ink-foreground', hint: 'text-ink-muted' },
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [value, suffix])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export type Stat = {
  label: string
  value: number | string
  suffix?: string
  hint: string
  tone: StatTone
  icon?: ReactNode
}

export function WobbleStats({ stats, label }: { stats: Stat[]; label: string }) {
  return (
    <ul aria-label={label} className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => {
        const tone = toneClasses[stat.tone]
        return (
          <Reveal as="li" key={stat.label} delay={index * 0.08}>
            <WobbleCard
              containerClassName={cn('h-full min-h-44 rounded-3xl', tone.container)}
              className="flex flex-col justify-between gap-6 py-6 sm:px-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs tracking-[0.18em] uppercase opacity-80">{stat.label}</p>
                {stat.icon ? <span aria-hidden="true">{stat.icon}</span> : null}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-6xl leading-none tabular-nums">
                  {typeof stat.value === 'number' ? <CountUp value={stat.value} suffix={stat.suffix} /> : stat.value}
                </p>
                <p className={cn('text-sm', tone.hint)}>{stat.hint}</p>
              </div>
            </WobbleCard>
          </Reveal>
        )
      })}
    </ul>
  )
}

export function WobbleEmpty({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <WobbleCard
      containerClassName="rounded-3xl bg-ink text-ink-foreground"
      className="flex flex-col items-center gap-4 py-14 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground">{icon}</span>
      <p className="font-display text-3xl">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {children}
    </WobbleCard>
  )
}
