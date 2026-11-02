'use client'

import { Lock } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { usePortal } from '../portal-provider'
import { ActionButton, Chip, Panel, SectionHeader, Switch, VerificationBadge } from '../primitives'

export function SettingsView() {
  const { profile, updateProfile, notify } = usePortal()
  const [notifications, setNotifications] = useState({
    newMatches: true,
    applicationUpdates: true,
    weeklyDigest: false,
  })

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <SectionHeader as="h1" eyebrow="Settings" title="Account & preferences" />

      <SettingsGroup title="Availability">
        <SettingRow
          id="setting-open"
          title="Open to bookings"
          description="When off, your profile is hidden from new briefs but existing applications continue."
          control={
            <Switch
              id="setting-open"
              label="Open to bookings"
              checked={profile.openToBookings}
              onCheckedChange={async (checked) => {
                await updateProfile({ ...profile, openToBookings: checked })
                notify(checked ? 'You are now open to bookings.' : 'Your profile is paused for new briefs.')
              }}
            />
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <SettingRow
          id="setting-matches"
          title="New matched opportunities"
          description="Email me when a brief matches my primary styles."
          control={
            <Switch
              id="setting-matches"
              label="New matched opportunities"
              checked={notifications.newMatches}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, newMatches: v }))}
            />
          }
        />
        <SettingRow
          id="setting-updates"
          title="Application updates"
          description="Shortlists, bookings and booker messages."
          control={
            <Switch
              id="setting-updates"
              label="Application updates"
              checked={notifications.applicationUpdates}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, applicationUpdates: v }))}
            />
          }
        />
        <SettingRow
          id="setting-digest"
          title="Weekly digest"
          description="A Monday summary of open gigs in your city."
          control={
            <Switch
              id="setting-digest"
              label="Weekly digest"
              checked={notifications.weeklyDigest}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, weeklyDigest: v }))}
            />
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Account">
        <SettingRow
          title="Email"
          description={profile.email}
          control={<Chip tone="outline">Primary</Chip>}
        />
        <SettingRow
          title="Artist verification"
          description="Our team reviews your ID and portfolio before you appear as a verified artist."
          control={<VerificationBadge status={profile.verification} />}
        />
        <UnavailableRow
          title="Payout details"
          description="Add bank or UPI details to receive booking payments."
          reason="Available after verification"
        />
        <UnavailableRow
          title="Change password"
          description="Update the password you use to sign in."
          reason="Coming soon"
        />
      </SettingsGroup>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Sign out</span>
          <span className="text-xs text-muted-foreground">Authentication is not connected in this preview.</span>
        </div>
        <ActionButton tone="outline" disabled>
          Sign out
        </ActionButton>
      </div>
    </div>
  )
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4" aria-label={title}>
      <h2 className="font-display text-2xl">{title}</h2>
      <Panel className="divide-y divide-border">{children}</Panel>
    </section>
  )
}

function SettingRow({
  id,
  title,
  description,
  control,
}: {
  id?: string
  title: string
  description: string
  control: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="flex min-w-0 flex-col gap-0.5">
        {id ? (
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
        ) : (
          <span className="text-sm font-medium">{title}</span>
        )}
        <span className="text-xs leading-relaxed text-muted-foreground text-pretty break-words">{description}</span>
      </div>
      {control}
    </div>
  )
}

function UnavailableRow({
  title,
  description,
  reason,
}: {
  title: string
  description: string
  reason: string
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5 opacity-70">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        {reason}
      </span>
    </div>
  )
}
