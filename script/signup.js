// Store lawyers data in memory
let lawyers = [];

/**
 * Show specific page and hide others
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    // Hide all pages in container
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Hide full-page sections
    document.querySelectorAll('.lawyers-page, .home-page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show container by default
    document.querySelector('.container').style.display = 'block';

    // Handle different page types
    if (pageId === 'lawyers-page') {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('lawyers-page').style.display = 'block';
        displayLawyers();
    } else if (pageId === 'home-page') {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    } else {
        // Show page within container
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
}

/**
 * Show signup form based on user type
 * @param {string} type - 'lawyer' or 'user'
 */
function showSignupForm(type) {
    if (type === 'lawyer') {
        showPage('lawyer-signup');
    } else if (type === 'user') {
        showPage('user-signup');
    }
}

/**
 * Navigate back to signup selection page
 */
function goToSignup() {
    showPage('signup-selection');
}

/**
 * Display all registered lawyers on the lawyers page
 */
function displayLawyers() {
    const lawyersList = document.getElementById('lawyers-list');
    
    if (lawyers.length === 0) {
        lawyersList.innerHTML = `
            <div class="lawyer-card empty-state">
                <h3>No lawyers registered yet</h3>
                <p>Be the first to join our professional network!</p>
            </div>
        `;
        return;
    }

    lawyersList.innerHTML = lawyers.map(lawyer => createLawyerCard(lawyer)).join('');
}

/**
 * Create HTML for a lawyer card
 * @param {Object} lawyer - Lawyer data object
 * @returns {string} HTML string for lawyer card
 */
function createLawyerCard(lawyer) {
    return `
        <div class="lawyer-card">
            <h3>${escapeHtml(lawyer.name)}</h3>
            <div class="lawyer-info">
                <div class="info-item">
                    <div class="info-label">Specialization</div>
                    <div class="info-value">${formatSpecialization(lawyer.specialization)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Experience</div>
                    <div class="info-value">${lawyer.experience} ${lawyer.experience === '1' ? 'year' : 'years'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">License Number</div>
                    <div class="info-value">${escapeHtml(lawyer.license)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Contact</div>
                    <div class="info-value">
                        ${escapeHtml(lawyer.email)}<br>
                        ${escapeHtml(lawyer.phone)}
                    </div>
                </div>
                ${lawyer.firm ? `
                <div class="info-item">
                    <div class="info-label">Law Firm</div>
                    <div class="info-value">${escapeHtml(lawyer.firm)}</div>
                </div>
                ` : ''}
                ${lawyer.address ? `
                <div class="info-item">
                    <div class="info-label">Office Address</div>
                    <div class="info-value">${escapeHtml(lawyer.address)}</div>
                </div>
                ` : ''}
            </div>
            ${lawyer.bio ? `
            <div class="bio-section">
                <div class="info-label">Professional Bio</div>
                <div class="info-value" style="margin-top: 8px;">${escapeHtml(lawyer.bio)}</div>
            </div>
            ` : ''}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666;">
                <strong>Registered:</strong> ${lawyer.registrationDate}
            </div>
        </div>
    `;
}

/**
 * Format specialization for display
 * @param {string} specialization - Raw specialization value
 * @returns {string} Formatted specialization
 */
function formatSpecialization(specialization) {
    const specializationMap = {
        'criminal': 'Criminal Law',
        'civil': 'Civil Law',
        'corporate': 'Corporate Law',
        'family': 'Family Law',
        'tax': 'Tax Law',
        'property': 'Property Law',
        'other': 'Other'
    };
    
    return specializationMap[specialization] || specialization;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and errors
 */
function validateForm(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Experience validation for lawyers
    if (formData.experience !== undefined) {
        const exp = parseInt(formData.experience);
        if (isNaN(exp) || exp < 0 || exp > 100) {
            errors.push('Please enter a valid years of experience (0-100)');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show success message
 * @param {string} message - Success message
 * @param {Function} callback - Callback function to execute after delay
 */
function showSuccessMessage(message, callback) {
    alert(`✅ ${message}`);
    if (callback) {
        setTimeout(callback, 1000);
    }
}

/**
 * Show error message
 * @param {Array} errors - Array of error messages
 */
function showErrorMessage(errors) {
    const errorMessage = errors.join('\n');
    alert(`❌ Please fix the following errors:\n\n${errorMessage}`);
}

/**
 * Reset form
 * @param {string} formId - ID of form to reset
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Lawyer form submission
    const lawyerForm = document.getElementById('lawyer-form');
    if (lawyerForm) {
        lawyerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('lawyer-name').value.trim(),
                email: document.getElementById('lawyer-email').value.trim(),
                password: document.getElementById('lawyer-password').value,
                phone: document.getElementById('lawyer-phone').value.trim(),
                license: document.getElementById('lawyer-license').value.trim(),
                specialization: document.getElementById('lawyer-specialization').value,
                experience: document.getElementById('lawyer-experience').value,
                firm: document.getElementById('lawyer-firm').value.trim(),
                address: document.getElementById('lawyer-address').value.trim(),
                bio: document.getElementById('lawyer-bio').value.trim(),
                registrationDate: new Date().toLocaleDateString()
            };

            // Validate required fields
            const requiredFields = ['name', 'email', 'password', 'phone', 'license', 'specialization', 'experience'];
            const validation = validateForm(formData, requiredFields);
            
            if (!validation.isValid) {
                showErrorMessage(validation.errors);
                return;
            }

            // Add lawyer to the list
            lawyers.push(formData);
            
            // Show success and redirect
            showSuccessMessage(
                'Lawyer account created successfully! Redirecting to lawyers directory...',
                () => {
                    resetForm('lawyer-form');
                    showPage('lawyers-page');
                }
            );
        });
    }

    // User form submission
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('user-name').value.trim(),
                email: document.getElementById('user-email').value.trim(),
                password: document.getElementById('user-password').value,
                phone: document.getElementById('user-phone').value.trim(),
                location: document.getElementById('user-location').value.trim(),
                registrationDate: new Date().toLocaleDateString()
            };

            // Validate required fields
            const requiredFields = ['name', 'email', 'password'];
            const validation = validateForm(formData, requiredFields);
            
            if (!validation.isValid) {
                showErrorMessage(validation.errors);
                return;
            }

            // Show success and redirect
            showSuccessMessage(
                'User account created successfully! Welcome to Legal Portal!',
                () => {
                    resetForm('user-form');
                    showPage('home-page');
                }
            );
        });
    }

    // Initialize page
    showPage('signup-selection');
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to go back to main page
    if (e.key === 'Escape') {
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id !== 'signup-selection') {
            showPage('signup-selection');
        } else if (document.getElementById('lawyers-page').style.display === 'block' || 
                   document.getElementById('home-page').style.display === 'block') {
            showPage('signup-selection');
        }
    }
});

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showPage,
        showSignupForm,
        goToSignup,
        displayLawyers,
        validateForm,
        isValidEmail
    };
}