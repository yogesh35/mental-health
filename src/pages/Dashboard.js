import React from 'react';
import { useUser } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const photos = [
    {
      id: 1,
      title: "Golden Hour Mountain",
      photographer: "Alex Chen",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "A breathtaking mountain landscape during golden hour"
    },
    {
      id: 2,
      title: "Ocean Serenity",
      photographer: "Maria Rodriguez",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Peaceful ocean waves meeting the sandy shore"
    },
    {
      id: 3,
      title: "City Lights",
      photographer: "David Kim",
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Urban skyline illuminated at night"
    },
    {
      id: 4,
      title: "Forest Path",
      photographer: "Sarah Johnson",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "A misty forest trail leading into the unknown"
    },
    {
      id: 5,
      title: "Desert Sunset",
      photographer: "Michael Brown",
      url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Sand dunes painted with warm sunset colors"
    },
    {
      id: 6,
      title: "Winter Wonderland",
      photographer: "Emma Wilson",
      url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Snow-covered trees in a winter landscape"
    },
    {
      id: 7,
      title: "Lake Reflection",
      photographer: "James Taylor",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Perfect mountain reflection in a calm lake"
    },
    {
      id: 8,
      title: "Flower Garden",
      photographer: "Lisa Anderson",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Colorful wildflowers in a meadow"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Photo Gallery Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.name || user?.email || 'User'}! Explore our curated collection of stunning photographs.
            </p>
          </div>
          <button
            onClick={() => navigate('/user')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            View Users
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {photo.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                by {photo.photographer}
              </p>
              <p className="text-sm text-gray-600">
                {photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <span>Showing {photos.length} photos</span>
          <span>•</span>
          <button className="text-blue-500 hover:text-blue-600">Load more</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
