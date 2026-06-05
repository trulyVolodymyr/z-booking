<template>
  <div class="w-full 900:flex-1 900:flex 900:flex-col 900:min-h-0">
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        {{ $t('general.vehicleCustomerDataDescription') }}
      </p>

      <!-- Vehicle Info -->
      <p class="font-semibold text-sm text-[#5e6267] mb-3">
        {{ $t('general.vehicleInfo') }}
      </p>
      <div class="space-y-3 mb-5">
        <!-- License Plate -->
        <div
          class="flex items-center border border-[#324448] rounded-lg bg-white overflow-hidden w-full h-11
            transition-colors focus-within:border-primary"
        >
          <div
            class="w-8 h-full bg-[#003399] flex flex-col items-center justify-center gap-[3px] shrink-0"
          >
            <IconPlateEu class="size-[14px]" />
            <IconPlateD class="w-[9px] h-3" />
          </div>
          <input
            v-model="bookingInfo.licensePlate"
            type="text"
            :placeholder="$t('general.licensePlate')"
            class="flex-1 min-w-0 h-full text-lg font-bold px-3 text-[#324448] placeholder:text-[#C2CDD6]
              placeholder:font-normal placeholder:normal-case focus:outline-none uppercase bg-transparent"
            style="font-family: 'FE-Font', sans-serif;"
            @keydown.enter="carBrandInput?.focus()"
          >
        </div>

        <!-- Car Brand -->
        <FieldInput
          ref="carBrandInput"
          v-model="bookingInfo.carBrand"
          :placeholder="$t('general.carBrand')"
          icon="car"
          @enter="modelInput?.focus()"
        />
        <!-- Model -->
        <FieldInput
          ref="modelInput"
          v-model="bookingInfo.model"
          :placeholder="$t('general.model')"
          icon="car"
          @enter="mileageInput?.focus()"
        />
        <!-- Mileage -->
        <FieldInput
          ref="mileageInput"
          v-model="bookingInfo.mileage"
          :placeholder="$t('general.mileage')"
          @enter="vinInput?.focus()"
        />
        <!-- VIN -->
        <FieldInput
          ref="vinInput"
          v-model="bookingInfo.vin"
          :placeholder="$t('general.vin')"
          @enter="firstNameInput?.focus()"
        />
      </div>

      <!-- Customer Information -->
      <p class="font-semibold text-sm text-[#5e6267] mb-3">
        {{ $t('general.customerInformation') }}
      </p>
      <div class="space-y-3 mb-5">
        <FieldInput
          ref="firstNameInput"
          v-model="bookingInfo.firstName"
          :placeholder="$t('general.firstNamePlaceholder')"
          icon="user"
          @enter="lastNameInput?.focus()"
        />
        <FieldInput
          ref="lastNameInput"
          v-model="bookingInfo.lastName"
          :placeholder="$t('general.lastNamePlaceholder')"
          icon="user"
          @enter="streetInput?.focus()"
        />
        <FieldInput
          ref="streetInput"
          v-model="bookingInfo.street"
          :placeholder="$t('general.street')"
          icon="map"
          @enter="zipCodeInput?.focus()"
        />
        <FieldInput
          ref="zipCodeInput"
          v-model="bookingInfo.zipCode"
          :placeholder="$t('general.zipCode')"
          icon="map"
          @enter="cityInput?.focus()"
        />
        <FieldInput
          ref="cityInput"
          v-model="bookingInfo.city"
          :placeholder="$t('general.city')"
          icon="map"
          @enter="emailInput?.focus()"
        />
      </div>

      <!-- Contact information -->
      <p class="font-semibold text-sm text-[#5e6267] mb-3">
        {{ $t('general.contactInformation') }}
      </p>
      <div class="space-y-3 mb-4">
        <FieldInput
          ref="emailInput"
          v-model="bookingInfo.email"
          type="email"
          :placeholder="$t('general.emailPlaceholder')"
          icon="mail"
          @enter="mobileInput?.focus()"
        />
        <FieldInput
          ref="mobileInput"
          v-model="bookingInfo.mobile"
          type="tel"
          :placeholder="$t('general.mobilePlaceholder')"
          icon="mobile"
          @enter="phoneInput?.focus()"
        />
        <FieldInput
          ref="phoneInput"
          v-model="bookingInfo.phone"
          :placeholder="$t('general.phone')"
          icon="phone"
        />
      </div>

      <!-- Privacy Consent -->
      <div class="mt-4">
        <el-checkbox v-model="bookingInfo.privacyConsent" size="large" class="checkbox-top-align">
          <p class="text-xs text-text whitespace-normal break-words">
            {{ $t('general.privacyConsentMobile') }}
          </p>
        </el-checkbox>
      </div>
    </template>

    <!-- Desktop Layout -->
    <template v-else>
      <!-- Header (stays fixed above the scroll area) -->
      <div class="flex items-center gap-3 shrink-0 mb-6">
        <button class="flex items-center text-primary" @click="emit('go-back')">
          <IconArrowBack class="text-primary size-6" />
        </button>
        <p class="font-serif font-semibold text-xl text-text">
          {{ $t('general.vehicleAndCustomerData') }}
        </p>
      </div>

      <!-- Scrollable content -->
      <div class="flex flex-col gap-6 900:flex-1 900:min-h-0 900:overflow-y-auto 900:pr-1">
        <!-- Vehicle Info -->
        <div class="flex flex-col gap-2">
          <p class="font-semibold text-sm text-[#5e6267]">
            {{ $t('general.vehicleInfo') }}
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex gap-3 items-center">
              <!-- License plate -->
              <div
                class="flex items-center border border-[#324448] rounded-lg bg-white
                  overflow-hidden w-[260px] shrink-0 h-11 transition-colors focus-within:border-primary"
              >
                <div
                  class="w-8 h-full bg-[#003399] flex flex-col items-center justify-center gap-[3px] shrink-0"
                >
                  <IconPlateEu class="size-[14px]" />
                  <IconPlateD class="w-[9px] h-3" />
                </div>
                <input
                  v-model="bookingInfo.licensePlate"
                  type="text"
                  :placeholder="$t('general.licensePlate')"
                  class="flex-1 min-w-0 h-full text-2xl px-3 text-[#324448] placeholder:text-[#C2CDD6]
                    placeholder:font-normal placeholder:normal-case placeholder:font-sans focus:outline-none
                    uppercase bg-transparent"
                  style="font-family: 'FE-Font', sans-serif;"
                >
              </div>
              <!-- Car Brand + Model -->
              <FieldInput
                v-model="bookingInfo.carBrand"
                :placeholder="$t('general.carBrand')"
                icon="car"
                class="flex-1"
              />
              <FieldInput v-model="bookingInfo.model" :placeholder="$t('general.model')" icon="car" class="flex-1" />
            </div>
            <div class="flex gap-3">
              <FieldInput
                v-model="bookingInfo.mileage"
                :placeholder="$t('general.mileage')"
                class="w-[180px] shrink-0"
              />
              <FieldInput v-model="bookingInfo.vin" :placeholder="$t('general.vin')" class="flex-1" />
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-[#E6EBEF] w-full" />

        <!-- Customer + Contact columns -->
        <div class="flex gap-6 items-stretch">
          <!-- Customer Information -->
          <div class="flex-[1.7] min-w-0 flex flex-col gap-2">
            <p class="font-semibold text-sm text-[#5e6267]">
              {{ $t('general.customerInformation') }}
            </p>
            <div class="flex flex-col gap-3">
              <div class="flex gap-3">
                <FieldInput
                  v-model="bookingInfo.firstName"
                  :placeholder="$t('general.firstNamePlaceholder')"
                  icon="user"
                  class="flex-1"
                />
                <FieldInput
                  v-model="bookingInfo.lastName"
                  :placeholder="$t('general.lastNamePlaceholder')"
                  icon="user"
                  class="flex-1"
                />
              </div>
              <FieldInput v-model="bookingInfo.street" :placeholder="$t('general.street')" icon="map" />
              <div class="flex gap-3">
                <FieldInput
                  v-model="bookingInfo.zipCode"
                  :placeholder="$t('general.zipCode')"
                  icon="map"
                  class="w-[180px] shrink-0"
                />
                <FieldInput v-model="bookingInfo.city" :placeholder="$t('general.city')" icon="map" class="flex-1" />
              </div>
            </div>
          </div>

          <!-- Vertical divider -->
          <div class="w-px bg-[#E6EBEF] self-stretch shrink-0" />

          <!-- Contact information -->
          <div class="flex-1 min-w-0 flex flex-col gap-2">
            <p class="font-semibold text-sm text-[#5e6267]">
              {{ $t('general.contactInformation') }}
            </p>
            <div class="flex flex-col gap-3">
              <FieldInput
                v-model="bookingInfo.email"
                type="email"
                :placeholder="$t('general.emailPlaceholder')"
                icon="mail"
              />
              <FieldInput
                v-model="bookingInfo.mobile"
                type="tel"
                :placeholder="$t('general.mobilePlaceholder')"
                icon="mobile"
              />
              <FieldInput v-model="bookingInfo.phone" :placeholder="$t('general.phone')" icon="phone" />
            </div>
          </div>
        </div>

        <!-- Privacy consent -->
        <div class="flex gap-2 items-start">
          <el-checkbox
            id="privacyConsent"
            v-model="bookingInfo.privacyConsent"
            size="large"
            class="!mr-0 checkbox-input"
          />
          <label class="text-xs 1250:text-sm text-text text-wrap" for="privacyConsent">
            {{ $t('general.privacyConsent') }}<span class="text-primary"> *</span>
          </label>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'
import FieldInput from '@/views/home/components/FieldInput.vue'

const emailInput = ref<InstanceType<typeof FieldInput> | null>(null)
const firstNameInput = ref<InstanceType<typeof FieldInput> | null>(null)
const lastNameInput = ref<InstanceType<typeof FieldInput> | null>(null)
const mobileInput = ref<InstanceType<typeof FieldInput> | null>(null)
const phoneInput = ref<InstanceType<typeof FieldInput> | null>(null)
const streetInput = ref<InstanceType<typeof FieldInput> | null>(null)
const zipCodeInput = ref<InstanceType<typeof FieldInput> | null>(null)
const cityInput = ref<InstanceType<typeof FieldInput> | null>(null)
const carBrandInput = ref<InstanceType<typeof FieldInput> | null>(null)
const modelInput = ref<InstanceType<typeof FieldInput> | null>(null)
const mileageInput = ref<InstanceType<typeof FieldInput> | null>(null)
const vinInput = ref<InstanceType<typeof FieldInput> | null>(null)

interface IProps {
  isMobile?: boolean
}

interface IEmits {
  (e: 'go-back'): void
}

withDefaults(defineProps<IProps>(), {
  isMobile: false
})

const emit = defineEmits<IEmits>()

const { bookingInfo } = useAppointmentBooking()
</script>

<style lang='scss'>
.checkbox-top-align {
  &.el-checkbox {
    align-items: flex-start !important;
  }
  .el-checkbox__input {
    margin-top: 2px;
  }
}

.checkbox-input {
  .el-checkbox__input {
    @apply -mt-[22px];
  }
}
</style>
