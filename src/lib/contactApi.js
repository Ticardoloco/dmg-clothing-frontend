import { useAuthStore } from "@/store/authStore";


export const getMessages = async () => {
  try {
    // 1. Grab your authentication token
    const token = useAuthStore.getState().token;

    // 2. Pass it inside the headers option
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contact/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      // Help yourself debug by logging out what went wrong
      console.error(`Fetch failed with status: ${res.status}`);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch contact messages");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw so ContactMessagePage.jsx's catch block can catch it
  }
};

export const deleteMessage = async (messageId) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contact/delete/${messageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error("Failed to delete message");
        }
        return { success: true, message: "Message deleted successfully" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete message" };
    }
}