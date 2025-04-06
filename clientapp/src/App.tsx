import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookList from './BookList';
import CartPage from './CartPage';
import { CartProvider } from './CartContext';
import NavBar from './Navbar';
import AdminBooks from './AdminBooks';

function App() {
  return (
    <CartProvider>
      <Router>
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminbooks" element={<AdminBooks />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
