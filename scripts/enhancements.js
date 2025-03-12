// Smooth Sliding Animations
function initSmoothAnimations() {
    // Initialize slide-in animations
    const slideElements = {
        right: document.querySelectorAll('.slide-in-right'),
        left: document.querySelectorAll('.slide-in-left'),
        up: document.querySelectorAll('.slide-in-up'),
        down: document.querySelectorAll('.slide-in-down')
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-visible');
            }
        });
    }, { threshold: 0.2 });

    // Observe all slide elements
    Object.values(slideElements).forEach(elements => {
        elements.forEach(el => observer.observe(el));
    });

    // Initialize staggered animations
    const staggerContainers = document.querySelectorAll('.stagger-animation');
    staggerContainers.forEach(container => {
        const children = container.children;
        [...children].forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(child);
        });
    });
}

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

// Initialize Interactive Footer
function initInteractiveFooter() {
    // Add entrance animations to footer sections
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.classList.add('slide-in-up');
    }
    
    // Animate footer link groups with staggered effect
    const linkGroups = document.querySelectorAll('.footer-links .link-group');
    linkGroups.forEach((group, index) => {
        group.classList.add('slide-in-up');
        group.style.transitionDelay = `${0.1 * index}s`;
    });
    
    // Animate bank logos with staggered effect
    const bankLogos = document.querySelectorAll('.payment-methods .bank-logo');
    bankLogos.forEach((logo, index) => {
        logo.classList.add('slide-in-up');
        logo.style.transitionDelay = `${0.05 * index}s`;
        
        // Add interactive tooltip functionality
        logo.addEventListener('mouseenter', function(e) {
            // Create tooltip if not already present
            if (!this.querySelector('.interactive-tooltip')) {
                const bankName = this.getAttribute('data-bank') || 'البنك';
                const tooltip = document.createElement('div');
                tooltip.className = 'interactive-tooltip';
                tooltip.innerHTML = `<span>${bankName}</span>`;
                this.appendChild(tooltip);
                
                // Position the tooltip
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }, 10);
            }
        });
        
        logo.addEventListener('mouseleave', function(e) {
            const tooltip = this.querySelector('.interactive-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }
        });
    });
    
    // Add ripple effect to footer buttons and links
    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(link => {
        link.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Observe footer to trigger animations when visible
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animatedElements = entry.target.querySelectorAll('.slide-in-up, .slide-in-right, .slide-in-left');
                animatedElements.forEach(el => {
                    el.classList.add('slide-visible');
                });
            }
        });
    }, { threshold: 0.2 });
    
    const footer = document.querySelector('footer');
    if (footer) {
        footerObserver.observe(footer);
    }
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    initSmoothAnimations();
    initScrollAnimations();
    initFormFeedback();
    initFloatingActionButton();
    initGallery();
    initInteractiveFooter();
});

// Add scroll animations to existing elements
document.querySelectorAll('.package').forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.miles-highlight, .contact-form, .faq-item, .terms-item, .refund-item').forEach(el => {
    el.classList.add('slide-up');
}); 