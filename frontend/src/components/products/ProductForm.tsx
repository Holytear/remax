import React from "react";
import Button from "@/components/ui/Button";
import { Product } from "@/types";

interface ProductFormProps {
  form: { name: string; amount: string; price: string; description: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  status?: string | null;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, onChange, onSubmit, loading, status, submitLabel }) => (
  <form className="flex flex-col gap-3" onSubmit={onSubmit}>
    <input
      className="border rounded px-3 py-2"
      placeholder="Name"
      name="name"
      value={form.name}
      onChange={onChange}
      required
    />
    <input
      className="border rounded px-3 py-2"
      placeholder="Amount"
      type="number"
      name="amount"
      value={form.amount}
      onChange={onChange}
      required
      min={1}
    />
    <input
      className="border rounded px-3 py-2"
      placeholder="Price"
      type="number"
      name="price"
      value={form.price}
      onChange={onChange}
      required
      min={0}
      step={0.01}
    />
    <textarea
      className="border rounded px-3 py-2"
      placeholder="Description"
      name="description"
      value={form.description}
      onChange={onChange}
      rows={2}
    />
    <Button type="submit" className="mt-2 disabled:opacity-50" disabled={loading}>
      {loading ? "Saving..." : submitLabel || "Save"}
    </Button>
    {status && <div className="text-center text-sm mt-2 text-blue-600">{status}</div>}
  </form>
);

export default ProductForm; 