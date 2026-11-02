/**
 * INTEGRATION POINTS — every call the portal makes to the outside world goes through here.
 *
 * Each function currently resolves locally against the in-memory session so the UI is fully
 * interactive without a backend. Swap the bodies for real requests to the Greemoer API when it
 * exists; the signatures are what the UI depends on.
 */
import type { Application, DancerProfile, PortfolioItem } from './types'

export async function saveDancerProfile(profile: DancerProfile): Promise<DancerProfile> {
  return profile
}

export interface UploadedMedia {
  mediaUrl: string
  thumbnailUrl: string | null
}

export async function uploadPortfolioMedia(file: File): Promise<UploadedMedia> {
  const mediaUrl = URL.createObjectURL(file)
  return {
    mediaUrl,
    thumbnailUrl: file.type.startsWith('image/') ? mediaUrl : null,
  }
}

export async function savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
  return item
}

export async function deletePortfolioItem(_id: string): Promise<void> {}

export async function uploadProfilePhoto(file: File): Promise<string> {
  return URL.createObjectURL(file)
}

export async function submitApplication(
  input: Omit<Application, 'id' | 'submittedAt' | 'status'>,
): Promise<Application> {
  return {
    ...input,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString().slice(0, 10),
    status: 'Submitted',
  }
}

export async function withdrawApplication(_id: string): Promise<void> {}
