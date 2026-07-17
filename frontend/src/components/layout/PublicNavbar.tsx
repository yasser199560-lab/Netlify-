import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logoo.png";
import "../../styles/Shell.css";

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="px-3 px-md-5 py-3 bg-white border-bottom position-relative">
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
          <img src={logoImg} alt="Talabaty" style={{ height: "2.25rem", width: "auto" }} />
          <span className="fs-5 fw-bold text-navy-900 d-none d-sm-inline">Talabaty</span>
        </Link>

        <nav className="d-none d-md-flex align-items-center gap-4 small text-slate-500">
          <Link to="/" className="text-slate-500 hover-text-navy-900 text-decoration-none">Home</Link>
          <Link to="/products" className="text-slate-500 hover-text-navy-900 text-decoration-none">Browse stores</Link>
          <a href="#how-it-works" className="text-slate-500 hover-text-navy-900 text-decoration-none">How it works</a>
          <a href="#contact" className="text-slate-500 hover-text-navy-900 text-decoration-none">Contact</a>
        </nav>

        <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
          {user ? (
            <>
              {user.role === "customer" && (
                <Link to="/dashboard" className="d-none d-md-inline small fw-medium text-slate-500 hover-text-navy-900 text-decoration-none">
                  Dashboard
                </Link>
              )}
              <span className="d-none d-md-inline small text-slate-500 text-truncate" style={{ maxWidth: "10rem" }}>
                {user.name} <span className="text-slate-400" style={{ fontSize: ".75rem" }}>({user.role})</span>
              </span>
              <button
                onClick={logout}
                className="btn btn-outline-secondary btn-sm rounded-3 fw-medium d-none d-md-inline-block"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="d-none d-md-flex align-items-center gap-3">
              <Link to="/login" className="btn btn-outline-brand btn-sm rounded-3 fw-semibold">
                Log in
              </Link>
              <Link to="/register" className="btn btn-brand btn-sm rounded-3 fw-semibold">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="btn d-flex d-md-none align-items-center justify-content-center rounded-3 border-0 text-slate-600"
            style={{ width: "2.25rem", height: "2.25rem" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"} fs-4`}></i>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu — covers the links and account actions that
          are hidden above the `md` breakpoint so nothing is unreachable
          on a phone screen. */}
      {menuOpen && (
        <div className="d-md-none position-absolute start-0 end-0 top-100 bg-white border-bottom shadow-sm px-3 py-3 d-flex flex-column gap-2" style={{ zIndex: 1040 }}>
          <Link to="/" className="text-slate-600 text-decoration-none py-1" onClick={closeMenu}>Home</Link>
          <Link to="/products" className="text-slate-600 text-decoration-none py-1" onClick={closeMenu}>Browse stores</Link>
          <a href="#how-it-works" className="text-slate-600 text-decoration-none py-1" onClick={closeMenu}>How it works</a>
          <a href="#contact" className="text-slate-600 text-decoration-none py-1" onClick={closeMenu}>Contact</a>
          <hr className="my-1" />
          {user ? (
            <>
              {user.role === "customer" && (
                <Link to="/dashboard" className="text-slate-600 text-decoration-none py-1" onClick={closeMenu}>Dashboard</Link>
              )}
              <span className="small text-slate-500">{user.name} ({user.role})</span>
              <button onClick={() => { closeMenu(); logout(); }} className="btn btn-outline-secondary btn-sm rounded-3 fw-medium w-100">
                Log out
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-brand btn-sm rounded-3 fw-semibold flex-fill" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-brand btn-sm rounded-3 fw-semibold flex-fill" onClick={closeMenu}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
