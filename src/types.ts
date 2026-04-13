// ===== CATEGORY =====
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  products_count?: number;
  image_url?: string;
}

// ===== PRODUCT VARIANT =====
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

// ===== PRODUCT =====
export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  material: string;
  brand: string;
  base_price: number;
  sale_price: number | null;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  category: Category;
  variants: ProductVariant[];
}

// ===== CART =====
export interface CartItem {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant | null;
  subtotal?: number;
}

export interface Cart {
  cart_id: number;
  items: CartItem[];
  total_quantity: number;
  total_price: number;
}

// ===== WISHLIST =====
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at?: string;
}

// ===== ORDER =====
export interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  receiver_name: string;
  receiver_phone: string;
  address_detail: string;
  payment_method: string;
  total_price: number;
  note?: string;
  coupon_code?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ===== CHECKOUT =====
export interface CheckoutData {
  receiver_name: string;
  receiver_phone: string;
  province_id: number;
  district_id: number;
  ward_id: number;
  address_detail: string;
  payment_method: 'cod' | 'bank_transfer';
  coupon_code?: string;
  note?: string;
  items?: {
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
  }[];
}

// ===== PAGINATION =====
export interface PaginatedProducts {
  data: Product[];
  path: string;
  per_page: number;
  next_cursor: string | null;
  next_page_url: string | null;
  prev_cursor: string | null;
  prev_page_url: string | null;
}

// ===== FILTERS =====
export interface ProductFilters {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'base_price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  cursor?: string;
}
