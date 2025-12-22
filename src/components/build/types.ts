import React from "react";
import {
  Leaf,
  Droplets,
  Infinity,
  ChevronsDown,
  FileText,
  Sparkle,
  Flower2,
  Star,
} from "lucide-react";

export type PaperType = "unbleached" | "hemp" | "bleached" | "colored";
export type FilterType =
  | "standard"
  | "crutch"
  | "branded"
  | "printed-pattern"
  | "natural";
export type ConeSize = "70mm" | "84mm" | "98mm" | "109mm";
export type LotSize = "sample" | "small" | "medium" | "large" | "custom";

export interface CustomizationState {
  paperType: PaperType | null;
  filterType: FilterType | null;
  coneSize: ConeSize | null;
  lotSize: LotSize | null;
  customQuantity: string;
  country: string;
  zipCode: string;
}

export const PAPER_TYPES = [
  {
    id: "unbleached" as PaperType,
    name: "Unbleached (Brown)",
    description: "Natural and organic, for a pure experience.",
    icon: Leaf,
  },
  {
    id: "hemp" as PaperType,
    name: "Hemp Paper",
    description: "Sustainable choice, with a unique texture.",
    icon: Flower2,
  },
  {
    id: "bleached" as PaperType,
    name: "Bleached (White)",
    description: "Clean and classic, for a smooth burn.",
    icon: Droplets,
  },
  {
    id: "colored" as PaperType,
    name: "Colored Paper",
    description: "Natural and organic, for a pure experience.",
    icon: Star,
  },
];

export const FILTER_TYPES = [
  {
    id: "standard" as FilterType,
    name: "Standard Filter Tip",
    description:
      "A classic, simple filter for a consistent and smooth experience.",
    icon: Infinity,
  },
  {
    id: "crutch" as FilterType,
    name: "Crutch Filter",
    description:
      "Provides robust structural support and enhances airflow for a cooler draw.",
    icon: ChevronsDown,
  },
  {
    id: "printed-pattern" as FilterType,
    name: "Printed Pattern Tip",
    description:
      "Add unique and expressive patterns to your tips for visual flair.",
    icon: Sparkle,
  },
  {
    id: "natural" as FilterType,
    name: "Natural / Unprinted Tip",
    description:
      "An eco-friendly option for a pure, unadulterated smoking experience.",
    icon: Leaf,
  },
];

export const CONE_SIZES = [
  {
    id: "70mm" as ConeSize,
    name: "70mm",
    description: "Dogwalk / Mini",
  },
  {
    id: "84mm" as ConeSize,
    name: "84mm",
    description: "1/2 Gram",
  },
  {
    id: "98mm" as ConeSize,
    name: "98mm",
    description: "Standard / 3/4 Gram",
  },
  {
    id: "109mm" as ConeSize,
    name: "109mm",
    description: "King Size 1 Gram",
  },
];

export const LOT_SIZES = [
  {
    id: "sample" as LotSize,
    name: "Sample Batch",
    quantity: "50-200 cones",
    leadTime: "5-7 Business Days",
    price: "$0.40 - $0.75 per cone",
  },
  {
    id: "small" as LotSize,
    name: "Small Batch",
    quantity: "3,000-10,000 cones",
    leadTime: "5-7 Business Days",
    price: "$0.40 - $0.75 per cone",
  },
  {
    id: "medium" as LotSize,
    name: "Medium Run",
    quantity: "50-200 cones",
    leadTime: "5-7 Business Days",
    price: "$0.40 - $0.75 per cone",
  },
  {
    id: "large" as LotSize,
    name: "Large Scale",
    quantity: "50-200 cones",
    leadTime: "5-7 Business Days",
    price: "$0.40 - $0.75 per cone",
  },
];

export const getPaperTypeName = (paperType: PaperType | null): string => {
  const paper = PAPER_TYPES.find((p) => p.id === paperType);
  return paper?.name || "Select Paper";
};

export const getFilterTypeName = (filterType: FilterType | null): string => {
  const filter = FILTER_TYPES.find((f) => f.id === filterType);
  return filter?.name || "Select Filter";
};

export const getConeSizeName = (coneSize: ConeSize | null): string => {
  if (!coneSize) return "Choose Size";
  const size = CONE_SIZES.find((s) => s.id === coneSize);
  return `${size?.id}${size?.description ? ` (${size.description})` : ""}`;
};

export const getLotSizeName = (
  lotSize: LotSize | null,
  customQuantity: string
): string => {
  if (!lotSize) return "Choose Lot Size";
  if (lotSize === "custom")
    return `Custom (${customQuantity || "Enter quantity"})`;
  const lot = LOT_SIZES.find((l) => l.id === lotSize);
  return `${lot?.name} (${lot?.quantity})`;
};

// Quantity and pricing helpers
export const getQuantity = (state: CustomizationState): number => {
  if (state.lotSize === "custom") {
    const qty = parseInt(state.customQuantity) || 0;
    return qty > 0 ? qty : 0;
  }

  switch (state.lotSize) {
    case "sample":
      return 125; // Average of 50-200
    case "small":
      return 6500; // Average of 3,000-10,000
    case "medium":
      return 50000; // Estimate
    case "large":
      return 100000; // Estimate
    default:
      return 0;
  }
};

export const getPricePerCone = (state: CustomizationState): number => {
  const quantity = getQuantity(state);
  // Lower price per cone for larger quantities
  if (quantity >= 100000) return 0.4;
  if (quantity >= 50000) return 0.45;
  if (quantity >= 10000) return 0.5;
  if (quantity >= 5000) return 0.55;
  if (quantity >= 1000) return 0.6;
  if (quantity >= 200) return 0.65;
  return 0.75; // For sample batches
};

export const getTotalPriceNumber = (state: CustomizationState): number => {
  const quantity = getQuantity(state);
  const pricePerCone = getPricePerCone(state);
  return quantity * pricePerCone;
};

export const getTotalPrice = (state: CustomizationState): string => {
  const total = getTotalPriceNumber(state);
  return `$${total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


