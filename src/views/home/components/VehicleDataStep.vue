<template>
  <div>
    <p class="font-medium text-2xl text-text mb-5">
      Vehicle and Customer Data
    </p>

    <div v-if="false" class="flex px-5 py-2 bg-white w-full mb-5 border border-[#E6EBEF] rounded-[10px]">
      <div class="w-[280px]">
        <p class="font-semibold text-xl text-text mb-3">
          Are you already a customer?
        </p>
        <p class="text-text text-[15px]">
          Automatically retrieve your data using your email address.
        </p>
      </div>

      <div class="p-3 bg-[#F9FAFB] rounded-lg flex-1">
        <p class="font-semibold text-xl mb-3">
          Your Email Address
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
            Request Access Link
          </button>
        </div>
      </div>
    </div>

    <div>
      <p class="font-semibold text-sm text-text mb-3">
        Customer Information
      </p>
      <div class="flex items-center border border-[#E6EBEF] rounded-lg bg-white mb-3">
        <div class="w-10 h-[44px] text-sm flex items-center justify-center">
          <IconMail class="text-primary" />
        </div>
        <input
          v-model="bookingInfo.email"
          type="email"
          placeholder="Email*"
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
            placeholder="First Name*"
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
            placeholder="Last Name*"
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
            placeholder="Mobile*"
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
            placeholder="Phone"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>
      </div>

      <p class="font-semibold text-sm text-text mb-3">
        Address
      </p>

      <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white mb-3">
        <div class="w-10 h-[44px] text-sm flex items-center justify-center">
          <IconMapPin class="text-[#C2CDD6]" />
        </div>
        <input
          v-model="bookingInfo.street"
          type="text"
          placeholder="Street"
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
            placeholder="ZIP Code"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex w-3/4 items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconMapPin class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.city"
            type="text"
            placeholder="City"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>
      </div>

      <p class="font-semibold text-sm text-text mb-3">
        Vehicle Info
      </p>

      <div class="flex gap-3 mb-3">
        <div class="flex w-[220px] items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconCarProfile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.licensePlate"
            type="text"
            placeholder="License Plate"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconCarProfile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.carBrand"
            type="text"
            placeholder="Car Brand"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white">
          <div class="w-10 h-[44px] text-sm flex items-center justify-center">
            <IconCarProfile class="text-[#C2CDD6]" />
          </div>
          <input
            v-model="bookingInfo.model"
            type="text"
            placeholder="Model"
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
            placeholder="Mileage"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>

        <div class="flex flex-1 items-center border border-[#E6EBEF] rounded-lg bg-white px-4">
          <input
            v-model="bookingInfo.vin"
            type="text"
            placeholder="VIN"
            class="flex-1 h-[44px] text-sm pr-4 text-text placeholder:text-[#C2CDD6]
            focus:outline-none rounded-r-lg"
          >
        </div>
      </div>

      <div class="mt-4">
        <el-checkbox v-model="bookingInfo.privacyConsent" size="large">
          <span class="text-sm text-text text-wrap">
            I consent to the processing of my personal data for the purpose of online appointment scheduling.
            More details can be found in our privacy policy*.
          </span>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppointmentBooking } from '@/composables/useAppointmentBooking'

const { bookingInfo } = useAppointmentBooking()
</script>
