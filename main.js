document.addEventListener('DOMContentLoaded', function() {
  // Initialize Hamburger Menu
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');
  const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

  navbarToggler.addEventListener('click', function() {
      bsCollapse.toggle();
      this.classList.toggle('active');
  });

  // Close menu on mobile link click
  document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
              bsCollapse.hide();
              navbarToggler.classList.remove('active');
          }
      });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
      if (window.innerWidth < 992 && 
          !e.target.closest('.navbar') && 
          navbarCollapse.classList.contains('show')) {
          bsCollapse.hide();
          navbarToggler.classList.remove('active');
      }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
      document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
});