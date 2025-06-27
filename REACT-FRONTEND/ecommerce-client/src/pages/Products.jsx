import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });
  const [editLoading, setEditLoading] = useState(false);


  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setToast({ show: true, message: "Failed to load products", bg: "danger" });
      });
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    setToast({ show: true, message: "✅ Product added to cart!", bg: "success" });
  };

  const handleDelete = async () => {
    try {
      setEditLoading(true); 
      setTimeout(() => {}, 1000);
      await API.delete(`/products/${productToDelete.id}`);
      setToast({ show: true, message: "🗑️ Product removed", bg: "warning" });
      setProducts(products.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error("Delete failed", err);
      setToast({ show: true, message: "❌ Failed to delete", bg: "danger" });
    } finally {
      setShowConfirm(false);
      setEditLoading(false);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleEdit = (product) => {
  setEditLoading(true); // show loader
  setTimeout(() => {
    navigate("/admin/add-product", { state: { product } });
  }, 500);
};


  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🛍️ Product List</h2>

      {products.length === 0 ? (
        <p className="text-center">No products available</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success fw-bold">₹{product.price}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                  {user?.roles?.includes("ADMIN") && (
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => confirmDelete(product)}
                      >
                        Remove
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔐 Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="position-fixed p-3">
        <Toast
          bg={toast.bg}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={2500}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      {editLoading && (
        <div className="overlay-blur d-flex justify-content-center align-items-center">
          <div className="pulse-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {/* {editLoading && (
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center z-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )} */}


    </div>
  );
};

export default Products;
