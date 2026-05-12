'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function UserDashboard() {
    const router = useRouter();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFeatures = async () => {
        try {
            const response = await api.get('/features');
            setFeatures(response.data || []);
        } catch (err) {
            console.error('Failed to load features:', err);
            setError('Unable to load features. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchFeatures();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/user/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold">User Dashboard</p>
                        <h1 className="mt-3 text-3xl font-bold text-black">Organization Feature List</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">All available features for your organization are listed below. See at a glance whether each feature is enabled or disabled.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full md:w-auto bg-red-500 text-white py-3 px-6 rounded shadow hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid gap-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-black mb-2">Feature Overview</h2>
                        <p className="text-sm text-slate-600">Features are loaded from your current organization context and displayed with their enabled status.</p>
                    </div>

                    {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-black">Loading features…</div>
                    ) : error ? (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm text-center text-red-700">{error}</div>
                    ) : features.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-black">No features found for your organization.</div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div key={feature._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-black">{feature.featureKey}</h3>
                                            <p className="mt-2 text-sm text-slate-500">Feature identifier used for your organization.</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${feature.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {feature.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
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