/**
 * D.D. SHIBUYA - Main JavaScript
 * 
 * Features:
 * - Smooth scrolling navigation
 * - Header scroll effects
 * - Mobile menu toggle
 * - Intersection Observer animations
 * - Parallax effects
 */

// ==========================================
// DOM Elements
// ==========================================
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const scrollIndicator = document.querySelector('.scroll-indicator');

// ==========================================
// Mobile Navigation
// ==========================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// Smooth Scrolling
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Header Scroll Effect
// ==========================================
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
}

// Throttle scroll event for better performance
let ticking = false;
function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
        setTimeout(() => {
            ticking = false;
        }, 100);
    }
}

window.addEventListener('scroll', requestTick);

// ==========================================
// Parallax Effect
// ==========================================
function handleParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Hero parallax
    if (heroSection && scrolled < windowHeight) {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        heroSection.style.transform = `translateY(${yPos}px)`;
        
        // Fade hero content
        if (heroContent) {
            const opacity = 1 - (scrolled / windowHeight);
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
    
    // Hide scroll indicator
    if (scrollIndicator && scrolled > 100) {
        scrollIndicator.style.opacity = '0';
    } else if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
    }
}

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        requestAnimationFrame(handleParallax);
    }
});

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate service cards with stagger
            if (entry.target.classList.contains('services')) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
            
            // Animate staff cards with stagger
            if (entry.target.classList.contains('staff')) {
                const cards = entry.target.querySelectorAll('.staff-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ==========================================
// Service Cards Initial State
// ==========================================
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
});

// ==========================================
// Staff Cards Initial State
// ==========================================
document.querySelectorAll('.staff-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
});

// ==========================================
// Active Navigation Highlighting
// ==========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==========================================
// Preloader (Optional)
// ==========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements on load
    if (heroContent) {
        const elements = heroContent.querySelectorAll('*');
        elements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.8s ease ${index * 0.1}s backwards`;
        });
    }
});

// ==========================================
// Utility Functions
// ==========================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle resize events
const handleResize = debounce(() => {
    // Reset mobile menu on desktop resize
    if (window.innerWidth > 968) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Reset parallax on mobile
    if (window.innerWidth <= 768 && heroSection) {
        heroSection.style.transform = 'none';
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'none';
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c D.D. SHIBUYA ', 'background: #c9a961; color: #1a1a1a; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Welcome to our website! 🎨 ', 'color: #c9a961; font-size: 14px;');
