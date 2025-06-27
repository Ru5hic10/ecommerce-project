import { useEffect, useState } from "react";
import API from "../api/axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        alert("❌ You are not authorized to view this page.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">You have no orders yet.</div>
      ) : (
        <div className="row row-cols-1 g-4">
          {orders.map((order) => (
            <div className="col" key={order.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order.id}</h5>
                  <p className="card-text mb-1"><strong>Status:</strong> {order.status}</p>
                  <p className="card-text mb-1"><strong>Total:</strong> ₹{order.amount}</p>
                  <p className="card-text"><strong>Order Time:</strong> {order.orderTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
