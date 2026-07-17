import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Shell.css";

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

interface Props {
  panelLabel: string;
  subLabel?: string;
  items: NavItem[];
  children: ReactNode;
}

// Shared dark sidebar shell used by both the admin panel and the
// partner panel — same structure as the ERD's shared `users` table,
// just two different navigation sets for two different roles.
//
// Below `md` the sidebar becomes an off-canvas drawer opened from a
// small mobile top bar, instead of a fixed-width column that used to
// permanently eat ~256px of a phone's viewport next to the content.
export default function DashboardShell({ panelLabel, subLabel, items, children }: Props) {
  const { user, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <div className="d-flex min-vh-100 shell-root">
      {navOpen && <div className="shell-overlay d-md-none" onClick={closeNav} aria-hidden="true" />}

      <aside className={`shell-sidebar d-flex flex-shrink-0 flex-column bg-navy-900 px-3 py-4 text-slate-300 ${navOpen ? "shell-sidebar-open" : ""}`} style={{ width: "16rem" }}>
        <div className="d-flex align-items-center gap-2 px-2 mb-1">
          <span className="d-flex align-items-center justify-content-center rounded-3 bg-brand-600 text-white" style={{ width: "2rem", height: "2rem" }}>
            <i className="ti ti-truck-delivery" aria-hidden="true" />
          </span>
          <span className="fw-bold text-white">Talabaty</span>
        </div>
        <p className="px-2 mb-4 small-caps text-slate-500" style={{ fontSize: ".75rem" }}>{panelLabel}</p>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={closeNav}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-decoration-none small fw-medium ${
                  isActive ? "bg-brand-600 text-white" : "text-slate-300 hover-bg-navy-700"
                }`
              }
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto d-flex flex-column gap-3 border-top border-navy-700 pt-3">
          {subLabel && (
            <div className="px-2">
              <p className="fw-semibold text-white mb-0">{subLabel}</p>
              <p className="text-slate-500 mb-0 small">{user?.name}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="btn w-100 d-flex align-items-center gap-2 rounded-3 bg-navy-800 px-3 py-2 text-start small fw-medium text-slate-300 hover-bg-navy-700 border-0"
          >
            <i className="ti ti-logout" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-grow-1 shell-content d-flex flex-column">
        <header className="d-flex d-md-none align-items-center gap-2 border-bottom bg-white px-3 py-2">
          <button
            className="btn d-flex align-items-center justify-content-center rounded-3 text-black border-0"
            style={{ width: "2.25rem", height: "2.25rem" }}
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <i className="ti ti-menu-2" aria-hidden="true" />
          </button>
          <span className="fw-semibold text-navy-900 small">{panelLabel}</span>
        </header>

        <main className="flex-grow-1 bg-surface px-3 px-md-5 py-4">{children}</main>
      </div>
    </div>
  );
}
