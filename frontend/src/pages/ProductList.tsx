import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import api from "../api/axiosInstance";
import { PartnerProfile } from "../types";
import { storePlaceholder } from "../utils/image";

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [partners, setPartners] = useState<PartnerProfile[]>([]);

  useEffect(() => {
    api.get<PartnerProfile[]>("/partners", { params: category ? { category } : {} })
      .then((res) => setPartners(res.data));
  }, [category]);

  return (
    <div className="min-vh-100">
      <PublicNavbar />
      <div className="px-4 px-md-5 py-5">
        <h1 className="fs-3 fw-bold text-navy-900">
          {category ? `${category}s near you` : "Browse stores"}
        </h1>
        <p className="text-slate-500">Restaurants, markets, and shops across the Bekaa region.</p>

        <div className="row row-cols-2 row-cols-md-3 g-4 mt-2">
          {partners.length === 0 && <p className="small text-slate-400">No active stores yet.</p>}
          {partners.map((p) => (
            <div className="col" key={p._id}>
              <Link
                to={`/store/${p._id}`}
                className="d-block overflow-hidden rounded-xl2 bg-white shadow-card text-decoration-none card-hover h-100"
              >
                <div style={{ height: "7rem" }}>
                  <img
                    src={p.coverImageUrl || storePlaceholder(p.category, 400, 300)}
                    alt={p.storeName}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-3">
                  <p className="fw-bold text-navy-900 mb-1">{p.storeName}</p>
                  <p className="small text-slate-500 mb-1">{p.category} &middot; {p.address}</p>
                  <p className="d-flex align-items-center gap-1 text-slate-500 mb-0" style={{ fontSize: ".75rem" }}>
                    <i className="ti ti-star-filled text-amber-400" aria-hidden="true" /> {p.rating ?? "4.5"}
                    <span className="text-slate-300">&middot;</span> {p.deliveryTime}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
