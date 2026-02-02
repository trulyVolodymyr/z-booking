<template>
  <div
    class="w-[280px] 1080:w-[330px] h-[270px] border border-[#E6EBEF] rounded-[10px] p-3 bg-primaryBg
  overflow-hidden"
  >
    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-2">
      <button
        class="size-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
        @click="previousMonth"
      >
        <IconLeft class="size-4" />
      </button>

      <h3 class="text-sm font-semibold text-text">
        {{ monthName }} {{ currentYear }}
      </h3>

      <button
        class="size-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
        @click="nextMonth"
      >
        <IconRight class="size-4" />
      </button>
    </div>

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekdays"
        :key="day"
        class="text-center font-semibold text-text text-xs"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="flex flex-col items-center justify-center h-[34px] rounded transition-all relative"
        :class="getDayClasses(day)"
        @click="selectDay(day)"
      >
        <span class="text-xs" :class="getDayTextClasses(day)">
          {{ day.date }}
        </span>
        <!-- Green dot indicator for available days -->
        <span
          v-if="isDayAvailable(day)"
          class="absolute bottom-0.5 size-1 bg-green-500 rounded-full"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface ICalendarDay {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
  isPreviousMonth: boolean
  isNextMonth: boolean
  fullDate: string // YYYY-MM-DD format
}

interface IProps {
  availableDays?: string[] // Array of date strings in YYYY-MM-DD format
  modelValue?: string | null // Selected date in YYYY-MM-DD format
}

interface IEmits {
  (e: 'update:modelValue', value: string | null): void
}

const props = withDefaults(defineProps<IProps>(), {
  availableDays: () => [],
  modelValue: null
})

const emit = defineEmits<IEmits>()

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const weekdays = computed(() => [
  t('general.mon'),
  t('general.tue'),
  t('general.wed'),
  t('general.thu'),
  t('general.fri'),
  t('general.sat'),
  t('general.sun')
])

const monthNames = computed(() => [
  t('general.january'),
  t('general.february'),
  t('general.march'),
  t('general.april'),
  t('general.may'),
  t('general.june'),
  t('general.july'),
  t('general.august'),
  t('general.september'),
  t('general.october'),
  t('general.november'),
  t('general.december')
])

const monthName = computed(() => monthNames.value[currentMonth.value])

const calendarDays = computed((): ICalendarDay[] => {
  const days: ICalendarDay[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

  // Get the day of week (0 = Sunday, 1 = Monday, etc.)
  // Adjust so Monday = 0
  let firstDayOfWeek = firstDay.getDay() - 1
  if (firstDayOfWeek === -1) firstDayOfWeek = 6

  // Add days from previous month
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    const month = currentMonth.value === 0 ? 11 : currentMonth.value - 1
    const year = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value
    days.push({
      date,
      month,
      year,
      isCurrentMonth: false,
      isPreviousMonth: true,
      isNextMonth: false,
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    })
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      month: currentMonth.value,
      year: currentYear.value,
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false,
      fullDate: `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  // Add days from next month to complete the grid
  const remainingDays = 35 - days.length // 5 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const month = currentMonth.value === 11 ? 0 : currentMonth.value + 1
    const year = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value
    days.push({
      date: i,
      month,
      year,
      isCurrentMonth: false,
      isPreviousMonth: false,
      isNextMonth: true,
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  return days
})

const isDayAvailable = (day: ICalendarDay): boolean => {
  return props.availableDays.includes(day.fullDate)
}

const isSelected = (day: ICalendarDay): boolean => {
  return props.modelValue === day.fullDate
}

const getDayClasses = (day: ICalendarDay): string => {
  const classes = []

  if (isSelected(day)) {
    classes.push('bg-[#E5F1FF]')
  } else if (isDayAvailable(day)) {
    classes.push('hover:bg-gray-100')
  }

  // Only show pointer cursor for available days
  if (isDayAvailable(day)) {
    classes.push('cursor-pointer')
  } else {
    classes.push('cursor-default')
  }

  return classes.join(' ')
}

const getDayTextClasses = (day: ICalendarDay): string => {
  const classes = []

  if (day.isPreviousMonth) {
    classes.push('text-text')
  } else if (day.isNextMonth) {
    classes.push('text-text')
  } else {
    classes.push('text-text')
  }

  // Apply opacity if day is not available
  if (!isDayAvailable(day)) {
    classes.push('opacity-40')
  }

  return classes.join(' ')
}

const selectDay = (day: ICalendarDay) => {
  // Only allow selection of available days
  if (!isDayAvailable(day)) {
    return
  }

  if (isSelected(day)) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', day.fullDate)
  }
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>
