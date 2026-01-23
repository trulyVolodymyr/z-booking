<template>
  <div>
    {{ console.log(servicesConfig) }}
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        {{ $t('general.selectServiceDescription') }}
      </p>

      <!-- Search input -->
      <div class="flex items-center h-10 bg-[#F9FAFB] rounded-[10px] mb-4">
        <IconSearch class="ml-3" />
        <input
          v-model="serviceSearchModel"
          type="text"
          :placeholder="$t('general.searchForService')"
          class="ml-4 outline-none w-full bg-[#F9FAFB] text-sm"
          @input="searchJobs(($event.target as HTMLInputElement).value)"
        >
      </div>

      <!-- OR divider -->
      <div class="my-4 uppercase font-semibold text-text text-sm flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      </div>

      <!-- Services Accordion -->
      <div class="space-y-3">
        <div
          v-for="service in servicesConfig"
          :key="service.id"
          class="border rounded-[10px] overflow-hidden transition-all"
          :class="expandedService === service.id
            ? 'border-primary bg-[#F0F7FF]'
            : 'border-[#C2CDD6] bg-primaryBg '"
        >
          <!-- Service Header -->
          <div
            class="flex items-center justify-between px-4 py-3 cursor-pointer"
            @click="toggleService(service.id)"
          >
            <div class="flex items-center gap-3">
              <div class="w-1 h-8 bg-primary rounded-full" />
              <span class="font-medium text-text">{{ service.title }}</span>
            </div>
            <IconRight
              class="w-5 h-5 text-text transition-transform"
              :class="expandedService === service.id ? 'rotate-90' : ''"
            />
          </div>

          <!-- Service Options (Jobs) -->
          <div
            v-if="expandedService === service.id && service.options"
            class="px-4 pb-3"
          >
            <div
              v-for="option in service.options"
              :key="option.id"
              class="flex items-center justify-between py-3 border-t border-[#E6EBEF]"
            >
              <div>
                <p class="font-medium text-text text-sm">{{ option.label }}</p>
              </div>
              <button
                class="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
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
    <template v-else>
      <p class="font-medium text-xl text-text mb-4">
        {{ $t('general.selectYourService') }}
      </p>
      <p class="text-text mb-6">
        {{ $t('general.selectServiceDescription') }}
      </p>

      <div class="flex items-center h-10 bg-[#F9FAFB] rounded-[10px] mx-4">
        <IconSearch class="ml-3" />
        <input
          v-model="serviceSearchModel"
          type="text"
          :placeholder="$t('general.searchForService')"
          class="ml-6 outline-none w-full bg-[#F9FAFB] text-sm"
          @input="searchJobs(($event.target as HTMLInputElement).value)"
        >
      </div>

      <div class="my-6 uppercase font-semibold text-text flex items-center">
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
        <span class="px-4">{{ $t('general.or') }}</span>
        <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      </div>

      <div class="grid grid-cols-1 900:grid-cols-2 1080:grid-cols-3 gap-[10px] mb-6">
        <div
          v-for="(service, index) in servicesConfig"
          :key="index"
          class="border rounded-[10px] cursor-pointer bg-primaryBg  transition-colors border-l-[4px] border-l-primary"
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

      <div class="h-[220px]">
        <span v-if="!filteredJobs.length && selectedService">{{ selectedService.title }}</span>

        <div v-if="filteredJobs.length || selectedService?.options" class="space-y-3 mt-6">
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface IServiceOption {
  id: number
  label: string
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

const displayedJobs = computed(() => {
  if (filteredJobs.value.length) {
    if (props.selectedService) {
      return filteredJobs.value.filter(job => job.serviceId === props.selectedService?.id)
    }
    return filteredJobs.value
  }
  return props.selectedService?.options || []
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

  console.log(filteredJobs.value)
}
</script>
