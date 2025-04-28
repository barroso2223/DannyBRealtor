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

    // --- AOS SCRIPT ---
    const cards = document.querySelectorAll('[data-aos], .responsive-aos');
    const isMobile = window.innerWidth <= 768; // Adjust this breakpoint if needed

    cards.forEach(card => {
        let desktopAos = card.getAttribute('data-desktop-aos');
        let mobileAos = card.getAttribute('data-mobile-aos');

        if (isMobile && mobileAos) {
            card.setAttribute('data-aos', mobileAos);
        } else if (desktopAos) {
            card.setAttribute('data-aos', desktopAos);
        }
    });

    // IMPORTANT: Now initialize AOS AFTER setting data-aos
    AOS.init({
        once: false, 
        mirror: true
    });

    AOS.refresh();

    // ScrollSpy
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbarNav',
        offset: 50
    });

    // Navbar scroll class
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
