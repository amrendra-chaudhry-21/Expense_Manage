import Expense from '../models/Expense.js';

// @desc    Get all expenses for user
// @route   GET /api/v1/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new expense
// @route   POST /api/v1/expenses
// @access  Private
export const addExpense = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const expense = await Expense.create(req.body);
    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this expense' });
    }
    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this expense' });
    }
    await expense.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
