'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300)
        setIsVisible(true);
      else
        setIsVisible(false);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={
        `fixed bottom-6 right-4 rounded-full bg-slate-600 p-3 text-white transition duration-200 ease-in-out focus:outline-none md:bottom-8 md:right-8 tablet:p-4
        ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`
      }
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
