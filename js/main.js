// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Search functionality
  const searchIcon = document.querySelector(".search-icon");
  const searchForm = document.querySelector(".inline-search-form");
  const navLinks = document.querySelector(".nav-links");
  const searchClose = document.querySelector(".inline-search-close");
  const searchInput = document.querySelector(".inline-search-input");

  searchIcon.addEventListener("click", () => {
    searchForm.classList.add("active");
    navLinks.classList.add("hide");
    searchInput.focus();
  });

  searchClose.addEventListener("click", () => {
    searchForm.classList.remove("active");
    navLinks.classList.remove("hide");
    searchInput.value = "";
  });

  // Close search on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (searchForm.classList.contains("active")) {
        searchForm.classList.remove("active");
        navLinks.classList.remove("hide");
        searchInput.value = "";
      }
      if (mobileMenu.classList.contains("active")) {
        hamburgerMenu.classList.remove("active");
        mobileMenu.classList.remove("active");
        body.classList.remove("menu-open");
      }
    }
  });

  // Hamburger menu functionality
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    body.classList.toggle("menu-open");
  });

  // Close mobile menu when clicking a link
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerMenu.classList.remove("active");
      mobileMenu.classList.remove("active");
      body.classList.remove("menu-open");
    });
  });

  // Close mobile menu on window resize (if screen becomes larger)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      hamburgerMenu.classList.remove("active");
      mobileMenu.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Stats Counter Animation
  const statsBanner = document.querySelector(".stats-banner");
  const statPercentages = document.querySelectorAll(".stat-percentage");
  let animated = false;

  // Function to animate counting from 0 to target number
  function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 16ms is approx one frame at 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + "%";
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start) + "%";
      }
    }, 16);
  }

  // Create an Intersection Observer to detect when stats section is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true; // Only animate once

          // Start animation for each percentage with slightly different durations
          statPercentages.forEach((el, index) => {
            const targetValue = parseInt(el.textContent);
            // Clear the percentage text temporarily
            el.textContent = "0%";
            // Add slight delay for each successive number
            setTimeout(() => {
              animateCounter(el, targetValue, 1500 + index * 100);
            }, index * 150);
          });

          // Disconnect observer after animation starts
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  ); // Trigger when 30% of the element is visible

  // Start observing the stats banner
  if (statsBanner) {
    observer.observe(statsBanner);
  }

  // Testimonials Slider Functionality
  const testimonialsWrapper = document.querySelector(".testimonials-wrapper");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const paginationDots = document.querySelectorAll(".pagination-dot");

  if (testimonialsWrapper && testimonialCards.length > 0) {
    let currentIndex = 0;
    const cardCount = testimonialCards.length;

    // Calculate the width of a single testimonial card plus margins and gap
    const getCardWidth = () => {
      const card = testimonialCards[0];
      const cardStyles = window.getComputedStyle(card);
      const cardWidth = card.offsetWidth;
      const marginLeft = parseInt(cardStyles.marginLeft) || 0;
      const marginRight = parseInt(cardStyles.marginRight) || 0;

      // For desktop view, include the gap (20px from CSS)
      if (window.innerWidth >= 1024) {
        return cardWidth + marginLeft + marginRight + 20;
      }

      return cardWidth + marginLeft + marginRight;
    };

    // Function to scroll to a specific testimonial
    const scrollToTestimonial = (index) => {
      if (index < 0 || index >= cardCount) return;

      const cardWidth = getCardWidth();
      testimonialsWrapper.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });

      // Update active pagination dot
      paginationDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      // Update current index
      currentIndex = index;

      // Update button states
      updateButtonStates();
    };

    // Function to update prev/next button states
    const updateButtonStates = () => {
      prevButton.classList.toggle("disabled", currentIndex === 0);
      nextButton.classList.toggle("disabled", currentIndex === cardCount - 1);
    };

    // Next button click handler
    nextButton.addEventListener("click", () => {
      if (currentIndex < cardCount - 1) {
        scrollToTestimonial(currentIndex + 1);
      }
    });

    // Previous button click handler
    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        scrollToTestimonial(currentIndex - 1);
      }
    });

    // Pagination dots click handlers
    paginationDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        scrollToTestimonial(index);
      });
    });

    // Initialize button states
    updateButtonStates();

    // Handle testimonial slider touch events for mobile
    let startX, moveX;

    testimonialsWrapper.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );

    testimonialsWrapper.addEventListener(
      "touchmove",
      (e) => {
        moveX = e.touches[0].clientX;
      },
      { passive: true }
    );

    testimonialsWrapper.addEventListener("touchend", () => {
      if (startX && moveX) {
        const diff = startX - moveX;

        if (Math.abs(diff) > 50) {
          // Swipe threshold
          if (diff > 0 && currentIndex < cardCount - 1) {
            // Swipe left (next)
            scrollToTestimonial(currentIndex + 1);
          } else if (diff < 0 && currentIndex > 0) {
            // Swipe right (prev)
            scrollToTestimonial(currentIndex - 1);
          }
        }
      }

      // Reset values
      startX = null;
      moveX = null;
    });

    // Responsive handling - recalculate positions on resize
    window.addEventListener("resize", () => {
      // Re-scroll to maintain the correct position after resize
      scrollToTestimonial(currentIndex);
    });
  }
});

// Additional style for body when menu is open
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        body.menu-open {
            overflow: hidden;
        }
        
        /* Additional styles for testimonials slider */
        .testimonials-wrapper {
            display: flex;
            overflow-x: hidden;
            scroll-snap-type: x mandatory;
            scrollbar-width: none; /* Hide scrollbar in Firefox */
            -ms-overflow-style: none; /* Hide scrollbar in IE/Edge */
        }
        
        .testimonials-wrapper::-webkit-scrollbar {
            display: none; /* Hide scrollbar in Chrome/Safari */
        }
        
        .testimonial-card {
            flex: 0 0 100%;
            scroll-snap-align: start;
        }
        
        @media (min-width: 768px) {
            .testimonial-card {
                flex: 0 0 calc(50% - 20px);
                margin: 0 10px;
            }
        }
        
        @media (min-width: 1024px) {
            .testimonial-card {
                flex: 0 0 calc(33.333% - 20px);
                margin: 0 10px;
            }
        }
    </style>
`
);
