import { ref, computed, watch } from 'vue'
import type { ISelectedJob } from '@/views/home/components/AppointmentBookingSidebar.vue'
import type { IConfig } from '@/types/config.types'
import { setLocale, i18n } from '@/plugins/i18n'
import { createReservation } from '@/api/services/general.service'
import { useNotification } from '@/composables/useNotification'

interface IServiceOption {
  id: number
  label: string
}

export interface IUploadedFile {
  name: string
  file: File
  type: 'registration' | 'documents'
}

interface IService {
  id: number
  title: string
  options?: IServiceOption[]
}

export interface IBookingInfo {
  email: string
  firstName: string
  lastName: string
  mobile: string
  phone: string
  street: string
  zipCode: string
  city: string
  licensePlate: string
  carBrand: string
  model: string
  mileage: string
  vin: string
  privacyConsent: boolean
}

// Global state - singleton pattern
const lang = ref<string>('en')
const loading = ref<boolean>(false)
const activeStep = ref<number>(0)
const serviceSearch = ref<string>('')
const selectedService = ref<IService | undefined>()
const selectedServiceOptions = ref<string[]>([])
const selectedJobs = ref<ISelectedJob[]>([])
const selectedAdditionalInfo = ref<string[]>([])
const uploadedFiles = ref<IUploadedFile[]>([])
const selectedAppointment = ref<string | null>(null)
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const availableDays = ref<string[]>([])
const availableTimes = ref<any[]>([])
const quickAppointments = ref<any[]>([])
const config = ref<IConfig | null>(null)
const isSeen = ref<boolean>(false)
const bookingInfo = ref<IBookingInfo>({
  email: '',
  firstName: '',
  lastName: '',
  mobile: '',
  phone: '',
  street: '',
  zipCode: '',
  city: '',
  licensePlate: '',
  carBrand: '',
  model: '',
  mileage: '',
  vin: '',
  privacyConsent: false
})

const reservationId = ref<string | null>(null)
const bookingSuccess = ref<boolean>(false)
const hasSeenAdditionalInfoBottom = ref<boolean>(false)
const vehicleBackByDate = ref<Date | null>(null)

const stepTitles = computed<string[]>(() => {
  const t = i18n.global.t
  return [
    t('general.stepServices'),
    t('general.stepAppointment'),
    t('general.stepAdditionalInfo'),
    t('general.stepVehicleData')
  ]
})

export const useAppointmentBooking = () => {
  const servicesConfig = computed<IService[]>(() => {
    if (!config.value?.params?.worksByLang) {
      return []
    }

    const worksByLang = config.value.params.worksByLang[lang.value]
    if (!worksByLang) {
      return []
    }

    return Object.entries(worksByLang).map(([categoryName, workItems], index) => ({
      id: index + 1,
      title: categoryName,
      options: workItems.map(item => ({
        id: item.id,
        label: item.text
      }))
    }))
  })

  const isContinueDisabled = computed(() => {
    // Step 0 (Services): at least one job must be selected
    if (activeStep.value === 0) {
      return selectedJobs.value.length === 0
    }
    // Step 1 (Additional information): user must have scrolled to bottom on mobile
    if (activeStep.value === 1) {
      return !selectedDate.value || !selectedTime.value
    }
    // Step 2 (Appointment): must have date and time selected
    if (activeStep.value === 2) {
      if (window.innerWidth >= 900) return false
      return !hasSeenAdditionalInfoBottom.value
    }
    // Step 3 (Vehicle data): validate required fields
    if (activeStep.value === 3) {
      return !bookingInfo.value.email ||
             !bookingInfo.value.firstName ||
             !bookingInfo.value.lastName ||
             !bookingInfo.value.mobile ||
             !bookingInfo.value.privacyConsent
    }
    return false
  })

  const canNavigateToStep = (targetStep: number) => {
    // Can always go back
    if (targetStep < activeStep.value) {
      return true
    }

    // Can't skip steps - must complete current step first
    if (targetStep > activeStep.value) {
      // Check if current step is complete
      if (isContinueDisabled.value) {
        return false
      }
      // Can only go to the next step
      return targetStep === activeStep.value + 1
    }

    return true
  }

  // Watch selectedJobs - redirect to step 0 if all jobs are removed
  watch(selectedJobs, (newJobs) => {
    if (newJobs.length === 0 && activeStep.value > 0) {
      activeStep.value = 0
    }
  })

  // Watch config and set locale from opts.lang
  watch(config, (newConfig) => {
    if (newConfig?.opts?.lang) {
      lang.value = newConfig.opts.lang
      setLocale(newConfig.opts.lang)
    }
  }, { immediate: true })

  const makeReservation = async (token: string, date: string, time: string) => {
    const { error } = useNotification()
    try {
      // Convert date and time to ISO datetime string for API
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
      const workIds = selectedJobs.value.map(job => job.option.id)

      const response = await createReservation({
        token,
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
      throw err
    }
  }

  const resetAll = () => {
    loading.value = false
    activeStep.value = 0
    serviceSearch.value = ''
    selectedService.value = undefined
    selectedServiceOptions.value = []
    selectedJobs.value = []
    selectedAdditionalInfo.value = []
    uploadedFiles.value = []
    selectedAppointment.value = null
    selectedDate.value = null
    selectedTime.value = null
    availableDays.value = []
    availableTimes.value = []
    quickAppointments.value = []
    bookingInfo.value = {
      email: '',
      firstName: '',
      lastName: '',
      mobile: '',
      phone: '',
      street: '',
      zipCode: '',
      city: '',
      licensePlate: '',
      carBrand: '',
      model: '',
      mileage: '',
      vin: '',
      privacyConsent: false
    }
    reservationId.value = null
    bookingSuccess.value = false
    hasSeenAdditionalInfoBottom.value = false
    vehicleBackByDate.value = null
  }

  return {
    loading,
    activeStep,
    serviceSearch,
    selectedService,
    selectedServiceOptions,
    selectedJobs,
    selectedAdditionalInfo,
    uploadedFiles,
    selectedAppointment,
    selectedDate,
    selectedTime,
    availableDays,
    availableTimes,
    quickAppointments,
    stepTitles,
    servicesConfig,
    lang,
    config,
    bookingInfo,
    reservationId,
    bookingSuccess,
    hasSeenAdditionalInfoBottom,
    vehicleBackByDate,
    isContinueDisabled,
    isSeen,
    canNavigateToStep,
    makeReservation,
    resetAll
  }
}
