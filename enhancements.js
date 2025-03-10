// Scroll Animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideElements = document.querySelectorAll('.slide-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
    slideElements.forEach(el => observer.observe(el));
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Form Feedback
function initFormFeedback() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.checkValidity()) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.checkValidity()) {
                showToast('تم إرسال النموذج بنجاح!', 'success');
                form.reset();
            } else {
                showToast('يرجى التحقق من جميع الحقول المطلوبة', 'error');
            }
        });
    });
}

// Floating Action Button
function initFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-btn';
    fab.innerHTML = `
        <button class="main-btn">
            <i class="fas fa-headset"></i>
        </button>
        <div class="sub-buttons">
            <a href="https://wa.me/966566310983" class="sub-btn whatsapp" target="_blank">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+966566310983" class="sub-btn phone">
                <i class="fas fa-phone"></i>
            </a>
            <a href="#contact" class="sub-btn message">
                <i class="fas fa-envelope"></i>
            </a>
        </div>
    `;
    document.body.appendChild(fab);
}

// Image Gallery
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;

    galleryContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const img = item.querySelector('img');
        if (!img) return;

        // Create modal for full-size image
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="gallery-modal-close">&times;</button>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'gallery-modal-close') {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFormFeedback();
    initFloatingActionButton();
    initGallery();
});

// Add scroll animations to existing elements
document.querySelectorAll('.package').forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.miles-highlight, .contact-form, .faq-item, .terms-item, .refund-item').forEach(el => {
    el.classList.add('slide-up');
}); 