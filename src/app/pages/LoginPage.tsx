import React, { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import "../../styles/login.css";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../lib/firebase';
import type { UserRole } from '../data/mockData';


export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Firebase auth - AuthContext listener will handle profile + redirect
      await signInWithEmailAndPassword(auth, email, password);
      
      // Clear form on success (redirect handled by PublicLayout)
      setEmail('');
      setPassword('');
      
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#f8f9fa] overflow-hidden font-sans">

      {/* Login Card */}
      <div className="w-full max-w-sm sm:max-w-md shadow-xl border border-gray-100 login-gradient relative z-10 rounded-2xl p-8 sm:p-10 mx-4">
        
        <div className="space-y-4 text-center mb-8">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="HR Ticketing System Logo" 
              className="w-16 h-16 rounded-2xl shadow-md object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black leading-tight">
            HUMAN RESOURCE<br/>TICKETING
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label htmlFor="email" className="text-sm font-medium text-gray-800">
              Employee ID/ Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Employee ID or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-3 rounded-md bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{ backgroundColor: 'rgb(176, 191, 0)' }}
            className="w-full h-11 rounded-md text-white font-medium text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all mt-2"
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/register')}
            style={{ backgroundColor: 'rgb(107, 114, 0)' }}
            className="w-full h-11 rounded-md text-white font-medium text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all mt-2"
          >
            Create Account - Register
          </button>

        </form>

      </div>
    </div>
  );
}
