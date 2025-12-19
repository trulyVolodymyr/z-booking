<template>
  <div class="w-full">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        Please enter further details about your booking here.
      </p>

      <div class="space-y-3 mb-6">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="border-2 rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-3 bg-white"
          :class="selectedOptions.includes(option) ?
            'border-primary bg-blue-50 shadow-lg' : 'border-[#E6EBEF]'"
          @click="toggleOption(option)"
        >
          <IconCheckCircleFull v-if="selectedOptions.includes(option)" class="shrink-0" />
          <div v-else class="size-8 shrink-0" />

          <span class="text-text text-sm">{{ option }}</span>
        </div>
      </div>

      <div>
        <p class="font-medium text-text mb-3 text-sm">
          Notes on the appointment
        </p>

        <!-- Full width textarea -->
        <textarea
          v-model="notes"
          placeholder="Supplementary remarks"
          class="w-full h-[100px] p-3 border border-[#C2CDD6] rounded-lg resize-none
            focus:outline-none focus:border-primary transition-colors mb-3"
        />

        <!-- File upload buttons stacked -->
        <div class="flex flex-col gap-2">
          <button
            class="flex h-[44px] items-center justify-center gap-2 px-4 py-3 border border-[#C2CDD6]
              text-primary rounded-lg hover:bg-blue-50 transition-colors bg-white w-full"
            @click="handleUploadRegistration"
          >
            <IconCarProfile class="shrink-0" />
            <span class="text-sm">Upload vehicle registration</span>
          </button>
          <button
            class="flex h-[44px] items-center justify-center gap-2 px-4 py-3 border border-[#C2CDD6]
              text-primary rounded-lg hover:bg-blue-50 transition-colors bg-white w-full"
            @click="handleUploadDocuments"
          >
            <IconFiles class="shrink-0" />
            <span class="text-sm">Upload other documents</span>
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
      <p class="font-medium text-xl text-text mb-4">
        Additional Information
      </p>
      <p class="text-text mb-6">
        Please enter further details about your booking here.
      </p>

      <div class="space-y-3 mb-6">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="border-2 rounded-lg p-2 cursor-pointer transition-colors flex items-center gap-3 bg-white"
          :class="selectedOptions.includes(option) ?
            'border-primary bg-blue-50 shadow-lg' : 'border-[#E6EBEF]'"
          @click="toggleOption(option)"
        >
          <IconCheckCircleFull v-if="selectedOptions.includes(option)" />
          <div v-else class="size-8" />

          <span class="text-text">{{ option }}</span>
        </div>
      </div>

      <div>
        <p class="font-medium text-text mb-3 text-sm">
          Notes on the appointment
        </p>
        <div class="flex gap-4">
          <textarea
            v-model="notes"
            placeholder="Supplementary remarks"
            class="flex-1 h-[112px] p-3 border border-[#C2CDD6] rounded-lg resize-none
              focus:outline-none focus:border-primary transition-colors"
          />
          <div class="flex flex-col justify-between">
            <button
              class="flex h-[44px] items-center gap-2 px-6 py-3 border border-[#C2CDD6]
                text-primary rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap bg-white"
              @click="handleUploadRegistration"
            >
              <IconCarProfile />
              Upload vehicle registration
            </button>
            <button
              class="flex h-[44px] items-center gap-2 px-6 py-3 border border-[#C2CDD6]
                text-primary rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap bg-white"
              @click="handleUploadDocuments"
            >
              <IconFiles />
              Upload other documents
            </button>
          </div>
        </div>

        <!-- Uploaded Files Display -->
        <div v-if="uploadedFiles.length > 0" class="mt-3 flex flex-wrap gap-3">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center gap-2 px-4 h-[49px] border border-[#C2CDD6] rounded-lg bg-[#F9FAFB]"
          >
            <el-text
              class="w-[150px] text-sm text-primary font-medium"
              truncated
            >
              {{ file.name }}
            </el-text>

            <button
              class="size-8 flex items-center justify-center border border-[#C2CDD6] rounded
                hover:border-primary hover:shadow-md transition-colors"
              @click="removeFile(index)"
            >
              <IconDelete class="size-5 text-primary" />
            </button>
          </div>
        </div>
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
import { ref, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

interface IProps {
  modelValue: string[]
  isMobile?: boolean
}

interface IEmits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<IProps>(), {
  isMobile: false
})
const emit = defineEmits<IEmits>()

const options = [
  'I would like to wait on-site',
  'I need replacement mobility',
  'I would like to return the vehicle via night drop-off',
  'I need my vehicle back by',
  'I would like a callback from the dealership'
]

const selectedOptions = ref<string[]>(props.modelValue || [])
const notes = ref('')
const registrationInput = ref<HTMLInputElement | null>(null)
const documentsInput = ref<HTMLInputElement | null>(null)

const { uploadedFiles } = useAppointmentBooking()
const { error } = useNotification()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB in bytes
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

const toggleOption = (option: string) => {
  const index = selectedOptions.value.indexOf(option)
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  } else {
    selectedOptions.value.push(option)
  }
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
      uploadedFiles.value.push({
        name: file.name,
        file,
        type
      })
    }
  }

  // Reset input value to allow re-uploading the same file
  target.value = ''
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}
</script>
