"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItem, CartContextType } from "../types/product";
import { CartService, mapCartToItems, mapItemsToCart } from "@/services/cart.service";
import { useUser } from "./UserContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shopping_cart_items";
const CART_HEADER_ID_KEY = "shopping_cart_header_id";

// Helper functions for localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const loadCartHeaderIdFromStorage = (): number => {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(CART_HEADER_ID_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error("Failed to load cart header ID from localStorage:", error);
    return 0;
  }
};

const saveCartHeaderIdToStorage = (cartHeaderId: number) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_HEADER_ID_KEY, cartHeaderId.toString());
  } catch (error) {
    console.error("Failed to save cart header ID to localStorage:", error);
  }
};

const clearCartStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_HEADER_ID_KEY);
  } catch (error) {
    console.error("Failed to clear cart from localStorage:", error);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage first (for immediate display on page refresh)
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [cartHeaderId, setCartHeaderId] = useState<number>(() => loadCartHeaderIdFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Save cartHeaderId to localStorage whenever it changes
  useEffect(() => {
    saveCartHeaderIdToStorage(cartHeaderId);
  }, [cartHeaderId]);

  // Load cart from API when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !user?.id) {
        // When not authenticated, keep localStorage items (already loaded on mount)
        return;
      }

      setIsLoading(true);
      try {
        const cart = await CartService.getCart(user.id);
        console.log('CART KA DATA', cart);
        const serverItems = cart ? mapCartToItems(cart) : [];
        // console.log('mapCartToItems ka DATA', mapCartToItems)
        // Get current local items from localStorage (most up-to-date)
        const localItems = loadCartFromStorage();
        const localCartHeaderId = loadCartHeaderIdFromStorage();
        
        let mergedItems: CartItem[];
        
        if (localItems.length === 0 || serverItems.length === 0) {
          // No local items, use server cart
          mergedItems = serverItems;
        } 
        // else if (serverItems.length === 0) {
        //   // No server items, keep local items and sync them to server
        //   mergedItems = localItems;
        // } 
        else {
          // Merge: prefer server cart as source of truth, but merge quantities intelligently
          mergedItems = [...serverItems];
          
          // For items only in local storage, add them (they might be newer)
          localItems.forEach((localItem) => {
            const serverIndex = mergedItems.findIndex(
              (item) => item.productId === localItem.productId
            );
            
            if (serverIndex >= 0) {
              // Item exists in both, use the larger quantity (user might have added more)
              mergedItems[serverIndex] = {
                ...mergedItems[serverIndex],
                quantity: Math.max(
                  mergedItems[serverIndex].quantity,
                  localItem.quantity
                ),
              };
            } else {
              // Item only in local storage, add it
              mergedItems.push(localItem);
            }
          });
        }

        // Update state with merged items
        setItems(mergedItems);

        // Sync merged cart to server if there are items
        if (mergedItems.length > 0) {
          const cartRequestWrapper = mapItemsToCart(
            mergedItems,
            user.id,
            cart?.cartHeaderId || localCartHeaderId || 0
          );
          const cartResponse = await CartService.upsertCart(cartRequestWrapper.cartHeaderDto);
          if (cartResponse) {
            setCartHeaderId(cartResponse.cartHeaderId);
          }
        } else if (cart) {
          setCartHeaderId(cart.cartHeaderId);
        } else {
          setCartHeaderId(0);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        // Keep local items on error (already in state from localStorage)
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]); // Removed items and cartHeaderId from dependencies to avoid loops

  // Sync cart to API
  const syncCart = useCallback(
    async (newItems: CartItem[]) => {
      if (!isAuthenticated || !user?.id) {
        return;
      }

      try {
        const cartRequestWrapper = mapItemsToCart(newItems, user.id, cartHeaderId);
        const cartResponse = await CartService.upsertCart(cartRequestWrapper.cartHeaderDto);
        if (cartResponse) {
          setCartHeaderId(cartResponse.cartHeaderId);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
        // Don't throw - allow local state to update even if sync fails
      }
    },
    [isAuthenticated, user?.id, cartHeaderId]
  );

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        let newItems: CartItem[];
        
        if (existing) {
          // If item exists, increment by the quantity being added (usually 1)
          newItems = prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          // If item doesn't exist, add it with the specified quantity
          newItems = [...prev, item];
        }

        // Sync to API
        syncCart(newItems);
        return newItems;
      });
    },
    [syncCart]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const newItems = prev.filter((item) => String(item.productId) !== id);
        
        // If user is authenticated, sync to API
        if (isAuthenticated && user?.id && newItems.length > 0) {
          syncCart(newItems);
        } else if (isAuthenticated && user?.id && newItems.length === 0) {
          // If cart is empty, clear from API by sending empty cart
          const emptyCartWrapper = mapItemsToCart([], user.id, cartHeaderId);
          CartService.upsertCart(emptyCartWrapper.cartHeaderDto)
            .then((cartResponse) => {
              if (cartResponse) {
                setCartHeaderId(cartResponse.cartHeaderId);
              } else {
                setCartHeaderId(0);
              }
            })
            .catch((error) => {
              console.error("Failed to remove cart:", error);
            });
        }
        
        return newItems;
      });
    },
    [syncCart, isAuthenticated, user?.id, cartHeaderId]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => {
        const newItems = prev.map((item) =>
          String(item.productId) === id ? { ...item, quantity } : item
        );
        
        // Sync to API
        syncCart(newItems);
        return newItems;
      });
    },
    [syncCart, removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
    if (isAuthenticated && user?.id) {
      // Clear cart on backend by sending empty cart
      const emptyCartWrapper = mapItemsToCart([], user.id, cartHeaderId);
      CartService.upsertCart(emptyCartWrapper.cartHeaderDto)
        .then((cartResponse) => {
          if (cartResponse) {
            setCartHeaderId(cartResponse.cartHeaderId);
          } else {
            setCartHeaderId(0);
          }
        })
        .catch((error) => {
          console.error("Failed to clear cart:", error);
        });
    } else {
      setCartHeaderId(0);
    }
  }, [isAuthenticated, user?.id, cartHeaderId]);

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const checkout = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      console.error("User must be authenticated to checkout");
      return false;
    }

    try {
      const success = await CartService.checkout(user.id);
      if (success) {
        // Clear cart after successful checkout
        setItems([]);
        setCartHeaderId(0);
        clearCartStorage();
      }
      return success;
    } catch (error) {
      console.error("Checkout failed:", error);
      return false;
    }
  }, [isAuthenticated, user?.id]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

