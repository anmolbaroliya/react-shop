import { GetProductsParams, ProductResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(
    {search="",limit=30,skip=0,sortBy,order}: GetProductsParams
): Promise<ProductResponse> {
    const queryParams = new URLSearchParams();

    if (search) {
        queryParams.append("q", search);
    }

    if(sortBy){
        queryParams.append("sortBy",sortBy);
    }

    if(order){
        queryParams.append("order",order);
    }

    queryParams.append("limit", String(limit));
    queryParams.append("skip", String(skip));

    const endpoint = search ? `${BASE_URL}/search` : `${BASE_URL}`;

    const url = `${endpoint}?${queryParams}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();

}