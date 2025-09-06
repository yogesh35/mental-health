import React from 'react';
import { useUser } from '@descope/react-sdk';
import Header from './Header';

// Sample photo data - in a real app, this would come from an API
const samplePhotos = [
  {
    id: 1,
    title: "Sunset at the Beach",
    description: "Beautiful sunset captured at the coast",
    url: "https://via.placeholder.com/300x200/ff7675/ffffff?text=Sunset+Beach",
    uploadedBy: "User123",
    uploadDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Mountain Landscape",
    description: "Breathtaking mountain view",
    url: "https://via.placeholder.com/300x200/74b9ff/ffffff?text=Mountain+View",
    uploadedBy: "PhotoLover",
    uploadDate: "2024-01-14"
  },
  {
    id: 3,
    title: "City Skyline",
    description: "Urban architecture at night",
    url: "https://via.placeholder.com/300x200/00b894/ffffff?text=City+Skyline",
    uploadedBy: "CityExplorer",
    uploadDate: "2024-01-13"
  },
  {
    id: 4,
    title: "Forest Path",
    description: "Peaceful walk through the woods",
    url: "https://via.placeholder.com/300x200/00cec9/ffffff?text=Forest+Path",
    uploadedBy: "NatureLover",
    uploadDate: "2024-01-12"
  },
  {
    id: 5,
    title: "Ocean Waves",
    description: "Powerful waves crashing on rocks",
    url: "https://via.placeholder.com/300x200/6c5ce7/ffffff?text=Ocean+Waves",
    uploadedBy: "SeaPhotographer",
    uploadDate: "2024-01-11"
  },
  {
    id: 6,
    title: "Desert Dunes",
    description: "Golden sand dunes at sunrise",
    url: "https://via.placeholder.com/300x200/fdcb6e/ffffff?text=Desert+Dunes",
    uploadedBy: "DesertWanderer",
    uploadDate: "2024-01-10"
  }
];

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard">
      <Header />
      
      <div className="welcome-section">
        <h2>Welcome back, {user?.name || user?.email || 'User'}!</h2>
        <p>Explore and share beautiful moments with our photo gallery community.</p>
      </div>

      <div className="photo-gallery">
        {samplePhotos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img src={photo.url} alt={photo.title} />
            <div className="photo-info">
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
              <small>By {photo.uploadedBy} on {photo.uploadDate}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
