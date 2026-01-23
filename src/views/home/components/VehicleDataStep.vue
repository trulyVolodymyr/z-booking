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
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMail class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.email"
            type="email"
            :placeholder="$t('general.emailPlaceholder')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- First Name -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconUser class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.firstName"
            type="text"
            :placeholder="$t('general.firstNamePlaceholder')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- Last Name -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconUser class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.lastName"
            type="text"
            :placeholder="$t('general.lastNamePlaceholder')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- Mobile -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMobile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.mobile"
            type="text"
            :placeholder="$t('general.mobilePlaceholder')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- Phone -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconPhone class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.phone"
            type="text"
            :placeholder="$t('general.phone')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>
      </div>

      <!-- Address -->
      <p class="font-semibold text-sm text-text mb-3">
        {{ $t('general.address') }}
      </p>

      <div class="space-y-3 mb-4">
        <!-- Street -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMapPin class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.street"
            type="text"
            :placeholder="$t('general.street')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- ZIP Code -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMapPin class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.zipCode"
            type="text"
            :placeholder="$t('general.zipCode')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- City -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMapPin class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.city"
            type="text"
            :placeholder="$t('general.city')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>
      </div>

      <!-- Vehicle Info -->
      <p class="font-semibold text-sm text-text mb-3">
        {{ $t('general.vehicleInfo') }}
      </p>

      <div class="space-y-3 mb-4">
        <!-- License Plate -->
        <div class="flex items-center border-2 border-[#C2CDD6] rounded-lg bg-white overflow-hidden">
          <div class="w-10 h-[44px] bg-[#003399] flex items-center justify-center shrink-0" />
          <input
            v-model="bookingInfo.licensePlate"
            type="text"
            :placeholder="$t('general.licensePlate')"
            class="flex-1 h-[44px] text-lg font-bold px-4 text-text placeholder:text-[#C2CDD6] placeholder:font-normal
              focus:outline-none uppercase"
          >
        </div>

        <!-- Car Brand -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconCarProfile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.carBrand"
            type="text"
            :placeholder="$t('general.carBrand')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- Model -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconCarProfile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.model"
            type="text"
            :placeholder="$t('general.model')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <!-- Mileage -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white px-4">
          <input
            v-model="bookingInfo.mileage"
            type="text"
            :placeholder="$t('general.mileage')"
            class="flex-1 h-[44px] text-sm text-text placeholder:text-[#C2CDD6]
              focus:outline-none"
          >
        </div>

        <!-- VIN -->
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white px-4">
          <input
            v-model="bookingInfo.vin"
            type="text"
            :placeholder="$t('general.vin')"
            class="flex-1 h-[44px] text-sm text-text placeholder:text-[#C2CDD6]
              focus:outline-none"
          >
        </div>
      </div>

      <!-- Privacy Consent -->
      <div class="mt-4">
        <el-checkbox v-model="bookingInfo.privacyConsent" size="large">
          <p class="text-xs text-text whitespace-normal break-words">
            {{ $t('general.privacyConsentMobile') }}
          </p>
        </el-checkbox>
      </div>
    </template>

    <!-- Desktop Layout -->
    <template v-else>
      <p class="font-medium text-2xl text-text mb-5">
        {{ $t('general.vehicleAndCustomerData') }}
      </p>

      <div v-if="false" class="flex px-5 py-2 bg-white w-full mb-5 border border-[#E6EBEF] rounded-[10px]">
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
            <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white flex-1">
              <div class="w-[40px] h-10 flex items-center justify-center border-r border-[#E6EBEF]">
                <IconMail class="text-[#707070]" />
              </div>
              <input
                type="email"
                placeholder="email@email.com"
                class="flex-1 h-10 px-4 text-text placeholder:text-[#C2CDD6]
                  focus:outline-none rounded-r-lg"
              >
            </div>
            <button
              class="flex items-center justify-center bg-primary text-white rounded-lg
                h-10 shrink-0 py-[10px] px-4 transition-colors"
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
        <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white mb-3">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMail class="text-primary" />
          </div>
          <input
            v-model="bookingInfo.email"
            type="email"
            :placeholder="$t('general.emailPlaceholder')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex gap-3 mb-3">
          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconUser class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.firstName"
              type="text"
              :placeholder="$t('general.firstNamePlaceholder')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconUser class="text-primary" />
            </div>
            <input
              v-model="bookingInfo.lastName"
              type="text"
              :placeholder="$t('general.lastNamePlaceholder')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="flex gap-3 mb-5">
          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconMobile class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.mobile"
              type="text"
              :placeholder="$t('general.mobilePlaceholder')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconPhone class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.phone"
              type="text"
              :placeholder="$t('general.phone')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <p class="font-semibold text-sm text-text mb-3">
          {{ $t('general.address') }}
        </p>

        <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white mb-3">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMapPin class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.street"
            type="text"
            :placeholder="$t('general.street')"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex gap-3 mb-5">
          <div class="flex w-[220px] items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconMapPin class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.zipCode"
              type="text"
              :placeholder="$t('general.zipCode')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconMapPin class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.city"
              type="text"
              :placeholder="$t('general.city')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
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
          rounded-lg bg-white relative overflow-hidden"
          >
            <div
              class="w-8 h-[44px] bg-[#003399] flex items-center justify-center shrink-0 absolute
              left-0 z-10"
            />
            <input
              v-model="bookingInfo.licensePlate"
              type="text"
              :placeholder="$t('general.licensePlate')"
              class="flex-1 h-[44px] text-2xl font-bold px-4 text-[#324448] pl-12 w-full
              placeholder:text-[#C2CDD6] placeholder:font-normal z-[1]
              focus:outline-none uppercase placeholder:normal-case"
            >
          </div>

          <div class="flex flex-1 min-w-0 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconCarProfile class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.carBrand"
              type="text"
              :placeholder="$t('general.carBrand')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 min-w-0 items-center border border-[#E6EBEF] rounded-lg bg-white">
            <div class="w-10 h-[44px] text-sm flex items-center justify-center">
              <IconCarProfile class="text-[#C2CDD6]" />
            </div>
            <input
              v-model="bookingInfo.model"
              type="text"
              :placeholder="$t('general.model')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex w-[220px] items-center border border-[#E6EBEF] rounded-lg bg-white px-4">
            <input
              v-model="bookingInfo.mileage"
              type="text"
              :placeholder="$t('general.mileage')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>

          <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white px-4">
            <input
              v-model="bookingInfo.vin"
              type="text"
              :placeholder="$t('general.vin')"
              class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
              focus:outline-none rounded-r-lg"
            >
          </div>
        </div>

        <div class="mt-4">
          <el-checkbox v-model="bookingInfo.privacyConsent" size="large">
            <p class="text-sm text-text text-wrap">
              {{ $t('general.privacyConsent') }}
            </p>
          </el-checkbox>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

interface IProps {
  isMobile?: boolean
}

withDefaults(defineProps<IProps>(), {
  isMobile: false
})

const { bookingInfo } = useAppointmentBooking()
</script>
