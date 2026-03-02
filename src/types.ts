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

export interface CartItem extends Product {
  quantity: number;
  selectedFinish?: string;
}
