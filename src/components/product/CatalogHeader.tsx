import React from "react";

export default function CatalogHeader() {
  return (
    <div className="px-4 md:px-0">
      <div className="text-center mb-[55px]">
        <h1 className="text-4xl md:text-5xl font-serif mb-3 not-md:mt-11"
        style={{ textShadow: "0 0 3px rgba(255,255,255,0.6)" }}>
          Wholesale <span className="text-blue-400">Inventory</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Select products to build your wholesale quote.
        </p>
      </div>
    </div>
  );
}

