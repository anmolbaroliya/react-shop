import React, { useState, useEffect, useCallback } from "react";
import {
  Category,
  ErrorState,
  GetProductsParams,
  Product,
} from "../types/product";
import { getCategories, getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import SearchBar from "../components/SearchBar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

function Home() {
  const LIMIT = 12;
  const isPaginationEnabled = true;

  //products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({
    categories: "",
    products: "",
  });

  //search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 2000);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  //sorting
  const [selectedSort, setSelectedSort] = useState("");
  const [sortBy, setSortBy] = useState<GetProductsParams["sortBy"]>();
  const [order, setOrder] = useState<GetProductsParams["order"]>();

  //filtering
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  //TO check React.memo
  const [showCount, setShowCount] = useState(true);

  //Infinite Scroll
  const hasMore = products.length < totalProducts;
  const { observerRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    enabled:!isPaginationEnabled
  });

  const totalPages = Math.ceil(totalProducts / LIMIT);

  console.log("🏠 Home rendered", {
    loading,
    products: products.length,
    categories: categories.length,
    search,
    debouncedSearch,
    currentPage,
  });

  async function fetchProducts(search: string, category: string) {
    setLoading(true);

    console.log("🌐 Fetch Products API", {
      search: debouncedSearch,
      category: selectedCategory,
      page: currentPage,
      sortBy,
      order,
    });
    try {
      const data = await getProducts({
        limit: LIMIT,
        skip: (currentPage - 1) * LIMIT,
        search,
        sortBy,
        order,
        category,
      });

      if (isPaginationEnabled) {
        setProducts(data.products);
      } else {
        if (currentPage === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
      }
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

  //searching
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
    },
    [],
  );

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

  //filtering
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedCategory(value);
    setCurrentPage(1);
    if (value) {
      setSearch("");
    }
  };

  //to fetch products
  useEffect(() => {
    console.log("📦 Products Effect");
    fetchProducts(debouncedSearch, selectedCategory);
  }, [debouncedSearch, currentPage, sortBy, order, selectedCategory]);

  //to fetch categories 3
  useEffect(() => {
    console.log("📂 Categories Effect");
    fetchCategories();
  }, []);

  //to debounce
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }

    if (debouncedSearch) {
      setSelectedCategory("");
    }
  }, [debouncedSearch]);

  if (error.products) {
    return <h2>{error.products}</h2>;
  }

  return (
    <>
      {/* header */}
      <div className="products-header">
        <h1 className="page-title">
          Products{" "}
          {showCount && (
            <span className="product-count">({totalProducts})</span>
          )}
        </h1>

        <label className="show-count">
          <input
            type="checkbox"
            checked={showCount}
            onChange={() => setShowCount((prev) => !prev)}
          />
          Show Count
        </label>
        <SearchBar value={search} onChange={handleSearchChange} />
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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {loading &&
          !isPaginationEnabled &&
          Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}

        {!loading && products.length === 0 && <h2>No products found.</h2>}
      </div>
      {/* pagination */}
      {isPaginationEnabled && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
      )}
      {/* Infinite Scroll */}
      {!isPaginationEnabled && <div ref={observerRef} />}
    </>
  );
}

export default Home;
