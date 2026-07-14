import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import { Product, PartnerProfile } from "../../types";
import { useCart } from "../../context/CartContext";
import { productPlaceholder, storePlaceholder } from "../../utils/image";
import QuantityStepper from "../../components/QuantityStepper";
import logoImg from "../../assets/logoo.png";

export default function StoreDetail() {
  const { partnerId } = useParams();
  const { cart } = useCart();
  const [store, setStore] = useState<PartnerProfile | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!partnerId) return;
    api.get<PartnerProfile>(`/partners/${partnerId}`).then((res) => setStore(res.data)).catch(() => setStore(null));
    api.get<Product[]>("/products", { params: { partnerId } }).then((res) => setItems(res.data));
  }, [partnerId]);

  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const visibleItems = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-surface">
      <header className="d-flex align-items-center gap-3 border-bottom bg-white px-4 px-md-5 py-2">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0" aria-label="Talabaty home">
          <img src={logoImg} alt="Talabaty" style={{ height: "2.25rem", width: "auto" }} />
          <span className="fw-bold text-navy-900">Talabaty</span>
        </Link>
        <Link
          to="/dashboard"
          className="btn rounded-3 border border-slate-200 text-slate-600 fw-semibold hover-bg-slate-50 d-flex align-items-center gap-2 flex-shrink-0"
        >
          <i className="ti ti-arrow-left" aria-hidden="true" />
          Back to dashboard
        </Link>
        <div className="position-relative flex-grow-1" style={{ maxWidth: "36rem" }}>
          <i className="ti ti-search position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
          <input
            className="form-control bg-surface ps-5"
            placeholder={`Search in ${store?.storeName ?? "this store"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link to="/cart" className="btn rounded-3 bg-brand-50 text-brand-700 fw-semibold hover-bg-brand-100 d-flex align-items-center gap-2 flex-shrink-0">
          <i className="ti ti-shopping-cart" aria-hidden="true" />
          Cart ({cartCount})
        </Link>
      </header>

      <div className="position-relative overflow-hidden text-white" style={{ height: "9rem" }}>
        <img
          src={store?.coverImageUrl || storePlaceholder(store?.category, 1200, 300)}
          alt=""
          className="position-absolute w-100 h-100 top-0 start-0"
          style={{ objectFit: "cover" }}
        />
        <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: "rgba(13, 24, 48, .55)" }} />
        <div className="position-relative d-flex align-items-center gap-3 h-100 px-4 px-md-5">
          <div className="overflow-hidden rounded-3 bg-white flex-shrink-0" style={{ width: "4rem", height: "4rem" }}>
            <img
              src={store?.coverImageUrl || storePlaceholder(store?.category, 200, 200)}
              alt=""
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h1 className="fs-4 fw-bold mb-1">{store?.storeName ?? "Store"}</h1>
            <p className="d-flex flex-wrap align-items-center gap-2 small mb-0" style={{ color: "rgba(255,255,255,.85)" }}>
              <span>{store?.category} &middot; {store?.address.split(",")[0]}</span>
              <span className="d-flex align-items-center gap-1">
                <i className="ti ti-star-filled text-amber-300" aria-hidden="true" /> {store?.rating ?? "4.5"}
              </span>
              <span>&middot; {store?.deliveryTime}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 px-md-5 py-4">
        <h2 className="mb-3 fs-5 fw-bold text-navy-900">Menu</h2>
        <div className="row row-cols-2 row-cols-md-4 g-3">
          {visibleItems.length === 0 && <p className="small text-slate-400">No items match your search.</p>}
          {visibleItems.map((item) => (
            <div className="col" key={item._id}>
              <div className="overflow-hidden rounded-xl2 bg-white shadow-card h-100">
                <div style={{ height: "6rem" }}>
                  <img
                    src={item.imageUrl || productPlaceholder(item.title)}
                    alt={item.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-3">
                  <p className="fw-bold text-navy-900 mb-1">{item.title}</p>
                  {item.description && <p className="small text-slate-500 mb-0">{item.description}</p>}
                  <div className="mt-2 d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-brand-600">${item.price.toFixed(2)}</span>
                    <QuantityStepper productId={item._id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
