'use client'

import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card'
import type { DanceStyleSelection } from '@/lib/greemoer/types'
import { usePortal } from './portal-provider'

const POSITIONS = [
  'top-10 left-[6%] rotate-[-5deg]',
  'top-24 left-[22%] rotate-[4deg]',
  'top-8 left-[38%] rotate-[-3deg]',
  'top-28 left-[54%] rotate-[7deg]',
  'top-12 left-[68%] rotate-[-6deg]',
  'top-32 left-[78%] rotate-[3deg]',
]

export function StyleBoard({ selected }: { selected: DanceStyleSelection[] }) {
  const { portfolio, opportunities } = usePortal()
  const images = [
    ...portfolio.map((p) => p.thumbnailUrl),
    ...opportunities.map((o) => o.imageUrl),
  ].filter((src): src is string => Boolean(src))

  return (
    <section aria-labelledby="board-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="board-heading" className="font-display text-2xl">
          Your style board
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag the cards to arrange your selected styles. Primary styles are tagged.
        </p>
      </div>
      <DraggableCardContainer className="relative min-h-[34rem] w-full overflow-clip rounded-3xl bg-ink">
        {selected.length === 0 ? (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-ink-foreground/60">
            Select a style above to pin it to your board.
          </p>
        ) : (
          <p
            aria-hidden="true"
            className="absolute top-1/2 mx-auto w-full -translate-y-1/2 px-6 text-center font-display text-4xl text-ink-foreground/10 md:text-6xl"
          >
            Move like nobody is booking you.
          </p>
        )}
        {selected.map((item, index) => (
          <DraggableCardBody
            key={item.style}
            className={`absolute min-h-0 w-56 p-3 ${POSITIONS[index % POSITIONS.length]}`}
          >
            <img
              src={images[index % Math.max(images.length, 1)] || '/placeholder.svg'}
              alt=""
              className="pointer-events-none relative z-10 aspect-square w-full rounded-sm object-cover"
              draggable={false}
            />
            <h3 className="mt-3 text-center font-display text-2xl text-neutral-800 dark:text-neutral-200">
              {item.style}
            </h3>
            <p className="mt-1 text-center text-xs tracking-widest text-neutral-500 uppercase">
              {item.level}
            </p>
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
    </section>
  )
}
