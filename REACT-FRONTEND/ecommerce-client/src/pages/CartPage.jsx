// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import CheckoutButton from "./CheckOutButton"; // Adjust the import path as necessary

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div>
          {cart.map((product, index) => (
            <div key={index} className="border-b py-2">
              <h2 className="font-semibold">{product.name}</h2>
              <p>₹{product.price}</p>
            </div>
          ))}
          <h3 className="mt-4 font-bold">Total: ₹{total}</h3>
          
          <CheckoutButton cartItems={cart} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
