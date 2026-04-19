import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an income title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    source: {
      type: String,
      required: [true, 'Please provide an income source'],
      enum: ['Salary', 'Freelance', 'Investments', 'Business', 'Other'],
      default: 'Salary',
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

export default mongoose.model('Income', incomeSchema);
