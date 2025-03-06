
import React, { useState, useEffect } from 'react';
import Header from './components/header';
import AboutSection from './components/AboutSection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';


export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <Header 
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      <main>
        <section className="hero-section">
          <Link to="/login" className="cta-button">
          </Link>
        </section>

        <AboutSection 
          isAboutOpen={isAboutOpen}
          setIsAboutOpen={setIsAboutOpen}
        />
        
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
}

