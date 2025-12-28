"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItem, CartContextType } from "../types/product";
import { CartService, mapCartToItems, mapItemsToCart } from "@/services/cart.service";
import { useUser } from "./UserContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartHeaderId, setCartHeaderId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  // Load cart from API when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !user?.id) {
        // Keep local cart items when not authenticated
        return;
      }

      setIsLoading(true);
      try {
        const cart = await CartService.getCart(user.id);
        const serverItems = cart ? mapCartToItems(cart) : [];
        
        // Get current local items
        setItems((localItems) => {
          let mergedItems: CartItem[];
          
          if (localItems.length === 0) {
            // No local items, use server cart
            mergedItems = serverItems;
          } else {
            // Merge: combine quantities for same products, add new items
            mergedItems = [...localItems];
            
            serverItems.forEach((serverItem) => {
              const localIndex = mergedItems.findIndex(
                (item) => item.productId === serverItem.productId
              );
              
              if (localIndex >= 0) {
                // Item exists in both, use the larger quantity (or sum them)
                mergedItems[localIndex] = {
                  ...mergedItems[localIndex],
                  quantity: Math.max(
                    mergedItems[localIndex].quantity,
                    serverItem.quantity
                  ),
                };
              } else {
                // Item only in server cart, add it
                mergedItems.push(serverItem);
              }
            });
          }

          // Sync merged cart to server if there are items
          if (mergedItems.length > 0) {
            const cartRequest = mapItemsToCart(
              mergedItems,
              user.id,
              cart?.cartHeaderId || 0
            );
            CartService.upsertCart(cartRequest)
              .then((cartResponse) => {
                if (cartResponse) {
                  setCartHeaderId(cartResponse.cartHeaderId);
                }
              })
              .catch((error) => {
                console.error("Failed to sync merged cart:", error);
              });
          } else if (cart) {
            setCartHeaderId(cart.cartHeaderId);
          }
          
          return mergedItems;
        });
      } catch (error) {
        console.error("Failed to load cart:", error);
        // Keep local items on error
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]);

  // Sync cart to API
  const syncCart = useCallback(
    async (newItems: CartItem[]) => {
      if (!isAuthenticated || !user?.id) {
        return;
      }

      try {
        const cartRequest = mapItemsToCart(newItems, user.id, cartHeaderId);
        const cartResponse = await CartService.upsertCart(cartRequest);
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
          // If cart is empty, remove from API
          const emptyCart = mapItemsToCart([], user.id, cartHeaderId);
          CartService.removeCart(emptyCart).catch((error) => {
            console.error("Failed to remove cart:", error);
          });
          setCartHeaderId(0);
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
    if (isAuthenticated && user?.id) {
      const emptyCart = mapItemsToCart([], user.id, cartHeaderId);
      CartService.removeCart(emptyCart).catch((error) => {
        console.error("Failed to clear cart:", error);
      });
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

