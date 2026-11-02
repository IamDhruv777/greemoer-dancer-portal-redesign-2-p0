'use client'

import { Check, X } from 'lucide-react'
import { usePortal } from './portal-provider'

export function Toaster() {
  const { toasts, dismissToast } = usePortal()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 md:right-6 md:left-auto md:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm animate-in items-center gap-3 rounded-2xl bg-ink py-3 pr-2 pl-4 text-sm text-ink-foreground shadow-xl fade-in slide-in-from-bottom-2"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          <p className="flex-1 text-pretty">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="inline-flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-white/10 hover:text-ink-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
