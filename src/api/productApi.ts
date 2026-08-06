import { Category, GetProductsParams, ProductResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(
    { search = "", limit = 30, skip = 0, sortBy, order, category = "" }: GetProductsParams
): Promise<ProductResponse> {
    const queryParams = new URLSearchParams();

    if (search) {
        queryParams.append("q", search);
    }

    if (sortBy) {
        queryParams.append("sortBy", sortBy);
    }

    if (order) {
        queryParams.append("order", order);
    }

    queryParams.append("limit", String(limit));
    queryParams.append("skip", String(skip));

    let endpoint = `${BASE_URL}`;
    if (search) {
        endpoint = `${BASE_URL}/search`;
    } else if (category) {
        endpoint = `${BASE_URL}/category/${category}`
    }

    const url = `${endpoint}?${queryParams}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();

}

export async function getCategories(): Promise<Category[]> {
    const url = `${BASE_URL}/categories`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();

}