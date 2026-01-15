<template>
  <div
    v-loading="loading"
    class="flex items-center justify-center h-full w-full bg-white p-1 900:p-4"
  >
    <div class="w-full max-w-[1440px]  justify-center gap-2 1080:gap-6 hidden 900:flex">
      <div
        v-if="!bookingSuccess"
        class="flex-1 p-3 1080:p-5 border border-[#E6EBEF] bg-white rounded-[10px]"
      >
        <div class="w-full flex justify-end mb-6 relative">
          <button
            v-if="activeStep > 0"
            class="flex items-center gap-2 text-primary absolute left-0 top-[3px]"
            @click="activeStep--"
          >
            <IconArrowBack class="text-primary" />
            Back
          </button>

          <CustomSteps
            v-model="activeStep"
            class="scale-75 1080:scale-1"
            :steps="stepTitles"
          />
        </div>

        <ServicesStep
          v-if="activeStep === 0"
          v-model:service-search="serviceSearch"
          :services-config="servicesConfig"
          :selected-service="selectedService"
          :selected-service-options="selectedServiceOptions"
          @select-service="selectService"
          @toggle-option="toggleOption"
        />
        <AdditionalInformationStep
          v-if="activeStep === 1"
          v-model="selectedAdditionalInfo"
        />

        <AppointmentStep
          v-if="activeStep === 2"
          :token="token"
          @date-selected="fetchAvailableTimes"
        />
        <VehicleDataStep v-if="activeStep === 3" />
      </div>

      <AppointmentBookingSidebar
        v-if="!bookingSuccess"
        class="border !h-[750px] border-[#E6EBEF] bg-[#FFFFFF] rounded-[10px]"
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
        class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E6EBEF]"
      >
        <!-- Top bar: back button, step name, cart button -->
        <div class="flex items-center justify-between px-4 py-3">
          <button
            v-if="activeStep > 0"
            class="flex items-center justify-center w-8 h-8"
            @click="activeStep--"
          >
            <IconArrowBack class="text-text" />
          </button>
          <div v-else class="w-8" />

          <span class="font-semibold text-lg text-text">{{ stepTitles[activeStep] }}</span>

          <button
            class="relative flex items-center justify-center w-10 h-10 rounded-full
              border border-[#E6EBEF] bg-white"
            @click="isMobileCartOpen = true"
          >
            <IconCart class="w-5 h-5 text-primary" />
            <span
              v-if="selectedJobs.length > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs
                font-semibold rounded-full flex items-center justify-center"
            >
              {{ selectedJobs.length }}
            </span>
          </button>
        </div>

        <!-- Stepper (numbers only) -->
        <div class="flex items-center justify-center gap-2 py-3 px-4">
          <template v-for="(step, index) in stepTitles" :key="index">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              :class="{
                'bg-primary text-white': index === activeStep,
                'text-[#666] border-2 border-[#E6EBEF]': index > activeStep
              }"
            >
              <IconCheckCircle v-if="index < activeStep" class="w-8 h-8" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div
              v-if="index < stepTitles.length - 1"
              class="w-8 h-[2px]"
              :class="index < activeStep ? 'bg-primary' : 'bg-[#E6EBEF]'"
            />
          </template>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div
        ref="mobileContentRef"
        class="flex-1 overflow-y-auto p-4"
        :class="bookingSuccess ? 'mt-0 mb-0' : 'mt-[120px] mb-[50px]'"
      >
        <ServicesStep
          v-if="activeStep === 0"
          v-model:service-search="serviceSearch"
          :services-config="servicesConfig"
          :selected-service="selectedService"
          :selected-service-options="selectedServiceOptions"
          :is-mobile="true"
          @select-service="selectService"
          @toggle-option="toggleOption"
          @book-option="handleBookOption"
          @unbook-option="handleUnbookOption"
        />
        <AdditionalInformationStep
          v-if="activeStep === 1"
          v-model="selectedAdditionalInfo"
          :is-mobile="true"
        />
        <AppointmentStep
          v-if="activeStep === 2"
          :token="token"
          :is-mobile="true"
          @date-selected="fetchAvailableTimes"
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
        class="fixed bottom-0 left-0 right-0 z-50 bg-white pt-1 border-t border-[#E6EBEF]"
      >
        <button
          class="w-full py-3 rounded-lg font-semibold text-white transition-colors"
          :class="isContinueDisabled
            ? 'bg-[#C2CDD6] cursor-not-allowed'
            : 'bg-primary hover:bg-blue-600'"
          :disabled="isContinueDisabled"
          @click="handleContinue"
        >
          Continue
        </button>
      </div>

      <!-- Mobile Cart Overlay -->
      <MobileCartOverlay
        :is-open="isMobileCartOpen"
        :selected-jobs="selectedJobs"
        :selected-additional-info="selectedAdditionalInfo"
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
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import AppointmentBookingSidebar from '@/views/home/components/AppointmentBookingSidebar.vue'
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
  availableDays,
  availableTimes,
  quickAppointments,
  stepTitles,
  servicesConfig,
  config,
  bookingSuccess,
  isContinueDisabled
} = useAppointmentBooking()

