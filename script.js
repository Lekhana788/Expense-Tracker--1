// ==================== CONSTANTS ====================
const STORAGE_KEYS = {
    USERS: 'expenseTracker_users',
    CURRENT_USER: 'expenseTracker_currentUser',
    EXPENSES: 'expenseTracker_expenses'
};

const THEME_KEY = 'expenseTracker_theme';

const CATEGORIES = {
    food: { icon: '🍔', name: 'Food & Dining' },
    transport: { icon: '🚗', name: 'Transport' },
    shopping: { icon: '🛍️', name: 'Shopping' },
    utilities: { icon: '💡', name: 'Utilities' },
    entertainment: { icon: '🎬', name: 'Entertainment' },
    health: { icon: '⚕️', name: 'Health' },
    education: { icon: '📚', name: 'Education' },
    other: { icon: '📌', name: 'Other' }
};

let currentChart = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getSavedTheme());
    checkAuthStatus();
    setupEventListeners();
});

function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
    const body = document.body;
    if (!body) return;

    if (theme === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }

    localStorage.setItem(THEME_KEY, theme);
    updateThemeButton(theme);
}

function toggleTheme() {
    const current = getSavedTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeButton(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    const span = btn.querySelector('.settings-text span');
    if (!span) return;

    span.textContent = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

// ==================== AUTH MANAGEMENT ====
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const splashScreen = document.getElementById('splashScreen');
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');

    // Hide splash screen after 2 seconds
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 2000);
    }

    // Check if user is logged in
    if (currentUser) {
        // User is logged in, redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    } else {
        // User not logged in, show login page
        if (loginPage) {
            loginPage.classList.remove('hidden');
            setTimeout(() => {
                loginPage.style.display = 'flex';
            }, 100);
        }
    }
}

function setupEventListeners() {
    // Auth pages event listeners
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const goToSignup = document.getElementById('goToSignup');
    const goToLogin = document.getElementById('goToLogin');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (goToSignup) {
        goToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('signup');
        });
    }

    if (goToLogin) {
        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('login');
        });
    }

    // Settings button (on home page)
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    // Back buttons
    const backBtns = document.querySelectorAll('#backBtn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            history.back();
        });
    });
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Validation
    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    // Find user
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Invalid email or password', 'error');
        return;
    }

    // Save current user
    setCurrentUser(user);
    showToast('Login successful!', 'success');

    // Redirect to home
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Check if email already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showToast('Account created successfully!', 'success');

    // Auto login
    setTimeout(() => {
        setCurrentUser(newUser);
        window.location.href = 'home.html';
    }, 800);
}

