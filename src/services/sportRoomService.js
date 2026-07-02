import { sportRoomsApi } from './api'

export async function getSportRooms() {
  const res = await sportRoomsApi.getAll()
  return res.data
}

export async function createSportRoom(data) {
  return sportRoomsApi.create(data)
}

export async function updateSportRoom(id, data) {
  return sportRoomsApi.update(id, data)
}

export async function deleteSportRoom(id) {
  return sportRoomsApi.remove(id)
}
