export const getWorldById = (id) => {
  const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
  return worlds.find(w => w.id === parseInt(id));
};

export const saveWorld = (world) => {
  const worlds = JSON.parse(localStorage.getItem('worlds')) || [];
  const index = worlds.findIndex(w => w.id === world.id);
  
  if (index >= 0) {
    worlds[index] = world;
  } else {
    worlds.push(world);
  }
  
  localStorage.setItem('worlds', JSON.stringify(worlds));
};