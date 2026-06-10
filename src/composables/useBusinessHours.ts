import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentBooking } from './useAppointmentBooking'
import { WEEKDAYS_CONFIG, DEFAULT_WEEKDAYS_LANG } from '@/core/weekdays.config'
import type { IBusinessHoursDay } from '@/types/config.types'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const WEEKEND_DAYS = ['saturday', 'sunday']

const isOpen = (day?: IBusinessHoursDay) =>
  (day?.active === true || day?.active === 'true') && !!day.from && !!day.to

// Trim leading zero only: "08:30" -> "8:30", "17:00" -> "17:00"
const formatTime = (time: string) => time.replace(/^0/, '')

export const useBusinessHours = () => {
  const { locale } = useI18n()
  const { config } = useAppointmentBooking()

  // Weekday labels and closed/weekend wording for the active language
  // (locale follows config opts.lang, see useAppointmentBooking)
  const labels = computed(() => {
    const lang = locale.value.split('-')[0]
    return WEEKDAYS_CONFIG[lang] || WEEKDAYS_CONFIG[DEFAULT_WEEKDAYS_LANG]
  })

  // Open hours grouped by consecutive days with the same from/to schedule
  // (breaks are ignored), e.g. "Mo. - Fr.: 8 - 19" / "Sa. - So.: Wochenende".
  // Closed days show as "weekend" when they are Sat/Sun, "closed" otherwise.
  // Empty when businessHours is missing or no day is active.
  const businessHoursLines = computed(() => {
    const hours = config.value?.params?.companyData?.businessHours
    if (!hours || !DAY_ORDER.some(dayKey => isOpen(hours[dayKey]))) return []

    const groups: { days: string[]; schedule: string }[] = []
    for (const dayKey of DAY_ORDER) {
      const day = hours[dayKey]
      const schedule = isOpen(day) ? `${formatTime(day.from)} - ${formatTime(day.to)}` : ''
      const lastGroup = groups[groups.length - 1]
      if (lastGroup && lastGroup.schedule === schedule) {
        lastGroup.days.push(dayKey)
      } else {
        groups.push({ days: [dayKey], schedule })
      }
    }

    return groups.map(group => {
      const range = group.days.length === 1
        ? labels.value.weekdays[group.days[0]]
        : `${labels.value.weekdays[group.days[0]]} - ${labels.value.weekdays[group.days[group.days.length - 1]]}`
      const schedule = group.schedule ||
        (group.days.every(dayKey => WEEKEND_DAYS.includes(dayKey)) ? labels.value.weekend : labels.value.closed)
      return `${range}: ${schedule}`
    })
  })

  return { businessHoursLines }
}
