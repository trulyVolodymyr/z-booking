export interface IWeekdaysLocale {
  // Short day labels keyed by monday..sunday
  weekdays: Record<string, string>
  closed: string
  weekend: string
}

export const DEFAULT_WEEKDAYS_LANG = 'en'

export const WEEKDAYS_CONFIG: Record<string, IWeekdaysLocale> = {
  de: {
    weekdays: {
      monday: 'Mo.',
      tuesday: 'Di.',
      wednesday: 'Mi.',
      thursday: 'Do.',
      friday: 'Fr.',
      saturday: 'Sa.',
      sunday: 'So.'
    },
    closed: 'geschlossen',
    weekend: 'Wochenende'
  },
  en: {
    weekdays: {
      monday: 'Mon.',
      tuesday: 'Tue.',
      wednesday: 'Wed.',
      thursday: 'Thu.',
      friday: 'Fri.',
      saturday: 'Sat.',
      sunday: 'Sun.'
    },
    closed: 'closed',
    weekend: 'weekend'
  },
  fr: {
    weekdays: {
      monday: 'Lun.',
      tuesday: 'Mar.',
      wednesday: 'Mer.',
      thursday: 'Jeu.',
      friday: 'Ven.',
      saturday: 'Sam.',
      sunday: 'Dim.'
    },
    closed: 'fermé',
    weekend: 'week-end'
  },
  es: {
    weekdays: {
      monday: 'Lun.',
      tuesday: 'Mar.',
      wednesday: 'Mié.',
      thursday: 'Jue.',
      friday: 'Vie.',
      saturday: 'Sáb.',
      sunday: 'Dom.'
    },
    closed: 'cerrado',
    weekend: 'fin de semana'
  },
  it: {
    weekdays: {
      monday: 'Lun.',
      tuesday: 'Mar.',
      wednesday: 'Mer.',
      thursday: 'Gio.',
      friday: 'Ven.',
      saturday: 'Sab.',
      sunday: 'Dom.'
    },
    closed: 'chiuso',
    weekend: 'fine settimana'
  },
  pl: {
    weekdays: {
      monday: 'Pon.',
      tuesday: 'Wt.',
      wednesday: 'Śr.',
      thursday: 'Czw.',
      friday: 'Pt.',
      saturday: 'Sob.',
      sunday: 'Niedz.'
    },
    closed: 'zamknięte',
    weekend: 'weekend'
  }
}
