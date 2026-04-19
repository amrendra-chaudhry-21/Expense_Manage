import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const COLORS = ['#f59e0b', '#3b82f6', '#ea580c', '#10b981', '#8b5cf6', '#ef4444'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { searchQuery = "" } = useOutletContext() || {};
  const { refreshTrigger } = useContext(AuthContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [refreshTrigger]);

  const filteredTransactions = data?.recentTransactions?.filter(tx => 
    tx.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-neonAmber">Loading dashboard...</div>;

  const cards = [
    { title: 'Total Balance', amount: data?.balance || 0, color: 'text-white' },
    { title: 'Total Income', amount: data?.totalIncome || 0, color: 'text-green-400' },
    { title: 'Total Expense', amount: data?.totalExpense || 0, color: 'text-red-400' },
  ];

  const statCards = [
    { title: 'Daily Expense', amount: data?.dailyExpense || 0, color: 'text-orange-400' },
    { title: 'Weekly Expense', amount: data?.weeklyExpense || 0, color: 'text-orange-400' },
    { title: 'Monthly Expense', amount: data?.monthlyExpense || 0, color: 'text-orange-400' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonAmber to-neonOrange">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="glassmorphism p-6 rounded-2xl relative overflow-hidden group border border-white/10 shadow-lg hover:shadow-neonAmber/20 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-neonAmber/10 transition-colors duration-500"></div>
            <h3 className="text-gray-400 font-medium mb-1 drop-shadow-md">{card.title}</h3>
            <p className={`text-4xl font-bold tracking-tight ${card.color} drop-shadow-md`}>
              ₹{card.amount.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={`stat-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 3) * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glassmorphism p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/50 hover:shadow-lg transition-all cursor-pointer"
          >
            <h3 className="text-gray-400 font-medium text-sm mb-1">{card.title}</h3>
            <p className={`text-2xl font-bold tracking-tight ${card.color}`}>
              ₹{card.amount.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold mb-6">Expense by Category</h2>
          <div className="h-64">
            {data?.expenseByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No expenses yet.</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {filteredTransactions?.length > 0 ? (
              filteredTransactions.map((tx, i) => (
                <div key={tx._id || i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-semibold">{tx.title}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {searchQuery ? 'No transactions match search.' : 'No transactions recorded.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
