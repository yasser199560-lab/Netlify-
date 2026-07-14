import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import api from "../../api/axiosInstance";
import { useCart } from "../../context/CartContext";
import { productPlaceholder } from "../../utils/image";
import { Address, PaymentMethod } from "../../types";

// PaymentMethod.type ("Cash" | "Whish") is the customer-facing label saved
// on the Payment Methods page; Order.paymentMethod ("COD" | "Whish Money")
// is the value the orders API expects. This keeps that mapping in one place.
function toOrderPaymentMethod(type: PaymentMethod["type"]): "COD" | "Whish Money" {
  return type === "Whish" ? "Whish Money" : "COD";
}

function methodIcon(type: string): string {
  return type === "Whish" ? "ti-wallet" : "ti-truck-delivery";
}

export default function CartCheckout() {
  const navigate = useNavigate();
  const { cart, loading, setQuantity, removeFromCart, refresh } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api.get<Address[]>("/addresses").then((res) => {
      setAddresses(res.data);
      const defaultAddress = res.data.find((a) => a.isDefault) ?? res.data[0];
      if (defaultAddress) setSelectedAddressId(defaultAddress._id);
    });
    api.get<PaymentMethod[]>("/payment-methods").then((res) => {
      setMethods(res.data);
      const defaultMethod = res.data.find((m) => m.isDefault) ?? res.data[0];
      if (defaultMethod) setSelectedMethodId(defaultMethod._id);
    });
  }, []);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0);

  const placeOrder = async () => {
    const method = methods.find((m) => m._id === selectedMethodId);
    if (!method) return;

    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        paymentMethod: toOrderPaymentMethod(method.type),
        addressId: selectedAddressId || undefined,
      });
      await refresh();
      navigate(`/order-confirmation/${data._id}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-vh-100 bg-surface">
      <PublicNavbar />

      <div className="container py-5" style={{ maxWidth: "64rem" }}>
        <div className="row g-4">
          <div className="col-md-8">
            <div className="rounded-xl2 bg-white p-4 shadow-card">
              <h2 className="fs-5 fw-bold text-navy-900">Your cart</h2>
              <p className="mb-3 small text-slate-500">{items.length} item{items.length !== 1 && "s"}</p>

              {!loading && items.length === 0 && (
                <p className="py-4 text-center small text-slate-400">Your cart is empty.</p>
              )}

              <div>
                {items.map((item, idx) => (
                  <div key={item.productId._id} className={`d-flex align-items-center justify-content-between py-3 ${idx > 0 ? "border-top" : ""}`}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="overflow-hidden rounded-3 flex-shrink-0" style={{ width: "3.5rem", height: "3.5rem" }}>
                        <img
                          src={item.productId.imageUrl || productPlaceholder(item.productId.title, 200, 200)}
                          alt={item.productId.title}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <p className="fw-semibold text-navy-900 mb-1">{item.productId.title}</p>
                        {item.productId.description && (
                          <p className="small text-slate-500 mb-1">{item.productId.description}</p>
                        )}
                        <div className="d-inline-flex align-items-center gap-2 rounded-3 bg-brand-50" style={{ padding: "0 .25rem" }}>
                          <button
                            onClick={() => setQuantity(item.productId._id, item.quantity - 1)}
                            className="btn d-flex align-items-center justify-content-center rounded-2 border-0 bg-brand-600 text-white fw-bold p-0"
                            style={{ width: "1.75rem", height: "1.75rem", fontSize: "1rem", lineHeight: 1 }}
                            aria-label="Decrease quantity"
                          >
                            &minus;
                          </button>
                          <span className="fw-semibold text-brand-700 small" style={{ minWidth: "1rem", textAlign: "center" }}>{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(item.productId._id, item.quantity + 1)}
                            className="btn d-flex align-items-center justify-content-center rounded-2 border-0 bg-brand-600 text-white fw-bold p-0"
                            style={{ width: "1.75rem", height: "1.75rem", fontSize: "1rem", lineHeight: 1 }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold text-navy-900 mb-1">${(item.productId.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        className="btn btn-link p-0 fw-semibold text-red-500"
                        style={{ fontSize: ".75rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="mt-3 d-flex justify-content-between border-top pt-3 small fw-semibold text-navy-900">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="rounded-xl2 bg-white p-4 shadow-card">
              <h2 className="mb-3 fs-5 fw-bold text-navy-900">Order summary</h2>
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex justify-content-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="d-flex justify-content-between text-slate-500"><span>Delivery fee</span><span className="text-teal-500">Free</span></div>
              </div>
              <div className="mt-3 d-flex justify-content-between border-top pt-3 fw-bold text-navy-900">
                <span>Total</span><span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="mb-2 d-flex align-items-center justify-content-between mt-4">
                <span className="small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Payment method</span>
                <Link to="/payment-methods" className="text-brand-600 fw-medium text-decoration-none" style={{ fontSize: ".75rem" }}>
                  + Add new
                </Link>
              </div>

              {methods.length === 0 && (
                <p className="rounded-3 bg-surface px-3 py-2 small text-slate-500 mb-0">
                  No saved payment methods yet. <Link to="/payment-methods" className="text-brand-600 fw-semibold text-decoration-none">Add one</Link> before checking out.
                </p>
              )}

              <div className="row row-cols-2 g-2">
                {methods.map((m) => (
                  <div className="col" key={m._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedMethodId(m._id)}
                      className={`btn w-100 h-100 rounded-3 border border-2 p-2 text-start fw-semibold ${
                        selectedMethodId === m._id ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"
                      }`}
                      style={{ fontSize: ".75rem" }}
                    >
                      <i className={`ti ${methodIcon(m.type)} d-block mb-1 fs-5`} aria-hidden="true" />
                      {m.label}
                      <span className="d-block fw-normal text-slate-400">
                        {m.type}{m.phoneNumber ? ` \u2014 ${m.phoneNumber}` : ""}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <span className="small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Delivery address</span>
                  <Link to="/addresses" className="text-brand-600 fw-medium text-decoration-none" style={{ fontSize: ".75rem" }}>
                    + Add new
                  </Link>
                </div>

                {addresses.length === 0 && (
                  <p className="rounded-3 bg-surface px-3 py-2 small text-slate-500 mb-0">
                    No saved addresses yet. <Link to="/addresses" className="text-brand-600 fw-semibold text-decoration-none">Add one</Link> before checking out.
                  </p>
                )}

                <div className="d-flex flex-column gap-2">
                  {addresses.map((a) => (
                    <label
                      key={a._id}
                      className={`d-flex align-items-start gap-2 rounded-3 border border-2 p-2 small ${
                        selectedAddressId === a._id ? "border-brand-600 bg-brand-50" : "border-slate-200"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        className="form-check-input mt-1"
                        checked={selectedAddressId === a._id}
                        onChange={() => setSelectedAddressId(a._id)}
                      />
                      <span>
                        <span className="fw-semibold text-navy-900">{a.label}</span>
                        {a.isDefault && <span className="ms-1 text-teal-600" style={{ fontSize: ".7rem" }}>(default)</span>}
                        <span className="d-block text-slate-500">{a.fullAddress}{a.town ? `, ${a.town}` : ""}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={items.length === 0 || placing || !selectedAddressId || !selectedMethodId}
                className="btn btn-brand w-100 mt-4 py-2 fw-semibold"
              >
                {placing ? "Placing order..." : "Place order \u2192"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
