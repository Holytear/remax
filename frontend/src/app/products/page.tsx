"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, addProduct, updateProduct, deleteProduct, favoriteProduct, chatbotAsk } from "@/services/backend.api";
import PageLayout from "@/components/PageLayout";
import { Product } from "@/types";
import Modal from "@/components/ui/Modal";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ProductForm from "@/components/products/ProductForm";

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
    getProducts()
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
      const res = await addProduct({
        name: addForm.name,
        amount: Number(addForm.amount),
        price: Number(addForm.price),
        description: addForm.description,
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
      const res = await updateProduct(editForm.id, {
        name: editForm.name,
        amount: Number(editForm.amount),
        price: Number(editForm.price),
        description: editForm.description,
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
      await deleteProduct(id);
      fetchProducts();
    } finally {
      setDeletingId(null);
    }
  };

  const handleFavoriteProduct = async (id: number) => {
    await favoriteProduct(id);
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
      const res = await chatbotAsk(userMsg);
      setChatHistory((h) => [...h, { sender: 'bot', text: res.response }]);
    } catch {
      setChatHistory((h) => [...h, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered products for favorites
  const displayedProducts = showFavorites ? products.filter(p => p.favorite) : products;

  return (
    <PageLayout>
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
          <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <ProductForm
              form={addForm}
              onChange={e => setAddForm(f => ({ ...f, [e.target.name]: e.target.value }))}
              onSubmit={handleAddProduct}
              loading={adding}
              status={addStatus}
              submitLabel="Add Product"
            />
          </Modal>
        )}
        {/* Edit Product Modal */}
        {showEditModal && (
          <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <ProductForm
              form={editForm}
              onChange={e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }))}
              onSubmit={handleEditProduct}
              loading={editing}
              status={editStatus}
              submitLabel="Update Product"
            />
          </Modal>
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
              <SkeletonLoader />
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-gray-400 text-center">No products{showFavorites ? ' in favorites.' : ' yet.'}</div>
            ) : (
              <ul className="space-y-4">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                    onFavorite={handleFavoriteProduct}
                  />
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
    </PageLayout>
  );
} 