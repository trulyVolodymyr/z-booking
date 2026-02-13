<template>
  <div>
    <!-- Mobile Layout -->
    <template v-if="isMobile">
      <p class="text-text text-center mb-4">
        {{ $t('general.vehicleCustomerDataDescription') }}
      </p>

      <!-- Customer Information -->
      <p class="font-semibold text-sm text-text mb-3">
        {{ $t('general.customerInformation') }}
      </p>

      <div class="space-y-3 mb-4">
        <!-- Email -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMail class="text-primary" />
          </div>
          <input
            ref="emailInput"
            v-model="bookingInfo.email"
            type="email"
            :placeholder="$t('general.emailPlaceholder')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="firstNameInput?.focus()"
          >
        </div>

        <!-- First Name -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconUser class="text-primary" />
          </div>
          <input
            ref="firstNameInput"
            v-model="bookingInfo.firstName"
            type="text"
            :placeholder="$t('general.firstNamePlaceholder')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="lastNameInput?.focus()"
          >
        </div>

        <!-- Last Name -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconUser class="text-primary" />
          </div>
          <input
            ref="lastNameInput"
            v-model="bookingInfo.lastName"
            type="text"
            :placeholder="$t('general.lastNamePlaceholder')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="mobileInput?.focus()"
          >
        </div>

        <!-- Mobile -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMobile class="text-primary" />
          </div>
          <input
            ref="mobileInput"
            v-model="bookingInfo.mobile"
            type="phone"
            :placeholder="$t('general.mobilePlaceholder')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="phoneInput?.focus()"
          >
        </div>

        <!-- Phone -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconPhone class="text-primary" />
          </div>
          <input
            ref="phoneInput"
            v-model="bookingInfo.phone"
            type="text"
            :placeholder="$t('general.phone')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="streetInput?.focus()"
          >
        </div>
      </div>

      <!-- Address -->
      <p class="font-semibold text-sm text-text mb-3">
        {{ $t('general.address') }}
      </p>

      <div class="space-y-3 mb-4">
        <!-- Street -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMapPin class="text-primary" />
          </div>
          <input
            ref="streetInput"
            v-model="bookingInfo.street"
            type="text"
            :placeholder="$t('general.street')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="zipCodeInput?.focus()"
          >
        </div>

        <!-- ZIP Code -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMapPin class="text-primary" />
          </div>
          <input
            ref="zipCodeInput"
            v-model="bookingInfo.zipCode"
            type="text"
            :placeholder="$t('general.zipCode')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="cityInput?.focus()"
          >
        </div>

        <!-- City -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMapPin class="text-primary" />
          </div>
          <input
            ref="cityInput"
            v-model="bookingInfo.city"
            type="text"
            :placeholder="$t('general.city')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="licensePlateInput?.focus()"
          >
        </div>
      </div>

      <!-- Vehicle Info -->
      <p class="font-semibold text-sm text-text mb-3">
        {{ $t('general.vehicleInfo') }}
      </p>

      <div class="space-y-3 mb-4">
        <!-- License Plate -->
        <div class="flex items-center border-2 border-[#C2CDD6] rounded-lg bg-primaryBg  overflow-hidden w-2/3">
          <div class="w-10 h-9 1250:h-10 bg-[#003399] flex items-center justify-center shrink-0" />
          <input
            ref="licensePlateInput"
            v-model="bookingInfo.licensePlate"
            type="text"
            :placeholder="$t('general.licensePlate')"
            class="flex-1 h-9 1250:h-10 text-lg font-bold px-4 text-text placeholder:text-[#C2CDD6]
            placeholder:font-normal
              focus:outline-none uppercase"
            @keydown.enter="carBrandInput?.focus()"
          >
        </div>

        <!-- Car Brand -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconCarProfile class="text-primary" />
          </div>
          <input
            ref="carBrandInput"
            v-model="bookingInfo.carBrand"
            type="text"
            :placeholder="$t('general.carBrand')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="modelInput?.focus()"
          >
        </div>

        <!-- Model -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconCarProfile class="text-primary" />
          </div>
          <input
            ref="modelInput"
            v-model="bookingInfo.model"
            type="text"
            :placeholder="$t('general.model')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            @keydown.enter="mileageInput?.focus()"
          >
        </div>

        <!-- Mileage -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  px-4">
          <input
            ref="mileageInput"
            v-model="bookingInfo.mileage"
            type="text"
            :placeholder="$t('general.mileage')"
            class="flex-1 h-9 1250:h-10 text-sm text-text placeholder:text-[#C2CDD6]
              focus:outline-none"
            @keydown.enter="vinInput?.focus()"
          >
        </div>

        <!-- VIN -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  px-4">
          <input
            ref="vinInput"
            v-model="bookingInfo.vin"
            type="text"
            :placeholder="$t('general.vin')"
            class="flex-1 h-9 1250:h-10 text-sm text-text placeholder:text-[#C2CDD6]
              focus:outline-none"
            @keydown.enter="vinInput?.blur()"
          >
        </div>
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
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 text-primary mb-4"
          @click="emit('go-back')"
        >
          <IconArrowBack class="text-primary size-6" />
        </button>
        <p class="font-semibold text-2xl text-text mb-4 font-serif">
          {{ $t('general.vehicleAndCustomerData') }}
        </p>
      </div>

      <div v-if="false" class="flex px-5 py-2 bg-primaryBg  w-full mb-5 border border-[#E6EBEF] rounded-[10px]">
        <div class="w-[280px]">
          <p class="font-semibold text-xl text-text mb-3">
            {{ $t('general.areYouAlreadyCustomer') }}
          </p>
          <p class="text-text text-[15px]">
            {{ $t('general.retrieveDataByEmail') }}
          </p>
        </div>

        <div class="p-3 bg-[#F9FAFB] rounded-lg flex-1">
          <p class="font-semibold text-xl mb-3">
            {{ $t('general.yourEmailAddress') }}
          </p>

          <div class="flex gap-3">
            <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  flex-1">
              <div class="w-[40px] h-9 1250:h-10 flex items-center justify-center border-r border-[#E6EBEF]">
                <IconMail class="text-[#707070]" />
              </div>
              <input
                type="email"
                placeholder="email@email.com"
                class="flex-1 h-9 1250:h-10 px-4 text-text placeholder:text-[#C2CDD6]
                  focus:outline-none rounded-r-lg"
              >
            </div>
            <button
              class="flex items-center justify-center bg-primary text-white rounded-lg
                h-9 1250:h-10 shrink-0 py-[10px] px-4 transition-colors"
            >
              {{ $t('general.requestAccessLink') }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p class="font-semibold text-sm text-text mb-3">
          {{ $t('general.customerInformation') }}
        </p>

        <div class="flex gap-3 mb-3">
          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconUser class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.firstName"
              type="text"
              :placeholder="$t('general.firstNamePlaceholder')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconUser class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.lastName"
              type="text"
              :placeholder="$t('general.lastNamePlaceholder')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  mb-3">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMail class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.email"
            type="email"
            :placeholder="$t('general.emailPlaceholder')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex gap-3 mb-5">
          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconMobile class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.mobile"
              type="text"
              :placeholder="$t('general.mobilePlaceholder')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconPhone class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.phone"
              type="text"
              :placeholder="$t('general.phone')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <p class="font-semibold text-sm text-text mb-3">
          {{ $t('general.address') }}
        </p>

        <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  mb-3">
          <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
            <IconMapPin class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.street"
            type="text"
            :placeholder="$t('general.street')"
            class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex gap-3 mb-5">
          <div class="flex w-[220px] items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconMapPin class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.zipCode"
              type="text"
              :placeholder="$t('general.zipCode')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconMapPin class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.city"
              type="text"
              :placeholder="$t('general.city')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <p class="font-semibold text-sm text-text mb-3">
          {{ $t('general.vehicleInfo') }}
        </p>

        <div class="flex flex-wrap gap-3 mb-3">
          <div
            class="flex w-full 1080:w-[220px] items-center border border-[#324448]
          rounded-lg bg-primaryBg  relative overflow-hidden"
          >
            <div
              class="w-8 h-9 1250:h-10 bg-[#003399] flex items-center justify-center shrink-0 absolute
              left-0 z-10"
            />
            <input
              v-model="bookingInfo.licensePlate"
              type="text"
              :placeholder="$t('general.licensePlate')"
              class="flex-1 h-9 1250:h-10 text-2xl px-4 text-[#324448] pl-12 w-full
              placeholder:text-[#C2CDD6] placeholder:font-normal z-[1]
              focus:outline-none uppercase placeholder:normal-case placeholder:font-sans"
              style="font-family: 'FE-Font', sans-serif;"
            >
          </div>

          <div class="flex flex-1 min-w-0 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconCarProfile class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.carBrand"
              type="text"
              :placeholder="$t('general.carBrand')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 min-w-0 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg ">
            <div class="w-10 h-9 1250:h-10 text-sm flex items-center justify-center">
              <IconCarProfile class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.model"
              type="text"
              :placeholder="$t('general.model')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex w-[220px] items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  px-4">
            <input
              v-model="bookingInfo.mileage"
              type="text"
              :placeholder="$t('general.mileage')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-primaryBg  px-4">
            <input
              v-model="bookingInfo.vin"
              type="text"
              :placeholder="$t('general.vin')"
              class="flex-1 h-9 1250:h-10 text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="mt-4 flex gap-2 items-start">
          <el-checkbox
            id="privacyConsent" v-model="bookingInfo.privacyConsent"
            size="large"
            class="!mr-0 checkbox-input"
          />

          <label class="text-xs 1250:text-sm text-text text-wrap" for="privacyConsent">
            {{ $t('general.privacyConsent') }}
          </label>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

const emailInput = ref<HTMLInputElement | null>(null)
const firstNameInput = ref<HTMLInputElement | null>(null)
const lastNameInput = ref<HTMLInputElement | null>(null)
const mobileInput = ref<HTMLInputElement | null>(null)
const phoneInput = ref<HTMLInputElement | null>(null)
const streetInput = ref<HTMLInputElement | null>(null)
const zipCodeInput = ref<HTMLInputElement | null>(null)
const cityInput = ref<HTMLInputElement | null>(null)
const licensePlateInput = ref<HTMLInputElement | null>(null)
const carBrandInput = ref<HTMLInputElement | null>(null)
const modelInput = ref<HTMLInputElement | null>(null)
const mileageInput = ref<HTMLInputElement | null>(null)
const vinInput = ref<HTMLInputElement | null>(null)

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
