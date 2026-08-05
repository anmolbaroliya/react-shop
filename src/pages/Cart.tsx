import { useTotalItems, useTotalPrice } from "../store/cartSelectors";
import useCartStore from "../store/cartStore";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Cart() {
  const cartItems = useCartStore((state) => state.cartItems);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h1>🛒 Your Cart is Empty</h1>
        <p>Looks like you haven't added any products yet.</p>
        <Link to="/">Continue Shopping ...</Link>
      </div>
    );
  }
  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.thumbnail} alt={item.title} width={120} />
          <div className="cart-item-details">
            <h3>{item.title}</h3>
            <p>Rs. {item.price}</p>

            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <h2>Cart Summary</h2>

        <div className="summary-row">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="summary-row">
          <span>Total Price</span>
          <span>₹ {totalPrice.toFixed(2)}</span>
        </div>
        <button onClick={clearCart}>Clear Cart</button>
        <button style={{backgroundColor:"orange"}}>Pay Now</button>
      </div>
    </div>
  );
}

export default Cart;
