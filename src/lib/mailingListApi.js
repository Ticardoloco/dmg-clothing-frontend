import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/mailinglist`;
export const getSubscribers = async () => {
    try {
        const token = useAuthStore.getState().token;
        const response = await fetch(`${API_BASE_URL}/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    }catch (error) {
        console.error("Error fetching subscribers:", error);
        throw error;
    }
}

export const updateSubscriberStatus = async (subscriberId, newStatus) => {
    try{
        const token = useAuthStore.getState().token;
        const response = await fetch(`${API_BASE_URL}/update-status/${subscriberId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });
        const data = await response.json();
        return data;
    }catch (error) {
        console.error("Error updating subscriber status:", error);
        throw error;    
}

}

export const deleteSubscriber = async (subscriberId) => {
    try {
        const token = useAuthStore.getState().token;
        const response = await fetch(`${API_BASE_URL}/delete/${subscriberId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        throw error;
    }
}
