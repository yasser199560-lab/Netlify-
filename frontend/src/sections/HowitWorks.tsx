import React from 'react';
import '../styles/HowitWorks.css';
const HowItWorks: React.FC = () => {
  return (
    /* CHANGED: Replaced irregular margin helpers with standard responsive section classes */
    <section className="how-it-works-section responsive-section-container py-4 bg-light-section">
      <div className="text-center mb-4">
        <h3 className="fw-bold text-dark-blue mb-1">How Talabaty works</h3>
        <p className="text-muted small m-0">Three simple steps to get what you need</p>
      </div>

      {/* CHANGED: Used Bootstrap's row-cols parameters to center stacked items on mobile and display 3 columns on large screens */}
      <div className="row row-cols-1 row-cols-lg-3 g-4 justify-content-center px-2">
        
        {/* Step 1 */}
        <div className="col d-flex justify-content-center">
          <div className="step-card p-4 bg-white rounded-4 shadow-sm w-100" style={{ maxWidth: '420px' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-box me-3 bg-primary-light p-3 rounded-3 text-primary">
                <i className="bi bi-shop fs-4"></i>
              </div>
              <h5 className="fw-bold m-0 text-dark-blue">1. Browse stores</h5>
            </div>
            <p className="text-muted small m-0">Explore restaurants, markets, and shops from Bekaa.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="col d-flex justify-content-center">
          <div className="step-card p-4 bg-white rounded-4 shadow-sm w-100" style={{ maxWidth: '420px' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-box me-3 bg-primary-light p-3 rounded-3 text-primary">
                <i className="bi bi-cart-plus fs-4"></i>
              </div>
              <h5 className="fw-bold m-0 text-dark-blue">2. Add to cart</h5>
            </div>
            <p className="text-muted small m-0">Pick your items, choose quantity, and review your order.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="col d-flex justify-content-center">
          <div className="step-card p-4 bg-white rounded-4 shadow-sm w-100" style={{ maxWidth: '420px' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-box me-3 bg-primary-light p-3 rounded-3 text-primary">
                <i className="bi bi-bicycle fs-4"></i>
              </div>
              <h5 className="fw-bold m-0 text-dark-blue">3. Get it delivered</h5>
            </div>
            <p className="text-muted small m-0">Pay on delivery or via Wish Money. We handle the rest.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;