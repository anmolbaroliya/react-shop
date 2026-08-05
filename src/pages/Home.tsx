import React, { useState, useEffect } from "react";
import { Product } from "../types/product";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

function Home() {

  const LIMIT = 30;

  //products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  //search
  const [search, setSearch] = useState("");
  const [debouncedSearch,setDebouncedSearch]= useState("");

  //pagination
  const [currentPage,setCurrentPage]=useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  async function fetchProducts(search:string) {
    console.log("API called");
    try {
      const data = await getProducts({
        limit:LIMIT,
        skip:(currentPage-1)*LIMIT,
        search
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

  const totalPages=Math.ceil(totalProducts/LIMIT);

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(e.target.value);
  }

  //to fetch 
  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch,currentPage]);

  //to debounce
  useEffect(()=>{
    
    const timer = setTimeout(()=>{
        setCurrentPage(1);
        console.log("Updating debounced search:", search);
        setDebouncedSearch(search);
    },2000);

    return () =>{
        clearTimeout(timer);
    }
  },[search]);


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
      <footer>
        <button onClick={()=>setCurrentPage((page)=>page-1)} disabled={currentPage===1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={()=>setCurrentPage((page)=>page+1)} disabled={currentPage===totalPages}>Next</button>
      </footer>
    </>
  );
}

export default Home;
