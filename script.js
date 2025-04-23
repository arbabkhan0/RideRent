// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const searchTabs = document.querySelectorAll('.tab-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletter-form');
const vehiclesGrid = document.querySelector('.vehicles-grid');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialDots = document.querySelector('.testimonial-dots');
const navLinks = document.querySelector('.nav-links');

// We'll use the vehicle data from vehicles-data.js (allVehicles, carsData, bikesData)
// The existing vehicles array is no longer needed

// Testimonial Data
// const testimonials = [
//     {
//         id: 1,
//         name: 'John Smith',
//         text: 'The service was exceptional! The car was clean and well-maintained. Will definitely use again.',
//         rating: 5
//     },
//     {
//         id: 2,
//         name: 'Sarah Johnson',
//         text: 'I rented a bike for a weekend trip and it was perfect. The staff was friendly and helpful.',
//         rating: 4
//     },
//     {
//         id: 3,
//         name: 'Michael Brown',
//         text: 'Great experience overall. The online booking process was smooth and the vehicle was in excellent condition.',
//         rating: 5
//     }
// ];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        document.querySelector('.toggle-ball').style.transform = 'translateX(30px)';
    }

    // Load Vehicles
    if (typeof allVehicles !== 'undefined') {
        loadVehicles('all');
    } else {
        console.error('Vehicle data not found. Make sure vehicles-data.js is loaded.');
    }

    // Load Testimonials
    loadTestimonials();

    // Create Mobile Menu
    createMobileMenu();

    // Add animation classes to elements when they come into view
    animateOnScroll();

    // Update auth buttons
    updateAuthButtons();
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Move toggle ball with animation
    const toggleBall = document.querySelector('.toggle-ball');
    if (body.classList.contains('dark-mode')) {
        toggleBall.style.transform = 'translateX(30px)';
    } else {
        toggleBall.style.transform = 'translateX(0)';
    }
    
    // Save theme preference
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Search Tabs
searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        searchTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
    });
});

// Vehicle Filter
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filter = button.getAttribute('data-filter');
        
        // Load vehicles based on filter
        loadVehicles(filter);
    });
});

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate form submission
        alert(`Thank you for subscribing with ${email}! This is a demo message.`);
        
        // Reset form
        newsletterForm.reset();
    });
}

// Load Vehicles
function loadVehicles(filter) {
    // Clear vehicles grid
    if (!vehiclesGrid) return;
    vehiclesGrid.innerHTML = '';
    
    // Filter vehicles
    let filteredVehicles = [];
    
    if (filter === 'all') {
        filteredVehicles = allVehicles;
    } else if (filter === 'car') {
        filteredVehicles = carsData;
    } else if (filter === 'bike') {
        filteredVehicles = bikesData;
    }
    
    // Create vehicle cards
    filteredVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.setAttribute('data-type', vehicle.type);
        
        // Create specs HTML based on vehicle type
        let specsHTML = '';
        if (vehicle.type === 'car') {
            specsHTML = `
                <div class="spec-item"><i class="fas fa-user"></i> ${vehicle.seats} Seats</div>
                <div class="spec-item"><i class="fas fa-car"></i> ${vehicle.transmission}</div>
                <div class="spec-item"><i class="fas fa-gas-pump"></i> ${vehicle.fuelType}</div>
            `;
        } else {
            specsHTML = `
                <div class="spec-item"><i class="fas fa-tachometer-alt"></i> ${vehicle.engine}</div>
                <div class="spec-item"><i class="fas fa-cog"></i> ${vehicle.transmission}</div>
                <div class="spec-item"><i class="fas fa-gas-pump"></i> ${vehicle.fuelType}</div>
            `;
        }
        
        // Fix image path for use in index.html (removing leading ../)
        const imagePath = vehicle.image.replace('../', '');
        
        card.innerHTML = `
            <div class="vehicle-image">
                <img src="${imagePath}" alt="${vehicle.name}" onerror="this.src='images/placeholder.jpg'" class="img-fluid">
            </div>
            <div class="vehicle-info">
                <h3>${vehicle.name}</h3>
                <div class="vehicle-meta">
                    <div class="vehicle-type">${vehicle.category || (vehicle.type === 'car' ? 'Car' : 'Bike')}</div>
                    <div class="vehicle-price">$${vehicle.price}<span>/day</span></div>
                </div>
                <div class="vehicle-specs">
                    ${specsHTML}
                </div>
                <div class="vehicle-actions">
                    <a href="pages/${vehicle.type}s.html?id=${vehicle.id}" class="btn btn-secondary">View Details</a>
                    <a href="pages/booking.html?id=${vehicle.id}&type=${vehicle.type}" class="btn btn-primary">Rent Now</a>
                </div>
            </div>
        `;
        
        vehiclesGrid.appendChild(card);
        
        // Add animation
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100 * vehiclesGrid.children.length);
    });
}

// Load Testimonials
function loadTestimonials() {
    if (!testimonialSlider || !testimonialDots) return;
    
    // Clear testimonial slider and dots
    testimonialSlider.innerHTML = '';
    testimonialDots.innerHTML = '';
    
    // Create testimonial slides
    testimonials.forEach((testimonial, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.style.display = index === 0 ? 'block' : 'none';
        
        // Create rating stars
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < testimonial.rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        slide.innerHTML = `
            <div class="testimonial-content">
                <p>"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <h4>${testimonial.name}</h4>
                    <div class="rating">
                        ${stars}
                    </div>
                </div>
            </div>
        `;
        
        testimonialSlider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            // Hide all slides
            const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
            slides.forEach(s => s.style.display = 'none');
            
            // Show selected slide
            slides[index].style.display = 'block';
            
            // Update active dot
            const dots = testimonialDots.querySelectorAll('.dot');
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
        
        testimonialDots.appendChild(dot);
    });
    
    // Auto rotate testimonials
    let currentSlide = 0;
    setInterval(() => {
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const dots = testimonialDots.querySelectorAll('.dot');
        
        // Hide current slide
        slides[currentSlide].style.display = 'none';
        dots[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Show next slide
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }, 5000);
}

// Create Mobile Menu
function createMobileMenu() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Clone nav links and auth buttons
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    const authButtons = document.querySelector('.auth-buttons').cloneNode(true);
    
    // Add close button
    const closeButton = document.createElement('div');
    closeButton.className = 'close-menu';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    
    // Append elements to mobile menu
    mobileMenu.appendChild(closeButton);
    mobileMenu.appendChild(navLinks);
    mobileMenu.appendChild(authButtons);
    
    // Append mobile menu to body
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close mobile menu
    closeButton.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .vehicle-card, .testimonial-content, .newsletter-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Add CSS class for animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fade-in {
            animation: fadeIn 0.8s ease forwards;
        }
    </style>
`);

// User Authentication
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Update auth buttons based on login status
function updateAuthButtons() {
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) return;
    
    if (isLoggedIn && currentUser) {
        authButtonsContainer.innerHTML = `
            <div class="user-profile">
                <span>Welcome, ${currentUser.name}</span>
                <a href="pages/profile.html" class="btn btn-secondary">My Profile</a>
                <button id="logout-btn" class="btn btn-primary">Logout</button>
            </div>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
}

// Call update auth buttons
updateAuthButtons();

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
}); 