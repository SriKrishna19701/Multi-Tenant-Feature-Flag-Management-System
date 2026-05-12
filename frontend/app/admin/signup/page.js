'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organization, setOrganization] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await api.get('/organizations/public');
                setOrganizations(response.data || []);
            } catch (error) {
                console.error('Failed to load organizations:', error);
            }
        };
        fetchOrganizations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/orgadmin/register', {
                name,
                email,
                password,
                organization,
            });
            alert('Registration successful! Please log in.');
            router.push('/admin/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white/95 p-10 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                <div className="mb-8 space-y-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin registration</span>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Create admin access</h2>
                    <p className="text-sm text-slate-600">Register as an organization admin so you can manage your team’s feature flags.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                            required
                        />
                    </div>
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
                        <label htmlFor="organization" className="block text-sm font-medium text-slate-700">Organization</label>
                        <select
                            id="organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                            required
                        >
                            <option value="" disabled>
                                {organizations.length ? 'Select organization' : 'Loading organizations...'}
                            </option>
                            {organizations.map((org) => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
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
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
