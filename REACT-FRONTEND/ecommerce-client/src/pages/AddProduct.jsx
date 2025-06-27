import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    if (editProduct) {
      setProduct(editProduct);
      setIsEditing(true);
    }
  }, [editProduct]);

  const handleChange = (e) => {
    setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => {
      setToast({ show: false, message: "", variant: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!product.name || !product.description || !product.price || !product.imageUrl) {
      return showToast("All fields are required", "danger");
    }

    if (isNaN(product.price) || Number(product.price) <= 0) {
      return showToast("Price must be a positive number", "danger");
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 🕐 Simulated delay

      if (isEditing) {
        await API.put(`/products/${product.id}`, product);
        showToast("✅ Product updated successfully!", "success");
      } else {
        await API.post("/products", product);
        showToast("✅ Product added successfully!", "success");
        setProduct({ name: "", description: "", price: "", imageUrl: "" });
      }

      setTimeout(() => navigate("/products"), 1000); // Smooth redirect
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to submit. Unauthorized or error occurred.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              name="description"
              value={product.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update Product" : "Add Product"
            )}
          </button>
        </form>

        {/* Toast Notification */}
        <ToastContainer position="top-end" className="position-fixed p-3">
          <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};

export default AddProductPage;
