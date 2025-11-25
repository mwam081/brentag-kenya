// js/main.js - Enhanced with all functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollToCategory();
    initProductFiltering();
    initSmoothScrolling();
    initContactForm();
    initLightboxEnhancements();
});

// Smooth scrolling for category links
function initScrollToCategory() {
    const categoryLinks = document.querySelectorAll('a[href^="#"]');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Product filtering by category
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterProducts(filterValue);
        });
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const activeClass = 'active-category';
    
    // Remove active class from all buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove(activeClass);
    });
    
    // Add active class to clicked button
    event.target.classList.add(activeClass);
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'scale(1)';
            }, 100);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

// Enhanced smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Contact form enhancements
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Simple validation
            if (validateForm(formObject)) {
                showFormSuccess();
                this.reset();
            }
        });
    }
    
    // Pre-fill service/product in contact form from URL parameters
    prefillContactForm();
}

function prefillContactForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const product = urlParams.get('product');
    
    if (service) {
        const messageField = document.querySelector('textarea[name="message"]');
        if (messageField) {
            messageField.value = `I'm interested in your ${service} service. Please contact me with more information.`;
        }
    }
    
    if (product) {
        const messageField = document.querySelector('textarea[name="message"]');
        if (messageField) {
            messageField.value = `I'm interested in your ${product}. Please send me pricing and specifications.`;
        }
    }
}

function validateForm(formData) {
    // Basic validation
    if (!formData.name || formData.name.trim().length < 2) {
        showFormError('Please enter your full name');
        return false;
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        showFormError('Please enter a valid email address');
        return false;
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
        showFormError('Please enter a message with at least 10 characters');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormError(message) {
    // Create or show error message
    let errorDiv = document.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error alert alert-danger mt-3';
        document.querySelector('form').appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showFormSuccess() {
    // Create or show success message
    let successDiv = document.querySelector('.form-success');
    
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'form-success alert alert-success mt-3';
        document.querySelector('form').appendChild(successDiv);
    }
    
    successDiv.textContent = 'Thank you! Your message has been sent. We will contact you soon.';
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Lightbox enhancements
function initLightboxEnhancements() {
    // Configure lightbox defaults
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'imageFadeDuration': 300,
            'positionFromTop': 100,
            'showImageNumberLabel': true,
            'alwaysShowNavOnTouchDevices': true
        });
    }
}

// Phone number click tracking
function trackPhoneCall() {
    // This would integrate with analytics in a real implementation
    console.log('Phone number clicked - tracking call');
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Contact',
            'event_label': 'Phone Call'
        });
    }
}

// Add click event to all phone links
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', trackPhoneCall);
    });
});

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

// Initialize when page loads
window.addEventListener('load', function() {
    initLazyLoading();
    
    // Add loading animation removal
    document.body.classList.add('loaded');
});

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
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top btn btn-primary';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        border: none;
        font-size: 20px;
    `;
    
    document.body.appendChild(scrollButton);
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }, 100));
}

// Initialize scroll to top
initScrollToTop();