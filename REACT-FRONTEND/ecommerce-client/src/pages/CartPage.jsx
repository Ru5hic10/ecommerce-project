import React, { useEffect, useState } from "react";
import CheckoutButton from "./CheckOutButton";
import { Modal, Button } from "react-bootstrap";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = () => {
    if (selectedIndex !== null) {
      const updatedCart = cart.filter((_, index) => index !== selectedIndex);
      updateCart(updatedCart);
      setShowModal(false);
      setSelectedIndex(null);
    }
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    if (!updatedCart[index].quantity) updatedCart[index].quantity = 1;
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity < 1) updatedCart[index].quantity = 1;
    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );

  return (
    <div className="container d-flex justify-content-center align-items-start mt-4" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "900px" }}>
        <h2 className="mb-4">🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <div className="card p-3 shadow-sm">
            {cart.map((product, index) => (
              <div
                key={index}
                className="row align-items-center border-bottom py-3"
              >
                {/* Left: Image */}
                <div className="col-md-3 text-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "100px", objectFit: "contain" }}
                  />
                </div>

                {/* Right: Product details */}
                <div className="col-md-9">
                  <h5>{product.name}</h5>
                  <p className="text-muted mb-1">₹{product.price} x {product.quantity || 1}</p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </button>
                    <span>{product.quantity || 1}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIndex(index);
                        setShowModal(true);
                      }}
                      className="btn btn-danger btn-sm ms-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}


            <div className="mt-3 text-end">
              <h5>Total: ₹{total}</h5>
              <CheckoutButton cartItems={cart} />
            </div>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Remove Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to remove this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemove}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CartPage;
