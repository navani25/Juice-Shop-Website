/* Modern Juice Shop JavaScript - Enhanced Interactions and Animations */
/* Clean, modern functionality with smooth animations and professional UX */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION =====
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    const navbarLinks = document.querySelectorAll('.navbar-nav a');

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional enhancement)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    // Throttled scroll event
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }

    // Mobile menu toggle
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navbarToggle.classList.toggle('open');
            navbarNav.classList.toggle('show');
            
            // Prevent body scroll when menu is open
            if (navbarNav.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on links
        navbarLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarToggle.classList.remove('open');
                navbarNav.classList.remove('show');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navbarNav.classList.contains('show')) {
                navbarToggle.classList.remove('open');
                navbarNav.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbarNav.classList.contains('show')) {
                navbarToggle.classList.remove('open');
                navbarNav.classList.remove('show');
                document.body.style.overflow = '';
                navbarToggle.focus();
            }
        });
    }

    // Active link highlighting
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        navbarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveLink();

    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initSmoothScrolling();

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card, .testimonial, .split-layout > div, .section-title').forEach(el => {
            observer.observe(el);
        });
    }
    
    initScrollAnimations();

    // ===== CART FUNCTIONALITY =====
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    function addToCart(productName, price) {
        cart.push({ 
            productName: productName, 
            price: price,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Enhanced toast notification
        showToast(`${productName} added to cart!`, 'success');
        
        // Update cart count in navbar if element exists
        updateCartCount();
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            cartCount.style.display = cart.length > 0 ? 'inline' : 'none';
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
        showToast('Item removed from cart', 'info');
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
    }

    function displayCart() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious juices to get started!</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <h4>${item.productName}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">
                    <i class="icon">×</i>
                </button>
            </div>
        `).join('');
    }

    // Initialize cart display
    if (document.getElementById('cartItems')) {
        displayCart();
    }
    updateCartCount();

    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: getToastColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '300px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        });

        document.body.appendChild(toast);

        // Show toast
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    function getToastColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        return colors[type] || colors.info;
    }

    // ===== FORM HANDLING =====
    function initFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const name = formData.get('name') || document.getElementById('name')?.value;
                const email = formData.get('email') || document.getElementById('email')?.value;
                const message = formData.get('message') || document.getElementById('message')?.value;

                if (!name || !email || !message) {
                    showToast('Please fill in all fields', 'error');
                    return;
                }

                if (!isValidEmail(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }

                // Show sending state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        }

        // Clear button functionality
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                const form = document.getElementById('contactForm');
                if (form) {
                    form.reset();
                    showToast('Form cleared', 'info');
                }
            });
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    initFormHandling();

    // ===== ENHANCED SCROLL EFFECTS =====
    function initScrollEffects() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }

        // Header hide/show on scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    initScrollEffects();

    // ===== BUTTON ANIMATIONS =====
    function initButtonAnimations() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });

            btn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(0) scale(0.98)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px)';
            });
        });
    }

    initButtonAnimations();

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Throttle scroll events for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Apply throttling to scroll events
    window.addEventListener('scroll', onScroll);

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function initAccessibility() {
        // Keyboard navigation for mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navbarToggle?.classList.remove('open');
                navbarNav?.classList.remove('show');
            }
        });

        // Focus management for modal-like components
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Trap focus in mobile menu when open
        if (navbarNav && navbarToggle) {
            navbarNav.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    const focusable = this.querySelectorAll(focusableElements);
                    const firstFocusableElement = focusable[0];
                    const lastFocusableElement = focusable[focusable.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }

    initAccessibility();

    // ===== UTILITY FUNCTIONS =====
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.showToast = showToast;
    window.updateCartCount = updateCartCount;

    // ===== INITIALIZATION COMPLETE =====
    console.log('🍹 Modern Juice Shop initialized successfully!');
});

// ===== CSS ANIMATIONS ADDITION =====
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .toast-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
    }

    .toast-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .toast-close:hover {
        opacity: 1;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: #1a202c;
    }

    .cart-item-price {
        color: #28a745;
        font-weight: 600;
    }

    .btn-remove {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.2s;
    }

    .btn-remove:hover {
        background: #c82333;
        transform: scale(1.1);
    }

    .empty-cart {
        text-align: center;
        padding: 3rem;
        color: #718096;
    }

    .empty-cart h3 {
        color: #4a5568;
        margin-bottom: 1rem;
    }
`;

document.head.appendChild(style);