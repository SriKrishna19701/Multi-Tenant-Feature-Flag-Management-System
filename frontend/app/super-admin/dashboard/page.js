'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.get('/organizations');
            setOrganizations(response.data || []);
            setError('');
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Unable to load organizations. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const handleCreateOrganization = async () => {
        const name = prompt('Enter organization name:');
        if (!name) return;
        setLoading(true);
        try {
            await api.post('/organizations', { name });
            await fetchData();
        } catch (error) {
            console.error('Failed to create organization:', error);
            alert('Failed to create organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/super-admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[2rem] bg-white/95 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Super Admin</p>
                        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Tenant organization management</h1>
                        <p className="mt-3 max-w-2xl text-slate-600">Add and review tenant organizations in a clean, unified dashboard. Deletion is disabled here to keep your platform safe.</p>
                    </div>
                    <div className="rounded-[2rem] bg-white/95 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Quick actions</p>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">Create organization</h2>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                            >
                                Logout
                            </button>
                        </div>
                        <button
                            onClick={handleCreateOrganization}
                            className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                        >
                            Create Organization
                        </button>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {loading ? (
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-900 shadow-lg shadow-slate-200/60">Loading organizations…</div>
                    ) : error ? (
                        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-red-800 shadow-lg shadow-red-100/60">{error}</div>
                    ) : organizations.length === 0 ? (
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-900 shadow-lg shadow-slate-200/60">No organizations found.</div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {organizations.map((organization) => (
                                <div key={organization._id} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-slate-900">{organization.name}</h3>
                                        <p className="text-sm text-slate-500">Tenant ID: {organization._id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
   