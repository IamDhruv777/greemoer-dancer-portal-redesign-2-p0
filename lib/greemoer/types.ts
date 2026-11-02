export const DANCE_STYLES = [
  'Bharatanatyam',
  'Kathak',
  'Odissi',
  'Kuchipudi',
  'Mohiniyattam',
  'Contemporary',
  'Bollywood',
  'Hip-Hop',
  'Bhangra',
  'Garba',
  'Folk',
  'Jazz',
  'Ballet',
  'Salsa',
  'Freestyle',
  'Semi-classical',
] as const

export type DanceStyle = (typeof DANCE_STYLES)[number]

export const PERFORMER_TYPES = [
  'Solo dancer',
  'Choreographer',
  'Trainer',
  'Performance group',
] as const

export type PerformerType = (typeof PERFORMER_TYPES)[number]

export const TRAVEL_OPTIONS = [
  'Local only',
  'Within state',
  'Pan-India',
  'International',
] as const

export type TravelWillingness = (typeof TRAVEL_OPTIONS)[number]

export type VerificationStatus = 'verified' | 'pending' | 'unverified'

export type StyleLevel = 'Primary' | 'Secondary'

export interface DanceStyleSelection {
  style: DanceStyle
  level: StyleLevel
}

export interface DancerProfile {
  id: string
  fullName: string
  stageName: string
  email: string
  photoUrl: string | null
  tagline: string
  bio: string
  city: string
  state: string
  performerType: PerformerType | null
  danceStyles: DanceStyleSelection[]
  experienceYears: number | null
  languages: string[]
  baseRate: number | null
  travel: TravelWillingness | null
  instagram: string
  openToBookings: boolean
  verification: VerificationStatus
  memberSince: string
}

export type MediaType = 'video' | 'image'

export interface PortfolioItem {
  id: string
  title: string
  mediaType: MediaType
  thumbnailUrl: string | null
  mediaUrl: string | null
  durationLabel: string | null
  danceStyle: DanceStyle
  event: string
  year: number
}

export type EventType =
  | 'Wedding & Sangeet'
  | 'Corporate Event'
  | 'Music Video'
  | 'Festival'
  | 'Brand Campaign'
  | 'Theatre Production'

export interface Opportunity {
  id: string
  title: string
  client: string
  eventType: EventType
  city: string
  venue: string
  danceStyles: DanceStyle[]
  deadline: string
  eventDate: string
  feeMin: number
  feeMax: number
  performersNeeded: number
  durationLabel: string
  description: string
  requirements: string[]
  imageUrl: string
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Shortlisted'
  | 'Booked'
  | 'Not selected'

export interface Application {
  id: string
  opportunityId: string
  submittedAt: string
  status: ApplicationStatus
  note: string
  quote: number | null
}

export type PortalView =
  | 'dashboard'
  | 'profile'
  | 'portfolio'
  | 'styles'
  | 'opportunities'
  | 'applications'
  | 'settings'

export interface PortalRoute {
  view: PortalView
  opportunityId?: string
}
