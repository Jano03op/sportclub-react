import { roomsApi } from './api'

export async function getRooms() {
  const res = await roomsApi.getAll()
  return res.data
}

export async function createRoom(data) {
  return roomsApi.create(data)
}

export async function updateRoom(id, data) {
  return roomsApi.update(id, data)
}

export async function deleteRoom(id) {
  return roomsApi.remove(id)
}
