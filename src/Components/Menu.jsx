import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateShip, generateStaff, generateStorage } from './data/generateData';

export default function Menu() {
  const navigate = useNavigate();
  const [worlds, setWorlds] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState(null);

  useEffect(() => {
    const savedWorlds = JSON.parse(localStorage.getItem('worlds')) || [];
    setWorlds(savedWorlds);
  }, []);

  const createNewWorld = () => {
    const newWorldId = Date.now();
    const newWorld = {
      id: newWorldId,
      name: `Мир ${newWorldId}`,
      createdAt: new Date().toISOString(),
      data: {
        balance: 10000,
        level: 1,
        ships: [generateShip(1)],
        staff: [generateStaff()],
        storage: [generateStorage(1)],
        orders: []
      }
    };

    const updatedWorlds = [...worlds, newWorld];
    localStorage.setItem('worlds', JSON.stringify(updatedWorlds));
    setWorlds(updatedWorlds);
    navigate(`/world/${newWorldId}`);
  };

  const deleteWorld = (worldId) => {
    const updatedWorlds = worlds.filter(world => world.id !== worldId);
    localStorage.setItem('worlds', JSON.stringify(updatedWorlds));
    setWorlds(updatedWorlds);
    if (selectedWorld?.id === worldId) setSelectedWorld(null);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Меню игры</h1>
          
          <div className="d-grid gap-2 mb-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={createNewWorld}
            >
              Создать новый мир
            </button>
          </div>

          <div className="list-group mb-4">
            {worlds.map(world => (
              <div 
                key={world.id}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  selectedWorld?.id === world.id ? 'active' : ''
                }`}
                onClick={() => setSelectedWorld(world)}
              >
                <div>
                  <h5>{world.name}</h5>
                  <small>
                    Создан: {new Date(world.createdAt).toLocaleString()}
                  </small>
                </div>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorld(world.id);
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-success btn-lg"
              onClick={() => navigate(`/world/${selectedWorld.id}`)}
              disabled={!selectedWorld}
            >
              {selectedWorld ? 'Продолжить игру' : 'Выберите мир'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}