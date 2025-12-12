<template>
  <div
    v-loading="loading"
    class="flex items-center justify-center h-full w-full bg-white p-4"
  >
    <div class="w-[1440px] flex gap-6">
      <div
        v-if="!bookingSuccess"
        class="flex-1 p-8 border border-[#E6EBEF] bg-white rounded-[10px]"
      >
        <div class="flex justify-between items-center mb-6">
          <button
            v-if="activeStep > 0"
            class="flex items-center gap-2 text-primary"
            @click="activeStep--"
          >
            <IconArrowBack class="text-primary" />
            Back
          </button>

          <CustomSteps
            v-model="activeStep"
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppointmentBookingSidebar from '@/views/home/components/AppointmentBookingSidebar.vue'
import ServicesStep from '@/views/home/components/ServicesStep.vue'
import AdditionalInformationStep from '@/views/home/components/AdditionalInformationStep.vue'
import AppointmentStep from '@/views/home/components/AppointmentStep.vue'
import VehicleDataStep from '@/views/home/components/VehicleDataStep.vue'
import FinishStep from '@/views/home/components/FinishStep.vue'

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
  bookingSuccess
} = useAppointmentBooking()

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
  activeStep.value++
}

const selectService = (serviceId: number) => {
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
