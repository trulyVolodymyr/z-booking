<template>
  <div class="flex gap-3 items-start shrink-0">
    <img
      :src="logoUrl"
      alt="Logo"
      class="1250:!w-[170px] 1250:!h-[73px] w-[120px] h-[52px] shrink-0 object-contain"
    >

    <div class="flex flex-col gap-1 items-start min-w-0">
      <p class="font-serif font-semibold text-[18px] leading-7 text-text">
        {{ companyName }}
      </p>

      <div v-if="rating" class="flex items-center gap-[6px] h-6">
        <!-- Stars -->
        <div class="relative inline-flex">
          <div class="flex gap-[2px] text-[#D9DCE1]">
            <svg v-for="i in 5" :key="`bg-${i}`" class="size-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
            </svg>
          </div>
          <div class="absolute inset-0 flex gap-[2px] overflow-hidden text-[#FFB400]" :style="{ width: starWidth }">
            <svg v-for="i in 5" :key="`fg-${i}`" class="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
            </svg>
          </div>
        </div>
        <span class="font-medium text-[12px] leading-4 text-[#141c25] pt-[2px] whitespace-nowrap">
          {{ rating }}<template v-if="ratingCount"> ({{ ratingCount }})</template>
        </span>
      </div>

      <div v-if="addressLine1 || addressLine2" class="flex flex-col text-[10px] leading-[1.4] text-text">
        <span v-if="addressLine1">{{ addressLine1 }}</span>
        <span v-if="addressLine2">{{ addressLine2 }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IProps {
  companyName?: string
  logoUrl?: string
  rating?: string
  ratingCount?: string
  addressLine1?: string
  addressLine2?: string
}

const props = withDefaults(defineProps<IProps>(), {
  companyName: 'Autohaus Krüger und Schellenberg GmbH',
  logoUrl: '/src/assets/images/logo.png',
  rating: '4.8',
  ratingCount: '97',
  addressLine1: 'Böhlerstraße 4a',
  addressLine2: '40667 Meerbusch'
})

const starWidth = computed(() => {
  const value = parseFloat(props.rating || '0')
  const clamped = Math.max(0, Math.min(5, isNaN(value) ? 0 : value))
  return `${(clamped / 5) * 100}%`
})
</script>
