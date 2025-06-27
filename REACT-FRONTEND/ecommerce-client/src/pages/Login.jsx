import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, variant = "danger") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return showToast("Both fields are required");
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

      const response = await API.post("/auth/login", form);
      const { token, user } = response.data;

      if (token && user) {
        sessionStorage.setItem("jwtToken", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        showToast("✅ Logged in successfully!", "success");
        setTimeout(() => navigate("/products"), 1000); // Redirect with slight delay
      } else {
        showToast("Something went wrong!", "danger");
      }
    } catch (err) {
      showToast("Login failed. Check your email or password.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toast.variant} show={toast.show}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Login;
