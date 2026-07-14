import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

import React from 'react';
import Header from '../components/Header';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import HowItWorks from '../sections/HowitWorks';
import PartnerSection from '../sections/Partner';
import Rating from "../sections/Rating";


const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <div className="landing-page-wrapper d-flex flex-column min-vh-100">
      {/* 1. Header Navigation Context */}
      <Header />

      {/* 2. Page Main Blocks Container */}
      <main className="flex-grow-1" style={{ marginTop: '72px' }}> 
        {/* Note: margin-top prevents fixed navbar from layout overlapping onto Hero section */}
        <Hero />
        <Categories />
        <HowItWorks />
        <PartnerSection />
      </main>

      {/* 3. Footer Context & Stats */}
      <Rating />
      <Footer />
    </div>
  );
};

export default Home;
