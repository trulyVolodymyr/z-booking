<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <!-- Description -->
      <p class="text-text text-left mb-4">
        {{ $t('general.selectServiceDescription') }}
      </p>

      <!-- Search Input -->
      <div class="flex items-center h-10 bg-[#ECEFF4] rounded-[10px] mb-4">
        <IconSearch class="ml-3 text-[#909399]" />
        <input
          v-model="mobileSearchQuery"
          type="text"
          :placeholder="$t('general.searchForService')"
          class="ml-3 outline-none w-full bg-[#ECEFF4] text-sm pr-3"
          @input="onMobileSearch"
        >
        <button
          v-if="mobileSearchQuery"
          class="mr-3 text-[#909399] hover:text-[#606266]"
          @click="clearMobileSearch"
        >
          ×
        </button>
      </div>

      <!-- OR Divider -->
      <div v-if="!mobileSearchQuery" class="mb-4 uppercase font-semibold text-text text-sm flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      </div>

      <!-- Mobile Search Results -->
      <div v-if="mobileSearchQuery && mobileFilteredJobs.length" class="mb-4">
        <div
          v-for="job in mobileFilteredJobs"
          :key="job.id"
          class="flex items-center justify-between bg-primaryBg py-3 border-b border-[#E6EBEF] last:border-b-0"
        >
          <div>
            <p class="font-medium text-text text-sm">{{ job.label }}</p>
            <p class="text-xs text-[#909399]">{{ job.serviceTitle }}</p>
          </div>
          <button
            class="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
            :class="isOptionBooked(job.label)
              ? 'bg-[#F9FAFB] text-text border border-[#C2CDD6] hover:bg-gray-100'
              : 'bg-primary text-white hover:bg-blue-600'"
            @click="toggleMobileSearchResult(job)"
          >
            {{ isOptionBooked(job.label) ? $t('general.unbook') : $t('general.book') }}
          </button>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-else-if="mobileSearchQuery && !mobileFilteredJobs.length" class="text-left text-[#909399] py-4 mb-4">
        {{ $t('general.noResultsFound') }}
      </div>

      <!-- Services Accordion -->
      <div v-if="!mobileSearchQuery" class="space-y-[10px]">
        <div
          v-for="service in servicesConfig"
          :key="service.id"
          class="border-[2px] rounded-[8px] bg-primaryBg transition-colors
            border-l-[4px] border-l-primary overflow-hidden w-full"
          :class="expandedService === service.id ? 'border-primary bg-[#F5F9FF]' : 'border-[#C2CDD6]'"
        >
          <!-- Service Header -->
          <div
            class="flex items-center justify-between px-3 py-2 cursor-pointer"
            @click="toggleService(service.id)"
          >
            <span class="text-text">{{ service.title }}</span>
            <svg
              class="w-5 h-5 shrink-0 transition-transform duration-200"
              :class="expandedService === service.id ? 'rotate-90' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C2CDD6"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>

          <!-- Service Options (Jobs) -->
          <div
            v-if="expandedService === service.id && service.options"
            class="px-3"
          >
            <div
              v-for="option in service.options"
              :key="option.id"
              class="flex items-center justify-between py-2 border-t border-[#E6EBEF]"
            >
              <div>
                <p class="text-text text-sm">{{ option.label }}</p>
              </div>
              <button
                class="px-5 py-2 text-sm font-semibold rounded-md transition-colors shrink-0 ml-3"
                :class="isOptionBooked(option.label)
                  ? 'bg-[#F9FAFB] text-text border border-[#C2CDD6] hover:bg-gray-100'
                  : 'bg-primary text-white hover:bg-blue-600'"
                @click.stop="toggleBookOption(service, option)"
              >
                {{ isOptionBooked(option.label) ? $t('general.unbook') : $t('general.book') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Desktop Layout -->
    <div v-else class="flex-1 flex flex-col min-h-0">
      <p class="font-semibold text-2xl text-text mb-4 font-serif">
        {{ $t('general.selectYourService') }}
      </p>
      <p class="text-text mb-6">
        {{ $t('general.selectServiceDescription') }}
      </p>

      <div class="flex items-center h-10 bg-[#ECEFF4] rounded-[10px] mx-4">
        <IconSearch class="ml-3" />
        <input
          v-model="serviceSearchModel"
          type="text"
          :placeholder="$t('general.searchForService')"
          class="ml-6 outline-none w-full bg-[#ECEFF4] text-sm"
          @input="searchJobs(($event.target as HTMLInputElement).value)"
        >
      </div>

      <div class="my-6 uppercase font-semibold text-text flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      </div>

      <div class="grid grid-cols-1 900:grid-cols-2 1080:grid-cols-3 gap-[10px] mb-6 mx-4">
        <div
          v-for="(service, index) in servicesConfig"
          :key="index"
          class="border-[2px] rounded-[8px] cursor-pointer bg-primaryBg  transition-colors border-l-[4px]
          border-l-primary"
          :class="selectedService?.id === service.id ? 'border-primary shadow-md' : 'border-[#C2CDD6]'"
          @click="$emit('selectService', service.id)"
        >
          <div
            class="flex items-center gap-2 rounded-[6px] px-3 py-[6px] "
          >
            {{ service.title }}
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col min-h-0 mx-4">
        <p
          v-if="!filteredJobs.length && selectedService"
          class="mb-1"
        >
          {{ selectedService.title }}
        </p>

        <div v-if="displayedJobs.length" class="flex-1 overflow-y-auto min-h-0 space-y-3">
          <div
            v-for="(option, index) in displayedJobs"
            :key="index"
            class="flex items-center justify-between cursor-pointer"
            @click="$emit('toggleOption', option)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-6 h-6 border-2 rounded flex items-center justify-center transition-colors"
                :class="selectedServiceOptions.includes(option.label) ?
                  'bg-primary border-primary' : 'border-[#7B9CA3]'"
              >
                <IconCheck class="size-4 text-primary" />
              </div>
              <span
                class="text-sm text-text"
                :class="selectedServiceOptions.includes(option.label) ? 'font-bold' : 'font-normal'"
              >
                {{ option.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface IServiceOption {
  id: number
  label: string
  price?: string
}

interface IService {
  id: number
  title: string
  options?: IServiceOption[]
}

interface IProps {
  serviceSearch: string
  servicesConfig: IService[]
  selectedService?: IService
  selectedServiceOptions: string[]
  isMobile?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isMobile: false
})

const emit = defineEmits<{
  'update:serviceSearch': [value: string]
  selectService: [serviceId: number | null]
  toggleOption: [option: IServiceOption & { serviceId?: number; serviceTitle?: string }]
  bookOption: [service: IService, option: IServiceOption]
  unbookOption: [optionLabel: string]
}>()

const expandedService = ref<number | null>(null)
const mobileSearchQuery = ref('')

const toggleService = (serviceId: number) => {
  if (expandedService.value === serviceId) {
    expandedService.value = null
  } else {
    expandedService.value = serviceId
  }
}

const isOptionBooked = (optionLabel: string) => {
  return props.selectedServiceOptions.includes(optionLabel)
}

const toggleBookOption = (service: IService, option: IServiceOption) => {
  if (isOptionBooked(option.label)) {
    emit('unbookOption', option.label)
  } else {
    emit('bookOption', service, option)
  }
}

const serviceSearchModel = computed({
  get: () => props.serviceSearch,
  set: (value: string) => emit('update:serviceSearch', value)
})

const allJobs = computed(() => {
  return props.servicesConfig.flatMap(service =>
    (service.options || []).map(option => ({
      ...option,
      serviceId: service.id,
      serviceTitle: service.title
    }))
  )
})

const filteredJobs = ref<typeof allJobs.value>([])
const mobileFilteredJobs = ref<typeof allJobs.value>([])

const onMobileSearch = () => {
  const query = mobileSearchQuery.value.trim().toLowerCase()
  if (!query) {
    mobileFilteredJobs.value = []
    return
  }
  mobileFilteredJobs.value = allJobs.value.filter(job =>
    job.label.toLowerCase().includes(query)
  )
}

const clearMobileSearch = () => {
  mobileSearchQuery.value = ''
  mobileFilteredJobs.value = []
}

const toggleMobileSearchResult = (job: typeof allJobs.value[0]) => {
  const service = props.servicesConfig.find(s => s.id === job.serviceId)
  if (!service) return

  if (isOptionBooked(job.label)) {
    emit('unbookOption', job.label)
  } else {
    emit('bookOption', service, { id: job.id, label: job.label })
  }
}

const displayedJobs = computed(() => {
  if (filteredJobs.value.length) {
    if (props.selectedService) {
      return filteredJobs.value.filter(job => job.serviceId === props.selectedService?.id)
    }
    return filteredJobs.value
  }
  if (props.selectedService?.options) {
    return props.selectedService.options
  }
  return allJobs.value
})

const searchJobs = (query: string) => {
  if (!query.trim()) {
    filteredJobs.value = []
    return
  }
  expandedService.value = null
  emit('selectService', null)
  const lowerQuery = query.toLowerCase()
  filteredJobs.value = allJobs.value.filter(job =>
    job.label.toLowerCase().includes(lowerQuery)
  )
}
</script>
