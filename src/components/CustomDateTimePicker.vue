<template>
  <div ref="pickerRef" class="inline-block w-full">
    <!-- Input trigger -->
    <div
      class="flex items-center gap-2 p-1 1250:py-2 border border-[#dcdfe6] rounded bg-white cursor-pointer
        transition-colors hover:border-[#c0c4cc]"
      :class="{
        'bg-[#f5f7fa] cursor-not-allowed opacity-60': disabled,
        'border-primary': isOpen
      }"
      @click="togglePicker"
    >
      <IconClock
        class="shrink-0"
        :class="displayValue ? 'text-primary' : ''"
      />
      <input
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        class="flex-1 border-none outline-none bg-transparent text-xs text-[#606266]
          cursor-inherit placeholder:text-[#c0c4cc] disabled:cursor-not-allowed"
      >
      <div
        v-if="displayValue"
        class="w-4 shrink-0 h-4 flex items-center justify-center text-[#c0c4cc] hover:text-[#909399] cursor-pointer
        -ml-5 -mt-[2px]"
        @click.stop="clearValue"
      >
        ×
      </div>
    </div>

    <!-- Dropdown panel -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1999] bg-[#000]/30"
        @click.self="closePicker"
      >
        <div
          ref="dropdownRef"
          class="bg-white border border-[#e4e7ed] rounded-lg shadow-lg w-[80%] max-w-[400px]
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000]"
        >
          <!-- Month navigation -->
          <div class="flex items-center justify-between py-2 px-3">
            <button
              type="button"
              class="border-none bg-transparent py-1 px-2 cursor-pointer text-[#303133] text-base hover:text-primary"
              @click="prevYear"
            >
              &laquo;
            </button>
            <button
              type="button"
              class="border-none bg-transparent py-1 px-2 cursor-pointer text-[#303133] text-base hover:text-primary"
              @click="prevMonth"
            >
              &lsaquo;
            </button>
            <span class="text-sm font-medium text-[#606266]">{{ currentYear }} {{ monthNames[currentMonth] }}</span>
            <button
              type="button"
              class="border-none bg-transparent py-1 px-2 cursor-pointer text-[#303133] text-base hover:text-primary"
              @click="nextMonth"
            >
              &rsaquo;
            </button>
            <button
              type="button"
              class="border-none bg-transparent py-1 px-2 cursor-pointer text-[#303133] text-base hover:text-primary"
              @click="nextYear"
            >
              &raquo;
            </button>
          </div>

          <!-- Calendar -->
          <div class="px-3">
            <div class="grid grid-cols-7 text-center pb-1">
              <span
                v-for="day in dayNames"
                :key="day"
                class="text-xs text-[#606266] font-normal py-0.5"
              >
                {{ day }}
              </span>
            </div>
            <div class="flex flex-col">
              <div
                v-for="(week, weekIndex) in calendarDays"
                :key="weekIndex"
                class="grid grid-cols-7"
              >
                <button
                  v-for="(day, dayIndex) in week"
                  :key="dayIndex"
                  type="button"
                  class="flex items-center justify-center w-[30px] h-[28px] mx-auto my-0.5
                  border-none rounded-full bg-transparent  text-[#606266]
                  transition-all"
                  :class="{
                    'text-[#c0c4cc] cursor-not-allowed': day.isOtherMonth || isDisabledDay(day),
                    'cursor-pointer hover:text-primary': !day.isOtherMonth && !isDisabledDay(day),
                    'bg-primary text-white hover:text-white': isSelectedDay(day) && !isDisabledDay(day),
                    'text-primary font-bold': isToday(day) && !isSelectedDay(day) && !isDisabledDay(day)
                  }"
                  :disabled="isDisabledDay(day) || day.isOtherMonth"
                  @click="selectDay(day)"
                >
                  {{ day.date }}
                </button>
              </div>
            </div>
          </div>

          <!-- Time picker wheels -->
          <div class="flex justify-center items-center py-3 border-t border-[#e4e7ed] gap-2">
            <div
              ref="hourWheelRef"
              class="relative h-[140px] w-[70px] overflow-hidden"
              @touchstart="onWheelTouchStart($event, 'hour')"
              @touchmove.prevent="onWheelTouchMove"
              @touchend="onWheelTouchEnd"
              @wheel.prevent="onWheelScroll($event, 'hour')"
            >
              <div class="absolute inset-x-0 top-[56px] h-[28px] bg-[#f5f7fa] rounded pointer-events-none z-0" />
              <div
                class="flex flex-col items-center transition-transform duration-200"
                :style="{ transform: `translateY(${hourOffset}px)` }"
              >
                <div
                  v-for="h in hourOptions"
                  :key="h"
                  class="h-[28px] flex items-center justify-center text-sm cursor-pointer select-none w-full"
                  :class="h === selectedHour
                    ? 'text-[#303133] font-semibold text-base'
                    : 'text-[#c0c4cc]'"
                  @click="selectHourWheel(h)"
                >
                  {{ String(h).padStart(2, '0') }}
                </div>
              </div>
            </div>
            <span class="text-base text-[#606266] font-semibold">:</span>
            <div
              ref="minuteWheelRef"
              class="relative h-[140px] w-[70px] overflow-hidden"
              @touchstart="onWheelTouchStart($event, 'minute')"
              @touchmove.prevent="onWheelTouchMove"
              @touchend="onWheelTouchEnd"
              @wheel.prevent="onWheelScroll($event, 'minute')"
            >
              <div class="absolute inset-x-0 top-[56px] h-[28px] bg-[#f5f7fa] rounded pointer-events-none z-0" />
              <div
                class="flex flex-col items-center transition-transform duration-200"
                :style="{ transform: `translateY(${minuteOffset}px)` }"
              >
                <div
                  v-for="m in minuteOptions"
                  :key="m"
                  class="h-[28px] flex items-center justify-center text-sm cursor-pointer select-none w-full"
                  :class="m === selectedMinute
                    ? 'text-[#303133] font-semibold text-base'
                    : 'text-[#c0c4cc]'"
                  @click="selectMinuteWheel(m)"
                >
                  {{ String(m).padStart(2, '0') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer buttons -->
          <div class="flex justify-end gap-2 py-2 px-3 border-t border-[#e4e7ed]">
            <button
              type="button"
              class="py-1.5 px-4 border border-[#dcdfe6] rounded bg-white cursor-pointer text-sm
              text-[#606266] hover:text-primary hover:border-primary"
              @click="closePicker"
            >
              {{ t('general.close') }}
            </button>
            <button
              type="button"
              class="py-1.5 px-4 border border-primary rounded bg-primary cursor-pointer text-sm
              text-white hover:opacity-90"
              @click="confirmSelection"
            >
              {{ t('general.ok') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface IProps {
  modelValue: Date | string | null
  placeholder?: string
  disabled?: boolean
  format?: string
}

const props = defineProps<IProps>()

const disabled = computed(() => props.disabled ?? false)
const placeholder = computed(() => props.placeholder ?? t('general.selectDateTime'))

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'change', value: Date | null): void
}>()

const pickerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const selectedDate = ref<Date | null>(null)
const selectedHour = ref(8)
const selectedMinute = ref(0)

const hourWheelRef = ref<HTMLElement | null>(null)
const minuteWheelRef = ref<HTMLElement | null>(null)

const hourOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const minuteOptions = Array.from({ length: 60 }, (_, i) => i)

const ITEM_HEIGHT = 28

const hourOffset = computed(() => {
  const idx = hourOptions.indexOf(selectedHour.value)
  return -(idx * ITEM_HEIGHT) + 2 * ITEM_HEIGHT
})

const minuteOffset = computed(() => {
  const idx = minuteOptions.indexOf(selectedMinute.value)
  return -(idx * ITEM_HEIGHT) + 2 * ITEM_HEIGHT
})

const selectHourWheel = (h: number) => {
  selectedHour.value = h
  updateSelectedDateTime()
}

const selectMinuteWheel = (m: number) => {
  selectedMinute.value = m
  updateSelectedDateTime()
}

// Touch/swipe support
let touchStartY = 0
let touchTarget: 'hour' | 'minute' | null = null

const onWheelTouchStart = (e: TouchEvent, target: 'hour' | 'minute') => {
  touchStartY = e.touches[0].clientY
  touchTarget = target
}

const onWheelTouchMove = (e: TouchEvent) => {
  e.preventDefault()
}

const onWheelTouchEnd = (e: TouchEvent) => {
  if (!touchTarget) return
  const deltaY = touchStartY - e.changedTouches[0].clientY
  const steps = Math.round(deltaY / ITEM_HEIGHT)
  if (steps === 0) return

  if (touchTarget === 'hour') {
    const idx = hourOptions.indexOf(selectedHour.value)
    const newIdx = Math.max(0, Math.min(hourOptions.length - 1, idx + steps))
    selectedHour.value = hourOptions[newIdx]
  } else {
    const idx = minuteOptions.indexOf(selectedMinute.value)
    const newIdx = Math.max(0, Math.min(minuteOptions.length - 1, idx + steps))
    selectedMinute.value = minuteOptions[newIdx]
  }
  updateSelectedDateTime()
  touchTarget = null
}

const onWheelScroll = (e: WheelEvent, target: 'hour' | 'minute') => {
  e.preventDefault()
  const direction = e.deltaY > 0 ? 1 : -1
  if (target === 'hour') {
    const idx = hourOptions.indexOf(selectedHour.value)
    const newIdx = Math.max(0, Math.min(hourOptions.length - 1, idx + direction))
    selectedHour.value = hourOptions[newIdx]
  } else {
    const idx = minuteOptions.indexOf(selectedMinute.value)
    const newIdx = Math.max(0, Math.min(minuteOptions.length - 1, idx + direction))
    selectedMinute.value = minuteOptions[newIdx]
  }
  updateSelectedDateTime()
}

const dayNames = computed(() => [
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

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return formatDateTime(selectedDate.value)
})

const calendarDays = computed(() => {
  const days: Array<Array<{ date: number; fullDate: Date; isOtherMonth: boolean }>> = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
  const startDay = (firstDay.getDay() + 6) % 7

  let currentWeek: Array<{ date: number; fullDate: Date; isOtherMonth: boolean }> = []

  // Previous month days
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i
    currentWeek.push({
      date,
      fullDate: new Date(currentYear.value, currentMonth.value - 1, date),
      isOtherMonth: true
    })
  }

  // Current month days
  for (let date = 1; date <= lastDay.getDate(); date++) {
    currentWeek.push({
      date,
      fullDate: new Date(currentYear.value, currentMonth.value, date),
      isOtherMonth: false
    })

    if (currentWeek.length === 7) {
      days.push(currentWeek)
      currentWeek = []
    }
  }

  // Next month days
  if (currentWeek.length > 0) {
    let nextDate = 1
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: nextDate,
        fullDate: new Date(currentYear.value, currentMonth.value + 1, nextDate),
        isOtherMonth: true
      })
      nextDate++
    }
    days.push(currentWeek)
  }

  return days
})

