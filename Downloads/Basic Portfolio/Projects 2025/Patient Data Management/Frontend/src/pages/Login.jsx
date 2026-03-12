import React, { useState } from 'react';
import { User, Lock, ChevronRight, Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('admin');
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', {
                username: credentials.username,
                password: credentials.password,
            });

            // Save token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2563eb] rounded-b-[40px] -z-10"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Activity className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-center text-gray-500 mb-8">
                        Please sign in to your HMS account
                    </p>

                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                        {['admin', 'doctor', 'patient'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === r
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center group"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                            {!loading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register Now</Link>
                    </div>
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Forgot your password? <a href="#" className="text-blue-600 font-semibold hover:underline">Reset it</a>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400">© 2025 Hospital Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
