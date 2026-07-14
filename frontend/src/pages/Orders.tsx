import { useEffect, useState } from "react";
import CustomerShell from "../components/layout/CustomerShell";
import StatusPill from "../components/layout/StatusPill";
import api from "../api/axiosInstance";
import { Order } from "../types";
import { productPlaceholder } from "../utils/image";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Order[]>("/orders/mine").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <CustomerShell>
      <h1 className="fs-3 fw-bold text-navy-900">My orders</h1>
      <p className="text-slate-500">Track and review everything you've ordered.</p>

      <div className="mt-4 d-flex flex-column gap-3">
        {loading && <p className="small text-slate-400">Loading&hellip;</p>}
        {!loading && orders.length === 0 && (
          <p className="small text-slate-400">You haven't placed any orders yet.</p>
        )}
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl2 bg-white p-3 shadow-card">
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <p className="fw-semibold text-brand-600 mb-1">#{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>
                  {new Date(o.createdAt).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-end">
                <p className="fw-bold text-navy-900 mb-1">${o.totalAmount.toFixed(2)}</p>
                <StatusPill status={o.orderStatus} />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {o.items.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 rounded-3 bg-surface px-2 py-1">
                  <div className="overflow-hidden rounded-2 flex-shrink-0" style={{ width: "2rem", height: "2rem" }}>
                    <img
                      src={item.imageUrl || productPlaceholder(item.title, 100, 100)}
                      alt={item.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span className="small text-slate-600">{item.title} &times; {item.quantity}</span>
                </div>
              ))}
            </div>

            {o.deliveryAddress && (
              <p className="mt-2 mb-0 d-flex align-items-center gap-1 text-slate-400" style={{ fontSize: ".75rem" }}>
                <i className="ti ti-map-pin" aria-hidden="true" /> {o.deliveryAddress}
              </p>
            )}
          </div>
        ))}
      </div>
    </CustomerShell>
  );
}
