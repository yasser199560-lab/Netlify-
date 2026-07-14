import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerShell from "../../components/layout/CustomerShell";
import QuantityStepper from "../../components/QuantityStepper";
import api from "../../api/axiosInstance";
import { productPlaceholder, storePlaceholder } from "../../utils/image";
import { useAuth } from "../../context/AuthContext";
import { PartnerProfile, Product, StoreCategory } from "../../types";

const categories: { label: string; value: StoreCategory; icon: string; tint: string }[] = [
  { label: "Restaurants", value: "Restaurant", icon: "ti-tools-kitchen-2", tint: "bg-brand-50 text-brand-600" },
  { label: "Supermarkets", value: "Supermarket", icon: "ti-shopping-cart", tint: "bg-teal-50 text-teal-600" },
  { label: "Pharmacies", value: "Pharmacy", icon: "ti-pill", tint: "bg-indigo-50 text-indigo-600" },
  { label: "Fashion", value: "Fashion", icon: "ti-shirt", tint: "bg-pink-50 text-pink-600" },
  { label: "Bakeries", value: "Bakery", icon: "ti-bread", tint: "bg-amber-50 text-amber-600" },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState<PartnerProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<PartnerProfile[]>("/partners").then((res) => setStores(res.data));
    api.get<Product[]>("/products").then((res) => setProducts(res.data.slice(0, 5)));
  }, []);

  return (
    <CustomerShell>
      <h1 className="fs-3 fw-bold text-navy-900">
        Hello, {user?.name?.split(" ")[0] ?? "there"}! <span aria-hidden="true">👋</span>
      </h1>
      <p className="text-slate-500">What would you like to order today?</p>

      <div className="mt-4 d-flex align-items-center justify-content-between overflow-hidden rounded-xl2 bg-brand-600 px-4 px-md-5 py-4 py-md-5 text-white">
        <div>
          <h2 className="fs-4 fw-bold">Fresh products, fast delivery</h2>
          <p className="mt-1 mb-0 text-brand-100" style={{ maxWidth: "24rem" }}>
            Groceries, restaurants, pharmacies and more, delivered to your door.
          </p>
          <Link
            to="/products"
            className="btn btn-light mt-3 fw-semibold text-brand-600"
          >
            Shop now
          </Link>
        </div>
        <div className="d-none d-md-block overflow-hidden rounded-4 flex-shrink-0" style={{ width: "10rem", height: "7rem" }}>
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Food%20delivery%20by%20scooter%20in%20France%20(1).jpg?width=320"
            alt=""
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <h2 className="fw-bold text-navy-900 mt-4 mb-3">Shop by category</h2>
      <div className="row row-cols-3 row-cols-md-6 g-3">
        {categories.map((c) => (
          <div className="col" key={c.value}>
            <button
              onClick={() => navigate(`/products?category=${c.value}`)}
              className={`btn w-100 h-100 d-flex flex-column align-items-center gap-2 rounded-xl2 py-4 small fw-semibold shadow-card border-0 ${c.tint}`}
            >
              <i className={`ti ${c.icon} fs-4`} aria-hidden="true" />
              {c.label}
            </button>
          </div>
        ))}
        <div className="col">
          <button
            onClick={() => navigate("/products")}
            className="btn w-100 h-100 d-flex flex-column align-items-center gap-2 rounded-xl2 bg-white py-4 small fw-semibold text-slate-500 shadow-card border-0"
          >
            <i className="ti ti-apps fs-4" aria-hidden="true" />
            View all
          </button>
        </div>
      </div>

      <div className="mt-4 mb-3 d-flex align-items-center justify-content-between">
        <h2 className="fw-bold text-navy-900 mb-0">Popular stores</h2>
        <Link to="/products" className="small fw-semibold text-brand-600 text-decoration-none">View all</Link>
      </div>
      <div className="row row-cols-2 row-cols-md-5 g-3">
        {stores.slice(0, 5).map((store) => (
          <div className="col" key={store._id}>
            <Link to={`/store/${store._id}`} className="d-block overflow-hidden rounded-xl2 bg-white shadow-card text-decoration-none card-hover h-100">
              <div style={{ height: "6rem" }}>
                <img
                  src={store.coverImageUrl || storePlaceholder(store.category, 400, 300)}
                  alt={store.storeName}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-3">
                <p className="text-truncate small fw-bold text-navy-900 mb-1">{store.storeName}</p>
                <p className="text-slate-400 mb-1" style={{ fontSize: ".75rem" }}>{store.category} &middot; {store.address.split(",")[0]}</p>
                <p className="d-flex align-items-center gap-1 text-slate-500 mb-0" style={{ fontSize: ".75rem" }}>
                  <i className="ti ti-star-filled text-amber-400" aria-hidden="true" /> {store.rating ?? "4.5"}
                  <span className="text-slate-300">&middot;</span> {store.deliveryTime}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-3 d-flex align-items-center justify-content-between">
        <h2 className="fw-bold text-navy-900 mb-0">Top picks for you</h2>
      </div>
      <div className="row row-cols-2 row-cols-md-5 g-3">
        {products.map((p) => (
          <div className="col" key={p._id}>
            <div className="overflow-hidden rounded-xl2 bg-white shadow-card h-100">
              <div style={{ height: "6rem" }}>
                <img
                  src={p.imageUrl || productPlaceholder(p.title)}
                  alt={p.title}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-3">
                <p className="text-truncate small fw-bold text-navy-900 mb-1">{p.title}</p>
                {p.description && <p className="text-truncate text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>{p.description}</p>}
                <div className="mt-2 d-flex align-items-center justify-content-between">
                  <span className="small fw-bold text-navy-900">${p.price.toFixed(2)}</span>
                  <QuantityStepper productId={p._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CustomerShell>
  );
}
