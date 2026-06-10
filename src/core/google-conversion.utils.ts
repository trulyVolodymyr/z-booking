import type { IConfigGoogle } from '@/types/config.types'
import { cookieUtils } from './cookie.utils'

const RWG_TOKEN_COOKIE = '_rwgToken'

// ZM-943 Remember Google's rwg token for conversion tracking
export const rememberRwgToken = (google?: IConfigGoogle) => {
  if (!google?.conversion_tracking_enabled) return

  const rwgToken = new URLSearchParams(window.location.search).get('rwg_token') // Already decodes the value
  if (rwgToken) {
    cookieUtils.setItem(RWG_TOKEN_COOKIE, rwgToken, { expires: 30, secure: true, path: '/' })
  }
}

// ZM-943 Google conversion tracking after successful booking
export const trackGoogleConversion = async (google?: IConfigGoogle) => {
  if (!google?.conversion_tracking_enabled) return

  const rwgToken = cookieUtils.getItem(RWG_TOKEN_COOKIE)
  if (!rwgToken) return

  try {
    await fetch(google.conversion_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        rwg_token: rwgToken, // Value is already decoded
        conversion_partner_id: google.conversion_partner_id,
        merchant_changed: google.merchant_changed
      })
    })
  } catch (err) {
    console.error('Google conversion tracking failed:', err)
  }
}
