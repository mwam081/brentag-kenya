// main.js v14.0 - Brentag Kenya Ltd

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main Initialization Function
function initializeWebsite() {
    initializeNavigation();
    initializeForms();
    initializeModals();
    initializeLightbox();
    initializeScrollEffects();
    initializeTouchSupport();
    initializePerformanceOptimizations();
}

// Navigation Management
function initializeNavigation() {
    // Active page highlighting
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
    
    // Mobile menu improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            console.log('Mobile menu toggled:', isExpanded ? 'close' : 'open');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handling
function initializeForms() {
    // Contact form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Form is valid - show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
                    submitBtn.disabled = true;
                }
                
                // Track form submission
                trackFormSubmission(form);
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    // File upload validation
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size must be less than 10MB');
                    this.value = '';
                    return;
                }
                
                // Check file type
                const allowedTypes = ['application/pdf', 'application/msword', 
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                    'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid file type (PDF, Word, JPEG, PNG)');
                    this.value = '';
                    return;
                }
                
                console.log('File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
            }
        });
    });
    
    // Pre-fill form based on URL parameters
    prefillFormFromURL();
}

// Pre-fill form based on URL parameters
function prefillFormFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    const service = urlParams.get('service');
    
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    
    if (product && subjectSelect && messageTextarea) {
        subjectSelect.value = 'Product Inquiry';
        messageTextarea.value = `I'm interested in learning more about your ${product}. Please send me more information about specifications, pricing, and availability.`;
    }
    
    if (service && subjectSelect && messageTextarea) {
        subjectSelect.value = 'Service Request';
        messageTextarea.value = `I'm interested in your ${service} service. Please contact me to discuss my requirements and schedule a consultation.`;
    }
}

// Modal Management
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const modalTitle = modal.querySelector('.modal-title');
            
            // Track modal opening
            console.log('Modal opened:', modalTitle ? modalTitle.textContent : 'Unknown');
            
            // Add loading state for modal images
            const modalImages = modal.querySelectorAll('img');
            modalImages.forEach(img => {
                if (!img.complete) {
                    img.style.opacity = '0.7';
                    img.addEventListener('load', function() {
                        this.style.opacity = '1';
                    });
                }
            });
        });
        
        modal.addEventListener('hidden.bs.modal', function () {
            // Reset form if exists in modal
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
        });
    });
}

// Lightbox Initialization
function initializeLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'imageFadeDuration': 300,
            'positionFromTop': 50,
            'showImageNumberLabel': true,
            'alwaysShowNavOnTouchDevices': true
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'white';
                navbar.style.backdropFilter = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Touch Device Support
function initializeTouchSupport() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback for interactive elements
        const touchElements = document.querySelectorAll('.btn, .nav-link, .card, .product-card, .service-card');
        
        const handleTouchStart = function() {
            this.style.transform = 'scale(0.98)';
        };
        
        const handleTouchEnd = function() {
            this.style.transform = 'scale(1)';
        };
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchend', handleTouchEnd, { passive: true });
            element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        });
    }
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Lazy loading for images
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
    
    // Preload critical images
    preloadCriticalImages();
}

// Preload Critical Images
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero-home.jpg',
        'images/hero-about.jpg',
        'images/hero-products.jpg',
        'images/hero-services.jpg',
        'images/hero-contact.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Analytics and Tracking
function trackFormSubmission(form) {
    const formData = new FormData(form);
    const formType = form.getAttribute('id') || 'contact-form';
    
    console.log('Form submission tracked:', formType, Object.fromEntries(formData));
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            'event_category': 'Contact',
            'event_label': formType
        });
    }
}

// Phone Call Tracking
function trackPhoneCall(phoneNumber = '+254711867765') {
    console.log('Phone call initiated:', phoneNumber);
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', {
            'event_category': 'Contact',
            'event_label': phoneNumber
        });
    }
    
    // Fallback for devices without tel support
    setTimeout(() => {
        window.location.href = `tel:${phoneNumber}`;
    }, 100);
}

// Email Tracking
function trackEmailClick(email = 'info@brentag.co.ke') {
    console.log('Email click tracked:', email);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_click', {
            'event_category': 'Contact',
            'event_label': email
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Export functions for global access
window.Brentag = {
    trackPhoneCall,
    trackEmailClick,
    initializeWebsite
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}