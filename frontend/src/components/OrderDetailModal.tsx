import { ORDER_STATUS_LABELS, OrderStatusFilter } from "../types/admin.types";

export interface OrderDetailModalItem {
  title: string;
  price: number;
  quantity: number;
}

export interface OrderDetailModalOrder {
  _id: string | number;
  customerEmail?: string;
  storeName?: string;
  items: OrderDetailModalItem[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt?: string;
  deliveryAddress?: string;
}

interface Props {
  order: OrderDetailModalOrder | null;
  onClose: () => void;
}

// A plain, self-controlled modal (no reliance on Bootstrap's JS modal
// instance/data-attributes) so it can be shown/hidden purely from React
// state — simpler and more predictable inside a component tree than
// wiring up bootstrap.Modal manually.
export default function OrderDetailModal({ order, onClose }: Props) {
  if (!order) return null;

  const statusLabel =
    ORDER_STATUS_LABELS[order.orderStatus as OrderStatusFilter] ?? order.orderStatus.replace(/_/g, " ");

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "—";

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ background: "rgba(15, 23, 42, 0.55)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold mb-0">Order #{String(order._id).slice(-6).toUpperCase()}</h5>
              <p className="text-muted small mb-0">{orderDate}</p>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="text-muted small text-uppercase mb-1">Customer email</div>
                <div className="fw-semibold">{order.customerEmail ?? "Unknown"}</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted small text-uppercase mb-1">Store</div>
                <div className="fw-semibold">{order.storeName ?? "Unknown store"}</div>
              </div>
              <div className="col-sm-4">
                <div className="text-muted small text-uppercase mb-1">Status</div>
                <span className="badge rounded-pill bg-primary-subtle text-primary text-capitalize">{statusLabel}</span>
              </div>
              <div className="col-sm-4">
                <div className="text-muted small text-uppercase mb-1">Payment method</div>
                <div className="fw-semibold">{order.paymentMethod}</div>
              </div>
              <div className="col-sm-4">
                <div className="text-muted small text-uppercase mb-1">Total</div>
                <div className="fw-bold">${order.totalAmount.toFixed(2)}</div>
              </div>
              {order.deliveryAddress && (
                <div className="col-12">
                  <div className="text-muted small text-uppercase mb-1">Delivery address</div>
                  <div>{order.deliveryAddress}</div>
                </div>
              )}
            </div>

            <h6 className="fw-bold mb-2">Items</h6>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr className="text-uppercase text-muted small">
                    <th>Product</th>
                    <th className="text-end">Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.title}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">${item.price.toFixed(2)}</td>
                      <td className="text-end fw-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold border-0">Total</td>
                    <td className="text-end fw-bold border-0">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
