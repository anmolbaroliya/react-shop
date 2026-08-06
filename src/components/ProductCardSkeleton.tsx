import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <Skeleton height={180}  style={{ marginBottom: "16px" }}/>

      <div className="product-content">
        <Skeleton height={20} width="90%" />
        <Skeleton height={20} width="65%" />

        <div style={{ marginTop: 12 }}>
          <Skeleton height={18} width={70} />
        </div>
      </div>

      <Skeleton height={44} borderRadius={6} />
    </div>
  );
}

export default ProductCardSkeleton;
