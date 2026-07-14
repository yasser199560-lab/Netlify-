import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import logoImg from "../../assets/logoo.png";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "ti-home" },
  { label: "Cart", to: "/cart", icon: "ti-shopping-cart" },
  { label: "Orders", to: "/orders", icon: "ti-package" },
  { label: "Addresses", to: "/addresses", icon: "ti-map-pin" },
  { label: "Payment Methods", to: "/payment-methods", icon: "ti-credit-card" },
  { label: "Profile", to: "/profile", icon: "ti-user" },
  { label: "Settings", to: "/settings", icon: "ti-settings" },
  { label: "Help & Support", to: "/support", icon: "ti-help-circle" },
];

// Plain inline SVG, not the ti-* icon font — guarantees the cart icon is
// always visible even if the tabler-icons CDN font is blocked or slow.
function CartGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 8H6" />
    </svg>
  );
}

// Light sidebar shell for the customer-facing dashboard — distinct from
// the dark DashboardShell used by admin/partner panels, matching the
// customer dashboard mockup (white sidebar, light-blue active state).
export default function CustomerShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div className="d-flex min-vh-100 bg-surface">
      <aside className="d-flex flex-shrink-0 flex-column border-end bg-white px-3 py-4" style={{ width: "15rem" }}>
        <Link to="/" className="d-flex align-items-center gap-2 px-2 mb-4 text-decoration-none" aria-label="Talabaty home">
          <img src={logoImg} alt="Talabaty" style={{ height: "2.25rem", width: "auto" }} />
          <span className="fw-bold text-navy-900">Talabaty</span>
        </Link>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-decoration-none small fw-medium ${
                  isActive ? "bg-brand-50 text-brand-600" : "text-slate-500 hover-bg-slate-50"
                }`
              }
            >
              {item.to === "/cart" ? <CartGlyph /> : <i className={`ti ${item.icon}`} aria-hidden="true" />}
              {item.label}
              {item.to === "/cart" && cartCount > 0 && (
                <span className="badge rounded-pill bg-brand-600 text-white ms-auto" style={{ fontSize: ".7rem" }}>
                  {cartCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="btn d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-start small fw-medium text-slate-500 hover-bg-slate-50 border-0"
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Logout
        </button>
      </aside>

      <div className="flex-grow-1">
        <header className="d-flex align-items-center justify-content-end gap-3 border-bottom bg-white px-4 py-2">
          <button className="btn d-flex align-items-center justify-content-center rounded-3 text-slate-400 border-0" style={{ width: "2.25rem", height: "2.25rem" }} aria-label="Search">
            <i className="ti ti-search" aria-hidden="true" />
          </button>
          <NavLink
            to="/cart"
            className="btn position-relative d-flex align-items-center justify-content-center rounded-3 text-slate-400 border-0"
            style={{ width: "2.25rem", height: "2.25rem" }}
            aria-label="Cart"
          >
            <CartGlyph size={20} />
            {cartCount > 0 && (
              <span
                className="badge rounded-pill bg-brand-600 text-white position-absolute"
                style={{ fontSize: ".6rem", top: "0", right: "0" }}
              >
                {cartCount}
              </span>
            )}
          </NavLink>
          <div className="d-flex align-items-center gap-2">
            <span className="d-flex align-items-center justify-content-center rounded-circle bg-brand-100 fw-bold text-brand-600" style={{ width: "2rem", height: "2rem" }}>
              {user?.name?.[0] ?? "U"}
            </span>
            <div className="small lh-sm">
              <p className="fw-semibold text-navy-900 mb-0">{user?.name}</p>
              <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>Customer</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
