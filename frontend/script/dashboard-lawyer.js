let allAppointments = [];
let allCases = [];
let allMessages = [];
let currentAptFilter = 'ALL';
let currentCaseFilter = 'ALL';
let lawyerProfile = null;

document.addEventListener('DOMContentLoaded', function () {
    if (!requireAuth()) return;
    const user = getUser();
    if (!user) return;

    if (user.role === 'CLIENT') {
        window.location.href = 'dashboard-client.html';
        return;
    }

    document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profile-avatar-big').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profile-name').textContent = user.name;

    loadDashboard();
    loadAppointments();
    loadCases();
    loadMessages();
    loadProfile();
});

function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + name).classList.add('active');
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        if (btn.getAttribute('onclick').includes(name)) btn.classList.add('active');
    });
    document.getElementById('page-title').textContent =
        name === 'overview' ? 'Overview' : name === 'appointments' ? 'Appointments' :
        name === 'cases' ? 'My Cases' : name === 'messages' ? 'Messages' : 'Profile';
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openCaseModal() { document.getElementById('case-modal').classList.add('active'); }
function openMessageModal() { document.getElementById('message-modal').classList.add('active'); }

// --- Dashboard ---
async function loadDashboard() {
    try {
        const dash = await apiFetch('/api/lawyer/dashboard');
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

// --- Appointments ---
async function loadAppointments() {
    try {
        allAppointments = await apiFetch('/api/lawyer/appointments');
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
                <h4>${escapeHtml(a.clientName)}</h4>
                <p>${escapeHtml(a.caseType || 'General Consultation')} · ${a.date} at ${a.timeSlot}</p>
                <p style="font-size:0.85rem;color:#666;margin-top:4px;">${escapeHtml(a.description || '')}</p>
                <span class="status-badge ${a.status.toLowerCase()}">${a.status}</span>
            </div>
            <div class="apt-actions">
                ${a.status === 'PENDING' ? `
                    <button class="btn-fill" onclick="updateApt('${a.id}', 'CONFIRMED')">Accept</button>
                    <button class="btn-ghost" onclick="updateApt('${a.id}', 'CANCELLED')">Decline</button>
                ` : ''}
                ${a.status === 'CONFIRMED' ? `
                    <button class="btn-fill" onclick="updateApt('${a.id}', 'COMPLETED')">Complete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function updateApt(id, status) {
    try {
        await apiFetch('/api/lawyer/appointments/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        showToast('Appointment updated', 'success');
        loadAppointments();
        loadDashboard();
    } catch (e) { showToast(e.message, 'error'); }
}

// --- Cases ---
async function loadCases() {
    try {
        allCases = await apiFetch('/api/lawyer/cases');
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
                <p>${escapeHtml(c.caseType || 'General')} · ${escapeHtml(c.clientName || 'No client assigned')}</p>
                <p style="font-size:0.85rem;color:#666;margin-top:4px;">${escapeHtml((c.description || '').substring(0, 100))}</p>
                <span class="status-badge ${c.status.toLowerCase()}">${c.status}</span>
            </div>
            <div class="case-actions">
                ${c.status !== 'CLOSED' ? `
                    <button class="btn-ghost" onclick="updateCase('${c.id}', '${c.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'}')">
                        ${c.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

document.getElementById('case-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        await apiFetch('/api/lawyer/cases', {
            method: 'POST',
            body: JSON.stringify({
                title: document.getElementById('cs-title').value,
                description: document.getElementById('cs-desc').value,
                caseType: document.getElementById('cs-type').value,
                status: 'ACTIVE'
            })
        });
        showToast('Case created!', 'success');
        closeModal('case-modal');
        this.reset();
        loadCases();
        loadDashboard();
    } catch (e) { showToast(e.message || 'Failed to create case', 'error'); }
});

async function updateCase(id, status) {
    try {
        await apiFetch('/api/lawyer/cases/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        showToast('Case updated', 'success');
        loadCases();
        loadDashboard();
    } catch (e) { showToast(e.message, 'error'); }
}

// --- Messages ---
async function loadMessages() {
    try {
        allMessages = await apiFetch('/api/lawyer/messages');
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
        await apiFetch('/api/lawyer/messages', {
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
    } catch (e) { showToast(e.message || 'Failed to send', 'error'); }
});

// --- Profile ---
async function loadProfile() {
    try {
        lawyerProfile = await apiFetch('/api/lawyer/profile');
        if (lawyerProfile) {
            document.getElementById('pf-name').value = lawyerProfile.name || '';
            document.getElementById('pf-email').value = lawyerProfile.email || '';
            document.getElementById('pf-phone').value = lawyerProfile.phone || '';
            document.getElementById('pf-firm').value = lawyerProfile.firm || '';
            document.getElementById('pf-address').value = lawyerProfile.address || '';
            document.getElementById('pf-bio').value = lawyerProfile.bio || '';
            document.getElementById('pf-skills').value = (lawyerProfile.skills || []).join(', ');
            document.getElementById('pf-available').value = lawyerProfile.available ? 'true' : 'false';
            document.getElementById('profile-name').textContent = lawyerProfile.name;
            document.getElementById('profile-spec').textContent = lawyerProfile.specialization;
            document.getElementById('user-name').textContent = lawyerProfile.name;
        }
    } catch (e) { console.error('Profile error:', e); }
}

document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const skillsVal = document.getElementById('pf-skills').value;
        await apiFetch('/api/lawyer/profile', {
            method: 'PUT',
            body: JSON.stringify({
                name: document.getElementById('pf-name').value,
                phone: document.getElementById('pf-phone').value,
                firm: document.getElementById('pf-firm').value,
                address: document.getElementById('pf-address').value,
                bio: document.getElementById('pf-bio').value,
                skills: skillsVal ? skillsVal.split(',').map(s => s.trim()) : [],
                available: document.getElementById('pf-available').value === 'true'
            })
        });
        const user = getUser();
        user.name = document.getElementById('pf-name').value;
        setUser(user);
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
        showToast('Profile updated!', 'success');
    } catch (e) { showToast(e.message || 'Update failed', 'error'); }
});

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
