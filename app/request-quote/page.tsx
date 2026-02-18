"use client";
 
import React, { useState, useMemo, useEffect } from "react";
import Navbar from "@/src/components/global/Navbar";
import Footer from "@/src/components/global/Footer";
import { useCart } from "@/src/contexts/CartContext";
import Image from "next/image";
 
/* ================= OPTIONS ================= */
 
const PAPER_OPTIONS = ["Hemp", "Unbleached", "Premium Silk Coated", "Organic"];
const FILTER_OPTIONS = ["Standard", "Activated Carbon", "Double Layer"];
const CONE_SIZES = ["100mm", "110mm", "King Size", "Pre-Rolled (Short)"];
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "China",
  "Australia",
  "Other",
];
 
type ItemCustomization = {
  quantity?: number;
  paperType?: string;
  filterType?: string;
  size?: string;
  notes?: string;
};
 
type FormErrors = {
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
};
 
export default function RequestQuotePage() {
  const { items, updateQuantity } = useCart();
 
  /* ================= FORM STATE ================= */
 
  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    message: "",
    country: "India",
    estimatedDelivery: "",
  });
 
  const [customData, setCustomData] = useState<
    Record<string, ItemCustomization>
  >({});
 
  /* ================= ACCORDION STATE ================= */
 
  const [openId, setOpenId] = useState<string | null>(
    items.length ? String(items[0].productId) : null,
  );
 
  /* ================= CAROUSEL STATE ================= */
 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
 
  useEffect(() => {
    if (selectedIndex > items.length - 1) {
      setSelectedIndex(0);
    }
  }, [items, selectedIndex]);
 
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const updateItem = (id: string, data: ItemCustomization) => {
    if (data.quantity !== undefined) {
      updateQuantity(id, data.quantity);
    }
 
    setCustomData((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...data },
    }));
  };
 
  /* ================= PREVIEW DATA ================= */
 
  const selectedItem = items[selectedIndex] || null;
 
  const previewSummary = useMemo(() => {
    if (!selectedItem) return null;
 
    const custom = customData[selectedItem.productId] || {};
 
    return {
      name: selectedItem.name || `Product ${selectedItem.productId}`,
      quantity: selectedItem.quantity,
      paperType: custom.paperType || "Hemp",
      filterType: custom.filterType || "Standard",
      coneSize: custom.size || "King Size",
      image: selectedItem.imageUrl || null,
    };
  }, [selectedItem, customData]);
 
  const validateForm = () => {
    const newErrors: FormErrors = {};
 
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.company.trim()) newErrors.company = "Company is required";
 
    setErrors(newErrors);
 
    return Object.keys(newErrors).length === 0;
  };
 
  /* ================= SUBMIT ================= */
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!items.length) return;
 
    const isValid = validateForm();
    if (!isValid) return;
 
    const payload = {
      customer: form,
      items: items.map((i) => ({
        ...i,
        ...customData[i.productId],
      })),
    };
 
    console.log("QUOTE PAYLOAD", payload);
    alert("Quote request sent! Check console.");
  };
 
  const isCartEmpty = items.length === 0;
 
  /* ================= UI ================= */
 
  return (
    <div className="min-h-screen text-white relative">
      <Navbar />
 
      <main className="min-h-screen pt-10 md:pt-14 pb-16 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-10 mt-10">
            Request a <span className="text-blue-400">Quote</span>
          </h1>
        </div>
 
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ===== LEFT PREVIEW CAROUSEL ===== */}
            <div className="w-full lg:w-1/3">
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm font-semibold mb-4">Product Preview</h3>
 
                {previewSummary ? (
                  <>
                    <div className="relative w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                      {previewSummary.image ? (
                        <div className="relative w-full aspect-video">
                          <Image
                            src={previewSummary.image}
                            alt={previewSummary.name}
                            fill
                            className=""
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
 
                      {items.length > 1 && (
                        <>
                          <div
                            onClick={() =>
                              setSelectedIndex((prev) =>
                                prev === 0 ? items.length - 1 : prev - 1,
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 px-2 py-1 rounded text-xs  cursor-pointer"
                          >
                            ‹
                          </div>
 
                          <div
                            onClick={() =>
                              setSelectedIndex((prev) =>
                                prev === items.length - 1 ? 0 : prev + 1,
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 px-2 py-1 rounded text-xs cursor-pointer"
                          >
                            ›
                          </div>
                        </>
                      )}
                    </div>
 
                    {items.length > 1 && (
                      <div className="flex justify-center gap-2 mt-3">
                        {items.map((_, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`h-2 w-2 rounded-full cursor-pointer ${
                              i === selectedIndex
                                ? "bg-blue-400"
                                : "bg-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    )}
 
                    <ul className="text-xs text-gray-300 space-y-2 mt-4">
                      <li>
                        <strong>Product:</strong> {previewSummary.name}
                      </li>
                      <li>
                        <strong>Quantity:</strong> {previewSummary.quantity}
                      </li>
                      <li>
                        <strong>Paper:</strong> {previewSummary.paperType}
                      </li>
                      <li>
                        <strong>Filter:</strong> {previewSummary.filterType}
                      </li>
                      <li>
                        <strong>Cone Size:</strong> {previewSummary.coneSize}
                      </li>
                      <li>
                        <strong>Country:</strong> {form.country}
                      </li>
                    </ul>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Cart is empty</p>
                )}
              </div>
            </div>
 
            {/* ===== RIGHT FORM ===== */}
            <div className="w-full lg:w-2/3">
              <form
                onSubmit={handleSubmit}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="flex flex-col gap-2 text-center p-4">
                  <div className="text-xl font-semibold">
                    Tell us what you need
                  </div>
                  <div className="text-sm text-gray-300">
                    Share quantity, materials and delivery timeframe and we’ll
                    get back with pricing.
                  </div>
                </div>
                {/* ACCORDIONS */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const id = String(item.productId);
                    const custom = customData[item.productId] || {};
                    const isOpen = openId === id;
 
                    return (
                      <div
                        key={id}
                        className="border border-white/10 rounded-xl overflow-hidden"
                      >
                        <button
                          title="accordian"
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : id)}
                          className="w-full flex justify-between px-4 py-3 bg-black/30 cursor-pointer"
                        >
                          <span className="text-sm">
                            {item.name || `Product ${item.productId}`}
                          </span>
                          <span className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </span>
                        </button>
 
                        {isOpen && (
                          <div className="p-4 space-y-3 bg-black/20">
                            <input
                              title="quantity"
                              type="number"
                              value={item.quantity}
                              min={1}
                              onChange={(e) =>
                                updateItem(id, {
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            />
 
                            <select
                              title="paper-type"
                              value={custom.paperType || "Hemp"}
                              onChange={(e) =>
                                updateItem(id, { paperType: e.target.value })
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            >
                              {PAPER_OPTIONS.map((p) => (
                                <option key={p}>{p}</option>
                              ))}
                            </select>
 
                            <select
                              title="filter-type"
                              value={custom.filterType || "Standard"}
                              onChange={(e) =>
                                updateItem(id, { filterType: e.target.value })
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            >
                              {FILTER_OPTIONS.map((f) => (
                                <option key={f}>{f}</option>
                              ))}
                            </select>
 
                            <select
                              title="size"
                              value={custom.size || "King Size"}
                              onChange={(e) =>
                                updateItem(id, { size: e.target.value })
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
                            >
                              {CONE_SIZES.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
 
                {/* CONTACT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <input
                      name="fullName"
                      placeholder="Full Name"
                      value={form.fullName}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                    {errors.fullName && (
                      <span className="text-xs text-red-400 mt-1 px-2">
                        {errors.fullName}
                      </span>
                    )}
                  </div>
 
                  {/* Job Title */}
                  <div className="flex flex-col">
                    <input
                      name="jobTitle"
                      placeholder="Job Title"
                      value={form.jobTitle}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                  </div>
 
                  {/* Email */}
                  <div className="flex flex-col">
                    <input
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-400 mt-1 px-2">
                        {errors.email}
                      </span>
                    )}
                  </div>
 
                  {/* Phone */}
                  <div className="flex flex-col">
                    <input
                      name="phone"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-400 mt-1 px-2">
                        {errors.phone}
                      </span>
                    )}
                  </div>
 
                  {/* Company */}
                  <div className="flex flex-col">
                    <input
                      name="company"
                      placeholder="Company"
                      value={form.company}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                    {errors.company && (
                      <span className="text-xs text-red-400 mt-1 px-2">
                        {errors.company}
                      </span>
                    )}
                  </div>
 
                  {/* Website */}
                  <div className="flex flex-col">
                    <input
                      name="website"
                      placeholder="Website"
                      value={form.website}
                      onChange={handleFormChange}
                      className="input glass-panel"
                    />
                  </div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    title="country"
                    name="country"
                    value={form.country}
                    onChange={handleFormChange}
                    className="input glass-panel"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
 
                  <input
                    title="date"
                    type="date"
                    name="estimatedDelivery"
                    value={form.estimatedDelivery}
                    onChange={handleFormChange}
                    className="input glass-panel"
                  />
                </div>
 
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Additional notes..."
                  value={form.message}
                  onChange={handleFormChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-3 text-sm"
                />
 
                <button
                  title="submit"
                  type="submit"
                  disabled={isCartEmpty}
                  className={`w-full py-3 uppercase tracking-widest text-xs font-bold rounded-lg transition active ${
                    isCartEmpty
                      ? "bg-gray-600 cursor-not-allowed"
                      : "btn-liquid"
                  }`}
                >
                  {isCartEmpty ? "Cart is Empty" : "Request a Quote"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}