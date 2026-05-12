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

    // handling Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try  {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-black text-center">Admin Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="organization">Organization</label>
                        <select
                            id="organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
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
                    <div className="mb-6">
                        <label className="block text-black mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );  
}