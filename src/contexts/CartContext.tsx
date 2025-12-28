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
    //localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    //console.error("Failed to save cart to localStorage:", error);
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
      if (!isAuthenticated || !user?.id) return;

      try {
        const wrapper = mapItemsToCart(newItems, user.id, cartHeaderId);
        const response = await CartService.upsertCart(wrapper.cartHeaderDto);

        if (response) {
          setCartHeaderId(response.cartHeaderId);

          // 🚑 this line saves your cart from corruption
          setItems(mapCartToItems(response));
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    },
    [isAuthenticated, user?.id, cartHeaderId]
  );


  const addItem = useCallback(
    async (item: CartItem) => {
      const newItems = (() => {
        const existing = items.find(i => i.productId === item.productId);
        if (existing) {
          return items.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }
        return [...items, item];
      })();

      setItems(newItems);
      await syncCart(newItems);
    },
    [items, syncCart]
  );


  // add `items` to dependency list of useCallback below
  const removeItem = useCallback(
    async (id: string) => {
      // id is productId stringified in your call sites
      const prodId = Number(id);

      // find the item being removed from current state
      const removedItem = items.find((item) => item.productId === prodId);

      // compute new items array
      const newItems = items.filter((item) => item.productId !== prodId);

      // update local state immediately for snappy UI
      setItems(newItems);

      // If user is authenticated, prefer removing the specific cart detail on backend.
      try {
        if (isAuthenticated && user?.id) {
          // if the removedItem has a cartDetailsId, call RemoveCart endpoint
          if (removedItem?.cartDetailsId && removedItem.cartDetailsId > 0) {
            try {
              const success = await CartService.removeCart(
                removedItem.cartDetailsId
              );
              if (!success) {
                console.warn(
                  "RemoveCart endpoint responded with failure. Falling back to upsert sync."
                );
                // fallback: sync the new items (server may require full upsert)
                await syncCart(newItems);
              } else {
                // optionally: if newItems is empty, reset cartHeaderId
                if (newItems.length === 0) {
                  setCartHeaderId(0);
                } else {
                  // After deletion, optionally refresh cart header from server by upserting or fetching
                  // We'll upsert to make sure server cart totals and header are consistent
                  await syncCart(newItems);
                }
              }
            } catch (err) {
              console.error("Failed to call RemoveCart:", err);
              // fallback to upsert
              await syncCart(newItems);
            }
          } else {
            // No cartDetailsId available (maybe local-only item). Just sync full cart to API
            if (newItems.length > 0) {
              await syncCart(newItems);
            } else {
              // cart empty => clear backend by upserting empty cart (backend sets header to 0)
              const emptyCartWrapper = mapItemsToCart([], user.id, cartHeaderId);
              try {
                const cartResponse = await CartService.upsertCart(
                  emptyCartWrapper.cartHeaderDto
                );
                if (cartResponse) setCartHeaderId(cartResponse.cartHeaderId);
                else setCartHeaderId(0);
              } catch (err) {
                console.error("Failed to clear cart on backend:", err);
              }
            }
          }
        } else {
          // not authenticated => local-only, nothing to call
        }
      } catch (error) {
        console.error("removeItem error:", error);
      }
    },
    [items, isAuthenticated, user?.id, cartHeaderId, syncCart]
  );


  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        // call removeItem (non-blocking)
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
            // IMPORTANT: re-sync items WITH cartDetailsId from backend
            const syncedItems = mapCartToItems(cartResponse);
            setItems(syncedItems);
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