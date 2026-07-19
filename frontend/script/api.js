const API_BASE = 'http://localhost:8080';

function getToken() {
    return localStorage.getItem('authToken');
}

function setToken(token) {
    localStorage.setItem('authToken', token);
}

function clearToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

function getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function isLoggedIn() {
    return !!getToken();
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    clearToken();
    window.location.href = 'login.html';
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(API_BASE + endpoint, { ...options, headers });

    if (response.status === 401) {
        clearToken();
        window.location.href = 'login.html';
        return null;
    }

    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        data = {};
    }
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed (HTTP ' + response.status + ')');
    }
    return data;
}

function updateNavAuth() {
    const user = getUser();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    if (user) {
        const dashLink = user.role === 'LAWYER' ? 'dashboard-lawyer.html' : 'dashboard-client.html';
        navActions.innerHTML = `
            <a href="${dashLink}" class="btn-ghost">Dashboard</a>
            <button onclick="logout()" class="btn-fill" style="cursor:pointer;border:none;">Sign Out</button>
        `;
    }
}

function showToast(message, type) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:14px 24px;border-radius:8px;color:#fff;font-size:0.95rem;z-index:9999;transition:opacity 0.3s;max-width:400px;';
        document.body.appendChild(toast);
    }
    toast.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
