// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsGrid = document.getElementById('projectsGrid');
const projectsLoading = document.getElementById('projectsLoading');

// Project data with GitHub repositories
const projects = [
    {
        name: 'Applycam',
        description: 'Application de surveillance et de reconnaissance faciale avec caméra',
        tech: ['JavaScript', 'WebRTC', 'Computer Vision'],
        category: 'web',
        github: 'willy-de-paris/Applycam',
        demo: null
    },
    {
        name: 'Civil Sage',
        description: 'Plateforme civique pour les services publics et citoyens',
        tech: ['React', 'Node.js', 'MongoDB'],
        category: 'web',
        github: 'willy-de-paris/civil-sage',
        demo: null
    },
    {
        name: 'Qualipro Digital Exams',
        description: 'Système d\'examens numériques avec anti-triche',
        tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
        category: 'web',
        github: 'willy-de-paris/qualipro-digital-exams',
        demo: null
    },
    {
        name: 'Industry',
        description: 'Solution de gestion industrielle et monitoring',
        tech: ['React', 'Python', 'Django'],
        category: 'web',
        github: 'willy-de-paris/Industry',
        demo: null
    },
    {
        name: 'Gestion des Restaurants',
        description: 'Application de gestion pour restaurants et food service',
        tech: ['React Native', 'Firebase', 'Redux'],
        category: 'mobile',
        github: 'willy-de-paris/Gestion-des-restaurants-',
        demo: null
    },
    {
        name: 'UBA Phishing',
        description: 'Outil de simulation et détection de phishing',
        tech: ['Python', 'Machine Learning', 'Flask'],
        category: 'other',
        github: 'willy-de-paris/UBA-Phishing',
        demo: null
    },
    {
        name: 'Badge Generator',
        description: 'Générateur de badges et cartes d\'identité personnalisées',
        tech: ['JavaScript', 'Canvas API', 'HTML5'],
        category: 'web',
        github: 'willy-de-paris/badge_generator',
        demo: null
    },
    {
        name: 'Gestion des Dépenses',
        description: 'Application de suivi et gestion des dépenses personnelles',
        tech: ['React', 'Chart.js', 'localStorage'],
        category: 'web',
        github: 'willy-de-paris/getsion_des_depenses',
        demo: null
    },
    {
        name: 'Site Web Club Informatique',
        description: 'Site web pour club informatique avec gestion des membres',
        tech: ['WordPress', 'PHP', 'MySQL'],
        category: 'web',
        github: 'willy-de-paris/Site_Web_Club_informatique',
        demo: null
    },
    {
        name: 'E-commerce Django',
        description: 'Plateforme e-commerce complète avec panier et paiement',
        tech: ['Django', 'Python', 'Stripe API'],
        category: 'web',
        github: 'willy-de-paris/E-commerce_Django',
        demo: null
    },
    {
        name: 'Python Mario',
        description: 'Réimplémentation du jeu Mario en Python avec Pygame',
        tech: ['Python', 'Pygame', 'Game Development'],
        category: 'desktop',
        github: 'willy-de-paris/Python_Mario',
        demo: null
    },
    {
        name: 'TodoList Interface Python',
        description: 'Interface graphique pour gestion de tâches avec Python',
        tech: ['Python', 'Tkinter', 'SQLite'],
        category: 'desktop',
        github: 'willy-de-paris/TodoListe_interface_python',
        demo: null
    }
];

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Project filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        filterProjects(filter);
    });
});

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Load projects from GitHub API avec loading states
async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectsLoading = document.getElementById('projectsLoading');
    
    // Afficher les skeleton cards pendant le chargement
    showSkeletonCards();
    
    try {
        const username = 'willy-de-paris';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }
        
        const repos = await response.json();
        
        // Filter out archived repos and repos without description
        const filteredRepos = repos.filter(repo => 
            !repo.archived && 
            repo.description && 
            !repo.fork
        );
        
        // Combine with our project data
        const enhancedProjects = projects.map(project => {
            const repo = filteredRepos.find(r => r.name === project.github.split('/')[1]);
            return {
                ...project,
                stars: repo ? repo.stargazers_count : 0,
                forks: repo ? repo.forks_count : 0,
                language: repo ? repo.language : 'Unknown',
                updated_at: repo ? repo.updated_at : null,
                html_url: repo ? repo.html_url : `https://github.com/${project.github}`
            };
        });
        
        // Simuler un délai pour montrer le loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        displayProjects(enhancedProjects);
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        // Fallback to local project data
        await new Promise(resolve => setTimeout(resolve, 500));
        displayProjects(projects);
    } finally {
        projectsLoading.style.display = 'none';
    }
}

