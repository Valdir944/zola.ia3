// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Dropdown menu for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('> a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // COUNTING ANIMATION FOR IMPACT NUMBERS
    // ============================================
    function animateImpactNumbers() {
        const impactNumbers = document.querySelectorAll('.impact-number');
        
        impactNumbers.forEach(numberElement => {
            // Check if already animated
            if (numberElement.classList.contains('counted')) return;
            
            // Get target value and suffix from data attributes
            const targetValue = parseInt(numberElement.getAttribute('data-target'));
            const suffix = numberElement.getAttribute('data-suffix') || '';
            
            if (isNaN(targetValue)) return;
            
            let currentValue = 0;
            const duration = 2000; // 2 seconds
            const stepTime = 20; // 20ms per step
            const steps = duration / stepTime;
            const increment = targetValue / steps;
            
            numberElement.classList.add('counting');
            
            const counter = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    
                    // Format the number
                    let displayValue;
                    if (targetValue % 1 === 0) {
                        displayValue = Math.floor(currentValue);
                    } else {
                        displayValue = currentValue.toFixed(1);
                    }
                    
                    numberElement.innerText = displayValue + suffix;
                    numberElement.classList.remove('counting');
                    numberElement.classList.add('counted');
                    clearInterval(counter);
                } else {
                    // Format the number
                    let displayValue;
                    if (targetValue % 1 === 0) {
                        displayValue = Math.floor(currentValue);
                    } else {
                        displayValue = currentValue.toFixed(1);
                    }
                    numberElement.innerText = displayValue + suffix;
                }
            }, stepTime);
        });
    }
    
    // Initialize observer for impact section
    function initImpactObserver() {
        const impactSection = document.querySelector('.impact-section');
        if (!impactSection) return;
        
        let animated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateImpactNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(impactSection);
    }
    
    // Start the observer
    initImpactObserver();
    
    // Form validation and handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const removeError = (field) => {
            field.classList.remove('error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        };
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let valid = true;
            const name = this.querySelector('input[name="name"]');
            const email = this.querySelector('input[name="email"]');
            const message = this.querySelector('textarea[name="message"]');
            
            const fields = [name, email, message];
            fields.forEach(field => {
                removeError(field);
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    if (!field.parentNode.querySelector('.error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Este campo é obrigatório';
                        field.parentNode.appendChild(errorMsg);
                    }
                }
            });
            
            function isValidEmail(email) {
                const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
                return re.test(email);
            }
            
            if (email.value.trim() && !isValidEmail(email.value)) {
                valid = false;
                email.classList.add('error');
                if (!email.parentNode.querySelector('.error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Digite um email válido';
                    email.parentNode.appendChild(errorMsg);
                }
            }
            
            if (valid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner loading"></i> Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
        
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                removeError(this);
            });
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.solution-card, .impact-card, .process-step, .feature-card').forEach(el => {
        observer.observe(el);
    });
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Tooltip for floating cards
    const floatCards = document.querySelectorAll('.float-card');
    floatCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const tooltip = this.querySelector('.card-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.card-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    });
    
    console.log('ZOLA.ia - Website inicializado | BI Consulting & AI Surveillance | Counting Animation Active');
});