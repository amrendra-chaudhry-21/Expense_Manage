import Income from '../models/Income.js';

// @desc    Get all incomes for user
// @route   GET /api/v1/incomes
// @access  Private
export const getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new income
// @route   POST /api/v1/incomes
// @access  Private
export const addIncome = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const income = await Income.create(req.body);
    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/v1/incomes/:id
// @access  Private
export const updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, error: 'Income not found' });
    }
    // Make sure user owns income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this income' });
    }
    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/v1/incomes/:id
// @access  Private
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, error: 'Income not found' });
    }
    // Make sure user owns income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this income' });
    }
    await income.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