const isDisabledDay = (day: { fullDate: Date }): boolean => {
  const d = day.fullDate
  const dayOfWeek = d.getDay()
  // Disable weekends (Saturday=6, Sunday=0)
  if (dayOfWeek === 0 || dayOfWeek === 6) return true
  // Disable days before today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (d < today) return true
  return false
}

const formatDateTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const isSelectedDay = (day: { fullDate: Date }): boolean => {
  if (!selectedDate.value) return false
  return day.fullDate.toDateString() === selectedDate.value.toDateString()
}

const isToday = (day: { fullDate: Date }): boolean => {
  return day.fullDate.toDateString() === new Date().toDateString()
}

const togglePicker = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const prevMonth = () => {
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

const prevYear = () => {
  currentYear.value--
}

const nextYear = () => {
  currentYear.value++
}

const selectDay = (day: { fullDate: Date; isOtherMonth: boolean }) => {
  if (isDisabledDay(day) || day.isOtherMonth) return
  const newDate = new Date(day.fullDate)
  newDate.setHours(selectedHour.value, selectedMinute.value, 0, 0)
  selectedDate.value = newDate
}

const updateSelectedDateTime = () => {
  if (selectedDate.value) {
    const newDate = new Date(selectedDate.value)
    newDate.setHours(selectedHour.value, selectedMinute.value, 0, 0)
    selectedDate.value = newDate
  }
}

const closePicker = () => {
  isOpen.value = false
}

const clearValue = () => {
  selectedDate.value = null
  selectedHour.value = 8
  selectedMinute.value = 0
  emit('update:modelValue', null)
  emit('change', null)
}

const confirmSelection = () => {
  if (selectedDate.value) {
    const finalDate = new Date(selectedDate.value)
    finalDate.setHours(selectedHour.value, selectedMinute.value, 0, 0)
    emit('update:modelValue', finalDate)
    emit('change', finalDate)
  }
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return
  const target = event.target as Node
  if (
    pickerRef.value && !pickerRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = typeof newValue === 'string' ? new Date(newValue) : newValue
    selectedDate.value = date
    const h = date.getHours()
    selectedHour.value = Math.max(8, Math.min(19, h))
    selectedMinute.value = date.getMinutes()
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  } else {
    selectedDate.value = null
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
