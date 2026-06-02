import { useAuthStore } from "@/store/authStore";

const BASE_URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`;

export const getProduct = async () =>{
    try {
        const res = await fetch(`${BASE_URI}/products`);
        if(!res.ok){
            throw new Error("Failed to fetch products")
        }

        const data = await res.json()
        return data;
    } catch (error) {
        console.error(error);
        return { products: [] };
    }
}

