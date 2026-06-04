<template>
  <div
    v-loading="loading"
    class="flex items-center justify-center h-full w-full p-1 900:p-4"
  >
    <div
      :style="{boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.03)'}"
      class="w-full max-w-[1920px] h-full max-h-[730px] justify-center hidden 900:flex"
    >
      <div
        v-if="!bookingSuccess"
        class="flex-1 p-4 1080:p-8 border border-[#E6EBEF] bg-primaryBg rounded-l-[10px]
          flex flex-col gap-12 overflow-hidden"
      >
        <div class="w-full flex flex-wrap items-start gap-4 relative">
          <BookingHeader v-bind="businessInfo" />

          <CustomSteps
            v-model="activeStep"
            class="shrink-0 ml-auto"
            :steps="stepTitles"
          />
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto flex flex-col pr-1">
          <ServicesStep
            v-if="activeStep === 0"
            v-model:service-search="serviceSearch"
            :services-config="servicesConfig"
            :selected-service-options="selectedServiceOptions"
            @book-option="handleBookOption"
            @unbook-option="handleUnbookOption"
          />

          <AppointmentStep
            v-if="activeStep === 1"
            @go-back="activeStep--"
          />
          <AdditionalInformationStep
            v-if="activeStep === 2"
            v-model="selectedAdditionalInfo"
            @go-back="activeStep--"
          />

          <VehicleDataStep v-if="activeStep === 3" @go-back="activeStep--" />
        </div>
      </div>

      <AppointmentBookingSidebar
        v-if="!bookingSuccess"
        class="border !h-full !max-h-[730px] border-[#E6EBEF] bg-[#FFFFFF] rounded-r-[10px] border-l-[0px]"
        :style="{boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.03)'}"
        :selected-jobs="selectedJobs"
        :selected-additional-info="selectedAdditionalInfo"
        :selected-appointment="selectedAppointment"
        :active-step="activeStep"
        :token="token"
        @remove-job="removeJob"
        @remove-additional-info="removeAdditionalInfo"
        @continue="handleContinue"
      />

      <FinishStep v-if="bookingSuccess" />
    </div>

    <!-- Mobile Layout (below 900px) -->
    <div class="900:hidden flex flex-col w-full h-full">
      <!-- Fixed Header -->
      <div
        v-if="!bookingSuccess"
        class="fixed top-0 left-0 right-0 z-50 bg-primaryBg "
      >
        <!-- Top bar: back button, step name, cart button -->
        <div class="flex items-center justify-between px-6 mb-5 mt-3">
          <button
            v-if="activeStep > 0"
            class="flex items-center justify-center w-8 h-8"
            @click="activeStep--"
          >
            <IconArrowBack class="text-primary size-4" />
          </button>
          <div v-else class="w-8" />

          <span class="font-semibold text-base text-text font-serif">{{ stepTitles[activeStep] }}</span>

          <button
            class="relative flex items-center justify-center w-10 h-10 rounded-full
              border border-[#E6EBEF] bg-primaryBg"
            @click="isMobileCartOpen = true"
          >
            <IconCart class="w-5 h-5 text-primary" />
            <span
              v-if="selectedJobs.length > 0"
              class="absolute -top-1 -right-3 w-6 h-4 bg-primary text-white text-xs
                font-semibold rounded-md flex items-center justify-center"
            >
              {{ selectedJobs.length }}
            </span>
          </button>
        </div>

        <!-- Stepper (numbers only) -->
        <div class="flex items-center justify-center gap-2 px-6">
          <template v-for="(_step, index) in stepTitles" :key="index">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              :class="{
                'bg-primary text-white border-2 border-primary': index === activeStep,
                'bg-white text-primary border-2 border-primary': index > activeStep
              }"
            >
              <IconCheckCircle v-if="index < activeStep" class="w-8 h-8 text-primary" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div
              v-if="index < stepTitles.length - 1"
              class="w-6 h-px"
              :class="index < activeStep ? 'bg-primary' : 'bg-[#dae1e7]'"
            />
          </template>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div
        ref="mobileContentRef"
        class="flex-1 overflow-y-auto overflow-x-hidden pt-4 pl-4 pr-1  gutter"
        :class="bookingSuccess ? 'mt-0 mb-0' : 'mt-[120px] mb-[105px]'"
      >
        <ServicesStep
          v-if="activeStep === 0"
          v-model:service-search="serviceSearch"
          :services-config="servicesConfig"
          :selected-service-options="selectedServiceOptions"
          :is-mobile="true"
          @book-option="handleBookOption"
          @unbook-option="handleUnbookOption"
        />

        <AppointmentStep
          v-if="activeStep === 1"
          :is-mobile="true"
        />

        <AdditionalInformationStep
          v-if="activeStep === 2"
          v-model="selectedAdditionalInfo"
          :is-mobile="true"
        />

        <VehicleDataStep
          v-if="activeStep === 3 && !bookingSuccess"
          :is-mobile="true"
        />
        <FinishStep
          v-if="bookingSuccess"
          :is-mobile="true"
        />
      </div>

      <!-- Fixed Bottom Button -->
      <div
        v-if="!bookingSuccess"
        class="fixed bottom-0 left-0 right-0 z-50 bg-primaryBg border-t border-[#E6EBEF] px-5 pt-2 pb-10"
      >
        <button
          class="w-full py-3 rounded-lg font-semibold text-white transition-colors"
          :class="isContinueDisabled
            ? 'bg-[#C2CDD6] cursor-not-allowed'
            : 'bg-primary hover:bg-blue-600'"
          :disabled="isContinueDisabled"
          @click="handleContinue"
        >
          {{ $t('general.continue') }}
        </button>
      </div>

      <!-- Mobile Cart Overlay -->
      <MobileCartOverlay
        :is-open="isMobileCartOpen"
        :selected-jobs="selectedJobs"
        :selected-additional-info="selectedAdditionalInfo"
        :token="token"
        @close="isMobileCartOpen = false"
        @remove-job="removeJob"
        @remove-additional-info="removeAdditionalInfo"
      />

      <!-- Mobile Booking Overlay -->
      <MobileBookingOverlay
        :is-open="isMobileBookingOpen"
        :selected-jobs="selectedJobs"
        :selected-additional-info="selectedAdditionalInfo"
        :token="token"
        @close="isMobileBookingOpen = false"
        @remove-job="removeJob"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import AppointmentBookingSidebar from '@/views/home/components/AppointmentBookingSidebar.vue'
