import { useEffect, useState, FormEvent } from "react";
import CustomerShell from "../../components/layout/CustomerShell";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  town?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [town, setTown] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Me>("/auth/me").then((res) => {
      setMe(res.data);
      setName(res.data.name);
      setPhone(res.data.phone ?? "");
      setTown(res.data.town ?? "");
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await api.patch<Me>("/auth/me", { name, phone, town });
      setMe(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomerShell>
      <h1 className="fs-3 fw-bold text-navy-900">Profile</h1>
      <p className="text-slate-500">Your personal details.</p>

      <div className="row g-4 mt-1">
        <div className="col-lg-4">
          <div className="rounded-xl2 bg-white p-4 shadow-card text-center">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-brand-100 fw-bold text-brand-600 fs-2"
              style={{ width: "5rem", height: "5rem" }}
            >
              {me?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="fw-bold text-navy-900 mb-1">{me?.name}</p>
            <p className="small text-slate-500 mb-1">{me?.email}</p>
            <span className="badge rounded-pill bg-teal-50 text-teal-700 fw-semibold text-capitalize">
              {me?.status ?? "active"} &middot; {user?.role}
            </span>
          </div>
        </div>

        <div className="col-lg-8">
          <form onSubmit={handleSubmit} className="rounded-xl2 bg-white p-4 shadow-card">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Personal information</h2>

            {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}
            {saved && <p className="rounded-3 bg-teal-50 px-3 py-2 small text-teal-700">Changes saved.</p>}

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Full name</span>
              <div className="position-relative"><i className="ti ti-user position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input className="form-control ps-5" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            </label>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Email address</span>
              <input className="form-control bg-surface" value={me?.email ?? ""} disabled readOnly />
              <span className="text-slate-400" style={{ fontSize: ".75rem" }}>Email can't be changed.</span>
            </label>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="d-block">
                  <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Phone number</span>
                  <div className="position-relative"><i className="ti ti-phone position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input className="form-control ps-5" placeholder="+961 .. ... ..." value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                </label>
              </div>
              <div className="col-sm-6">
                <label className="d-block">
                  <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Town</span>
                  <div className="position-relative"><i className="ti ti-map-pin position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input className="form-control ps-5" placeholder="e.g. Zahle" value={town} onChange={(e) => setTown(e.target.value)} /></div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-brand fw-semibold px-4">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </CustomerShell>
  );
}
