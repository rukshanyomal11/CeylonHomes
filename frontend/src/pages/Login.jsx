import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data);
      toast.success('Login successful!');

      // Redirect based on role
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.user.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      if (errorMessage.toLowerCase().includes('password')) {
        toast.error('Wrong password! Please try again.');
      } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('email')) {
        toast.error('Email not found! Please check your email.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setResetLoading(true);

    try {
      // Call backend API to send verification code
      await authAPI.forgotPassword({ email: resetEmail });

      toast.success(
        `Verification code sent to ${resetEmail}! Check your email.`,
        { duration: 5000 }
      );

      setShowCodeInput(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      toast.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();

    if (!enteredCode) {
      toast.error('Please enter the verification code');
      return;
    }

    if (enteredCode.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    toast.success('Code ready! Now set your new password.');
    setShowCodeInput(false);
    setShowPasswordReset(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setResetLoading(true);

    try {
      // Call backend API to reset password
      await authAPI.resetPassword({
        email: resetEmail,
        code: enteredCode,
        newPassword: newPassword
      });

      toast.success('Password reset successfully! You can now login.');

      // Reset all states
      setShowForgotPassword(false);
      setShowCodeInput(false);
      setShowPasswordReset(false);
      setResetEmail('');
      setEnteredCode('');
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-amber-50 to-white overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative z-10 max-w-5xl w-full rounded-[32px] border border-primary-100 bg-white/90 backdrop-blur shadow-[0_45px_120px_-70px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center">
                  <span className="text-lg font-bold text-primary-600">Ceylon</span>
                  <span className="text-lg font-bold text-gray-800">Homes</span>
                </Link>
                <Link to="/register" className="text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  Sign Up
                </Link>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-600 font-semibold">Welcome back</p>
              <h2 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Login to your account</h2>
              <p className="text-sm text-slate-600 mt-2">Manage your listings and approvals in one place.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.21-2.72 3.41-4.89 6.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7a11.07 11.07 0 0 1-2.64 3.88" />
                        <path d="M1 1l22 22" />
                        <path d="M10.7 10.7a2.5 2.5 0 0 0 3.54 3.54" />
                        <path d="M9.5 9.5a2.5 2.5 0 0 1 3.54 3.54" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-1 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm shadow-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-xs text-slate-500 text-center">
                New here?{' '}
                <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-800">
                  Create an account
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:block relative overflow-hidden">
            <img
              src="/Wavy_REst-03_Single-04.jpg"
              alt="CeylonHomes Login"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-yellow-500/60"></div>
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-primary-100">Sign in to manage your property listings</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white/15 px-3 py-1">Verified listings</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Admin approved</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Secure access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-3xl border border-primary-100 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.7)] max-w-md w-full p-6 sm:p-8 overflow-hidden animate-fade-in">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary-200/40 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
            {/* Close Button */}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setShowCodeInput(false);
                setShowPasswordReset(false);
                setResetEmail('');
                setEnteredCode('');
                setVerificationCode('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="relative text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-primary-200">
                <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary-600 font-semibold">Account Recovery</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2 mb-2">Forgot Password?</h3>
              <p className="text-sm text-slate-600">
                {!showCodeInput && !showPasswordReset && "Enter your email to receive a verification code"}
                {showCodeInput && "Enter the 6-digit code sent to your email"}
                {showPasswordReset && "Enter your new password"}
              </p>
            </div>

            {/* Step 1: Email Input */}
            {!showCodeInput && !showPasswordReset && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                  className="w-full py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {showCodeInput && !showPasswordReset && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-center text-2xl font-mono tracking-widest shadow-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Code sent to: {resetEmail}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Verify Code
                </button>

                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="w-full py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Back
                </button>
              </form>
            )}

            {/* Step 3: Password Reset */}
            {showPasswordReset && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showResetPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 shadow-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                    >
                      {showResetPassword ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.21-2.72 3.41-4.89 6.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7a11.07 11.07 0 0 1-2.64 3.88" />
                          <path d="M1 1l22 22" />
                          <path d="M10.7 10.7a2.5 2.5 0 0 0 3.54 3.54" />
                          <path d="M9.5 9.5a2.5 2.5 0 0 1 3.54 3.54" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showResetConfirmPassword ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.21-2.72 3.41-4.89 6.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7a11.07 11.07 0 0 1-2.64 3.88" />
                          <path d="M1 1l22 22" />
                          <path d="M10.7 10.7a2.5 2.5 0 0 0 3.54 3.54" />
                          <path d="M9.5 9.5a2.5 2.5 0 0 1 3.54 3.54" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex">
                <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-800">
                  {!showCodeInput && !showPasswordReset && "Check your spam folder if you don't receive the code."}
                  {showCodeInput && "The code is valid for 10 minutes."}
                  {showPasswordReset && "Password must be at least 8 characters long."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
