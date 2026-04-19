import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Trash2, Wallet, Pencil } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const { searchQuery = "" } = useOutletContext() || {};
  const { triggerGlobalRefresh } = useContext(AuthContext);

  const todayDate = new Date();
  const maxDate = todayDate.toISOString().split("T")[0];
  const past45Days = new Date(todayDate);
  past45Days.setDate(todayDate.getDate() - 45);
  const minDate = past45Days.toISOString().split("T")[0];
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    source: "Salary",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchIncomes = async () => {
    try {
      const res = await api.get("/incomes");
      setIncomes(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/incomes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post("/incomes", formData);
      }
      setFormData({
        title: "",
        amount: "",
        source: "Salary",
        date: new Date().toISOString().split("T")[0],
      });
      fetchIncomes();
      triggerGlobalRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setFormData({
      title: income.title,
      amount: income.amount,
      source: income.source,
      date: new Date(income.date).toISOString().split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/incomes/${id}`);
      setIncomes(incomes.filter((i) => i._id !== id));
      triggerGlobalRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredIncomes = incomes.filter(income => 
    income.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    income.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonAmber to-neonOrange">
        Incomes
      </h1>

      <motion.div className="w-full glassmorphism p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
          <Wallet size={24} /> {editingId ? 'Edit Income' : 'Add Income'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center"
        >
          <div className="w-full">
            <input
              type="text"
              placeholder="Title (Freelance)"
              required
              className="input-field w-full"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="w-full">
            <div className="flex bg-black/40 border border-white/20 rounded-xl overflow-hidden focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-400 transition-all duration-300">
              <span className="flex items-center px-4 bg-white/5 border-r border-white/10 text-gray-400 font-semibold">
                ₹
              </span>
              <input
                type="number"
                placeholder="Amount"
                required
                min="0"
                className="w-full bg-transparent p-3 text-gray-200 outline-none"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>
          <div className="w-full">
            <select
              className="input-field w-full [&>option]:bg-darkBg"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            >
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investments">Investments</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="w-full">
            <input
              type="date"
              required
              min={minDate}
              max={maxDate}
              className="input-field w-full text-gray-400"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div className="w-full h-full flex flex-row gap-3 mt-0">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ title: "", amount: "", source: "Salary", date: new Date().toISOString().split("T")[0] }); }} className="btn-secondary flex-1 py-3 border border-gray-600 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`btn-primary flex items-center justify-center gap-2 h-full py-3 ${editingId ? 'flex-[2] bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'w-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
            >
              {editingId ? 'Update' : 'Add Income'}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="w-full glassmorphism p-6 rounded-2xl min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Income History</h2>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredIncomes.map((income) => (
                <motion.div
                  key={income._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-green-500/50 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      <h3 className="font-semibold text-lg">{income.title}</h3>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(income.date).toLocaleDateString()} &bull;{" "}
                      {income.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-green-400">
                      +₹{income.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(income)}
                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredIncomes.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                {searchQuery ? 'No incomes match your search.' : 'No incomes found.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incomes;
