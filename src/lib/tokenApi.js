import { useAuthStore } from "@/store/authStore";

export const apiFetch = async (url, options = {}) => {
  const { token} = useAuthStore.getState();
  const logout = useAuthStore.getState().logOut;

  // 1. Prepare headers and automatically inject the Bearer Token
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 2. Make the API request
  const response = await fetch(url, { ...options, headers });

  // 3. IF THE TOKEN EXPIRED, LOG OUT IMMEDIATELY
  if (response.status === 401) {
    logout();
    return;
  }

  return response;
};