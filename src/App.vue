<template>
  <!-- Widget Test Mode -->
  <div v-if="isWidgetTestMode" class="min-h-screen bg-white flex items-center justify-center">
    <button
      :disabled="!widgetReady"
      class="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-colors"
      :class="widgetReady
        ? 'bg-[#007bff] text-white hover:bg-[#0056b3] cursor-pointer'
        : 'bg-gray-300 text-gray-500 cursor-wait'"
      @click="openWidgetTest"
    >
      {{ widgetReady ? 'Open Widget' : 'Loading...' }}
    </button>
  </div>

  <!-- Normal App -->
  <router-view v-else />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const isWidgetTestMode = ref(false)
const widgetReady = ref(false)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  isWidgetTestMode.value = urlParams.get('widget') === 'true'

  if (isWidgetTestMode.value) {
    // Configure widget to point to the app without widget param
    const baseUrl = window.location.origin + window.location.pathname
    const token = urlParams.get('token') || ''
    ;(window as any).ZBookingConfig = {
      formUrl: baseUrl,
      token,
      hiddenButton: true
    }

    // Load widget script
    const script = document.createElement('script')
    script.src = import.meta.env.BASE_URL + 'widget.js'
    script.onload = () => {
      console.log('Widget script loaded')
      // Poll until ZBookingWidget is available
      const checkReady = setInterval(() => {
        console.log('Checking for ZBookingWidget...', (window as any).ZBookingWidget)
        if ((window as any).ZBookingWidget) {
          widgetReady.value = true
          clearInterval(checkReady)
        }
      }, 100)
    }
    script.onerror = (e) => {
      console.error('Failed to load widget script', e)
    }
    document.body.appendChild(script)
  }
})

const openWidgetTest = () => {
  if (widgetReady.value && (window as any).ZBookingWidget) {
    (window as any).ZBookingWidget.open()
  }
}
</script>
