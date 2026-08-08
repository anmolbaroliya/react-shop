import { List } from "react-window";
import ProductCard from "./ProductCard";
import { Product } from "../types/product";

interface VirtualProductGridProps {
  products: Product[];
}

function VirtualProductGrid({ products }: VirtualProductGridProps) {
  const COLUMN_COUNT = 3;
  const rowCount = Math.ceil(products.length / COLUMN_COUNT);
  return (
    <List
      style={{
        height: "calc(100vh - 150px)",
        width: "100%",
      }}
      rowCount={rowCount}
      rowHeight={360}
      rowProps={{ products }}
      rowComponent={({ index, style, products }) => {
        const startIndex = index * COLUMN_COUNT;
        console.log("Rendering row:", index);

        return (
          <div
            style={{
              ...style,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          >
            {products
              .slice(startIndex, startIndex + COLUMN_COUNT)
              .map((product) => (
                <ProductCard key={product.id} product={product}  />
              ))}
          </div>
        );
      }}
    />
  );
}

export default VirtualProductGrid;
