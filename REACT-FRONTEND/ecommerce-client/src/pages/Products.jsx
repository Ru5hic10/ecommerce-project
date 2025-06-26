import { useEffect, useState } from "react";
import API from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products", err);
        alert("Unauthorized or failed to fetch products");
      });
  }, []);

    const handleAddToCart = (product) => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart!");
    };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛍️ Product List</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-xl p-4 shadow">
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm">{product.description}</p>
            <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
            <button
            onClick={() => handleAddToCart(product)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
            Add to Cart
            </button>

          </div>
        ))}
      </div>
    </div>
      )}
    </div>
  );
};

export default Products;