// Affiche des skeleton cards pendant le chargement
function showSkeletonCards() {
    const projectsGrid = document.getElementById('projectsGrid');
    const skeletonCount = 3;
    
    for (let i = 0; i < skeletonCount; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
            </div>
        `;
        projectsGrid.appendChild(skeletonCard);
    }
}

function displayProjects(projectsData) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Nettoyer les skeleton cards
    projectsGrid.innerHTML = '';
    
    projectsData.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px) scale(0.95)';
        projectCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        projectsGrid.appendChild(projectCard);
        
        // Animate cards appearing with staggered delay
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    const techTags = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    const stars = project.stars ? `<i class="fas fa-star"></i> ${project.stars}` : '';
    const forks = project.forks ? `<i class="fas fa-code-branch"></i> ${project.forks}` : '';
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-code"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-stats">
                ${stars ? `<span class="stat">${stars}</span>` : ''}
                ${forks ? `<span class="stat">${forks}</span>` : ''}
                ${project.language ? `<span class="stat"><i class="fas fa-circle" style="font-size: 8px; color: ${getLanguageColor(project.language)}"></i> ${project.language}</span>` : ''}
            </div>
            <div class="project-links">
                <a href="${project.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> Code
                </a>
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C#': '#239120',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Dockerfile': '#384d54',
        'Shell': '#89e051'
    };
    return colors[language] || '#858585';
}

// Contact form handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        // Send email using mailto link
        await sendEmail(data);
        
        // Show success message
        showNotification('Votre client email s\'ouvre avec le message pré-rempli. Envoyez-le pour me contacter directement!', 'success');
        contactForm.reset();
        
    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Veuillez entrer une adresse email valide');
    }
    
    if (!data.subject || data.subject.length < 3) {
        errors.push('Le sujet doit contenir au moins 3 caractères');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function sendEmail(data) {
    // Create mailto link with email content
    const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
    const body = encodeURIComponent(
        `Nom: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Sujet: ${data.subject}\n\n` +
        `Message:\n${data.message}\n\n` +
        `---\n` +
        `Envoyé depuis le portfolio de Wilfried Melangi\n` +
        `Date: ${new Date().toLocaleString('fr-FR')}`
    );
    
    const mailtoLink = `mailto:wilfriedmelangi@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate API call delay for UI consistency
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll reveal animation
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add scroll-reveal class to elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll('section, .project-card, .skill-category');
    elementsToReveal.forEach(element => {
        element.classList.add('scroll-reveal');
    });
});

// Typing effect avancé pour hero title
function typeWriter() {
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            
            // Ajoute un curseur clignotant
            heroTitle.innerHTML += '<span class="cursor">|</span>';
            setTimeout(() => {
                heroTitle.querySelector('.cursor')?.remove();
            }, 100);
            
            setTimeout(type, 100);
        } else {
            // Ajoute le curseur à la fin
            heroTitle.innerHTML += '<span class="cursor blink">|</span>';
        }
    }
    
    setTimeout(type, 500);
}

