export interface Product {
  id: string;
  name: string;
  designer: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  finishes?: string[];
}

export interface CategoryObj {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  color: string;
  wood_type: string;
  upholstery: string;
  finish: string;
  size: string;
  width_cm: number;
  depth_cm: number;
  height_cm: number;
  weight_kg: number;
  seat_height_cm: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  is_available: boolean;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  material: string;
  brand: string;
  base_price: number;
  sale_price: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  category: CategoryObj;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedFinish?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  path: string;
  per_page: number;
  next_cursor: string | null;
  next_page_url: string | null;
  prev_cursor: string | null;
  prev_page_url: string | null;
}
