import { useState, FormEvent } from "react";
import CustomerShell from "../../components/layout/CustomerShell";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

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
    <CustomerShell>
      <h1 className="fs-3 fw-bold text-navy-900">Settings</h1>
      <p className="text-slate-500">Manage your password and notification preferences.</p>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <form onSubmit={handleChangePassword} className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Change password</h2>

            {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}
            {success && <p className="rounded-3 bg-teal-50 px-3 py-2 small text-teal-700">{success}</p>}

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Current password</span>
              <div className="position-relative"><i className="ti ti-lock position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input type="password" className="form-control ps-5" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
            </label>

            <label className="mb-3 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>New password</span>
              <div className="position-relative"><i className="ti ti-lock position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input type="password" className="form-control ps-5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} /></div>
            </label>

            <label className="mb-4 d-block">
              <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Confirm new password</span>
              <div className="position-relative"><i className="ti ti-lock position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" /><input type="password" className="form-control ps-5" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} /></div>
            </label>

            <button type="submit" disabled={saving} className="btn btn-brand fw-semibold px-4">
              {saving ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>

        <div className="col-lg-6">
          <div className="rounded-xl2 bg-white p-4 shadow-card h-100">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Notifications</h2>
            <p className="small text-slate-400 mb-3" style={{ fontSize: ".75rem" }}>
              These preferences are stored on this device only in the current demo.
            </p>

            <ToggleRow
              label="Order updates"
              description="Status changes for orders you've placed"
              checked={orderUpdates}
              onChange={setOrderUpdates}
            />
            <ToggleRow
              label="Promotions & offers"
              description="Deals from stores you follow"
              checked={promotions}
              onChange={setPromotions}
            />
            <ToggleRow
              label="SMS delivery alerts"
              description="Text message when your order is on its way"
              checked={smsAlerts}
              onChange={setSmsAlerts}
            />

            <hr className="my-4" />

            <h2 className="mb-2 fs-5 fw-bold text-navy-900">Account</h2>
            <button onClick={logout} className="btn rounded-3 border-0 bg-red-50 text-red-600 fw-semibold px-3 py-2">
              Log out of all sessions
            </button>
          </div>
        </div>
      </div>
    </CustomerShell>
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
