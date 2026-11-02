import { Sparkle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: string[]
  className?: string
  itemClassName?: string
}) {
  const loop = [...items, ...items]
  return (
    <div
      className={cn(
        'marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      <ul className="marquee-track" aria-label={items.join(', ')}>
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className={cn('flex shrink-0 items-center gap-6 pr-6 font-display text-5xl md:text-7xl', itemClassName)}
          >
            <span>{item}</span>
            <Sparkle className="size-6 shrink-0 fill-brand text-brand" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  )
}
