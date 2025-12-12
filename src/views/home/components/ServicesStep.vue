<template>
  <div>
    <p class="font-medium text-xl text-text mb-4">
      Select your service
    </p>
    <p class="text-text mb-6">
      Select the desired service using the search function or by choosing a suitable category.
    </p>

    <div class="flex items-center h-10 bg-[#F9FAFB] rounded-[10px] mx-4">
      <IconSearch class="ml-3" />
      <input
        v-model="serviceSearchModel"
        type="text"
        placeholder="Search for service"
        class="ml-6 outline-none w-full bg-[#F9FAFB] text-sm"
      >
    </div>

    <div class="my-6 uppercase font-semibold text-text flex items-center">
      <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
      <span class="px-4">OR</span>
      <div class="flex-1 h-[1px] bg-[#DAE1E7]" />
    </div>

    <div class="grid grid-cols-3 gap-[10px] mb-6">
      <div
        v-for="(service, index) in servicesConfig"
        :key="index"
        class="border rounded-[10px] cursor-pointer bg-white transition-colors"
        :class="selectedService?.id === service.id ? 'border-primary shadow-md' : 'border-[#C2CDD6]'"
        @click="$emit('selectService', service.id)"
      >
        <div
          class="flex items-center gap-2 rounded-[6px] px-3 py-[6px] border-l-[4px] border-primary"
        >
          {{ service.title }}
        </div>
      </div>
    </div>

    <div class="h-[220px]">
      <span>{{ selectedService?.title }}</span>

      <div v-if="selectedService?.options" class="space-y-3 mt-6">
        <div
          v-for="(option, index) in selectedService.options"
          :key="index"
          class="flex items-center justify-between cursor-pointer"
          @click="$emit('toggleOption', option.label)"
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
</template>

<script lang="ts" setup>
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
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  'update:serviceSearch': [value: string]
  selectService: [serviceId: number]
  toggleOption: [optionLabel: string]
}>()

const serviceSearchModel = computed({
  get: () => props.serviceSearch,
  set: (value: string) => emit('update:serviceSearch', value)
})
</script>
