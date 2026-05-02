const API_URL = 'http://localhost:5000/api/auth';

// Helper to show messages
const showMessage = (msg, type = 'error') => {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = msg;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
};

// Helper to show/hide loader
const setLoader = (btn, isLoading, text) => {
    if (!btn) return;
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `<div class="loader"></div> Processing...`;
    } else {
        btn.disabled = false;
        btn.innerHTML = `<span id="btnText">${text}</span>`;
    }
};

// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = document.getElementById('submitBtn');

        // Validation
        if (password !== confirmPassword) {
            return showMessage('Passwords do not match');
        }

        setLoader(submitBtn, true, 'Sign Up');

        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                return showMessage(errorData.message || 'Signup failed');
            }

            const data = await res.json();
            showMessage('Registration successful! Redirecting...', 'success');
            localStorage.setItem('token', data.token);
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        } catch (err) {
            showMessage('Server error. Please try again.');
        } finally {
            setLoader(submitBtn, false, 'Sign Up');
        }
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('submitBtn');

        setLoader(submitBtn, true, 'Sign In');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                return showMessage(errorData.message || 'Invalid credentials');
            }

            const data = await res.json();
            showMessage('Login successful! Redirecting...', 'success');
            localStorage.setItem('token', data.token);
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (err) {
            showMessage('Server error. Please try again.');
        } finally {
            setLoader(submitBtn, false, 'Sign In');
        }
    });
}

// --- DASHBOARD LOGIC ---
const welcomeTitle = document.getElementById('welcomeTitle');
if (welcomeTitle) {
    const fetchDashboard = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const res = await fetch(`${API_URL}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
                return;
            }

            const data = await res.json();
            document.getElementById('userName').textContent = data.user.name;
            document.getElementById('userEmail').textContent = data.user.email;
            document.getElementById('userId').textContent = data.user._id;
            welcomeTitle.textContent = `Hello, ${data.user.name.split(' ')[0]}!`;
        } catch (err) {
            showMessage('Could not load user data');
        }
    };

    fetchDashboard();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}
