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
        <div class="absolute inset-y-0 right-0 w-full  bg-primaryBg  flex flex-col">
          <!-- Header -->
          <div class="flex items-center gap-4 px-4 py-3">
            <button
              class="flex items-center justify-center h-8"
              @click="$emit('close')"
            >
              <IconArrowBack class="text-primary" />
            </button>
            <span class="font-semibold text-text font-serif">{{ $t('general.appointmentBooking') }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 pb-4">
            <!-- Appointment Section -->
            <div v-if="selectedDate && selectedTime" class="mb-4">
              <p class="font-semibold text-sm text-[#547278] mb-2">
                {{ $t('general.appointment') }}
              </p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-text opacity-60 text-sm mb-1">
                    {{ formatDayOfWeek(selectedDate) }}
                  </p>
                  <p class=" text-text">
                    {{ formatDate(selectedDate) }} - <span class="font-semibold">{{ selectedTime }}</span>
                  </p>
                </div>
                <button
                  class="size-10 flex items-center justify-center border border-[#C2CDD6] rounded-lg bg-[#F9FAFB]
                  shrink-0"
                  @click="showDatePicker = !showDatePicker"
                >
                  <IconEvent class="text-primary" />
                </button>
              </div>
              <p class="text-text opacity-60 text-xs mt-2">
                {{ $t('general.appointmentPickupInfo') }}
              </p>
              <!-- Edit Date/Time Modal -->
              <Teleport to="body">
                <Transition name="fade">
                  <div
                    v-if="showDatePicker"
                    class="fixed inset-0 z-[200] flex items-center justify-center"
                  >
                    <div class="absolute w-[100%] h-[100%] inset-0 bg-[#000]/30" @click="showDatePicker = false" />
                    <div
                      class="relative bg-white rounded-xl w-[90%]
                        max-w-[360px] max-h-[80vh] flex flex-col
                        border border-[#E6EBEF] shadow-lg"
                    >
                      <div class="flex items-center justify-between p-4 pb-3">
                        <p class="font-semibold text-text">
                          {{ $t('general.changeAppointment') }}
                        </p>
                        <button
                          class="text-text size-6 opacity-60 text-xl leading-none"
                          @click="showDatePicker = false"
                        >
                          &times;
                        </button>
                      </div>

                      <div class="flex-1 overflow-y-auto p-4 pt-3">
                        <CustomCalendar
                          v-model="editDate"
                          :available-days="availableDays"
                          class="w-full mb-4"
                        />

                        <div v-if="editDate" class="mt-2">
                          <div v-if="loadingTimes" class="text-center py-4">
                            <p class="text-text opacity-60 text-sm">
                              {{ $t('general.loading') }}...
                            </p>
                          </div>

                          <div
                            v-else-if="editMorningTimes.length === 0
                              && editAfternoonTimes.length === 0"
                            class="text-center py-4"
                          >
                            <p class="text-text opacity-60 text-sm">
                              {{ $t('general.noAvailableTimeSlots') }}
                            </p>
                          </div>

                          <div v-else class="grid grid-cols-2 gap-4">
                            <div>
                              <p class="font-semibold text-text text-sm mb-2 text-center">
                                {{ $t('general.morning') }}
                              </p>
                              <div class="space-y-2">
                                <button
                                  v-for="(time, idx) in editMorningTimes"
                                  :key="idx"
                                  class="w-full h-[40px] border rounded-lg
                                    flex items-center justify-center text-sm
                                    transition-all"
                                  :class="editSelectedTime === time
                                    ? 'border-primary text-primary bg-blue-50 font-semibold'
                                    : 'border-[#C2CDD6] text-text hover:border-primary'"
                                  @click="editSelectedTime = time"
                                >
                                  {{ time }}
                                </button>
                              </div>
                            </div>
                            <div>
                              <p class="font-semibold text-text text-sm mb-2 text-center">
                                {{ $t('general.afternoon') }}
                              </p>
                              <div class="space-y-2">
                                <button
                                  v-for="(time, idx) in editAfternoonTimes"
                                  :key="idx"
                                  class="w-full h-[40px] border rounded-lg
                                    flex items-center justify-center text-sm
                                    transition-all"
                                  :class="editSelectedTime === time
                                    ? 'border-primary text-primary bg-blue-50 font-semibold'
                                    : 'border-[#C2CDD6] text-text hover:border-primary'"
                                  @click="editSelectedTime = time"
                                >
                                  {{ time }}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="p-4 pt-3">
                        <button
                          class="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                          :class="editSelectedTime
                            ? 'bg-primary hover:bg-blue-600'
                            : 'bg-[#C2CDD6] cursor-not-allowed'"
                          :disabled="!editSelectedTime"
                          @click="confirmEdit"
                        >
                          {{ $t('general.ok') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </Teleport>
              <div class="w-full h-[1px] bg-[#DEE0E1] mt-2" />
            </div>

            <!-- Services Section -->
            <p class="font-semibold text-sm text-[#547278]">{{ $t('general.services') }}</p>

            <div v-if="selectedJobs.length === 0" class="text-text opacity-60 text-sm">
              {{ $t('general.noServicesSelected') }}
            </div>

            <div v-else class="space-y-0">
              <div
                v-for="(job, index) in selectedJobs"
                :key="index"
                class="flex items-start justify-between py-3"
              >
                <div class="flex items-start gap-3 flex-1">
                  <div class="w-[3px] self-stretch rounded-full bg-primary shrink-0 mt-1" />
                  <div class="flex-1">
                    <p class="font-medium text-text text-sm">
                      {{ job.option.label }}
                    </p>
                    <p class="text-xs text-text opacity-60">
                      {{ $t('general.priceCalculationAtBranch') }}
                    </p>
                  </div>
                </div>
                <button
                  class="w-10 h-10 flex items-center justify-center border border-[#C2CDD6]
                    bg-[#F9FAFB] rounded ml-2"
                  @click="$emit('remove-job', index)"
                >
                  <IconDelete class="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            <!-- Additional Information Section -->
            <div v-if="selectedAdditionalInfo.length > 0" class="mb-4">
              <div class="space-y-0">
                <div
                  v-for="(info, index) in selectedAdditionalInfo"
                  :key="index"
                  class="flex items-center gap-3 py-3 border-t border-[#E6EBEF]"
                >
                  <div
                    class="size-8 rounded-full border-2 border-primary
                      flex items-center justify-center shrink-0"
                  >
                    <svg
                      class="size-4 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <template v-if="isVehicleBackByItem(info)">
                    <div class="flex-1">
                      <p class="font-medium text-primary text-sm">{{ getInfoLabel(info) }}</p>
                      <CustomDateTimePicker
                        v-model="vehicleBackByDate"
                        :placeholder="$t('general.selectDateTime')"
                        class="!w-[180px] mt-1"
                        @click.stop
                        @change="onVehicleBackByDateChange"
                      />
                    </div>
                  </template>
                  <p v-else class="font-medium text-primary text-sm flex-1">
                    {{ info }}
                  </p>
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
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import { getAvailableTimes } from '@/api/services/general.service'
import CustomCalendar from '@/components/CustomCalendar.vue'
import CustomDateTimePicker from '@/components/CustomDateTimePicker.vue'

const { t } = useI18n()

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

defineEmits<{
  close: []
  'remove-job': [index: number]
  'remove-additional-info': [index: number]
}>()

const {
  selectedDate, selectedTime, availableDays,
  selectedJobs: jobs, vehicleBackByDate,
  selectedAdditionalInfo: additionalInfo
} = useAppointmentBooking()

const optionVehicleBackBy = computed(() => t('general.optionVehicleBackBy'))

const isVehicleBackByItem = (info: string) => info.startsWith(optionVehicleBackBy.value)

const getInfoLabel = (info: string) => {
  if (isVehicleBackByItem(info)) return optionVehicleBackBy.value
  return info
}

const formatDateTimeShort = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const onVehicleBackByDateChange = (date: Date | null) => {
  if (!date) return
  const idx = additionalInfo.value.findIndex(opt => opt.startsWith(optionVehicleBackBy.value))
  if (idx > -1) {
    additionalInfo.value.splice(idx, 1)
  }
  const formatted = formatDateTimeShort(date)
  additionalInfo.value.push(`${optionVehicleBackBy.value}: ${formatted}`)
}

const showDatePicker = ref(false)
const editDate = ref<string | null>(null)
const editSelectedTime = ref<string | null>(null)
const editAvailableTimes = ref<string[]>([])
const loadingTimes = ref(false)

const formatTime = (isoTime: string): string => {
  const date = new Date(isoTime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutesStr = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutesStr}`
}

const editMorningTimes = computed(() =>
  editAvailableTimes.value
    .filter(time => new Date(time).getHours() < 12)
    .map(formatTime)
)

const editAfternoonTimes = computed(() =>
  editAvailableTimes.value
    .filter(time => new Date(time).getHours() >= 12)
    .map(formatTime)
)

watch(showDatePicker, (open) => {
  if (open) {
    editDate.value = selectedDate.value
    editSelectedTime.value = selectedTime.value
    editAvailableTimes.value = []
    if (editDate.value) fetchEditTimes(editDate.value)
  }
})

watch(editDate, (newDate) => {
  if (newDate && showDatePicker.value) {
    editSelectedTime.value = null
    fetchEditTimes(newDate)
  }
})

const fetchEditTimes = async (date: string) => {
  const workIds = jobs.value.map(job => job.option.id)
  if (workIds.length === 0) return
  try {
    loadingTimes.value = true
    const response = await getAvailableTimes({
      token: props.token,
      date,
      workIds
    })
    editAvailableTimes.value = response.availableTimes || []
  } catch {
    editAvailableTimes.value = []
  } finally {
    loadingTimes.value = false
  }
}

const confirmEdit = () => {
  if (!editDate.value || !editSelectedTime.value) return
  const newTime = editSelectedTime.value
  const newDate = editDate.value
  selectedDate.value = newDate
  selectedTime.value = newTime
  nextTick(() => {
    selectedTime.value = newTime
  })
  showDatePicker.value = false
}

const formatDayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr)
  const days = [
    t('general.sunday'),
    t('general.monday'),
    t('general.tuesday'),
    t('general.wednesday'),
    t('general.thursday'),
    t('general.friday'),
    t('general.saturday')
  ]
  return days[date.getDay()]
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
