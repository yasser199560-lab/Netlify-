import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';
import Img from '../assets/supermarkett.png'; 
import Img1 from '../assets/restaurantt.png'; 
import Img2 from '../assets/pharmacyy.png'; 
import Img3 from '../assets/clothess.png'; 

// Array of your different carousel images
const heroImages: string[] = [
  Img,
  Img1,
  Img2,
  Img3
];

const Hero: React.FC = () => {
  // State to track which image is currently visible
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Auto-play effect: changes the image index every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer); // Clean up timer on unmount
  }, [currentIdx]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  return (
    <section id="about" className="hero-section container-fluid position-relative d-flex align-items-center">
      <div className="container position-relative z-2 py-5">
        <div className="row align-items-center">
          
          {/* Left Column: Text Content stays exactly the same */}
          <div className=" textt col-lg-6 text-white hero-text-content">
            <h2 className="display-4 fw-bold mb-3">
              Your local market, <br />
              <span className="text-accent">one tap away.</span>
            </h2>
            <p className="lead mb-4 opacity-90">
              Browse restaurants, supermarkets, and local stores across the Bekaa region. 
              Order fast, pay easy, get it delivered.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-light btn-lg px-4 fw-semibold d-flex align-items-center gap-2">
                Get started <i className="bi bi-arrow-right"></i>
              </button>
              <button className="btn btn-outline-light btn-lg px-4">
                Learn more
              </button>
            </div>
          </div>
          
          {/* Right Column: Dynamic image transitions (visible on every screen size) */}
<div className="col-12 col-lg-6">
  <div className="hero-image-wrapper">
    {heroImages.map((imgUrl, idx) => (
      <img 
        key={idx}
        src={imgUrl} 
        alt={`Talabaty Showcase ${idx + 1}`} 
        className={`hero-basket-img ${idx === currentIdx ? 'active' : ''}`} 
      />
    ))}
  </div>
</div>
        </div>
      </div>
      
      {/* Dynamic Indicators / Dots at the bottom */}
      <div className="carousel-indicators-custom position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2">
        {heroImages.map((_, idx) => (
          <span 
            key={idx}
            className={`dot ${idx === currentIdx ? 'active' : ''}`}
            onClick={() => setCurrentIdx(idx)}
          ></span>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button className="slider-arrow prev position-absolute start-0 top-50 translate-middle-y ms-4" onClick={handlePrev}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="slider-arrow next position-absolute end-0 top-50 translate-middle-y me-4" onClick={handleNext}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </section>
  );
};

export default Hero;