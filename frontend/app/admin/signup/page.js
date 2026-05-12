'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const router = useRouter();

    // handling Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try  {
            await api.post('/auth/orgadmin/register', { email, password });
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
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black-500 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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