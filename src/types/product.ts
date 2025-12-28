export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  categoryName: string;
  imageUrl: string;
  size : string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  description?: string;
  categoryName: string;
  imageUrl: string;
  size : string;
  quantity: number;
  cartDetailsId?: number;
}


export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  checkout: () => Promise<boolean>;
}