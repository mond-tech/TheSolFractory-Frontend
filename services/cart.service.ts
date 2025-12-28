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
  image?: string; // Optional - file upload field, not sent in JSON
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

export interface CartUpsertRequestWrapper {
  cartHeaderDto: CartUpsertRequest;
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

// map API cart -> frontend CartItem[] (preserve cartDetailsId)
// Helper function to convert API cart to frontend CartItem[]
export const mapCartToItems = (cart: any): CartItem[] => {
  const details =
    cart?.CartDetailsList?.$values || // GET cart style
    cart?.cartDetailsList ||          // UPSERT cart style
    [];

  return details.map((cd: any) => {
    const product = cd.Product || cd.product;

    return {
      // keep the cartDetailsId so we can delete specific detail on backend
      cartDetailsId: cd.CartDetailsId ?? cd.cartDetailsId ?? 0,
      productId: product.ProductId ?? product.productId,
      name: product.Name ?? product.name,
      price: product.Price ?? product.price,
      imageUrl: product.ImageUrl ?? product.imageUrl,
      quantity: cd.Count ?? cd.count,
      size: product.Size ?? product.size,
      description: product.Description ?? product.description,
      categoryName: product.CategoryName ?? product.categoryName,
    } as CartItem;
  });
};

// map frontend CartItem[] -> API request (preserve cartDetailsId if present)
// Helper function to convert frontend CartItem[] to API format
export function mapItemsToCart(
  items: CartItem[],
  userId: string,
  cartHeaderId: number = 0
): CartUpsertRequestWrapper {
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartHeaderDto: CartUpsertRequest = {
    cartHeaderId,
    userId,
    cartTotal,
    cartDetailsList: items.map((item) => ({
      // if the item already had a cartDetailsId, include it so backend can update
      cartDetailsId: item.cartDetailsId ?? 0,
      cartHeaderId: cartHeaderId,
      productId: item.productId,
      product: {
        productId: item.productId,
        name: item.name,
        price: item.price,
        description: item.description || "",
        categoryName: item.categoryName ?? "Hemp",
        imageUrl: item.imageUrl,
        imageLocalPath: "",
        size: item.size,
      },
      count: item.quantity,
    })),
  };

  return {
    cartHeaderDto,
  };
}

export const CartService = {
  // GET /api/cart/GetCart/{userId}
  async getCart(userId: string): Promise<CartResponse | null> {
    try {
      const res = await http<CartResponse>(
        `/api/cart/GetCart/${userId}`,
        {
          method: "GET",
        }
      );
      return res ?? null;
    } catch (error) {
      console.error("Failed to get cart:", error);
      return null;
    }
  },

  // POST /api/cart/CartUpsert
  async upsertCart(cart: CartUpsertRequest): Promise<CartResponse | null> {
    try {
      const res = await http<ApiResponse<CartResponse>>(
        "/api/cart/CartUpsert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cart)
        }
      );

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
  async removeCart(cartDetailsId: number): Promise<boolean> {
    try {
      const res = await http<RemoveCartResponse>("/api/cart/RemoveCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartDetailsId),
      });
      return res.isSuccess;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
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

