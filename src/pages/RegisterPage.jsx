import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiUrl } from '../utils/api';

// ─── Validation Helpers ──────────────────────────────────────────────────────

function validateFullName(value) {
  if (!value.trim()) return null; // optional field
  if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
  return null;
}

function validateUsername(value) {
  if (!value.trim()) return 'Username is required.';
  if (value.trim().length < 3) return 'Username must be at least 3 characters.';
  if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return 'Username can only contain letters, numbers, and underscores.';
  return null;
}

function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value.trim()) return 'Email address is required.';
  if (!emailRegex.test(value.trim())) return 'Please enter a valid email address (e.g. you@example.com).';
  return null;
}

function validatePassword(value) {
  if (!value) return 'Password is required.';
  if (value.length < 6) return 'Password must be at least 6 characters long.';
  if (!/[A-Za-z]/.test(value)) return 'Password must contain at least one letter.';
  return null;
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match. Please re-enter.';
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  // Validate a single field on blur
  const handleFieldBlur = (field) => {
    const validators = {
      fullName: () => validateFullName(fullName),
      username: () => validateUsername(username),
      email: () => validateEmail(email),
      password: () => validatePassword(password),
      confirmPassword: () => validateConfirmPassword(password, confirmPassword),
    };
    const err = validators[field]?.();
    setFieldErrors((prev) => ({ ...prev, [field]: err || '' }));
  };

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Run all validations
    const errors = {
      fullName: validateFullName(fullName),
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      const mapped = {};
      for (const [k, v] of Object.entries(errors)) {
        mapped[k] = v || '';
      }
      setFieldErrors(mapped);
      console.warn('[RegisterPage] Validation failed before submit:', errors);
      return;
    }

    setLoading(true);
    console.log('[RegisterPage] Submitting registration for username:', username, '| email:', email);

    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          fullName: fullName.trim(),
        }),
      });

      const data = await response.json();
      console.log('[RegisterPage] Server response status:', response.status, '| ok:', response.ok);

      if (!response.ok) {
        const serverMessage = data.error || 'Registration failed. Please check your details and try again.';
        console.warn('[RegisterPage] Registration rejected by server:', serverMessage);
        setError(serverMessage);
        return;
      }

      if (!data.token || !data.user) {
        const msg = 'Unexpected response from the server. Please try again.';
        console.error('[RegisterPage] Missing token or user in response:', data);
        setError(msg);
        return;
      }

      console.log('[RegisterPage] Registration successful. Storing token & user, navigating to /chat');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));
      navigate('/chat');
    } catch (err) {
      const msg = 'Unable to connect to the server. Please make sure the backend is running on port 4000.';
      console.error('[RegisterPage] Network/fetch error:', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Reusable field error element
  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {fieldErrors[name]}
      </p>
    ) : null;

  const inputClass = (field) =>
    `w-full border-0 border-b px-0 py-3 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-accent-500 transition ${
      fieldErrors[field] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-accent-gradient rounded-full mx-auto flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Mohan-ai-workspace</h2>
            <p className="text-xl text-slate-300 mb-8">Intelligent solutions made simple</p>
          </div>

          <div className="space-y-4 text-left">
            {[
              'Fast and secure registration',
              'Your data is always protected',
              'Start creating with AI today',
            ].map((text) => (
              <div key={text} className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Join Mohan-ai-workspace and start creating</p>
          </div>

          {/* Top-level error banner */}
          {error && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName'); }}
                onBlur={() => handleFieldBlur('fullName')}
                placeholder="John Doe"
                autoComplete="name"
                className={inputClass('fullName')}
              />
              <FieldError name="fullName" />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearFieldError('username'); }}
                onBlur={() => handleFieldBlur('username')}
                placeholder="johndoe"
                autoComplete="username"
                className={inputClass('username')}
              />
              <FieldError name="username" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                onBlur={() => handleFieldBlur('email')}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass('email')}
              />
              <FieldError name="email" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); clearFieldError('confirmPassword'); }}
                  onBlur={() => handleFieldBlur('password')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`${inputClass('password')} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-700 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 0 0 1.646-3.504 5.5-5.742M6.223 6.223A10.043 10.043 0 0112 5c5 0 9.27 3.11 11 7-.447.956-1.126 1.924-2.012 2.847M9.88 9.88a3 3 0 104.243 4.243" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                    </svg>
                  )}
                </button>
              </div>
              <FieldError name="password" />
              {!fieldErrors.password && password && (
                <p className="mt-1 text-xs text-slate-400">
                  Strength: {password.length >= 12 ? '💪 Strong' : password.length >= 8 ? '👍 Good' : '⚠️ Weak (min 6 chars)'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`${inputClass('confirmPassword')} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-700 transition"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 0 0 1.646-3.504 5.5-5.742M6.223 6.223A10.043 10.043 0 0112 5c5 0 9.27 3.11 11 7-.447.956-1.126 1.924-2.012 2.847M9.88 9.88a3 3 0 104.243 4.243" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                    </svg>
                  )}
                </button>
              </div>
              <FieldError name="confirmPassword" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>{loading ? 'Creating account…' : 'Create Account'}</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-500 hover:text-accent-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
