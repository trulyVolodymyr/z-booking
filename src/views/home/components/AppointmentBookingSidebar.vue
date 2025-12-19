<template>
  <div class="w-[300px] h-full p-3 1080:p-5 flex flex-col bg-[#F9F9F9] shrink-0">
    <span class="font-semibold text-xl text-text">
      Appointment booking
    </span>

    <div class="w-full h-[1px] bg-text mt-2 mb-2" />

    <div class="flex flex-col flex-1 min-h-0">
      <!-- Appointment Section -->
      <div v-if="selectedDate && selectedTime">
        <p class="font-semibold text text-[#547278] mb-2">
          Appointment
        </p>
        <div>
          <p class="text-text opacity-60 text-sm mb-1">
            {{ formatDayOfWeek(selectedDate) }}
          </p>
          <p class="font-semibold text-text mb-3">
            {{ formatDate(selectedDate) }} - {{ selectedTime }}
          </p>
          <p class="text-text opacity-60 text-[10px] leading-relaxed">
            Your service will be performed on the selected day. You can pick up your vehicle shortly
            before closing time and will receive additional information once it is ready for pickup.
          </p>
        </div>
      </div>

      <div v-if="selectedDate && selectedTime" class="w-full h-[1px] bg-[#DEE0E1] mt-2 mb-2" />

      <div
        v-if="selectedJobs.length > 0"
        ref="servicesContainer"
        class="overflow-y-auto flex-shrink min-h-0"
        :class="{ '-mr-3': hasScroll }"
      >
        <p class="font-semibold text-lg text-text mb-2">
          Services
        </p>
        <div class="space-y-2">
          <div
            v-for="(job, index) in selectedJobs"
            :key="index"
            class="border-b border-[#E6EBEF] pb-2"
          >
            <div class="flex items-center justify-between gap-1">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text text-sm">
                  {{ getShortLabel(job.option.label) }}
                </p>
              </div>
              <button
                class="size-5 flex items-center justify-center border bg-[#F9FAFB] rounded
                transition-colors flex-shrink-0 border-[#C2CDD6] hover:border-primary hover:shadow-md"
                @click="handleRemoveJob(index)"
              >
                <IconDelete class="size-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1" />

      <div v-if="selectedAdditionalInfo.length > 0" class="mb-4">
        <p class="font-semibold text-lg text-text mb-4">
          Additional Information
        </p>
        <div class="space-y-2">
          <div
            v-for="(info, index) in selectedAdditionalInfo"
            :key="index"
            class="border-b border-[#E6EBEF] pb-2"
          >
            <div class="flex items-center justify-between gap-1">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text text-sm">
                  {{ info }}
                </p>
              </div>
              <button
                class="size-5 flex items-center justify-center border bg-[#F9FAFB] rounded
                transition-colors flex-shrink-0 border-[#C2CDD6] hover:border-primary hover:shadow-md"
                @click="handleRemoveAdditionalInfo(index)"
              >
                <IconDelete class="size-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        class="w-full py-3 rounded-lg font-semibold text-white transition-colors"
        :class="(isContinueDisabled || isConfirming)
          ? 'bg-[#C2CDD6] cursor-not-allowed'
          : 'bg-primary hover:bg-blue-600'"
        :disabled="isContinueDisabled || isConfirming"
        @click="handleContinue"
      >
        {{
          activeStep === 3
            ? (isConfirming ? 'Confirming...' : 'Confirm Booking')
            : 'Continue'
        }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import { confirmBooking } from '@/api/services/general.service'
import { useNotification } from '@/composables/useNotification'

export interface ISelectedJob {
  serviceTitle: string
  option: {
    id: number
    label: string
  }
}

interface IProps {
  selectedJobs: ISelectedJob[]
  selectedAdditionalInfo: string[]
  selectedAppointment: string | null
  activeStep: number
  token: string
}

interface IEmits {
  (e: 'remove-job', index: number): void
  (e: 'remove-additional-info', index: number): void
  (e: 'continue'): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const {
  selectedDate,
  selectedTime,
  isContinueDisabled,
  bookingInfo,
  reservationId,
  bookingSuccess
} = useAppointmentBooking()
const { error, success } = useNotification()

const isConfirming = ref(false)

const servicesContainer = ref<HTMLElement | null>(null)
const hasScroll = ref(false)

const checkScroll = () => {
  if (servicesContainer.value) {
    hasScroll.value = servicesContainer.value.scrollHeight > servicesContainer.value.clientHeight
  }
}

onMounted(() => {
  nextTick(() => {
    checkScroll()
  })
})

watch(() => props.selectedJobs, () => {
  nextTick(() => {
    checkScroll()
  })
}, { deep: true })

const formatDayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

const getShortLabel = (label: string) => {
  if (label.includes('Inspection according to manufacturer\'s specifications')) {
    const kmMatch = label.match(/(\d+[,\s]*\d*)\s*km/)
    if (kmMatch) {
      return `Inspection - ${kmMatch[1]} km`
    }
  }

  return label.length > 30 ? label.substring(0, 30) + '...' : label
}

const handleRemoveJob = (index: number) => {
  emit('remove-job', index)
}

const handleRemoveAdditionalInfo = (index: number) => {
  emit('remove-additional-info', index)
}

const handleConfirmBooking = async () => {
  try {
    isConfirming.value = true

    // Build phones array
    const phones = []
    if (bookingInfo.value.mobile) {
      phones.push({
        number: bookingInfo.value.mobile,
        type: 'mobile'
      })
    }
    if (bookingInfo.value.phone) {
      phones.push({
        number: bookingInfo.value.phone,
        type: 'phone'
      })
    }

    // Build additional data from selectedAdditionalInfo
    const additionalData = props.selectedAdditionalInfo.map((info, index) => ({
      key: `additionalInfo${index + 1}`,
      value: info
    }))

    const res = await confirmBooking({
      token: props.token,
      appointmentId: reservationId.value || '',
      car: {
        licenseplate: bookingInfo.value.licensePlate,
        type: `${bookingInfo.value.carBrand} ${bookingInfo.value.model}`,
        mileage: parseInt(bookingInfo.value.mileage) || 0,
        vin: bookingInfo.value.vin
      },
      customer: {
        firstname: bookingInfo.value.firstName,
        surname: bookingInfo.value.lastName,
        address: bookingInfo.value.street,
        zip: bookingInfo.value.zipCode,
        city: bookingInfo.value.city,
        phones
      },
      comment: bookingInfo.value.email || '',
      additionalData
    })

    // Check if booking was successful
    if (res.success) {
      bookingSuccess.value = true
      success('Booking confirmed successfully!')
    } else {
      error('Booking confirmation failed. Please try again.')
    }
  } catch (err: any) {
    const errorMessage = err?.response?.data?.error || err?.message || 'Failed to confirm booking. Please try again.'
    error(errorMessage)
  } finally {
    isConfirming.value = false
  }
}

const handleContinue = async () => {
  // If on step 4 (index 3), confirm the booking
  if (props.activeStep === 3) {
    await handleConfirmBooking()
  } else {
    emit('continue')
  }
}
</script>
