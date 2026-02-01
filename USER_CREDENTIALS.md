# User Login Credentials

## Demo User Accounts

The following demo user accounts have been created for testing:

### Paid Users (Already paid ₹2,000)
1. **Rajesh Patel**
   - Email: `rajesh.patel@example.com`
   - Password: `password123`
   - Status: ✅ Paid (₹2,000)
   - Payment Date: January 15, 2024

2. **Amit Desai**
   - Email: `amit.desai@example.com`
   - Password: `password123`
   - Status: ✅ Paid (₹2,000)
   - Payment Date: February 10, 2024

3. **Kiran Modi**
   - Email: `kiran.modi@example.com`
   - Password: `password123`
   - Status: ✅ Paid (₹2,000)
   - Payment Date: March 5, 2024

### Unpaid Users (Need to pay ₹2,000)
1. **Priya Shah**
   - Email: `priya.shah@example.com`
   - Password: `password123`
   - Status: ❌ Not Paid

2. **Neha Joshi**
   - Email: `neha.joshi@example.com`
   - Password: `password123`
   - Status: ❌ Not Paid

## How to Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter any of the email addresses above
3. Enter password: `password123`
4. Click "Sign In"

## Features Available After Login

- **Dashboard**: View profile information and payment status
- **Payment History**: See past payments (for paid users)
- **Help Requests**: Submit and track financial assistance requests
- **Change Password**: Update account password
- **Request Help**: Submit new help requests directly from dashboard

## Creating New Users

Users can also create new accounts by:
1. Going to [http://localhost:3000/register](http://localhost:3000/register)
2. Or by making a payment at [http://localhost:3000/deposit](http://localhost:3000/deposit) (which creates account + processes payment)

## Admin Access

For admin access, use the existing admin credentials at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

**Note**: All demo users have the same password `password123` for easy testing. In production, users would set their own secure passwords.