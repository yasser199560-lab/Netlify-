import React from 'react';
import '../styles/Footer.css'; // Shared styles as requested

const statsData = [
  { value: '50+', label: 'Local partners' },
  { value: '3,200+', label: 'Orders delivered' },
  { value: '12', label: 'Towns covered' },
  { value: '4.8 ★', label: 'Average rating', isRating: true },
];

const Rating: React.FC = () => {
  return (
    <section className="rating-section container-fluid py-4">
      <div className="container">
        <div className="row rows text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-md-3 mb-3 mb-md-0 stat-item">
              <div className={`stat-value ${stat.isRating ? 'rating' : ''}`}>
                {stat.value}
              </div>
              <div className="stat-label text-light-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rating;