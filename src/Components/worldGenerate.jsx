import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateInitialWorldData } from './generateData';

export default function WorldGenerate() {
  const [worldName, setWorldName] = useState('');
  const navigate = useNavigate();

  const handleGenerateWorld = () => {
    const worldId = Date.now();
    const newWorld = {
      id: worldId,
      name: worldName.trim() || `Мир ${worldId}`,
      ...generateInitialWorldData(),
      createdAt: new Date().toISOString()
    };

    const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
    localStorage.setItem('worlds', JSON.stringify([...worlds, newWorld]));
    navigate(`/world/${worldId}`);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2>Создать новый мир</h2>
          <input
            type="text"
            className="form-control mb-3"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
            placeholder="Название мира"
          />
          <button 
            className="btn btn-primary"
            onClick={handleGenerateWorld}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}