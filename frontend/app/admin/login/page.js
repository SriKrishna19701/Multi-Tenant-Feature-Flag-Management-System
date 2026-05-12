"use client";

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/orgadmin/login', { email, password });
            localStorage.setItem('token', response.data.token);
            router.push('/admin/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white/95 p-10 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                <div className="mb-8 space-y-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Login</span>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Admin access</h2>
                    <p className="text-sm text-slate-600">Sign in to manage your team’s feature flags and organization settings.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <a href="/admin/signup" className="font-semibold text-slate-900 hover:underline">Create one</a>
                </div>
            </div>
        </div>
    );
}