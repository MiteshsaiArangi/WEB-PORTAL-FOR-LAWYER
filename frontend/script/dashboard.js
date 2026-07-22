let allLawyers = [];
let currentAptFilter = 'ALL';
let currentCaseFilter = 'ALL';
let allAppointments = [];
let allCases = [];
let allMessages = [];

document.addEventListener('DOMContentLoaded', function () {
    if (!requireAuth()) return;
    const user = getUser();
    if (!user) return;

    if (user.role === 'LAWYER') {
        window.location.href = 'dashboard-lawyer.html';
        return;
    }

    document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profile-avatar-big').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('pf-name').value = user.name || '';
    document.getElementById('pf-email').value = user.email || '';

    loadDashboard();
    loadLawyers();
    loadAppointments();
    loadCases();
    loadMessages();
    loadProfile();
    setupCascadingDropdowns('state-filter', 'city-filter');
    document.getElementById('state-filter').addEventListener('change', function() {
        if (!this.value) document.getElementById('city-filter').disabled = true;
    });
});

function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + name).classList.add('active');
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        if (btn.getAttribute('onclick').includes(name)) btn.classList.add('active');
    });
    document.getElementById('page-title').textContent =
        name === 'overview' ? 'Overview' : name === 'attorneys' ? 'Find Attorneys' :
        name === 'appointments' ? 'Appointments' : name === 'cases' ? 'My Cases' :
        name === 'messages' ? 'Messages' : 'Profile';
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function openBookingModal() {
    document.getElementById('booking-modal').classList.add('active');
}

function openMessageModal() {
    document.getElementById('message-modal').classList.add('active');
}

// --- Dashboard Stats ---
async function loadDashboard() {
    try {
        const dash = await apiFetch('/api/client/dashboard');
        if (dash) {
            document.getElementById('stat-appointments').textContent = dash.totalAppointments;
            document.getElementById('stat-pending').textContent = dash.pendingAppointments;
            document.getElementById('stat-cases').textContent = dash.activeCases;
            document.getElementById('stat-messages').textContent = dash.unreadMessages;
            const badge = document.getElementById('apt-badge');
            if (dash.pendingAppointments > 0) badge.textContent = dash.pendingAppointments;
            const msgBadge = document.getElementById('msg-badge');
            if (dash.unreadMessages > 0) msgBadge.textContent = dash.unreadMessages;
        }
    } catch (e) { console.error('Dashboard error:', e); }
}

// --- Lawyers ---
async function loadLawyers() {
    try {
        allLawyers = await apiFetch('/api/client/lawyers');
        renderLawyers(allLawyers);
    } catch (e) { console.error('Lawyers error:', e); }
}

