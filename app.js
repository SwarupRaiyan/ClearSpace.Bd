/**
 * ClearSpace — app.js
 * MCD4740 Assignment 3 — Individual Website Project
 *
 * JavaScript Features:
 * 1. Service category filter (PRIMARY JS FEATURE — user goal: finding services)
 * 2. Mobile navigation toggle
 * 3. Form submission with validation & feedback
 * 4. Scroll-triggered fade-in animations
 * 5. Smooth scroll anchor links with nav close
 */

'use strict';

/* ============================================================
   1. SERVICE CATEGORY FILTER
   Purpose: Users can filter services by category (Cleaning,
   Pest Control, Specialist) to quickly find relevant services.
   This directly supports a core user goal on the homepage.
   Source: Original code by student, based on DOM manipulation
   techniques from MCD4740 lab activities.
============================================================ */
(function initServiceFilter() {
    const filterBtns = document.querySelectorAll('.cs-filter-btn');
    const serviceItems = document.querySelectorAll('.cs-item');

    if (!filterBtns.length || !serviceItems.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filterValue = btn.getAttribute('data-filter');

            // Update active button state + ARIA
            filterBtns.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Filter cards
            serviceItems.forEach(function (item) {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Trigger re-animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(16px)';
                    // Use requestAnimationFrame to allow CSS transition
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            item.style.opacity = '';
                            item.style.transform = '';
                        });
                    });
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
})();


/* ============================================================
   2. MOBILE NAVIGATION TOGGLE
   Purpose: Opens/closes the mobile navigation menu on smaller
   screen sizes, ensuring site navigation is accessible to all
   device users.
============================================================ */
(function initMobileNav() {
    const hamburger = document.querySelector('.cs-hamburger');
    const mobileNav = document.querySelector('.cs-mobile-nav');
    const mobileLinks = document.querySelectorAll('.cs-mobile-link');

    if (!hamburger || !mobileNav) return;

    function openMenu() {
        hamburger.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('is-open');
        mobileNav.removeAttribute('aria-hidden');
    }

    function closeMenu() {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', function () {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close nav when a link is clicked
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        const nav = document.querySelector('#cs-navigation');
        if (nav && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
})();


/* ============================================================
   3. CONTACT FORM — VALIDATION + FEEDBACK
   Purpose: Validates required fields and shows a success
   confirmation message after submission, improving the user
   experience for quote requests without a backend.
============================================================ */
(function initContactForm() {
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    if (!submitBtn) return;

    // Field references
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const serviceField = document.getElementById('service');

    function showError(field, message) {
        field.style.borderColor = '#E53E3E';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + '-error');

        // Remove existing error
        const existing = document.getElementById(field.id + '-error');
        if (existing) existing.remove();

        const errEl = document.createElement('span');
        errEl.id = field.id + '-error';
        errEl.role = 'alert';
        errEl.style.cssText = 'font-size:0.75rem; color:#C53030; margin-top:0.2rem;';
        errEl.textContent = message;
        field.parentNode.appendChild(errEl);
    }

    function clearError(field) {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        const errEl = document.getElementById(field.id + '-error');
        if (errEl) errEl.remove();
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    submitBtn.addEventListener('click', function () {
        let valid = true;

        // Validate name
        if (!nameField.value.trim()) {
            showError(nameField, 'Please enter your full name.');
            valid = false;
        } else {
            clearError(nameField);
        }

        // Validate email
        if (!emailField.value.trim()) {
            showError(emailField, 'Please enter your email address.');
            valid = false;
        } else if (!validateEmail(emailField.value.trim())) {
            showError(emailField, 'Please enter a valid email address.');
            valid = false;
        } else {
            clearError(emailField);
        }

        // Validate service selection
        if (!serviceField.value) {
            showError(serviceField, 'Please select a service.');
            valid = false;
        } else {
            clearError(serviceField);
        }

        if (valid) {
            // Show success state
            submitBtn.disabled = true;
            submitBtn.textContent = '✓ Request Sent!';
            submitBtn.style.background = '#2D6A4F';

            if (successMsg) {
                successMsg.classList.add('is-visible');
                successMsg.removeAttribute('aria-hidden');
                // Scroll success message into view
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
})();


/* ============================================================
   4. SCROLL-TRIGGERED ANIMATIONS
   Purpose: Fades in content sections as users scroll down,
   creating a polished, engaging experience.
   Uses Intersection Observer API for performance.
============================================================ */
(function initScrollAnimations() {
    // Target elements to animate
    const targets = document.querySelectorAll(
        '.cs-item, .cs-why-item, .cs-section-header, .cs-why-content, .cs-contact-info, .cs-form-card'
    );

    if (!targets.length) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    targets.forEach(function (el) {
        el.classList.add('cs-animate');
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function (el) {
        observer.observe(el);
    });
})();


/* ============================================================
   5. SMOOTH SCROLL — Anchor links
   Purpose: Smooth scrolls to sections when nav links are
   clicked, accounting for the sticky nav bar height.
============================================================ */
(function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const nav = document.getElementById('cs-navigation');

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            e.preventDefault();
            const navHeight = nav ? nav.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });
})();
