import { faker } from '@faker-js/faker';

// Генерация случайной цены в пределах максимальной суммы
const generateRandomPrice = (maxPrice) => faker.number.int({ min: 1000, max: maxPrice });

// Генерация корабля
export const generateShip = (level) => ({
    id: faker.string.uuid(),
    name: faker.vehicle.vehicle(),
    price: generateRandomPrice(4000),
    speed: faker.number.int({ min: 50, max: 100 }) * level,
    purchased: false,
});

// Генерация сотрудника
export const generateStaff = () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    salary: generateRandomPrice(3000),
    hired: false,
});

// Генерация склада
export const generateStorage = (level) => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    capacity: faker.number.int({ min: 5, max: 15 }) * level,
    price: generateRandomPrice(2000),
    purchased: false,
});

// Генерация товаров магазина
const generateShopItems = () => [{
        id: 1,
        name: "Грузовик",
        type: "ship",
        price: 5000,
        levelRequired: 1
    },
    {
        id: 2,
        name: "Склад",
        type: "storage",
        price: 3000,
        levelRequired: 1
    }
];

// Генерация начальных данных мира
export const generateInitialWorldData = () => ({
    balance: 10000,
    level: 1,
    ships: [generateShip(1)],
    staff: [generateStaff()],
    storage: [generateStorage(1)],
    shopItems: generateShopItems(),
    // Другие данные мира...
});