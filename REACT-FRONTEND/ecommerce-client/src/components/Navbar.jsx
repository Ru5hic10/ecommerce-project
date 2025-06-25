import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#f5f5f5", marginBottom: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      {token ? (
        <>
          <Link to="/products" style={{ marginRight: "1rem" }}>Products</Link>
          <button onClick={handleLogout}>Logout</button>
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
