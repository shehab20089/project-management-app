import { storage } from "./storage";

export const Project = function (projectName, lists) {
  const id = Math.random().toString(36).substr(2, 9);
  function addNewList(list) {
    this.lists.push(list);
    storage.saveApp();
  }
  function removeList(listId) {
    this.lists = this.lists.filter((list) => list.id !== listId);
    storage.saveApp();
  }
  const repositionList = function (listId, newIndex) {
    const currentList = this.lists.find((list) => list.id === listId);
    this.removeList(currentList.id);
    this.lists.splice(newIndex, 0, currentList);
    storage.saveApp();
  };

  return {
    title: projectName,
    lists,
    id,
    addNewList,
    removeList,
    repositionList,
  };
};
