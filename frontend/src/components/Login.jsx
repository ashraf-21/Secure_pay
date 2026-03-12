import React, { useState } from 'react';
import { authAPI } from '../api';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

const Login = ({ onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>
      
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-float" style={{ animationDuration: '6s' }}>
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
          Welcome Back
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Sign in to access the Fraud Detection System
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="form-label">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="text"
                className="input-field !pl-10"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e)=>setFormData({...formData,username:e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="password"
                className="input-field !pl-10"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e)=>setFormData({...formData,password:e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-foreground/70">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;