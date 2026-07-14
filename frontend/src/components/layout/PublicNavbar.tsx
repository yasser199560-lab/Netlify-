import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logoo.png";

export default function PublicNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="d-flex align-items-center justify-content-between px-4 px-md-5 py-3 bg-white border-bottom">
      <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
        <img src={logoImg} alt="Talabaty" style={{ height: "2.25rem", width: "auto" }} />
        <span className="fs-5 fw-bold text-navy-900">Talabaty</span>
      </Link>

      <nav className="d-none d-md-flex align-items-center gap-4 small text-slate-500">
        <Link to="/" className="text-slate-500 hover-text-navy-900 text-decoration-none">Home</Link>
        <Link to="/products" className="text-slate-500 hover-text-navy-900 text-decoration-none">Browse stores</Link>
        <a href="#how-it-works" className="text-slate-500 hover-text-navy-900 text-decoration-none">How it works</a>
        <a href="#contact" className="text-slate-500 hover-text-navy-900 text-decoration-none">Contact</a>
      </nav>

      {user ? (
        <div className="d-flex align-items-center gap-3">
          {user.role === "customer" && (
            <Link to="/dashboard" className="small fw-medium text-slate-500 hover-text-navy-900 text-decoration-none">
              Dashboard
            </Link>
          )}
          <span className="small text-slate-500">
            {user.name} <span className="text-slate-400" style={{ fontSize: ".75rem" }}>({user.role})</span>
          </span>
          <button
            onClick={logout}
            className="btn btn-outline-secondary btn-sm rounded-3 fw-medium"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/login"
            className="btn btn-outline-brand btn-sm rounded-3 fw-semibold"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="btn btn-brand btn-sm rounded-3 fw-semibold"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
