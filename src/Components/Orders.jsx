import React, { useState, useEffect, useContext, useCallback } from 'react';
import { WorldContext } from './WorldContext';
import { faker } from '@faker-js/faker';

export default function Orders({ onCompleteOrder }) {
  // 1. Получаем контекст
  const worldContext = useContext(WorldContext);

  // 2. Все состояния объявляем в начале
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [isOrderInProgress, setIsOrderInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [orders, setOrders] = useState([]);

  // 3. Генератор заказов
  const generateRandomOrder = useCallback(() => ({
    id: faker.string.uuid(),
    level: faker.helpers.arrayElement(['Простой', 'Продвинутый', 'Эксперт']),
    from: {
      country: faker.helpers.arrayElement(['USA', 'China', 'Japan', 'Germany', 'Russia', 'Brazil']),
      flag: faker.helpers.arrayElement(['🇺🇸', '🇨🇳', '🇯🇵', '🇩🇪', '🇷🇺', '🇧🇷']),
    },
    to: {
      country: faker.helpers.arrayElement(['USA', 'China', 'Japan', 'Germany', 'Russia', 'Brazil']),
      flag: faker.helpers.arrayElement(['🇺🇸', '🇨🇳', '🇯🇵', '🇩🇪', '🇷🇺', '🇧🇷']),
    },
    cargo: faker.helpers.arrayElement(['Автомобили', 'Электроника', 'Техника', 'Продукты', 'Одежда']),
    payment: faker.number.int({ 
      min: 1000 * (worldContext?.level || 1), 
      max: 10000 * (worldContext?.level || 1) 
    }),
    image: 'https://via.placeholder.com/150',
    requiredStaff: faker.number.int({ min: 1, max: 5 }),
  }), [worldContext?.level]);

  // 4. Объединенный эффект
  useEffect(() => {
    // Часть для загрузки заказов
    if (worldContext) {
      setOrders(Array.from({ length: 3 }, generateRandomOrder));
    }

    // Часть для выполнения заказа
    if (isOrderInProgress) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCompleteOrder();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    // Часть для обновления прогресса
    if (selectedOrder) {
      const totalTime = getOrderTime(selectedOrder.level);
      setProgress(((totalTime - timeRemaining) / totalTime) * 100);
    }
  }, [worldContext, generateRandomOrder, isOrderInProgress, timeRemaining, selectedOrder]);

  // 5. Проверка контекста
  if (!worldContext) {
    return <div className="alert alert-danger">Ошибка загрузки данных мира</div>;
  }

  // 6. Получаем данные из контекста
  const { 
    level: currentLevel,
    ships,
    staff,
    storage,
    setBalance,
    setLevel,
    setShips,
    setStaff,
    setStorage
  } = worldContext;

  // 7. Вспомогательные функции
  const updateShipStatus = (shipId, purchased) => {
    setShips(prev => prev.map(ship => 
      ship.id === shipId ? { ...ship, purchased } : ship
    ));
  };

  const updateStaffStatus = (staffId, hired) => {
    setStaff(prev => prev.map(person => 
      person.id === staffId ? { ...person, hired } : person
    ));
  };

  const updateStorageStatus = (storageId, purchased) => {
    setStorage(prev => prev.map(store => 
      store.id === storageId ? { ...store, purchased } : store
    ));
  };

  const isPurchased = (items, id) => 
    items.some(item => String(item.id) === String(id) && item.purchased);

  const isHired = (staffId) => 
    staff.some(person => String(person.id) === String(staffId) && person.hired);

  const getOrderTime = (level) => 
    ({ 'Простой': 300, 'Продвинутый': 600, 'Эксперт': 900 }[level] || 600);

  // 8. Обработчики событий
  const handleStartOrder = () => {
    if (!selectedOrder) return;

    const isValid = {
      ship: selectedShip && isPurchased(ships, selectedShip),
      staff: selectedStaff.length >= selectedOrder.requiredStaff && 
             selectedStaff.every(isHired),
      storage: selectedStorage && isPurchased(storage, selectedStorage)
    };

    if (Object.values(isValid).every(Boolean)) {
      setIsOrderInProgress(true);
      setTimeRemaining(getOrderTime(selectedOrder.level));
      
      updateShipStatus(selectedShip, false);
      selectedStaff.forEach(id => updateStaffStatus(id, false));
      updateStorageStatus(selectedStorage, false);
    } else {
      alert(`Не выполнены условия:
        ${!isValid.ship ? '\n- Корабль не выбран или не куплен' : ''}
        ${!isValid.staff ? `\n- Недостаточно персонала (${selectedStaff.length}/${selectedOrder.requiredStaff})` : ''}
        ${!isValid.storage ? '\n- Склад не выбран или не куплен' : ''}
      `);
    }
  };

  const handleCompleteOrder = () => {
    setIsOrderInProgress(false);
    onCompleteOrder(selectedOrder.payment);
    
    updateShipStatus(selectedShip, true);
    selectedStaff.forEach(id => updateStaffStatus(id, true));
    updateStorageStatus(selectedStorage, true);

    const totalSalary = selectedStaff.reduce((sum, id) => {
      const person = staff.find(p => String(p.id) === String(id));
      return sum + (person?.salary || 0) * (1 + currentLevel * 0.1);
    }, 0);

    setBalance(prev => prev - totalSalary);
    setLevel(prev => prev + 1);
    
    setSelectedOrder(null);
    setSelectedShip(null);
    setSelectedStaff([]);
    setSelectedStorage(null);
    setProgress(0);
  };

  // 9. Рендер компонента
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Доступные заказы</h2>
      
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        {orders.map(order => (
          <div key={order.id} className="col">
            <div className="card h-100">
              <img src={order.image} className="card-img-top" alt="Заказ" />
              <div className="card-body">
                <h5 className="card-title">Заказ #{order.id.slice(0, 6)}</h5>
                <p className="card-text">
                  <span className="fs-4">{order.from.flag}</span> {order.from.country} → 
                  <span className="fs-4">{order.to.flag}</span> {order.to.country}
                </p>
                <p>Груз: {order.cargo}</p>
                <p>Оплата: ${order.payment.toLocaleString()}</p>
                <p>Уровень: {order.level}</p>
                <p>Требуется персонала: {order.requiredStaff}</p>
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => setSelectedOrder(order)}
                >
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Выбор ресурсов для заказа</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                />
              </div>
              
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Корабли (доступно: {ships.filter(s => s.purchased).length})</label>
                  <select
                    className="form-select"
                    value={selectedShip || ''}
                    onChange={(e) => setSelectedShip(e.target.value)}
                  >
                    <option value="">Выберите корабль</option>
                    {ships
                      .filter(ship => ship.purchased)
                      .map(ship => (
                        <option key={ship.id} value={ship.id}>
                          {ship.name} (${ship.price.toLocaleString()})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Персонал (нанято: {staff.filter(s => s.hired).length}, требуется: {selectedOrder.requiredStaff})
                  </label>
                  <select
                    className="form-select"
                    multiple
                    size={5}
                    value={selectedStaff}
                    onChange={(e) => 
                      setSelectedStaff(
                        Array.from(e.target.selectedOptions, o => o.value)
                      )
                    }
                  >
                    {staff
                      .filter(person => person.hired)
                      .map(person => (
                        <option key={person.id} value={person.id}>
                          {person.name} (${person.salary.toLocaleString()})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Склады (доступно: {storage.filter(s => s.purchased).length})</label>
                  <select
                    className="form-select"
                    value={selectedStorage || ''}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                  >
                    <option value="">Выберите склад</option>
                    {storage
                      .filter(store => store.purchased)
                      .map(store => (
                        <option key={store.id} value={store.id}>
                          {store.name} (Вместимость: {store.capacity})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Отмена
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleStartOrder}
                >
                  Начать заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOrderInProgress && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Выполнение заказа</h5>
            <div className="progress mb-2">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${progress}%` }}
              >
                {progress.toFixed(1)}%
              </div>
            </div>
            <p className="card-text">
              Осталось: {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}