// main.js - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initImageHandling();
  initNavigation();
  initProductInquiry();
  initAnimations();
  initFormHandling();
});

// Handle image loading and fallbacks
function initImageHandling() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading state
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    // Handle broken images
    img.addEventListener('error', function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWNmMGYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzJjM2U1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
      this.alt = 'Image not available';
      this.classList.add('image-error');
    });
  });
}

// Enhanced navigation handling
function initNavigation() {
  // Update active navigation link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
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

// Handle product inquiry functionality
function initProductInquiry() {
  // Add "View Details" buttons to product cards
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productTitle = card.querySelector('.card-title').textContent;
    const existingButtons = card.querySelector('.card-body').querySelectorAll('a');
    
    // Check if "View Details" button already exists
    let hasViewDetails = false;
    existingButtons.forEach(btn => {
      if (btn.textContent.includes('View Details')) {
        hasViewDetails = true;
      }
    });
    
    if (!hasViewDetails) {
      const viewDetailsBtn = document.createElement('a');
      viewDetailsBtn.href = `product-detail-${getProductSlug(productTitle)}.html`;
      viewDetailsBtn.className = 'btn btn-outline-primary btn-sm me-2';
      viewDetailsBtn.innerHTML = '<i class="fas fa-eye me-1"></i> View Details';
      
      const buttonContainer = card.querySelector('.d-flex.justify-content-between') || 
                             card.querySelector('.card-body');
      
      if (buttonContainer.classList.contains('d-flex')) {
        // Insert before the inquire button
        const inquireBtn = buttonContainer.querySelector('a[href*="contact.html"]');
        if (inquireBtn) {
          buttonContainer.insertBefore(viewDetailsBtn, inquireBtn);
        } else {
          buttonContainer.appendChild(viewDetailsBtn);
        }
      } else {
        // Create a new button container
        const newButtonContainer = document.createElement('div');
        newButtonContainer.className = 'd-flex justify-content-between align-items-center mt-3';
        newButtonContainer.appendChild(viewDetailsBtn);
        
        // Add inquire button if it doesn't exist
        if (!card.querySelector('a[href*="contact.html"]')) {
          const inquireBtn = document.createElement('a');
          inquireBtn.href = `contact.html?product=${encodeURIComponent(productTitle)}`;
          inquireBtn.className = 'btn btn-outline-primary btn-sm';
          inquireBtn.innerHTML = '<i class="fas fa-envelope me-1"></i> Inquire';
          newButtonContainer.appendChild(inquireBtn);
        }
        
        card.querySelector('.card-body').appendChild(newButtonContainer);
      }
    }
  });
  
  // Update existing inquire buttons to include product name
  document.querySelectorAll('a[href*="contact.html"]').forEach(link => {
    if (link.href.includes('contact.html') && !link.href.includes('?')) {
      const productCard = link.closest('.product-card, .service-card');
      if (productCard) {
        const productTitle = productCard.querySelector('.card-title').textContent;
        link.href = `contact.html?product=${encodeURIComponent(productTitle)}`;
      }
    }
  });
}

// Helper function to create product slugs
function getProductSlug(productName) {
  const slugMap = {
    'Chemistry Analyzers': '1',
    'Laboratory Microscopes': '2',
    'Hematology Analyzers': '3',
    'Patient Monitors': '4',
    'Laboratory Centrifuges': '5',
    'Ultrasound Systems': '6',
    'Medical Examination Beds': '7',
    'Laboratory Workstations': '8',
    'Medical Storage Cabinets': '9',
    'Hospital Trolleys & Carts': '10',
    'Hospital Beds': '11',
    'X-Ray Machines': '12',
    'Vital Signs Monitors': '13'
  };
  
  return slugMap[productName] || '1';
}

// Initialize animations
function initAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.card, .service-icon, .hero-content h1, .hero-content p').forEach(el => {
    observer.observe(el);
  });
}

// Handle form functionality
function initFormHandling() {
  // Auto-fill contact form with product name from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  
  if (product && window.location.pathname.includes('contact.html')) {
    // This would typically interact with the Zoho form
    // For demo purposes, we'll show an alert
    setTimeout(() => {
      alert(`Inquiry about: ${decodeURIComponent(product)}`);
    }, 1000);
  }
}

// Admin panel functionality
function showAdminAlert() {
  alert('Admin functionality is available in the live version with backend support. This is a static demo.');
}

// Image lightbox functionality (if needed)
function initLightbox() {
  // This would be implemented if lightbox functionality is required
}

// Export functions for global access
window.showAdminAlert = showAdminAlert;