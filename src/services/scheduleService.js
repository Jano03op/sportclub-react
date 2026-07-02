import { schedulesApi } from './api'

export async function getSchedules() {
  const res = await schedulesApi.getAll()
  return res.data
}

export async function createSchedule(data) {
  return schedulesApi.create(data)
}

export async function updateSchedule(id, data) {
  return schedulesApi.update(id, data)
}

export async function deleteSchedule(id) {
  return schedulesApi.remove(id)
}
