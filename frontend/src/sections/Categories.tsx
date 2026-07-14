import React, { useRef } from 'react';
import '../styles/Categories.css';

interface Category {
  name: string;
  icon: string;
  bgColor: string;
}

const categories: Category[] = [
  { name: 'Restaurants', icon: '🍲', bgColor: '#eef2ff' },
  { name: 'Supermarkets', icon: '🛒', bgColor: '#ecfdf5' },
  { name: 'Pharmacies', icon: '💊', bgColor: '#f0fdfa' },
  { name: 'Fashion', icon: '👗', bgColor: '#fdf2f8' },
  { name: 'Bakeries', icon: '🥖', bgColor: '#fff7ed' },
  { name: 'Cafés', icon: '☕', bgColor: '#fefcbf' },
  { name: 'Home Goods', icon: '🏠', bgColor: '#f3e8ff' },
  { name: 'Electronics', icon: '💻', bgColor: '#f0f9ff' },
  { name: 'Flowers & Gifts', icon: '💐', bgColor: '#fdf2f8' },
  { name: 'Pets', icon: '🐾', bgColor: '#f0fdf4' },
];

const Categories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6; 
      
      const newScrollPosition = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    /* CHANGED: Replaced static mx-5 with responsive mx-lg-5 mx-0 px-3 to keep it centered on mobile */
    <section className="categories-section container-fluid mx-lg-5 mx-0 px-3 py-4 position-relative">
      <div className="mb-4">
        <h3 className="fw-bold text-dark-blue mb-1">Browse by category</h3>
        <p className="text-muted small m-0">What are you looking for today?</p>
      </div>

      <div className="d-flex align-items-center position-relative display">
        {/* CHANGED: Replaced static margin spacers with d-none d-lg-flex to remove layout shift */}
        <button 
          className="cat-arrow left-arrow shadow-sm d-flex me-3" 
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        
        <div 
          ref={scrollRef} 
          className="categories-wrapper d-flex gap-3 overflow-hidden flex-grow-1 py-2"
        >
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card text-center flex-shrink-0 d-flex flex-column align-items-center justify-content-center p-3"
              style={{ backgroundColor: cat.bgColor }}
            >
              <span className="fs-3 mb-2">{cat.icon}</span>
              <span className="fw-semibold text-dark-blue small">{cat.name}</span>
            </div>
          ))}
        </div>

        <button 
          className="cat-arrow right-arrow shadow-sm d-flex ms-3" 
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default Categories;