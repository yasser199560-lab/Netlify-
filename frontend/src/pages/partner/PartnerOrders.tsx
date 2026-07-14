import { useEffect, useState } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import StatCard from "../../components/layout/StatCard";
import StatusPill from "../../components/layout/StatusPill";
import api from "../../api/axiosInstance";
import { Order, PartnerProfile } from "../../types";
import { partnerNavItems } from "./partnerNav";

type Filter = "all" | "pending" | "completed";

// Each entry is the status the button MOVES the order TO, plus how the
// action reads to the partner. The customer sees the result through
// StatusPill on their own Orders page (e.g. "completed" reads "Delivered").
const nextActionByStatus: Record<string, { to: Order["orderStatus"]; label: string; icon: string; className: string } | null> = {
  pending: { to: "accepted", label: "Accept order", icon: "ti-check", className: "bg-brand-50 text-brand-700 hover-bg-brand-100" },
  accepted: { to: "out_for_delivery", label: "Send to delivery", icon: "ti-truck-delivery", className: "bg-blue-50 text-blue-700 hover-bg-blue-100" },
  out_for_delivery: { to: "completed", label: "Mark delivered", icon: "ti-circle-check", className: "bg-teal-50 text-teal-700 hover-bg-teal-100" },
  completed: null,
  cancelled: null,
};

export default function PartnerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = () => {
    api.get<Order[]>("/orders/partner-mine").then((res) => setOrders(res.data)).catch(() => setOrders([]));
  };

  useEffect(() => {
    api.get<PartnerProfile>("/partners/me").then((res) => setProfile(res.data)).catch(() => {});
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (filter === "pending") return o.orderStatus === "pending" || o.orderStatus === "accepted" || o.orderStatus === "out_for_delivery";
    if (filter === "completed") return o.orderStatus === "completed";
    return true;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;
  const completedCount = orders.filter((o) => o.orderStatus === "completed").length;

  const handleAdvance = async (order: Order) => {
    const next = nextActionByStatus[order.orderStatus];
    if (!next) return;
    setError("");
    setBusyId(order._id);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: next.to });
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't update the order");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (order: Order) => {
    setError("");
    setBusyId(order._id);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: "cancelled" });
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't cancel the order");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`Remove order #${order._id.slice(-6).toUpperCase()} from your list? This can't be undone.`)) return;
    setError("");
    setBusyId(order._id);
    try {
      await api.delete(`/orders/${order._id}`);
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't delete the order");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell panelLabel="Partner panel" subLabel={profile?.storeName} items={partnerNavItems}>
      <div className="mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h1 className="fs-3 fw-bold text-navy-900">Orders</h1>
          <p className="text-slate-500 mb-0">{profile?.storeName ?? "Your store"}</p>
        </div>
        <div className="d-flex gap-2">
          <Tab icon="ti-list" active={filter === "all"} onClick={() => setFilter("all")}>All ({orders.length})</Tab>
          <Tab icon="ti-bell" active={filter === "pending"} onClick={() => setFilter("pending")}>New ({pendingCount})</Tab>
          <Tab icon="ti-circle-check" active={filter === "completed"} onClick={() => setFilter("completed")}>Completed</Tab>
        </div>
      </div>

      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
        <div className="col"><StatCard label="Total orders" value={String(orders.length)} /></div>
        <div className="col"><StatCard label="Total revenue" value={`$${totalRevenue.toFixed(0)}`} /></div>
        <div className="col"><StatCard label="Pending" value={String(pendingCount)} accent="text-amber-500" /></div>
        <div className="col"><StatCard label="Delivered" value={String(completedCount)} accent="text-teal-500" /></div>
      </div>

      {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}

      <div className="rounded-xl2 bg-white p-4 shadow-card">
        <div className="table-responsive">
          <table className="table align-middle small mb-0">
            <thead>
              <tr className="small-caps text-slate-400" style={{ fontSize: ".75rem" }}>
                <th className="border-0">Order ID</th>
                <th className="border-0">Customer</th>
                <th className="border-0">Items</th>
                <th className="border-0">Total</th>
                <th className="border-0">Payment</th>
                <th className="border-0">Status</th>
                <th className="border-0">Time</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-slate-400 py-3">No orders yet.</td></tr>
              )}
              {filtered.map((o) => {
                const next = nextActionByStatus[o.orderStatus];
                const isBusy = busyId === o._id;
                const canCancel = o.orderStatus !== "completed" && o.orderStatus !== "cancelled";
                return (
                  <tr key={o._id} className="border-top">
                    <td className="fw-semibold text-brand-600">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="fw-semibold text-navy-900">
                      {typeof o.customerId === "object" && o.customerId?.name ? o.customerId.name : "Customer"}
                    </td>
                    <td className="text-slate-600">
                      {o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}
                    </td>
                    <td className="fw-semibold text-navy-900">${o.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className="badge rounded-pill bg-brand-50 text-brand-700 fw-semibold">
                        {o.paymentMethod === "COD" ? "Cash" : "Whish"}
                      </span>
                    </td>
                    <td><StatusPill status={o.orderStatus} /></td>
                    <td className="text-slate-400">{new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {next && (
                          <button
                            disabled={isBusy}
                            onClick={() => handleAdvance(o)}
                            className={`btn d-flex align-items-center gap-1 rounded-3 border-0 fw-semibold py-1 px-2 ${next.className}`}
                            style={{ fontSize: ".75rem" }}
                          >
                            <i className={`ti ${next.icon}`} aria-hidden="true" />
                            {next.label}
                          </button>
                        )}
                        {canCancel && (
                          <button
                            disabled={isBusy}
                            onClick={() => handleCancel(o)}
                            className="btn d-flex align-items-center gap-1 rounded-3 border-0 bg-amber-50 text-amber-700 fw-semibold hover-bg-amber-100 py-1 px-2"
                            style={{ fontSize: ".75rem" }}
                          >
                            <i className="ti ti-x" aria-hidden="true" />
                            Cancel
                          </button>
                        )}
                        <button
                          disabled={isBusy}
                          onClick={() => handleDelete(o)}
                          className="btn d-flex align-items-center gap-1 rounded-3 border-0 bg-red-50 text-red-600 fw-semibold hover-bg-red-100 py-1 px-2"
                          style={{ fontSize: ".75rem" }}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

function Tab({ active, icon, onClick, children }: { active: boolean; icon: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`btn d-flex align-items-center gap-1 rounded-3 fw-semibold ${
        active ? "bg-brand-50 text-brand-600 border-0" : "border border-slate-200 bg-white text-slate-500 hover-bg-slate-50"
      }`}
    >
      <i className={`ti ${icon}`} aria-hidden="true" />
      {children}
    </button>
  );
}
