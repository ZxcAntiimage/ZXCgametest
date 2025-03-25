import React, { useContext } from 'react';
import { WorldContext } from './WorldContext';

export default function Storage() {
  const { world } = useContext(WorldContext);

  // Проверка наличия данных
  if (!world?.storage) {
    return <div className="container mt-4">Загрузка данных склада...</div>;
  }

  // Получаем только купленные склады
  const purchasedStorage = world.storage.filter(item => item.purchased);

  return (
    <div className="container mt-4">
      <h2>Склад</h2>
      {purchasedStorage.length > 0 ? (
        <div className="row">
          {purchasedStorage.map(item => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p>Вместимость: {item.capacity}</p>
                  <p>Уровень: {item.levelRequired || 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">На складе пока нет товаров</div>
      )}
    </div>
  );
}