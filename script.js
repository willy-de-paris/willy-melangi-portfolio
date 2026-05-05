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

// Load projects from GitHub API
async function loadGitHubProjects() {
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
        
        displayProjects(enhancedProjects);
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        // Fallback to local project data
        displayProjects(projects);
    } finally {
        projectsLoading.style.display = 'none';
    }
}

function displayProjects(projectsData) {
    projectsGrid.innerHTML = '';
    
    projectsData.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';
        projectCard.style.transition = 'all 0.5s ease';
        
        projectsGrid.appendChild(projectCard);
        
        // Animate cards appearing
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
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

// Typing effect for hero title
function typeWriter() {
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load projects
    loadGitHubProjects();
    
    // Start typing effect
    typeWriter();
    
    // Add scroll event listener for reveal animations
    window.addEventListener('scroll', handleScrollReveal);
    
    // Initial check for scroll reveal
    handleScrollReveal();
    
    // Add smooth hover effects to project cards
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

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
