<template>
  <div class="flex items-center w-min">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Step Circle -->
      <div
        class="size-6 1250:size-8 rounded-full flex items-center justify-center cursor-pointer
          transition-all duration-300 shrink-0"
        :class="{
          'bg-transparent': index < activeStep,
          'bg-white border-2 border-primary': index === activeStep,
          'bg-primaryBg border-2 border-[#e6ebef]': index > activeStep,
          'cursor-not-allowed opacity-50': !canNavigateToStep(index)
        }"
        @click="handleStepClick(index)"
      >
        <IconCheckCircle v-if="index < activeStep" class="text-primary" />
        <span
          v-else
          class="text-xs 1080:text-sm font-semibold"
          :class="index === activeStep ? 'text-primary' : 'text-[#666]'"
        >
          {{ index + 1 }}
        </span>
      </div>

      <!-- Step Title (shown for active step instead of connector) -->
      <span
        v-if="index === activeStep && index < steps.length - 1"
        class="ml-2 text-base font-semibold text-primary whitespace-nowrap"
      >
        {{ step }}
      </span>

      <!-- Connector line (always visible, stays gray) -->
      <div
        v-if="index < steps.length - 1"
        class="w-10 1080:w-14 h-[2px] mx-2 bg-[#e6ebef]"
      />

      <!-- Step Title for last active step -->
      <span
        v-if="index === activeStep && index === steps.length - 1"
        class="mx-2 text-base font-semibold text-primary whitespace-nowrap"
      >
        {{ step }}
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

interface IProps {
  steps: string[]
}

defineProps<IProps>()
const activeStep = defineModel<number>({ required: true })

const { canNavigateToStep } = useAppointmentBooking()

const handleStepClick = (index: number) => {
  if (canNavigateToStep(index)) {
    activeStep.value = index
  }
}
</script>
