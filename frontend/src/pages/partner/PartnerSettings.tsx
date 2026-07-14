import { useEffect, useState, FormEvent } from "react";
import DashboardShell from "../../components/layout/DashboardShell";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { PartnerProfile } from "../../types";
import { partnerNavItems } from "./partnerNav";

export default function PartnerSettings() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  useEffect(() => {
    api.get<PartnerProfile>("/partners/me").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/auth/change-password", { currentPassword, newPassword });
      setSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell panelLabel="Partner panel" subLabel={profile?.storeName} items={partnerNavItems}>
      <h1 className="fs-3 fw-bold text-navy-900">Settings</h1>
      <p className="text-slate-500">Manage your login, order alerts, and account.</p>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <form onSubmit={handleChangePassword} className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Change password</h2>

            {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}
            {success && <p className="rounded-3 bg-teal-50 px-3 py-2 small text-teal-700">{success}</p>}

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Current password</span>
              <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </label>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>New password</span>
              <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </label>

            <label className="mb-4 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Confirm new password</span>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </label>

            <button type="submit" disabled={saving} className="btn btn-brand fw-semibold px-4">
              {saving ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>

        <div className="col-lg-6">
          <div className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Order notifications</h2>
            <p className="small text-slate-400 mb-3" style={{ fontSize: ".75rem" }}>
              These preferences are stored on this device only in the current demo.
            </p>

            <ToggleRow
              label="New order alerts"
              description="Get notified the moment a customer places an order"
              checked={orderNotifications}
              onChange={setOrderNotifications}
            />
            <ToggleRow
              label="Promotions & platform news"
              description="Updates from Talabaty about partner tools and offers"
              checked={promoNotifications}
              onChange={setPromoNotifications}
            />
            <ToggleRow
              label="SMS alerts"
              description="Text message when an order needs your attention"
              checked={smsAlerts}
              onChange={setSmsAlerts}
            />

            <hr className="my-4" />

            <h2 className="mb-2 fs-5 fw-bold text-navy-900">Account</h2>
            <p className="small text-slate-500 mb-3">
              Signed in as <span className="fw-semibold text-navy-900">{user?.email}</span> &middot;{" "}
              <span className="text-capitalize">{user?.status ?? "active"}</span>
            </p>
            <button onClick={logout} className="btn rounded-3 border-0 bg-red-50 text-red-600 fw-semibold px-3 py-2">
              Log out
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
      <div>
        <p className="fw-semibold text-navy-900 mb-0">{label}</p>
        <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>{description}</p>
      </div>
      <div className="form-check form-switch mb-0">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: "2.5rem", height: "1.4rem" }}
        />
      </div>
    </div>
  );
}
