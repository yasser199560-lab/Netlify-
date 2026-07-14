import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import api from "../../api/axiosInstance";
import { Order } from "../../types";
import { productPlaceholder } from "../../utils/image";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    api.get<Order>(`/orders/${orderId}`).then((res) => setOrder(res.data)).catch(() => setOrder(null));
  }, [orderId]);

  return (
    <div className="min-vh-100 bg-surface">
      <PublicNavbar />
      <div className="d-flex align-items-center justify-content-center px-3 py-5">
        <div className="w-100 rounded-xl2 bg-white p-4 p-md-5 shadow-card" style={{ maxWidth: "28rem" }}>
          <div className="text-center">
            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-teal-50" style={{ width: "3.5rem", height: "3.5rem" }}>
              <i className="ti ti-check fs-3 text-teal-500" aria-hidden="true" />
            </div>
            <h1 className="fs-4 fw-bold text-navy-900">Order placed!</h1>
            <p className="mt-1 small text-slate-500">
              Order #{orderId?.slice(-6).toUpperCase()}
            </p>
            <p className="mt-2 small text-slate-500">
              We're arranging delivery. Our team will call you shortly to confirm your order.
            </p>
          </div>

          {order && (
            <div className="mt-4 border-top pt-3">
              <div className="d-flex flex-column gap-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2">
                    <div className="overflow-hidden rounded-2 flex-shrink-0" style={{ width: "2rem", height: "2rem" }}>
                      <img
                        src={item.imageUrl || productPlaceholder(item.title, 100, 100)}
                        alt={item.title}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <span className="small text-slate-600 flex-grow-1">{item.title} &times; {item.quantity}</span>
                    <span className="small fw-semibold text-navy-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between border-top pt-2 mt-2 small fw-bold text-navy-900">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>

              <div className="d-flex flex-column gap-1 mt-3 small text-slate-500">
                <span className="d-flex align-items-center gap-1">
                  <i className="ti ti-wallet" aria-hidden="true" /> {order.paymentMethod === "COD" ? "Cash" : "Whish"}
                </span>
                {order.deliveryAddress && (
                  <span className="d-flex align-items-center gap-1">
                    <i className="ti ti-map-pin" aria-hidden="true" /> {order.deliveryAddress}
                  </span>
                )}
              </div>
            </div>
          )}

          <Link
            to="/orders"
            className="btn btn-brand w-100 mt-4 py-2 fw-semibold"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
