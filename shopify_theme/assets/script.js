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
        
        // Close share menu if open
        const shareMenu = document.querySelector('.share-menu');
        const shareToggle = document.querySelector('.share-toggle');
        if (shareMenu && shareMenu.classList.contains('active')) {
            shareMenu.classList.remove('active');
            shareToggle.classList.remove('active');
        }
        
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
    
    // Initialize share navigation
    initShareNavigation();
    
    // Load dynamic footer
    loadDynamicFooter();
    
    // Initialize Live Chat
    initLiveChat();
    
    // Initialize buy buttons to show WhatsApp popup
    const buyButtons = document.querySelectorAll('.buy-btn');
    const whatsappPopup = document.getElementById('whatsapp-popup');
    const closePopup = document.querySelector('.close-popup');
    
    if (buyButtons.length > 0 && whatsappPopup) {
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                whatsappPopup.classList.add('active');
            });
        });
        
        if (closePopup) {
            closePopup.addEventListener('click', function() {
                whatsappPopup.classList.remove('active');
            });
        }
        
        // Close popup when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === whatsappPopup) {
                whatsappPopup.classList.remove('active');
            }
        });
    }
    
    // Update header style on scroll
    updateHeaderStyle();
    window.addEventListener('scroll', updateHeaderStyle);
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

// Function to initialize share navigation
function initShareNavigation() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    if (shareButtons.length === 0) return;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(window.location.href)
                        .then(() => {
                            const originalText = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                            setTimeout(() => {
                                this.innerHTML = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                        });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Toggle share menu
    const shareToggle = document.querySelector('.share-toggle');
    if (shareToggle) {
        shareToggle.addEventListener('click', function() {
            const shareMenu = document.querySelector('.share-menu');
            if (shareMenu) {
                shareMenu.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
        
        // Close share menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.share-navigation')) {
                const shareMenu = document.querySelector('.share-menu');
                const shareToggle = document.querySelector('.share-toggle');
                if (shareMenu && shareMenu.classList.contains('active')) {
                    shareMenu.classList.remove('active');
                    shareToggle.classList.remove('active');
                }
            }
        });
    }
}

// Initialize Live Chat
function initLiveChat() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.getElementById('chat-message-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Toggle chat
    chatToggle.addEventListener('click', function() {
        chatContainer.classList.toggle('active');
        // Focus on input when chat is opened
        if (chatContainer.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    });
    
    // Close chat
    chatClose.addEventListener('click', function() {
        chatContainer.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;
        
        // Create user message element
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <p>${messageText}</p>
            <span class="time">الآن</span>
        `;
        chatMessages.appendChild(userMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after a short delay
        setTimeout(function() {
            const responseMessage = document.createElement('div');
            responseMessage.className = 'message system';
            responseMessage.innerHTML = `
                <p>شكراً لتواصلك معنا. للحصول على مساعدة فورية، يمكنك التواصل معنا مباشرة عبر واتساب.</p>
                <span class="time">الآن</span>
                <a href="https://wa.me/966566310983?text=${encodeURIComponent('مرحباً، لدي استفسار حول ' + messageText)}" target="_blank" class="whatsapp-chat-btn">
                    <i class="fab fa-whatsapp"></i> متابعة المحادثة عبر واتساب
                </a>
            `;
            chatMessages.appendChild(responseMessage);
            
            // Scroll to bottom again
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
} 