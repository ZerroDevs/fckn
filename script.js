// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language selector and translations first
    let currentLanguage = localStorage.getItem('language') || 'ar';
    const supportedLanguages = ['ar', 'en', 'de'];

    // Immediately set the document language based on saved preference but always use LTR direction
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = 'ltr'; // Always use LTR direction regardless of language

    // CRITICAL: Pre-load the footer with the correct language BEFORE any other operations
    preloadFooterWithCorrectLanguage();

    // Initialize language selector
    initLanguageSelector();
    
    // Apply translations immediately to prevent flashing of untranslated content
    updateAllTranslations();

    // Lazy load other components
    window.addEventListener('load', function() {
        // Initialize other components after page load
        initThemeToggle();
        initMobileMenu();
        initShareNavigation();
        initLiveChat();
        
        // Initialize sliders if they exist
        if (document.querySelector('.slider')) {
            initSlider();
        }
        
        // Initialize FAQ toggles if they exist
        if (document.querySelector('.faq-item')) {
            initFaqToggles();
        }
        
        // Initialize Terms toggles if on Terms page
        if (document.querySelector('.terms-section')) {
            initTermsToggles();
        }
        
        // Initialize Refund toggles if on Refund page
        if (document.querySelector('.refund-section')) {
            initRefundToggles();
        }
    });

    // Sticky Header
    const header = document.querySelector('header');
    
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
    
    // Initialize theme toggle functionality
    function initThemeToggle() {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (!themeToggleBtn) return;
        
        const body = document.body;
        
        // Check for saved theme preference or use default
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.classList.toggle('dark-theme', savedTheme === 'dark');
        
        themeToggleBtn.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            
            // Update header style when theme changes
            updateHeaderStyle();
        });
    }
    
    // Initialize mobile menu functionality
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('nav');
        const menuOverlay = document.querySelector('.menu-overlay');
        const body = document.body;
        const menuLinks = document.querySelectorAll('nav a:not(.dropdown-toggle)');
        
        if (!menuToggle || !nav || !menuOverlay) return;
        
        function closeMenu() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Close all dropdowns
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            dropdownToggles.forEach(toggle => {
                toggle.classList.remove('active');
                const dropdownMenu = toggle.nextElementSibling;
                if (dropdownMenu) dropdownMenu.classList.remove('show');
                const icon = toggle.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
        }
        
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking on links
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Initialize dropdown toggles for mobile
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove('active');
                        const otherMenu = otherToggle.nextElementSibling;
                        if (otherMenu) otherMenu.classList.remove('show');
                        const otherIcon = otherToggle.querySelector('i');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                this.classList.toggle('active');
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('show');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                dropdownToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                    const dropdownMenu = toggle.nextElementSibling;
                    if (dropdownMenu) dropdownMenu.classList.remove('show');
                    const icon = toggle.querySelector('i');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                });
            }
        });
    }
    
    // Initialize FAQ toggles
    function initFaqToggles() {
        const faqItems = document.querySelectorAll('.faq-item');
        const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
        const searchInput = document.getElementById('faq-search-input');
        const searchClearBtn = document.getElementById('faq-search-clear');
        const resetSearchBtn = document.querySelector('.reset-search-btn');
        const noResultsSection = document.querySelector('.faq-no-results');
        
        // Add animation classes to FAQ items with a staggered delay
        faqItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.5s ease forwards';
                item.style.opacity = '1';
            }, index * 100);
        });

        // Initialize FAQ toggles
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Set initial state
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.transform = 'translateY(0)';
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.transform = 'translateY(-10px)';
            }
            
            question.addEventListener('click', () => {
                // Toggle active class
                const isActive = item.classList.contains('active');
                
                // Close all other items first
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                        otherAnswer.style.transform = 'translateY(-10px)';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                    answer.style.transform = 'translateY(-10px)';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    answer.style.transform = 'translateY(0)';
                }
            });
            
            // Add hover effect
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    question.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    question.style.backgroundColor = '';
                }
            });
        });
        
        // Category filtering
        if (faqCategoryBtns.length > 0) {
            faqCategoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    faqCategoryBtns.forEach(otherBtn => {
                        otherBtn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    btn.classList.add('active');
                    
                    const category = btn.getAttribute('data-category');
                    
                    // Filter items
                    filterFaqItems(category, searchInput.value.trim());
                });
            });
        }
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchValue = searchInput.value.trim();
                const activeCategory = document.querySelector('.faq-category-btn.active');
                const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
                
                // Show/hide clear button
                if (searchValue.length > 0) {
                    searchClearBtn.classList.add('visible');
                } else {
                    searchClearBtn.classList.remove('visible');
                }
                
                // Filter items
                filterFaqItems(category, searchValue);
            });
            
            // Clear search
            if (searchClearBtn) {
                searchClearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClearBtn.classList.remove('visible');
                    
                    const activeCategory = document.querySelector('.faq-category-btn.active');
                    const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
                    
                    // Filter items
                    filterFaqItems(category, '');
                });
            }
            
            // Reset search button
            if (resetSearchBtn) {
                resetSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClearBtn.classList.remove('visible');
                    
                    // Reset category to "all"
                    faqCategoryBtns.forEach(btn => {
                        if (btn.getAttribute('data-category') === 'all') {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                    
                    // Show all items
                    filterFaqItems('all', '');
                });
            }
        }
        
        // Filter FAQ items based on category and search
        function filterFaqItems(category, searchValue) {
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                const matchesCategory = category === 'all' || itemCategory === category;
                const matchesSearch = searchValue === '' || 
                                     questionText.includes(searchValue.toLowerCase()) || 
                                     answerText.includes(searchValue.toLowerCase());
                
                if (matchesCategory && matchesSearch) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            if (visibleCount === 0 && noResultsSection) {
                noResultsSection.style.display = 'block';
            } else if (noResultsSection) {
                noResultsSection.style.display = 'none';
            }
        }
    }

    // Function to preload the footer with the correct language immediately
    function preloadFooterWithCorrectLanguage() {
        const footerContent = document.getElementById('dynamic-footer');
        if (!footerContent) return;

        // Set the footer HTML content
        footerContent.innerHTML = `
            <div class="footer-content">
                <div class="footer-logo">
                    <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg" class="airline-logo">
                        <defs>
                            <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#1e88e5" />
                                <stop offset="100%" stop-color="#0d47a1" />
                            </linearGradient>
                        </defs>
                        <path d="M30,10 C20,10 15,15 15,25 C15,35 20,40 30,40 C40,40 45,35 45,25 C45,15 40,10 30,10 Z" fill="url(#footerLogoGradient)" />
                        <path d="M75,10 L60,40 L65,40 L80,10 Z" fill="#1e88e5" />
                        <path d="M85,10 L70,40 L75,40 L90,10 Z" fill="#1e88e5" />
                        <path d="M10,25 L50,25 L45,30 L15,30 Z" fill="white" />
                        <path d="M30,15 L40,25 L30,35 L20,25 Z" fill="white" />
                        <path d="M95,15 L135,15 L135,20 L95,20 Z" fill="#1e88e5" />
                        <path d="M95,25 L125,25 L125,30 L95,30 Z" fill="#1e88e5" />
                        <path d="M95,35 L115,35 L115,40 L95,40 Z" fill="#1e88e5" />
                    </svg>
                    <p data-translate="footer.logo.description">سوق الأميال السعودي - وجهتك الأولى لشراء أميال الخطوط السعودية</p>
                </div>
                <div class="footer-links">
                    <div class="link-group">
                        <h3 data-translate="footer.quickLinks.title">روابط سريعة</h3>
                        <ul>
                            <li><a href="index.html" data-translate="footer.quickLinks.home">الرئيسية</a></li>
                            <li><a href="index.html#miles" data-translate="footer.quickLinks.miles">الأميال</a></li>
                            <li><a href="index.html#contact" data-translate="footer.quickLinks.contact">اتصل بنا</a></li>
                            <li><a href="faq.html" data-translate="footer.quickLinks.faq">الأسئلة الشائعة</a></li>
                            <li><a href="terms.html" data-translate="footer.quickLinks.terms">الشروط والأحكام</a></li>
                            <li><a href="refund.html" data-translate="footer.quickLinks.refund">سياسة الاسترداد</a></li>
                        </ul>
                    </div>
                    <div class="link-group">
                        <h3 data-translate="footer.contact.title">تواصل معنا</h3>
                        <ul>
                            <li><i class="fas fa-phone"></i> <span data-translate="footer.contact.phone">0566310983</span></li>
                            <li><i class="fas fa-envelope"></i> <span data-translate="footer.contact.email">info@saudi-mile-market.com</span></li>
                            <li><a href="https://wa.me/966566310983" target="_blank"><i class="fab fa-whatsapp"></i> <span data-translate="footer.contact.whatsapp">واتساب</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p data-translate="footer.copyright">© 2024 سوق الأميال السعودي. جميع الحقوق محفوظة.</p>
            </div>
        `;

        // Immediately apply translations to the footer content
        const footerElements = document.querySelectorAll('#dynamic-footer [data-translate]');
        footerElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            // Get translation directly from the translations object
            let translation = translations[currentLanguage];
            const keys = key.split('.');
            
            for (const k of keys) {
                if (translation && translation[k]) {
                    translation = translation[k];
                } else {
                    translation = null;
                    break;
                }
            }
            
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    // Function to initialize language selector
    function initLanguageSelector() {
        // Add language selector to navigation
        const nav = document.querySelector('nav ul');
        if (!nav) return;

        // Check if language selector already exists
        if (nav.querySelector('.language-selector')) return;

        const languageSelector = document.createElement('li');
        languageSelector.className = 'language-selector';
        languageSelector.innerHTML = `
            <button class="language-toggle">
                <i class="fas fa-globe"></i>
                <span class="current-lang">${currentLanguage.toUpperCase()}</span>
            </button>
            <ul class="language-menu">
                <li><a href="#" data-lang="ar" ${currentLanguage === 'ar' ? 'class="active"' : ''}>العربية</a></li>
                <li><a href="#" data-lang="en" ${currentLanguage === 'en' ? 'class="active"' : ''}>English</a></li>
                <li><a href="#" data-lang="de" ${currentLanguage === 'de' ? 'class="active"' : ''}>Deutsch</a></li>
            </ul>
        `;
        nav.appendChild(languageSelector);

        // Add event listeners for language switching
        const languageMenu = languageSelector.querySelector('.language-menu');
        const languageToggle = languageSelector.querySelector('.language-toggle');
        
        languageToggle.addEventListener('click', () => {
            languageMenu.classList.toggle('active');
        });

        languageMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const newLang = e.target.dataset.lang;
                if (newLang !== currentLanguage) {
                    switchLanguage(newLang);
                }
                languageMenu.classList.remove('active');
            }
        });

        // Close language menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSelector.contains(e.target)) {
                languageMenu.classList.remove('active');
            }
        });
    }

    // Function to switch language
    function switchLanguage(lang) {
        if (!supportedLanguages.includes(lang)) return;
        
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = 'ltr'; // Always use LTR direction regardless of language
        
        // Update language selector text
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }

        // Update active state in language menu
        const languageLinks = document.querySelectorAll('.language-menu a');
        languageLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.lang === lang);
        });
        
        // Update all translatable elements including the footer
        updateAllTranslations();
        
        // Reload the footer to ensure it's properly translated
        loadDynamicFooter();
    }

    // Function to update all translations on the page
    function updateAllTranslations() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update all elements with data-translate-placeholder attribute
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Always use LTR direction regardless of language
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = currentLanguage;

        // Update document title
        const pageTitle = document.querySelector('title');
        if (pageTitle) {
            const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
            let titleKey = 'title';
            switch(currentPage) {
                case 'faq':
                    titleKey = 'faq.title';
                    break;
                case 'terms':
                    titleKey = 'terms.title';
                    break;
                case 'refund':
                    titleKey = 'refund.title';
                    break;
                default:
                    titleKey = 'nav.home';
            }
            pageTitle.textContent = `${getTranslation('nav.home')} - ${getTranslation(titleKey)}`;
        }
    }

    // Function to get translation for a key
    function getTranslation(key) {
        const keys = key.split('.');
        let translation = translations[currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        
        return translation;
    }

    // Function to initialize Terms toggles and filters
    function initTermsToggles() {
        const termsItems = document.querySelectorAll('.terms-item');
        const termsCategoryButtons = document.querySelectorAll('.terms-category-btn');
        const termsSearchInput = document.getElementById('terms-search-input');
        const termsClearButton = document.getElementById('terms-clear-button');
        const termsResetButton = document.getElementById('terms-reset-button');
        const termsNoResults = document.querySelector('.terms-no-results');

        // Add animation classes with staggered delay
        termsItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.classList.add('fade-in-up');
            }, 100 * index);
        });

        // Set initial state of terms answers
        termsItems.forEach(item => {
            const termsAnswer = item.querySelector('.terms-answer');
            if (item.classList.contains('active')) {
                termsAnswer.style.maxHeight = termsAnswer.scrollHeight + 'px';
                termsAnswer.style.opacity = '1';
            } else {
                termsAnswer.style.maxHeight = '0';
                termsAnswer.style.opacity = '0';
            }
        });

        // Add click event to terms questions
        termsItems.forEach(item => {
            const termsQuestion = item.querySelector('.terms-question');
            const termsAnswer = item.querySelector('.terms-answer');

            termsQuestion.addEventListener('click', () => {
                // Close other items
                termsItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.terms-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                    }
                });

                // Toggle active class
                const isActive = item.classList.toggle('active');
                
                // Animate the answer
                if (isActive) {
                    termsAnswer.style.maxHeight = termsAnswer.scrollHeight + 'px';
                    termsAnswer.style.opacity = '1';
                } else {
                    termsAnswer.style.maxHeight = '0';
                    termsAnswer.style.opacity = '0';
                }
            });

            // Add hover effect
            termsQuestion.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    termsQuestion.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
                }
            });

            termsQuestion.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    termsQuestion.style.backgroundColor = '';
                }
            });
        });

        // Add click event to category buttons
        termsCategoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                termsCategoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get the category from the button's data attribute
                const category = button.getAttribute('data-category');
                
                // Filter the terms items
                filterTermsItems(category, termsSearchInput.value.toLowerCase());
            });
        });

        // Add input event to search input
        termsSearchInput.addEventListener('input', () => {
            const activeCategory = document.querySelector('.terms-category-btn.active');
            const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
            
            filterTermsItems(category, termsSearchInput.value.toLowerCase());
            
            // Show/hide clear button
            if (termsSearchInput.value.length > 0) {
                termsClearButton.style.display = 'flex';
            } else {
                termsClearButton.style.display = 'none';
            }
        });

        // Add click event to clear button
        if (termsClearButton) {
            termsClearButton.addEventListener('click', () => {
                termsSearchInput.value = '';
                termsClearButton.style.display = 'none';
                
                const activeCategory = document.querySelector('.terms-category-btn.active');
                const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
                
                filterTermsItems(category, '');
            });
        }

        // Add click event to reset button
        if (termsResetButton) {
            termsResetButton.addEventListener('click', () => {
                // Clear search input
                termsSearchInput.value = '';
                termsClearButton.style.display = 'none';
                
                // Reset category buttons
                termsCategoryButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('.terms-category-btn[data-category="all"]').classList.add('active');
                
                // Show all terms items
                filterTermsItems('all', '');
            });
        }
    }

    // Filter terms items based on category and search input
    function filterTermsItems(category, searchValue) {
        const termsItems = document.querySelectorAll('.terms-item');
        const termsNoResults = document.querySelector('.terms-no-results');
        let visibleCount = 0;

        termsItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const termsQuestion = item.querySelector('.terms-question h3');
            const termsAnswer = item.querySelector('.terms-answer');
            
            // Check if the item matches the selected category
            const categoryMatch = category === 'all' || itemCategory === category;
            
            // Check if the item matches the search value
            const searchMatch = searchValue === '' || 
                termsQuestion.textContent.toLowerCase().includes(searchValue) || 
                termsAnswer.textContent.toLowerCase().includes(searchValue);
            
            // Show/hide the item based on category and search matches
            if (categoryMatch && searchMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (termsNoResults) {
            if (visibleCount === 0) {
                termsNoResults.style.display = 'block';
            } else {
                termsNoResults.style.display = 'none';
            }
        }
    }

    // Function to initialize Refund toggles and filters
    function initRefundToggles() {
        const refundItems = document.querySelectorAll('.refund-item');
        const refundCategoryButtons = document.querySelectorAll('.refund-category-btn');
        const refundSearchInput = document.getElementById('refund-search-input');
        const refundClearButton = document.getElementById('refund-clear-button');
        const refundResetButton = document.getElementById('refund-reset-button');
        const refundNoResults = document.querySelector('.refund-no-results');

        // Add animation classes with staggered delay
        refundItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.classList.add('fade-in-up');
            }, 100 * index);
        });

        // Set initial state of refund answers
        refundItems.forEach(item => {
            const refundAnswer = item.querySelector('.refund-answer');
            if (item.classList.contains('active')) {
                refundAnswer.style.maxHeight = refundAnswer.scrollHeight + 'px';
                refundAnswer.style.opacity = '1';
            } else {
                refundAnswer.style.maxHeight = '0';
                refundAnswer.style.opacity = '0';
            }
        });

        // Add click event to refund questions
        refundItems.forEach(item => {
            const refundQuestion = item.querySelector('.refund-question');
            const refundAnswer = item.querySelector('.refund-answer');

            refundQuestion.addEventListener('click', () => {
                // Close other items
                refundItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.refund-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                    }
                });

                // Toggle active class
                const isActive = item.classList.toggle('active');
                
                // Animate the answer
                if (isActive) {
                    refundAnswer.style.maxHeight = refundAnswer.scrollHeight + 'px';
                    refundAnswer.style.opacity = '1';
                } else {
                    refundAnswer.style.maxHeight = '0';
                    refundAnswer.style.opacity = '0';
                }
            });

            // Add hover effect
            refundQuestion.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    refundQuestion.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
                }
            });

            refundQuestion.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    refundQuestion.style.backgroundColor = '';
                }
            });
        });

        // Add click event to category buttons
        refundCategoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                refundCategoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get the category from the button's data attribute
                const category = button.getAttribute('data-category');
                
                // Filter the refund items
                filterRefundItems(category, refundSearchInput.value.toLowerCase());
            });
        });

        // Add input event to search input
        refundSearchInput.addEventListener('input', () => {
            const activeCategory = document.querySelector('.refund-category-btn.active');
            const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
            
            filterRefundItems(category, refundSearchInput.value.toLowerCase());
            
            // Show/hide clear button
            if (refundSearchInput.value.length > 0) {
                refundClearButton.style.display = 'flex';
            } else {
                refundClearButton.style.display = 'none';
            }
        });

        // Add click event to clear button
        if (refundClearButton) {
            refundClearButton.addEventListener('click', () => {
                refundSearchInput.value = '';
                refundClearButton.style.display = 'none';
                
                const activeCategory = document.querySelector('.refund-category-btn.active');
                const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
                
                filterRefundItems(category, '');
            });
        }

        // Add click event to reset button
        if (refundResetButton) {
            refundResetButton.addEventListener('click', () => {
                // Clear search input
                refundSearchInput.value = '';
                refundClearButton.style.display = 'none';
                
                // Reset category buttons
                refundCategoryButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('.refund-category-btn[data-category="all"]').classList.add('active');
                
                // Show all refund items
                filterRefundItems('all', '');
            });
        }
    }

    // Filter refund items based on category and search input
    function filterRefundItems(category, searchValue) {
        const refundItems = document.querySelectorAll('.refund-item');
        const refundNoResults = document.querySelector('.refund-no-results');
        let visibleCount = 0;

        refundItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const refundQuestion = item.querySelector('.refund-question h3');
            const refundAnswer = item.querySelector('.refund-answer');
            
            // Check if the item matches the selected category
            const categoryMatch = category === 'all' || itemCategory === category;
            
            // Check if the item matches the search value
            const searchMatch = searchValue === '' || 
                refundQuestion.textContent.toLowerCase().includes(searchValue) || 
                refundAnswer.textContent.toLowerCase().includes(searchValue);
            
            // Show/hide the item based on category and search matches
            if (categoryMatch && searchMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (refundNoResults) {
            if (visibleCount === 0) {
                refundNoResults.style.display = 'block';
            } else {
                refundNoResults.style.display = 'none';
            }
        }
    }
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
    const footerContent = document.getElementById('dynamic-footer');
    if (!footerContent) return;

    // Set the footer HTML content
    footerContent.innerHTML = `
        <div class="footer-content">
            <div class="footer-logo">
                <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg" class="airline-logo">
                    <defs>
                        <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#1e88e5" />
                            <stop offset="100%" stop-color="#0d47a1" />
                        </linearGradient>
                    </defs>
                    <path d="M30,10 C20,10 15,15 15,25 C15,35 20,40 30,40 C40,40 45,35 45,25 C45,15 40,10 30,10 Z" fill="url(#footerLogoGradient)" />
                    <path d="M75,10 L60,40 L65,40 L80,10 Z" fill="#1e88e5" />
                    <path d="M85,10 L70,40 L75,40 L90,10 Z" fill="#1e88e5" />
                    <path d="M10,25 L50,25 L45,30 L15,30 Z" fill="white" />
                    <path d="M30,15 L40,25 L30,35 L20,25 Z" fill="white" />
                    <path d="M95,15 L135,15 L135,20 L95,20 Z" fill="#1e88e5" />
                    <path d="M95,25 L125,25 L125,30 L95,30 Z" fill="#1e88e5" />
                    <path d="M95,35 L115,35 L115,40 L95,40 Z" fill="#1e88e5" />
                </svg>
                <p data-translate="footer.logo.description">سوق الأميال السعودي - وجهتك الأولى لشراء أميال الخطوط السعودية</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h3 data-translate="footer.quickLinks.title">روابط سريعة</h3>
                    <ul>
                        <li><a href="index.html" data-translate="footer.quickLinks.home">الرئيسية</a></li>
                        <li><a href="index.html#miles" data-translate="footer.quickLinks.miles">الأميال</a></li>
                        <li><a href="index.html#contact" data-translate="footer.quickLinks.contact">اتصل بنا</a></li>
                        <li><a href="faq.html" data-translate="footer.quickLinks.faq">الأسئلة الشائعة</a></li>
                        <li><a href="terms.html" data-translate="footer.quickLinks.terms">الشروط والأحكام</a></li>
                        <li><a href="refund.html" data-translate="footer.quickLinks.refund">سياسة الاسترداد</a></li>
                    </ul>
                </div>
                <div class="link-group">
                    <h3 data-translate="footer.contact.title">تواصل معنا</h3>
                    <ul>
                        <li><i class="fas fa-phone"></i> <span data-translate="footer.contact.phone">0566310983</span></li>
                        <li><i class="fas fa-envelope"></i> <span data-translate="footer.contact.email">info@saudi-mile-market.com</span></li>
                        <li><a href="https://wa.me/966566310983" target="_blank"><i class="fab fa-whatsapp"></i> <span data-translate="footer.contact.whatsapp">واتساب</span></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p data-translate="footer.copyright">© 2024 سوق الأميال السعودي. جميع الحقوق محفوظة.</p>
        </div>
    `;

    // Apply translations to the footer content
    const footerElements = document.querySelectorAll('#dynamic-footer [data-translate]');
    footerElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });
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
            <span class="time">${getTranslation('chat.now')}</span>
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
                <p>${getTranslation('chat.responseText')}</p>
                <span class="time">${getTranslation('chat.now')}</span>
                <a href="https://wa.me/966566310983?text=${encodeURIComponent('مرحباً، لدي استفسار حول ' + messageText)}" target="_blank" class="whatsapp-chat-btn">
                    <i class="fab fa-whatsapp"></i> ${getTranslation('chat.continueOnWhatsapp')}
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