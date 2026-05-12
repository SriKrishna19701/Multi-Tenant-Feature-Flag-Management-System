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
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                >
                    Logout
                </button>
            </div>
            <form onSubmit={handleCreateFeature} className="mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="text"
                        placeholder="Feature Key"
                        value={featureKey}
                        onChange={(e) => setFeatureKey(e.target.value)}
                        className="px-3 py-2 border rounded text-black placeholder:text-black focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                    <label className="flex items-center gap-2 text-black">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        Enabled
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Feature'}
                    </button>
                </div>
            </form>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-black">Features</h2>
                {features.length === 0 ? (
                    <p className="text-black">No features found. Create one above!</p>
                ) : (
                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature._id} className="flex flex-col gap-4 border-b pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-semibold text-black">{feature.featureKey}</p>
                                    <p className={`text-sm ${feature.enabled ? 'text-green-600' : 'text-red-600'}`}>
                                        {feature.enabled ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFeature(feature._id, feature.enabled)}
                                        disabled={loading}
                                        className={`bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteFeature(feature._id)}
                                        disabled={loading}
                                        className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}