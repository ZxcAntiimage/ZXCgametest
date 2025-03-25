import React, { useContext } from 'react';
import { WorldContext } from './WorldContext';
export default function Garage() {
    const { ships } = useContext(WorldContext);

  // Фильтруем корабли, которые были куплены
  const purchasedShips = ships.filter((ship) => ship.purchased);
  return (
    <div className="container mt-4">
      <h2>Купленные корабли</h2>
      {purchasedShips.length > 0 ? (
        purchasedShips.map((ship) => (
          <div key={ship.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{ship.name}</h5>
              <p className="card-text">Скорость: {ship.speed} км/ч</p>
            </div>
          </div>
        ))
      ) : (
        <p>Нет купленных кораблей.</p>
      )}
    </div>
  );
}