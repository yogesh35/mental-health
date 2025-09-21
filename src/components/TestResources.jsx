import React, { useState, useEffect } from 'react';

const TestResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const testAPI = async () => {
            try {
                setLoading(true);
                console.log('Testing API call to:', 'http://localhost:5000/api/resources');
                
                const response = await fetch('http://localhost:5000/api/resources');
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API Response:', data);
                
                if (data.success && data.data && data.data.resources && Array.isArray(data.data.resources)) {
                    setResources(data.data.resources);
                    setError(null);
                } else if (data.success && data.data && Array.isArray(data.data)) {
                    setResources(data.data);
                    setError(null);
                } else {
                    console.log('API response not in expected format:', data);
                    setResources([]);
                    setError('Invalid data format received from API');
                }
                
            } catch (err) {
                console.error('API Error:', err);
                setError(err.message);
                setResources([]); // Ensure resources is always an array
            } finally {
                setLoading(false);
            }
        };

        testAPI();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Mental Health Resources</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Mental Health Resources</h1>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-md mx-auto">
                        <h3 className="font-semibold mb-2">Error Loading Resources</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Mental Health Resources</h1>
                <p className="text-gray-600 text-center mb-8">Discover helpful resources to support your mental wellness journey</p>
                
                {resources.length === 0 ? (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-center max-w-md mx-auto">
                        <h3 className="font-semibold mb-2">No Resources Found</h3>
                        <p>The database appears to be empty. Please check if the sample data has been loaded.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(resources) && resources.map((resource, index) => (
                            <div
                                key={resource.id || index}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                            >
                                <div className="mb-4">
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                                        style={{
                                            backgroundColor: resource.category_color || '#6366f1',
                                            color: 'white'
                                        }}
                                    >
                                        {resource.category_name || resource.categoryName || 'General'}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {resource.description}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    {resource.url && (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                                        >
                                            View Resource
                                        </a>
                                    )}
                                    
                                    <div className="text-xs text-gray-500 mt-3 space-y-1">
                                        <div>Type: {resource.type || 'Article'}</div>
                                        <div>Duration: {resource.duration || 'N/A'}</div>
                                        {resource.author && <div>Author: {resource.author}</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>Loaded {resources.length} resources from the database</p>
                </div>
            </div>
        </div>
    );
};

export default TestResources;