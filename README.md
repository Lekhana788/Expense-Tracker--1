# Expense Tracker App 💰

A modern, responsive, mobile-first expense tracking application with a beautiful dark theme UI. Perfect for managing your finances on the go!

## Features ✨

### 1. **Authentication**
- User Signup & Login
- Password-protected accounts
- Account creation validation
- Session management using localStorage

### 2. **Dashboard (Home)**
- Total expenses summary for the month
- Category-wise breakdown
- Recent transactions
- Interactive pie chart showing expense distribution
- Quick statistics (total entries, categories, monthly expenses)

### 3. **Add Expense**
- Easy-to-use form to add expenses
- Fields: Amount, Title, Category, Date, Description
- 8 pre-defined categories (Food, Transport, Shopping, Utilities, Entertainment, Health, Education, Other)
- Date picker for easy date selection
- Form validation

### 4. **Reports**
- View all expenses with detailed information
- Filter expenses by category
- Sort by: Most Recent, Oldest First, Highest Amount, Lowest Amount
- Delete expenses
- Monthly expense summary

### 5. **Profile & Settings**
- User profile information
- Statistics dashboard (total entries, total spent, monthly average, categories)
- Change password
- Export data as CSV
- Clear all expenses
- Logout

### 6. **UI/UX Features**
- ✅ Mobile-first responsive design
- ✅ Dark modern theme with gradient accents
- ✅ Smooth animations and transitions
- ✅ Bottom navigation bar (always accessible)
- ✅ Toast notifications (success, error, warning)
- ✅ Loading animations
- ✅ Splash screen with logo
- ✅ Interactive charts (Chart.js)
- ✅ Smooth button interactions

## File Structure 📁

```
E_T/
├── index.html          # Login, Signup & Splash Screen
├── home.html           # Dashboard with summary
├── add.html            # Add expense form
├── report.html         # View and manage expenses
├── profile.html        # User profile & settings
├── style.css           # All styling (dark theme)
├── script.js           # Complete functionality
└── README.md           # This file
```

## How to Use 🚀

### 1. **First Run**
- Open `index.html` in your browser
- Wait for the splash screen to load (2 seconds)
- You'll see the login page

### 2. **Create Account**
- Click "Sign Up" link
- Fill in: Name, Email, Password
- Confirm password and submit
- You'll be logged in automatically

### 3. **Test Login Credentials**
- Use any email and password (6+ characters)
- All data is stored in browser's localStorage

### 4. **Add Expenses**
- Click the "+" button in bottom navigation
- Fill in the expense details
- Click "Add Expense"
- Return to dashboard to see it added

### 5. **View Reports**
- Click "Reports" in bottom navigation
- See all your expenses
- Filter by category or sort by amount/date
- Delete expenses if needed

### 6. **Check Profile**
- Click profile icon in bottom navigation
- View your statistics
- Change password, export data, or logout

## Technical Details 🛠️

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: CSS Grid, Flexbox, Gradients, Animations
- **Data Storage**: Browser localStorage
- **Charts**: Chart.js library
- **Icons**: Font Awesome 6.4.0

### Browser Compatibility
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Key JavaScript Functions
- `handleLogin()` - Login authentication
- `handleSignup()` - User registration
- `handleAddExpense()` - Add new expense
- `updateDashboard()` - Refresh dashboard data
- `updateExpenseChart()` - Generate pie chart
- `exportData()` - Export expenses as CSV
- `logout()` - Sign out user

### LocalStorage Keys
- `expenseTracker_users` - All registered users
- `expenseTracker_currentUser` - Currently logged-in user
- `expenseTracker_expenses` - All expenses

## Features Breakdown 📋

### Dashboard
- Shows total expenses for current month
- Category summary with icons
- Recent 5 transactions
- Pie chart of expense distribution
- Quick stats (total entries, categories count)

### Add Expense Page
- Amount input with currency symbol
- Title input (required)
- Category dropdown (8 options)
- Date picker (defaults to today)
- Optional description field
- Form validation for all fields

### Reports Page
- Displays all expenses in a list
- Filter by category
- Sort by: Recent, Oldest, Highest, Lowest
- Delete individual expenses
- Summary cards showing total & count
- Empty state if no expenses

### Profile Page
- User information display
- Statistics cards (4 metrics)
- Settings menu with options:
  - Change password
  - Export as CSV
  - Clear all data
  - Logout

## Security Notes 🔒

⚠️ **Important**: This is a client-side only application using localStorage. For production:
- Use a backend server with proper authentication
- Implement secure password hashing
- Use secure session management
- Add HTTPS encryption
- Implement proper authorization checks

## Customization 🎨

### Change Theme Colors
Edit `:root` variables in `style.css`:
```css
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
--danger-color: #ef4444;
```

### Add More Categories
Edit `CATEGORIES` object in `script.js` and add to the select dropdown in `add.html`

### Modify Responsive Breakpoints
Look for `@media` queries in `style.css`

## Troubleshooting 🔧

### Data not showing?
- Clear browser cache and localStorage
- Open Developer Console (F12) and check for errors

### Chart not displaying?
- Make sure Chart.js CDN is loaded
- Check browser console for library loading errors

### Forms not submitting?
- Verify all required fields are filled
- Check that amounts are positive numbers
- Ensure date is in valid format

## Future Enhancements 🚀

- Backend API integration
- Cloud data synchronization
- Recurring expenses
- Budget limits & alerts
- Multi-currency support
- Analytics & insights
- Dark/Light mode toggle
- Multiple users on one device
- Expense sharing/splitting
- Push notifications

## License 📄

Free to use and modify for personal or commercial projects.

---

**Created with ❤️ - Expense Tracker App v1.0.0**

For issues or feature requests, please check your browser console for error messages.
