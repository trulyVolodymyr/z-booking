<template>
  <div class="w-full flex-1 flex flex-col 900:min-h-0">
    <!-- Desktop header (stays fixed above the scroll area) -->
    <div v-if="!isMobile" class="flex items-center gap-3 shrink-0 mb-10">
      <button class="flex items-center text-primary" @click="emit('go-back')">
        <IconArrowBack class="text-primary size-6" />
      </button>
      <p class="font-serif font-semibold text-2xl text-text">
        {{ $t('general.additionalInformation') }}
      </p>
    </div>

    <!-- Scrollable content (desktop only; mobile scrolls with the page) -->
    <div class="flex flex-col gap-8 900:gap-10 900:flex-1 900:min-h-0 900:overflow-y-auto 900:pr-1">
      <!-- Option cards -->
      <div class="flex flex-col gap-3 w-full">
        <template v-for="card in optionCards" :key="card.value">
          <!-- Pick-up time card (with date input) -->
          <div
            v-if="card.isPickup"
            class="border rounded-2xl p-4 transition-colors bg-white"
            :class="isSelected(card.value) ? 'border-primary' : 'border-[#e4e7ec]'"
          >
            <div class="flex items-center gap-3 cursor-pointer" @click="toggleOption(card.value)">
              <span class="size-10 shrink-0 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                <IconClock class="size-5 text-primary" />
              </span>
              <p class="flex-1 min-w-0 font-medium text-base text-[#141c25]">{{ card.title }}</p>
              <button
                type="button"
                class="relative w-9 h-5 rounded-full transition-colors shrink-0"
                :class="isSelected(card.value) ? 'bg-primary' : 'bg-[#97a1af]'"
                @click.stop="toggleOption(card.value)"
              >
                <span
                  class="absolute top-0.5 size-4 rounded-full bg-white transition-all"
                  :class="isSelected(card.value) ? 'left-[18px]' : 'left-0.5'"
                />
              </button>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3 pl-[52px] mt-3">
              <p class="text-sm text-[#344051]">{{ card.desc }}</p>
              <CustomDateTimePicker
                v-model="vehicleBackByDate"
                :disabled="!isVehicleBackBySelected"
                :placeholder="$t('general.selectDateTime')"
                class="!w-[180px]"
                @click.stop
                @change="onVehicleBackByDateChange"
              />
            </div>
          </div>

          <!-- Standard option card -->
          <div
            v-else
            class="border rounded-2xl p-4 transition-colors bg-white cursor-pointer"
            :class="isSelected(card.value) ? 'border-primary' : 'border-[#e4e7ec]'"
            @click="toggleOption(card.value)"
          >
            <div class="flex items-center gap-3">
              <span class="size-10 shrink-0 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                <IconClock v-if="card.icon === 'clock'" class="size-5 text-primary" />
                <IconCarProfile v-else-if="card.icon === 'car'" class="size-5 text-primary" />
                <IconPhone v-else-if="card.icon === 'phone'" class="size-5 text-primary" />
                <svg
                  v-else
                  class="size-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16.5 11.2A6.5 6.5 0 1 1 8.8 3.5a5 5 0 1 0 7.7 7.7z" />
                </svg>
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-base text-[#141c25]">{{ card.title }}</p>
                <p class="text-sm text-[#344051]">{{ card.desc }}</p>
              </div>
              <button
                type="button"
                class="relative w-9 h-5 rounded-full transition-colors shrink-0"
                :class="isSelected(card.value) ? 'bg-primary' : 'bg-[#97a1af]'"
                @click.stop="toggleOption(card.value)"
              >
                <span
                  class="absolute top-0.5 size-4 rounded-full bg-white transition-all"
                  :class="isSelected(card.value) ? 'left-[18px]' : 'left-0.5'"
                />
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Notes + document uploader -->
      <div class="flex flex-col 900:flex-row gap-6 900:gap-10 w-full">
        <!-- Notes -->
        <div class="flex-1 min-w-0 flex flex-col gap-3">
          <p class="text-base text-text">
            {{ $t('general.notesOnAppointment') }}
          </p>
          <textarea
            v-model="notes"
            :placeholder="$t('general.supplementaryRemarks')"
            class="w-full h-full p-3 border border-[#C2CDD6] rounded-lg resize-none
            focus:outline-none focus:border-primary transition-colors text-sm text-text"
          />
        </div>

        <!-- Uploader -->
        <div class="w-full 900:w-[331px] flex flex-col gap-3">
          <p class="text-base text-text">
            {{ $t('general.uploadDocumentsQuestion') }}
          </p>

          <!-- Uploaded file chips -->
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center gap-2 border border-[#e4e7ec] rounded-full pl-[6px] pr-2 py-[6px]"
          >
            <span class="size-6 shrink-0 rounded-full bg-[#e5f2ff] flex items-center justify-center">
              <IconFiles class="size-3 text-primary" />
            </span>
            <p class="flex-1 min-w-0 truncate font-medium text-sm text-[#141c25]">{{ file.name }}</p>
            <button
              type="button"
              class="size-5 shrink-0 rounded-full bg-[#f2f4f7] flex items-center justify-center
              text-[#637083] hover:text-[#141c25] transition-colors"
              @click="removeFile(index)"
            >
              <svg
                class="size-3"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
              </svg>
            </button>
          </div>

          <!-- Drag-and-drop uploader -->
          <div
            class="border border-dashed rounded-2xl px-8 py-6 flex flex-col gap-[14px] items-center
            text-center cursor-pointer transition-colors"
            :class="isDragging ? 'border-primary bg-blue-50' : 'border-[#e4e7ec] bg-white hover:border-primary'"
            @click="handleUploadDocuments"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <span class="size-10 rounded-full bg-[#e5f2ff] flex items-center justify-center">
              <svg
                class="size-5 text-primary"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13V3.5M6.5 7L10 3.5 13.5 7M4 13v2.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V13" />
              </svg>
            </span>
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium text-[#344051]">
                {{ $t('general.dragFileToUpload') }}<span class="text-primary">{{ $t('general.clickToUpload') }}</span>
              </p>
              <p class="text-xs text-[#344051]">{{ $t('general.maxFileSize') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isMobile" ref="mobileBottomSentinel" class="h-1" />
    </div>

    <!-- Hidden File Input -->
    <input
      ref="documentsInput"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      multiple
      class="hidden"
      @change="handleFileSelect"
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotification } from '@/composables/useNotification'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

const { t } = useI18n()

interface IProps {
  modelValue: string[]
  isMobile?: boolean
}

interface IEmits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'go-back'): void
}

const props = withDefaults(defineProps<IProps>(), {
  isMobile: false
})
const emit = defineEmits<IEmits>()

const selectedOptions = ref<string[]>(props.modelValue || [])
const notes = ref('')

const optionVehicleBackBy = computed(() => t('general.optionVehicleBackBy'))

// Card configs — `value` keeps the existing stored string so the sidebar and
// the booking payload (additionalData) are unchanged; title/desc/icon are display-only.
const optionCards = computed(() => [
  {
    value: t('general.optionWaitOnSite'),
    title: t('general.optWaitOnSiteTitle'),
    desc: t('general.optWaitOnSiteDesc'),
    icon: 'clock'
  },
  {
    value: t('general.optionNightDropOff'),
    title: t('general.optNightDropOffTitle'),
    desc: t('general.optNightDropOffDesc'),
    icon: 'moon'
  },
  {
    value: optionVehicleBackBy.value,
    title: t('general.optPickupTimeTitle'),
    desc: t('general.optPickupTimeDesc'),
    icon: 'clock',
    isPickup: true
  },
  {
    value: t('general.optionReplacementMobility'),
    title: t('general.optReplacementMobilityTitle'),
    desc: t('general.optReplacementMobilityDesc'),
    icon: 'car'
  },
  {
    value: t('general.optionCallbackFromDealership'),
    title: t('general.optCallDealershipTitle'),
    desc: t('general.optCallDealershipDesc'),
    icon: 'phone'
  }
])

const isSelected = (value: string) => selectedOptions.value.some(opt => opt.startsWith(value))

const isVehicleBackBySelected = computed(() => isSelected(optionVehicleBackBy.value))

const formatDateTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const documentsInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const { uploadedFiles, hasSeenAdditionalInfoBottom, vehicleBackByDate, isSeen } = useAppointmentBooking()

const mobileBottomSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!props.isMobile || isSeen.value) {
    hasSeenAdditionalInfoBottom.value = true
    return
  }
  hasSeenAdditionalInfoBottom.value = false
  nextTick(() => {
    if (mobileBottomSentinel.value) {
      const scrollParent = mobileBottomSentinel.value.closest('.overflow-y-auto')
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          hasSeenAdditionalInfoBottom.value = true
          isSeen.value = true
        }
      }, { root: scrollParent, threshold: 0.1 })
      observer.observe(mobileBottomSentinel.value)
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
const { error } = useNotification()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB in bytes
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

const toggleOption = (option: string) => {
  // Handle vehicleBackBy option specially
  if (option === optionVehicleBackBy.value) {
    const existingIndex = selectedOptions.value.findIndex(opt => opt.startsWith(optionVehicleBackBy.value))
    if (existingIndex > -1) {
      selectedOptions.value.splice(existingIndex, 1)
      vehicleBackByDate.value = null
    } else {
      selectedOptions.value.push(option)
    }
  } else {
    const index = selectedOptions.value.indexOf(option)
    if (index > -1) {
      selectedOptions.value.splice(index, 1)
    } else {
      selectedOptions.value.push(option)
    }
  }
  emit('update:modelValue', selectedOptions.value)
}

const onVehicleBackByDateChange = (date: Date | null) => {
  if (!date) return

  // Remove old vehicleBackBy option
  const existingIndex = selectedOptions.value.findIndex(opt => opt.startsWith(optionVehicleBackBy.value))
  if (existingIndex > -1) {
    selectedOptions.value.splice(existingIndex, 1)
  }

  // Add with formatted date
  const formattedDate = formatDateTime(date)
  selectedOptions.value.push(`${optionVehicleBackBy.value}: ${formattedDate}`)
  emit('update:modelValue', selectedOptions.value)
}

watch(() => props.modelValue, (newValue) => {
  selectedOptions.value = newValue || []
})

const handleUploadDocuments = () => {
  documentsInput.value?.click()
}

const validateFile = (file: File): boolean => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    error('Invalid file type. Please upload PDF, JPEG, or PNG files only.')
    return false
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    error('File size exceeds 10 MB limit. Please choose a smaller file.')
    return false
  }

  return true
}

const addFiles = (files: FileList) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (validateFile(file)) {
      uploadedFiles.value.push({
        name: file.name,
        file,
        type: 'documents'
      })
    }
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(target.files)
  }
  // Reset input value to allow re-uploading the same file
  target.value = ''
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    addFiles(files)
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}
</script>
