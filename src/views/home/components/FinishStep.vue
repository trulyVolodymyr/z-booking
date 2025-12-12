<template>
  <div class="flex items-center justify-center min-h-screen bg-white p-8 flex-1">
    <div class="max-w-2xl w-full text-center">
      <!-- Success Icon -->
      <div class="flex justify-center mb-8">
        <img
          src="@/assets/images/SealCheck.png"
          alt="Success"
          class="size-[160px]"
        >
      </div>

      <!-- Thank you message -->
      <p class="text-lg text-text mb-4">
        Thank you, your appointment booking for the
      </p>

      <!-- Date and Time -->
      <h1 class="text-3xl font-bold text-text mb-4">
        {{ formattedDate }} at {{ formattedTime }}
      </h1>

      <!-- Confirmation message -->
      <p class="text-base text-text mb-12">
        has been successfully received. You will receive a final confirmation shortly.
      </p>

      <!-- Additional info -->
      <p class="text-sm text-text mb-8">
        If you have any questions about your appointment booking, you can also reach us by phone or email.
      </p>

      <!-- Contact section -->
      <div class="flex items-center justify-center gap-8">
        <!-- Profile Image -->
        <div class="flex-shrink-0">
          <img
            src="@/assets/images/profile.jpg"
            alt="Contact person"
            class="w-32 h-32 rounded-full object-cover"
          >
        </div>

        <!-- Contact Details -->
        <div class="flex flex-col gap-6 text-left">
          <!-- Phone -->
          <div class="flex items-start gap-4">
            <IconPhone class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <a
                href="tel:+4912345678910"
                class="text-primary text-lg font-semibold hover:underline"
              >
                +49 1234 567891011
              </a>
              <p class="text-sm text-text mt-1">
                Mon. - Fri.: 8 AM - 5 PM
              </p>
              <p class="text-sm text-text">
                Sat. and Sun.: closed
              </p>
            </div>
          </div>

          <!-- Email -->
          <div class="flex items-center gap-4">
            <IconMail class="w-6 h-6 text-primary flex-shrink-0" />
            <a
              href="mailto:info@autohaus.de"
              class="text-primary text-lg font-semibold hover:underline"
            >
              info@autohaus.de
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

const { selectedDate, selectedTime } = useAppointmentBooking()

// Format date as "Month Day, Year" (e.g., "August 21, 2025")
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''

  const date = new Date(selectedDate.value)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return date.toLocaleDateString('en-US', options)
})

// Format time as is (already in "10:15 AM" format)
const formattedTime = computed(() => {
  return selectedTime.value || ''
})
</script>
