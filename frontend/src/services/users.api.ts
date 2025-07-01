const REQRES_URL = "https://reqres.in/api";
const API_KEY = "reqres-free-v1";

export async function fetchUsers(page: number) {
  const res = await fetch(`${REQRES_URL}/users?page=${page}`, { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchColors() {
  const res = await fetch(`${REQRES_URL}/unknown`, { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) throw new Error('Failed to fetch colors');
  return res.json();
}

export async function createUser(data: { name: string; surname: string; email: string; age: string }) {
  const res = await fetch(`${REQRES_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(data),
  });
  return res;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${REQRES_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(data),
  });
  return res;
}

export async function fetchUserDetail(id: string | number) {
  const res = await fetch(`${REQRES_URL}/users/${id}`, { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) throw new Error('Failed to fetch user detail');
  return res.json();
} 