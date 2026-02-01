import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  sanadId: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  paidAmount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paymentDate: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createDemoUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Demo users data
    const demoUsers = [
      {
        firstName: 'Rajesh',
        lastName: 'Patel',
        email: 'rajesh.patel@example.com',
        mobileNumber: '9876543210',
        sanadId: 'SAN001',
        age: 35,
        password: 'password123',
        paidAmount: 2000,
        isPaid: true,
        paymentDate: new Date('2024-01-15')
      },
      {
        firstName: 'Priya',
        lastName: 'Shah',
        email: 'priya.shah@example.com',
        mobileNumber: '9876543211',
        sanadId: 'SAN002',
        age: 29,
        password: 'password123',
        paidAmount: 0,
        isPaid: false
      },
      {
        firstName: 'Amit',
        lastName: 'Desai',
        email: 'amit.desai@example.com',
        mobileNumber: '9876543212',
        sanadId: 'SAN003',
        age: 42,
        password: 'password123',
        paidAmount: 2000,
        isPaid: true,
        paymentDate: new Date('2024-02-10')
      },
      {
        firstName: 'Neha',
        lastName: 'Joshi',
        email: 'neha.joshi@example.com',
        mobileNumber: '9876543213',
        sanadId: 'SAN004',
        age: 31,
        password: 'password123',
        paidAmount: 0,
        isPaid: false
      },
      {
        firstName: 'Kiran',
        lastName: 'Modi',
        email: 'kiran.modi@example.com',
        mobileNumber: '9876543214',
        sanadId: 'SAN005',
        age: 38,
        password: 'password123',
        paidAmount: 2000,
        isPaid: true,
        paymentDate: new Date('2024-03-05')
      }
    ];

    // Clear existing demo users
    await User.deleteMany({
      email: { $in: demoUsers.map(user => user.email) }
    });

    // Create demo users with hashed passwords
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    console.log('\n✅ Demo users created successfully!');
    console.log('\n📋 Demo User Credentials:');
    console.log('Email: rajesh.patel@example.com | Password: password123 | Status: Paid');
    console.log('Email: priya.shah@example.com | Password: password123 | Status: Not Paid');
    console.log('Email: amit.desai@example.com | Password: password123 | Status: Paid');
    console.log('Email: neha.joshi@example.com | Password: password123 | Status: Not Paid');
    console.log('Email: kiran.modi@example.com | Password: password123 | Status: Paid');
    console.log('\n🔐 All users have the same password: password123');
    console.log('🌐 You can now login at: http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createDemoUsers();