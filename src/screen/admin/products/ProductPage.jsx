/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { getProduct } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { uploadImage } from "@/lib/image";

// A small component to display neat color dots next to text
const ColorDot = ({ colorName }) => {
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    grey: "#808080",
    gray: "#808080",
    navy: "#1E3A8A",
    beige: "#F5F5DC",
    cream: "#FDF6E2",
    brown: "#78350F",
    olive: "#374151",
    gold: "#D97706",
    blue: "#2563EB",
  };
  const normalized = colorName?.toLowerCase().trim() || "";
  const hex = colorMap[normalized];
  return (
    <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 capitalize">
      {hex && (
        <span
          className="w-1.5 h-1.5 rounded-full border border-gray-300"
          style={{ backgroundColor: hex }}
        />
      )}
      {colorName}
    </span>
  );
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track whether we are currently creating or modifying an item
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Image Upload States
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form Input Fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Full",
    subCategory: "Agbada",
    sizes: "",
    colors: "",
    bestseller: false,
  });

  // State for dynamic variant stock entries
  const [variants, setVariants] = useState([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProduct();
        setProducts(data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Monitor structural change updates to text sizes & colors inputs to update the variance stock fields
  useEffect(() => {
    const splitSizes = formData.sizes
      ? formData.sizes
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      : [];
    const splitColors = formData.colors
      ? formData.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    // Case 1: Both Sizes and Colors exist
    if (splitSizes.length > 0 && splitColors.length > 0) {
      const newVariants = [];
      splitSizes.forEach((size) => {
        splitColors.forEach((color) => {
          const existingMatch = variants.find(
            (v) => v.size === size && v.color === color,
          );
          newVariants.push({
            size,
            color,
            stock: existingMatch ? existingMatch.stock : 0,
          });
        });
      });
      setVariants(newVariants);
    }
    // Case 2: Sizes only (No Colors)
    else if (splitSizes.length > 0 && splitColors.length === 0) {
      const newVariants = splitSizes.map((size) => {
        const existingMatch = variants.find((v) => v.size === size && !v.color);
        return {
          size,
          color: "",
          stock: existingMatch ? existingMatch.stock : 0,
        };
      });
      setVariants(newVariants);
    }
    // Case 3: Colors only (No Sizes)
    else if (splitColors.length > 0 && splitSizes.length === 0) {
      const newVariants = splitColors.map((color) => {
        const existingMatch = variants.find(
          (v) => v.color === color && !v.size,
        );
        return {
          size: "",
          color,
          stock: existingMatch ? existingMatch.stock : 0,
        };
      });
      setVariants(newVariants);
    }
    // Case 4: Totally empty fields
    else {
      setVariants([]);
    }
  }, [formData.sizes, formData.colors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantStockChange = (index, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, stock: parseInt(value) || 0 } : v,
      ),
    );
  };

  // Trigger editing configuration mode
  const handleEditClick = (product) => {
    try {
      setEditingProduct(product);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ? product.price.toString() : "",
        category: product.category || "Full",
        subCategory: product.subCategory || "Agbada",
        sizes: product.sizes ? product.sizes.join(", ") : "",
        colors: product.colors ? product.colors.join(", ") : "",
        bestseller: !!product.bestSeller,
      });

      setVariants(product.variants || []);

      if (product.image) {
        setImagePreviews(
          product.image.map((img) =>
            img.startsWith("Uploaded:") ? "placeholder.jpg" : img,
          ),
        );
      } else {
        setImagePreviews([]);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error occurred while opening product editor:", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      try {
        // 1. Send the DELETE request to your backend API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // 2. Check if the backend successfully deleted it
        if (!response.ok) {
          throw new Error("Failed to delete the product from the server.");
        }

        // 3. Update the frontend UI state only after successful backend deletion
        setProducts((prev) => prev.filter((product) => product._id !== id));
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(error.message || "Something went wrong while deleting.");
      }
    }
  };

  const processFiles = (files) => {
    const fileList = Array.from(files);
    const previews = fileList.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...fileList]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageFileChange = (e) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    imagePreviews.forEach(URL.revokeObjectURL);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Full",
      subCategory: "Agbada",
      sizes: "",
      colors: "",
      bestseller: false,
    });
    setVariants([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double clicking if already uploading
    if (isSubmitting) return;

    // Validation
    if (
      !formData.name ||
      !formData.price ||
      (!formData.sizes && !formData.colors)
    ) {
      toast.error(
        "Please fill in all required fields including Sizes or Colors",
      );
      return;
    }

    // Ensure there is at least one image if creating a new product
    if (!editingProduct && imageFiles.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const processedSizes = formData.sizes
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    const processedColors = formData.colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true); // Lock the UI button right away
      let imageUrls = [];

      // Cleaned up async file execution block
      for (const file of imageFiles) {
        try {
          const res = await uploadImage(file, file.name, file.type);
          if (res && res.imageUrl) {
            imageUrls.push(res.imageUrl);
          }
        } catch (uploadErr) {
          console.error("Single image upload failed:", uploadErr);
          throw new Error("Failed uploading one of your images to Cloudinary.");
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        price: parseFloat(formData.price),
        sizes: processedSizes,
        colors: processedColors,
        bestSeller: formData.bestseller,
        variants: variants,
        image: imageUrls.length > 0 ? imageUrls : editingProduct?.image || [],
      };

      if (editingProduct) {
        console.log("edit product", editingProduct);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/update/${editingProduct._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok)
          throw new Error("Could not execute cloud update parameters");
        const data = await response.json();

        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? data.product : p)),
        );
        toast.success("Product updated successfully!");
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok)
          throw new Error("Could not execute creation operations on DB");
        const data = await response.json();

        setProducts((prev) => [data.product, ...prev]);
        toast.success("New product successfully created!");
      }

      closeModal();
    } catch (error) {
      console.error("API submission error details:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false); // ALWAYS unlocks the button, even on failure
    }
  };


  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts
    .toReversed()
    .slice(startIndex, startIndex + productsPerPage);

  const calculateTotalStock = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((total, item) => total + item.stock, 0);
  };

  if (loading)
    return (
      <div className="pt-40 text-center font-prata">Loading products...</div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-6 space-y-6 md:space-y-10">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* --- TOP BAR HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            Manage{" "}
            <span className="text-indigo-600 italic font-light">Products</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            View stock variations, edit catalog, and add new clothes
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-sm md:text-[10px] font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full md:w-56 transition-all"
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 text-xs md:text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all h-11 whitespace-nowrap w-full sm:w-auto text-center"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="block md:hidden space-y-4">
        {paginatedProducts.map((product) => {
          const totalStock = calculateTotalStock(product);
          return (
            <div
              key={product._id}
              className="border border-gray-100 bg-white p-4 shadow-sm space-y-4 rounded-sm relative group"
            >
              <div className="flex gap-3">
                <div className="w-16 h-20 bg-gray-50 border border-gray-200 shrink-0 flex items-center justify-center font-mono text-[8px] text-gray-400 uppercase tracking-tighter rounded-sm overflow-hidden relative">
                  {product.image?.[0] && (
                    <Image
                      fill
                      className="object-cover"
                      src={
                        product.image[0].startsWith("Uploaded:")
                          ? "/placeholder.jpg"
                          : product.image[0]
                      }
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="font-bold text-gray-900 text-base leading-tight truncate max-w-[70%]">
                      {product.name}
                    </h2>
                    {product.bestLetter && (
                      <span className="bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-wider px-1 border border-amber-200 whitespace-nowrap">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {product.description || "No description added."}
                  </p>
                  <span className="font-mono text-[9px] text-gray-400 block tracking-tighter uppercase">
                    ID: {product._id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                    Classification
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 text-[8px] uppercase tracking-wider border border-indigo-100">
                      {product.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 text-[8px] uppercase tracking-wider border border-gray-200">
                      {product.subCategory}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                    Price
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    ₦{product.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50 space-y-2">
                {product.sizes?.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mr-1.5">
                      Sizes:
                    </span>
                    {product.sizes.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-gray-200 px-1 text-[8px] font-black text-gray-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {product.colors?.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mr-1.5">
                      Colors:
                    </span>
                    {product.colors.map((c, idx) => (
                      <ColorDot key={idx} colorName={c} />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-50 flex justify-between items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-indigo-600 hover:text-black font-bold uppercase tracking-wider text-[10px] bg-indigo-50 px-3 py-1.5"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-800 font-bold uppercase tracking-wider text-[10px] bg-red-50 px-3 py-1.5"
                  >
                    Delete
                  </button>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border ${
                    totalStock === 0
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${totalStock === 0 ? "bg-red-500" : "bg-green-500"}`}
                  />
                  {totalStock === 0 ? "Sold Out" : `${totalStock} Available`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block border border-gray-100 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
              <th className="p-4 w-[35%]">Item Details</th>
              <th className="p-4 w-[25%]">Categories & Sizes</th>
              <th className="p-4 w-[15%]">Price</th>
              <th className="p-4 w-[13%] text-right">Total Stock</th>
              <th className="p-4 w-[12%] text-center">Action</th>
            </tr>
          </thead>
        </table>
        <table className="w-full text-left border-collapse text-xs">
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => {
              const totalStock = calculateTotalStock(product);
              return (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50/40 transition-colors align-top group"
                >
                  <td className="p-4 flex gap-4 w-[35%]">
                    <div className="w-14 h-16 bg-gray-50 border border-gray-200 shrink-0 flex items-center justify-center font-mono text-[8px] text-gray-400 uppercase tracking-tighter relative overflow-hidden">
                      {product.image?.[0] && (
                        <Image
                          fill
                          className="object-cover"
                          src={
                            product.image[0].startsWith("Uploaded:")
                              ? "/placeholder.jpg"
                              : product.image[0]
                          }
                          alt={product.name}
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900 text-sm leading-tight transition-colors group-hover:text-indigo-600">
                          {product.name}
                        </div>
                        {product.bestSeller && (
                          <span className="bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-wider px-1 border border-amber-200">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed max-w-sm line-clamp-2">
                        {product.description || "No description added."}
                      </p>
                      <span className="font-mono text-[9px] text-gray-400 block pt-1 uppercase tracking-tighter">
                        ID: {product._id}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 space-y-3 pt-5 w-[25%]">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider border border-indigo-100">
                        {product.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 text-[9px] uppercase tracking-wider border border-gray-200">
                        {product.subCategory}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {product.sizes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mr-1">
                            Sizes:
                          </span>
                          {product.sizes.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-gray-200 px-1 text-[8px] font-black text-gray-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {product.colors?.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center pt-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mr-1">
                            Colors:
                          </span>
                          {product.colors.map((c, idx) => (
                            <ColorDot key={idx} colorName={c} />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-gray-900 pt-6 text-sm w-[15%]">
                    ₦{product.price?.toLocaleString()}
                  </td>

                  <td className="p-4 text-right pt-5 w-[13%]">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                        totalStock === 0
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${totalStock === 0 ? "bg-red-500" : "bg-green-500"}`}
                      />
                      {totalStock === 0
                        ? "Sold Out"
                        : `${totalStock} Variant Pieces`}
                    </span>
                  </td>

                  <td className="p-4 text-center pt-5 w-[12%]">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="opacity-80 group-hover:opacity-100 text-indigo-600 hover:text-white font-bold uppercase tracking-widest text-[10px] border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-600 px-3 py-1.5 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="opacity-80 group-hover:opacity-100 text-red-600 hover:text-white font-bold uppercase tracking-widest text-[10px] border border-red-200 hover:border-red-600 hover:bg-red-600 px-3 py-1.5 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border text-sm transition-all ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT MODAL WINDOW --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 w-full sm:max-w-lg p-5 sm:p-6 shadow-xl space-y-4 rounded-t-lg sm:rounded-sm max-h-[92vh] sm:max-h-[90vh] overflow-y-auto transition-transform">
            <div className="flex justify-between items-start sticky top-0 bg-white pb-2 z-10">
              <div>
                <h3 className="font-prata text-lg uppercase tracking-tight text-gray-900">
                  {editingProduct ? "Edit Product Details" : "Add New Product"}
                </h3>
                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                  {editingProduct
                    ? `Modifying ID: ${editingProduct._id}`
                    : "Fill out the clothing details below"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* --- IMAGE UPLOAD BOX --- */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Product Images *
                </label>

                <div
                  className="border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 md:p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("imageUploadInput").click()
                  }
                >
                  <svg
                    className="w-6 h-6 text-gray-300 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1.5 text-gray-500 text-[11px] font-medium leading-relaxed max-w-xs mx-auto">
                    Drag/drop files or{" "}
                    <span className="text-indigo-600 font-bold">
                      browse desktop
                    </span>
                  </p>
                </div>

                <input
                  id="imageUploadInput"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                {/* Selected Images Grid Preview */}
                {imagePreviews.length > 0 && (
                  <div className="border border-gray-100 bg-white p-2.5 space-y-2">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
                      Images Attached ({imagePreviews.length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="aspect-3/4 bg-gray-50 border border-gray-100 relative overflow-hidden"
                        >
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 m-0.5 bg-black/60 text-white hover:bg-red-600 p-0.5 transition-colors"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* --- STANDARD INFO INPUTS --- */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Product Name *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white text-gray-900 text-xs rounded-none"
                  placeholder="e.g., Luxury Silk Kaftan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Description
                </label>
                <textarea
                  rows="2"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white resize-none text-gray-900 text-xs rounded-none"
                  placeholder="Write a short note about fabric quality..."
                />
              </div>

              {/* Category Dropdowns */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Category Select *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white uppercase tracking-wider text-[10px] font-bold text-gray-900 rounded-none h-9"
                  >
                    <option value="Full">Full</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Sub-Category Select *
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white uppercase tracking-wider text-[10px] font-bold text-gray-900 rounded-none h-9"
                  >
                    <option value="Agbada">Agbada</option>
                    <option value="Kaftan">Kaftan</option>
                    <option value="Jalabiya">Jalabiya</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Cargo pants">Cargo pants</option>
                  </select>
                </div>
              </div>

              {/* Price & Inventory Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-50 mt-4 pt-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Price (₦) *
                  </label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white text-gray-900 text-xs rounded-none"
                    placeholder="85000"
                  />
                </div>

                {/* --- BEST SELLER SELECTION --- */}
                <div className="space-y-1 flex flex-col justify-end pl-0 sm:pl-2">
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none group py-2">
                    <input
                      type="checkbox"
                      name="bestseller"
                      checked={formData.bestseller}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded-none border-gray-200 text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 transition-colors group-hover:text-black">
                        Mark as Best Seller
                      </span>
                      <span className="text-[8px] text-gray-400 tracking-normal font-normal">
                        Feature this item prominently
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sizes and Colors */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Sizes{" "}
                    <span className="text-[7px] text-gray-400 font-normal block sm:inline">
                      (Commas)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white text-gray-900 text-xs rounded-none"
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Colors{" "}
                    <span className="text-[7px] text-gray-400 font-normal block sm:inline">
                      (Commas)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 outline-none focus:border-indigo-600 bg-white text-gray-900 text-xs rounded-none"
                    placeholder="Black, Gold"
                  />
                </div>
              </div>

              {/* Dynamic Variant Stocks Grid */}
              {variants.length > 0 && (
                <div className="border border-gray-100 bg-gray-50/40 p-2.5 space-y-2 mt-2">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
                    Configure Variant Stocks
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-100 bg-white p-2 shadow-sm"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-tighter text-gray-700">
                          {variant.size && variant.color
                            ? `${variant.size} - ${variant.color}`
                            : variant.size || variant.color}
                        </span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Stock Qty"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantStockChange(index, e.target.value)
                          }
                          className="border border-gray-200 p-1 w-20 text-right outline-none focus:border-indigo-600 bg-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-black"
                  } text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all w-full text-center`}
                >
                  {isSubmitting
                    ? "Processing Upload..."
                    : editingProduct
                      ? "Update Product"
                      : "Publish Product"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-200 text-gray-500 font-bold uppercase tracking-widest px-4 py-3 text-[10px] hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
