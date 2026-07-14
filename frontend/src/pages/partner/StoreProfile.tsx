import { useEffect, useState, FormEvent } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import api from "../../api/axiosInstance";
import { PartnerProfile, StoreCategory } from "../../types";
import { storePlaceholder } from "../../utils/image";
import { partnerNavItems } from "./partnerNav";

const categories: StoreCategory[] = ["Restaurant", "Supermarket", "Pharmacy", "Fashion", "Bakery"];

// Everything a partner needs to keep their public storefront accurate —
// name, description, address, contact number, category, delivery estimate,
// and a cover photo — all editable in place and saved with a single call
// to PATCH /partners/me.
export default function StoreProfile() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState<StoreCategory>("Restaurant");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    api
      .get<PartnerProfile>("/partners/me")
      .then((res) => {
        const p = res.data;
        setProfile(p);
        setStoreName(p.storeName ?? "");
        setDescription(p.description ?? "");
        setAddress(p.address ?? "");
        setPhoneNumber(p.phoneNumber ?? "");
        setCategory((p.category as StoreCategory) ?? "Restaurant");
        setDeliveryTime(p.deliveryTime ?? "");
        setCoverImageUrl(p.coverImageUrl ?? "");
      })
      .catch(() => setError("Couldn't load your store profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await api.patch<PartnerProfile>("/partners/me", {
        storeName,
        description,
        address,
        phoneNumber,
        category,
        deliveryTime,
        coverImageUrl: coverImageUrl || undefined,
      });
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't save your store profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell panelLabel="Partner panel" subLabel={profile?.storeName} items={partnerNavItems}>
      <h1 className="fs-3 fw-bold text-navy-900">Store profile</h1>
      <p className="text-slate-500">This is what customers see when they visit your store.</p>

      {loading && <p className="small text-slate-400 mt-3">Loading&hellip;</p>}

      {!loading && (
        <div className="row g-4 mt-1">
          <div className="col-lg-4">
            <div className="rounded-xl2 bg-white shadow-card overflow-hidden">
              <div style={{ height: "8rem" }}>
                <img
                  src={coverImageUrl || storePlaceholder(category, 400, 200)}
                  alt={storeName || "Store cover"}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4 text-center">
                <p className="fw-bold text-navy-900 mb-1">{storeName || "Your store"}</p>
                <span className="badge rounded-pill bg-brand-50 text-brand-700 fw-semibold text-capitalize">
                  {category}
                </span>
                <p className="small text-slate-400 mt-3 mb-0">
                  Changes here are visible to customers as soon as you save.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="rounded-xl2 bg-white p-4 shadow-card">
              <h2 className="mb-3 fs-5 fw-bold text-navy-900">Store details</h2>

              {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}
              {saved && <p className="rounded-3 bg-teal-50 px-3 py-2 small text-teal-700">Store profile updated.</p>}

              <label className="mb-3 d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Store name</span>
                <input className="form-control" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
              </label>

              <label className="mb-3 d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Description</span>
                <textarea className="form-control" rows={3} placeholder="A short line about your store..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="d-block">
                    <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Category</span>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as StoreCategory)}>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="col-sm-6">
                  <label className="d-block">
                    <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Estimated delivery time</span>
                    <input className="form-control" placeholder="e.g. 25-35 min" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="d-block">
                    <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Address</span>
                    <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </label>
                </div>
                <div className="col-sm-6">
                  <label className="d-block">
                    <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Phone number</span>
                    <input className="form-control" placeholder="+961 .. ... ..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  </label>
                </div>
              </div>

              <label className="mb-4 d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Cover image URL</span>
                <input className="form-control" placeholder="https://..." value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
                <span className="text-slate-400" style={{ fontSize: ".75rem" }}>Leave blank to use a placeholder photo.</span>
              </label>

              <button type="submit" disabled={saving} className="btn btn-brand fw-semibold px-4">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
