export const saveData = (data) => {
  localStorage.setItem("carboneForm", JSON.stringify(data));
};

export const loadData = () => {
  const saved = localStorage.getItem("carboneForm");
  return saved ? JSON.parse(saved) : {};
};
