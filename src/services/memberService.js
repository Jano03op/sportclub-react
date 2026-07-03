import { memberApi, reservationsApi } from './api';

export async function getMemberDashboard() {
  const res = await memberApi.getDashboard();
  return res.data;
}

export async function getMemberClasses(filters) {
  const res = await memberApi.getClasses(filters);
  return res.data;
}

export async function getMemberClassById(id) {
  const res = await memberApi.getClassById(id);
  return res.data;
}

export async function getMemberSports() {
  const res = await memberApi.getSports();
  return res.data;
}

export async function getMemberRooms() {
  const res = await memberApi.getRooms();
  return res.data;
}

export async function getMyReservations() {
  const res = await reservationsApi.getMyReservations();
  return res.data;
}

export async function createReservation(data) {
  const res = await reservationsApi.create(data);
  return res.data;
}

export async function cancelReservation(id) {
  const res = await reservationsApi.cancel(id);
  return res.data;
}