// Scroll reveal avancé
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Ajoute les classes de scroll reveal aux éléments
document.addEventListener('DOMContentLoaded', () => {
    // Hero section
    document.querySelector('.hero-profile')?.classList.add('scroll-reveal-scale');
    document.querySelector('.hero-title')?.classList.add('scroll-reveal');
    document.querySelector('.hero-subtitle')?.classList.add('scroll-reveal');
    document.querySelector('.hero-description')?.classList.add('scroll-reveal');
    document.querySelector('.hero-buttons')?.classList.add('scroll-reveal');
    document.querySelector('.hero-social')?.classList.add('scroll-reveal');
    
    // About section
    document.querySelector('.about-text')?.classList.add('scroll-reveal-left');
    document.querySelector('.about-info')?.classList.add('scroll-reveal-right');
    
    // Skills
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        category.classList.add('scroll-reveal-scale');
        category.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Projects
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('scroll-reveal-scale');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Certifications
    document.querySelectorAll('.certification-item').forEach((item, index) => {
        item.classList.add('scroll-reveal-scale');
        item.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Timeline
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Contact
    document.querySelector('.contact-info')?.classList.add('scroll-reveal-left');
    document.querySelector('.contact-form')?.classList.add('scroll-reveal-right');
});

// Performance optimizations
function optimizePerformance() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            handleScrollReveal();
            updateNavbar();
        });
    });
    
    // Optimize animations with requestAnimationFrame
    function optimizedAnimate(element, properties, duration) {
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            Object.keys(properties).forEach(prop => {
                element.style[prop] = properties[prop].from + 
                    (properties[prop].to - properties[prop].from) * progress + 'px';
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Preload critical resources
    preloadCriticalResources();
}

// Update navbar with throttling
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'var(--bg-glass)';
        navbar.style.boxShadow = 'none';
    }
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload font
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
    document.head.appendChild(fontLink);
    
    // Preload profile image
    const profileImg = document.querySelector('.profile-image');
    if (profileImg && !profileImg.complete) {
        const img = new Image();
        img.onload = () => {
            profileImg.src = img.src;
        };
        img.src = profileImg.dataset.src || profileImg.src;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance optimizations
    optimizePerformance();
    
    // Load projects
    loadGitHubProjects();
    
    // Start typing effect
    typeWriter();
    
    // Add scroll event listener for reveal animations
    window.addEventListener('scroll', handleScrollReveal);
    
    // Initial check for scroll reveal
    handleScrollReveal();
    
    // Enhanced hover effects for project cards
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add ripple effect
            createRipple(e, card);
            
            // Add tilt effect
            addTiltEffect(e, card);
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(0) scale(1)';
            removeTiltEffect(card);
        }
    });
    
    // Button click effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
            
            // Add success feedback
            if (this.classList.contains('btn-primary')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 - scrolled * 0.0005})`;
            heroContent.style.opacity = 1 - scrolled * 0.001;
        }
    });
    
    // Add hover sound effect (optional)
    addHoverSounds();
});

// Tilt effect for cards
function addTiltEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function removeTiltEffect(element) {
    element.style.transform = '';
}

// Add hover sounds (optional)
function addHoverSounds() {
    // Create audio context for subtle sounds
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        document.querySelectorAll('.btn, .social-link, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                playHoverSound(audioContext);
            });
        });
    } catch (e) {
        // Audio not supported, continue without sounds
    }
}

function playHoverSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Create ripple effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add CSS for notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: 1rem;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .project-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
`;
document.head.appendChild(notificationStyles);

// Add CSS for cursor, ripple effects and other visual improvements
const visualImprovementsStyles = document.createElement('style');
visualImprovementsStyles.textContent = `
    /* Styles pour le curseur clignotant */
    .cursor {
        color: var(--primary-color);
        font-weight: 300;
        animation: none;
    }

    .cursor.blink {
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    /* Ripple effect */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    /* Loading states */
    .loading {
        position: relative;
        overflow: hidden;
    }

    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: loading-shimmer 1.5s infinite;
    }

    @keyframes loading-shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    /* Smooth transitions pour tous les éléments */
    * {
        transition: color 0.3s ease, background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Focus states améliorés */
    button:focus,
    input:focus,
    textarea:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Text selection */
    ::selection {
        background: var(--primary-color);
        color: white;
    }

    ::-moz-selection {
        background: var(--primary-color);
        color: white;
    }

    /* Scrollbar personnalisée */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--gradient-primary);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-color);
    }
`;
document.head.appendChild(visualImprovementsStyles);
