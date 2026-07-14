import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import StatCard from "../../components/layout/StatCard";
import StatusPill from "../../components/layout/StatusPill";
import api from "../../api/axiosInstance";
import { Order, PartnerProfile, Product } from "../../types";
import { partnerNavItems } from "./partnerNav";

// The partner's landing page after login — a quick-glance summary of the
// store (orders, revenue, items) plus shortcuts into the rest of the panel,
// instead of dropping straight into the "My items" form.
export default function PartnerDashboard() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<PartnerProfile>("/partners/me").then((res) => setProfile(res.data)).catch(() => {}),
      api.get<Order[]>("/orders/partner-mine").then((res) => setOrders(res.data)).catch(() => setOrders([])),
      api.get<Product[]>("/products/mine").then((res) => setProducts(res.data)).catch(() => setProducts([])),
    ]).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeCount = orders.filter((o) => ["pending", "accepted", "out_for_delivery"].includes(o.orderStatus)).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "completed").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardShell panelLabel="Partner panel" subLabel={profile?.storeName} items={partnerNavItems}>
      <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h1 className="fs-3 fw-bold text-navy-900">Dashboard</h1>
          <p className="text-slate-500 mb-0">
            Welcome back{profile?.storeName ? `, ${profile.storeName}` : ""} — here's how your store is doing.
          </p>
        </div>
        <Link to="/partner/items" className="btn btn-brand fw-semibold px-3 py-2 d-flex align-items-center gap-2">
          <i className="ti ti-plus" aria-hidden="true" />
          Add an item
        </Link>
      </div>

      {loading && <p className="small text-slate-400">Loading&hellip;</p>}

      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
        <div className="col"><StatCard label="Total orders" value={String(orders.length)} /></div>
        <div className="col"><StatCard label="Total revenue" value={`$${totalRevenue.toFixed(0)}`} /></div>
        <div className="col"><StatCard label="In progress" value={String(activeCount)} accent="text-amber-500" /></div>
        <div className="col"><StatCard label="Delivered" value={String(deliveredCount)} accent="text-teal-500" /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <div className="mb-3 d-flex align-items-center justify-content-between">
              <h2 className="fs-5 fw-bold text-navy-900 mb-0">Recent orders</h2>
              <Link to="/partner/orders" className="small fw-semibold text-brand-600 text-decoration-none">
                View all
              </Link>
            </div>

            {recentOrders.length === 0 && !loading && (
              <p className="small text-slate-400 mb-0">No orders yet — new orders will show up here.</p>
            )}

            <div className="d-flex flex-column gap-2">
              {recentOrders.map((o) => (
                <div key={o._id} className="d-flex align-items-center justify-content-between rounded-3 bg-surface px-3 py-2">
                  <div>
                    <p className="fw-semibold text-navy-900 mb-0">#{o._id.slice(-6).toUpperCase()}</p>
                    <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>
                      {typeof o.customerId === "object" && o.customerId?.name ? o.customerId.name : "Customer"} &middot;{" "}
                      {new Date(o.createdAt).toLocaleDateString([], { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-navy-900">${o.totalAmount.toFixed(2)}</span>
                    <StatusPill status={o.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Store snapshot</h2>
            <SnapshotRow icon="ti-building-store" label="Store name" value={profile?.storeName ?? "—"} />
            <SnapshotRow icon="ti-category" label="Category" value={profile?.category ?? "—"} />
            <SnapshotRow icon="ti-clock" label="Delivery time" value={profile?.deliveryTime ?? "—"} />
            <SnapshotRow icon="ti-box" label="Published items" value={String(products.length)} />

            <div className="d-flex flex-column gap-2 mt-3">
              <Link to="/partner/profile" className="btn rounded-3 border border-slate-200 bg-white text-navy-900 fw-semibold d-flex align-items-center gap-2 justify-content-center py-2">
                <i className="ti ti-building-store" aria-hidden="true" />
                Edit store profile
              </Link>
              <Link to="/partner/settings" className="btn rounded-3 border border-slate-200 bg-white text-navy-900 fw-semibold d-flex align-items-center gap-2 justify-content-center py-2">
                <i className="ti ti-settings" aria-hidden="true" />
                Account settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function SnapshotRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
      <span className="d-flex align-items-center gap-2 text-slate-500 small">
        <i className={`ti ${icon}`} aria-hidden="true" />
        {label}
      </span>
      <span className="fw-semibold text-navy-900 small text-capitalize">{value}</span>
    </div>
  );
}
