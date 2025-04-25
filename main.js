document.addEventListener('DOMContentLoaded', function() {
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
      document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Close mobile menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.getElementById('navbarNav');
  const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
              bsCollapse.hide();
          }
      });
  });

  // Update hamburger icon state
  navbarCollapse.addEventListener('hidden.bs.collapse', () => {
      document.querySelector('.navbar-toggler').classList.remove('active');
  });

  navbarCollapse.addEventListener('shown.bs.collapse', () => {
      document.querySelector('.navbar-toggler').classList.add('active');
  });
});

// AOS Script 

document.addEventListener("DOMContentLoaded", function() {
    AOS.init({
        once: false,     // Optional: Make animations repeat when re-entering
        mirror: true     // Optional: Explicitly set mirror globally
    });
});

// Initialize Bootstrap ScrollSpy

var scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#navbarNav',  // Ensure this matches the correct ID
    offset: 50  // Adjust this to control the offset of the scroll trigger
});

// Add the scroll event listener
window.addEventListener('scroll', function () {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

