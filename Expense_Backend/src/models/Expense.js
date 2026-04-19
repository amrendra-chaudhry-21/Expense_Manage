import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Food',
        'Travel',
        'Bills',
        'Shopping',
        'Entertainment',
        'Health',
        'Education',
        'Other',
      ],
      default: 'Other',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