function renderLawyers(lawyers) {
    const grid = document.getElementById('attorneys-grid');
    if (!lawyers || lawyers.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-user-tie"></i><p>No attorneys found</p></div>';
        return;
    }
    grid.innerHTML = lawyers.map(l => `
        <div class="attorney-card">
            <img src="${l.profileImage || 'https://res.cloudinary.com/dzeal21vu/image/upload/v1733577417/concerned-mature-indian-businessman-at-office-desk-with-laptop-computer_fyr0jm.jpg'}" alt="${escapeHtml(l.name)}">
            <div class="attorney-info">
                <span class="spec-tag">${escapeHtml(l.specialization)}</span>
                <h3>${escapeHtml(l.name)}</h3>
                <p>${l.experience} yrs · ${escapeHtml(l.firm || '')}</p>
                ${(l.city || l.state) ? `<p style="font-size:12px;color:var(--ink-faint);margin-bottom:6px;"><i class="fas fa-map-marker-alt"></i> ${[l.city, l.state].filter(Boolean).join(', ')}</p>` : ''}
                <p class="attorney-bio">${escapeHtml((l.bio || '').substring(0, 100))}...</p>
                <div class="attorney-actions">
                    <button class="btn-fill" onclick="bookWithLawyer('${l.id}', '${escapeHtml(l.name)}')">Book Appointment</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterAttorneys() {
    const search = document.getElementById('attorney-search').value.toLowerCase();
    const spec = document.getElementById('spec-filter').value;
    const state = document.getElementById('state-filter').value;
    const city = document.getElementById('city-filter').value;
    let filtered = allLawyers;
    if (search) filtered = filtered.filter(l => (l.name || '').toLowerCase().includes(search) || (l.specialization || '').toLowerCase().includes(search));
    if (spec) filtered = filtered.filter(l => (l.specialization || '').toLowerCase() === spec.toLowerCase());
    if (state) filtered = filtered.filter(l => (l.state || '') === state);
    if (city) filtered = filtered.filter(l => (l.city || '') === city);
    renderLawyers(filtered);
}

function bookWithLawyer(id, name) {
    openBookingModal();
    document.getElementById('bk-lawyer-name').value = name;
    document.getElementById('bk-lawyer-id').value = id;
    showSection('appointments');
}

// --- Appointments ---
async function loadAppointments() {
    try {
        allAppointments = await apiFetch('/api/client/appointments');
        renderAppointments();
    } catch (e) { console.error('Appointments error:', e); }
}

function filterApts(status, btn) {
    currentAptFilter = status;
    document.querySelectorAll('#sec-appointments .ftab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAppointments();
}

function renderAppointments() {
    const list = document.getElementById('appointments-list');
    let filtered = currentAptFilter === 'ALL' ? allAppointments : allAppointments.filter(a => a.status === currentAptFilter);
    if (!filtered || filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>No appointments found</p></div>';
        return;
    }
    list.innerHTML = filtered.map(a => `
        <div class="appointment-item">
            <div class="apt-info">
                <h4>${escapeHtml(a.lawyerName)}</h4>
                <p>${escapeHtml(a.caseType || 'General Consultation')} · ${a.date} at ${a.timeSlot}</p>
                <span class="status-badge ${a.status.toLowerCase()}">${a.status}</span>
            </div>
            ${a.status === 'PENDING' ? `<button class="btn-ghost" onclick="cancelAppointment('${a.id}')">Cancel</button>` : ''}
        </div>
    `).join('');
}

document.getElementById('booking-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        await apiFetch('/api/client/appointments', {
            method: 'POST',
            body: JSON.stringify({
                lawyerId: document.getElementById('bk-lawyer-id').value,
                date: document.getElementById('bk-date').value,
                timeSlot: document.getElementById('bk-slot').value,
                caseType: document.getElementById('bk-case-type').value,
                description: document.getElementById('bk-desc').value
            })
        });
        showToast('Appointment booked!', 'success');
        closeModal('booking-modal');
        this.reset();
        loadAppointments();
        loadDashboard();
    } catch (e) {
        showToast(e.message || 'Booking failed', 'error');
    }
});

async function cancelAppointment(id) {
    if (!confirm('Cancel this appointment?')) return;
    try {
        await apiFetch('/api/client/appointments/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status: 'CANCELLED' })
        });
        showToast('Appointment cancelled', 'success');
        loadAppointments();
        loadDashboard();
    } catch (e) { showToast(e.message, 'error'); }
}

// --- Cases ---
async function loadCases() {
    try {
        allCases = await apiFetch('/api/client/cases');
        renderCases();
    } catch (e) { console.error('Cases error:', e); }
}

function filterCases(status, btn) {
    currentCaseFilter = status;
    document.querySelectorAll('#sec-cases .ftab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCases();
}

function renderCases() {
    const list = document.getElementById('cases-list');
    let filtered = currentCaseFilter === 'ALL' ? allCases : allCases.filter(c => c.status === currentCaseFilter);
    if (!filtered || filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No cases found</p></div>';
        return;
    }
    list.innerHTML = filtered.map(c => `
        <div class="case-item">
            <div class="case-info">
                <h4>${escapeHtml(c.title)}</h4>
                <p>${escapeHtml(c.caseType || 'General')} · Lawyer: ${escapeHtml(c.lawyerName || 'Unassigned')}</p>
                <span class="status-badge ${c.status.toLowerCase()}">${c.status}</span>
            </div>
        </div>
    `).join('');
}

// --- Messages ---
async function loadMessages() {
    try {
        allMessages = await apiFetch('/api/client/messages');
        renderMessages();
    } catch (e) { console.error('Messages error:', e); }
}

function renderMessages() {
    const list = document.getElementById('messages-list');
    const userId = getUser().id;
    if (!allMessages || allMessages.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-envelope"></i><p>No messages yet</p></div>';
        return;
    }
    list.innerHTML = allMessages.map(m => {
        const isSent = m.senderId === userId;
        const otherName = isSent ? m.receiverName : m.senderName;
        const otherId = isSent ? m.receiverId : m.senderId;
        const label = isSent ? 'To: ' + escapeHtml(m.receiverName) : 'From: ' + escapeHtml(m.senderName);
        return `
        <div class="message-item ${m.read ? '' : 'unread'}">
            <div class="msg-info">
                <h4>${label}</h4>
                <p>${escapeHtml(m.content)}</p>
                <span class="msg-time">${m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <div class="msg-actions">
                <button class="btn-ghost btn-sm" onclick="openReplyModal('${otherId}', '${escapeHtml(otherName)}')"><i class="fas fa-reply"></i> Reply</button>
            </div>
        </div>`;
    }).join('');
}

function openReplyModal(receiverId, receiverName) {
    document.getElementById('msg-receiver').value = receiverId;
    document.getElementById('msg-receiver-name').value = receiverName;
    document.getElementById('msg-content').focus();
    openMessageModal();
}

document.getElementById('message-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        await apiFetch('/api/client/messages', {
            method: 'POST',
            body: JSON.stringify({
                receiverId: document.getElementById('msg-receiver').value,
                receiverName: document.getElementById('msg-receiver-name').value,
                content: document.getElementById('msg-content').value
            })
        });
        showToast('Message sent!', 'success');
        closeModal('message-modal');
        this.reset();
        loadMessages();
    } catch (e) {
        showToast(e.message || 'Failed to send', 'error');
    }
});

// --- Profile ---
async function loadProfile() {
    try {
        const profile = await apiFetch('/api/client/profile');
        if (profile) {
            document.getElementById('pf-name').value = profile.name || '';
            document.getElementById('pf-email').value = profile.email || '';
            document.getElementById('pf-phone').value = profile.phone || '';
            document.getElementById('pf-location').value = profile.location || '';
        }
    } catch (e) { console.error('Profile error:', e); }
}

document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        await apiFetch('/api/client/profile', {
            method: 'PUT',
            body: JSON.stringify({
                name: document.getElementById('pf-name').value,
                phone: document.getElementById('pf-phone').value,
                location: document.getElementById('pf-location').value
            })
        });
        const user = getUser();
        user.name = document.getElementById('pf-name').value;
        setUser(user);
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
        showToast('Profile updated!', 'success');
    } catch (e) {
        showToast(e.message || 'Update failed', 'error');
    }
});

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
