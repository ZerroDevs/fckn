// Persistent Payment Popup Script
(function() {
    // Create persistent payment notification popup
    function createPersistentPaymentPopup() {
        // Check if popup already exists to prevent duplicates
        if (document.querySelector('.persistent-popup-overlay')) {
            return;
        }
        
        console.log('Creating payment popup...');
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'persistent-popup-overlay';
        
        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'persistent-popup-content';
        
        // Add warning icon
        const warningIcon = document.createElement('div');
        warningIcon.className = 'persistent-popup-icon';
        warningIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        popupContent.appendChild(warningIcon);
        
        // Add Arabic message
        const arabicMessage = document.createElement('h3');
        arabicMessage.className = 'persistent-popup-title';
        arabicMessage.textContent = 'لم يتم دفع مستحقات الموقع';
        popupContent.appendChild(arabicMessage);
        
        const arabicSubMessage = document.createElement('p');
        arabicSubMessage.className = 'persistent-popup-text';
        arabicSubMessage.textContent = 'يرجي التواصل علي الحساب الاتي';
        popupContent.appendChild(arabicSubMessage);
        
        const arabicAccount = document.createElement('p');
        arabicAccount.className = 'persistent-popup-account';
        arabicAccount.textContent = 'zx.r';
        popupContent.appendChild(arabicAccount);
        
        // Add divider
        const divider = document.createElement('div');
        divider.className = 'persistent-popup-divider';
        popupContent.appendChild(divider);
        
        // Add English message
        const englishMessage = document.createElement('h3');
        englishMessage.className = 'persistent-popup-title';
        englishMessage.textContent = 'Website payment is overdue';
        popupContent.appendChild(englishMessage);
        
        const englishSubMessage = document.createElement('p');
        englishSubMessage.className = 'persistent-popup-text';
        englishSubMessage.textContent = 'Please contact the following account';
        popupContent.appendChild(englishSubMessage);
        
        const englishAccount = document.createElement('p');
        englishAccount.className = 'persistent-popup-account';
        englishAccount.textContent = 'zx.r';
        popupContent.appendChild(englishAccount);
        
        // Add second divider for footer
        const footerDivider = document.createElement('div');
        footerDivider.className = 'persistent-popup-divider';
        popupContent.appendChild(footerDivider);
        
        // Add footer with copyright in Arabic
        const arabicFooter = document.createElement('p');
        arabicFooter.className = 'persistent-popup-footer';
        arabicFooter.innerHTML = '2025&trade; جميع الحقوق محفوظه ل <a href="https://github.com/ZerroDevs" target="_blank" class="github-link">زيرو</a>';
        popupContent.appendChild(arabicFooter);
        
        // Add footer with copyright in English
        const englishFooter = document.createElement('p');
        englishFooter.className = 'persistent-popup-footer';
        englishFooter.innerHTML = '2025&trade; all rights reserved to <a href="https://github.com/ZerroDevs" target="_blank" class="github-link">ZeroNux</a>';
        popupContent.appendChild(englishFooter);
        
        // Append popup to overlay
        overlay.appendChild(popupContent);
        
        // Append overlay to body
        document.body.appendChild(overlay);
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        
        // Disable all interactive elements behind the popup
        const allElements = document.querySelectorAll('a, button, input, textarea, select');
        allElements.forEach(element => {
            if (!overlay.contains(element)) {
                element.setAttribute('tabindex', '-1');
                element.style.pointerEvents = 'none';
            }
        });
        
        // Prevent keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
                (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
            ) {
                e.preventDefault();
            }
            
            // Prevent Escape key
            if (e.key === 'Escape') {
                e.preventDefault();
            }
        }, false);
        
        // Prevent right-click
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
        
        console.log('Payment popup created successfully');
        
        // Ensure popup stays on top even if user tries to manipulate DOM
        setInterval(function() {
            // Check if popup still exists
            if (!document.querySelector('.persistent-popup-overlay')) {
                console.log('Popup was removed, adding it back...');
                // If removed, add it back
                document.body.appendChild(overlay);
                document.body.style.overflow = 'hidden';
            }
        }, 500);
    }

    // Add CSS styles for the popup
    function addPopupStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .persistent-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease-in-out;
            }
            
            .persistent-popup-content {
                background-color: #fff;
                border-radius: 10px;
                padding: 30px;
                width: 90%;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.5s ease-in-out;
            }
            
            .persistent-popup-icon {
                font-size: 50px;
                color: #e53e3e;
                margin-bottom: 20px;
            }
            
            .persistent-popup-title {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 10px;
                color: #e53e3e;
            }
            
            .persistent-popup-text {
                font-size: 18px;
                margin-bottom: 5px;
                color: #4a5568;
            }
            
            .persistent-popup-account {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 15px;
                color: #2b6cb0;
                direction: ltr;
            }
            
            .persistent-popup-divider {
                height: 2px;
                background: linear-gradient(to right, transparent, #cbd5e0, transparent);
                margin: 20px 0;
            }
            
            .persistent-popup-footer {
                font-size: 14px;
                margin: 5px 0;
                color: #4a5568;
                line-height: 1.5;
            }
            
            .github-link {
                color: #2b6cb0;
                text-decoration: none;
                font-weight: 700;
                transition: color 0.3s ease;
            }
            
            .github-link:hover {
                color: #4299e1;
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes scaleIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @media (max-width: 576px) {
                .persistent-popup-content {
                    padding: 20px;
                }
                
                .persistent-popup-title {
                    font-size: 20px;
                }
                
                .persistent-popup-text {
                    font-size: 16px;
                }
                
                .persistent-popup-account {
                    font-size: 20px;
                }
                
                .persistent-popup-footer {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(styleElement);
        console.log('Popup styles added to document');
    }

    // Function to initialize the popup
    function initPaymentPopup() {
        console.log('Initializing payment popup...');
        addPopupStyles();
        createPersistentPaymentPopup();
    }

    // Try multiple approaches to ensure the popup is displayed
    
    // 1. When DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM Content Loaded - initializing popup');
            setTimeout(initPaymentPopup, 500);
        });
    } else {
        console.log('DOM already loaded - initializing popup immediately');
        setTimeout(initPaymentPopup, 500);
    }
    
    // 2. When window loads (includes all resources)
    window.addEventListener('load', function() {
        console.log('Window loaded - initializing popup');
        setTimeout(initPaymentPopup, 1000);
    });
    
    // 3. Fallback - try after a delay
    setTimeout(function() {
        console.log('Fallback timeout - initializing popup');
        initPaymentPopup();
    }, 2000);
})(); 