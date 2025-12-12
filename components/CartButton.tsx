"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { ShoppingCartDialog } from "@/components/ShoppingCartDialog";
import { useCart } from "@/src/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  className?: string;
  variant?: "mobile" | "desktop";
}

export function CartButton({ className, variant = "desktop" }: CartButtonProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <>
      <button
        onClick={() => setCartOpen(true)}
        className={cn(
          "p-2 rounded-full border border-gray-500 text-gray-300 hover:border-white transition hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_#3b82f6] relative",
          className
        )}
        aria-label="Shopping cart"
      >
        <ShoppingCart size={18} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
      <ShoppingCartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

