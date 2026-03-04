document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Active nav indicator via IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(a => a.classList.remove('active'));
                const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close menu on click

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Header transparency on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(13, 13, 18, 0.9)';
            nav.style.padding = '1rem 0';
        } else {
            nav.style.background = 'rgba(13, 13, 18, 0.7)';
            nav.style.padding = '1.5rem 0';
        }
    });

    // Modal Logic
    const modal = document.getElementById('courseModal');

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});

// Open Modal
window.openModal = function (cardElement) {
    const modal = document.getElementById('courseModal');
    const modalBody = document.getElementById('modalBody');

    // Extract content from card
    const imgInfo = cardElement.querySelector('img');
    const imgSrc = imgInfo.src;
    const imgAlt = imgInfo.alt;

    const title = cardElement.querySelector('h3').innerHTML;
    const summary = cardElement.querySelector('.course-summary').innerHTML;
    const details = cardElement.querySelector('.course-details').innerHTML;

    // Inject content into modal
    modalBody.innerHTML = `
        <img src="${imgSrc}" alt="${imgAlt}" class="modal-img">
        <h3>${title}</h3>
        <p class="course-summary">${summary}</p>
        <div class="modal-details">${details}</div>
    `;

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
};

// Close Modal
window.closeModal = function () {
    const modal = document.getElementById('courseModal');
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 300);
};

// Gallery Lightbox Logic
let currentGalleryIndex = 0;

window.openGallery = function (index) {
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('lightboxImg');

    // Dynamically collect images from the DOM to ensure sync with HTML
    const collectedImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => img.src);

    currentGalleryIndex = index;
    img.src = collectedImages[currentGalleryIndex];

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeGallery = function () {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('show');

    // Scroll the background gallery to the current image
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems[currentGalleryIndex]) {
        galleryItems[currentGalleryIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    setTimeout(() => {
        document.body.style.overflow = '';
    }, 300);
};

window.changeSlide = function (step) {
    const collectedImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => img.src);
    currentGalleryIndex += step;

    if (currentGalleryIndex >= collectedImages.length) {
        currentGalleryIndex = 0;
    } else if (currentGalleryIndex < 0) {
        currentGalleryIndex = collectedImages.length - 1;
    }

    const img = document.getElementById('lightboxImg');
    // Simple fade effect
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = collectedImages[currentGalleryIndex];
        img.style.opacity = 1;
    }, 150);
};

// Add keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('galleryModal');
    if (modal && modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        } else if (e.key === 'Escape') {
            closeGallery();
        }
    }
});

// Touch swipe support for gallery lightbox
(function () {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const modal = document.getElementById('galleryModal');
        if (!modal || !modal.classList.contains('show')) return;

        const deltaX = e.changedTouches[0].screenX - touchStartX;
        const deltaY = e.changedTouches[0].screenY - touchStartY;

        // Only trigger if horizontal swipe is dominant and exceeds threshold
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                changeSlide(1);  // Swipe left → next
            } else {
                changeSlide(-1); // Swipe right → previous
            }
        }
    }, { passive: true });
})();

// Close gallery on outside click
const galleryModal = document.getElementById('galleryModal');
if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
        if (e.target.id === 'galleryModal') {
            closeGallery();
        }
    });
}

// Scroll Gallery Logic
window.scrollGallery = function (direction) {
    const container = document.querySelector('.gallery-scroll');
    if (container) {
        // Scroll by one item width + gap (approx)
        // We know we want 3 items visible, so scrolling by clientWidth / 3 is safe
        const scrollAmount = container.clientWidth / 3;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        if (direction === 1 && currentScroll >= maxScroll - 10) {
            // At the end, go back to start
            container.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else if (direction === -1 && currentScroll <= 10) {
            // At the start, go to the end
            container.scrollTo({
                left: maxScroll,
                behavior: 'smooth'
            });
        } else {
            container.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }
    }
};

// EmailJS Configuration and Contact Form Handler
(function () {
    // Initialize EmailJS with your public key
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    // Get it from: https://dashboard.emailjs.com/admin/account
    emailjs.init('ZDUKythU-Ofg8KbGE');
})();

// Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // EmailJS send parameters
            // IMPORTANT: Replace these with your actual EmailJS service ID and template ID
            // Service ID: from https://dashboard.emailjs.com/admin
            // Template ID: from https://dashboard.emailjs.com/admin/templates
            const serviceID = 'service_787x9tb';
            const templateID = 'template_th4mj2j';

            const templateParams = {
                to_email: 'tatarchm@gmail.com',
                from_name: name,
                from_email: email,
                subject: `LOCO School: ${name}`,
                message: message
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);

                    const status = document.getElementById('form-status');
                    status.textContent = 'Thank you! We will get back to you soon.';
                    status.className = 'form-status success';

                    contactForm.reset();

                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }, function (error) {
                    console.error('FAILED...', error);

                    const status = document.getElementById('form-status');
                    status.textContent = 'Something went wrong. Please email us at tatarchm@gmail.com';
                    status.className = 'form-status error';

                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }
});