function switchPage(page) {
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');

    if (page === 'signup') {
        if (loginPage) loginPage.classList.add('hidden');
        if (signupPage) signupPage.classList.remove('hidden');
    } else {
        if (loginPage) loginPage.classList.remove('hidden');
        if (signupPage) signupPage.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// ==================== LOCALSTORAGE HELPERS ====================
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function getExpenses() {
    const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
}

function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

// ==================== EXPENSE MANAGEMENT ====================
function addExpense(expense) {
    const expenses = getExpenses();
    const newExpense = {
        id: Date.now(),
        ...expense,
        createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    saveExpenses(expenses);
    return newExpense;
}

function deleteExpense(expenseId) {
    let expenses = getExpenses();
    expenses = expenses.filter(e => e.id !== expenseId);
    saveExpenses(expenses);
}

function getExpensesByCategory() {
    const expenses = getExpenses();
    const byCategory = {};

    expenses.forEach(expense => {
        if (!byCategory[expense.category]) {
            byCategory[expense.category] = {
                total: 0,
                count: 0,
                icon: CATEGORIES[expense.category]?.icon || '📌',
                name: CATEGORIES[expense.category]?.name || 'Other'
            };
        }
        byCategory[expense.category].total += parseFloat(expense.amount);
        byCategory[expense.category].count += 1;
    });

    return byCategory;
}

function getTotalExpenses() {
    const expenses = getExpenses();
    return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
}

function getThisMonthExpenses() {
    const expenses = getExpenses();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
}

function getRecentExpenses(limit = 5) {
    const expenses = getExpenses();
    return expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

// ==================== HOME PAGE ==================== 
function initializeHomePage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    updateGreeting();
    updateDashboard();
    setupNavigation();
}

function updateGreeting() {
    const currentUser = getCurrentUser();
    const nameElement = document.getElementById('greetingName');
    const dateElement = document.getElementById('currentDate');

    if (nameElement) {
        nameElement.textContent = `Welcome, ${currentUser.name}`;
    }

    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

function updateDashboard() {
    const thisMonthExpenses = getThisMonthExpenses();
    const allExpenses = getExpenses();
    const byCategory = getExpensesByCategory();
    const total = thisMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    // Update balance
    const totalElement = document.getElementById('totalExpense');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Update counts
    const totalCountElement = document.getElementById('totalExpenseCount');
    if (totalCountElement) {
        totalCountElement.textContent = allExpenses.length;
    }

    const categoryCountElement = document.getElementById('categoryCount');
    if (categoryCountElement) {
        categoryCountElement.textContent = Object.keys(byCategory).length;
    }

    const monthCountElement = document.getElementById('monthExpenseCount');
    if (monthCountElement) {
        monthCountElement.textContent = thisMonthExpenses.length;
    }

    // Update category summary
    updateCategorySummary(byCategory);

    // Update recent transactions
    updateRecentTransactions();

    // Update chart
    updateExpenseChart(byCategory);

    // Update new features
    updateBudgetStatusPreview();
    setupSearchBar();
}

function updateCategorySummary(byCategory) {
    const container = document.getElementById('categorySummary');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(byCategory).forEach(([category, data]) => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <div class="category-icon">${data.icon}</div>
            <div class="category-name">${data.name}</div>
            <div class="category-amount">₹${data.total.toFixed(2)}</div>
        `;
        container.appendChild(div);
    });

    if (Object.keys(byCategory).length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-tertiary); padding: 20px;">No expenses yet</p>';
    }
}

function updateRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;

    const recentExpenses = getRecentExpenses(5);
    container.innerHTML = '';

    if (recentExpenses.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">No transactions yet</div>';
        return;
    }

    recentExpenses.forEach(expense => {
        const categoryData = CATEGORIES[expense.category];
        const expenseDate = new Date(expense.date);
        const dateString = expenseDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="transaction-left">
                <div class="transaction-icon">${categoryData?.icon || '📌'}</div>
                <div class="transaction-details">
                    <h4>${expense.title}</h4>
                    <p>${dateString} • ${categoryData?.name}</p>
                </div>
            </div>
            <div class="transaction-amount">-₹${parseFloat(expense.amount).toFixed(2)}</div>
        `;
        container.appendChild(div);
    });
}

function updateExpenseChart(byCategory) {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;

    const labels = [];
    const data = [];
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
        '#f97316', '#eab308', '#84cc16', '#22c55e'
    ];

    Object.entries(byCategory).forEach(([category, categoryData], index) => {
        labels.push(categoryData.name);
        data.push(categoryData.total);
    });

    if (labels.length === 0) {
        canvas.style.display = 'none';
        return;
    }

    canvas.style.display = 'block';

    if (currentChart) {
        currentChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: 'var(--dark-bg)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'var(--text-primary)',
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                }
            }
        }
    });
}

// ==================== ADD EXPENSE PAGE ==================== 
function initializeAddExpensePage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    setupAddExpenseForm();
    setDefaultDate();
}

