import { NativeModules, Platform } from 'react-native'

export function getNativeDeviceLocales(): string[] {
  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings as
      | {
          AppleLocale?: string
          AppleLanguages?: string[]
        }
      | undefined

    return [settings?.AppleLocale, ...(settings?.AppleLanguages ?? [])].filter(
      (locale): locale is string => Boolean(locale),
    )
  }

  const locale = NativeModules.I18nManager?.localeIdentifier as string | undefined
  return locale ? [locale] : []
}
