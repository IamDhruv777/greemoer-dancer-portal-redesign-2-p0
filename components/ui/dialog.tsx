'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
  variant?: 'center' | 'drawer'
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  variant = 'center',
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            'fixed z-50 flex flex-col bg-card text-card-foreground shadow-2xl outline-none transition-all duration-200',
            variant === 'center' &&
              'top-1/2 left-1/2 max-h-[min(90dvh,760px)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0',
            variant === 'drawer' &&
              'inset-y-0 left-0 w-[min(20rem,85vw)] bg-sidebar text-sidebar-foreground data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full',
            className,
          )}
        >
          <div
            className={cn(
              'flex items-start justify-between gap-4 px-6 pt-6',
              variant === 'drawer' && 'sr-only',
            )}
          >
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="font-display text-2xl leading-tight">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-sm text-muted-foreground text-pretty">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              className="-mr-2 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className={cn('min-h-0 flex-1 overflow-y-auto', variant === 'center' && 'px-6 py-5')}>
            {children}
          </div>
          {footer ? (
            <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
