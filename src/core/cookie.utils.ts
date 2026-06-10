interface ICookieOptions {
  expires?: number // days
  secure?: boolean
  path?: string
}

class CookieUtils {
  getItem (key: string): string | null {
    const prefix = `${encodeURIComponent(key)}=`
    const row = document.cookie.split('; ').find(r => r.startsWith(prefix))
    return row ? decodeURIComponent(row.slice(prefix.length)) : null
  }

  setItem (key: string, value: string, options: ICookieOptions = {}) {
    let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    if (options.expires !== undefined) {
      const date = new Date()
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000)
      cookie += `; expires=${date.toUTCString()}`
    }
    if (options.path) {
      cookie += `; path=${options.path}`
    }
    if (options.secure) {
      cookie += '; secure'
    }
    document.cookie = cookie
  }
}

export const cookieUtils = new CookieUtils()
