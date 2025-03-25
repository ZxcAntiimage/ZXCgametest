import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Orders from './Orders';
import Storage from './Storage';
import Garage from './Garage';
import Staff from './Staff';
import Shop from './Shop';
import { WorldContext } from './WorldContext';

export default function World() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    world: contextWorld,
    balance, 
    setBalance, 
    level,
    setWorld,
    // setShips,
    // setStaff,
    // setStorage
  } = useContext(WorldContext);

  const [localWorld, setLocalWorld] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState('main');

  useEffect(() => {
    const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
    const foundWorld = worlds.find(w => w.id === parseInt(id));
    
    if (foundWorld) {
      setLocalWorld(foundWorld);
      // Обновляем контекст если данные в localStorage новее
      if (!contextWorld || contextWorld.id !== foundWorld.id) {
        setWorld(foundWorld);
      }
    } else {
      navigate('/');
    }
    setIsLoading(false);
  }, [id, navigate, setWorld, contextWorld]);

  const playerStatuses = ['Маленькая компания', 'Крупная компания', 'Корпорация'];
  const playerStatus = playerStatuses[level - 1] || 'Неизвестно';

  const handleCompleteOrder = (payment) => {
    const newBalance = balance + payment;
    setBalance(newBalance);
    
    const updatedWorld = {
      ...(localWorld || contextWorld),
      balance: newBalance
    };
    
    setLocalWorld(updatedWorld);
    setWorld(updatedWorld);
    
    // Сохраняем в localStorage
    const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
    localStorage.setItem('worlds', 
      JSON.stringify(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w))
    );
  };

  const renderComponent = () => {
    const currentWorld = localWorld || contextWorld;
    if (!currentWorld) return null;

    switch (activeComponent) {
      case 'storage':
        return <Storage storage={currentWorld.storage || []} />;
      case 'garage':
        return <Garage ships={currentWorld.ships || []} />;
      case 'staff':
        return <Staff staff={currentWorld.staff || []} />;
      case 'orders':
        return <Orders onCompleteOrder={handleCompleteOrder} />;
      case 'shop':
        return (
          <Shop/>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="h1">{currentWorld.name}</h1>
            <p>Добро пожаловать в мир {currentWorld.name}!</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (!localWorld && !contextWorld) {
    return (
      <div className="container text-center mt-5">
        <h2>Мир не найден</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/')}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="wrap container-fluid bs-body-color">
      <header className="container py-3 fixed-top bg-white">
        <p className="h1 display-1">Tycoon от максимки</p>
        <hr className="mt-4 h1" />
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-custom" onClick={() => navigate('/')}>
            Назад
          </button>
          <div className="balance">
            <h3>Баланс: {balance.toLocaleString()} $</h3>
            <h3>Статус: {playerStatus}</h3>
          </div>
        </div>
      </header>

      <main className="container-fluid mt-5 pt-5">
        <div className="row">
          <div className="col-md-2 border-end border-2 p-4 position-fixed start-0 vh-100 bg-light" style={{ top: '160px' }}>
            <p className="h2">Настройки</p>
            <div className="menu_btn_group d-flex flex-column">
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('main')}>
                Главная
              </button>
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('storage')}>
                Склад
              </button>
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('garage')}>
                Гараж
              </button>
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('staff')}>
                Персонал
              </button>
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('orders')}>
                Заказы
              </button>
              <button className="btn btn-custom btn-lg mb-3 mt-3" onClick={() => setActiveComponent('shop')}>
                Магазин
              </button>
            </div>
          </div>

          <div className="col-md-8 offset-md-2">
            <div className="main_body">
              {renderComponent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}