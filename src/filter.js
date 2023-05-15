export const filterByName = (name) => (arr) => {
  if (name === "all") {
    return arr;
  }
  return arr.filter((el) => el.label === name);
};

export const filterByDate = (date) => (arr) => {
  if (date === "all") {
    return arr;
  }
  return arr.map((v) => {
    return { ...v, data: v.data.filter((el) => el.key === date) };
  });
};
