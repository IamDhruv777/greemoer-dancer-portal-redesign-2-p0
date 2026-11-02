'use client'

import { Dialog } from '@/components/ui/dialog'
import { ActionButton } from './primitives'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <ActionButton tone="outline" onClick={() => onOpenChange(false)}>
            Keep it
          </ActionButton>
          <ActionButton
            tone="danger"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </ActionButton>
        </>
      }
    />
  )
}
