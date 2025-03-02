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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'الاسم مطلوب');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'البريد الإلكتروني مطلوب');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'يرجى إدخال بريد إلكتروني صحيح');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'الرسالة مطلوبة');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري الإرسال...';
                
                setTimeout(() => {
                    alert('شكراً لرسالتك! سنتواصل معك قريباً.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1500);
            }
        });
    }
    
    // WhatsApp Popup for Buy buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    const whatsappPopup = document.getElementById('whatsapp-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    
    // Open popup when buy button is clicked
    if (buyButtons.length > 0 && whatsappPopup) {
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const packageName = this.closest('.package').querySelector('h3').textContent;
                // Update popup content with package name
                const popupTitle = whatsappPopup.querySelector('h3');
                if (popupTitle) {
                    popupTitle.textContent = `تواصل معنا لشراء ${packageName}`;
                }
                
                // Show popup
                whatsappPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
        
        // Close popup when close button is clicked
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() {
                whatsappPopup.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            });
        }
        
        // Close popup when clicking outside the popup content
        whatsappPopup.addEventListener('click', function(e) {
            if (e.target === whatsappPopup) {
                whatsappPopup.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        // Open the first FAQ item by default
        faqItems[0].classList.add('active');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle active class on the clicked item
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // If the clicked item wasn't active, make it active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Theme Switcher
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (themeToggleBtn) {
        const themeToggleText = themeToggleBtn.querySelector('span');
        
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Apply the saved theme or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-theme');
            if (themeToggleText) {
                themeToggleText.textContent = 'الوضع المضيء';
            }
            updateHeaderStyle(); // Update header style for dark theme
        } else {
            if (themeToggleText) {
                themeToggleText.textContent = 'الوضع الداكن';
            }
            updateHeaderStyle(); // Update header style for light theme
        }
        
        // Toggle theme when button is clicked
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Update button text based on current theme
            if (document.body.classList.contains('dark-theme')) {
                if (themeToggleText) {
                    themeToggleText.textContent = 'الوضع المضيء';
                }
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeToggleText) {
                    themeToggleText.textContent = 'الوضع الداكن';
                }
                localStorage.setItem('theme', 'light');
            }
            
            // Update header style when theme changes
            updateHeaderStyle();
        });
    }
    
    // Mobile dropdown toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (window.innerWidth <= 768 && dropdownToggles.length > 0) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                const dropdownMenu = parent.querySelector('.dropdown-menu');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdownMenu && menu.classList.contains('show')) {
                        menu.classList.remove('show');
                        const icon = menu.parentElement.querySelector('.dropdown-toggle i');
                        if (icon) {
                            icon.style.transform = 'rotate(0)';
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdownMenu.classList.toggle('show');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = dropdownMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
                }
            });
        });
    }
    
    // Helper functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'red';
    }
    
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Load the dynamic footer
    loadDynamicFooter();
});

// Dynamic Footer Function
function loadDynamicFooter() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (!footerContainer) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isIndex = currentPage === 'index.html' || currentPage === '';
    
    const footerContent = `
        <div class="footer-content">
            <div class="footer-logo">
                <img src="saudi1.png" alt="شعار سوق الأميال السعودي">
                <p>رحلتك تبدأ معنا</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h3>روابط سريعة</h3>
                    <ul>
                        <li><a href="${isIndex ? '#home' : 'index.html#home'}">الرئيسية</a></li>
                        <li><a href="${isIndex ? '#miles' : 'index.html#miles'}">الأميال</a></li>
                        <li><a href="${isIndex ? '#contact' : 'index.html#contact'}">اتصل بنا</a></li>
                        <li><a href="faq.html">الأسئلة الشائعة</a></li>
                    </ul>
                </div>
                <div class="link-group">
                    <h3>الخدمات</h3>
                    <ul>
                        <li><a href="${isIndex ? '#miles' : 'index.html#miles'}">شراء الأميال</a></li>
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
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2023 سوق الأميال السعودي. جميع الحقوق محفوظة.</p>
            <div class="payment-methods">
                <div class="bank-tooltip">
                    <img src="images/banks/alrajhi.svg" alt="مصرف الراجحي" class="bank-logo">
                    <span class="bank-name"><i class="fas fa-university"></i> مصرف الراجحي</span>
                </div>
                <div class="bank-tooltip">
                    <img src="images/banks/alahli.png" alt="البنك الأهلي" class="bank-logo">
                    <span class="bank-name"><i class="fas fa-landmark"></i> البنك الأهلي</span>
                </div>
                <div class="bank-tooltip">
                    <img src="images/banks/alinma.webp" alt="مصرف الإنماء" class="bank-logo">
                    <span class="bank-name"><i class="fas fa-mosque"></i> مصرف الإنماء</span>
                </div>
                <div class="bank-tooltip">
                    <img src="images/banks/riyad.png" alt="بنك الرياض" class="bank-logo">
                    <span class="bank-name"><i class="fas fa-city"></i> بنك الرياض</span>
                </div>
            </div>
        </div>
    `;
    
    footerContainer.innerHTML = footerContent;
} 