<template>
  <div class="flex gap-3 items-center shrink-0">
    <img
      :src="logoUrl"
      alt="Logo"
      class="1250:!w-[170px] 1250:!h-[73px] w-[120px] h-[52px] shrink-0 object-contain"
    >

    <div class="flex flex-col gap-1 items-start min-w-0">
      <p v-if="companyName" class="font-serif font-semibold text-[18px] leading-7 text-text">
        {{ companyName }}
      </p>

      <div v-if="addressLine1 || addressLine2" class="flex flex-col text-[10px] leading-[1.4] text-text">
        <span v-if="addressLine1">{{ addressLine1 }}</span>
        <span v-if="addressLine2">{{ addressLine2 }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

interface IProps {
  companyName?: string
  logoUrl?: string
  addressLine1?: string
  addressLine2?: string
}

withDefaults(defineProps<IProps>(), {
  companyName: 'Autohaus Krüger und Schellenberg GmbH',
  logoUrl: '/src/assets/images/logo.png',
  addressLine1: '',
  addressLine2: ''
})

</script>
