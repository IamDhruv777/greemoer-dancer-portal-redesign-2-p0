'use client'

import { CometCard } from '@/components/ui/comet-card'
import { usePortal } from './portal-provider'
import { Eyebrow } from './primitives'

export function ArtistPass() {
  const { profile, portfolio } = usePortal()
  const image = profile.photoUrl || portfolio[0]?.thumbnailUrl || '/placeholder.svg'
  const passCode = profile.stageName
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, 'X')

  return (
    <section
      aria-labelledby="pass-heading"
      className="flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-ink-foreground"
    >
      <div className="flex flex-col items-center gap-2">
        <Eyebrow className="text-brand">Artist pass</Eyebrow>
        <h2 id="pass-heading" className="font-display text-3xl leading-none">
          Your pass for every booker
        </h2>
        <p className="max-w-md text-sm text-ink-foreground/70 text-pretty">
          Move your cursor over the pass. This is the card shared with planners when you are shortlisted.
        </p>
      </div>
      <CometCard>
        <div
          role="img"
          aria-label={`${profile.stageName} artist pass`}
          className="my-10 flex w-72 flex-col items-stretch rounded-[16px] bg-[#1F2121] p-2 text-left saturate-0 md:p-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="mx-2 flex-1">
            <div className="relative mt-2 aspect-[3/4] w-full">
              <img
                loading="lazy"
                className="absolute inset-0 size-full rounded-[16px] bg-black object-cover contrast-75"
                alt=""
                src={image}
                style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 5px 6px 0px' }}
              />
            </div>
          </div>
          <div className="mt-2 flex shrink-0 items-center justify-between p-4 font-mono text-white">
            <div className="text-xs">{profile.stageName}</div>
            <div className="text-xs text-gray-300 opacity-50">#{passCode}</div>
          </div>
        </div>
      </CometCard>
    </section>
  )
}
