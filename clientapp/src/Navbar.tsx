// NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const NavBar: React.FC = () => {
  // ✔ Now we are inside CartProvider's tree, so useCart() works
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Online Bookstore</Link>
        <div>
          <Link className="btn btn-outline-secondary" to="/cart">
            View Cart
            <span className="badge bg-secondary ms-2">{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
