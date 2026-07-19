function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.lawyers-page, .home-page').forEach(p => p.style.display = 'none');
    const container = document.querySelector('.signup-wrap');

    if (pageId === 'lawyers-page') {
        if (container) container.style.display = 'none';
        document.getElementById('lawyers-page').style.display = 'block';
    } else if (pageId === 'home-page') {
        if (container) container.style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    } else {
        if (container) container.style.display = 'block';
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
    }
}

function showSignupForm(type) {
    showPage(type === 'lawyer' ? 'lawyer-signup' : 'user-signup');
}

function goToSignup() {
    showPage('signup-selection');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let selectedPhotoBase64 = null;

function previewPhoto(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast('Photo must be under 2MB', 'error');
        input.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        selectedPhotoBase64 = e.target.result;
        document.getElementById('photo-preview').innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
    };
    reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', function () {
    updateNavAuth();

    const lawyerForm = document.getElementById('lawyer-form');
    if (lawyerForm) {
        lawyerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Creating Account...';
            button.disabled = true;

            const payload = {
                name: document.getElementById('lawyer-name').value.trim(),
                email: document.getElementById('lawyer-email').value.trim(),
                password: document.getElementById('lawyer-password').value,
                phone: document.getElementById('lawyer-phone').value.trim(),
                role: 'LAWYER',
                barNumber: document.getElementById('lawyer-license').value.trim(),
                specialization: document.getElementById('lawyer-specialization').value,
                experience: parseInt(document.getElementById('lawyer-experience').value) || 0,
                firm: document.getElementById('lawyer-firm').value.trim(),
                address: document.getElementById('lawyer-address').value.trim(),
                bio: document.getElementById('lawyer-bio').value.trim(),
                profileImage: selectedPhotoBase64
            };

            const errors = [];
            if (!payload.name) errors.push('Name is required');
            if (!payload.email || !isValidEmail(payload.email)) errors.push('Valid email is required');
            if (!payload.password || payload.password.length < 6) errors.push('Password must be at least 6 characters');
            if (!payload.barNumber) errors.push('Bar license number is required');
            if (!payload.specialization) errors.push('Specialization is required');
            if (errors.length > 0) {
                showToast(errors.join('\n'), 'error');
                button.textContent = originalText;
                button.disabled = false;
                return;
            }

            try {
                const data = await apiFetch('/api/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                if (data) {
                    setToken(data.token);
                    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
                    showToast('Lawyer account created successfully!', 'success');
                    document.getElementById('lawyer-form').reset();
                    selectedPhotoBase64 = null;
                    document.getElementById('photo-preview').innerHTML = '<i class="fas fa-camera"></i>';
                    document.getElementById('lawyers-page').style.display = 'block';
                    document.querySelector('.signup-wrap').style.display = 'none';
                }
            } catch (err) {
                showToast(err.message || 'Signup failed', 'error');
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Creating Account...';
            button.disabled = true;

            const payload = {
                name: document.getElementById('user-name').value.trim(),
                email: document.getElementById('user-email').value.trim(),
                password: document.getElementById('user-password').value,
                phone: document.getElementById('user-phone').value.trim(),
                location: document.getElementById('user-location').value.trim(),
                role: 'CLIENT'
            };

            const errors = [];
            if (!payload.name) errors.push('Name is required');
            if (!payload.email || !isValidEmail(payload.email)) errors.push('Valid email is required');
            if (!payload.password || payload.password.length < 6) errors.push('Password must be at least 6 characters');
            if (errors.length > 0) {
                showToast(errors.join('\n'), 'error');
                button.textContent = originalText;
                button.disabled = false;
                return;
            }

            try {
                const data = await apiFetch('/api/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                if (data) {
                    setToken(data.token);
                    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
                    showToast('Client account created successfully!', 'success');
                    document.getElementById('user-form').reset();
                    document.getElementById('home-page').style.display = 'block';
                    document.querySelector('.signup-wrap').style.display = 'none';
                }
            } catch (err) {
                showToast(err.message || 'Signup failed', 'error');
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }

    showPage('signup-selection');
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') goToSignup();
});
