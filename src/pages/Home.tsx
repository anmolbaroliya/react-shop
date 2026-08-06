import React, { useState, useEffect } from "react";
import { GetProductsParams, Product } from "../types/product";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

function Home() {
  const LIMIT = 12;

  //products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function fetchProducts(search: string) {
    console.log("API called");
    try {
      const data = await getProducts({
        limit: LIMIT,
        skip: (currentPage - 1) * LIMIT,
        search,
        sortBy,
        order,
      });

      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalProducts / LIMIT);
  const pages = getVisiblePages(currentPage, totalPages);

  //searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

  //to fetch
  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch, currentPage, sortBy, order]);

  //to debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      console.log("Updating debounced search:", search);
      setDebouncedSearch(search);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
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
            <option value="">Default</option>
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
      </div>
      <div className="products">
        {products.length > 0 ? (
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
