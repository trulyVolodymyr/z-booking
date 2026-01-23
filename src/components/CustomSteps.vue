<template>
  <div class="flex">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex flex-col items-center relative transition-all duration-300"
      :class="[
        index === activeStep ? 'flex-[0_0_240px] max-w-[240px]' : 'flex-[0_0_120px] max-w-[150px]',
        index === steps.length - 1 && index !== activeStep ? 'flex-[0_0_auto]' : '',
        index === steps.length - 1 && index === activeStep ? 'flex-[0_0_160px]' : ''
      ]"
    >
      <!-- Step Circle -->
      <div class="flex items-center w-full relative">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
            transition-all duration-300 relative z-[2]"
          :class="{
            'bg-transparent': index < activeStep,
            'bg-primary border-2 border-primary': index === activeStep,
            'bg-primaryBg  border-2 border-[#e6ebef]': index > activeStep,
            'cursor-not-allowed opacity-50': !canNavigateToStep(index)
          }"
          @click="handleStepClick(index)"
        >
          <IconCheckCircle v-if="index < activeStep" class="text-primary" />
          <span
            v-else
            class="text-sm font-semibold"
            :class="index === activeStep ? 'text-white' : 'text-[#666]'"
          >
            {{ index + 1 }}
          </span>
        </div>

        <!-- Connector line -->
        <div
          v-if="index < steps.length - 1"
          class="flex-1 h-[2px] mx-4 transition-colors duration-300"
          :class="{
            'bg-primary': index < activeStep,
            'bg-[#e6ebef]': index >= activeStep,
            'z-[1]': index === activeStep
          }"
        />
      </div>

      <!-- Step Title - only show for active step -->
      <div
        v-if="index === activeStep"
        class="absolute left-12 top-1/2 -translate-y-1/2 text-base font-semibold
          text-primary whitespace-nowrap z-[3] bg-primaryBg  px-2"
      >
        {{ step }}
      </div>
    </div>
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

<style scoped>
.steps-container {
  display: flex;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 120px;
  max-width: 150px;
  position: relative;
  transition: all 0.3s ease;
}

.step-item:has(.step-title) {
  flex: 0 0 240px;
  max-width: 240px;
}

.step-circle-container {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  background: white;
}

.step-circle.completed {
  background: transparent;
}

.step-circle.active {
  background: #1769db;
  border: 2px solid #1769db;
}

.step-circle.inactive {
  background: white;
  border: 2px solid #e6ebef;
}

.step-circle.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.step-number {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.step-circle.active .step-number {
  color: white;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #e6ebef;
  margin-left: 16px;
  margin-right: 16px;
  transition: background-color 0.3s ease;
}

.step-connector.completed {
  background: #1769db;
}

.step-connector.hidden-under-title {
  z-index: 1;
}

.step-title {
  position: absolute;
  left: 48px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 600;
  color: #1769db;
  white-space: nowrap;
  z-index: 3;
  background: white;
  padding: 0 8px;
}

.last-step:not(:has(.step-title)){
  flex:0 0 auto;
}
.last-step:has(.step-title){
  flex:0 0 160px;
}
</style>
