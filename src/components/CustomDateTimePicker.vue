<template>
  <div ref="pickerRef" class="inline-block w-full">
    <!-- Input trigger -->
    <div
      class="flex items-center gap-2 p-1 1250:py-2 1250:px-3 border border-[#dcdfe6] rounded bg-white cursor-pointer
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
        class="flex-1 border-none outline-none bg-transparent 1250:text-sm text-xs text-[#606266]
          cursor-inherit placeholder:text-[#c0c4cc] disabled:cursor-not-allowed"
      >
      <div
        v-if="displayValue"
        class="w-4 shrink-0 h-4 flex items-center justify-center text-[#c0c4cc] hover:text-[#909399] cursor-pointer
        -ml-3"
        @click.stop="clearValue"
      >
        ×
      </div>
    </div>

    <!-- Dropdown panel -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="bg-white border border-[#e4e7ed] rounded shadow-lg w-[280px]"
        :style="dropdownStyle"
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
                  border-none rounded-full bg-transparent cursor-pointer text-xs text-[#606266]
                  transition-all hover:text-primary"
                :class="{
                  'text-[#c0c4cc]': day.isOtherMonth,
                  'bg-primary text-white hover:text-white': isSelectedDay(day),
                  'text-primary font-bold': isToday(day) && !isSelectedDay(day)
                }"
                @click="selectDay(day)"
              >
                {{ day.date }}
              </button>
            </div>
          </div>
        </div>

        <!-- Time picker -->
        <div class="flex justify-center py-2 border-t border-[#e4e7ed]">
          <div class="flex items-center gap-1">
            <input
              v-model.number="selectedHour"
              type="number"
              min="0"
              max="23"
              class="w-[70px] py-1.5 px-2 border border-[#dcdfe6] rounded text-center text-sm
                focus:outline-none focus:border-primary"
              @change="validateHour"
            >
            <span class="text-base text-[#606266]">:</span>
            <input
              v-model.number="selectedMinute"
              type="number"
              min="0"
              max="59"
              class="w-[70px] py-1.5 px-2 border border-[#dcdfe6] rounded text-center text-sm
                focus:outline-none focus:border-primary"
              @change="validateMinute"
            >
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
const selectedHour = ref(0)
const selectedMinute = ref(0)

const dayNames = computed(() => [
  t('general.sun'),
  t('general.mon'),
  t('general.tue'),
  t('general.wed'),
  t('general.thu'),
  t('general.fri'),
  t('general.sat')
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

const dropdownStyle = ref({
  position: 'fixed' as const,
  top: '0px',
  left: '0px',
  zIndex: 2000
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return formatDateTime(selectedDate.value)
})

const calendarDays = computed(() => {
  const days: Array<Array<{ date: number; fullDate: Date; isOtherMonth: boolean }>> = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDay = firstDay.getDay()

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

const formatDateTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
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
  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition()
    })
  }
}

const updateDropdownPosition = () => {
  if (!pickerRef.value) return
  const rect = pickerRef.value.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    zIndex: 2000
  }
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
  const newDate = new Date(day.fullDate)
  newDate.setHours(selectedHour.value, selectedMinute.value, 0, 0)
  selectedDate.value = newDate

  if (day.isOtherMonth) {
    currentMonth.value = day.fullDate.getMonth()
    currentYear.value = day.fullDate.getFullYear()
  }
}

const validateHour = () => {
  if (selectedHour.value < 0) selectedHour.value = 0
  if (selectedHour.value > 23) selectedHour.value = 23
  updateSelectedDateTime()
}

const validateMinute = () => {
  if (selectedMinute.value < 0) selectedMinute.value = 0
  if (selectedMinute.value > 59) selectedMinute.value = 59
  updateSelectedDateTime()
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
  selectedHour.value = 0
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
    selectedHour.value = date.getHours()
    selectedMinute.value = date.getMinutes()
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  } else {
    selectedDate.value = null
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', updateDropdownPosition)
  window.addEventListener('resize', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>
