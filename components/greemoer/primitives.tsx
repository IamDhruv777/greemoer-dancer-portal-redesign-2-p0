'use client'

import { BadgeCheck, Clock3, ShieldAlert } from 'lucide-react'
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/lib/greemoer/types'

type Tone = 'ink' | 'brand' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const toneClasses: Record<Tone, string> = {
  ink: 'bg-ink text-ink-foreground hover:bg-ink/85',
  brand: 'bg-brand text-brand-foreground hover:bg-brand/85',
  outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  danger: 'bg-destructive text-white hover:bg-destructive/90',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
}

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone
  size?: Size
}

export function ActionButton({
  tone = 'ink',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading
          className={cn(
            'font-display leading-none text-balance',
            Heading === 'h1' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl',
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </div>
  )
}

export function Chip({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: 'default' | 'brand' | 'ink' | 'outline'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        tone === 'default' && 'bg-muted text-foreground',
        tone === 'brand' && 'bg-brand text-brand-foreground',
        tone === 'ink' && 'bg-ink text-ink-foreground',
        tone === 'outline' && 'border border-border text-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

const verificationMeta: Record<
  VerificationStatus,
  { label: string; icon: typeof BadgeCheck; className: string }
> = {
  verified: { label: 'Verified artist', icon: BadgeCheck, className: 'bg-brand text-brand-foreground' },
  pending: { label: 'Verification in review', icon: Clock3, className: 'bg-muted text-foreground' },
  unverified: { label: 'Not verified', icon: ShieldAlert, className: 'bg-muted text-muted-foreground' },
}

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus
  className?: string
}) {
  const meta = verificationMeta[status]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        meta.className,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

export function CompletionBar({
  percent,
  className,
  tone = 'light',
}: {
  percent: number
  className?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Profile completion"
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full',
        tone === 'light' ? 'bg-muted' : 'bg-white/10',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

const fieldBase =
  'w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/10 disabled:opacity-60'

export function Field({
  id,
  label,
  hint,
  children,
  className,
}: {
  id: string
  label: string
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, 'h-11', className)} {...props} />
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, 'min-h-28 py-3 leading-relaxed', className)} {...props} />
}

export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, 'h-11 appearance-none bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10', className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6862' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
}

export function Switch({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-ink' : 'bg-input',
      )}
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-card shadow transition-transform',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-3xl border border-border bg-card', className)}>{children}</section>
  )
}
