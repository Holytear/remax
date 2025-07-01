"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import UserCard from "@/components/users/UserCard";
import PageLayout from "@/components/PageLayout";
import { User } from "@/types";
import Modal from "@/components/ui/Modal";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import UserForm from "@/components/users/UserForm";

interface Color {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ first_name: "", last_name: "", email: "", age: "" });
  const [createStatus, setCreateStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`https://reqres.in/api/users?page=${page}`, { headers: { 'x-api-key': 'reqres-free-v1' } }).then((res) => res.json()),
      fetch("https://reqres.in/api/unknown", { headers: { 'x-api-key': 'reqres-free-v1' } }).then((res) => res.json()),
    ])
      .then(([userData, colorData]) => {
        setUsers(Array.isArray(userData.data) ? userData.data : []);
        setTotalPages(userData.total_pages || 1);
        setColors(Array.isArray(colorData.data) ? colorData.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load users or colors.");
        setLoading(false);
      });
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateStatus(null);
    try {
      const res = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'x-api-key': 'reqres-free-v1' },
        body: JSON.stringify({
          name: createForm.first_name,
          surname: createForm.last_name,
          email: createForm.email,
          age: createForm.age,
        }),
      });
      if (res.ok) {
        setCreateStatus("User created successfully!");
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateForm({ first_name: "", last_name: "", email: "", age: "" });
          setCreateStatus(null);
        }, 1200);
      } else {
        setCreateStatus("Failed to create user.");
      }
    } catch {
      setCreateStatus("Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginStatus(null);
    try {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'reqres-free-v1' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setLoginStatus('Login successful!');
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          setShowLoginModal(false);
          setLoginForm({ email: '', password: '' });
          setLoginStatus(null);
        }, 1200);
      } else {
        setLoginStatus(data.error || 'Login failed.');
      }
    } catch {
      setLoginStatus('Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 w-full text-left">All Members</h1>
            <div className="flex flex-row items-center gap-4 w-full sm:w-auto justify-end">
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Member
              </Button>
              <Button variant="green" onClick={() => setShowLoginModal(true)}>
                Login
              </Button>
              <Link href="/products">
                <Button variant="purple">Products</Button>
              </Link>
            </div>
          </header>
          {/* Create User Modal */}
          {showCreateModal && (
            <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
              <h2 className="text-xl font-bold mb-4">Create New User</h2>
              <UserForm
                form={createForm}
                onChange={e => setCreateForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                onSubmit={handleCreate}
                loading={creating}
                status={createStatus}
                submitLabel="Create"
              />
            </Modal>
          )}
          {/* Login Modal */}
          {showLoginModal && (
            <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowLoginModal(false)}>&times;</button>
                  <h2 className="text-xl font-bold mb-4">Login</h2>
                  <form className="flex flex-col gap-3" onSubmit={handleLogin}>
                    <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required />
                    <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required />
                    <Button variant="green" type="submit" className="mt-2 disabled:opacity-50" disabled={loggingIn}>
                      {loggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                    {loginStatus && <div className="text-center text-sm mt-2 text-green-600">{loginStatus}</div>}
                  </form>
                </div>
              </div>
            </Modal>
          )}
          <main className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl shadow p-8 h-56 w-full max-w-xs flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full text-red-500 text-center">{error}</div>
              ) : !Array.isArray(users) || users.length === 0 ? (
                <div className="col-span-full text-gray-500 text-center">No users found.</div>
              ) : (
                users.map((user, idx) => {
                  const color = colors.length > 0 ? colors[idx % colors.length].color : '#3b82f6';
                  return (
                    <UserCard
                      key={user.id}
                      user={user}
                      color={color}
                      onReview={() => window.location.href = `/users/${user.id}`}
                    />
                  );
                })
              )}
            </div>
            {/* Pagination controls */}
            <div className="flex justify-center mt-8 gap-2 items-center">
              <Button variant="primary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <span className="px-3 py-1 text-gray-700">Page {page} of {totalPages}</span>
              <Button variant="primary" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </Button>
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
