"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/contexts/CartContext";
import { cn } from "@/lib/utils";

interface ShoppingCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShoppingCartDialog({
  open,
  onOpenChange,
}: ShoppingCartDialogProps) {
  const { items, removeItem, getTotal } = useCart();
  const total = getTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#132135] border-gray-700 text-white max-w-2xl p-0 sm:rounded-lg">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
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

        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 rounded-lg p-4 flex items-start gap-4 border border-gray-700"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-500 rounded-lg" />
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
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity.toLocaleString()}
                    </p>
                  </div>

                  {/* Price and Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
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
        <div className="px-6 py-4 space-y-4">
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
              className={cn(
                "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3",
                "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                "transition-all duration-300"
              )}
              onClick={() => {
                // Handle place order
                console.log("Place order");
              }}
            >
              PLACE ORDER
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500",
                "font-semibold transition-all duration-300 py-3"
              )}
              onClick={() => {
                // Handle request quote
                console.log("Request quote");
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

