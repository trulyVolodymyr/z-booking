<template>
  <div class="w-full 900:flex-1 900:flex 900:flex-col 900:min-h-0">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        {{ $t('general.appointmentDescriptionShort') }}
      </p>
      <!-- Quick Appointments - Full Width -->
      <div class="space-y-2 mb-4">
        <div
          v-for="(appointment, index) in quickAppointments"
          :key="index"
          class="w-full border rounded-xl p-3 flex items-center gap-3
            cursor-pointer transition-colors"
          :class="selectedAppointment === appointment.time ?
            'border-primary bg-blue-50 shadow-md' : 'border-[#C2CDD6] hover:border-primary'"
          @click="selectAppointment(appointment.time)"
        >
          <div class="size-8 bg-[#E5F1FF] rounded-md flex items-center justify-center flex-shrink-0">
            <IconEvent class="text-primary" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-[#6b7280]">{{ parseDate(appointment.time) }}</span>
            <span class="text-sm font-semibold text-text">{{ parseTime(appointment.time) }}</span>
          </div>
        </div>
      </div>

      <!-- OR divider -->
      <div class="my-4 uppercase font-semibold text-[#859bad] text-sm flex items-center">
        <div class="flex-1 h-px bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-px bg-[#DAE1E7]" />
      </div>

      <!-- Calendar - Full Width -->
      <div class="mb-4">
        <CustomCalendar
          v-model="selectedDate"
          :available-days="availableDays"
          class="w-full"
        />
      </div>

      <!-- Time Slots - Two Columns -->
      <div v-if="selectedDate" ref="mobileTimeSlotsRef" class="mt-4">
        <!-- No times available message -->
        <div v-if="morningTimes.length === 0 && afternoonTimes.length === 0" class="text-center py-4">
          <p class="text-text opacity-60 text-sm">{{ $t('general.noAvailableTimeSlots') }}</p>
        </div>

        <!-- Two Column Layout for Times -->
        <div v-else class="grid grid-cols-2 gap-4">
          <!-- Morning Column -->
          <div>
            <p class="font-semibold text-text text-sm mb-2 text-center">{{ $t('general.morning') }}</p>
            <div class="space-y-2">
              <button
                v-for="(time, index) in morningTimes"
                :key="index"
                class="w-full h-[40px] border rounded-md flex items-center justify-center text-sm
                  transition-all"
                :class="selectedTime === time ?
                  'border-primary text-primary bg-blue-50 font-semibold' :
                  'border-[#C2CDD6] text-text hover:border-primary'"
                @click="selectTime(time)"
              >
                {{ time }}
              </button>
            </div>
          </div>

          <!-- Afternoon Column -->
          <div>
            <p class="font-semibold text-text text-sm mb-2 text-center">{{ $t('general.afternoon') }}</p>
            <div class="space-y-2">
              <button
                v-for="(time, index) in afternoonTimes"
                :key="index"
                class="w-full h-[40px] border rounded-md flex items-center justify-center text-sm
                  transition-all"
                :class="selectedTime === time ?
                  'border-primary text-primary bg-blue-50 font-semibold' :
                  'border-[#C2CDD6] text-text hover:border-primary'"
                @click="selectTime(time)"
              >
                {{ time }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Desktop Layout -->
    <template v-else>
      <!-- Header (stays fixed above the scroll area) -->
      <div class="flex items-center gap-3 shrink-0 mb-6">
        <button class="flex items-center text-primary" @click="emit('go-back')">
          <IconArrowBack class="text-primary size-6" />
        </button>
        <p class="font-serif font-semibold text-2xl text-text">
          {{ $t('general.scheduleYourAppointment') }}
        </p>
      </div>

      <!-- Scrollable content -->
      <div class="flex flex-col gap-5 900:flex-1 900:min-h-0 900:overflow-y-auto 900:pr-1">
        <!-- Next available appointment -->
        <div class="flex flex-col gap-3">
          <p class="font-semibold text-base text-text">
            {{ $t('general.nextAvailableAppointment') }}
          </p>
          <div class="flex gap-6">
            <div
              v-for="(appointment, index) in quickAppointments"
              :key="index"
              class="flex-1 border rounded-xl p-[10px] flex items-center gap-4
                cursor-pointer transition-colors shadow-sm"
              :class="selectedAppointment === appointment.time ?
                'border-primary bg-blue-50 shadow-md' : 'border-[#C2CDD6] hover:border-primary hover:shadow-md'"
              @click="selectAppointment(appointment.time)"
            >
              <div class="size-8 bg-[#E5F1FF] rounded-md flex items-center justify-center flex-shrink-0">
                <IconEvent class="text-primary" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-[#6b7280]">{{ parseDate(appointment.time) }}</span>
                <span class="text-base font-semibold text-text">{{ parseTime(appointment.time) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- OR divider -->
        <div class="uppercase font-semibold text-[#859bad] flex items-center gap-2">
          <div class="flex-1 h-px bg-[#dae1e7]" />
          <span>{{ $t('general.or') }}</span>
          <div class="flex-1 h-px bg-[#dae1e7]" />
        </div>

        <!-- Choose desired appointment -->
        <div class="flex flex-col gap-3">
          <p class="font-semibold text-base text-text">
            {{ $t('general.chooseDesiredAppointment') }}
          </p>
          <div class="flex gap-6">
            <div class="shrink-0">
              <CustomCalendar
                v-model="selectedDate"
                :available-days="availableDays"
              />
            </div>

            <div v-if="selectedDate" class="flex-1 min-w-0 flex flex-col justify-between">
              <!-- No times available message -->
              <div v-if="!loading && morningTimes.length === 0 && afternoonTimes.length === 0" class="text-center py-8">
                <p class="text-text opacity-60">{{ $t('general.noAvailableTimeSlots') }}</p>
              </div>

              <template v-else>
                <!-- Morning -->
                <div class="border border-[#E6EBEF] rounded-[10px] p-3 flex gap-3 items-center bg-primaryBg">
                  <div
                    class="flex items-center justify-center shrink-0"
                    style="writing-mode: vertical-rl; transform: rotate(180deg);"
                  >
                    <span class="font-medium text-base text-text whitespace-nowrap">{{ $t('general.morning') }}</span>
                  </div>

                  <div
                    v-if="!loading && morningTimes.length === 0"
                    class="flex-1 flex items-center justify-center py-4"
                  >
                    <p class="text-text opacity-60 text-sm text-center italic">
                      {{ $t('general.noMorningAppointments') }}
                    </p>
                  </div>

                  <div v-else class="flex-1 grid grid-cols-3 gap-2">
                    <button
                      v-for="(time, index) in visibleMorningTimes"
                      :key="index"
                      class="h-9 rounded-md border flex items-center justify-center text-sm transition-all"
                      :class="selectedTime === time ?
                        'border-primary text-primary font-semibold' :
                        'border-[#C2CDD6] text-text hover:border-primary hover:shadow-md'"
                      @click="selectTime(time)"
                    >
                      {{ time }}
                    </button>
                    <button
                      v-if="morningTimes.length > pageSize"
                      class="h-9 rounded-md bg-[#E5F1FF] text-primary font-semibold text-xs
                        flex items-center justify-center gap-1"
                      @click="moreMorning"
                    >
                      {{ $t('general.moreAppointments') }}
                      <IconRight
                        class="more-arrow size-4 transition-transform"
                        :class="{ 'rotate-180': isMorningLastPage }"
                      />
                    </button>
                  </div>
                </div>

                <!-- Afternoon -->
                <div class="border border-[#E6EBEF] rounded-[10px] p-3 flex gap-3 items-center bg-primaryBg">
                  <div
                    class="flex items-center justify-center shrink-0"
                    style="writing-mode: vertical-rl; transform: rotate(180deg);"
                  >
                    <span class="font-medium text-base text-text whitespace-nowrap">{{ $t('general.afternoon') }}</span>
                  </div>

                  <div
                    v-if="!loading && afternoonTimes.length === 0"
                    class="flex-1 flex items-center justify-center py-4"
                  >
                    <p class="text-text opacity-60 text-sm text-center italic">
                      {{ $t('general.noAfternoonAppointments') }}
                    </p>
                  </div>

                  <div v-else class="flex-1 grid grid-cols-3 gap-2">
                    <button
                      v-for="(time, index) in visibleAfternoonTimes"
                      :key="index"
                      class="h-9 rounded-md border flex items-center justify-center text-sm transition-all"
                      :class="selectedTime === time ?
                        'border-primary text-primary font-semibold' :
                        'border-[#C2CDD6] text-text hover:border-primary hover:shadow-md'"
                      @click="selectTime(time)"
                    >
                      {{ time }}
                    </button>
                    <button
                      v-if="afternoonTimes.length > pageSize"
                      class="h-9 rounded-md bg-[#E5F1FF] text-primary font-semibold text-xs
                        flex items-center justify-center gap-1"
                      @click="moreAfternoon"
                    >
                      {{ $t('general.moreAppointments') }}
                      <IconRight
                        class="more-arrow size-4 transition-transform"
                        :class="{ 'rotate-180': isAfternoonLastPage }"
                      />
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import CustomCalendar from '@/components/CustomCalendar.vue'

const { t } = useI18n()

interface IProps {
  isMobile?: boolean
}

interface IEmits {
  (e: 'go-back'): void
}

const props = withDefaults(defineProps<IProps>(), {
  isMobile: false
})
const emit = defineEmits<IEmits>()

interface IAppointment {
  time: string
}

const {
  loading,
  selectedAppointment,
  availableDays,
  availableTimes,
  quickAppointments: rawQuickAppointments,
  selectedDate,
  selectedTime,
  reservationId
} = useAppointmentBooking()

// Format quick appointments for display
const formatQuickAppointment = (isoDateTime: string): string => {
  const date = new Date(isoDateTime)
  const days = [
    t('general.sun'),
    t('general.mon'),
    t('general.tue'),
    t('general.wed'),
    t('general.thu'),
    t('general.fri'),
    t('general.sat')
  ]
  const dayName = days[date.getDay()]
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutesStr = date.getMinutes().toString().padStart(2, '0')

  return `${dayName} ${day}.${month}.${year} ${hours}:${minutesStr}`
}

const quickAppointments = computed<IAppointment[]>(() => {
  if (!rawQuickAppointments.value || !Array.isArray(rawQuickAppointments.value)) {
    return []
  }

  // rawQuickAppointments already contains 1 morning + 2 afternoon, sorted by date
  // Just format them for display
  return rawQuickAppointments.value.map((time: string) => ({
    time: formatQuickAppointment(time)
  }))
})

const pageSize = 5
const morningOffset = ref(0)
const afternoonOffset = ref(0)
const mobileTimeSlotsRef = ref<HTMLElement | null>(null)

// Watch for selectedDate changes to reset UI state
watch(selectedDate, (newDate, oldDate) => {
  if (newDate) {
    // If date changed and we have a quick appointment selected, check if date matches
    if (selectedAppointment.value && oldDate !== newDate) {
      // Parse the date from quick appointment to see if it matches new date
      const parts = selectedAppointment.value.split(' ')
      const dateParts = parts[1].split('.')
      const quickAppDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`

      // If dates don't match, user manually changed date - clear quick appointment and time
      if (quickAppDate !== newDate) {
        selectedAppointment.value = null
        selectedTime.value = null
      }
    } else if (!selectedAppointment.value && oldDate !== newDate) {
      // No quick appointment - just reset time selection
      selectedTime.value = null
    }

    morningOffset.value = 0
    afternoonOffset.value = 0
  }
})

watch(availableTimes, (newTimes) => {
  if (props.isMobile && newTimes.length > 0 && selectedDate.value) {
    nextTick(() => {
      mobileTimeSlotsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})

const formatTime = (isoTime: string): string => {
  const date = new Date(isoTime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutesStr = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutesStr}`
}

// Split times into morning (AM) and afternoon (PM)
const morningTimes = computed(() => {
  if (!availableTimes.value || !Array.isArray(availableTimes.value)) return []
  return availableTimes.value
    .filter(time => {
      const date = new Date(time)
      return date.getHours() < 12
    })
    .map(formatTime)
})

const afternoonTimes = computed(() => {
  if (!availableTimes.value || !Array.isArray(availableTimes.value)) return []
  return availableTimes.value
    .filter(time => {
      const date = new Date(time)
      return date.getHours() >= 12
    })
    .map(formatTime)
})

// Get visible times for current page (max 5 at a time, leaving room for the "More" cell)
const visibleMorningTimes = computed(() => {
  return morningTimes.value.slice(morningOffset.value, morningOffset.value + pageSize)
})

const visibleAfternoonTimes = computed(() => {
  return afternoonTimes.value.slice(afternoonOffset.value, afternoonOffset.value + pageSize)
})

// True when showing the last page of slots — the next "more" click wraps back to the start,
// so the arrow points left to signal that.
const isMorningLastPage = computed(() => morningOffset.value + pageSize >= morningTimes.value.length)
const isAfternoonLastPage = computed(() => afternoonOffset.value + pageSize >= afternoonTimes.value.length)

// Advance to the next page of slots; wrap to the start after the last page
const moreMorning = () => {
  const next = morningOffset.value + pageSize
  morningOffset.value = next < morningTimes.value.length ? next : 0
}

const moreAfternoon = () => {
  const next = afternoonOffset.value + pageSize
  afternoonOffset.value = next < afternoonTimes.value.length ? next : 0
}

const selectTime = async (time: string) => {
  // Clear quick appointment selection when manually selecting time
  selectedAppointment.value = null

  if (selectedTime.value === time) {
    selectedTime.value = null
    reservationId.value = null
  } else {
    selectedTime.value = time
  }
}

const parseDate = (datetime: string): string => {
  // Extract date part (everything before the time)
  const parts = datetime.split(' ')
  // Return first 2 parts (e.g., "Fri. 01/21/2025")
  return `${parts[0]} ${parts[1]}`
}

const parseTime = (datetime: string): string => {
  // Extract time part (last 2 parts)
  const parts = datetime.split(' ')
  // Return last 2 parts (e.g., "10:30 AM")
  return `${parts[2]}`
}

// Store pending time to set after times are loaded
const pendingTimeSelection = ref<string | null>(null)

// Watch for availableTimes changes to set pending time selection
watch(availableTimes, (newTimes) => {
  if (pendingTimeSelection.value && newTimes && newTimes.length > 0) {
    selectedTime.value = pendingTimeSelection.value
    pendingTimeSelection.value = null
  }
})

const selectAppointment = async (time: string) => {
  if (selectedAppointment.value === time) {
    selectedAppointment.value = null
    selectedDate.value = null
    selectedTime.value = null
    reservationId.value = null
    pendingTimeSelection.value = null
  } else {
    selectedAppointment.value = time

    // Parse the time string: "Fri 21.01.2025 10:30"
    const parts = time.split(' ')
    // parts[1] is the date in DD.MM.YYYY format
    const dateParts = parts[1].split('.')
    const day = dateParts[0]
    const month = dateParts[1]
    const year = dateParts[2]

    // Convert to ISO format YYYY-MM-DD
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    // Extract time: "10:30"
    const timeStr = parts[2]

    // Store the time to be set after times are loaded
    pendingTimeSelection.value = timeStr

    // Set date (Home.vue watches selectedDate and fetches available times)
    selectedDate.value = isoDate

    // Set time immediately for reservation (it will also be set when times load)
    selectedTime.value = timeStr
  }
}
</script>

<style scoped>
/* The "more appointments" arrow icon ships with a hardcoded dark stroke; tint it primary. */
.more-arrow :deep(path) {
  stroke: var(--el-color-primary);
}
</style>
