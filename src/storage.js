import { App } from "./app";
import { Item } from "./list-item";
import { List } from "./lists";
import { Project } from "./project";

export const storage = {
  currentApp: {},
  saveApp() {
    localStorage.setItem(`todo-app`, JSON.stringify(this.currentApp));
  },
  getApp() {
    let TodoApp = JSON.parse(localStorage.getItem(`todo-app`));
    if (!TodoApp) {
      const lists = [List("Todo", []), List("Inprogress", []), List("Done")];
      const project = Project("Example Project", lists);
      const app = App([project]);
      console.log(JSON.stringify(app));

      localStorage.setItem(
        `todo-app`,
        JSON.stringify(app, function (key, value) {
          if (typeof value === "function") {
            return value.toString();
          }
          return value;
        })
      );
      this.currentApp = app;
      return app;
    }

    // parse the stored data into an projects array
    const projects = TodoApp.projects.map((project) => {
      return Project(
        project.title,
        project.lists.map((list) => {
          return List(
            list.title,
            list.items.map((item) => {
              return Item(item.title);
            })
          );
        })
      );
    });
    const storedApp = App(projects);
    this.currentApp = storedApp;

    return storedApp;
  },
};
