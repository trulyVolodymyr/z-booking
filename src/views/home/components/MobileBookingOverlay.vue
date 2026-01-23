<template>
  <Teleport to="body">
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100]"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/30"
          @click="$emit('close')"
        />

        <!-- Overlay Panel -->
        <div class="absolute inset-y-0 right-0 w-full bg-primaryBg  flex flex-col">
          <!-- Header -->
          <div class="flex items-center gap-4 px-4 py-4 border-b border-[#E6EBEF]">
            <button
              class="flex items-center justify-center w-8 h-8"
              @click="$emit('close')"
            >
              <IconArrowBack class="text-text" />
            </button>
            <span class="font-semibold text-lg text-text">{{ $t('general.bookingSummary') }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Appointment Section -->
            <div v-if="selectedDate && selectedTime" class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">
                {{ $t('general.appointment') }}
              </p>
              <div>
                <p class="text-text opacity-60 text-sm mb-1">
                  {{ formatDayOfWeek(selectedDate) }}
                </p>
                <p class="font-semibold text-text mb-3">
                  {{ formatDate(selectedDate) }} - {{ selectedTime }}
                </p>
              </div>
              <div class="w-full h-[1px] bg-[#DEE0E1] mt-2" />
            </div>

            <!-- Services Section -->
            <div class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.services') }}</p>

              <div v-if="selectedJobs.length === 0" class="text-text opacity-60 text-sm">
                {{ $t('general.noServicesSelected') }}
              </div>

              <div v-else class="space-y-0">
                <div
                  v-for="(job, index) in selectedJobs"
                  :key="index"
                  class="flex items-start justify-between py-3 border-b border-[#E6EBEF]"
                >
                  <div class="flex-1">
                    <p class="font-medium text-text">
                      {{ job.option.label }}
                    </p>
                    <p class="text-sm text-text opacity-60">
                      {{ $t('general.priceCalculationAtBranch') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information Section -->
            <div v-if="selectedAdditionalInfo.length > 0" class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.additionalInformation') }}</p>
              <div class="space-y-0">
                <div
                  v-for="(info, index) in selectedAdditionalInfo"
                  :key="index"
                  class="py-3 border-b border-[#E6EBEF]"
                >
                  <p class="font-medium text-text">{{ info }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Information Section -->
            <div class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.customerInformation') }}</p>
              <div class="space-y-2">
                <div v-if="bookingInfo.email" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.email') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.email }}</span>
                </div>
                <div v-if="bookingInfo.firstName || bookingInfo.lastName" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.name') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.firstName }} {{ bookingInfo.lastName }}</span>
                </div>
                <div v-if="bookingInfo.mobile" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.mobile') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.mobile }}</span>
                </div>
                <div v-if="bookingInfo.phone" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.phone') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Address Section -->
            <div v-if="bookingInfo.street || bookingInfo.zipCode || bookingInfo.city" class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.address') }}</p>
              <div class="space-y-2">
                <div v-if="bookingInfo.street" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.street') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.street }}</span>
                </div>
                <div v-if="bookingInfo.zipCode || bookingInfo.city" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.city') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.zipCode }} {{ bookingInfo.city }}</span>
                </div>
              </div>
            </div>

            <!-- Vehicle Info Section -->
            <div
              v-if="bookingInfo.licensePlate || bookingInfo.carBrand || bookingInfo.model"
              class="mb-4"
            >
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.vehicleInfo') }}</p>
              <div class="space-y-2">
                <div v-if="bookingInfo.licensePlate" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.licensePlate') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.licensePlate }}</span>
                </div>
                <div v-if="bookingInfo.carBrand" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.carBrand') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.carBrand }}</span>
                </div>
                <div v-if="bookingInfo.model" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.model') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.model }}</span>
                </div>
                <div v-if="bookingInfo.mileage" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.mileage') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.mileage }}</span>
                </div>
                <div v-if="bookingInfo.vin" class="flex justify-between">
                  <span class="text-text opacity-60 text-sm">{{ $t('general.vin') }}</span>
                  <span class="text-text text-sm">{{ bookingInfo.vin }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Bottom Button -->
          <div class="p-4 border-t border-[#E6EBEF]">
            <button
              class="w-full py-3 rounded-lg font-semibold text-white transition-colors"
              :class="isBooking
                ? 'bg-[#C2CDD6] cursor-not-allowed'
                : 'bg-primary hover:bg-blue-600'"
              :disabled="isBooking"
              @click="handleBookAppointment"
            >
              {{ isBooking ? $t('general.booking') : $t('general.bookAppointment') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
  isOpen: boolean
  selectedJobs: ISelectedJob[]
  selectedAdditionalInfo: string[]
  token: string
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  close: []
}>()

const {
  selectedDate,
  selectedTime,
  bookingInfo,
  reservationId,
  bookingSuccess
} = useAppointmentBooking()
const { error, success } = useNotification()

const isBooking = ref(false)

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

const handleBookAppointment = async () => {
  try {
    isBooking.value = true

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
      emit('close')
    } else {
      error('Booking confirmation failed. Please try again.')
    }
  } catch (err: any) {
    const errorMessage = err?.response?.data?.error ||
      err?.message ||
      'Failed to confirm booking. Please try again.'
    error(errorMessage)
  } finally {
    isBooking.value = false
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from > div:last-child,
.slide-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
