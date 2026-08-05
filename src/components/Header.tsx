import { useTotalItems } from "../store/cartSelectors";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Header(){

    const totalItems = useTotalItems();
    const navigate =useNavigate();

    return (
        <header className="header">
            <h1 onClick={()=>navigate("/")}>Shopping App</h1>

            <Link  className="cart-link" to="/cart">
            <FaShoppingCart size={18}/>
            <span>Cart ({totalItems})</span>
            </Link>
        </header>
    );
}

export default Header;