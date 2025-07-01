export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Product {
  id: number;
  name: string;
  amount: number;
  price: number;
  description?: string;
  favorite: boolean;
} 