import React, { useContext } from 'react';
import { WorldContext } from './WorldContext';

export default function Shop() {
  const {
    world,
    balance,
    setBalance,
    level,
    setWorld
  } = useContext(WorldContext);

  // Статусы игрока
  const playerStatuses = ['Маленькая компания', 'Крупная компания', 'Корпорация'];
  const playerStatus = playerStatuses[level - 1] || 'Неизвестно';

  // Проверка наличия данных
  if (!world) {
    return <div className="container mt-4">Загрузка данных магазина...</div>;
  }

  const { ships = [], staff = [], storage = [] } = world;

  // Общая функция для покупки
  const handlePurchase = (type, item) => {
    if (balance >= item.price) {
      const updatedWorld = {
        ...world,
        [type]: world[type].map(i => 
          i.id === item.id ? { ...i, purchased: true } : i
        ),
        balance: balance - item.price
      };
      
      setWorld(updatedWorld);
      setBalance(updatedWorld.balance);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Магазин</h2>
          <div className="status">
            <h3>Статус: {playerStatus}</h3>
            <h4>Баланс: {balance.toLocaleString()} $</h4>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Корабли */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3>Корабли</h3></div>
            <div className="card-body">
              {ships.filter(ship => !ship.purchased).map(ship => (
                <div key={ship.id} className="card mb-3">
                  <div className="card-body">
                    <h5>{ship.name}</h5>
                    <p>Цена: {ship.price.toLocaleString()} $</p>
                    <p>Скорость: {ship.speed} км/ч</p>
                    <button
                      className={`btn btn-${balance >= ship.price ? 'primary' : 'secondary'}`}
                      onClick={() => handlePurchase('ships', ship)}
                      disabled={balance < ship.price}
                    >
                      Купить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Персонал */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3>Персонал</h3></div>
            <div className="card-body">
              {staff.filter(person => !person.hired).map(person => (
                <div key={person.id} className="card mb-3">
                  <div className="card-body">
                    <h5>{person.name}</h5>
                    <p>Зарплата: {person.salary.toLocaleString()} $</p>
                    <button
                      className={`btn btn-${balance >= person.salary ? 'primary' : 'secondary'}`}
                      onClick={() => handlePurchase('staff', { ...person, purchased: true })}
                      disabled={balance < person.salary}
                    >
                      Нанять
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Склады */}
        <div className="col-md-12 mt-4">
          <div className="card">
            <div className="card-header"><h3>Склады</h3></div>
            <div className="card-body">
              <div className="row">
                {storage.filter(store => !store.purchased).map(store => (
                  <div key={store.id} className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5>{store.name}</h5>
                        <p>Цена: {store.price.toLocaleString()} $</p>
                        <p>Вместимость: {store.capacity}</p>
                        <button
                          className={`btn btn-${balance >= store.price ? 'primary' : 'secondary'}`}
                          onClick={() => handlePurchase('storage', store)}
                          disabled={balance < store.price}
                        >
                          Купить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}