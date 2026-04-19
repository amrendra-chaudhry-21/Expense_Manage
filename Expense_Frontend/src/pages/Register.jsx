import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg overflow-hidden relative honeycomb-pattern">
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-neonAmber/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-neonBlue/10 blur-[100px] pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glassmorphism p-10 rounded-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonAmber to-neonOrange">
            Expenzo
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-semibold ml-1">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-semibold ml-1">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-semibold ml-1">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary mt-4">
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-neonAmber hover:text-neonOrange tracking-wide font-semibold transition-colors">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
