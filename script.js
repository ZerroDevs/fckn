// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sticky Header
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    function updateHeaderStyle() {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        if (window.scrollY > 50) {
            if (isDarkTheme) {
                header.style.backgroundColor = 'rgba(33, 33, 33, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        } else {
            if (isDarkTheme) {
                header.style.backgroundColor = '#212121';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'white';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    }
    
    // Initial header style
    updateHeaderStyle();
    
    // Update header on scroll
    window.addEventListener('scroll', updateHeaderStyle);
    
    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    
    themeToggleBtn.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Close all dropdowns when toggling menu
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
            toggle.nextElementSibling.classList.remove('show');
            const icon = toggle.querySelector('i');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });
            
            // Adjust hero section when menu is open on mobile
            const hero = document.querySelector('.hero');
            if (hero && window.innerWidth <= 768) {
            if (body.classList.contains('menu-open')) {
                    hero.style.marginTop = nav.offsetHeight + 'px';
                } else {
                    hero.style.marginTop = '0';
                }
            }
        });
        
        menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
            nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Close all dropdowns when closing menu
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
            toggle.nextElementSibling.classList.remove('show');
            const icon = toggle.querySelector('i');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });
            
            // Reset hero margin when closing menu
            const hero = document.querySelector('.hero');
            if (hero && window.innerWidth <= 768) {
                hero.style.marginTop = '0';
            }
        });
        
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Close all dropdowns on resize to desktop
            dropdownToggles.forEach(toggle => {
                toggle.classList.remove('active');
                toggle.nextElementSibling.classList.remove('show');
                const icon = toggle.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
            
            // Reset hero margin on larger screens
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.marginTop = '0';
            }
        }
    });
    
    // Update header style on scroll
            updateHeaderStyle();
    window.addEventListener('scroll', updateHeaderStyle);
    
    // Mobile dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = this.classList.contains('active');
                
                // Close other open dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove('active');
                        otherToggle.nextElementSibling.classList.remove('show');
                        const otherIcon = otherToggle.querySelector('i');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current dropdown
                this.classList.toggle('active');
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('show');
                
                // Rotate icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = !isActive ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.dropdown')) {
            dropdownToggles.forEach(toggle => {
                toggle.classList.remove('active');
                toggle.nextElementSibling.classList.remove('show');
                const icon = toggle.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
        }
    });
    
    // Prevent dropdown menu clicks from closing the dropdown
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
            }
        });
    });
    
    // FAQ accordion functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');
            
            // Toggle current FAQ item
            faqItem.classList.toggle('active');
            
            // Toggle icon rotation
            icon.style.transform = faqItem.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            
            // Toggle answer visibility with smooth animation
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Initialize slider if it exists
    initSlider();
    
    // Load dynamic footer
    loadDynamicFooter();
});

// Function to update header style on scroll
function updateHeaderStyle() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Function to initialize slider
function initSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Show first slide
    slides[0].classList.add('active');
    
    // Auto slide function
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Set interval for auto sliding
    setInterval(nextSlide, 5000);
}

// Function to load dynamic footer
function loadDynamicFooter() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (!footerContainer) return;
    
    const footerContent = `
        <div class="footer-content">
            <div class="footer-logo">
                <img src="saudi1.png" alt="شعار سوق الأميال السعودي">
                <p>سوق الأميال السعودي - وجهتك الأولى لشراء أميال الخطوط السعودية</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h3>روابط سريعة</h3>
                    <ul>
                        <li><a href="index.html#home">الرئيسية</a></li>
                        <li><a href="index.html#miles">الأميال</a></li>
                        <li><a href="index.html#contact">اتصل بنا</a></li>
                    </ul>
                </div>
                <div class="link-group">
                    <h3>الدعم</h3>
                    <ul>
                        <li><a href="faq.html">الأسئلة الشائعة</a></li>
                        <li><a href="terms.html">الشروط والأحكام</a></li>
                        <li><a href="refund.html">سياسة الاسترداد</a></li>
                    </ul>
                </div>
                <div class="link-group">
                    <h3>تواصل معنا</h3>
                    <ul>
                        <li><a href="tel:+966566310983">0566310983</a></li>
                        <li><a href="mailto:info@saudi-mile-market.com">info@saudi-mile-market.com</a></li>
                        <li><a href="https://wa.me/966566310983" target="_blank">واتساب</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2024 سوق الأميال السعودي. جميع الحقوق محفوظة.</p>
        </div>
    `;
    
    footerContainer.innerHTML = footerContent;
} 