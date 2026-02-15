
// services/product.js

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false };
  }
};


export const addNewProduct = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/admin/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Add product error:", error);
    return { success: false };
  }
};

/* ---------------- GET ALL ADMIN PRODUCTS ---------------- */
export const getAllAdminProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/all-products`, {
      method: "GET",
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Get all admin products error:", error);
    return { success: false };
  }
};

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateAProduct = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/admin/update-product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false };
  }
};

/* ---------------- DELETE PRODUCT ---------------- */
export const deleteAProduct = async (id) => {
  try {
    const res = await fetch(
      `${API_URL}/api/admin/delete-product?id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false };
  }
};

/* ---------------- PRODUCT BY CATEGORY ---------------- */
export const productByCategory = async (category) => {
  try {
    const res = await fetch(
      `${API_URL}/api/admin/product-by-category?category=${category}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Product by category error:", error);
    return { success: false };
  }
};

/* ---------------- PRODUCT BY ID ---------------- */
export const productById = async (id) => {
  try {
    const res = await fetch(
      `${API_URL}/api/admin/product-by-id?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Product by ID error:", error);
    return { success: false };
  }
};
