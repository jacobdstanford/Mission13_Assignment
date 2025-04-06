// CartPage.tsx
import React from 'react';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (bookId: number) => {
    removeFromCart(bookId);
  };

  const handleContinueShopping = () => {
    // If you want to remember the exact page, store it in context or localStorage.
    // For simplicity, let's just navigate back to the homepage.
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <h2>Your Cart is Empty</h2>
        <button className="btn btn-primary" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quantity</th>
            <th>Price Each</th>
            <th>Subtotal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cartItems.map((i) => (
            <tr key={i.bookId}>
              <td>{i.title}</td>
              <td>{i.quantity}</td>
              <td>${i.price.toFixed(2)}</td>
              <td>${(i.price * i.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemove(i.bookId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5>Total: ${total.toFixed(2)}</h5>

      <button className="btn btn-secondary me-2" onClick={handleContinueShopping}>
        Continue Shopping
      </button>

      <button className="btn btn-outline-danger" onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
};

export default CartPage;
