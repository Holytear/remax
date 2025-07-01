const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_BACKEND_URL || 'http://localhost:8000';

// Product API
export async function getProducts() {
  const res = await fetch(`${BACKEND_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function addProduct(product: { name: string; amount: number; price: number; description?: string }) {
  const res = await fetch(`${BACKEND_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function updateProduct(id: number, product: { name: string; amount: number; price: number; description?: string }) {
  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${BACKEND_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function favoriteProduct(id: number) {
  const res = await fetch(`${BACKEND_URL}/products/${id}/favorite`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to favorite product');
}

export async function chatbotAsk(message: string) {
  const res = await fetch(`${BACKEND_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to get chatbot response');
  return res.json();
} 