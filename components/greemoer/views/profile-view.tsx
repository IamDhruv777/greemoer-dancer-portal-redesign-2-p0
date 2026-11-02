'use client'

import { Camera, Check, ChevronRight, Loader2 } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { uploadProfilePhoto } from '@/lib/greemoer/api'
import { calculateProfileCompletion, MIN_BIO_LENGTH } from '@/lib/greemoer/profile-completion'
import {
  PERFORMER_TYPES,
  TRAVEL_OPTIONS,
  type DancerProfile,
  type PerformerType,
  type TravelWillingness,
} from '@/lib/greemoer/types'
import { usePortal } from '../portal-provider'
import { ProfilePreviewCard } from '../profile-preview-card'
import {
  ActionButton,
  CompletionBar,
  Field,
  Panel,
  SectionHeader,
  SelectInput,
  TextArea,
  TextInput,
} from '../primitives'

const LANGUAGES = [
  'Hindi',
  'English',
  'Marathi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Gujarati',
  'Punjabi',
]

export function ProfileView() {
  const { profile, portfolio, updateProfile, notify, navigate } = usePortal()
  const [draft, setDraft] = useState<DancerProfile>(profile)
  const [saving, setSaving] = useState(false)

  const completion = calculateProfileCompletion(draft, portfolio)
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile)
  const set = <K extends keyof DancerProfile>(key: K, value: DancerProfile[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSave = async (event?: FormEvent) => {
    event?.preventDefault()
    setSaving(true)
    try {
      await updateProfile(draft)
      notify('Profile saved.')
    } finally {
      setSaving(false)
    }
  }

  const focusField = (fieldId?: string, view?: typeof completion.checks[number]['view']) => {
    if (view && view !== 'profile') {
      navigate(view)
      return
    }
    if (!fieldId) return
    const el = document.getElementById(fieldId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.focus({ preventScroll: true })
  }

  return (
    <div className="flex flex-col gap-10 pb-24">
      <SectionHeader
        as="h1"
        eyebrow="My profile"
        title="Your artist profile"
        description="This is what event planners, brands and production houses see when they shortlist performers."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form id="profile-form" onSubmit={handleSave} className="flex flex-col gap-6" noValidate>
          <FormSection title="Identity" description="Your name, photo and how you introduce yourself.">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-muted">
                {draft.photoUrl ? (
                  <img src={draft.photoUrl || '/placeholder.svg'} alt="Current profile photo" className="size-full object-cover" />
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="field-photo"
                  className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                >
                  <Camera className="size-4" aria-hidden="true" />
                  {draft.photoUrl ? 'Change photo' : 'Upload photo'}
                  <input
                    id="field-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) set('photoUrl', await uploadProfilePhoto(file))
                    }}
                  />
                </label>
                <p className="text-xs text-muted-foreground">Square headshot, at least 800px. JPG, PNG or WebP.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="field-fullName" label="Full name">
                <TextInput
                  id="field-fullName"
                  value={draft.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field id="field-stageName" label="Stage name" hint="Shown on your public profile.">
                <TextInput
                  id="field-stageName"
                  value={draft.stageName}
                  onChange={(e) => set('stageName', e.target.value)}
                />
              </Field>
            </div>

            <Field id="field-tagline" label="Tagline" hint={`${draft.tagline.length}/120`}>
              <TextInput
                id="field-tagline"
                value={draft.tagline}
                maxLength={120}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="e.g. Kathak soloist for stage and screen"
              />
            </Field>

            <Field
              id="field-bio"
              label="Artist bio"
              hint={
                draft.bio.trim().length < MIN_BIO_LENGTH
                  ? `${MIN_BIO_LENGTH - draft.bio.trim().length} more characters to complete this section`
                  : `${draft.bio.length}/1000`
              }
            >
              <TextArea
                id="field-bio"
                value={draft.bio}
                maxLength={1000}
                rows={6}
                onChange={(e) => set('bio', e.target.value)}
                placeholder="Your training, signature work and the kind of performances you love."
              />
            </Field>
          </FormSection>

          <FormSection title="Performer details" description="Helps us match you to the right briefs.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="field-performerType" label="Performer type">
                <SelectInput
                  id="field-performerType"
                  value={draft.performerType ?? ''}
                  onChange={(e) => set('performerType', (e.target.value || null) as PerformerType | null)}
                >
                  <option value="">Select one</option>
                  {PERFORMER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field id="field-experienceYears" label="Years of experience">
                <TextInput
                  id="field-experienceYears"
                  inputMode="numeric"
                  value={draft.experienceYears ?? ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 2)
                    set('experienceYears', digits ? Number(digits) : null)
                  }}
                  placeholder="e.g. 8"
                />
              </Field>
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 text-sm font-medium">Languages you work in</legend>
              <div id="field-languages" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                {LANGUAGES.map((lang) => {
                  const selected = draft.languages.includes(lang)
                  return (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        set(
                          'languages',
                          selected ? draft.languages.filter((l) => l !== lang) : [...draft.languages, lang],
                        )
                      }
                      className={cn(
                        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors',
                        selected
                          ? 'border-ink bg-ink text-ink-foreground'
                          : 'border-border hover:bg-muted',
                      )}
                    >
                      {selected ? <Check className="size-3.5" aria-hidden="true" /> : null}
                      {lang}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 px-4 py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Dance styles</span>
                <span className="text-xs text-muted-foreground">
                  {draft.danceStyles.map((s) => s.style).join(', ') || 'None selected'}
                </span>
              </div>
              <ActionButton tone="outline" size="sm" onClick={() => navigate('styles')}>
                Manage
              </ActionButton>
            </div>
          </FormSection>

          <FormSection title="Location & bookings" description="Where you're based and what you typically charge.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="field-city" label="City">
                <TextInput
                  id="field-city"
                  value={draft.city}
                  onChange={(e) => set('city', e.target.value)}
                  autoComplete="address-level2"
                />
              </Field>
              <Field id="field-state" label="State">
                <TextInput
                  id="field-state"
                  value={draft.state}
                  onChange={(e) => set('state', e.target.value)}
                  autoComplete="address-level1"
                />
              </Field>
              <Field id="field-travel" label="Willing to travel">
                <SelectInput
                  id="field-travel"
                  value={draft.travel ?? ''}
                  onChange={(e) => set('travel', (e.target.value || null) as TravelWillingness | null)}
                >
                  <option value="">Select one</option>
                  {TRAVEL_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field id="field-baseRate" label="Starting rate (INR)" hint="Per performance. Only shared with bookers.">
                <TextInput
                  id="field-baseRate"
                  inputMode="numeric"
                  value={draft.baseRate ?? ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 7)
                    set('baseRate', digits ? Number(digits) : null)
                  }}
                  placeholder="e.g. 25000"
                />
              </Field>
            </div>
            <Field id="field-instagram" label="Instagram" hint="Optional">
              <TextInput
                id="field-instagram"
                value={draft.instagram}
                onChange={(e) => set('instagram', e.target.value)}
                placeholder="@yourhandle"
              />
            </Field>
          </FormSection>
        </form>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <Panel className="flex flex-col gap-4 p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl">Profile strength</h2>
              <span className="font-display text-3xl tabular-nums">{completion.percent}%</span>
            </div>
            <CompletionBar percent={completion.percent} />
            <ul className="flex flex-col">
              {completion.checks.map((check) => (
                <li key={check.id}>
                  <button
                    type="button"
                    onClick={() => focusField(check.fieldId, check.view)}
                    className="group flex w-full items-center gap-3 rounded-lg py-2 text-left text-sm hover:bg-muted/60"
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full',
                        check.complete ? 'bg-ink text-ink-foreground' : 'border border-input',
                      )}
                    >
                      {check.complete ? <Check className="size-3" aria-hidden="true" /> : null}
                    </span>
                    <span className={cn('flex-1', check.complete && 'text-muted-foreground')}>
                      {check.label}
                      <span className="sr-only">{check.complete ? ' — complete' : ' — incomplete'}</span>
                    </span>
                    {!check.complete ? (
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <div className="hidden lg:block">
            <ProfilePreviewCard profile={draft} />
          </div>
        </aside>
      </div>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur transition-transform md:left-[76px] lg:left-64',
          dirty ? 'translate-y-0' : 'translate-y-full',
        )}
        aria-hidden={!dirty}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 lg:px-12">
          <p className="text-sm text-muted-foreground">You have unsaved changes</p>
          <div className="flex gap-2">
            <ActionButton tone="ghost" onClick={() => setDraft(profile)} tabIndex={dirty ? 0 : -1}>
              Discard
            </ActionButton>
            <ActionButton tone="ink" type="submit" form="profile-form" disabled={saving} tabIndex={dirty ? 0 : -1}>
              {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              Save profile
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Panel className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Panel>
  )
}
