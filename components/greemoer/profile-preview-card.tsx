'use client'

import { ArrowUpRight, ImageIcon, MapPin, Plane, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DancerProfile } from '@/lib/greemoer/types'
import { Chip, Eyebrow, VerificationBadge } from './primitives'

export function ProfilePreviewCard({
  profile,
  onOpen,
  className,
}: {
  profile: DancerProfile
  onOpen?: () => void
  className?: string
}) {
  const location = [profile.city, profile.state].filter(Boolean).join(', ')
  const Wrapper = onOpen ? 'button' : 'div'

  return (
    <Wrapper
      {...(onOpen ? { type: 'button' as const, onClick: onOpen } : {})}
      className={cn(
        'group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left transition-shadow outline-none',
        onOpen && 'hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      aria-label={onOpen ? `Open ${profile.stageName}'s profile` : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl || '/placeholder.svg'}
            alt={`Portrait of ${profile.stageName}`}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="size-8" aria-hidden="true" />
            <span className="text-sm">Add a profile photo</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <VerificationBadge status={profile.verification} className="bg-card/95 backdrop-blur" />
        </div>
        {onOpen ? (
          <span className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-card/95 text-foreground backdrop-blur transition-transform group-hover:rotate-45">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-2 rounded-full',
                profile.openToBookings ? 'bg-emerald-600' : 'bg-muted-foreground/40',
              )}
              aria-hidden="true"
            />
            <Eyebrow>{profile.openToBookings ? 'Open to bookings' : 'Not taking bookings'}</Eyebrow>
          </div>
          <h3 className="font-display text-3xl leading-none">{profile.stageName || 'Your stage name'}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {profile.tagline || 'Add a one-line tagline that describes your work.'}
          </p>
        </div>

        {profile.danceStyles.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Dance styles">
            {profile.danceStyles.map((s) => (
              <li key={s.style}>
                <Chip tone={s.level === 'Primary' ? 'ink' : 'outline'}>{s.style}</Chip>
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="grid grid-cols-1 gap-2.5 border-t border-border pt-5 text-sm">
          <MetaRow icon={MapPin} label="Location" value={location || 'Location not set'} />
          <MetaRow icon={UserRound} label="Performer type" value={profile.performerType ?? 'Not set'} />
          <MetaRow icon={Plane} label="Travel" value={profile.travel ?? 'Not set'} />
        </dl>
      </div>
    </Wrapper>
  )
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
