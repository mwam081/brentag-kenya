// Main JavaScript for Brentag Kenya Ltd - Enhanced Version
// Complete with lightbox, animations, form validation, and interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLightbox();
    initScrollAnimations();
    initFormValidation();
    initNavigationHighlighting();
    initSmoothScrolling();
    initImageLoading();
    initHoverEffects();
    
    console.log('Brentag Kenya Ltd - Enhanced site loaded successfully');
});

// ===== LIGHTBOX FUNCTIONALITY =====
function initLightbox() {
    // Check if lightbox already exists
    if (document.querySelector('.lightbox')) {
        return; // Lightbox already initialized
    }

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
        <span class="lightbox-close" aria-label="Close lightbox">&times;</span>
        <div class="lightbox-nav">
            <span class="lightbox-prev" aria-label="Previous image">&#10094;</span>
            <span class="lightbox-next" aria-label="Next image">&#10095;</span>
        </div>
        <img class="lightbox-content" src="" alt="">
        <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);
    
    // Get all product images with lightbox capability
    const productImages = document.querySelectorAll('.product-detail-image');
    let currentImageIndex = 0;
    const imagesArray = Array.from(productImages);
    
    // Add click event to each product image
    productImages.forEach((img, index) => {
        // Add tabindex for accessibility
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'View image in lightbox');
        
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(this.src, this.alt);
        });
        
        // Add keyboard support
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentImageIndex = index;
                openLightbox(this.src, this.alt);
            }
        });
    });
    
    // Open lightbox with specific image
    function openLightbox(src, alt) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        caption.textContent = alt;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Set focus to close button for accessibility
        setTimeout(() => {
            lightbox.querySelector('.lightbox-close').focus();
        }, 100);
    }
    
    // Close lightbox
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Navigate to next image
    function nextImage() {
        if (imagesArray.length <= 1) return;
        
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        const nextImg = imagesArray[currentImageIndex];
        openLightbox(nextImg.src, nextImg.alt);
    }
    
    // Navigate to previous image
    function prevImage() {
        if (imagesArray.length <= 1) return;
        
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        const prevImg = imagesArray[currentImageIndex];
        openLightbox(prevImg.src, prevImg.alt);
    }
    
    // Event listeners for lightbox controls
    const lightbox = document.querySelector('.lightbox');
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    
    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'Tab':
                // Keep focus within lightbox
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
                break;
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Create Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for product features
                if (entry.target.classList.contains('product-features')) {
                    staggerAnimation(entry.target);
                }
                
                // Stop observing after animation triggers
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });
    
    // Add fade-in class to relevant elements if not already present
    const elementsToAnimate = [
        '.product-detail-image',
        'h1.display-5',
        '.lead',
        '.product-specs',
        '.product-features',
        '.applications',
        '.d-flex.gap-3',
        '.breadcrumb',
        '.btn'
    ];
    
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
                fadeObserver.observe(el);
            }
        });
    });
    
    // Stagger animation for product features
    function staggerAnimation(container) {
        const items = container.querySelectorAll('p, li, .badge');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const contactForms = document.querySelectorAll('form');
    
    contactForms.forEach(form => {
        // Add novalidate to let our custom validation handle it
        form.setAttribute('novalidate', 'true');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightInvalidField(field);
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    removeInvalidHighlight(field);
                    
                    // Email validation
                    if (field.type === 'email' && !isValidEmail(field.value)) {
                        isValid = false;
                        highlightInvalidField(field, 'Please enter a valid email address');
                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }
                    }
                    
                    // Phone validation
                    if (field.type === 'tel' && !isValidPhone(field.value)) {
                        isValid = false;
                        highlightInvalidField(field, 'Please enter a valid phone number');
                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }
                    }
                }
            });
            
            if (isValid) {
                // Form is valid - you can submit it here
                showFormMessage('Thank you for your inquiry! We will contact you soon.', 'success');
                form.reset();
                
                // In a real application, you would submit the form here
                // form.submit();
            } else {
                showFormMessage('Please fill in all required fields correctly.', 'error');
                // Scroll to first invalid field
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    firstInvalidField.focus();
                }
            }
        });
        
        // Real-time validation on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    highlightInvalidField(this, 'This field is required');
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    highlightInvalidField(this, 'Please enter a valid email address');
                } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
                    highlightInvalidField(this, 'Please enter a valid phone number');
                } else {
                    removeInvalidHighlight(this);
                }
            });
            
            // Remove error state when user starts typing
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    removeInvalidHighlight(this);
                }
            });
        });
    });
    
    function highlightInvalidField(field, message = 'This field is required') {
        field.classList.add('is-invalid');
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        
        // Add or update error message
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function removeInvalidHighlight(field) {
        field.classList.remove('is-invalid');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Basic phone validation - accepts numbers, spaces, +, -, (, )
        const phoneRegex = /^[\d\s+\-()]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
    }
    
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        messageEl.textContent = message;
        messageEl.style.animation = 'fadeInUp 0.5s ease';
        
        // Add to page - you might need to adjust selector based on your form structure
        const form = document.querySelector('form');
        if (form) {
            form.appendChild(messageEl);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        if (messageEl.parentNode) {
                            messageEl.remove();
                        }
                    }, 500);
                }
            }, 5000);
        }
    }
}

// ===== NAVIGATION HIGHLIGHTING =====
function initNavigationHighlighting() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find and highlight the current page in navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage.includes('product-detail') && linkHref === 'products.html') ||
            (currentPage.includes('contact') && link.getAttribute('href').includes('contact'))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===== IMAGE LOADING ANIMATIONS =====
function initImageLoading() {
    window.addEventListener('load', function() {
        document.querySelectorAll('.product-detail-image').forEach(img => {
            img.style.opacity = '0';
            img.classList.add('loading');
            
            // Ensure image is loaded before showing
            if (img.complete) {
                showImage(img);
            } else {
                img.addEventListener('load', function() {
                    showImage(this);
                });
                
                // Fallback in case load event doesn't fire
                setTimeout(() => {
                    if (img.style.opacity === '0') {
                        showImage(img);
                    }
                }, 1000);
            }
        });
    });
    
    function showImage(img) {
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.6s ease';
    }
}

// ===== HOVER EFFECTS ENHANCEMENT =====
function initHoverEffects() {
    // Enhanced hover effects for interactive elements
    const interactiveElements = [
        '.btn',
        '.product-detail-image',
        '.badge',
        '.nav-link',
        'footer a'
    ];
    
    interactiveElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove existing ripples
            const existingRipples = this.querySelectorAll('.btn-ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            
            // Get click position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Set ripple styles
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.position = 'absolute';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== GLOBAL EVENT LISTENERS =====

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page is now hidden');
    } else {
        // Page is visible
        console.log('Page is now visible');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showFormMessage('Connection restored.', 'success');
});

window.addEventListener('offline', function() {
    showFormMessage('You are currently offline. Some features may not work.', 'error');
});

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// ===== CSS ANIMATIONS FOR DYNAMIC EFFECTS =====

// Add ripple animation to styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn-ripple {
        animation: ripple 0.6s linear;
    }
    
    /* Print styles */
    @media print {
        .navbar,
        .btn,
        .lightbox,
        #loading-spinner {
            display: none !important;
        }
    }
`;
document.head.appendChild(rippleStyles);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images (future enhancement)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLightbox,
        initScrollAnimations,
        initFormValidation,
        initNavigationHighlighting,
        initSmoothScrolling,
        initImageLoading,
        initHoverEffects,
        debounce,
        throttle
    };
}