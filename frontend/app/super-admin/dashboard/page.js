'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/organizations');
            setOrganizations(response.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            alert('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchData();
        };

        void load();
    }, []);

    const handleCreateOrganization = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black">Super Admin Dashboard</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
                {loading ? (
                    <p className="text-black">Loading...</p>
                ) : organizations.length > 0 ? (
                    <div>
                        <p className="text-black mb-4">Organizations</p>
                        <ul className="space-y-2 mb-4">
                            {organizations.map((organization) => (
                                <li key={organization._id} className="border rounded p-3 text-black">
                                    {organization.name}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleCreateOrganization}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                            Create New Organization
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-black mb-4">No organization found.</p>
                        <button
                            onClick={handleCreateOrganization}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                            Create Organization
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}   