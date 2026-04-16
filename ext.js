document.addEventListener("DOMContentLoaded", () => {

  // --- Social Icons ---
  const socialLinks = [
    { id: "insta-btn",           url: "https://www.instagram.com/pranavipaudel/" },
    { id: "insta-btn-footer",    url: "https://www.instagram.com/pranavipaudel/" },
    { id: "linkedin-btn",        url: "https://www.linkedin.com/in/pranavi-paudel/" },
    { id: "linkedin-btn-footer", url: "https://www.linkedin.com/in/pranavi-paudel/" },
    { id: "email-btn",           url: "mailto:pp892@msstate.edu" },
    { id: "email-btn-footer",    url: "mailto:pp892@msstate.edu" }
  ];
  socialLinks.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) el.addEventListener("click", () => window.open(link.url, "_blank"));
  });

  // --- Hide nav link for current page ---
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const homeLink    = document.querySelector('.nav a[href="index.html"]');
  const profileLink = document.querySelector('.nav a[href="Pranavi.html"], .nav a[href="profile.html"]');
  if (currentPage === "index.html" && homeLink) homeLink.style.display = "none";
  else if ((currentPage === "Pranavi.html" || currentPage === "profile.html") && profileLink) profileLink.style.display = "none";

  // --- Nav shadow on scroll ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 4px 22px rgba(94,40,64,0.13)'
        : 'none';
    }, { passive: true });
  }

  // --- Lightbox ---
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    // Open on any image with class lightbox-trigger
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close on button
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 200);
    }
  }

});
