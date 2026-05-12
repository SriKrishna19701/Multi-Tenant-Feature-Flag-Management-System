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
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 p-8 shadow-2xl shadow-slate-300/40">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl text-white">
                            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-cyan-100">Super Admin Dashboard</p>
                            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Manage your tenant organizations</h1>
                            <p className="mt-4 text-base leading-7 text-slate-100/90">Create organizations as needed. Organization removal is disabled for super-admins here to keep tenant access safe and consistent.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex shrink-0 items-center justify-center rounded-3xl bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:bg-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-10 grid gap-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Organization List</h2>
                                <p className="mt-2 text-sm text-slate-600">Super admins can add organizations. Deletion is intentionally disabled in this view.</p>
                            </div>
                            <button
                                onClick={handleCreateOrganization}
                                className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Create Organization
                            </button>
                        </div>
                    </div>

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
                                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                        Deletion restricted for super admins
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
   