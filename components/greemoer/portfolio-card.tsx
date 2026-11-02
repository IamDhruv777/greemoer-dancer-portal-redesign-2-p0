'use client'

import { ImageIcon, Pencil, Play, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortfolioItem } from '@/lib/greemoer/types'
import { IconButton } from './primitives'

export function PortfolioCard({
  item,
  onEdit,
  onDelete,
  featured = false,
}: {
  item: PortfolioItem
  onEdit: (item: PortfolioItem) => void
  onDelete: (item: PortfolioItem) => void
  featured?: boolean
}) {
  return (
    <article className={cn('group flex flex-col gap-3', featured && 'h-full')}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-ink',
          featured ? 'aspect-[4/3] sm:aspect-auto sm:min-h-80 sm:flex-1' : 'aspect-[4/3]',
        )}
      >
        <MediaThumb item={item} />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-ink-foreground backdrop-blur">
            {item.mediaType === 'video' ? (
              <Play className="size-3 fill-current" aria-hidden="true" />
            ) : (
              <ImageIcon className="size-3" aria-hidden="true" />
            )}
            {item.mediaType === 'video' ? (item.durationLabel ?? 'Video') : 'Photo'}
          </span>
          <div className="flex gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
            <IconButton
              label={`Edit ${item.title}`}
              onClick={() => onEdit(item)}
              className="bg-card/95 text-foreground backdrop-blur hover:bg-card"
            >
              <Pencil aria-hidden="true" />
            </IconButton>
            <IconButton
              label={`Delete ${item.title}`}
              onClick={() => onDelete(item)}
              className="bg-card/95 text-destructive backdrop-blur hover:bg-card"
            >
              <Trash2 aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        {item.mediaType === 'video' ? (
          <span
            className="pointer-events-none absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform group-hover:scale-105"
            aria-hidden="true"
          >
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className={cn('font-display leading-tight', featured ? 'text-2xl' : 'text-xl')}>{item.title}</h3>
        <p className="text-xs text-muted-foreground">
          {item.danceStyle} · {item.event} · {item.year}
        </p>
      </div>
    </article>
  )
}

function MediaThumb({ item }: { item: PortfolioItem }) {
  if (item.thumbnailUrl) {
    return (
      <img
        src={item.thumbnailUrl || '/placeholder.svg'}
        alt={`${item.title} — ${item.danceStyle} performance`}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    )
  }
  if (item.mediaUrl && item.mediaType === 'video') {
    return (
      <video
        src={item.mediaUrl}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
        aria-label={`${item.title} video`}
      />
    )
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
      <ImageIcon className="size-8" aria-hidden="true" />
    </div>
  )
}
