import { coachApi } from './api';

export async function getCoachDashboard() {
  const res = await coachApi.getDashboard();
  return res.data;
}

export async function getCoachClasses() {
  const res = await coachApi.getMyClasses();
  return res.data;
}

export async function getCoachSchedules() {
  const res = await coachApi.getMySchedules();
  return res.data;
}

export async function getCoachRooms() {
  const res = await coachApi.getMyRooms();
  return res.data;
}
