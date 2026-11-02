import type { DancerProfile, PortalView, PortfolioItem } from './types'

export const MIN_BIO_LENGTH = 80
export const MIN_PORTFOLIO_ITEMS = 3

export interface CompletionCheck {
  id: string
  label: string
  hint: string
  weight: number
  complete: boolean
  view: PortalView
  fieldId?: string
}

export interface CompletionResult {
  percent: number
  checks: CompletionCheck[]
  missing: CompletionCheck[]
}

export function calculateProfileCompletion(
  profile: DancerProfile,
  portfolio: PortfolioItem[],
): CompletionResult {
  const checks: CompletionCheck[] = [
    {
      id: 'photo',
      label: 'Profile photo',
      hint: 'A clear, well-lit headshot',
      weight: 10,
      complete: Boolean(profile.photoUrl),
      view: 'profile',
      fieldId: 'field-photo',
    },
    {
      id: 'name',
      label: 'Stage name',
      hint: 'How bookers will credit you',
      weight: 5,
      complete: profile.stageName.trim().length > 1,
      view: 'profile',
      fieldId: 'field-stageName',
    },
    {
      id: 'tagline',
      label: 'Tagline',
      hint: 'One line describing your work',
      weight: 5,
      complete: profile.tagline.trim().length > 10,
      view: 'profile',
      fieldId: 'field-tagline',
    },
    {
      id: 'bio',
      label: 'Artist bio',
      hint: `At least ${MIN_BIO_LENGTH} characters`,
      weight: 15,
      complete: profile.bio.trim().length >= MIN_BIO_LENGTH,
      view: 'profile',
      fieldId: 'field-bio',
    },
    {
      id: 'location',
      label: 'Base location',
      hint: 'City and state you work from',
      weight: 10,
      complete: profile.city.trim().length > 0 && profile.state.trim().length > 0,
      view: 'profile',
      fieldId: 'field-city',
    },
    {
      id: 'performerType',
      label: 'Performer type',
      hint: 'Solo, choreographer, trainer or group',
      weight: 10,
      complete: profile.performerType !== null,
      view: 'profile',
      fieldId: 'field-performerType',
    },
    {
      id: 'styles',
      label: 'Dance styles',
      hint: 'At least one primary style',
      weight: 10,
      complete: profile.danceStyles.some((s) => s.level === 'Primary'),
      view: 'styles',
    },
    {
      id: 'experience',
      label: 'Years of experience',
      hint: 'Helps bookers gauge seniority',
      weight: 5,
      complete: profile.experienceYears !== null && profile.experienceYears > 0,
      view: 'profile',
      fieldId: 'field-experienceYears',
    },
    {
      id: 'languages',
      label: 'Languages',
      hint: 'Languages you can take direction in',
      weight: 5,
      complete: profile.languages.length > 0,
      view: 'profile',
      fieldId: 'field-languages',
    },
    {
      id: 'rate',
      label: 'Starting rate',
      hint: 'Your typical fee per performance',
      weight: 5,
      complete: profile.baseRate !== null && profile.baseRate > 0,
      view: 'profile',
      fieldId: 'field-baseRate',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      hint: `At least ${MIN_PORTFOLIO_ITEMS} performances`,
      weight: 20,
      complete: portfolio.length >= MIN_PORTFOLIO_ITEMS,
      view: 'portfolio',
    },
  ]

  const total = checks.reduce((sum, c) => sum + c.weight, 0)
  const earned = checks.filter((c) => c.complete).reduce((sum, c) => sum + c.weight, 0)

  return {
    percent: Math.round((earned / total) * 100),
    checks,
    missing: checks.filter((c) => !c.complete),
  }
}
