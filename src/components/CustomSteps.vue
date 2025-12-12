<template>
  <div class="custom-steps">
    <div class="steps-container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
        :class="{ 'last-step': index === steps.length - 1 }"
      >
        <!-- Step Circle -->
        <div class="step-circle-container">
          <div
            class="step-circle"
            :class="{
              'completed': index < activeStep,
              'active': index === activeStep,
              'inactive': index > activeStep,
              'disabled': !canNavigateToStep(index)
            }"
            @click="handleStepClick(index)"
          >
            <!-- Completed step with check icon -->

            <IconCheckCircle v-if="index < activeStep" />
            <!-- Active or inactive step with number -->
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>

          <!-- Connector line -->
          <div
            v-if="index < steps.length - 1"
            class="step-connector"
            :class="{
              'completed': index < activeStep,
              'hidden-under-title': index === activeStep
            }"
          />
        </div>

        <!-- Step Title - only show for active step -->
        <div
          v-if="index === activeStep"
          class="step-title active"
        >
          {{ step }}
        </div>
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
.custom-steps {
  width: 100%;
}

.steps-container {
  display: flex;
  align-items: flex-start;
  justify-content: end;
  gap: 0;
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
