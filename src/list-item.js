export const Item = function (title, description, date) {
  const id = Math.random().toString(36).substr(2, 9);
  return { id, title: title, description: description, dueDate: date };
};
