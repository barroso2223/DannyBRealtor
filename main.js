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