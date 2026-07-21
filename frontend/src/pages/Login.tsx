import { useState, FormEvent, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";
import authLogo from "../assets/logoo.png";
import "../styles/Login.css";

const roleTabs: { role: Role; label: string; icon: string }[] = [
  { role: "customer", label: "Customer", icon: "bi-person" },
  { role: "partner", label: "Partner", icon: "bi-shop" },
  { role: "admin", label: "Admin", icon: "bi-shield-check" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginAs, setLoginAs] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authView, setAuthView] = useState<"login" | "forgot" | "otp" | "reset" | "done">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetSessionToken, setResetSessionToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, loginAs);
      navigate(loginAs === "admin" ? "/admin" : loginAs === "partner" ? "/partner" : "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const showLogin = () => {
    setAuthView("login");
    setResetError("");
    setResetMessage("");
    setOtp("");
    setResetSessionToken("");
    navigate("/login");
  };

  const handleForgotSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email: resetEmail });
      setResetMessage(data.message || "If an account exists for that email, a verification code has been sent to it.");
      setOtp("");
      setAuthView("otp");
    } catch (err: any) {
      setResetError(err.response?.data?.message || "Could not send verification code");
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");

    try {
      const { data } = await api.post("/auth/verify-reset-otp", { email: resetEmail, otp });
      setResetSessionToken(data.resetToken);
      setResetError("");
      setAuthView("reset");
    } catch (err: any) {
      setResetError(err.response?.data?.message || "Could not verify code");
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token: resetSessionToken, password: newPassword });
      setAuthView("done");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setResetSessionToken("");
      navigate("/reset-password", { replace: true });
    } catch (err: any) {
      setResetError(err.response?.data?.message || "Could not reset password");
    }
  };

  const renderHeader = (kicker: string, title: string, subtitle: string) => (
    <div className="text-center mb-4">
      <img src={authLogo} alt="Talabati" className="auth-logo" />
      <p className="auth-kicker mb-2">{kicker}</p>
      <h1 className="auth-title mb-2">{title}</h1>
      <p className="auth-subtitle mb-0">{subtitle}</p>
    </div>
  );

  return (
    <main className="login-page">
      <section className="container">
        <div className="row min-vh-100 align-items-center justify-content-center py-4 py-md-5">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="login-card">
              <Link to="/" className="auth-home-link">
                <i className="bi bi-arrow-left" aria-hidden="true"></i>
                Back to home
              </Link>

              {authView === "login" && (
                <>
                  {renderHeader("Login", "Welcome back", "Choose your account type and continue to Talabaty.")}

                  <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                      <div className="alert alert-danger py-2" role="alert">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="form-label auth-label">I am logging in as</label>
                      <div className="row g-2">
                        {roleTabs.map((tab) => (
                          <div className="col-4" key={tab.role}>
                            <button
                              type="button"
                              onClick={() => setLoginAs(tab.role)}
                              className={`role-tab ${loginAs === tab.role ? "active" : ""}`}
                            >
                              <i className={`bi ${tab.icon}`} aria-hidden="true"></i>
                              <span>{tab.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-email" className="form-label auth-label">
                        Email address
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        className="form-control auth-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <label htmlFor="login-password" className="form-label auth-label">
                          Password
                        </label>
                        <button
                          type="button"
                          className="auth-text-button"
                          onClick={() => {
                            setResetEmail(email);
                            setAuthView("forgot");
                            setResetError("");
                            setResetMessage("");
                          }}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        id="login-password"
                        type="password"
                        className=" form-control auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className=" btn-login btn auth-primary-btn w-100">
                      Log in
                    </button>

                    <p className="auth-switch mb-0">
                      Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                  </form>
                </>
              )}
{/* ------------------------------------------------------------------------------------ */}
{/* FORGET PASSWORD FORM TO BE DISPLAYED WHEN CLICKING */}
              {authView === "forgot" && (
                <>
                  {renderHeader("Password reset", "Reset your password", "Enter your email and we will send a verification code to it.")}

                  <form onSubmit={handleForgotSubmit} className="auth-form">
                    {resetError && (
                      <div className="alert alert-danger py-2" role="alert">
                        {resetError}
                      </div>
                    )}
                    {resetMessage && (
                      <div className="alert alert-success py-2" role="status">
                        {resetMessage}
                      </div>
                    )}

                    <div>
                      <label htmlFor="reset-email" className="form-label auth-label">
                        Email address
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        className="form-control auth-input"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className=" btn-login btn auth-primary-btn w-100">
                      Send verification code
                    </button>

                    <div className="auth-action-row">
                      <button type="button" className="auth-outline-btn" onClick={showLogin}>
                        Back to login
                      </button>
                      <Link to="/" className="auth-outline-btn">
                        Back to home
                      </Link>
                    </div>
                  </form>
                </>
              )}

              {authView === "otp" && (
                <>
                  {renderHeader("Verify it's you", "Enter your verification code", `We sent a 6-digit code to ${resetEmail}. It expires in 10 minutes.`)}

                  <form onSubmit={handleOtpSubmit} className="auth-form">
                    {resetError && (
                      <div className="alert alert-danger py-2" role="alert">
                        {resetError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="reset-otp" className="form-label auth-label">
                        Verification code
                      </label>
                      <input
                        id="reset-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        className="form-control auth-input auth-otp-input"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                      />
                    </div>

                    <button type="submit" className=" btn-login btn auth-primary-btn w-100" disabled={otp.length !== 6}>
                      Verify code
                    </button>

                    <p className="auth-dev-link mb-0">
                      Didn't get it?{" "}
                      <button type="button" className="auth-text-button p-0" onClick={handleForgotSubmit}>
                        Resend code
                      </button>
                    </p>

                    <div className="auth-action-row">
                      <button type="button" className="auth-outline-btn" onClick={showLogin}>
                        Back to login
                      </button>
                      <Link to="/" className="auth-outline-btn">
                        Back to home
                      </Link>
                    </div>
                  </form>
                </>
              )}

              {authView === "reset" && (
                <>
                  {renderHeader("New password", "Choose a new password", "Your verification session is valid for 10 minutes.")}

                  <form onSubmit={handleResetSubmit} className="auth-form">
                    {resetError && (
                      <div className="alert alert-danger py-2" role="alert">
                        {resetError}
                      </div>
                    )}

                    <div>
                      <label htmlFor="new-password" className="form-label auth-label">
                        New password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        className="form-control auth-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-new-password" className="form-label auth-label">
                        Confirm password
                      </label>
                      <input
                        id="confirm-new-password"
                        type="password"
                        className="form-control auth-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>

                    <button type="submit" className=" btn-login btn auth-primary-btn w-100">
                      Reset password
                    </button>
                  </form>
                </>
              )}

              {authView === "done" && (
                <>
                  {renderHeader("Password updated", "You are all set", "Your password was reset successfully.")}

                  <div className="auth-success-icon" aria-hidden="true">
                    <i className="bi bi-check2"></i>
                  </div>

                  <div className="auth-action-row">
                    <button type="button" className="auth-primary-btn auth-choice-btn" onClick={showLogin}>
                      Back to login
                    </button>
                    <Link to="/" className="auth-outline-btn auth-choice-btn">
                      Back to home
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
