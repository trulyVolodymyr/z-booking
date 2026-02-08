<template>
  <div class="w-full flex-1 flex flex-col">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        {{ $t('general.additionalInfoDescription') }}
      </p>

      <div class="space-y-3 mb-6">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="flex items-center gap-3"
        >
          <div
            class="flex items-center gap-3 cursor-pointer"
            @click.stop="toggleOption(option)"
          >
            <IconCheckCircleFull
              v-if="selectedOptions.some(opt => opt.startsWith(option))"
              class="text-primary shrink-0"
            />
            <div v-else class="size-8 flex items-center justify-center">
              <div class="w-[26px] h-[26px] border-[2px] border-primary rounded-full shrink-0" />
            </div>
            <span class="text-text text-sm">{{ option }}</span>
          </div>

          <!-- DateTimePicker for vehicleBackBy option -->
          <CustomDateTimePicker
            v-if="option === optionVehicleBackBy"
            v-model="vehicleBackByDate"
            :disabled="!isVehicleBackBySelected"
            :placeholder="$t('general.selectDateTime')"
            class="!w-[220px]"
            @click.stop
            @change="onVehicleBackByDateChange"
          />
        </div>
      </div>

      <div>
        <p class="font-medium text-text mb-3 text-sm">
          {{ $t('general.notesOnAppointment') }}
        </p>

        <!-- Full width textarea -->
        <textarea
          v-model="notes"
          :placeholder="$t('general.supplementaryRemarks')"
          class="w-full h-[100px] p-3 border border-[#C2CDD6] rounded-lg resize-none
            focus:outline-none focus:border-primary transition-colors mb-3"
        />

        <!-- File upload buttons stacked -->
        <div
          v-if="config?.params?.isDropboxEnabled"
          class="flex flex-col gap-2"
        >
          <button
            class="flex h-[44px] items-center justify-center gap-2 px-4 py-3 border transition-colors w-full rounded-lg"
            :class="registrationFile
              ? 'border-primary bg-primary/10' : 'border-[#C2CDD6] bg-primaryBg hover:bg-blue-50'"
            @click="handleUploadRegistration"
          >
            <IconCheckCircleFull v-if="registrationFile" class="size-5 shrink-0 text-primary" />
            <IconCarProfile v-else class="size-5 shrink-0 text-primary" />
            <span class="text-sm text-primary">{{ $t('general.uploadVehicleRegistration') }}</span>
          </button>
          <button
            class="flex h-[44px] items-center justify-center gap-2 px-4 py-3 border border-[#C2CDD6]
              text-primary rounded-lg hover:bg-blue-50 transition-colors bg-primaryBg  w-full"
            @click="handleUploadDocuments"
          >
            <IconFiles class="size-5 shrink-0 text-primary" />
            <span class="text-sm">{{ $t('general.uploadOtherDocuments') }}</span>
          </button>
        </div>

        <!-- Uploaded Files Display -->
        <div v-if="uploadedFiles.length > 0" class="mt-3 flex flex-col gap-2">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center justify-between gap-2 px-3 py-2 border border-[#C2CDD6]
              rounded-lg bg-[#F9FAFB]"
          >
            <span class="text-sm text-primary font-medium truncate flex-1">
              {{ file.name }}
            </span>
            <button
              class="size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                hover:border-primary hover:shadow-md transition-colors shrink-0"
              @click="removeFile(index)"
            >
              <IconDelete class="size-5 text-primary" />
            </button>
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
          {{ $t('general.additionalInformation') }}
        </p>
      </div>

      <!-- Two column layout -->
      <div class="flex gap-8">
        <!-- Left side: Options list -->
        <div class="flex-1">
          <p class="text-text mb-4">
            {{ $t('general.additionalServicesQuestion') }}
          </p>

          <div class="space-y-3">
            <div
              v-for="(option, index) in options"
              :key="index"
              class="flex items-center gap-3"
            >
              <div
                class="flex items-center gap-3 cursor-pointer"
                @click.stop="toggleOption(option)"
              >
                <!-- Custom circle checkbox -->
                <IconCheckCircleFull
                  v-if="selectedOptions.some(opt => opt.startsWith(option))"
                  class=" text-primary shrink-0"
                />

                <div v-else class="size-8 flex items-center justify-center">
                  <div class="w-[26px] h-[26px] border-[2px] border-primary rounded-full shrink-0" />
                </div>
                <span class="text-text 1250:text-sm text-xs">{{ option }}</span>
              </div>

              <!-- DateTimePicker for vehicleBackBy option -->

              <CustomDateTimePicker
                v-if="option === optionVehicleBackBy"
                v-model="vehicleBackByDate"
                :disabled="!isVehicleBackBySelected"
                :placeholder="$t('general.selectDateTime')"
                class="1250:!w-[220px] !w-[180px]"
                @click.stop
                @change="onVehicleBackByDateChange"
              />
            </div>
          </div>
        </div>

        <!-- Right side: File upload -->
        <div class="1250:w-[300px] w-[180px]">
          <p class="text-text mb-4 text-xs 1250:text-base">
            {{ $t('general.uploadDocumentsQuestion') }}
          </p>

          <!-- Upload buttons -->
          <div class="flex flex-col gap-2 mb-4">
            <button
              class="flex h-[44px] items-center gap-2 px-4 py-3 rounded-lg transition-colors w-full text-xs
              1250:text-base"
              :class="registrationFile
                ? 'border-2 border-primary bg-primary/10'
                : 'bg-primary text-white hover:bg-primary/90'"
              @click="handleUploadRegistration"
            >
              <IconCheckCircleFull v-if="registrationFile" class="size-5 shrink-0 text-primary" />
              <IconCarProfile
                v-else
                class="size-5 shrink-0"
                :class="registrationFile ? 'text-primary' : 'text-white'"
              />
              <span :class="registrationFile ? 'text-primary' : 'text-white'">
                {{ $t('general.uploadVehicleRegistration') }}
              </span>
            </button>
            <button
              class="flex h-[44px] items-center gap-2 px-4 py-3 border border-[#C2CDD6]
                text-primary rounded-lg hover:bg-blue-50 transition-colors bg-primaryBg w-full text-xs 1250:text-base"
              @click="handleUploadDocuments"
            >
              <IconFiles class="size-5 shrink-0 text-primary" />
              <span class="text-primary">{{ $t('general.uploadOtherDocuments') }}</span>
            </button>
          </div>

          <!-- Uploaded Files Display - scrollable -->
          <template v-if="uploadedFiles.length > 0">
            <!-- Separator -->
            <div class="h-[1px] bg-[#DAE1E7] my-4" />

            <div class="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="flex items-center justify-between gap-2 pl-4 pr-2 py-2 rounded-lg bg-[#DAE1E7]"
              >
                <span class="text-sm text-primary font-medium truncate flex-1">
                  {{ file.name }}
                </span>
                <button
                  class="size-8 flex items-center justify-center bg-white rounded-md
                    hover:shadow-md transition-colors shrink-0"
                  @click="removeFile(index)"
                >
                  <IconDelete class="size-5 text-primary" />
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Bottom: Notes textarea -->
      <div class="mt-auto">
        <p class="text-text mb-3">
          {{ $t('general.notesOnAppointment') }}
        </p>
        <textarea
          v-model="notes"
          :placeholder="$t('general.supplementaryRemarks')"
          class="w-full h-[120px] p-3 border border-[#C2CDD6] rounded-lg resize-none
            focus:outline-none focus:border-primary transition-colors"
        />
      </div>
    </template>

    <!-- Hidden File Inputs -->
    <input
      ref="registrationInput"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      class="hidden"
      @change="handleFileSelect($event, 'registration')"
    >
    <input
      ref="documentsInput"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      multiple
      class="hidden"
      @change="handleFileSelect($event, 'documents')"
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
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

const options = computed(() => [
  t('general.optionWaitOnSite'),
  t('general.optionReplacementMobility'),
  t('general.optionNightDropOff'),
  t('general.optionVehicleBackBy'),
  t('general.optionCallbackFromDealership')
])

const selectedOptions = ref<string[]>(props.modelValue || [])
const notes = ref('')
const vehicleBackByDate = ref<Date | null>(null)

const optionVehicleBackBy = computed(() => t('general.optionVehicleBackBy'))

const isVehicleBackBySelected = computed(() => {
  return selectedOptions.value.some(opt => opt.startsWith(optionVehicleBackBy.value))
})

const formatDateTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}
const registrationInput = ref<HTMLInputElement | null>(null)
const documentsInput = ref<HTMLInputElement | null>(null)

const { uploadedFiles, registrationFile, config } = useAppointmentBooking()
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

const handleUploadRegistration = () => {
  registrationInput.value?.click()
}

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

const handleFileSelect = (event: Event, type: 'registration' | 'documents') => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (validateFile(file)) {
      if (type === 'registration') {
        registrationFile.value = {
          name: file.name,
          file,
          type
        }
      } else {
        uploadedFiles.value.push({
          name: file.name,
          file,
          type
        })
      }
    }
  }

  // Reset input value to allow re-uploading the same file
  target.value = ''
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}
</script>
