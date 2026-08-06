export interface Product {
    id:number;
    title:string;
    description:string;
    category:string;
    price:number;
    discountPercentage:number;
    rating:number;
    stcok:number;
    brand:string;
    thumbnail:string;
}

export interface ProductResponse{
    products:Product[],
    total:number;
    skip:number;
    limit:number;
}

export interface CartItem extends Product{
    quantity:number;
}

export interface GetProductsParams {
  search?: string;
  limit?: number;
  skip?: number;

  sortBy?: "title" | "price" | "discountPercentage" | "rating";
  order?: "asc" | "desc";
}