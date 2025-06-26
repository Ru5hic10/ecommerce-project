import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#f5f5f5", marginBottom: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      {token ? (
        <>
          <Link to="/products" style={{ marginRight: "1rem" }}>Products</Link>
          <button onClick={handleLogout}>Logout</button>

          {user?.roles?.includes("ADMIN") && (
        <Link to="/admin/add-product" className="ml-4 text-yellow-400 mx-2">
          ➕ Add Product
        </Link>
        
      )}
      <Link to="/cart" className="text-white px-3">Cart</Link>
      <Link to="/orders">My Orders</Link>

        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
