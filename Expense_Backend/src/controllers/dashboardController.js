import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

// @desc    Get dashboard summary (total income, expense, balance, recent transactions)
// @route   GET /api/v1/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all incomes for user
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    // Get all expenses for user
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const balance = totalIncome - totalExpense;

    // Format for charts (group by month maybe, or just send last 5 tx)
    const recentIncomes = incomes.slice(0, 5).map(item => ({ ...item._doc, type: 'income' }));
    const recentExpenses = expenses.slice(0, 5).map(item => ({ ...item._doc, type: 'expense' }));
    
    let recentTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Expense By Category for Pie Chart
    const expenseByCategory = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    // Time based calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyExpense = expenses
      .filter(e => new Date(e.date) >= today)
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const weeklyExpense = expenses
      .filter(e => new Date(e.date) >= startOfWeek)
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const monthlyExpense = expenses
      .filter(e => new Date(e.date) >= startOfMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        dailyExpense,
        weeklyExpense,
        monthlyExpense,
        recentTransactions,
        expenseByCategory: Object.keys(expenseByCategory).map(key => ({ name: key, value: expenseByCategory[key] }))
      },
    });
  } catch (error) {
    next(error);
  }
};
