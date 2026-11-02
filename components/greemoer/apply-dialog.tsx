'use client'

import { Check, Loader2 } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { formatFeeRange } from '@/lib/greemoer/format'
import type { Opportunity } from '@/lib/greemoer/types'
import { usePortal } from './portal-provider'
import { ActionButton, Field, TextArea, TextInput } from './primitives'

const MIN_NOTE = 30

export function ApplyDialog({
  opportunity,
  open,
  onOpenChange,
}: {
  opportunity: Opportunity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { profile, portfolio, applyToOpportunity, notify } = usePortal()
  const formId = useId()
  const [note, setNote] = useState('')
  const [quote, setQuote] = useState(
    String(profile.baseRate ?? opportunity?.feeMin ?? ''),
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!opportunity) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (note.trim().length < MIN_NOTE) {
      setError(`Write at least ${MIN_NOTE} characters so the booker knows why you are a fit.`)
      return
    }
    const quoteValue = quote ? Number(quote) : null
    if (quoteValue !== null && (!Number.isFinite(quoteValue) || quoteValue <= 0)) {
      setError('Enter your quote as a positive amount in rupees.')
      return
    }
    setSaving(true)
    try {
      await applyToOpportunity({ opportunityId: opportunity.id, note: note.trim(), quote: quoteValue })
      notify(`Application sent to ${opportunity.client}.`)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Apply for this gig"
      description={opportunity.title}
      footer={
        <>
          <ActionButton tone="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </ActionButton>
          <ActionButton tone="ink" type="submit" form={formId} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Send application
          </ActionButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="rounded-2xl bg-muted/70 p-4">
          <p className="mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Shared with {opportunity.client}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4" aria-hidden="true" />
              Your artist profile and dance styles
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4" aria-hidden="true" />
              {portfolio.length} portfolio {portfolio.length === 1 ? 'piece' : 'pieces'}
            </li>
          </ul>
        </div>

        <Field
          id={`${formId}-note`}
          label="Note to the booker"
          hint={`${note.trim().length}/${MIN_NOTE} characters minimum`}
        >
          <TextArea
            id={`${formId}-note`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Share relevant experience, availability and how you would approach this brief."
            maxLength={600}
          />
        </Field>

        <Field
          id={`${formId}-quote`}
          label="Your quote (INR)"
          hint={`Client budget: ${formatFeeRange(opportunity.feeMin, opportunity.feeMax)}`}
        >
          <TextInput
            id={`${formId}-quote`}
            inputMode="numeric"
            value={quote}
            onChange={(e) => setQuote(e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 40000"
          />
        </Field>

        {error ? (
          <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </Dialog>
  )
}

export function useApplyDialog() {
  const [target, setTarget] = useState<Opportunity | null>(null)
  const [key, setKey] = useState(0)

  const openApply = (opportunity: Opportunity) => {
    setKey((k) => k + 1)
    setTarget(opportunity)
  }

  const dialog = (
    <ApplyDialog
      key={key}
      opportunity={target}
      open={target !== null}
      onOpenChange={(open) => !open && setTarget(null)}
    />
  )

  return { openApply, dialog }
}
