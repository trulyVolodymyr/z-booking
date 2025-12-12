import { useApiClient } from '../client'

export interface IConfigParams {
  token: string
}

export interface IAvailableDaysParams {
  token: string
  workIds: number[]
}

export interface IAvailableTimesParams {
  token: string
  date: string // YYYY-MM-DD format
  workIds: number[]
}

export interface IReservationParams {
  token: string
  time: string // ISO datetime format
  workIds: number[]
  externalPortal: string
  existingReservationId: string | null
  vip: boolean
  expectedReservationPeriod: number
}

export interface IConfirmBookingParams {
  token: string
  appointmentId: string
  car: {
    licenseplate: string
    type: string
    mileage: number
    vin: string
  }
  customer: {
    firstname: string
    surname: string
    address: string
    zip: string
    city: string
    phones: Array<{
      number: string
      type: string
    }>
  }
  comment: string
  additionalData: Array<{
    key: string
    value: string
  }>
}

export const getConfig = async (params: IConfigParams) => {
  const response = await useApiClient.get('/config' as any, {
    params: {
      token: params.token
    }
  })
  return response
}

export const getAvailableDays = async (params: IAvailableDaysParams) => {
  const response = await useApiClient.get('/available-days' as any, {
    params: {
      token: params.token,
      workIds: params.workIds
    },
    paramsSerializer: {
      indexes: null // This will format as workIds[]=1&workIds[]=2
    }
  })
  return response
}

export const getAvailableTimes = async (params: IAvailableTimesParams) => {
  const response = await useApiClient.get('/available-times' as any, {
    params: {
      token: params.token,
      date: params.date,
      workIds: params.workIds
    },
    paramsSerializer: {
      indexes: null // This will format as workIds[]=1&workIds[]=2
    }
  })
  return response
}

export const createReservation = async (params: IReservationParams) => {
  const response = await useApiClient.post('/reservation' as any, {
    token: params.token,
    time: params.time,
    workIds: params.workIds,
    externalPortal: params.externalPortal,
    existingReservationId: params.existingReservationId,
    vip: params.vip,
    expectedReservationPeriod: params.expectedReservationPeriod
  })
  return response
}

export const confirmBooking = async (params: IConfirmBookingParams) => {
  const { token, appointmentId, ...bookingData } = params
  const response = await useApiClient.put(`/appointment/${appointmentId}` as any, {
    token,
    ...bookingData
  })
  return response
}
