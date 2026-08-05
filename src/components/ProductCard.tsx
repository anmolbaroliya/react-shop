import { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { useIsProductInCart } from "../store/cartSelectors";

export interface ProductCardProps {
    product: Product
}

function ProductCard({product}:ProductCardProps){

    const navigate = useNavigate();
    const addToCart = useCartStore((state)=>state.addToCart); 
    const isProductInCart = useIsProductInCart(product.id);

   const handleCartAction =()=>{
        if(isProductInCart){
            navigate("/cart");
        }else{
            addToCart(product);
        }
   }


    return(
    <div className="product-card">
        <img src ={product.thumbnail} alt={product.title} width={150}/>

         <div className="product-content">
            <h3>{product.title}</h3>
            <p>Rs. {product.price}</p>
         </div>
        <button onClick={handleCartAction}>{isProductInCart?`Go To Cart`:`Add To Cart`}</button>     
    </div>
    )
}

export default ProductCard;