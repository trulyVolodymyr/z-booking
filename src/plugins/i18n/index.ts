import type { Plugin } from 'vue'
import { createI18n } from 'vue-i18n'

import { en, de, fr, it } from './translations'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    },
    de: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    },
    fr: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    },
    it: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    }
  },

  messages: {
    ...en,
    ...de,
    ...fr,
    ...it
  }
})

const setLocale = (locale: string) => {
  i18n.global.locale.value = locale
}

const I18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n)
  }
}

export {
  i18n,
  I18nPlugin,
  setLocale
}
