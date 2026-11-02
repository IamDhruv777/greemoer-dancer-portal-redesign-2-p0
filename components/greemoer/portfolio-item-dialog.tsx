'use client'

import { Film, Loader2, UploadCloud, X } from 'lucide-react'
import { useId, useState, type DragEvent, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { uploadPortfolioMedia } from '@/lib/greemoer/api'
import { DANCE_STYLES, type DanceStyle, type PortfolioItem } from '@/lib/greemoer/types'
import { ActionButton, Field, SelectInput, TextInput } from './primitives'

const MAX_IMAGE_MB = 15
const MAX_VIDEO_MB = 200
const ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm'

interface Draft {
  title: string
  danceStyle: DanceStyle
  event: string
  year: string
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PortfolioItemDialog({
  open,
  onOpenChange,
  item,
  defaultStyle,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PortfolioItem | null
  defaultStyle: DanceStyle
  onSubmit: (item: PortfolioItem) => Promise<void>
}) {
  const isEdit = item !== null
  const formId = useId()
  const [draft, setDraft] = useState<Draft>({
    title: item?.title ?? '',
    danceStyle: item?.danceStyle ?? defaultStyle,
    event: item?.event ?? '',
    year: String(item?.year ?? new Date().getFullYear()),
  })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(item?.durationLabel ?? null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)

  const acceptFile = (next: File | undefined) => {
    if (!next) return
    const isVideo = next.type.startsWith('video/')
    const isImage = next.type.startsWith('image/')
    if (!isVideo && !isImage) {
      setError('Upload a video (MP4, MOV, WebM) or a photo (JPG, PNG, WebP).')
      return
    }
    const limit = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB
    if (next.size > limit * 1024 * 1024) {
      setError(`${isVideo ? 'Videos' : 'Photos'} must be under ${limit} MB.`)
      return
    }
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
    setDuration(null)
    if (!draft.title) {
      setDraft((d) => ({ ...d, title: next.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') }))
    }
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    acceptFile(event.dataTransfer.files[0])
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isEdit && !file) {
      setError('Choose a video or photo to upload.')
      return
    }
    const year = Number(draft.year)
    if (!draft.title.trim()) {
      setError('Give this performance a title.')
      return
    }
    if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) {
      setError('Enter a valid year.')
      return
    }

    setSaving(true)
    try {
      const media = file ? await uploadPortfolioMedia(file) : null
      const mediaType = file ? (file.type.startsWith('video/') ? 'video' : 'image') : item!.mediaType
      await onSubmit({
        id: item?.id ?? `pf_${Date.now()}`,
        title: draft.title.trim(),
        danceStyle: draft.danceStyle,
        event: draft.event.trim() || 'Independent performance',
        year,
        mediaType,
        mediaUrl: media?.mediaUrl ?? item?.mediaUrl ?? null,
        thumbnailUrl: media ? media.thumbnailUrl : (item?.thumbnailUrl ?? null),
        durationLabel: mediaType === 'video' ? duration : null,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const isVideoFile = file?.type.startsWith('video/')

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit performance' : 'Add a performance'}
      description={
        isEdit
          ? 'Update how this piece appears on your profile.'
          : 'Showreels, stage recordings and performance photos help bookers say yes faster.'
      }
      footer={
        <>
          <ActionButton tone="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </ActionButton>
          <ActionButton tone="ink" type="submit" form={formId} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {isEdit ? 'Save changes' : 'Add to portfolio'}
          </ActionButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {!isEdit || file ? (
          <div className="flex flex-col gap-2">
            {previewUrl && file ? (
              <div className="relative overflow-hidden rounded-2xl bg-ink">
                {isVideoFile ? (
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    className="aspect-video w-full object-contain"
                    onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
                  />
                ) : (
                  <img src={previewUrl || '/placeholder.svg'} alt="Selected upload preview" className="aspect-video w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl)
                    setFile(null)
                    setPreviewUrl(null)
                  }}
                  aria-label="Remove selected file"
                  className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-card/95 text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
                <p className="flex items-center gap-2 bg-ink px-3 py-2 text-xs text-ink-muted">
                  <Film className="size-3.5" aria-hidden="true" />
                  <span className="truncate">{file.name}</span>
                  <span className="ml-auto tabular-nums">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </p>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-within:border-ink',
                  dragging ? 'border-ink bg-brand/15' : 'border-input bg-muted/50 hover:bg-muted',
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <UploadCloud className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Drop a file here or browse</span>
                  <span className="text-xs text-muted-foreground">
                    Video up to {MAX_VIDEO_MB} MB · Photo up to {MAX_IMAGE_MB} MB
                  </span>
                </span>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="sr-only"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                  aria-label="Choose a video or photo"
                />
              </label>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-ink/10">
            <span className="text-muted-foreground">Replace the media file</span>
            <span className="font-medium underline underline-offset-4">Choose file</span>
            <input
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </label>
        )}

        <Field id={`${formId}-title`} label="Title">
          <TextInput
            id={`${formId}-title`}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Tarana in Teentaal"
            maxLength={80}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={`${formId}-style`} label="Dance style">
            <SelectInput
              id={`${formId}-style`}
              value={draft.danceStyle}
              onChange={(e) => setDraft({ ...draft, danceStyle: e.target.value as DanceStyle })}
            >
              {DANCE_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field id={`${formId}-year`} label="Year">
            <TextInput
              id={`${formId}-year`}
              inputMode="numeric"
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            />
          </Field>
        </div>

        <Field id={`${formId}-event`} label="Event or venue" hint="Optional — where or for whom you performed.">
          <TextInput
            id={`${formId}-event`}
            value={draft.event}
            onChange={(e) => setDraft({ ...draft, event: e.target.value })}
            placeholder="e.g. NCPA Monsoon Festival"
            maxLength={80}
          />
        </Field>

        {error ? (
          <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!isEdit ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Preview mode: files stay in this browser session until Greemoer media storage is connected.
          </p>
        ) : null}
      </form>
    </Dialog>
  )
}