import BookingHeader from '@/views/home/components/BookingHeader.vue'
import ServicesStep from '@/views/home/components/ServicesStep.vue'
import AdditionalInformationStep from '@/views/home/components/AdditionalInformationStep.vue'
import AppointmentStep from '@/views/home/components/AppointmentStep.vue'
import VehicleDataStep from '@/views/home/components/VehicleDataStep.vue'
import FinishStep from '@/views/home/components/FinishStep.vue'
import MobileCartOverlay from '@/views/home/components/MobileCartOverlay.vue'
import MobileBookingOverlay from '@/views/home/components/MobileBookingOverlay.vue'

import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import { getConfig, getAvailableDays, getAvailableTimes } from '@/api/services/general.service'
import { useNotification } from '@/composables/useNotification'

const {
  loading,
  activeStep,
  serviceSearch,
  selectedService,
  selectedServiceOptions,
  selectedJobs,
  selectedAdditionalInfo,
  selectedAppointment,
  selectedDate,
  selectedTime,
  availableDays,
  availableTimes,
  quickAppointments,
  stepTitles,
  servicesConfig,
  config,
  bookingSuccess,
  isContinueDisabled,
  resetAll,
  makeReservation
} = useAppointmentBooking()

// Business info for the booking header — sourced from config opts, falling back to
// BookingHeader's built-in placeholders when the API does not provide these fields.
const businessInfo = computed(() => {
  const opts = config.value?.opts
  return {
    companyName: opts?.['company-name'] || undefined,
    logoUrl: opts?.['logo-url'] || undefined,
    rating: opts?.rating || undefined,
    ratingCount: opts?.['rating-count'] || undefined,
    addressLine1: opts?.['address-line-1'] || undefined,
    addressLine2: opts?.['address-line-2'] || undefined
  }
})

const handleWidgetMessage = (event: MessageEvent) => {
  if (event.data === 'resetWidget') {
    resetAll()
    isMobileCartOpen.value = false
    isMobileBookingOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('message', handleWidgetMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleWidgetMessage)
})

const isMobileCartOpen = ref(false)
const isMobileBookingOpen = ref(false)
const mobileContentRef = ref<HTMLElement | null>(null)

// Scroll mobile content to top when step changes
watch(activeStep, () => {
  if (mobileContentRef.value) {
    mobileContentRef.value.scrollTop = 0
  }
})

// Watch selectedDate and fetch available times (centralized to avoid duplicate calls)
watch(selectedDate, (newDate) => {
  if (newDate) {
    fetchAvailableTimes(newDate)
  }
})

const handleBookOption = (service: any, option: any) => {
  selectedService.value = service
  if (!selectedServiceOptions.value.includes(option.label)) {
    selectedServiceOptions.value.push(option.label)
    selectedJobs.value.push({
      serviceTitle: service.title,
      option: {
        id: option.id,
        label: option.label
      }
    })
  }
}

const handleUnbookOption = (optionLabel: string) => {
  const optionIndex = selectedServiceOptions.value.indexOf(optionLabel)
  if (optionIndex > -1) {
    selectedServiceOptions.value.splice(optionIndex, 1)
  }
  const jobIndex = selectedJobs.value.findIndex(job => job.option.label === optionLabel)
  if (jobIndex > -1) {
    selectedJobs.value.splice(jobIndex, 1)
  }
}

const { error } = useNotification()

// Extract token from URL (supports both query params and path formats)
const getTokenFromUrl = (): string => {
  // First, try to get token from query parameters (?token=xyz)
  const urlParams = new URLSearchParams(window.location.search)
  const queryToken = urlParams.get('token')
  if (queryToken) {
    return queryToken
  }

  // Second, try to extract from path format (/token=xyz)
  const path = window.location.pathname
  const tokenMatch = path.match(/token=([^/]+)/)
  if (tokenMatch && tokenMatch[1]) {
    return tokenMatch[1]
  }

  return ''
}

