import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "danger" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, variant = "danger") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // spinner visibility
      await API.post("/auth/register", form);
      showToast("✅ Registered successfully. Please login.", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast("❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <ToastContainer position="top-center" className="mt-3">
        <Toast bg={toast.variant} show={toast.show}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="mb-4 text-center">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span>
                <Spinner animation="border" size="sm" /> Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
