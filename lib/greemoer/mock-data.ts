/**
 * MOCK DATA — sample content for the dancer portal preview.
 * Replace with responses from the Greemoer API (see ./api.ts) when the backend is available.
 */
import type {
  Application,
  DancerProfile,
  Opportunity,
  PortfolioItem,
} from './types'

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const mockProfile: DancerProfile = {
  id: 'dancer_ananya_rao',
  fullName: 'Ananya Rao',
  stageName: 'Ananya Rao',
  email: 'ananya.rao@example.com',
  photoUrl: '/images/dancer-profile.png',
  tagline: 'Kathak & contemporary performer bridging classical form with modern stagecraft.',
  bio: 'Trained under the Lucknow gharana for twelve years, I create performances that move between classical Kathak and contemporary movement. I have performed at cultural festivals, luxury weddings and brand launches across India, and I choreograph solo and ensemble pieces for stage and screen.',
  city: 'Mumbai',
  state: 'Maharashtra',
  performerType: 'Solo dancer',
  danceStyles: [
    { style: 'Kathak', level: 'Primary' },
    { style: 'Contemporary', level: 'Primary' },
    { style: 'Bollywood', level: 'Secondary' },
    { style: 'Semi-classical', level: 'Secondary' },
  ],
  experienceYears: null,
  languages: [],
  baseRate: null,
  travel: 'Pan-India',
  instagram: '@ananya.moves',
  openToBookings: true,
  verification: 'pending',
  memberSince: '2025-08-14',
}

export const mockPortfolio: PortfolioItem[] = [
  {
    id: 'pf_1',
    title: 'Tarana in Teentaal',
    mediaType: 'video',
    thumbnailUrl: '/images/portfolio-kathak.png',
    mediaUrl: null,
    durationLabel: '4:12',
    danceStyle: 'Kathak',
    event: 'NCPA Monsoon Festival',
    year: 2025,
  },
  {
    id: 'pf_2',
    title: 'Weightless — solo study',
    mediaType: 'image',
    thumbnailUrl: '/images/portfolio-contemporary.png',
    mediaUrl: null,
    durationLabel: null,
    danceStyle: 'Contemporary',
    event: 'Prithvi Theatre',
    year: 2025,
  },
  {
    id: 'pf_3',
    title: 'Sangeet headline set',
    mediaType: 'video',
    thumbnailUrl: '/images/portfolio-bollywood.png',
    mediaUrl: null,
    durationLabel: '6:40',
    danceStyle: 'Bollywood',
    event: 'Private wedding, Udaipur',
    year: 2024,
  },
  {
    id: 'pf_4',
    title: 'Abhinaya close study',
    mediaType: 'image',
    thumbnailUrl: '/images/portfolio-bharatanatyam.png',
    mediaUrl: null,
    durationLabel: null,
    danceStyle: 'Semi-classical',
    event: 'Studio session',
    year: 2024,
  },
  {
    id: 'pf_5',
    title: 'Rehearsal reel',
    mediaType: 'video',
    thumbnailUrl: '/images/portfolio-rehearsal.png',
    mediaUrl: null,
    durationLabel: '1:28',
    danceStyle: 'Contemporary',
    event: 'Studio Lokha, Bandra',
    year: 2025,
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Kathak soloist for a luxury brand launch',
    client: 'Maison Aarya',
    eventType: 'Brand Campaign',
    city: 'Mumbai',
    venue: 'The St. Regis, Lower Parel',
    danceStyles: ['Kathak', 'Semi-classical'],
    deadline: daysFromNow(12),
    eventDate: daysFromNow(27),
    feeMin: 35000,
    feeMax: 50000,
    performersNeeded: 1,
    durationLabel: '12-minute set',
    description:
      'A heritage jewellery house is unveiling its spring collection and wants a Kathak soloist to open the evening. The piece should feel classical but refined for a contemporary audience of 200 guests.',
    requirements: [
      'Minimum 5 years of performance experience',
      'Own costume aligned to an ivory and gold palette',
      'One rehearsal at the venue on 6 March',
    ],
    imageUrl: '/images/opp-corporate.png',
  },
  {
    id: 'opp_2',
    title: 'Contemporary dancers for an indie music video',
    client: 'Lowlight Films',
    eventType: 'Music Video',
    city: 'Bengaluru',
    venue: 'Outdoor rooftop location',
    danceStyles: ['Contemporary', 'Freestyle'],
    deadline: daysFromNow(5),
    eventDate: daysFromNow(19),
    feeMin: 18000,
    feeMax: 25000,
    performersNeeded: 4,
    durationLabel: '2-day shoot',
    description:
      'An independent label is shooting a single-take music video and needs four contemporary dancers comfortable with improvisation and camera choreography.',
    requirements: [
      'Comfortable improvising to direction on camera',
      'Available for both shoot days',
      'Showreel with at least one video required',
    ],
    imageUrl: '/images/opp-musicvideo.png',
  },
  {
    id: 'opp_3',
    title: 'Classical ensemble for a temple heritage festival',
    client: 'Hampi Utsav Committee',
    eventType: 'Festival',
    city: 'Hampi',
    venue: 'Virupaksha courtyard stage',
    danceStyles: ['Kathak', 'Bharatanatyam', 'Odissi'],
    deadline: daysFromNow(21),
    eventDate: daysFromNow(41),
    feeMin: 22000,
    feeMax: 30000,
    performersNeeded: 6,
    durationLabel: '40-minute production',
    description:
      'The festival is curating a multi-style classical production at dusk. Travel and accommodation are covered for selected performers.',
    requirements: [
      'Formal training in a classical style',
      'Travel and stay covered by organisers',
      'Two remote rehearsals before the event',
    ],
    imageUrl: '/images/opp-festival.png',
  },
  {
    id: 'opp_4',
    title: 'Sangeet choreography and lead performance',
    client: 'Kapoor & Mehta families',
    eventType: 'Wedding & Sangeet',
    city: 'Jaipur',
    venue: 'Rambagh Palace',
    danceStyles: ['Bollywood', 'Semi-classical'],
    deadline: daysFromNow(16),
    eventDate: daysFromNow(63),
    feeMin: 60000,
    feeMax: 90000,
    performersNeeded: 2,
    durationLabel: '3 family routines + 1 lead set',
    description:
      'Choreograph three family routines over video sessions and perform a lead set on the sangeet night. A planner coordinates schedules.',
    requirements: [
      'Experience choreographing non-dancers',
      'Four remote sessions plus one on-site rehearsal',
      'Travel to Jaipur covered',
    ],
    imageUrl: '/images/portfolio-bollywood.png',
  },
]

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    opportunityId: 'opp_4',
    submittedAt: daysFromNow(-6),
    status: 'Shortlisted',
    note: 'I have choreographed eleven sangeets and love working with families.',
    quote: 75000,
  },
]
