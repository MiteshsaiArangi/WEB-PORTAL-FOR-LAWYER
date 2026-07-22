document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    const user = getUser();
    if (user.role !== 'ADMIN') {
        window.location.href = user.role === 'LAWYER' ? 'dashboard-lawyer.html' : 'dashboard-client.html';
        return;
    }
    document.getElementById('user-name').textContent = user.name || 'Admin';
    document.getElementById('user-avatar').textContent = (user.name || 'A')[0];
    loadDashboard();
    loadPendingLawyers();
});

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.querySelector(`.nav-item[onclick*="'${id}'"]`).classList.add('active');
    const titles = { overview: 'Admin Overview', pending: 'Pending Verifications', verified: 'Verified Lawyers', rejected: 'Rejected Lawyers' };
    document.getElementById('page-title').textContent = titles[id] || 'Admin';
    if (id === 'overview') loadDashboard();
    if (id === 'pending') loadPendingLawyers();
    if (id === 'verified') loadVerifiedLawyers();
    if (id === 'rejected') loadRejectedLawyers();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

async function loadDashboard() {
    try {
        const data = await apiFetch('/api/admin/dashboard');
        if (!data) return;
        document.getElementById('stat-total-users').textContent = data.totalUsers;
        document.getElementById('stat-total-lawyers').textContent = data.totalLawyers;
        document.getElementById('stat-verified').textContent = data.verifiedLawyers;
        document.getElementById('stat-pending').textContent = data.pendingLawyers;
        const badge = document.getElementById('pending-badge');
        if (data.pendingLawyers > 0) {
            badge.textContent = data.pendingLawyers;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    } catch (err) {
        showToast('Failed to load dashboard: ' + err.message, 'error');
    }
}

async function loadPendingLawyers() {
    const container = document.getElementById('pending-list');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    try {
        const lawyers = await apiFetch('/api/admin/pending-lawyers');
        if (!lawyers || lawyers.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><p>No pending verifications</p></div>';
            return;
        }
        renderLawyerList(container, lawyers, true);
    } catch (err) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load: ' + err.message + '</p></div>';
    }
}

async function loadVerifiedLawyers() {
    const container = document.getElementById('verified-list');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    try {
        const lawyers = await apiFetch('/api/admin/verified-lawyers');
        if (!lawyers || lawyers.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><p>No verified lawyers</p></div>';
            return;
        }
        renderLawyerList(container, lawyers, false);
    } catch (err) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load: ' + err.message + '</p></div>';
    }
}

async function loadRejectedLawyers() {
    const container = document.getElementById('rejected-list');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    try {
        const lawyers = await apiFetch('/api/admin/rejected-lawyers');
        if (!lawyers || lawyers.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-times-circle"></i><p>No rejected lawyers</p></div>';
            return;
        }
        renderLawyerList(container, lawyers, false);
    } catch (err) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load: ' + err.message + '</p></div>';
    }
}

function renderLawyerList(container, lawyers, showActions) {
    container.innerHTML = lawyers.map(l => `
        <div class="lawyer-row">
            <div class="lawyer-row-info">
                <h4>${escapeHtml(l.name)}</h4>
                <p><strong>Bar #:</strong> ${escapeHtml(l.barNumber)} &middot; <strong>Specialization:</strong> ${escapeHtml(l.specialization)} &middot; <strong>Experience:</strong> ${l.experience} yrs</p>
                <p><strong>Email:</strong> ${escapeHtml(l.email)} &middot; <strong>Firm:</strong> ${escapeHtml(l.firm || 'N/A')}</p>
                <span class="status-badge status-${l.verificationStatus}">${l.verificationStatus}</span>
            </div>
            ${showActions ? `
            <div class="lawyer-row-actions">
                <button class="btn-approve" onclick="verifyLawyer('${l.id}', 'approve')">
                    <i class="fas fa-check"></i> Verify
                </button>
                <button class="btn-reject" onclick="verifyLawyer('${l.id}', 'reject')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
            ` : ''}
        </div>
    `).join('');
}

async function verifyLawyer(id, action) {
    const label = action === 'approve' ? 'Verify' : 'Reject';
    if (!confirm(`Are you sure you want to ${label.toLowerCase()} this lawyer?`)) return;
    try {
        await apiFetch('/api/admin/verify-lawyer/' + id, {
            method: 'PUT',
            body: JSON.stringify({ action })
        });
        showToast('Lawyer ' + (action === 'approve' ? 'verified' : 'rejected') + ' successfully!', 'success');
        loadDashboard();
        loadPendingLawyers();
    } catch (err) {
        showToast('Failed: ' + err.message, 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
