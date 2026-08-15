import waitlistEn from './locales/en/waitlist.json' with { type: 'json' }
import waitlistEs from './locales/es/waitlist.json' with { type: 'json' }
import waitlistZh from './locales/zh/waitlist.json' with { type: 'json' }
import { DEFAULT_LANGUAGE, localizedPath, normalizeLanguageTag, type SupportedLanguage } from './i18n/types.js'

export type WaitlistEmailContent = {
  subject: string
  preview: string
  greeting: string
  body: string
  cta: string
  footer: string
}

export type WaitlistConfirmationEmail = {
  subject: string
  html: string
  text: string
}

const WAITLIST_EMAIL_BY_LOCALE: Record<SupportedLanguage, WaitlistEmailContent> = {
  en: waitlistEn.email,
  es: waitlistEs.email,
  zh: waitlistZh.email,
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function getWaitlistEmailContent(locale: string | undefined | null): WaitlistEmailContent {
  if (locale === 'es' || locale === 'zh') {
    return WAITLIST_EMAIL_BY_LOCALE[locale]
  }

  return WAITLIST_EMAIL_BY_LOCALE[DEFAULT_LANGUAGE]
}

export function buildWaitlistConfirmationEmail(input: {
  confirmationToken: string
  locale: string | undefined | null
  appUrl: string
}): WaitlistConfirmationEmail {
  const locale = normalizeLanguageTag(input.locale)
  const content = getWaitlistEmailContent(locale)
  const confirmPath = localizedPath(`/waitlist/confirm/${input.confirmationToken}`, locale)
  const confirmUrl = `${input.appUrl.replace(/\/$/, '')}${confirmPath}`

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <p style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preview)}</p>
      <h1 style="font-size: 20px; margin-bottom: 16px;">${escapeHtml(content.greeting)}</h1>
      <p style="margin: 0 0 16px;">${escapeHtml(content.body)}</p>
      <p style="margin: 0 0 24px;">
        <a href="${confirmUrl}" style="display:inline-block;background:#1b5e20;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;">
          ${escapeHtml(content.cta)}
        </a>
      </p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
        ${escapeHtml(content.footer)}
      </p>
      <p style="margin: 0; font-size: 12px; color: #6b7280; word-break: break-all;">
        ${confirmUrl}
      </p>
    </div>
  `.trim()

  const text = [
    content.greeting,
    '',
    content.body,
    '',
    `${content.cta}: ${confirmUrl}`,
    '',
    content.footer,
  ].join('\n')

  return {
    subject: content.subject,
    html,
    text,
  }
}
