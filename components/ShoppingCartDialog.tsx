"use client";

import React, { useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/contexts/CartContext";
import { useRouter } from "next/navigation";

interface ShoppingCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShoppingCartDialog({
  open,
  onOpenChange,
}: ShoppingCartDialogProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const total = getTotal();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const router = useRouter();

  const increaseQty = (productId: number) => {
    const item = items.find((i) => i.productId === productId);
    if (item) {
      updateQuantity(productId.toString(), item.quantity + 1);
    }
  };

  const decreaseQty = (productId: number) => {
    const item = items.find((i) => i.productId === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId.toString(), item.quantity - 1);
    } else if (item && item.quantity === 1) {
      // Remove item if quantity would be 0
      removeItem(productId.toString());
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#132135] z-1000001 border-l border-gray-700 text-white w-full max-w-md h-full p-0 sm:rounded-none fixed right-0 top-0 !left-auto !bottom-0 flex flex-col shadow-2xl cart-drawer !translate-x-0 !translate-y-0 data-[state=closed]:!slide-out-to-left-0 data-[state=closed]:!slide-out-to-top-0 data-[state=open]:!slide-in-from-left-0 data-[state=open]:!slide-in-from-top-0 data-[state=closed]:!zoom-out-100 data-[state=open]:!zoom-in-100">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between" style={{ textShadow: "0 0 2px rgba(255,255,255,0.6)" }}>
            <DialogTitle className="text-xl font-semibold text-white">
              Your Selection
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div
          className="px-6 py-4 flex-1 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-800/50 rounded-lg p-4 flex items-start gap-4 border border-gray-700"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-500 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-1">
                      Paper Type
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item.productId)}
                        className="w-8 h-8 flex items-center justify-center rounded-md
                                  bg-gray-700 hover:bg-gray-600 text-white"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="min-w-[32px] text-center text-white font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.productId)}
                        className="w-8 h-8 flex items-center justify-center rounded-md
                                  bg-gray-700 hover:bg-gray-600 text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price and Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.productId.toString())}
                      className="text-red-500 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="text-white font-semibold">
                      ${(item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total and Actions */}
        <div className="px-6 py-4 space-y-4 border-t border-gray-700 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Total Estimate</span>
            <span className="text-white font-semibold text-lg">
              ${total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              className="btn-liquid not-md:w-42 px-9 py-5 font-bold uppercase tracking-widest active 
                    text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2"
              onClick={() => {
                // Handle place order
                router.push("/order");
              }}
            >
              PLACE ORDER
            </Button>

            <Button
              variant="outline"
              className="btn-liquid px-9 not-md:w-42 py-5 font-bold uppercase tracking-widest
                    text-gray-300 hover:text-white border-gray-500 rounded-3xl hover:bg-gray-800 transition border-2 mr-1.5"
              onClick={() => {
                // Handle request quote
                router.push('/request-quote')
              }}
            >
              REQUEST QUOTE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

