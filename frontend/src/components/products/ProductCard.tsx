import React from 'react';

export interface Product {
  id: number;
  name: string;
  amount: number;
  price: number;
  description?: string;
  favorite: boolean;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onFavorite?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onFavorite }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50">
      <div className="font-semibold text-gray-800 text-lg">{product.name}</div>
      <div className="text-gray-500">Amount: {product.amount}</div>
      <div className="text-gray-500">Price: ${product.price}</div>
      {product.description && <div className="text-gray-400 text-sm">{product.description}</div>}
      <div className="flex gap-2 mt-2">
        {onEdit && <button className="border px-2 py-1 rounded text-blue-600 border-blue-400" onClick={() => onEdit(product)}>Edit</button>}
        {onDelete && <button className="border px-2 py-1 rounded text-red-600 border-red-400" onClick={() => onDelete(product.id)}>Delete</button>}
        {onFavorite && (
          <button className={product.favorite ? "text-yellow-400 scale-110" : "text-gray-400"} onClick={() => onFavorite(product.id)}>
            ★
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 