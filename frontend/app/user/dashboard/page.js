'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function UserDashboard() {
    const router = useRouter();
    const [featureKey, setFeatureKey] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheckFeature = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/features/check', { featureKey });
            setResult(response.data.enabled ? 'enabled' : 'disabled');
        } catch (error) {
            console.error('Failed to check feature:', error);
            alert('Failed to check feature. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/user/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black">User Dashboard</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
                <form onSubmit={handleCheckFeature}>
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="featureKey">Feature Key</label>
                        <input
                            type="text"
                            id="featureKey"
                            value={featureKey}
                            onChange={(e) => setFeatureKey(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Checking...' : 'Check Feature'}
                    </button>
                </form>
                {result && (
                    <div className={`mt-4 text-center text-lg font-semibold ${result === 'enabled' ? 'text-green-500' : 'text-red-500'}`}>
                        Feature is {result}
                    </div>
                )}
            </div>
        </div>
    );
}