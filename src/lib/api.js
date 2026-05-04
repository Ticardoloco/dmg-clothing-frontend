const BASE_URI = "http://localhost:4001/api/v1/products";

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