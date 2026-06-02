import { useAuthStore } from "@/store/authStore";

const BASE_URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`;

// --- FETCH ALL USERS ---
export const getUsers = async () => {
  try {

    const res = await fetch(`${BASE_URI}/profiles`, {
      method: "GET"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Users");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { users: [] };
  }
};

export const updateUserStatus = async (userId, newStatus) => {
    try{
        const token = useAuthStore.getState().token;
        const res = await fetch(`${BASE_URI}/update-status/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if(!res.ok){
            throw new Error("Failed to update user status");
        }
        const data = await res.json();
        return { success: true, message: "User status updated successfully", data };
    }catch(error){
        console.error(error);
        return { success: false, message: "Failed to update user status" };
    }
}

export const deleteUser = async (userId) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await fetch(`${BASE_URI}/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
    return { success: true, message: "User deleted successfully" };
  }catch(error){
    console.error(error);
    return { success: false, message: "Failed to delete user" };
  }
}