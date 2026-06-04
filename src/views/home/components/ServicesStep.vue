<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <!-- Description -->
      <p class="text-text text-left mb-4">
        {{ $t('general.selectServiceDescription') }}
      </p>

      <!-- Search Input -->
      <div class="flex items-center h-9 bg-white border border-[#e4e7ec] rounded-lg shadow-sm px-[10px] mb-4">
        <IconSearch class="text-[#97a1af] size-5 shrink-0" />
        <input
          v-model="mobileSearchQuery"
          type="text"
          :placeholder="$t('general.searchForService')"
          class="ml-2 outline-none w-full bg-transparent text-sm text-text placeholder:text-[#97a1af]"
        >
        <button
          v-if="mobileSearchQuery"
          class="ml-2 text-[#909399] hover:text-[#606266]"
          @click="mobileSearchQuery = ''"
        >
          ×
        </button>
      </div>

      <!-- Category chips -->
      <div v-if="!mobileSearchQuery" class="no-scrollbar flex gap-2 overflow-x-auto pt-2 pb-2 mb-2 -mx-4 px-4">
        <button
          v-for="cat in categoryTabs"
          :key="cat.id ?? 'all'"
          class="relative flex items-center gap-[6px] px-4 py-2 rounded-lg border whitespace-nowrap text-sm
            font-medium transition-colors shrink-0"
          :class="activeCategoryId === cat.id
            ? 'bg-[#f9fafb] border-[#f2f4f7] text-[#141c25]'
            : 'border-transparent text-[#637083] hover:text-[#141c25]'"
          @click="activeCategoryId = cat.id"
        >
          {{ cat.title }}
          <span
            v-if="cat.id !== null && selectedCount(cat.id) > 0"
            class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-white text-[10px]
              font-semibold flex items-center justify-center"
          >
            {{ selectedCount(cat.id) }}
          </span>
        </button>
      </div>

      <!-- Job list (mobile) -->
      <div v-if="displayedJobs.length" class="flex flex-col divide-y divide-[#E6EBEF]">
        <div
          v-for="job in displayedJobs"
          :key="job.id"
          class="flex items-center justify-between gap-3 py-3"
        >
          <div class="min-w-0">
            <p class="font-medium text-text text-sm">{{ job.label }}</p>
            <p class="text-xs text-[#c2cdd6]">{{ $t('general.priceInfoFromAdvisor') }}</p>
          </div>
          <button
            class="px-4 py-2 text-sm font-semibold border rounded-md transition-colors shrink-0"
            :class="isOptionBooked(job.label)
              ? 'bg-[#F9FAFB] text-text border-[#C2CDD6] hover:bg-gray-100'
              : 'bg-primary text-white hover:bg-blue-600 border-transparent'"
            @click="toggleJob(job)"
          >
            {{ isOptionBooked(job.label) ? $t('general.unbook') : $t('general.book') }}
          </button>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-else class="text-left text-[#909399] py-4">
        {{ $t('general.noResultsFound') }}
      </div>
    </template>

    <!-- Desktop Layout -->
    <div v-else class="flex-1 flex flex-col min-h-0 gap-9">
      <!-- Heading + search + description -->
      <div class="flex flex-col gap-3 w-full">
        <div class="flex items-end justify-between w-full gap-4">
          <p class="font-serif font-semibold text-2xl text-text tracking-[0.12px] whitespace-nowrap">
            {{ $t('general.selectYourService') }}
          </p>
          <div class="w-[450px] max-w-[50%]">
            <div class="flex items-center h-9 bg-white border border-[#e4e7ec] rounded-lg shadow-sm px-[10px]">
              <IconSearch class="text-[#97a1af] size-5 shrink-0" />
              <input
                v-model="serviceSearchModel"
                type="text"
                :placeholder="$t('general.searchForService')"
                class="ml-2 outline-none w-full bg-transparent text-sm text-text placeholder:text-[#97a1af]"
              >
            </div>
          </div>
        </div>
        <p class="text-text text-sm tracking-[0.07px]">
          {{ $t('general.selectServiceDescription') }}
        </p>
      </div>

      <!-- Tabs + job list -->
      <div class="flex gap-8 items-stretch flex-1 min-h-0 w-full pb-4 pr-4">
        <!-- Category tabs -->
        <div class="flex gap-3 shrink-0 min-h-0">
          <div class="flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 pr-4 pt-2">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id ?? 'all'"
              class="flex items-center justify-start pl-[10px] transition-colors text-left"
              :class="activeCategoryId === cat.id ? 'border-l-2 border-[#141c25]' : 'border-l-2 border-transparent'"
              @click="activeCategoryId = cat.id"
            >
              <span
                class="relative flex items-center gap-[6px] px-4 py-2 rounded-lg border text-sm font-medium
                  whitespace-nowrap transition-colors"
                :class="activeCategoryId === cat.id
                  ? 'bg-[#f9fafb] border-[#f2f4f7] text-[#141c25]'
                  : 'border-transparent text-[#637083] hover:text-[#141c25]'"
              >
                <IconMaintenance v-if="cat.id !== null" class="size-5 shrink-0" />
                <svg
                  v-else
                  class="size-5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 5h9M7 10h9M7 15h9M3.5 5h.01M3.5 10h.01M3.5 15h.01" />
                </svg>
                {{ cat.title }}
                <span
                  v-if="cat.id !== null && selectedCount(cat.id) > 0"
                  class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-white text-[10px]
                    font-semibold flex items-center justify-center"
                >
                  {{ selectedCount(cat.id) }}
                </span>
              </span>
            </button>
          </div>
          <div class="w-px self-stretch bg-[#E6EBEF]" />
        </div>

        <!-- Job list -->
        <div class="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto min-h-0">
          <template v-if="displayedJobs.length">
            <div
              v-for="job in displayedJobs"
              :key="job.id"
              class="flex items-center justify-between gap-4 pl-3 w-full"
            >
              <div class="flex flex-col gap-1 min-w-0">
                <p class="font-medium text-base text-text tracking-[0.08px]">{{ job.label }}</p>
                <p class="text-sm text-[#c2cdd6]">{{ $t('general.priceInfoFromAdvisor') }}</p>
              </div>
              <button
                class="h-10 min-w-[93px] px-[17px] rounded-md text-base font-medium border transition-colors shrink-0"
                :class="isOptionBooked(job.label)
                  ? 'bg-[#F9FAFB] text-text border-[#C2CDD6] hover:bg-gray-100'
                  : 'bg-primary text-white hover:bg-blue-600 border-primary'"
                @click="toggleJob(job)"
              >
                {{ isOptionBooked(job.label) ? $t('general.unbook') : $t('general.book') }}
              </button>
            </div>
          </template>
          <p v-else class="text-[#909399] pl-3">
            {{ $t('general.noResultsFound') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
  bookOption: [service: IService, option: IServiceOption]
  unbookOption: [optionLabel: string]
}>()

const { t } = useI18n()

const activeCategoryId = ref<number | null>(null)
const mobileSearchQuery = ref('')

const serviceSearchModel = computed({
  get: () => props.serviceSearch,
  set: (value: string) => emit('update:serviceSearch', value)
})

const isOptionBooked = (optionLabel: string) => {
  return props.selectedServiceOptions.includes(optionLabel)
}

// Number of selected (booked) jobs for a category tab; null = "All Services" (total)
const selectedCount = (catId: number | null) => {
  if (catId === null) {
    return props.selectedServiceOptions.length
  }
  const service = props.servicesConfig.find(s => s.id === catId)
  if (!service?.options) return 0
  return service.options.filter(o => props.selectedServiceOptions.includes(o.label)).length
}

// Category tabs: "All Services" (id null) + one per category
const categoryTabs = computed(() => [
  { id: null as number | null, title: t('general.allServices') },
  ...props.servicesConfig.map(s => ({ id: s.id as number | null, title: s.title }))
])

const allJobs = computed(() => {
  return props.servicesConfig.flatMap(service =>
    (service.options || []).map(option => ({
      ...option,
      serviceId: service.id,
      serviceTitle: service.title
    }))
  )
})

const searchQuery = computed(() => (props.isMobile ? mobileSearchQuery.value : serviceSearchModel.value))

const displayedJobs = computed(() => {
  let jobs = allJobs.value
  if (activeCategoryId.value !== null) {
    jobs = jobs.filter(job => job.serviceId === activeCategoryId.value)
  }
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    jobs = jobs.filter(job => job.label.toLowerCase().includes(query))
  }
  return jobs
})

const toggleJob = (job: { id: number; label: string; serviceId: number; serviceTitle: string }) => {
  if (isOptionBooked(job.label)) {
    emit('unbookOption', job.label)
    return
  }
  const service = props.servicesConfig.find(s => s.id === job.serviceId) ??
    { id: job.serviceId, title: job.serviceTitle }
  emit('bookOption', service, { id: job.id, label: job.label })
}
</script>

<style scoped>
/* Hide the horizontal scrollbar on the mobile category chips row */
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
