import { sportsApi } from './api'

export async function getSports() {
  const res = await sportsApi.getAll()
  return res.data
}

export async function createSport(data) {
  return sportsApi.create(data)
}

export async function updateSport(id, data) {
  return sportsApi.update(id, data)
}

export async function deleteSport(id) {
  return sportsApi.remove(id)
}

export async function changeSportStatus(id, status) {
  return sportsApi.changeStatus(id, status)
}
