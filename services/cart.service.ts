import { http } from "@/services/http";
import type { CartItem } from "@/src/types/product";

// API Response Types
interface CartProduct {
  productId: number;
  name: string;
  price: number;
  description: string;
  categoryName: string;
  imageUrl: string;
  imageLocalPath: string;
  image: string;
  size: string;
}

interface CartDetails {
  cartDetailsId: number;
  cartHeaderId: number;
  productId: number;
  product: CartProduct;
  count: number;
}

export interface CartUpsertRequest {
  cartHeaderId: number;
  userId: string;
  cartTotal: number;
  cartDetailsList: {
    cartDetailsId: number;
    cartHeaderId: number;
    productId: number;
    product: CartProduct;
    count: number;
  }[];
}

export interface CartResponse {
  cartHeaderId: number;
  userId: string;
  cartTotal: number;
  cartDetailsList: CartDetails[];
}

interface ApiResponse<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}

interface RemoveCartResponse {
  result: string;
  isSuccess: boolean;
  message: string;
}

interface CheckoutResponse {
  result: string;
  isSuccess: boolean;
  message: string;
}

// Helper function to convert API cart to frontend CartItem[]
export function mapCartToItems(cart: CartResponse): CartItem[] {
  return cart.cartDetailsList.map((detail) => ({
    productId: detail.productId,
    name: detail.product.name,
    price: detail.product.price,
    description: detail.product.description,
    categoryName: detail.product.categoryName,
    imageUrl: detail.product.imageUrl,
    size: detail.product.size,
    quantity: detail.count,
  }));
}

// Helper function to convert frontend CartItem[] to API format
export function mapItemsToCart(
  items: CartItem[],
  userId: string,
  cartHeaderId: number = 0
): CartUpsertRequest {
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    cartHeaderId,
    userId,
    cartTotal,
    cartDetailsList: items.map((item) => ({
      cartDetailsId: 0, // Will be set by backend if updating existing
      cartHeaderId: 0, // Will be set by backend
      productId: item.productId,
      product: {
        productId: item.productId,
        name: item.name,
        price: item.price,
        description: item.description || "",
        categoryName: item.categoryName,
        imageUrl: item.imageUrl,
        imageLocalPath: "",
        image: "",
        size: item.size,
      },
      count: item.quantity,
    })),
  };
}

export const CartService = {
  // GET /api/cart/GetCart/{userId}
  async getCart(userId: string): Promise<CartResponse | null> {
    try {
      const res = await http<ApiResponse<CartResponse>>(
        `/api/cart/GetCart/${userId}`,
        {
          method: "GET",
        }
      );
      if (res.isSuccess && res.result) {
        return res.result;
      }
      return null;
    } catch (error) {
      console.error("Failed to get cart:", error);
      return null;
    }
  },

  // POST /api/cart/CartUpset
  async upsertCart(cart: CartUpsertRequest): Promise<CartResponse | null> {
    try {
      const res = await http<ApiResponse<CartResponse>>("/api/cart/CartUpset", {
        method: "POST",
        body: JSON.stringify(cart),
      });
      if (res.isSuccess && res.result) {
        return res.result;
      }
      return null;
    } catch (error) {
      console.error("Failed to upsert cart:", error);
      throw error;
    }
  },

  // POST /api/cart/removecart
  async removeCart(cart: CartUpsertRequest): Promise<boolean> {
    try {
      const res = await http<RemoveCartResponse>("/api/cart/removecart", {
        method: "POST",
        body: JSON.stringify(cart),
      });
      return res.isSuccess;
    } catch (error) {
      console.error("Failed to remove cart:", error);
      throw error;
    }
  },

  // POST /api/cart/checkout/{userid}
  async checkout(userId: string): Promise<boolean> {
    try {
      const res = await http<CheckoutResponse>(
        `/api/cart/checkout/${userId}`,
        {
          method: "POST",
        }
      );
      return res.isSuccess;
    } catch (error) {
      console.error("Failed to checkout:", error);
      throw error;
    }
  },
};

