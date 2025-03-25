import React, { useContext } from 'react';
import { WorldContext } from './WorldContext';

export default function Staff() {
  const { world } = useContext(WorldContext);

  if (!world?.staff) return <div>Загрузка персонала...</div>;

  return (
    <div className="container mt-4">
      <h2>Персонал</h2>
      <div className="row">
        {world.staff.map(person => (
          <div key={person.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5>{person.name}</h5>
                <p>Зарплата: {person.salary.toLocaleString()} $</p>
                <p>{person.hired ? 'Нанят' : 'Не нанят'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}