export const parseCSV = (content) => {
  const lines = content.split('\n');
  return lines.slice(1).map(line => {
    const [polish, turkish, phonetic, example, translation, difficulty] = line.split(',');
    return { polish, turkish, phonetic, example, translation, difficulty };
  });
};

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};