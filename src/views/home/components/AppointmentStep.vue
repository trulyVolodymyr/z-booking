<template>
  <div>
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
          class="w-full border rounded-lg p-3 flex items-center gap-3
            cursor-pointer transition-colors"
          :class="selectedAppointment === appointment.time ?
            'border-primary bg-blue-50 shadow-md' : 'border-[#C2CDD6] hover:border-primary'"
          @click="selectAppointment(appointment.time)"
        >
          <div class="size-8 bg-[#E5F1FF] rounded flex items-center justify-center flex-shrink-0">
            <IconEvent class="text-primary" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-[#707070]">{{ parseDate(appointment.time) }}</span>
            <span class="text-sm font-semibold text-text">{{ parseTime(appointment.time) }}</span>
          </div>
        </div>
      </div>

      <!-- OR divider -->
      <div class="my-4 uppercase font-semibold text-text text-sm flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
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
      <div v-if="selectedDate" class="mt-4">
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
                class="w-full h-[40px] border rounded-lg flex items-center justify-center text-sm
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
                class="w-full h-[40px] border rounded-lg flex items-center justify-center text-sm
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
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 text-primary mb-4"
          @click="emit('go-back')"
        >
          <IconArrowBack class="text-primary size-6" />
        </button>
        <p class="font-semibold text-2xl text-text mb-4 font-serif">
          {{ $t('general.selectDesiredAppointment') }}
        </p>
      </div>
      <p class="text-text mb-4">
        {{ $t('general.appointmentDescription') }}
      </p>

      <p class="font-semibold text-text">
        {{ $t('general.nextAvailableAppointment') }}
      </p>

      <div class="flex gap-6 mt-4">
        <div
          v-for="(appointment, index) in quickAppointments"
          :key="index"
          class="w-1/3 h-16 border rounded-lg p-3 flex items-center gap-3
              cursor-pointer transition-colors"
          :class="selectedAppointment === appointment.time ?
            'border-primary bg-blue-50 shadow-md' : 'border-[#C2CDD6] hover:border-primary hover:shadow-md'"
          @click="selectAppointment(appointment.time)"
        >
          <div class="size-8 bg-[#E5F1FF] rounded flex items-center justify-center flex-shrink-0">
            <IconEvent class="text-primary" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-[#707070]">{{ parseDate(appointment.time) }}</span>
            <span class="text-base font-semibold text-text">{{ parseTime(appointment.time) }}</span>
          </div>
        </div>
      </div>

      <div class="my-6 uppercase font-semibold text-text flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      </div>

      <div class="flex w-full gap-6">
        <div>
          <span class="font-semibold text-text mb-3 block">
            {{ $t('general.chooseDesiredAppointment') }}
          </span>
          <CustomCalendar
            v-model="selectedDate"
            :available-days="availableDays"
          />
        </div>

        <div v-if="selectedDate" class="flex-1 mt-9">
          <!-- No times available message -->
          <div v-if="morningTimes.length === 0 && afternoonTimes.length === 0" class="text-center py-8">
            <p class="text-text opacity-60">{{ $t('general.noAvailableTimeSlots') }}</p>
          </div>

          <!-- Morning Times -->
          <div
            class="mb-6 border border-[#E6EBEF] rounded-[10px] h-[123px] flex items-center
            p-1 1080:p-4 gap-2 1080:gap-3 bg-primaryBg "
          >
            <!-- Rotated Title -->
            <div class="flex items-center justify-center" style="writing-mode: vertical-rl; transform: rotate(180deg);">
              <span class="font-semibold text-text whitespace-nowrap">{{ $t('general.morning') }}</span>
            </div>

            <!-- Empty State -->
            <div v-if="morningTimes.length === 0" class="flex-1 flex items-center justify-center mx-10">
              <p class="text-text opacity-60 text-sm text-center italic">
                {{ $t('general.noMorningAppointments') }}
              </p>
            </div>

            <!-- Time Slots -->
            <template v-else>
              <!-- Left Arrow -->
              <button
                :disabled="morningOffset === 0"
                class="size-5 1080:size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                  hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                @click="prevMorningPage"
              >
                <IconLeft class="size-2 1080:size-4" />
              </button>

              <!-- Time Slots Grid -->
              <div class="flex-1 grid grid-cols-3 gap-1 1080:gap-3">
                <button
                  v-for="(time, index) in visibleMorningTimes"
                  :key="index"
                  class="h-[36px] 1080:h-[46px] border rounded-lg flex items-center
                    justify-center text-[10px] 1080:text-sm transition-all"
                  :class="selectedTime === time ?
                    'border-primary text-primary shadow-md font-semibold' :
                    'border-[#C2CDD6] text-text hover:border-primary hover:shadow-md'"
                  @click="selectTime(time)"
                >
                  {{ time }}
                </button>
              </div>

              <!-- Right Arrow -->
              <button
                :disabled="morningOffset + visibleMorningTimes.length >= morningTimes.length"
                class="size-5 1080:size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                  hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                @click="nextMorningPage"
              >
                <IconRight class="size-2 1080:size-4" />
              </button>
            </template>
          </div>

          <!-- Afternoon Times -->
          <div
            class="border border-[#E6EBEF] rounded-[10px] h-[123px] flex items-center
            p-3 1080:p-4 gap-1 1080:gap-3 bg-primaryBg "
          >
            <!-- Rotated Title -->
            <div class="flex items-center justify-center" style="writing-mode: vertical-rl; transform: rotate(180deg);">
              <span class="font-semibold text-text whitespace-nowrap">{{ $t('general.afternoon') }}</span>
            </div>

            <!-- Empty State -->
            <div v-if="afternoonTimes.length === 0" class="flex-1 flex items-center justify-center mx-10">
              <p class="text-text opacity-60 text-sm text-center italic">
                {{ $t('general.noAfternoonAppointments') }}
              </p>
            </div>

            <!-- Time Slots -->
            <template v-else>
              <!-- Left Arrow -->
              <button
                :disabled="afternoonOffset === 0"
                class="size-5 1080:size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                  hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                @click="prevAfternoonPage"
              >
                <IconLeft class="size-2 1080:size-4" />
              </button>

              <!-- Time Slots Grid -->
              <div class="flex-1 grid grid-cols-3 gap-1 1080:gap-3">
                <button
                  v-for="(time, index) in visibleAfternoonTimes"
                  :key="index"
                  class="h-[46px] border rounded-lg flex items-center justify-center text-[10px] 1080:text-sm
                    transition-all"
                  :class="selectedTime === time ?
                    'border-primary text-primary shadow-md font-semibold' :
                    'border-[#C2CDD6] text-text hover:border-primary hover:shadow-md'"
                  @click="selectTime(time)"
                >
                  {{ time }}
                </button>
              </div>

              <!-- Right Arrow -->
              <button
                :disabled="afternoonOffset + visibleAfternoonTimes.length >= afternoonTimes.length"
                class="size-5 1080:size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                  hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                @click="nextAfternoonPage"
              >
                <IconRight class="size-2 1080:size-4" />
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import CustomCalendar from '@/components/CustomCalendar.vue'
import { createReservation } from '@/api/services/general.service'
import { useNotification } from '@/composables/useNotification'

const { t } = useI18n()

interface IProps {
  token: string
  isMobile?: boolean
}

interface IEmits {
  (e: 'go-back'): void
}

const props = withDefaults(defineProps<IProps>(), {
  isMobile: false
})
const emit = defineEmits<IEmits>()
const { error } = useNotification()

interface IAppointment {
  time: string
}

const {
  selectedAppointment,
  availableDays,
  availableTimes,
  quickAppointments: rawQuickAppointments,
  selectedDate,
  selectedTime,
  selectedJobs,
  reservationId
} = useAppointmentBooking()

// Flag to prevent watch from triggering when reservation is made programmatically
const isUpdatingReservation = ref(false)

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

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')

  return `${dayName} ${month}/${day}/${year} ${hours}:${minutesStr} ${period}`
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

const morningOffset = ref(0)
const afternoonOffset = ref(0)

// Watch for selectedDate changes to reset UI state
watch(selectedDate, (newDate, oldDate) => {
  if (newDate) {
    // If date changed and we have a quick appointment selected, check if date matches
    if (selectedAppointment.value && oldDate !== newDate) {
      // Parse the date from quick appointment to see if it matches new date
      const parts = selectedAppointment.value.split(' ')
      const dateParts = parts[1].split('/')
      const quickAppDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`

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

// Parse ISO format time to 12-hour format (e.g., "2025-12-10T10:00:00" -> "10:00 AM")
const formatTime = (isoTime: string): string => {
  const date = new Date(isoTime)
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  hours = hours % 12
  hours = hours || 12 // 0 should be 12

  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours}:${minutesStr} ${period}`
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

// Get visible times for current offset (max 6 at a time)
const visibleMorningTimes = computed(() => {
  const remaining = morningTimes.value.slice(morningOffset.value)
  return remaining.slice(0, 6)
})

const visibleAfternoonTimes = computed(() => {
  const remaining = afternoonTimes.value.slice(afternoonOffset.value)
  return remaining.slice(0, 6)
})

// Navigation functions
const nextMorningPage = () => {
  // Move forward by 6
  morningOffset.value += 6
}

const prevMorningPage = () => {
  // Move backward by 6 (or to 0)
  morningOffset.value = Math.max(0, morningOffset.value - 6)
}

const nextAfternoonPage = () => {
  // Move forward by 6
  afternoonOffset.value += 6
}

const prevAfternoonPage = () => {
  // Move backward by 6 (or to 0)
  afternoonOffset.value = Math.max(0, afternoonOffset.value - 6)
}

// Convert date and time to ISO datetime string for API
const convertToISODateTime = (date: string, time: string): string => {
  // date is in YYYY-MM-DD format
  // time is in "10:30 AM" format
  const [timeStr, period] = time.split(' ')
  const [hoursStr, minutesStr] = timeStr.split(':')
  let hours = parseInt(hoursStr)
  const minutes = parseInt(minutesStr)

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }

  // Create ISO datetime string
  const isoDateTime = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  return isoDateTime
}

const makeReservation = async (date: string, time: string) => {
  try {
    const isoDateTime = convertToISODateTime(date, time)
    const workIds = selectedJobs.value.map(job => job.option.id)

    const response = await createReservation({
      token: props.token,
      time: isoDateTime,
      workIds,
      externalPortal: 'My portal',
      existingReservationId: reservationId.value,
      vip: false,
      expectedReservationPeriod: 5
    })

    // Store the reservation ID for future updates
    if (response.reservation?.appointmentId) {
      reservationId.value = response.reservation?.appointmentId
    }
  } catch (err: any) {
    // Extract error message from API response
    const errorMessage = err?.response?.data?.error || err?.message || 'Failed to create reservation. Please try again.'
    error(errorMessage)
  }
}

// Watch for changes in jobs, date, or time and update reservation
watch([selectedJobs, selectedDate, selectedTime], ([newJobs, newDate, newTime], [oldJobs, oldDate, oldTime]) => {
  // Skip if we're already making a reservation programmatically
  if (isUpdatingReservation.value) {
    return
  }

  // Only update if we have a reservation and something changed
  if (reservationId.value && newDate && newTime && newJobs.length > 0) {
    // Check if jobs changed
    const jobsChanged = oldJobs && JSON.stringify(newJobs) !== JSON.stringify(oldJobs)
    // Check if date or time changed
    const dateTimeChanged = (oldDate && oldDate !== newDate) || (oldTime && oldTime !== newTime)

    if (jobsChanged || dateTimeChanged) {
      makeReservation(newDate, newTime)
    }
  }
}, { deep: true })

const selectTime = async (time: string) => {
  // Clear quick appointment selection when manually selecting time
  selectedAppointment.value = null

  if (selectedTime.value === time) {
    selectedTime.value = null
    reservationId.value = null
  } else {
    // Set flag to prevent watch from triggering
    isUpdatingReservation.value = true
    selectedTime.value = time

    // Create reservation when time is selected
    if (selectedDate.value && selectedJobs.value.length > 0) {
      await makeReservation(selectedDate.value, time)
    }

    // Reset flag
    isUpdatingReservation.value = false
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
  return `${parts[2]} ${parts[3]}`
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
    // Set flag to prevent watch from triggering
    isUpdatingReservation.value = true

    selectedAppointment.value = time

    // Parse the time string: "Fri. 01/21/2025 10:30 AM"
    const parts = time.split(' ')
    // parts[1] is the date in MM/DD/YYYY format
    const dateParts = parts[1].split('/')
    const month = dateParts[0]
    const day = dateParts[1]
    const year = dateParts[2]

    // Convert to ISO format YYYY-MM-DD
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    // Extract time: "10:30 AM"
    const timeStr = `${parts[2]} ${parts[3]}`

    // Store the time to be set after times are loaded
    pendingTimeSelection.value = timeStr

    // Set date (Home.vue watches selectedDate and fetches available times)
    selectedDate.value = isoDate

    // Set time immediately for reservation (it will also be set when times load)
    selectedTime.value = timeStr

    // Create reservation for quick appointment
    if (selectedJobs.value.length > 0) {
      await makeReservation(isoDate, timeStr)
    }

    // Reset flag
    isUpdatingReservation.value = false
  }
}
</script>