const token = ref<string>(getTokenFromUrl())

const removeJob = (index: number) => {
  const job = selectedJobs.value[index]
  selectedJobs.value.splice(index, 1)
  const optionIndex = selectedServiceOptions.value.indexOf(job.option.label)
  if (optionIndex > -1) {
    selectedServiceOptions.value.splice(optionIndex, 1)
  }
  if (selectedJobs.value.length === 0) {
    activeStep.value = 0
    isMobileCartOpen.value = false
    isMobileBookingOpen.value = false
  }
}

const removeAdditionalInfo = (index: number) => {
  selectedAdditionalInfo.value.splice(index, 1)
}

const handleContinue = async () => {
  // On step 4 (VehicleDataStep), open booking overlay instead of continuing
  if (activeStep.value === 3) {
    isMobileBookingOpen.value = true
    return
  }
  // On step 0 (ServicesStep), fetch available days before moving to appointment step
  if (activeStep.value === 0) {
    await fetchAvailableDays()
  }
  // On step 1 (AppointmentStep), create reservation before moving to next step
  if (activeStep.value === 1) {
    if (selectedDate.value && selectedTime.value) {
      try {
        await makeReservation(token.value, selectedDate.value, selectedTime.value)
      } catch {
        // Error already shown by makeReservation, don't advance step
        return
      }
    }
  }
  activeStep.value++
}

const fetchAvailableDays = async () => {
  if (selectedJobs.value.length === 0) {
    availableDays.value = []
    quickAppointments.value = []
    return
  }

  try {
    loading.value = true
    const workIds = selectedJobs.value.map(job => job.option.id)
    const response = await getAvailableDays({
      token: token.value,
      workIds
    })

    availableDays.value = response.availableDays
    // Fetch quick appointments after available days are loaded
    await fetchQuickAppointments()
  } catch (err) {
    error('Failed to load available days. Please try again.')
  } finally {
    loading.value = false
  }
}

const fetchAvailableTimes = async (date: string) => {
  if (selectedJobs.value.length === 0 || !date) {
    availableTimes.value = []
    return
  }

  try {
    loading.value = true
    const workIds = selectedJobs.value.map(job => job.option.id)
    const response = await getAvailableTimes({
      token: token.value,
      date,
      workIds
    })

    availableTimes.value = response.availableTimes || []
  } catch (err) {
    error('Failed to load available times. Please try again.')
  } finally {
    loading.value = false
  }
}

const fetchQuickAppointments = async () => {
  if (selectedJobs.value.length === 0) {
    quickAppointments.value = []
    return
  }

  if (availableDays.value.length === 0) {
    quickAppointments.value = []
    return
  }

  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const sortedDays = [...availableDays.value].sort()

    // Find starting day index
    let startIndex = sortedDays.findIndex(day => day >= todayStr)
    if (startIndex === -1) startIndex = 0

    const workIds = selectedJobs.value.map(job => job.option.id)
    const collectedMorning: string[] = []
    const collectedAfternoon: string[] = []

    // Keep fetching days until we have 1 morning + 2 afternoon times
    let dayIndex = startIndex
    while (
      (collectedMorning.length < 1 || collectedAfternoon.length < 2) &&
      dayIndex < sortedDays.length
    ) {
      const dateToFetch = sortedDays[dayIndex]
      const response = await getAvailableTimes({
        token: token.value,
        date: dateToFetch,
        workIds
      })

      const times = response.availableTimes || []

      for (const time of times) {
        const hour = new Date(time).getHours()
        if (hour < 12 && collectedMorning.length < 1) {
          collectedMorning.push(time)
        } else if (hour >= 12 && collectedAfternoon.length < 2) {
          collectedAfternoon.push(time)
        }

        // Stop if we have enough
        if (collectedMorning.length >= 1 && collectedAfternoon.length >= 2) {
          break
        }
      }

      dayIndex++
    }

    // Combine and sort by date if dates differ
    const allTimes = [...collectedMorning, ...collectedAfternoon]
    allTimes.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    quickAppointments.value = allTimes
  } catch (err) {
    error('Failed to load quick appointments. Please try again.')
  }
}

const init = async () => {
  try {
    loading.value = true
    config.value = await getConfig({ token: token.value })

    // Set primary color from config
    if (config.value?.opts?.['highlight-bg']) {
      document.documentElement.style.setProperty('--el-color-primary', config.value.opts['highlight-bg'])
    }
    // Set background color from config
    if (config.value?.opts?.['bg-color']) {
      document.documentElement.style.setProperty('--el-color-primaryBg', config.value.opts['bg-color'])
    }
  } catch (err) {
    error('Failed to load configuration. Please try again.')
  } finally {
    loading.value = false
  }
}

init()
</script>

<style lang='scss'>
*{

}

.el-icon.el-notification__closeBtn {
  @apply -top-2 -right-[30px];
}

.gutter {
  scrollbar-gutter: stable;
}
</style>