function setDefaultDate() {
    const dateInput = document.getElementById('expenseDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
}

function setupAddExpenseForm() {
    const form = document.getElementById('addExpenseForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (form) {
        form.addEventListener('submit', handleAddExpense);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

function handleAddExpense(e) {
    e.preventDefault();

    const amount = document.getElementById('expenseAmount').value.trim();
    const title = document.getElementById('expenseTitle').value.trim();
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value.trim();

    // Validation
    if (!amount || !title || !category || !date) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    if (parseFloat(amount) <= 0) {
        showToast('Amount must be greater than 0', 'error');
        return;
    }

    // Add expense
    addExpense({
        amount: parseFloat(amount),
        title,
        category,
        date,
        description
    });

    showToast('Expense added successfully!', 'success');

    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}

// ==================== REPORT PAGE ==================== 
function initializeReportPage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    updateReportPage();
    setupReportFilters();
}

function updateReportPage() {
    const expenses = getExpenses();
    const thisMonthExpenses = getThisMonthExpenses();
    const total = thisMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    // Update summary
    const totalElement = document.getElementById('reportTotalExpense');
    if (totalElement) {
        totalElement.textContent = `₹ ${total.toFixed(2)}`;
    }

    const countElement = document.getElementById('reportTotalCount');
    if (countElement) {
        countElement.textContent = thisMonthExpenses.length;
    }

    displayExpenses(thisMonthExpenses);
}

function displayExpenses(expenses) {
    const container = document.getElementById('expensesList');
    const countBadge = document.getElementById('expenseCount');

    if (!container) return;

    if (countBadge) {
        countBadge.textContent = expenses.length;
    }

    container.innerHTML = '';

    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No expenses found</p>
            </div>
        `;
        return;
    }

    expenses.forEach(expense => {
        const categoryData = CATEGORIES[expense.category];
        const expenseDate = new Date(expense.date);
        const dateString = expenseDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <div class="expense-left">
                <div class="expense-icon">${categoryData?.icon || '📌'}</div>
                <div class="expense-info">
                    <h4>${expense.title}</h4>
                    <p>${dateString} • ${categoryData?.name}</p>
                    ${expense.description ? `<p style="color: var(--text-tertiary); margin-top: 2px;">${expense.description}</p>` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--danger-color);">-₹${parseFloat(expense.amount).toFixed(2)}</div>
                </div>
                <button class="expense-delete" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const deleteBtn = div.querySelector('.expense-delete');
        deleteBtn.addEventListener('click', () => {
            confirmDelete(expense.id, expense.title);
        });

        container.appendChild(div);
    });
}

function setupReportFilters() {
    const categoryFilter = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (sortBy) {
        sortBy.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    let expenses = getExpenses();
    const categoryFilter = document.getElementById('filterCategory').value;
    const sortValue = document.getElementById('sortBy').value;

    // Filter by category
    if (categoryFilter) {
        expenses = expenses.filter(exp => exp.category === categoryFilter);
    }

    // Sort
    switch (sortValue) {
        case 'recent':
            expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            expenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
            break;
        case 'lowest':
            expenses.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
            break;
    }

    displayExpenses(expenses);
}

function confirmDelete(expenseId, title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        deleteExpense(expenseId);
        showToast('Expense deleted successfully', 'success');
        updateReportPage();
    }
}

// ==================== PROFILE PAGE ==================== 
function initializeProfilePage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    updateProfilePage();
    setupProfileEventListeners();
}

function updateProfilePage() {
    const currentUser = getCurrentUser();
    const expenses = getExpenses();

    // Update profile info
    const nameElement = document.getElementById('profileName');
    if (nameElement) {
        nameElement.textContent = currentUser.name;
    }

    const emailElement = document.getElementById('profileEmail');
    if (emailElement) {
        emailElement.textContent = currentUser.email;
    }

    const joinDate = document.getElementById('profileJoinDate');
    if (joinDate) {
        const createdDate = new Date(currentUser.createdAt);
        const year = createdDate.getFullYear();
        const month = createdDate.toLocaleDateString('en-US', { month: 'long' });
        joinDate.textContent = `Joined in ${month} ${year}`;
    }

    // Update statistics
    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const monthlyAvg = expenses.length > 0 ? (totalAmount / Math.ceil(expenses.length / 30) || totalAmount).toFixed(2) : 0;

    document.getElementById('statTotalEntries').textContent = expenses.length;
    document.getElementById('statTotalSpent').textContent = `₹ ${totalAmount.toFixed(2)}`;
    document.getElementById('statMonthlyAvg').textContent = `₹ ${monthlyAvg}`;

    const byCategory = getExpensesByCategory();
    document.getElementById('statCategories').textContent = Object.keys(byCategory).length;
}

function setupProfileEventListeners() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openChangePasswordModal);
    }

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', openClearDataModal);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', openLogoutModal);
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }

    const restoreDataBtn = document.getElementById('restoreDataBtn');
    const restoreDataInput = document.getElementById('restoreDataInput');
    if (restoreDataBtn && restoreDataInput) {
        restoreDataBtn.addEventListener('click', () => restoreDataInput.click());
        restoreDataInput.addEventListener('change', handleRestoreFile);
    }

    // Change password modal
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    const closePasswordModal = document.getElementById('closePasswordModal');
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', closeModal);
    }

    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', closeModal);
    }

    // Confirm modal
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', closeModal);
    }

    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', closeModal);
    }

    const confirmActionBtn = document.getElementById('confirmActionBtn');
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', handleConfirmAction);
    }
}

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function openClearDataModal() {
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');

    if (modal) {
        title.textContent = 'Clear All Data';
        message.textContent = 'Are you sure you want to delete all expenses? This action cannot be undone.';
        modal.dataset.action = 'clearData';
        modal.classList.remove('hidden');
    }
}

function openLogoutModal() {
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');

    if (modal) {
        title.textContent = 'Logout';
        message.textContent = 'Are you sure you want to logout from your account?';
        modal.dataset.action = 'logout';
        modal.classList.remove('hidden');
    }
}

function closeModal(e) {
    if (e) e.preventDefault();
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.classList.add('hidden'));
}

function handleChangePassword(e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill all fields', 'error');
        return;
    }

    if (currentPassword !== currentUser.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Update password
    currentUser.password = newPassword;
    setCurrentUser(currentUser);

    // Update in users list
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        saveUsers(users);
    }

    showToast('Password changed successfully', 'success');
    closeModal();

    // Reset form
    document.getElementById('changePasswordForm').reset();
}

function handleConfirmAction() {
    const modal = document.getElementById('confirmModal');
    const action = modal.dataset.action;

    if (action === 'clearData') {
        saveExpenses([]);
        showToast('All data cleared successfully', 'success');
        closeModal();
        setTimeout(() => {
            window.location.reload();
        }, 800);
    } else if (action === 'logout') {
        logout();
    }
}

function exportData() {
    const currentUser = getCurrentUser();
    const expenses = getExpenses();

    if (expenses.length === 0) {
        showToast('No expenses to export', 'warning');
        return;
    }

    // Create CSV
    let csv = 'Title,Amount,Category,Date,Description\n';
    expenses.forEach(exp => {
        const description = exp.description ? exp.description.replace(/,/g, ';') : '';
        csv += `"${exp.title}",${exp.amount},"${exp.category}","${exp.date}","${description}"\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showToast('Data exported successfully', 'success');
}

function backupData() {
    const backup = {
        users: getUsers(),
        currentUser: getCurrentUser(),
        expenses: getExpenses(),
        budgets: getBudgets(),
        recurring: getRecurringExpenses(),
        createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showToast('Backup created successfully', 'success');
}

function handleRestoreFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        try {
            const data = JSON.parse(reader.result);
            if (!data || !data.users || !data.expenses) {
                showToast('Invalid backup file', 'error');
                return;
            }
            restoreData(data);
        } catch (error) {
            showToast('Failed to restore backup', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // reset input
}

function restoreData(data) {
    if (!confirm('Restore this backup? Existing data will be overwritten.')) {
        return;
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users || []));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses || []));
    localStorage.setItem(STORAGE_KEYS_ADVANCED.BUDGETS, JSON.stringify(data.budgets || {}));
    localStorage.setItem(STORAGE_KEYS_ADVANCED.RECURRING, JSON.stringify(data.recurring || []));

    if (data.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.currentUser));
    }

    showToast('Backup restored successfully', 'success');
    setTimeout(() => window.location.reload(), 800);
}