const isMobileCartOpen = ref(false)
const isMobileBookingOpen = ref(false)
const mobileContentRef = ref<HTMLElement | null>(null)

// Scroll mobile content to top when step changes
watch(activeStep, () => {
  if (mobileContentRef.value) {
    mobileContentRef.value.scrollTop = 0
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
    fetchAvailableDays()
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
  fetchAvailableDays()
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

const toggleOption = (optionLabel: string) => {
  const index = selectedServiceOptions.value.indexOf(optionLabel)
  if (index > -1) {
    selectedServiceOptions.value.splice(index, 1)
    const jobIndex = selectedJobs.value.findIndex(job => job.option.label === optionLabel)
    if (jobIndex > -1) {
      selectedJobs.value.splice(jobIndex, 1)
    }
  } else {
    selectedServiceOptions.value.push(optionLabel)
    if (selectedService.value) {
      const option = selectedService.value.options?.find((opt) => opt.label === optionLabel)
      if (option) {
        selectedJobs.value.push({
          serviceTitle: selectedService.value.title,
          option: {
            id: option.id,
            label: option.label
          }
        })
      }
    }
  }
  fetchAvailableDays()
}

const removeJob = (index: number) => {
  const job = selectedJobs.value[index]
  selectedJobs.value.splice(index, 1)
  const optionIndex = selectedServiceOptions.value.indexOf(job.option.label)
  if (optionIndex > -1) {
    selectedServiceOptions.value.splice(optionIndex, 1)
  }
  fetchAvailableDays()
}

const removeAdditionalInfo = (index: number) => {
  selectedAdditionalInfo.value.splice(index, 1)
}

const handleContinue = () => {
  // On step 4 (VehicleDataStep), open booking overlay instead of continuing
  if (activeStep.value === 3) {
    isMobileBookingOpen.value = true
    return
  }
  activeStep.value++
}

const selectService = (serviceId: number | null) => {
  if (serviceId === null) {
    selectedService.value = undefined
    return
  }
  const service = servicesConfig.value.find((s) => s.id === serviceId)
  if (selectedService.value?.id === serviceId) {
    selectedService.value = undefined
  } else {
    selectedService.value = service
  }
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

    // Check if today is in availableDays
    let dateToFetch = todayStr
    if (!availableDays.value.includes(todayStr)) {
      // Find the closest available day to today
      const sortedDays = [...availableDays.value].sort()
      const closestDay = sortedDays.find(day => day >= todayStr) || sortedDays[0]
      dateToFetch = closestDay
    }

    const workIds = selectedJobs.value.map(job => job.option.id)
    const response = await getAvailableTimes({
      token: token.value,
      date: dateToFetch,
      workIds
    })

    quickAppointments.value = response.availableTimes || []
  } catch (err) {
    error('Failed to load quick appointments. Please try again.')
  }
}

const init = async () => {
  try {
    loading.value = true
    config.value = await getConfig({ token: token.value })
    console.log('config', config.value)
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
  @apply scale-[98%] 1080:scale-100;
}
</style>
