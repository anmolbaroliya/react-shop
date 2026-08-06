import React, { useState, useEffect } from "react";
import {
  Category,
  ErrorState,
  GetProductsParams,
  Product,
} from "../types/product";
import { getCategories, getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

function Home() {
  const LIMIT = 12;

  //products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    categories: "",
    products: "",
  });

  //search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  //sorting
  const [selectedSort, setSelectedSort] = useState("");
  const [sortBy, setSortBy] = useState<GetProductsParams["sortBy"]>();
  const [order, setOrder] = useState<GetProductsParams["order"]>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  async function fetchProducts(search: string, category: string) {
    setLoading(true);
    setProducts([]);

    console.log("API called");
    try {
      const data = await getProducts({
        limit: LIMIT,
        skip: (currentPage - 1) * LIMIT,
        search,
        sortBy,
        order,
        category,
      });

      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        products:
          error instanceof Error ? error.message : "Something went wrong",
      }));
    } finally {
      // TODO: Remove artificial loading delay before production
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  async function fetchCategories() {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        categories:
          error instanceof Error ? error.message : "Something went wrong",
      }));
    }
  }

  const totalPages = Math.ceil(totalProducts / LIMIT);
  const pages = getVisiblePages(currentPage, totalPages);

  //searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  //sorting
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedSort(value);
    setCurrentPage(1);

    if (!value) {
      setSortBy(undefined);
      setOrder(undefined);
      return;
    }

    const params = value.split("-");
    const sortBy = params[0] as GetProductsParams["sortBy"];
    const order = params[1] as GetProductsParams["order"];

    setSortBy(sortBy);
    setOrder(order);
  };

  //pagination
  function getVisiblePages(
    currentPage: number,
    totalPages: number,
  ): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // End
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }

  //filtering
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedCategory(value);
    setCurrentPage(1);
    if (value) {
      setSearch("");
      setDebouncedSearch("");
    }
  };

  //to fetch products
  useEffect(() => {
    fetchProducts(debouncedSearch, selectedCategory);
  }, [debouncedSearch, currentPage, sortBy, order, selectedCategory]);

  //to fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  //to debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      console.log("Updating debounced search:", search);
      setDebouncedSearch(search);
      if (search) {
        setSelectedCategory("");
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  if (error.products) {
    return <h2>{error.products}</h2>;
  }

  return (
    <>
      {/* header */}
      <div className="products-header">
        <h1 className="page-title">Products</h1>
        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />

        <div className="toolbar">
          <select
            className="sort-select"
            value={selectedSort}
            onChange={handleSortChange}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discountPercentage-asc">
              Discount: Low to High
            </option>
            <option value="discountPercentage-desc">
              Discount: High to Low
            </option>
            <option value="rating-desc">Popularity</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>
        </div>

        <div className="toolbar">
          <select
            className="categories"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products">
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <h2>No products found.</h2>
        )}
      </div>
      {totalPages > 1 && (
        <footer className="footer">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`${page}-${index}`} className="ellipsis">
                  ...
                </span>
              );
            }
            return (
              <button
                key={`${page}-${index}`}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "active-page" : ""}
              >
                {page}
              </button>
            );
          })}
        </footer>
      )}
    </>
  );
}

export default Home;