// ==================== NAVIGATION ==================== 
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
            // Let default navigation happen
        });
    });
}

// ==================== TOAST NOTIFICATIONS ==================== 
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== UTILITY FUNCTIONS ==================== 
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// ==================== STORAGE KEYS ==================== 
const STORAGE_KEYS_ADVANCED = {
    BUDGETS: 'expenseTracker_budgets',
    RECURRING: 'expenseTracker_recurring'
};

// ==================== BUDGET MANAGEMENT ==================== 
function getBudgets() {
    const budgets = localStorage.getItem(STORAGE_KEYS_ADVANCED.BUDGETS);
    return budgets ? JSON.parse(budgets) : {};
}

function saveBudgets(budgets) {
    localStorage.setItem(STORAGE_KEYS_ADVANCED.BUDGETS, JSON.stringify(budgets));
}

function setBudget(category, amount, frequency = 'monthly', alertThreshold = 80) {
    const budgets = getBudgets();
    budgets[category] = {
        amount: parseFloat(amount),
        frequency,
        alertThreshold: parseFloat(alertThreshold),
        createdAt: new Date().toISOString()
    };
    saveBudgets(budgets);
    return budgets[category];
}

function deleteBudget(category) {
    const budgets = getBudgets();
    delete budgets[category];
    saveBudgets(budgets);
}

function getBudgetStatus(category) {
    const budgets = getBudgets();
    if (!budgets[category]) return null;

    const budgetData = budgets[category];
    const categoryExpenses = getThisMonthExpenses().filter(e => e.category === category);
    const spent = categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const monthlyBudget = budgetData.frequency === 'yearly'
        ? budgetData.amount / 12
        : budgetData.amount;
    const yearlyBudget = budgetData.frequency === 'yearly'
        ? budgetData.amount
        : budgetData.amount * 12;
    const remaining = monthlyBudget - spent;
    const percentage = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0;
    const isAlert = percentage >= budgetData.alertThreshold;

    return {
        category,
        frequency: budgetData.frequency,
        monthlyBudget,
        yearlyBudget,
        spent,
        remaining,
        percentage,
        isAlert
    };
}

function initializeBudgetPage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    updateBudgetPage();
    setupBudgetEventListeners();
}

function updateBudgetPage() {
    const budgets = getBudgets();
    let totalMonthlyBudget = 0;
    let totalYearlyBudget = 0;
    let totalSpent = 0;

    Object.keys(budgets).forEach(category => {
        const status = getBudgetStatus(category);
        if (status) {
            totalMonthlyBudget += status.monthlyBudget;
            totalYearlyBudget += status.yearlyBudget;
            totalSpent += status.spent;
        }
    });

    document.getElementById('totalBudgetMonthly').textContent = totalMonthlyBudget.toFixed(2);
    document.getElementById('totalBudgetYearly').textContent = totalYearlyBudget.toFixed(2);
    document.getElementById('totalBudgetSpent').textContent = totalSpent.toFixed(2);
    document.getElementById('totalBudgetRemaining').textContent = (totalMonthlyBudget - totalSpent).toFixed(2);
    document.getElementById('combinedBudgetText').textContent = `₹ ${totalMonthlyBudget.toFixed(2)} monthly / ₹ ${totalYearlyBudget.toFixed(2)} yearly`;

    displayBudgets();
}

