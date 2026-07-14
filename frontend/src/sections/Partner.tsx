import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Partner.css';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

// Business type shown in the dropdown -> the PartnerProfile.category enum
// the backend actually accepts. "Other" has no matching enum value, so it's
// left unmapped and the schema's own default ("Restaurant") applies —
// the free-text description the person enters is kept either way.
const CATEGORY_MAP: Record<string, string | undefined> = {
  restaurant: 'Restaurant',
  supermarket: 'Supermarket',
  clothes_store: 'Fashion',
  pharmacy: 'Pharmacy',
  other: undefined,
};

const PartnerSection: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [businessType, setBusinessType] = useState<string>('');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [town, setTown] = useState('');
  const [otherType, setOtherType] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessType) {
      setError('Please select a business type.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: create the login account itself, in the same `users`
      // collection as every other account — role "partner" makes the
      // backend set status to "pending" automatically, so this shows up
      // in the admin dashboard's Partners tab waiting for approval.
      await register({ name: ownerName, email, password, role: 'partner' });

      // Step 2: create the store profile tied to that account.
      const fullDescription =
        businessType === 'other' && otherType
          ? `${otherType}. ${description}`.trim()
          : description;

      await api.post('/partners/me', {
        storeName: businessName,
        address: town,
        phoneNumber,
        category: CATEGORY_MAP[businessType],
        description: fullDescription || undefined,
      });

      setSuccess(true);
      setTimeout(() => navigate('/partner'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="partner-form" className="partner-section container-fluid px-md-5 mt-5 pt-4 pb-3">
      <div className="row align-items-center justify-content-between g-4 g-lg-5">
        
        {/* Left Column Text details */}
        <div className="col-lg-5">
          <span className="text-uppercase fw-bold text-brand-blue tracking-wider small">Grow Your Business</span>
          <h2 className="fw-bold display-6 text-brand-blue mt-2 mb-4">
            Become a Talabaty <br />Partner
          </h2>
          <p className="text-muted mb-4">Join 50+ local businesses already growing with Talabaty across the Bekaa region.</p>
          
          <ul className="list-unstyled d-flex flex-column gap-3 checklist-container">
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Free to join — no setup fees
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Reach thousands of customers in Bekaa
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Manage your own products and pricing
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Track all your orders in real time
            </li>
            <li className="d-flex align-items-center">
              <span className="check-icon-wrapper me-2"><i className="bi bi-check2"></i></span> 
              Support from our team every step of the way
            </li>
          </ul>
        </div>

        {/* Right Column Interactive Form Card */}
        <div className="col-lg-6 pe-lg-0 px-3 mt-4 mt-lg-0">
          <div className="custom-form-card p-4 rounded-4 shadow-sm border">
            <h4 className="fw-bold text-brand-blue mb-1">Partner application</h4>
            <p className="text-muted small mb-4">Fill in your info and we'll get back to you within 24 hours.</p>

            {success ? (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                <i className="bi bi-check-circle-fill"></i>
                Application submitted! Redirecting to your partner dashboard…
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger py-2 small mb-3">{error}</div>
                )}

                <div className="mb-3">
                  <label className="form-label-custom">Business Name</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="e.g. Beit El Mouneh"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Owner Full Name</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Full name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Phone Number</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="+961 ... ... ..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Email Address</label>
                    <input
                      type="email"
                      className="form-control custom-input"
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Password</label>
                    <input
                      type="password"
                      className="form-control custom-input"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Business Type</label>
                    <select 
                      className="form-select custom-input text-muted"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>Select business type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="supermarket">Supermarket</option>
                      <option value="clothes_store">Clothes Store</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Location (Town)</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="e.g. Zahle, Chtaura"
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {businessType === 'other' && (
                  <div className="mb-3 animate-fade-in">
                    <label className="form-label-custom">Please specify business type</label>
                    <input 
                      type="text" 
                      className="form-control custom-input" 
                      placeholder="e.g. Bakery, Flower Shop..." 
                      value={otherType}
                      onChange={(e) => setOtherType(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label-custom">Tell us about your business</label>
                  <textarea
                    className="form-control custom-input"
                    rows={3}
                    placeholder="Brief description of what you sell..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-partner-submit w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit application'} <i className="bi bi-arrow-right"></i>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PartnerSection;
