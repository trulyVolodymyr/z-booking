<template>
  <div
    class="flex items-center gap-[10px] border border-[#dee0e1] rounded-lg bg-white h-11 px-[14px] min-w-0
      transition-colors focus-within:border-primary"
  >
    <IconUser v-if="icon === 'user'" class="text-primary size-4 shrink-0" />
    <IconMapPin v-else-if="icon === 'map'" class="text-primary size-4 shrink-0" />
    <IconMail v-else-if="icon === 'mail'" class="text-primary size-4 shrink-0" />
    <IconMobile v-else-if="icon === 'mobile'" class="text-primary size-4 shrink-0" />
    <IconPhone v-else-if="icon === 'phone'" class="text-primary size-4 shrink-0" />
    <IconCarProfile v-else-if="icon === 'car'" class="text-primary size-4 shrink-0" />
    <input
      ref="inputEl"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="flex-1 min-w-0 h-full text-sm text-text placeholder:text-[#C2CDD6] focus:outline-none bg-transparent"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('enter')"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TIconName = 'user' | 'map' | 'mail' | 'mobile' | 'phone' | 'car'

interface IProps {
  modelValue: string
  placeholder?: string
  type?: string
  icon?: TIconName
}

withDefaults(defineProps<IProps>(), {
  placeholder: '',
  type: 'text',
  icon: undefined
})

defineEmits<{
  'update:modelValue': [value: string]
  enter: []
}>()

const inputEl = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => inputEl.value?.focus()
})
</script>
