import { storage } from "./storage";

export const List = function (listName, listItems = []) {
  const id = Math.random().toString(36).substr(2, 9);

  const addNewCard = function (card) {
    this.items.push(card);
    storage.saveApp();
  };
  const repositionItem = function (itemId, newIndex) {
    const currentItem = this.items.find((item) => item.id === itemId);
    this.removeItem(itemId);
    this.items.splice(newIndex, 0, currentItem);
    storage.saveApp();
  };
  const insertItemAt = function (item, index) {
    this.items.splice(index, 0, item);
    storage.saveApp();
  };
  const getItemById = function (id) {
    const currentItem = this.items.find((item) => item.id === id);
    return currentItem;
  };
  const removeItem = function (id) {
    this.items = this.items.filter((item) => item.id !== id);
    storage.saveApp();
  };
  return {
    title: listName,
    items: listItems,
    id,
    addNewCard,
    repositionItem,
    insertItemAt,
    removeItem,
    getItemById,
  };
};
