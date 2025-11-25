// ===== MAIN APPLICATION JS =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavbar();
    initSmoothScroll();
    initFormValidation();
    initLightbox();
    initAnimations();
    initContactForm();
    initProductModals();
    initServiceModals();
    initFAQAccordion();
    
    console.log('Brentag Kenya Ltd - Website initialized successfully');
}

// ===== NAVBAR FUNCTIONALITY =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Add active class based on current page
    setActiveNavLink();
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// ===== LIGHTBOX INITIALIZATION =====
function initLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'imageFadeDuration': 300,
            'positionFromTop': 100
        });
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .process-step, .feature-icon-bg');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== CONTACT FORM HANDLING =====
function initContactForm() {
    const contactForm = document.querySelector('form[action*="formspree.io"]');
    if (!contactForm) return;
    
    // File upload validation
    const fileInput = document.getElementById('upload');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File size must be less than 10MB');
                this.value = '';
            }
        });
    }
    
    // Pre-fill form based on URL parameters
    prefillContactForm();
    
    // Form submission handling
    contactForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
        }
        
        // You can add additional form submission logic here
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            }
            trackFormSubmission('contact_form');
        }, 2000);
    });
}

function prefillContactForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    const service = urlParams.get('service');
    
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    
    if (product && subjectSelect && messageTextarea) {
        subjectSelect.value = 'Product Inquiry';
        messageTextarea.value = `I'm interested in learning more about your ${product}. Please send me detailed information, specifications, and pricing.`;
    }
    
    if (service && subjectSelect && messageTextarea) {
        subjectSelect.value = 'Service Request';
        messageTextarea.value = `I'm interested in your ${service} service. Please contact me to discuss my requirements and schedule a consultation.`;
    }
}

// ===== PRODUCT MODALS =====
function initProductModals() {
    const productModals = document.querySelectorAll('[id^="productModal"]');
    
    productModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const productTitle = button.closest('.card').querySelector('.card-title').textContent;
            
            // You can add additional product modal initialization here
            console.log('Opening product modal:', productTitle);
        });
    });
}

// ===== SERVICE MODALS =====
function initServiceModals() {
    const serviceModals = document.querySelectorAll('[id^="serviceModal"]');
    
    serviceModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const serviceTitle = button.closest('.card').querySelector('.card-title').textContent;
            
            // You can add additional service modal initialization here
            console.log('Opening service modal:', serviceTitle);
        });
    });
}

// ===== FAQ ACCORDION =====
function initFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-button');
    
    accordionItems.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            trackEvent('faq_interaction', isExpanded ? 'close' : 'open', this.textContent.trim());
        });
    });
}

// ===== ANALYTICS AND TRACKING =====
function trackPhoneCall() {
    console.log('Phone call initiated - +254711867765');
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', {
            'event_category': 'Contact',
            'event_label': 'Phone Call Initiated'
        });
    }
    
    // Custom tracking
    trackEvent('phone_call', 'click', '+254711867765');
}

function trackFormSubmission(formName) {
    console.log(`Form submitted: ${formName}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Contact',
            'event_label': formName
        });
    }
    
    trackEvent('form_submission', 'submit', formName);
}

function trackEvent(action, category, label) {
    // Custom event tracking - you can integrate with your analytics service
    const eventData = {
        action: action,
        category: category,
        label: label,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
    
    console.log('Event tracked:', eventData);
    
    // Send to your analytics endpoint
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(eventData)
    // });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // You can send errors to your error tracking service
    // trackEvent('javascript_error', 'error', e.message);
});

// ===== EXPORT FOR MODULAR USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        trackPhoneCall,
        trackFormSubmission,
        debounce,
        throttle
    };
}