import { GetProductsParams, ProductResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(
    {search="",limit=30,skip=0}: GetProductsParams
): Promise<ProductResponse> {
    const queryParams = new URLSearchParams();

    if (search) {
        queryParams.append("q", search);
    }

    queryParams.append("limit", String(limit));
    queryParams.append("skip", String(skip));

    const endpoint = search ? `${BASE_URL}/search` : `${BASE_URL}`;

    let url = `${endpoint}?${queryParams}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();

}