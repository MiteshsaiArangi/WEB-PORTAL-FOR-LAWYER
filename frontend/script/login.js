document.addEventListener('DOMContentLoaded', function () {
    updateNavAuth();

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
        });
    });

    document.getElementById('userLoginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        if (!email || !password) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        button.textContent = 'Signing In...';
        button.disabled = true;

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            if (data) {
                setToken(data.token);
                setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = data.role === 'LAWYER' ? 'dashboard-lawyer.html' : 'dashboard-client.html';
                }, 500);
            }
        } catch (err) {
            showToast(err.message || 'Login failed', 'error');
            button.textContent = originalText;
            button.disabled = false;
        }
    });

    document.getElementById('lawyerLoginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('lawyerEmail').value;
        const password = document.getElementById('lawyerPassword').value;
        const barNumber = document.getElementById('barNumber').value;
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        if (!email || !password || !barNumber) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        button.textContent = 'Signing In...';
        button.disabled = true;

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, barNumber })
            });
            if (data) {
                setToken(data.token);
                setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = data.role === 'LAWYER' ? 'dashboard-lawyer.html' : 'dashboard-client.html';
                }, 500);
            }
        } catch (err) {
            showToast(err.message || 'Login failed', 'error');
            button.textContent = originalText;
            button.disabled = false;
        }
    });
});
