import { useState, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authLogo from "../assets/logoo.png";
import "../styles/Register.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [town, setTown] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Captures the success message

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Run the registration network action
      const res: any = await register({ name, email, password, role: "customer", phone, town });
      
      // Look for the server-sent message, falling back to a clean string if hidden in context
      const textToShow = res?.data?.message || res?.message || "User created successfully";
      setSuccessMessage(textToShow);

      // Delay navigation slightly so the user can visibly see the confirmation message
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="register-page">
      <section className="container">
        <div className="row min-vh-100 align-items-center justify-content-center py-4 py-md-5">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="register-card">
              <Link to="/" className="auth-home-link">
                <i className="bi bi-arrow-left" aria-hidden="true"></i>
                Back to home
              </Link>

              <div className="row g-4 align-items-center">
                <div className="col-12 col-lg-5 text-center text-lg-start">
                  <img src={authLogo} alt="Talabati" className="auth-logo" />
                  <p className="auth-kicker mb-2">Customer sign up</p>
                  <h1 className="auth-title mb-3">Create your account</h1>
                  <p className="auth-subtitle mb-0">
                    Join Talabaty and start ordering from local Bekaa stores.
                  </p>
                </div>

                <div className="col-12 col-lg-7">
                  <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                      <div className="alert alert-danger py-2" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Renders custom confirmation badge upon successful backend insertion */}
                    {successMessage && (
                      <div className="alert alert-success py-2" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {successMessage}
                      </div>
                    )}

                    <div className="row g-3">
                      <Field label="Full name" inputId="register-name">
                        <input
                          id="register-name"
                          className="form-control auth-input"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={!!successMessage}
                        />
                      </Field>

                      <Field label="Phone number" inputId="register-phone">
                        <input
                          id="register-phone"
                          className="form-control auth-input"
                          placeholder="+961 .. ... ..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!!successMessage}
                        />
                      </Field>

                      <Field label="Email address" inputId="register-email">
                        <input
                          id="register-email"
                          type="email"
                          className="form-control auth-input"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={!!successMessage}
                        />
                      </Field>

                      <Field label="Town / village in Bekaa" inputId="register-town">
                        <input
                          id="register-town"
                          className="form-control auth-input"
                          placeholder="e.g. Zahle, Chtaura"
                          value={town}
                          onChange={(e) => setTown(e.target.value)}
                          disabled={!!successMessage}
                        />
                      </Field>

                      <Field label="Password" inputId="register-password">
                        <input
                          id="register-password"
                          type="password"
                          className="form-control auth-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={!!successMessage}
                        />
                      </Field>

                      <Field label="Confirm password" inputId="register-confirm-password">
                        <input
                          id="register-confirm-password"
                          type="password"
                          className="form-control auth-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={!!successMessage}
                        />
                      </Field>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-create btn auth-primary-btn w-100"
                      disabled={!!successMessage}
                    >
                      {successMessage ? "Creating account..." : "Create account"}
                    </button>

                    <p className="auth-switch mb-0">
                      Already have an account? <Link to="/login">Log in</Link>
                    </p>

                    <p className="auth-secondary-link mb-0">
                      Want to list your store instead? <Link to="/#partner-form">Sign up as a partner</Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, inputId, children }: { label: string; inputId: string; children: ReactNode }) {
  return (
    <div className="col-12 col-md-6">
      <label htmlFor={inputId} className="form-label auth-label">
        {label}
      </label>
      {children}
    </div>
  );
}