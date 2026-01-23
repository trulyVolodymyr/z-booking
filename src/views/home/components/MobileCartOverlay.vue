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
        <div class="absolute inset-y-0 right-0 w-full  bg-white flex flex-col">
          <!-- Header -->
          <div class="flex items-center gap-4 px-4 py-4 border-b border-[#E6EBEF]">
            <button
              class="flex items-center justify-center w-8 h-8"
              @click="$emit('close')"
            >
              <IconArrowBack class="text-text" />
            </button>
            <span class="font-semibold text-lg text-text">{{ $t('general.appointmentBooking') }}</span>
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
            <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.services') }}</p>

            <div v-if="selectedJobs.length === 0" class="text-text opacity-60 text-sm">
              {{ $t('general.noServicesSelected') }}
            </div>

            <div v-else class="space-y-0">
              <div
                v-for="(job, index) in selectedJobs"
                :key="index"
                class="flex items-start justify-between py-4 border-b border-[#E6EBEF]"
              >
                <div class="flex-1">
                  <p class="font-medium text-text">
                    {{ job.option.label }}
                  </p>
                  <p class="text-sm text-text opacity-60">
                    {{ $t('general.priceCalculationAtBranch') }}
                  </p>
                </div>
                <button
                  class="w-10 h-10 flex items-center justify-center border border-[#C2CDD6]
                    bg-[#F9FAFB] rounded ml-2"
                  @click="$emit('remove-job', index)"
                >
                  <IconDelete class="w-5 h-5 text-text" />
                </button>
              </div>
            </div>

            <!-- Additional Information Section -->
            <div v-if="selectedAdditionalInfo.length > 0" class="mt-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">{{ $t('general.additionalInformation') }}</p>
              <div class="space-y-0">
                <div
                  v-for="(info, index) in selectedAdditionalInfo"
                  :key="index"
                  class="flex items-start justify-between py-4 border-b border-[#E6EBEF]"
                >
                  <div class="flex-1">
                    <p class="font-medium text-text">{{ info }}</p>
                  </div>
                  <button
                    class="w-10 h-10 flex items-center justify-center border border-[#C2CDD6]
                      bg-[#F9FAFB] rounded ml-2"
                    @click="$emit('remove-additional-info', index)"
                  >
                    <IconDelete class="w-5 h-5 text-text" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

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
}

defineProps<IProps>()

defineEmits<{
  close: []
  'remove-job': [index: number]
  'remove-additional-info': [index: number]
}>()

const { selectedDate, selectedTime } = useAppointmentBooking()

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
