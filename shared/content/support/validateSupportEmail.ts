const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAX_EMAIL_LENGTH = 320

export function isValidSupportEmail(email: string): boolean {
  const trimmed = email.trim()
  return trimmed.length > 0 && trimmed.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(trimmed)
}

export function normalizeSupportEmail(email: string): string {
  return email.trim().toLowerCase()
}
