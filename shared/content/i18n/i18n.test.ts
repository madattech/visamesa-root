import { describe, expect, it } from 'vitest'

import {
  localizedPath,
  normalizeLanguageTag,
  stripLocaleFromPath,
  translationResources,
  detectLanguageFromNavigator,
} from '@visamesa/content/i18n'

describe('i18n', () => {
  it('normalizes language tags', () => {
    expect(normalizeLanguageTag('es-ES')).toBe('es')
    expect(normalizeLanguageTag('zh-CN')).toBe('zh')
    expect(normalizeLanguageTag('fr-FR')).toBe('en')
  })

  it('builds localized paths', () => {
    expect(localizedPath('/', 'en')).toBe('/')
    expect(localizedPath('/pricing', 'es')).toBe('/es/pricing')
    expect(localizedPath('/', 'zh')).toBe('/zh')
  })

  it('strips locale prefixes from paths', () => {
    expect(stripLocaleFromPath('/pricing')).toEqual({
      locale: 'en',
      path: '/pricing',
    })
    expect(stripLocaleFromPath('/es/pricing')).toEqual({
      locale: 'es',
      path: '/pricing',
    })
  })

  it('loads all locale namespaces', () => {
    expect(Object.keys(translationResources.en)).toContain('marketing')
    expect(translationResources.es.marketing.hero.titlePrefix).toBeTruthy()
    expect(translationResources.zh.marketing.hero.titlePrefix).toBeTruthy()
  })

  it('preserves TIE in Spanish marketing subtitle', () => {
    expect(translationResources.es.marketing.hero.subtitle).toContain('TIE')
  })

  it('handles undefined navigator languages safely', () => {
    expect(detectLanguageFromNavigator([undefined, null, 'es-ES'])).toBe('es')
  })
})
