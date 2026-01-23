export interface IWorkItem {
  id: number
  text: string
  groupMembers: any[]
}

export interface IGdprLang {
  text: string
  link: string
}

export interface ILagersoftCustomer {
  name: string
}

export interface ILagersoftParams {
  hasWheel: boolean
  customer: ILagersoftCustomer
  vehicle: any[]
  wheel: any[]
  raw: any[]
}

export interface IConfigOpts {
  'initial-data': {
    works: string | null
    name: string | null
    phone: string | null
    mobile: string | null
    email: string | null
    'license-plate': string | null
    mileage: string | null
    'vehicle-type': string | null
    vin: string | null
    'storage-number': string | null
    'customer-waits': string | null
    rental: string | null
    comment: string | null
    gdpr: string | null
    'aux-field-1': string | null
    'aux-field-2': string | null
    'aux-field-3': string | null
  }
  'auto-confirm': boolean
  'avail-bg': string
  'avail-fg': string
  'avail-works': string[]
  'back-url': string
  'bcc-email': string[]
  'bg-color': string
  blocks: string
  'border-color': string
  'button-radius': string
  'calendar-bg-today': string
  'calendar-bg': string
  'company-name': string
  'config-name': string
  debug: number
  'disabled-color': string
  'earliest-day': string
  'embedded-iframe': boolean
  'error-color': string
  'fallback-sync-mode': string
  'favicon-url': string
  'fg-color': string
  'field-mileage': string
  'field-storage-number': string
  'field-vehicle-type': string
  'field-vin': string
  'font-family': string
  'font-size': string
  'future-dow': string[]
  'group-works': boolean
  'h1-size': string
  'h2-size': string
  'hide-add-works-btn': boolean
  'hide-book-again-btn': boolean
  'highlight-bg': string
  'highlight-fg': string
  'icon-color': string
  'input-radius': string
  lang: string
  langs: string[]
  'lead-time': string
  'lead-time-exclude-saturdays': boolean
  'lead-time-exclude-sundays': boolean
  'lead-time-exclude-holidays': boolean
  'lead-time-exclude-company-szeit': boolean
  'license-pattern': string
  'logo-url': string
  mechanics: any[]
  'mechanics-max-load': number
  mode: string
  'panel-color': string
  'panel-radius': string
  'reservation-period': number
  'required-user-contact': string
  'selectable-times': string[]
  'selected-bg': string
  'selected-fg': string
  'show-back-btn': boolean
  'show-customer-waits': boolean
  'show-name': boolean
  'show-rental': boolean
  'success-url': string
  'time-bg-alt': string
  'time-bg': string
  'time-hour-fg': string
  'unavail-time-fg': string
  'file-upload': boolean
  'lagersoft-textbaustein': string
  'aux-1-label': any[]
  'aux-1-mode': string
  'aux-1-pos': string
  'aux-2-label': any[]
  'aux-2-mode': string
  'aux-2-pos': string
  'aux-3-label': any[]
  'aux-3-mode': string
  'aux-3-pos': string
}

export interface IConfigParams {
  lagersoft: ILagersoftParams
  portal: string
  token: string
  qrid: string
  isDropboxEnabled: boolean
  lagersoftTextbausteinId: number
  company: string
  // Dynamic language keys (de, en, fr, etc.)
  gdprByLang: {
    errors: any[]
  } & Record<string, IGdprLang>
  // Dynamic language keys, then dynamic category names
  worksByLang: Record<string, Record<string, IWorkItem[]>>
}

export interface IConfig {
  opts: IConfigOpts
  params: IConfigParams
}
