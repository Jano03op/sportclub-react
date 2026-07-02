import { usersApi } from './api'

export async function getUsers(filters = {}) {
  const res = await usersApi.getAll(filters)
  return res.data
}

export async function createUser(userData) {
  return usersApi.create(userData)
}

export async function updateUser(id, userData) {
  return usersApi.update(id, userData)
}

export async function deleteUser(id) {
  return usersApi.remove(id)
}
