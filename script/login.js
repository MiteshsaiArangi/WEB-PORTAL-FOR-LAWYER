// script.js

function switchTab(tabType) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tabType + '-tab').classList.add('active');
}

function forgotPassword(userType) {
    alert(`Forgot password for ${userType}. Redirecting to password recovery...`);
    // Here you would typically redirect to a password recovery page
}

function showSignup(userType) {
    alert(`Redirecting to ${userType} signup page...`);
    // Here you would typically redirect to a signup page
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle user form submission
    document.getElementById('userLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        
        // Basic validation
        if (email && password) {
            // Show loading state
            const button = this.querySelector('.login-button');
            const originalText = button.textContent;
            button.textContent = 'Signing In...';
            button.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Navigate to client dashboard
                window.location.href = 'profiles.html';
                // Alternative: window.location.href = '/client/dashboard';
            }, 1000);
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Handle lawyer form submission
    document.getElementById('lawyerLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('lawyerEmail').value;
        const password = document.getElementById('lawyerPassword').value;
        const barNumber = document.getElementById('barNumber').value;
        
        // Basic validation
        if (email && password && barNumber) {
            // Show loading state
            const button = this.querySelector('.login-button');
            const originalText = button.textContent;
            button.textContent = 'Signing In...';
            button.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Navigate to lawyer dashboard
                window.location.href = 'profiles.html';
                // Alternative: window.location.href = '/lawyer/dashboard';
            }, 1000);
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Add smooth transitions and interactions
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// Example function for actual login implementation with navigation
// Modify this when integrating with your backend
function submitLogin(userType, formData) {
    const endpoint = userType === 'lawyer' ? '/api/lawyer/login' : '/api/user/login';
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store auth token if needed
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userType', userType);
            
            // Navigate to appropriate dashboard
            if (userType === 'lawyer') {
                window.location.href = 'profiles.html';
                // Or: window.location.href = '/lawyer/dashboard';
            } else {
                window.location.href = 'profiles.html';
                // Or: window.location.href = '/client/dashboard';
            }
        } else {
            alert('Login failed: ' + data.message);
            // Reset button state
            const button = document.querySelector('.login-button');
            button.textContent = userType === 'lawyer' ? 'Sign In as Lawyer' : 'Sign In as Client';
            button.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
        // Reset button state
        const button = document.querySelector('.login-button');
        button.textContent = userType === 'lawyer' ? 'Sign In as Lawyer' : 'Sign In as Client';
        button.disabled = false;
    });
}

// Function to handle forgot password navigation
function forgotPassword(userType) {
    // Navigate to forgot password page
    if (userType === 'lawyer') {
        window.location.href = 'forgot-password-lawyer.html';
    } else {
        window.location.href = 'forgot-password-client.html';
    }
}

// Function to handle signup navigation
function showSignup(userType) {
    // Navigate to signup page
    if (userType === 'lawyer') {
        window.location.href = 'Signup.html';
    } else {
        window.location.href = 'profiles.html';
    }
}