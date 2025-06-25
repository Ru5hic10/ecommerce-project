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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛍️ Product List</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
              <strong>{product.name}</strong> <br />
              ₹{product.price} <br />
              <em>{product.description}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
