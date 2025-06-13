import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiCircuitry } from 'react-icons/gi';
import { FiUser, FiClock, FiLock } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const TIMEZONES = [
  'Asia/Jakarta',
  'Asia/Makassar',
  'Asia/Jayapura',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');              // ← state password
  const [confirm, setConfirm] = useState('');                // ← state konfirmasi
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return setError('Please enter your name');
    }
    if (!username.trim()) {
      return setError('Please enter a username');
    }
    if (!password) {
      return setError('Please enter a password');
    }
    if (password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (password !== confirm) {
      return setError('Password and confirmation do not match');
    }
    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        username,
        password,                                        // ← kirim password
        preferred_timezone: timezone,
      });
      const { token, expiresIn, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user || null);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2">
            <GiCircuitry className="text-cyan-400 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-wide text-cyan-400">Task Manager</h1>
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-cyan-600">
          <h2 className="text-xl font-semibold text-cyan-400 mb-6 text-center">Membuat Akun</h2>
          
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-1">Nama</label>
              <input
                id="name" name="name" type="text" value={name}
                onChange={({ target }) => setName(target.value)}
                required placeholder="masukkan nama anda"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cyan-300 mb-1">Nama Pengguna</label>
              <input
                id="username" name="username" type="text" value={username}
                onChange={({ target }) => setUsername(target.value)}
                required placeholder="masukkan nama pengguna anda"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
                <FiLock className="mr-1 text-cyan-400" /> Password
              </label>
              <input
                id="password" name="password" type="password" value={password}
                onChange={({ target }) => setPassword(target.value)}
                required placeholder="masukkan password minimal 8 karakter"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
                <FiLock className="mr-1 text-cyan-400" /> Konfirmasi Password
              </label>
              <input
                id="confirm" name="confirm" type="password" value={confirm}
                onChange={({ target }) => setConfirm(target.value)}
                required placeholder="ulangi password anda"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            {/* Timezone */}
            <div>
              <label htmlFor="timezone" className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
                <FiClock className="mr-1 text-cyan-400" /> Zona Waktu
              </label>
              <select
                id="timezone" name="timezone" value={timezone}
                onChange={({ target }) => setTimezone(target.value)}
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 rounded-md p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
              >
                SIGN UP
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          &copy; 2025 Task Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignUp;
