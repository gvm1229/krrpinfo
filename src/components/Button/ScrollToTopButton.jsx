'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500, // Adjust the duration to control the scroll speed (in milliseconds)
      smooth: 'easeInOutQuart', // Adjust the smoothness of the scroll animation
      // smooth: true,
    });
  };

  // const scrollToBottom = () => {
  //   scroll.scrollToBottom({
  //     duration: 500, // Adjust the duration to control the scroll speed (in milliseconds)
  //     smooth: 'easeInOutQuart', // Adjust the smoothness of the scroll animation
  //     // smooth: true,
  //   });
  // };

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

  return (
    <div className="fixed bottom-12 right-4 z-50 tablet:bottom-36 tablet:right-7">
      <button
        name="scrollToTopBtn"
        onClick={scrollToTop}
        className={
          `rounded-full bg-slate-500 p-3 text-white transition duration-200 ease-in-out focus:outline-none dark:bg-slate-600 tablet:p-4
        ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`
        }
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
