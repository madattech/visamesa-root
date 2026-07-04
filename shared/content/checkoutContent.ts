/** Shared with mobile consentService — keep in sync */
export const CONSENT_POLICY_VERSION = 'v1.0'

export const CHECKOUT_SOURCE_STORAGE_KEY = 'visamesa_checkout_source'

export const PRICING_INTRO_TYPE1 =
  'One-time payment on our website. After checkout, download the VisaMesa app and sign in with the same Google account to start your TIE journey.'

export const PRICING_INTRO_TYPE2 =
  'Complete payment here, then return to the VisaMesa app with the same Google account to unlock your service.'

export const PRICING_ALREADY_PAID_TITLE = 'You already have an active service'
export const PRICING_ALREADY_PAID_BODY =
  'Your payment is linked to this Google account. Open the VisaMesa app and sign in with the same account to continue.'

export const PRICING_TYPE2_RETURN_NOTE =
  'After payment, use the button on the success page to return to the VisaMesa app.'

export const PRICING_RETURN_TO_APP = 'Return to VisaMesa app'

export const CHECKOUT_SUCCESS_TITLE = 'Payment successful'
export const CHECKOUT_SUCCESS_TYPE1_LEAD =
  'Your VisaMesa service is now linked to your Google account. Follow these steps to get started in the app.'

export const CHECKOUT_SUCCESS_TYPE2_LEAD =
  'Your VisaMesa service is now linked to your account. Return to the app to continue your TIE journey.'

export const CHECKOUT_SUCCESS_OPEN_APP = 'Open VisaMesa app'

export const CHECKOUT_POST_PAYMENT_STEPS = [
  'Download the VisaMesa app from the App Store or Google Play',
  'Sign in with the same Google account you used on this website',
  'Complete your profile in the app to unlock the features',
] as const

export const CHECKOUT_SUCCESS_DOWNLOAD_FALLBACK =
  'Download VisaMesa from the App Store or Google Play, then sign in with the same Google account.'

export const PROFILE_ALREADY_PAID_DIALOG_TITLE = 'Already paid'
export const PROFILE_ALREADY_PAID_DIALOG_MESSAGE =
  'You already have an active VisaMesa service on this account.'
export const PROFILE_ALREADY_PAID_OK = 'OK'
export const PROFILE_ALREADY_PAID_SEE_STATUS = 'See status'
