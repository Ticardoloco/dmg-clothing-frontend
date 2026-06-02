import { useAuthStore } from "@/store/authStore";

const BASE_URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/order`;

// --- FETCH ALL ORDERS ---
export const getOrders = async () => {
  try {
    const token = useAuthStore.getState().token;

    const res = await fetch(`${BASE_URI}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { orders: [] };
  }
};

// --- UPDATE AN ORDER'S STATUS ---
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = useAuthStore.getState().token;

    // Sending a PUT request to your status update endpoint
    const res = await fetch(`${BASE_URI}/update/${orderId}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

   if (!res.ok) {
      // 1. Parse the error payload from the backend
      const errorData = await res.json().catch(() => ({}));
      
      // 2. Clear out the mystery with a direct alert popup!
      alert(`BACKEND CRASH REASON: ${errorData.error || errorData.message || "Unknown Error"}`);
      
      throw new Error(errorData.message || "Failed to update order status");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in updateOrderStatus API handler:", error);
    throw error; // Throwing error so toast.error() in your frontend component catches it
  }
};

// Add these to your existing @/lib/orderApi.js file

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const token = useAuthStore.getState().token;
    
    const res = await fetch(`${BASE_URI}/update-payment/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentStatus }),
    });

    // 1. Read the response stream EXACTLY ONCE
    const data = await res.json().catch(() => null);

    // 2. If the server says something went wrong, throw the actual backend message!
    if (!res.ok) {
      const serverMessage = data?.error || data?.message || "Reason hidden by server configuration";
      
      // This will force an alert popup on your dashboard screen showing the truth
      alert(`🚨 BACKEND CRASH REASON: ${serverMessage}`);
      
      throw new Error(serverMessage);
    }

    // 3. Return pre-parsed data safely
    return data;
  } catch (error) {
    console.error("Error in updatePaymentStatus API handler:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await fetch(`${BASE_URI}/delete/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete order entry");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};