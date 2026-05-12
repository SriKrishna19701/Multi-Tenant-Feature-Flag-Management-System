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

    const handleDeleteOrganization = async (id) => {
        if (!confirm('Delete this organization? This cannot be undone.')) return;
        setLoading(true);
        try {
            await api.delete(`/organizations/${id}`);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete organization:', error);
            alert('Failed to delete organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/super-admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold">Super Admin Dashboard</p>
                        <h1 className="mt-3 text-3xl font-bold text-black">Manage Organizations</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">Create and remove organizations from the platform. Deleting an organization removes it from the tenant list.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full md:w-auto bg-red-500 text-white py-3 px-6 rounded shadow hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid gap-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-black">Organization List</h2>
                            <p className="mt-2 text-sm text-slate-600">Only super admins can add and remove organizations.</p>
                        </div>
                        <button
                            onClick={handleCreateOrganization}
                            className="bg-green-500 text-white py-3 px-6 rounded shadow hover:bg-green-600 transition duration-200"
                        >
                            Create Organization
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-black">Loading organizations…</div>
                    ) : error ? (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm text-center text-red-700">{error}</div>
                    ) : organizations.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-black">No organizations found.</div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {organizations.map((organization) => (
                                <div key={organization._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-black">{organization.name}</h3>
                                            <p className="mt-2 text-sm text-slate-500">ID: {organization._id}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteOrganization(organization._id)}
                                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition duration-200"
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
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