function displayBudgets() {
    const container = document.getElementById('budgetsList');
    const budgets = getBudgets();

    if (!container) return;
    container.innerHTML = '';

    if (Object.keys(budgets).length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">No budgets set yet</div>';
        return;
    }

    Object.keys(budgets).forEach(category => {
        const status = getBudgetStatus(category);
        if (!status) return;

        const categoryData = CATEGORIES[category];
        const div = document.createElement('div');
        div.className = 'budget-card';
        div.innerHTML = `
            <div class="budget-card-header">
                <div class="budget-card-title">
                    <span>${categoryData?.icon} ${categoryData?.name}</span>
                    <small>${status.frequency === 'yearly' ? 'Yearly budget' : 'Monthly budget'}</small>
                </div>
                <div class="budget-card-actions">
                    <button class="budget-card-action-btn edit" data-category="${category}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="budget-card-action-btn delete" data-category="${category}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="budget-progress-section">
                <div class="budget-progress-label">
                    <span>Spent: ₹${status.spent.toFixed(2)} / ₹${status.monthlyBudget.toFixed(2)} (monthly)</span>
                    <span>${status.percentage.toFixed(0)}%</span>
                </div>
                <div class="budget-progress-bar">
                    <div class="budget-progress-bar-fill ${status.isAlert ? 'alert' : ''}" style="width: ${Math.min(status.percentage, 100)}%"></div>
                </div>
            </div>
            <div class="budget-stats-mini">
                <span>Monthly: ₹${status.monthlyBudget.toFixed(2)}</span>
                <span>Yearly: ₹${status.yearlyBudget.toFixed(2)}</span>
            </div>
            <div class="budget-stats-mini">
                <span>Remaining: ₹${status.remaining.toFixed(2)}</span>
                ${status.isAlert ? '<span style="color: var(--warning-color);">⚠️ Alert!</span>' : '<span style="color: var(--success-color);">✓ On track</span>'}
            </div>
        `;

        const deleteBtn = div.querySelector('.budget-card-action-btn.delete');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this budget?')) {
                deleteBudget(category);
                showToast('Budget deleted', 'success');
                updateBudgetPage();
            }
        });

        container.appendChild(div);
    });
}

function setupBudgetEventListeners() {
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const closeBudgetModal = document.getElementById('closeBudgetModal');
    const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
    const addBudgetForm = document.getElementById('addBudgetForm');

    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', () => {
            document.getElementById('addBudgetModal').classList.remove('hidden');
        });
    }

    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', closeModal);
    }

    if (cancelBudgetBtn) {
        cancelBudgetBtn.addEventListener('click', closeModal);
    }

    if (addBudgetForm) {
        addBudgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('budgetCategory').value;
            const amount = document.getElementById('budgetAmount').value;
            const alertThreshold = document.getElementById('budgetAlert').value;

            if (!category || !amount) {
                showToast('Please fill all fields', 'error');
                return;
            }

            const frequency = document.getElementById('budgetFrequency').value || 'monthly';
            setBudget(category, amount, frequency, alertThreshold);
            showToast('Budget set successfully!', 'success');
            closeModal();
            addBudgetForm.reset();
            updateBudgetPage();
        });
    }
}

// ==================== RECURRING EXPENSES ==================== 
function getRecurringExpenses() {
    const recurring = localStorage.getItem(STORAGE_KEYS_ADVANCED.RECURRING);
    return recurring ? JSON.parse(recurring) : [];
}

function saveRecurringExpenses(recurring) {
    localStorage.setItem(STORAGE_KEYS_ADVANCED.RECURRING, JSON.stringify(recurring));
}

function addRecurringExpense(expense) {
    const recurring = getRecurringExpenses();
    const newRecurring = {
        id: Date.now(),
        ...expense,
        createdAt: new Date().toISOString()
    };
    recurring.push(newRecurring);
    saveRecurringExpenses(recurring);
    return newRecurring;
}

function deleteRecurringExpense(id) {
    let recurring = getRecurringExpenses();
    recurring = recurring.filter(r => r.id !== id);
    saveRecurringExpenses(recurring);
}

function getTotalMonthlyRecurring() {
    const recurring = getRecurringExpenses();
    return recurring.reduce((sum, r) => {
        if (r.frequency === 'monthly' || r.frequency === 'weekly') {
            return sum + parseFloat(r.amount);
        } else if (r.frequency === 'quarterly') {
            return sum + (parseFloat(r.amount) / 3);
        } else if (r.frequency === 'yearly') {
            return sum + (parseFloat(r.amount) / 12);
        }
        return sum;
    }, 0);
}

function initializeRecurringPage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    updateRecurringPage();
    setupRecurringEventListeners();
}

function updateRecurringPage() {
    const recurring = getRecurringExpenses();
    const monthlyTotal = getTotalMonthlyRecurring();

    document.getElementById('monthlyRecurring').textContent = monthlyTotal.toFixed(2);
    document.getElementById('activeSubscriptions').textContent = recurring.length;
    document.getElementById('yearlyImpact').textContent = (monthlyTotal * 12).toFixed(2);

    displayRecurringExpenses();
}

