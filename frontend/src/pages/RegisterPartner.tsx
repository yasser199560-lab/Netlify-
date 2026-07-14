import { useState, FormEvent, cloneElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

// Partner sign-up is a two-step form: create the account (users collection),
// then immediately create the store profile (partner_profiles collection) —
// mirrors the 1:0..1 relationship from the ERD.
export default function RegisterPartner() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ name, email, password, role: "partner" });
      await api.post("/partners/me", { storeName, address, phoneNumber });
      navigate("/partner");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-surface px-3 py-5">
      <div className="w-100" style={{ maxWidth: "28rem" }}>
        <Link to="/" className="mb-4 d-flex align-items-center gap-2 text-decoration-none">
          <span className="d-flex align-items-center justify-content-center rounded-3 bg-brand-600 text-white" style={{ width: "2.25rem", height: "2.25rem" }}>
            <i className="ti ti-truck-delivery fs-5" aria-hidden="true" />
          </span>
          <span className="fs-5 fw-bold text-navy-900">Talabaty</span>
        </Link>

        <p className="small-caps fw-semibold text-slate-400 mb-1" style={{ fontSize: ".75rem" }}>Partner sign up</p>
        <h1 className="fs-2 fw-bold text-navy-900">List your store</h1>
        <p className="mt-2 small text-slate-500">
          Your account will need admin approval before it goes live.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 d-flex flex-column gap-3">
          {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600 mb-0">{error}</p>}

          <Field label="Your name" icon="ti-user">
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Email address" icon="ti-mail">
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" icon="ti-lock">
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </Field>
          <Field label="Store name" icon="ti-building-store">
            <input className="form-control" placeholder="e.g. Beit El Mouneh" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
          </Field>
          <Field label="Store address" icon="ti-map-pin">
            <input className="form-control" placeholder="e.g. Zahle, Main Street" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </Field>
          <Field label="Store phone number" icon="ti-phone">
            <input className="form-control" placeholder="+961 .. ... ..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </Field>

          <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold">
            Create partner account
          </button>

          <p className="text-center small text-slate-500 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-brand-600 text-decoration-none">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: string; children: React.ReactElement }) {
  return (
    <label className="d-block">
      <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>{label}</span>
      {icon ? (
        <div className="position-relative">
          <i className={`ti ${icon} position-absolute text-slate-400`} style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
          {cloneElement(children, { className: `${children.props.className ?? ""} ps-5`.trim() })}
        </div>
      ) : (
        children
      )}
    </label>
  );
}
