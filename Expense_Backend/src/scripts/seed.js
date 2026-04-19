import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    await User.deleteMany();
    await Expense.deleteMany();
    await Income.deleteMany();

    // Create a demo user
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    // NOTE: Because of 'pre save' hook in User model, we should use create without raw hash, 
    // OR just rely on the pre-save hook. Since the model hashes the password field, let's just use raw.
    const createdUsers = await User.create([
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123', 
      },
      {
        name: 'Amrendra',
        email: 'amrendrait43@gmail.com',
        password: 'India@aa432',
      }
    ]);

    const demoUser = createdUsers[0]._id;

    // Create Incomes
    await Income.create([
      { user: demoUser, title: 'Salary', amount: 5000, source: 'Salary', date: new Date() },
      { user: demoUser, title: 'Freelance Project', amount: 1200, source: 'Freelance', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { user: demoUser, title: 'Stock Dividends', amount: 300, source: 'Investments', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    ]);

    // Create Expenses
    await Expense.create([
      { user: demoUser, title: 'Groceries', amount: 150, category: 'Food', date: new Date() },
      { user: demoUser, title: 'Electricity Bill', amount: 80, category: 'Bills', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { user: demoUser, title: 'Uber', amount: 20, category: 'Travel', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { user: demoUser, title: 'Netflix', amount: 15, category: 'Entertainment', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { user: demoUser, title: 'New Shoes', amount: 120, category: 'Shopping', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
