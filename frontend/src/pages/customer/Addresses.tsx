import { useEffect, useState, FormEvent } from "react";
import CustomerShell from "../../components/layout/CustomerShell";
import api from "../../api/axiosInstance";
import { Address } from "../../types";

function addressIcon(label: string): string {
  const key = label.toLowerCase();
  if (key.includes("home")) return "ti-home";
  if (key.includes("work") || key.includes("office")) return "ti-briefcase";
  if (key.includes("family") || key.includes("parent")) return "ti-users";
  if (key.includes("gym")) return "ti-barbell";
  return "ti-map-pin";
}

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [label, setLabel] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [town, setTown] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.get<Address[]>("/addresses").then((res) => setAddresses(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/addresses", { label, fullAddress, town });
      setLabel("");
      setFullAddress("");
      setTown("");
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't save address");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    await api.patch(`/addresses/${id}/default`);
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/addresses/${id}`);
    load();
  };

  return (
    <CustomerShell>
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="fs-3 fw-bold text-navy-900">Addresses</h1>
          <p className="text-slate-500 mb-0">Save the places you deliver to most, and pick your default at checkout.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn btn-brand fw-semibold">
          {showForm ? "Cancel" : "+ Add address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl2 bg-white p-4 shadow-card mb-4">
          {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}
          <div className="row g-3">
            <div className="col-sm-4">
              <label className="d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Label</span>
                <input className="form-control" placeholder="Home, Work..." value={label} onChange={(e) => setLabel(e.target.value)} required />
              </label>
            </div>
            <div className="col-sm-4">
              <label className="d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Full address</span>
                <input className="form-control" placeholder="Street, building, floor" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} required />
              </label>
            </div>
            <div className="col-sm-4">
              <label className="d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Town</span>
                <input className="form-control" placeholder="e.g. Zahle" value={town} onChange={(e) => setTown(e.target.value)} />
              </label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-brand fw-semibold mt-3 px-4">
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      )}

      <div className="d-flex flex-column gap-3">
        {loading && <p className="small text-slate-400">Loading&hellip;</p>}
        {!loading && addresses.length === 0 && (
          <p className="small text-slate-400">You haven't saved any addresses yet.</p>
        )}
        {addresses.map((a) => (
          <div key={a._id} className="d-flex align-items-center justify-content-between rounded-xl2 bg-white p-3 shadow-card">
            <div className="d-flex align-items-start gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3 bg-brand-50 flex-shrink-0" style={{ width: "2.5rem", height: "2.5rem" }}>
                <i className={`ti ${addressIcon(a.label)} text-brand-600`} aria-hidden="true" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <p className="fw-semibold text-navy-900 mb-0">{a.label}</p>
                  {a.isDefault && (
                    <span className="badge rounded-pill bg-teal-50 text-teal-700 fw-semibold">Default</span>
                  )}
                </div>
                <p className="small text-slate-500 mb-0">
                  {a.fullAddress}{a.town ? `, ${a.town}` : ""}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              {!a.isDefault && (
                <button
                  onClick={() => handleSetDefault(a._id)}
                  className="btn rounded-3 border-0 bg-brand-50 text-brand-700 fw-semibold hover-bg-brand-100 py-1 px-2"
                  style={{ fontSize: ".75rem" }}
                >
                  Set as default
                </button>
              )}
              <button
                onClick={() => handleDelete(a._id)}
                className="btn rounded-3 border-0 bg-red-50 text-red-600 fw-semibold hover-bg-red-100 py-1 px-2"
                style={{ fontSize: ".75rem" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </CustomerShell>
  );
}