function displayRecurringExpenses() {
    const container = document.getElementById('recurringList');
    const recurring = getRecurringExpenses();

    if (!container) return;
    container.innerHTML = '';

    if (recurring.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">No recurring expenses yet</div>';
        return;
    }

    recurring.forEach(item => {
        const categoryData = CATEGORIES[item.category];
        const div = document.createElement('div');
        div.className = 'recurring-item';

        let frequencyLabel = item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1);
        if (item.endDate) {
            const endDate = new Date(item.endDate);
            frequencyLabel += ` until ${endDate.toLocaleDateString('en-IN')}`;
        }

        div.innerHTML = `
            <div class="recurring-left">
                <div class="recurring-icon">${categoryData?.icon}</div>
                <div class="recurring-info">
                    <h4>${item.title}</h4>
                    <p>${frequencyLabel}</p>
                </div>
            </div>
            <div class="recurring-amount">
                <h4>₹${parseFloat(item.amount).toFixed(2)}</h4>
                <p>per ${item.frequency}</p>
                <button class="recurring-delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const deleteBtn = div.querySelector('.recurring-delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this subscription?')) {
                deleteRecurringExpense(item.id);
                showToast('Subscription deleted', 'success');
                updateRecurringPage();
            }
        });

        container.appendChild(div);
    });
}

function setupRecurringEventListeners() {
    const addRecurringBtn = document.getElementById('addRecurringBtn');
    const closeRecurringModal = document.getElementById('closeRecurringModal');
    const cancelRecurringBtn = document.getElementById('cancelRecurringBtn');
    const addRecurringForm = document.getElementById('addRecurringForm');

    if (addRecurringBtn) {
        addRecurringBtn.addEventListener('click', () => {
            const startDateInput = document.getElementById('recurringStartDate');
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            startDateInput.value = `${year}-${month}-${day}`;
            document.getElementById('addRecurringModal').classList.remove('hidden');
        });
    }

    if (closeRecurringModal) {
        closeRecurringModal.addEventListener('click', closeModal);
    }

    if (cancelRecurringBtn) {
        cancelRecurringBtn.addEventListener('click', closeModal);
    }

    if (addRecurringForm) {
        addRecurringForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('recurringTitle').value;
            const amount = document.getElementById('recurringAmount').value;
            const category = document.getElementById('recurringCategory').value;
            const frequency = document.getElementById('recurringFrequency').value;
            const startDate = document.getElementById('recurringStartDate').value;
            const endDate = document.getElementById('recurringEndDate').value;

            if (!title || !amount || !category || !frequency || !startDate) {
                showToast('Please fill all required fields', 'error');
                return;
            }

            addRecurringExpense({ title, amount, category, frequency, startDate, endDate });
            showToast('Subscription added successfully!', 'success');
            closeModal();
            addRecurringForm.reset();
            updateRecurringPage();
        });
    }
}

// ==================== ANALYTICS PAGE ==================== 
function initializeAnalyticsPage() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    setupNavigation();
    updateAnalyticsDashboard();
    setupAnalyticsEventListeners();
}

function updateAnalyticsDashboard() {
    const analyticsMonth = document.getElementById('analyticsMonth')?.value || 'current';
    const expenses = getExpensesForAnalytics(analyticsMonth);

    updateAnalyticsInsights(expenses);
    updateAnalyticsCharts(expenses);
    updateMonthComparison();
    updateRecommendations(expenses);
}

function getExpensesForAnalytics(period) {
    const allExpenses = getExpenses();
    const now = new Date();

    if (period === 'current') {
        return getThisMonthExpenses();
    } else if (period === 'last3') {
        return allExpenses.filter(e => {
            const expDate = new Date(e.date);
            const monthsDiff = (now.getFullYear() - expDate.getFullYear()) * 12 + (now.getMonth() - expDate.getMonth());
            return monthsDiff <= 3;
        });
    } else if (period === 'last6') {
        return allExpenses.filter(e => {
            const expDate = new Date(e.date);
            const monthsDiff = (now.getFullYear() - expDate.getFullYear()) * 12 + (now.getMonth() - expDate.getMonth());
            return monthsDiff <= 6;
        });
    } else if (period === 'last12') {
        return allExpenses.filter(e => {
            const expDate = new Date(e.date);
            const yearsDiff = now.getFullYear() - expDate.getFullYear();
            const monthsDiff = (now.getFullYear() - expDate.getFullYear()) * 12 + (now.getMonth() - expDate.getMonth());
            return monthsDiff <= 12;
        });
    }
    return allExpenses;
}

function updateAnalyticsInsights(expenses) {
    if (expenses.length === 0) {
        document.getElementById('highestExpense').textContent = '₹ 0';
        document.getElementById('averagePerDay').textContent = '₹ 0';
        return;
    }

    const sorted = [...expenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    const highest = sorted[0];

    const byCategory = {};
    expenses.forEach(exp => {
        if (!byCategory[exp.category]) byCategory[exp.category] = 0;
        byCategory[exp.category] += parseFloat(exp.amount);
    });

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const categoryData = CATEGORIES[topCategory[0]];

    const uniqueDates = new Set(expenses.map(e => e.date));
    const avgPerDay = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0) / uniqueDates.size;

    document.getElementById('highestExpense').textContent = `₹ ${parseFloat(highest.amount).toFixed(2)}`;
    document.getElementById('highestExpenseInfo').textContent = highest.title;
    document.getElementById('averagePerDay').textContent = `₹ ${avgPerDay.toFixed(2)}`;
    document.getElementById('topCategory').textContent = `${categoryData?.icon} ${categoryData?.name}`;
    document.getElementById('topCategoryAmount').textContent = `₹ ${topCategory[1].toFixed(2)}`;

    // Calculate trend
    const firstHalf = expenses.filter(e => {
        const expDate = new Date(e.date);
        const dayOfMonth = expDate.getDate();
        return dayOfMonth <= 15;
    }).reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const secondHalf = expenses.filter(e => {
        const expDate = new Date(e.date);
        const dayOfMonth = expDate.getDate();
        return dayOfMonth > 15;
    }).reduce((sum, e) => sum + parseFloat(e.amount), 0);

    let trend = '→ Stable';
    let trendInfo = 'Spending is stable';
    if (secondHalf > firstHalf) {
        const increase = ((secondHalf - firstHalf) / firstHalf * 100).toFixed(0);
        trend = `↑ ${increase}%`;
        trendInfo = 'Spending increased';
    } else if (secondHalf < firstHalf) {
        const decrease = ((firstHalf - secondHalf) / firstHalf * 100).toFixed(0);
        trend = `↓ ${decrease}%`;
        trendInfo = 'Spending decreased';
    }

    document.getElementById('spendingTrend').textContent = trend;
    document.getElementById('trendInfo').textContent = trendInfo;

    document.getElementById('homeTrend').textContent = trend;
    document.getElementById('homeHighestExpense').textContent = `₹ ${parseFloat(highest.amount).toFixed(2)}`;
    document.getElementById('homeTopCategory').textContent = categoryData?.name || 'Other';
}

function updateAnalyticsCharts(expenses) {
    updateTrendChart(expenses);
    updateCategoryChart(expenses);
}

function updateTrendChart(expenses) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;

    const monthData = {};
    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthData[key]) monthData[key] = 0;
        monthData[key] += parseFloat(exp.amount);
    });

    const labels = Object.keys(monthData).sort();
    const data = labels.map(label => monthData[label]);

    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    window.trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Spending',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: 'var(--text-primary)' }
                }
            },
            scales: {
                y: {
                    ticks: { color: 'var(--text-secondary)' },
                    grid: { color: 'var(--border-color)' }
                },
                x: {
                    ticks: { color: 'var(--text-secondary)' },
                    grid: { color: 'var(--border-color)' }
                }
            }
        }
    });
}

function updateCategoryChart(expenses) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    const byCategory = {};
    expenses.forEach(exp => {
        if (!byCategory[exp.category]) byCategory[exp.category] = 0;
        byCategory[exp.category] += parseFloat(exp.amount);
    });

    const labels = Object.entries(byCategory).map(([cat, total]) => {
        const categoryData = CATEGORIES[cat];
        return `${categoryData?.icon} ${categoryData?.name}`;
    });

    const data = Object.values(byCategory);
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e'];

    if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    window.categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: 'var(--dark-bg)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'var(--text-primary)',
                        padding: 20
                    }
                }
            }
        }
    });
}

function updateMonthComparison() {
    const now = new Date();
    const currentMonthExpenses = getThisMonthExpenses();
    const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const allExpenses = getExpenses();
    const prevMonthExpenses = allExpenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate >= prevMonth && expDate <= prevMonthEnd;
    });
    const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    document.getElementById('currentMonthTotal').textContent = `₹ ${currentTotal.toFixed(2)}`;
    document.getElementById('previousMonthTotal').textContent = `₹ ${prevTotal.toFixed(2)}`;

    const diff = currentTotal - prevTotal;
    const diffPercent = prevTotal > 0 ? (diff / prevTotal * 100).toFixed(0) : 0;

    let result = '';
    if (diff > 0) {
        result = `<span style="color: var(--danger-color);">📈 ${diffPercent}% higher than last month</span>`;
    } else if (diff < 0) {
        result = `<span style="color: var(--success-color);">📉 ${Math.abs(diffPercent)}% lower than last month</span>`;
    } else {
        result = '<span>Same as last month</span>';
    }

    document.getElementById('comparisonResult').innerHTML = result;
}

function updateRecommendations(expenses) {
    const container = document.getElementById('recommendationsList');
    if (!container) return;

    const recommendations = generateRecommendations(expenses);
    container.innerHTML = '';

    recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-item';
        div.innerHTML = `<h4>${rec.title}</h4><p>${rec.description}</p>`;
        container.appendChild(div);
    });
}

function generateRecommendations(expenses) {
    const recs = [];
    if (expenses.length === 0) return recs;

    const byCategory = {};
    expenses.forEach(exp => {
        if (!byCategory[exp.category]) byCategory[exp.category] = 0;
        byCategory[exp.category] += parseFloat(exp.amount);
    });

    const total = Object.values(byCategory).reduce((a, b) => a + b, 0);
    const avgPerExp = total / expenses.length;

    Object.entries(byCategory).forEach(([cat, amount]) => {
        const percent = (amount / total * 100).toFixed(0);
        if (percent > 40) {
            recs.push({
                title: `High spending on ${CATEGORIES[cat]?.name}`,
                description: `${percent}% of your budget goes to this category. Consider optimizing.`
            });
        }
    });

    const highExpenses = expenses.filter(e => parseFloat(e.amount) > avgPerExp * 2);
    if (highExpenses.length > 0) {
        recs.push({
            title: 'Large transactions detected',
            description: `You have ${highExpenses.length} expense(s) significantly higher than your average.`
        });
    }

    if (recs.length === 0) {
        recs.push({
            title: '✓ Good spending habits',
            description: 'Your spending is well-distributed across categories.'
        });
    }

    return recs;
}

function setupAnalyticsEventListeners() {
    const analyticsMonth = document.getElementById('analyticsMonth');
    if (analyticsMonth) {
        analyticsMonth.addEventListener('change', updateAnalyticsDashboard);
    }

    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportReportPdf);
    }

    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', () => window.print());
    }
}

function exportReportPdf() {
    const element = document.querySelector('.app-main');
    const opt = {
        margin: 10,
        filename: `expense_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
    showToast('Report exported as PDF', 'success');
}

// ==================== BUDGET STATUS PREVIEW (HOME PAGE) ====================
function updateBudgetStatusPreview() {
    const container = document.getElementById('budgetStatus');
    if (!container) return;

    const budgets = getBudgets();
    container.innerHTML = '';

    if (Object.keys(budgets).length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary);">No budgets set</div>';
        return;
    }

    let count = 0;
    Object.keys(budgets).forEach(category => {
        if (count >= 2) return; // Show only top 2
        const status = getBudgetStatus(category);
        if (!status) return;

        const categoryData = CATEGORIES[category];
        const div = document.createElement('div');
        div.className = 'budget-status-item';
        div.innerHTML = `
            <div class="budget-status-header">
                <h4>${categoryData?.icon} ${categoryData?.name}</h4>
                <span>${status.percentage.toFixed(0)}%</span>
            </div>
            <div class="budget-progress">
                <div class="budget-progress-fill ${status.isAlert ? 'warning' : ''}" style="width: ${Math.min(status.percentage, 100)}%"></div>
            </div>
            <div class="budget-stats-mini">
                <span>₹${status.spent.toFixed(2)} / ₹${status.budget.toFixed(2)}</span>
                <span>Remaining: ₹${status.remaining.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(div);
        count++;
    });
}

// ==================== SEARCH FUNCTIONALITY ==================== 
function setupSearchBar() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function (e) {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            updateDashboard();
            return;
        }

        const expenses = getExpenses();
        const filtered = expenses.filter(exp => {
            return exp.title.toLowerCase().includes(query) ||
                exp.description?.toLowerCase().includes(query) ||
                exp.category.toLowerCase().includes(query) ||
                exp.date.includes(query);
        });

        const container = document.getElementById('recentTransactions');
        if (container) {
            if (filtered.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">No results found</div>';
            } else {
                container.innerHTML = '';
                filtered.slice(0, 5).forEach(expense => {
                    const categoryData = CATEGORIES[expense.category];
                    const expenseDate = new Date(expense.date);
                    const dateString = expenseDate.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    const div = document.createElement('div');
                    div.className = 'transaction-item';
                    div.innerHTML = `
                        <div class="transaction-left">
                            <div class="transaction-icon">${categoryData?.icon || '📌'}</div>
                            <div class="transaction-details">
                                <h4>${expense.title}</h4>
                                <p>${dateString} • ${categoryData?.name}</p>
                            </div>
                        </div>
                        <div class="transaction-amount">-₹${parseFloat(expense.amount).toFixed(2)}</div>
                    `;
                    container.appendChild(div);
                });
            }
        }
    }, 300));
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Export to window for accessibility
window.logout = logout;
window.handleConfirmAction = handleConfirmAction;
window.closeModal = closeModal;
window.updateAnalyticsDashboard = updateAnalyticsDashboard;
