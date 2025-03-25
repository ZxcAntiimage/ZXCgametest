import React, { createContext, useState, useEffect } from 'react';

export const WorldContext = createContext();

export function WorldProvider({ children, worldId }) {
  const [world, setWorld] = useState({ storage: []});
  const [balance, setBalance] = useState(10000);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
    const foundWorld = worlds.find(w => w.id === parseInt(worldId));
    
    if (foundWorld) {
      setWorld(foundWorld);
      setBalance(foundWorld.balance);
      setLevel(foundWorld.level);
    }
  }, [worldId]);

  const updateWorld = (updater) => {
    setWorld(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
      localStorage.setItem('worlds', 
        JSON.stringify(worlds.map(w => w.id === updated.id ? updated : w))
      );
      return updated;
    });
  };

  return (
    <WorldContext.Provider value={{
      world,
      setWorld: updateWorld,
      balance,
      setBalance,
      level,
      setLevel
    }}>
      {children}
    </WorldContext.Provider>
  );
}