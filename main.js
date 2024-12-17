  // Check if the user has scrolled to the "Our Listings" section
  window.addEventListener('scroll', function() {
    var section = document.getElementById('our-listings');
    var iframe = document.getElementById('targetIframe');

    // Get the position of the section on the page
    var rect = section.getBoundingClientRect();

    // If the section is in the viewport
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      // Load the other website's content into the iframe
      iframe.src = "https://danielbarroso.premierassociatesrealty.com/";
    }
  });