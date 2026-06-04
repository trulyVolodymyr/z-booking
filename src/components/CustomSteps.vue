<template>
  <div class="flex items-center w-min">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Completed step: checkmark -->
      <div
        v-if="index < activeStep"
        class="size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
        :class="canNavigateToStep(index) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
        @click="handleStepClick(index)"
      >
        <IconCheckCircle class="text-primary size-8" />
      </div>

      <!-- Active step: filled pill with number + label -->
      <div
        v-else-if="index === activeStep"
        class="h-8 rounded-full bg-primary border-2 border-primary flex items-center justify-center
          gap-2 pl-1 pr-3 shrink-0 cursor-default transition-all duration-300"
      >
        <span class="size-6 rounded-full flex items-center justify-center text-xs font-semibold text-white">
          {{ index + 1 }}
        </span>
        <span class="text-xs 1080:text-sm font-semibold text-white whitespace-nowrap">
          {{ step }}
        </span>
      </div>

      <!-- Upcoming step: outlined circle with number -->
      <div
        v-else
        class="size-8 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0
          transition-all duration-300"
        :class="canNavigateToStep(index) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
        @click="handleStepClick(index)"
      >
        <span class="text-xs 1080:text-sm font-semibold text-primary">
          {{ index + 1 }}
        </span>
      </div>

      <!-- Divider -->
      <div
        v-if="index < steps.length - 1"
        class="h-px w-6 1080:w-8 mx-3 bg-[#dae1e7] shrink-0"
      />
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
