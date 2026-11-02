'use client'

import { Plus, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MIN_PORTFOLIO_ITEMS } from '@/lib/greemoer/profile-completion'
import type { DanceStyle, PortfolioItem } from '@/lib/greemoer/types'
import { ConfirmDialog } from './confirm-dialog'
import { PortfolioCard } from './portfolio-card'
import { PortfolioItemDialog } from './portfolio-item-dialog'
import { usePortal } from './portal-provider'
import { ActionButton } from './primitives'

type DialogState = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; item: PortfolioItem }

export function usePortfolioDialogs() {
  const { profile, addPortfolioItem, updatePortfolioItem, removePortfolioItem, notify } = usePortal()
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [dialogKey, setDialogKey] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<PortfolioItem | null>(null)

  const defaultStyle: DanceStyle = profile.danceStyles[0]?.style ?? 'Contemporary'

  const openAdd = () => {
    setDialogKey((k) => k + 1)
    setDialog({ mode: 'add' })
  }
  const openEdit = (item: PortfolioItem) => {
    setDialogKey((k) => k + 1)
    setDialog({ mode: 'edit', item })
  }

  const dialogs = (
    <>
      <PortfolioItemDialog
        key={dialogKey}
        open={dialog.mode !== 'closed'}
        onOpenChange={(open) => !open && setDialog({ mode: 'closed' })}
        item={dialog.mode === 'edit' ? dialog.item : null}
        defaultStyle={defaultStyle}
        onSubmit={async (item) => {
          if (dialog.mode === 'edit') {
            await updatePortfolioItem(item)
            notify(`"${item.title}" updated.`)
          } else {
            await addPortfolioItem(item)
            notify(`"${item.title}" added to your portfolio.`)
          }
        }}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this performance?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from your public profile and from any applications you send next.`
            : ''
        }
        confirmLabel="Remove performance"
        onConfirm={async () => {
          if (!pendingDelete) return
          const title = pendingDelete.title
          await removePortfolioItem(pendingDelete.id)
          notify(`"${title}" removed.`)
        }}
      />
    </>
  )

  return { openAdd, openEdit, requestDelete: setPendingDelete, dialogs }
}

export function PortfolioGrid({
  items,
  onEdit,
  onDelete,
  onAdd,
  layout = 'grid',
}: {
  items: PortfolioItem[]
  onEdit: (item: PortfolioItem) => void
  onDelete: (item: PortfolioItem) => void
  onAdd: () => void
  layout?: 'grid' | 'feature'
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-input px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl">Your stage starts here</p>
          <p className="max-w-sm text-sm text-muted-foreground text-pretty">
            Add at least {MIN_PORTFOLIO_ITEMS} performances. Bookers watch your work before they read your bio.
          </p>
        </div>
        <ActionButton tone="ink" onClick={onAdd}>
          <Plus aria-hidden="true" />
          Upload your first performance
        </ActionButton>
      </div>
    )
  }

  return (
    <ul
      className={cn(
        'grid gap-x-5 gap-y-8',
        layout === 'feature'
          ? 'sm:grid-cols-2 lg:grid-cols-3 sm:[&>li:first-child]:row-span-2'
          : 'sm:grid-cols-2 xl:grid-cols-3',
      )}
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex flex-col">
          <PortfolioCard
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            featured={layout === 'feature' && index === 0}
          />
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onAdd}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-input text-sm text-muted-foreground transition-colors outline-none hover:border-ink hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          Add a performance
        </button>
      </li>
    </ul>
  )
}
