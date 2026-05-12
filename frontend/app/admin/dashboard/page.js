"use client";

const { useEffect } = require("react");

import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function AdminDashboard() {

    // State to hold dashboard data
    const [ features, setFeatures ] = useState([]);
    const [ featureKey, setFeatureKey ] = useState('');
    const [ enabled, setEnabled ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    // Fetch dashboard data on component mount
    const fetchData = async () => {
            try {
                const response = await api.get('/features');
                setFeatures(response.data.features);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                alert('Failed to load dashboard data. Please try again later.');
            }
    };

    useEffect(() => {;  
        fetchData();
    }, []);

    // create feature
    const handleCreateFeature = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/features', { key: featureKey, enabled });
            setFeatureKey('');
            setEnabled(false);
            fetchData(); // Refresh dashboard data
        }
        catch (error) {
            console.error('Failed to create feature:', error);
            alert('Failed to create feature. Please try again.');
        }
        finally {
            setLoading(false);
        }       

        // delete feature
        const handleDeleteFeature = async (featureId) => {
            if (!confirm('Are you sure you want to delete this feature?')) return;
            setLoading(true);
            try {
                await api.delete(`/features/${featureId}`);
                fetchData(); // Refresh dashboard data
            }
            catch (error) {
                console.error('Failed to delete feature:', error);
                alert('Failed to delete feature. Please try again.');
            }
            finally {
                setLoading(false);
            }       
        }
         // toggle feature
         const handleToggleFeature = async (featureId, currentStatus) => {
            setLoading(true);
            try {
                await api.put(`/features/${featureId}`, { enabled: !currentStatus });
                fetchData(); // Refresh dashboard data
            }
            catch (error) {
                console.error('Failed to toggle feature:', error);
                alert('Failed to toggle feature. Please try again.');
            }
            finally {
                setLoading(false);
            }       
        }

    }
    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <form onSubmit={handleCreateFeature} className="mb-6">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Feature Key"
                        value={featureKey}
                        onChange={(e) => setFeatureKey(e.target.value)}
                        className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                    <label className="flex items-center gap-2">
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
                        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Feature'}
                    </button>
                </div>
            </form>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                {features.length === 0 ? (
                    <p className="text-gray-600">No features found. Create one above!</p>
                ) : (
                    <ul className="space-y-4">
                        {features.map(feature => (
                            <li key={feature.id} className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p className="font-semibold">{feature.key}</p>
                                    <p className={`text-sm ${feature.enabled ? 'text-green-600' : 'text-red-600'}`}>
                                        {feature.enabled ? 'Enabled' : 'Disabled'}
                                    </p>
                                </  div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleFeature(feature.id, feature.enabled)}
                                        disabled={loading}
                                        className={`bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFeature(feature.id)}
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