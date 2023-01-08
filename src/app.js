import { storage } from "./storage";

export const App = function (projects = [], currentProject) {
  const addProject = function (project) {
    this.projects.push(project);
    storage.saveApp();
  };
  const removeProject = function (project) {
    this.projects = this.projects.filter((item) => item.id !== project.id);
    if (project === this.currentProject) {
      this.currentProject = undefined;
    }
    storage.saveApp();
  };
  const switchProject = function (projectId) {
    this.currentProject = this.projects.find((proj) => proj.id === projectId);
    storage.saveApp();
  };

  return {
    projects,
    addProject,
    removeProject,
    switchProject,
    currentProject: currentProject ? currentProject : projects[0],
  };
};
