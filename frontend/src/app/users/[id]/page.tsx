import React from "react";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { fetchUserDetail, fetchColors } from "@/services/users.api";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const API_KEY = 'reqres-free-v1';

async function getUser(id: string): Promise<User | null> {
  const res = await fetch(`https://reqres.in/api/users/${id}`, { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

async function getColor(): Promise<string | null> {
  const res = await fetch("https://reqres.in/api/unknown/2", { headers: { 'x-api-key': API_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data.color;
}

export default async function UserDetail({ params }: { params: { id: string } }) {
  const userData = await fetchUserDetail(params.id);
  const user = userData.data;
  const colorsData = await fetchColors();
  // Örnek olarak ilk rengi alıyoruz, gerekirse id'ye göre eşleştirilebilir
  const color = Array.isArray(colorsData.data) && colorsData.data.length > 0 ? colorsData.data[0].color : null;
  if (!user) return notFound();

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-8">
        <div className="bg-white rounded shadow p-8 flex flex-col items-center max-w-md w-full">
          <img
            src={user.avatar}
            alt={user.first_name}
            className="w-32 h-32 rounded-full mb-4 border-4 border-blue-200"
          />
          <div className="text-2xl font-bold text-gray-800 mb-2">{user.first_name} {user.last_name}</div>
          <div className="text-gray-500 text-lg mb-4">{user.email}</div>
          <div className="mb-4">
            <span className="font-semibold">Button Color: </span>
            <span className="px-2 py-1 rounded" style={{ background: color || '#888', color: '#fff' }}>{color || 'N/A'}</span>
          </div>
          <a
            href="/"
            className="mt-4 px-4 py-2 rounded text-white font-semibold"
            style={{ background: color || '#888' }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </PageLayout>
  );
} 