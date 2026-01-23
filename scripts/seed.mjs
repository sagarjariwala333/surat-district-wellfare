import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surat_welfare';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobileNumber: String,
  sanadId: { type: String, unique: true },
  age: Number,
  paidAmount: Number,
  isPaid: Boolean,
  paymentDate: Date,
}, { timestamps: true });

const HelpRequestSchema = new mongoose.Schema({
  title: String,
  description: String,
  mobileNumber: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const HelpRequest = mongoose.models.HelpRequest || mongoose.model('HelpRequest', HelpRequestSchema);

const users = [
  { firstName: 'Rajesh', lastName: 'Mehta', email: 'rajesh.mehta@example.com', mobileNumber: '9876543210', sanadId: 'G/123/2010', age: 45, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-01') },
  { firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@example.com', mobileNumber: '9825012345', sanadId: 'G/456/2015', age: 32, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-05') },
  { firstName: 'Amit', lastName: 'Shah', email: 'amit.shah@example.com', mobileNumber: '9904411223', sanadId: 'G/789/2008', age: 50, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-10') },
  { firstName: 'Priya', lastName: 'Desai', email: 'priya.desai@example.com', mobileNumber: '9723344556', sanadId: 'G/101/2018', age: 29, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-12') },
  { firstName: 'Vikram', lastName: 'Joshi', email: 'vikram.joshi@example.com', mobileNumber: '9426677889', sanadId: 'G/202/2005', age: 55, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-15') },
  { firstName: 'Anjali', lastName: 'Gajjar', email: 'anjali.gajjar@example.com', mobileNumber: '9173388990', sanadId: 'G/303/2020', age: 27, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-20') },
  { firstName: 'Kiran', lastName: 'Vani', email: 'kiran.vani@example.com', mobileNumber: '9033322110', sanadId: 'G/404/2012', age: 38, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-22') },
  { firstName: 'Manoj', lastName: 'Trivedi', email: 'manoj.trivedi@example.com', mobileNumber: '9898877665', sanadId: 'G/505/2000', age: 62, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-18') },
  { firstName: 'Sonal', lastName: 'Chauhan', email: 'sonal.chauhan@example.com', mobileNumber: '9638844221', sanadId: 'G/606/2016', age: 34, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-08') },
  { firstName: 'Deepak', lastName: 'Parikh', email: 'deepak.parikh@example.com', mobileNumber: '9586611330', sanadId: 'G/707/2011', age: 43, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-03') },
  { firstName: 'Neha', lastName: 'Modi', email: 'neha.modi@example.com', mobileNumber: '9427755882', sanadId: 'G/808/2022', age: 25, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-23') },
  { firstName: 'Sanjay', lastName: 'Raval', email: 'sanjay.raval@example.com', mobileNumber: '9974433119', sanadId: 'G/909/2007', age: 48, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-07') },
  { firstName: 'Bhavna', lastName: 'Acharya', email: 'bhavna.acharya@example.com', mobileNumber: '9824499887', sanadId: 'G/010/2014', age: 36, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-14') },
  { firstName: 'Pankaj', lastName: 'Vyas', email: 'pankaj.vyas@example.com', mobileNumber: '9712233440', sanadId: 'G/111/2003', age: 58, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-11') },
  { firstName: 'Dharmesh', lastName: 'Limbachiya', email: 'dharmesh.l@example.com', mobileNumber: '9662255883', sanadId: 'G/212/2019', age: 30, paidAmount: 2000, isPaid: true, paymentDate: new Date('2026-01-19') },
];

const helpRequests = [
  { title: 'Emergency Heart Surgery Support', description: 'Requesting financial assistance for immediate heart bypass surgery at Civil Hospital.', mobileNumber: '9876543210', status: 'pending' },
  { title: 'Accident Recovery Assistance', description: 'Severe leg injury due to road accident. Need funds for multiple surgeries and rehabilitation.', mobileNumber: '9825012345', status: 'approved' },
  { title: 'Medical Expenses for COVID Complications', description: 'Ongoing treatment for lungs infection. Expenses exceeding insurance limit.', mobileNumber: '9904411223', status: 'pending' },
  { title: 'Educational Support for Daughter', description: 'Requesting welfare fund support for daughter\'s higher studies in Law.', mobileNumber: '9426677889', status: 'rejected' },
  { title: 'House Damage due to Cyclone', description: 'Significant damage to ancestral home during recent cyclone. Need funds for urgent repairs.', mobileNumber: '9033322110', status: 'pending' },
  { title: 'Critical Kidney Treatment', description: 'Diagnosed with renal failure. Need assistance for regular dialysis and potential transplant.', mobileNumber: '9898877665', status: 'approved' },
  { title: 'Assistance for Rare Disease Medication', description: 'High-cost monthly medication required for a rare autoimmune disorder.', mobileNumber: '9638844221', status: 'pending' },
  { title: 'Post-Surgery Rehabilitation', description: 'Support needed for physiotherapy and nursing care after a major spinal surgery.', mobileNumber: '9712233440', status: 'pending' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await HelpRequest.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await User.insertMany(users);
    await HelpRequest.insertMany(helpRequests);
    console.log('Seed data inserted successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
