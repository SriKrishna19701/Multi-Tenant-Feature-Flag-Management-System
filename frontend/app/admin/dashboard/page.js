"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function AdminDashboard() {
    const router = useRouter();
    const [features, setFeatures] = useState([]);
    const [featureKey, setFeatureKey] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get('/features');
            setFeatures(response.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            alert('Failed to load dashboard data. Please try again later.');
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchData();
        };

        void load();
    }, []);

    const handleCreateFeature = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/features', { featureKey, enabled });
            setFeatureKey('');
            setEnabled(false);
            await fetchData();
        } catch (error) {
            console.error('Failed to create feature:', error);
            alert('Failed to create feature. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeature = async (featureId) => {
        if (!confirm('Are you sure you want to delete this feature?')) return;
        setLoading(true);
        try {
            await api.delete(`/features/${featureId}`);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete feature:', error);
            alert('Failed to delete feature. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeature = async (featureId, currentStatus) => {
        setLoading(true);
        try {
            await api.put(`/features/${featureId}`, { enabled: !currentStatus });
            await fetchData();
        } catch (error) {
            console.error('Failed to toggle feature:', error);
            alert('Failed to toggle feature. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="rounded-[2rem] bg-white/95 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Dashboard</p>
                            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Manage features for your organization</h1>
                            <p className="mt-3 max-w-2xl text-slate-600">Create, toggle, and manage feature flags with a clean and simple interface.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-[2rem] bg-white/95 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">Create a feature</h2>
                                <p className="mt-2 text-sm text-slate-600">Add a new feature flag for your organization and set its starting state.</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateFeature} className="space-y-4">
                            <div>
                                <label htmlFor="featureKey" className="block text-sm font-medium text-slate-700">Feature key</label>
                                <input
                                    id="featureKey"
                                    type="text"
                                    placeholder="e.g. new-dashboard"
                                    value={featureKey}
                                    onChange={(e) => setFeatureKey(e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => setEnabled(e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                    />
                                    Enabled
                                </label>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Creating...' : 'Create feature'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-[2rem] bg-white/95 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200">
                        <h2 className="text-2xl font-semibold text-slate-900">Feature status</h2>
                        <p className="mt-2 text-sm text-slate-600">Toggle feature availability with a single click and keep your workflow smooth.</p>
                        {features.length === 0 ? (
                            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
                                No features found yet. Add one to get started.
                            </div>
                        ) : (
                            <ul className="mt-6 space-y-4">
                                {features.map((feature) => (
                                    <li key={feature._id} className="space-y-4 rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-900">{feature.featureKey}</p>
                                                <p className={`text-sm font-medium ${feature.enabled ? 'text-emerald-700' : 'text-rose-600'}`}>
                                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeature(feature._id, feature.enabled)}
                                                    disabled={loading}
                                                    className={`rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {feature.enabled ? 'Disable' : 'Enable'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteFeature(feature._id)}
                                                    disabled={loading}
                                                    className={`rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}