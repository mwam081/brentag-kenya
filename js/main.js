// js/main.js - Professional Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initHeroSections();
    initLightbox();
    initSmoothScrolling();
    initImageLoading();
    initNavigation();
    initContactFeatures();
}

// Fix Hero Section Backgrounds
function initHeroSections() {
    const heroSections = document.querySelectorAll('.hero-section');
    
    heroSections.forEach(section => {
        // Ensure background images load properly
        section.style.backgroundAttachment = 'fixed';
        
        // Add loading class
        section.classList.add('fade-in');
    });
}

// Enhanced Lightbox with Professional Setup
function initLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 300,
            'wrapAround': true,
            'imageFadeDuration': 400,
            'positionFromTop': 100,
            'showImageNumberLabel': true,
            'alwaysShowNavOnTouchDevices': true,
            'fitImagesInViewport': true,
            'maxWidth': 1200,
            'maxHeight': 800
        });
        
        // Add custom lightbox event listeners
        document.addEventListener('click', function(e) {
            if (e.target.matches('[data-lightbox]')) {
                const imageTitle = e.target.getAttribute('data-title') || 'Medical Equipment';
                console.log('Lightbox opened for:', imageTitle);
                
                // Track lightbox usage (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'image_view', {
                        'event_category': 'Products',
                        'event_label': imageTitle
                    });
                }
            }
        });
    } else {
        console.warn('Lightbox not loaded - check CDN');
        // Fallback: open image in new tab
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-lightbox]')) {
                e.preventDefault();
                const link = e.target.closest('[data-lightbox]');
                window.open(link.href, '_blank');
            }
        });
    }
}

// Smooth Scrolling for Category Navigation
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

// Professional Image Loading with Fallbacks
function initImageLoading() {
    const images = document.querySelectorAll('img[data-src], .hero-section');
    
    images.forEach(image => {
        if (image.tagName === 'IMG') {
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
                
                imageObserver.observe(image);
            } else {
                // Fallback for older browsers
                image.src = image.dataset.src;
            }
        }
    });
    
    // Preload critical images
    preloadImages([
        'images/hero_medical_equipment.jpg',
        'images/service_technical_support.jpg',
        'images/product_4_patient_monitor.jpg'
    ]);
}

function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Enhanced Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255,255,255,0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255,255,255,0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Contact Page Features
function initContactFeatures() {
    // Phone number click tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Phone call initiated:', this.href);
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': this.textContent.trim()
                });
            }
        });
    });
    
    // Email link tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Email initiated:', this.href);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'Contact',
                    'event_label': this.href.replace('mailto:', '')
                });
            }
        });
    });
}

// Utility function for debouncing
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

// Scroll to top functionality
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollButton.className = 'scroll-to-top btn btn-primary';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        border: none;
        font-size: 18px;
        background: var(--primary-blue);
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,102,204,0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'scale(1)';
    });
    
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 500) {
            scrollButton.style.display = 'block';
            setTimeout(() => {
                scrollButton.style.opacity = '1';
            }, 50);
        } else {
            scrollButton.style.opacity = '0';
            setTimeout(() => {
                scrollButton.style.display = 'none';
            }, 300);
        }
    }, 100));
}

// Initialize scroll to top
initScrollToTop();

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Initialize animations after load
    setTimeout(() => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
});