// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('a, .hover-target, button, input');

// Only run cursor logic on non-touch devices
if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        target.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Navigation Bar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if(mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Advanced 3D Parallax Engine (RAF-optimized for smooth scrolling)
const parallaxElements = document.querySelectorAll('.parallax');
const heroBg = document.querySelector('.hero-bg-video');
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;
    
    // Hero background specific parallax
    if (scrollY < window.innerHeight && heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.15}px) scale(1.02)`;
    }
    
    // Global continuous parallax elements
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.1;
        const direction = el.getAttribute('data-direction') || 'vertical';
        
        if (direction === 'vertical') {
            el.style.transform = `translateY(${scrollY * speed}px)`;
        } else if (direction === 'horizontal') {
            el.style.transform = `translateX(${scrollY * speed}px)`;
        } else if (direction === 'rotate') {
            el.style.transform = `translateY(${scrollY * speed * 0.5}px) rotate(${scrollY * speed}deg)`;
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Scroll Reveal Animations using Intersection Observer
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Number Counter Animation for Stats
const stats = document.querySelectorAll('.stat-number');
let hasCounted = false;

const countUp = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.innerText.replace(/\D/g,''));
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.innerText = Math.ceil(count) + (stat.innerText.includes('+') ? '+' : '%');
                requestAnimationFrame(updateCount);
            } else {
                stat.innerText = target + (stat.innerText.includes('+') ? '+' : '%');
            }
        };
        updateCount();
    });
};

const statsSection = document.querySelector('.stats-container');
if(statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            countUp();
            hasCounted = true;
        }
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Simple Form Submission Handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = "Subscribed!";
        btn.style.backgroundColor = "#10b981"; // Success green
        newsletterForm.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
        }, 3000);
    });
}

// Cinematic Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a slight delay for cinematic effect
        setTimeout(() => {
            preloader.classList.add('preloader-slide-up');
            // Remove from DOM after animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1200); // matches the 1.2s CSS transition
        }, 800);
    }
});

// Cinematic Shutter Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        const shutter = document.getElementById('cinematic-shutter');
        
        // Sound effect on click
        if (typeof soundEnabled !== 'undefined' && soundEnabled) playClickSound();

        // Close shutter
        shutter.style.transformOrigin = 'top';
        shutter.style.transform = 'scaleY(1)';
        
        setTimeout(() => {
            // Scroll while covered
            const offset = 80; // height of navbar
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'auto'
            });
            
            // Open shutter
            shutter.style.transformOrigin = 'bottom';
            shutter.style.transform = 'scaleY(0)';
        }, 600);
    });
});

// Sound System (Atmospheric Synth)
let soundEnabled = false;
let audioCtx = null;

const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            soundToggle.style.color = '#E5B80B';
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } else {
            soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
            soundToggle.style.color = '#fff';
        }
    });
}

function playHoverSound() {
    if (!soundEnabled || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.05); 
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function playClickSound() {
    if (!soundEnabled || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.02); 
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Attach hover sounds to all targets
document.querySelectorAll('.hover-target').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
});
