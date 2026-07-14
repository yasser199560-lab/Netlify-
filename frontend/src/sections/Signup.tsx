import React, { FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Signup.css";
import logo from "../assets/logoo.png";

interface SignupProps {
  onSwitchToLogin?: () => void;
}

interface SignupForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  town: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupForm>({
    fullName: "",
    phoneNumber: "",
    email: "",
    town: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Add JWT signup request here later.
    console.log("Signup data:", formData);
  };

  return (
    <section className="signup-screen">
      <div className="signup-panel">
        <div className="signup-brand">
          <img src={logo} alt="Talabaty logo" className="signup-logo" />
          <span>Talabaty</span>
        </div>

        <div className="signup-heading">
          <p>CUSTOMER SIGN UP</p>
          <h1>Create your account</h1>
          <span>Join Talabaty and start ordering from local Bekaa stores.</span>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="fullName">FULL NAME</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="phoneNumber">PHONE NUMBER</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+961 .. ... ..."
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="town">TOWN / VILLAGE IN BEKAA</label>
            <input
              id="town"
              name="town"
              type="text"
              placeholder="e.g. Zahle, Chtaura, Saadnayel"
              value={formData.town}
              onChange={handleChange}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-submit">
            Create account
          </button>

          <p className="signup-footer-text">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin}>
              Log in
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;