"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../Button";

interface Product {
  id: number;
  name: string;
  amount: number;
  price: number;
  description?: string;
  favorite: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', amount: '', price: '', description: '' });
  const [addStatus, setAddStatus] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: 0, name: '', amount: '', price: '', description: '' });
  const [editStatus, setEditStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  // Favorites filter
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddStatus(null);
    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          amount: Number(addForm.amount),
          price: Number(addForm.price),
          description: addForm.description,
        }),
      });
      if (res.ok) {
        setAddStatus("Product added!");
        setTimeout(() => {
          setShowAddModal(false);
          setAddForm({ name: '', amount: '', price: '', description: '' });
          setAddStatus(null);
          fetchProducts();
        }, 1000);
      } else {
        setAddStatus("Failed to add product.");
      }
    } catch {
      setAddStatus("Failed to add product.");
    } finally {
      setAdding(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditForm({
      id: product.id,
      name: product.name,
      amount: String(product.amount),
      price: String(product.price),
      description: product.description || '',
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    setEditStatus(null);
    try {
      const res = await fetch(`http://localhost:8000/products/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          amount: Number(editForm.amount),
          price: Number(editForm.price),
          description: editForm.description,
        }),
      });
      if (res.ok) {
        setEditStatus('Product updated!');
        setTimeout(() => {
          setShowEditModal(false);
          setEditStatus(null);
          fetchProducts();
        }, 1000);
      } else {
        setEditStatus('Failed to update product.');
      }
    } catch {
      setEditStatus('Failed to update product.');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8000/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleFavoriteProduct = async (id: number) => {
    await fetch(`http://localhost:8000/products/${id}/favorite`, { method: 'POST' });
    fetchProducts();
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory((h) => [...h, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('http://localhost:8000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatHistory((h) => [...h, { sender: 'bot', text: data.response }]);
    } catch {
      setChatHistory((h) => [...h, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered products for favorites
  const displayedProducts = showFavorites ? products.filter(p => p.favorite) : products;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-8">
      <header className="w-full max-w-3xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-purple-700">Products</h1>
        <div className="flex flex-row items-center gap-4">
          <Button onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
          <Link href="/">
            <Button>Main Page</Button>
          </Link>
        </div>
      </header>
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative transition-transform duration-300 animate-scaleIn">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form className="flex flex-col gap-3" onSubmit={handleAddProduct}>
              <input
                className="border rounded px-3 py-2"
                placeholder="Name"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Amount"
                type="number"
                value={addForm.amount}
                onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
                required
                min={1}
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Price"
                type="number"
                value={addForm.price}
                onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                required
                min={0}
                step={0.01}
              />
              <textarea
                className="border rounded px-3 py-2"
                placeholder="Description"
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
              <Button type="submit" className="mt-2 disabled:opacity-50" disabled={adding}>
                {adding ? "Adding..." : "Add Product"}
              </Button>
              {addStatus && <div className="text-center text-sm mt-2 text-purple-600">{addStatus}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative transition-transform duration-300 animate-scaleIn">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowEditModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form className="flex flex-col gap-3" onSubmit={handleEditProduct}>
              <input
                className="border rounded px-3 py-2"
                placeholder="Name"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Amount"
                type="number"
                value={editForm.amount}
                onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                required
                min={1}
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Price"
                type="number"
                value={editForm.price}
                onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                required
                min={0}
                step={0.01}
              />
              <textarea
                className="border rounded px-3 py-2"
                placeholder="Description"
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
              <Button type="submit" className="mt-2 disabled:opacity-50" disabled={editing}>
                {editing ? "Saving..." : "Save Changes"}
              </Button>
              {editStatus && <div className="text-center text-sm mt-2 text-blue-600">{editStatus}</div>}
            </form>
          </div>
        </div>
      )}
      <main className="w-full max-w-3xl flex-1 flex flex-col md:flex-row gap-8">
        {/* Product List */}
        <section className="flex-1 bg-white rounded shadow p-4 mb-8 md:mb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Product List</h2>
            <Button
              className={`px-3 py-1 rounded ${showFavorites ? 'bg-yellow-400 text-white' : ''}`}
              style={showFavorites ? { background: '#facc15', color: '#fff', borderColor: '#facc15' } : {}}
              onClick={() => setShowFavorites(f => !f)}
            >
              {showFavorites ? 'Show All' : 'Show Favorites'}
            </Button>
          </div>
          {loading ? (
            <ul className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="border rounded p-4 flex flex-col gap-1 animate-pulse bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-5 w-32 bg-slate-200 rounded" />
                    <div className="flex gap-2 items-center">
                      <div className="h-6 w-6 bg-slate-200 rounded-full" />
                      <div className="h-4 w-10 bg-slate-200 rounded" />
                      <div className="h-4 w-10 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-24 bg-slate-200 rounded mb-1" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </li>
              ))}
            </ul>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-gray-400 text-center">No products{showFavorites ? ' in favorites.' : ' yet.'}</div>
          ) : (
            <ul className="space-y-4">
              {displayedProducts.map((product) => (
                <li
                  key={product.id}
                  className="border rounded p-4 flex flex-col gap-1 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{product.name}</span>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        className={`text-xl focus:outline-none border-0 bg-transparent px-2 py-0 transition-transform duration-200 ${product.favorite ? 'text-yellow-400 scale-125' : 'text-gray-300 scale-100'}`}
                        style={{ boxShadow: 'none', background: 'transparent', border: 0 }}
                        title={product.favorite ? 'Unfavorite' : 'Favorite'}
                        onClick={() => handleFavoriteProduct(product.id)}
                      >
                        ★
                      </button>
                      <Button className="text-blue-600 hover:underline text-sm border-0 bg-transparent px-2 py-0" style={{ boxShadow: 'none', background: 'transparent', border: 0 }} onClick={() => handleEditClick(product)}>
                        Edit
                      </Button>
                      <Button className="text-red-600 hover:underline text-sm border-0 bg-transparent px-2 py-0" style={{ boxShadow: 'none', background: 'transparent', border: 0 }} onClick={() => handleDeleteProduct(product.id)} disabled={deletingId === product.id}>
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Amount: {product.amount}</div>
                  <div className="text-sm text-gray-600">Price: ${product.price}</div>
                  {product.description && <div className="text-sm text-gray-500">{product.description}</div>}
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Chatbot */}
        <aside className="w-full md:w-80 bg-white rounded shadow p-4 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold mb-4">Chatbot</h2>
          <div className="flex-1 overflow-y-auto mb-2 space-y-2">
            {chatHistory.length === 0 && (
              <div className="text-gray-400 text-center">Ask about products or say hello!</div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                <span className={
                  msg.sender === 'user'
                    ? 'inline-block bg-purple-100 text-purple-800 rounded px-2 py-1'
                    : 'inline-block bg-gray-100 text-gray-800 rounded px-2 py-1'
                }>
                  {msg.text}
                </span>
              </div>
            ))}
            {chatLoading && (
              <div className="text-left text-gray-400">Bot is typing...</div>
            )}
          </div>
          <form onSubmit={sendChat} className="flex items-center gap-2 mt-auto w-full">
            <input
              className="border rounded px-3 py-2 flex-1 min-w-0"
              placeholder="Type a message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="btn w-auto px-4"
              disabled={chatLoading || !chatInput.trim()}
              style={{ marginLeft: 0 }}
            >
              Send
            </button>
          </form>
        </aside>
      </main>
    </div>
  );
} 