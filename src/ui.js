import { todoEvents } from "./events";
import { Item } from "./list-item";
import Sortable from "sortablejs";
import { Project } from "./project";
import { List } from "./lists";

export const Ui = (function () {
  const drawProject = (project) => {
    const pageWrapper = document.querySelector(".main-wrapper");

    if (!project) {
      const projectWrapper = document.createElement("div");
      projectWrapper.textContent = "No Project Is Selected";
      pageWrapper.innerHTML = "";
      pageWrapper.append(projectWrapper);
      return;
    }
    if (pageWrapper?.firstChild)
      pageWrapper.removeChild(pageWrapper.firstChild);
    const { title, lists } = project;
    const projectWrapper = document.createElement("div");
    pageWrapper.append(projectWrapper);
    projectWrapper.innerHTML = /*HTML*/ `<div>  
    <h1>${title}</h1>
    <div class='lists-container'>
  
    </div>
    </div>`;
    // draw every list inside the project
    lists.forEach((list) => drawList(list));

    handleListsEvents(project);
    handleListSortable(project);
    handleAddList(project);
  };
  const handleListSortable = (project) => {
    new Sortable(document.querySelector(".lists-container"), {
      onEnd: ({ item, from, to, newIndex }) => {
        if (from === to) {
          let id = item.getAttribute("data-list");

          project.repositionList(id, newIndex);
        }
      },

      // set both lists to same group
      animation: 150,
      dataIdAttr: "data-id",
    });
  };
  const handleAddList = (project) => {
    const addListDiv = document.createElement("div");
    const newListBtnDiv = document.createElement("div");
    const newListActionElement = document.createElement("div");
    newListActionElement.classList.add("add-list-action");
    newListBtnDiv.classList.add("add-list");
    newListActionElement.classList.add("add-list-action");
    newListActionElement.innerHTML = `    
    <form>
    <div>
    <textarea type="text" required  name='title' placeholder="Enter The Title of the List" rows="3" maxlength="30"></textarea>
    <div class="actions">
    <button type="submit">Add New List</button> <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
</svg>
</div>
</form>
     `;
    newListBtnDiv.innerHTML =
      "Add New List " +
      `    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    
 </svg>`;
    addListDiv.append(newListBtnDiv);
    addListDiv.append(newListActionElement);

    document.querySelector(".lists-container").append(addListDiv);
    newListBtnDiv.onclick = (e) => {
      e.target.style.display = "none";
      newListActionElement.style.display = "block";
    };
    newListActionElement.querySelector("svg").onclick = (e) => {
      newListActionElement.style.display = "none";
      newListBtnDiv.style.display = "flex";
    };
    newListActionElement.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const textarea = e.target.querySelector("textarea");
      newListActionElement.style.display = "none";
      newListBtnDiv.style.display = "flex";
      project.addNewList(List(textarea.value));
      drawProject(project);
    };
  };
  const handleListsEvents = (project) => {
    const { lists } = project;
    // add event listeners to every list
    document.querySelectorAll(".list").forEach((list) => {
      const currentList = list.getAttribute("data-list");
      const listObject = lists.find((l) => l.id === currentList);
      if (!listObject) return;

      // listen for Adding new Card Event
      list.addEventListener("card-added", (e) => {
        const newCard = e.detail.sentData;
        listObject.addNewCard(newCard);
        list.querySelector(".item-container").innerHTML +=
          drawListItem(newCard);
      });

      // make list items sortable and draggable using sortable js
      new Sortable(list.querySelector(".item-container"), {
        onEnd: ({ item, from, to, newIndex }) => {
          if (from === to) {
            let id = item.getAttribute("data-id");

            const toListObject = lists.find(
              (l) => l.id === to.parentNode.getAttribute("data-list")
            );
            toListObject.repositionItem(id, newIndex);
          }
        },

        onAdd: ({ item, from, to, newIndex }) => {
          let id = item.getAttribute("data-id");
          const fromListObject = lists.find(
            (l) => l.id === from.parentNode.getAttribute("data-list")
          );
          const toListObject = lists.find(
            (l) => l.id === to.parentNode.getAttribute("data-list")
          );

          const currentItem = fromListObject.getItemById(id);
          fromListObject.removeItem(id);
          toListObject.insertItemAt(currentItem, newIndex);
        },
        group: "shared", // set both lists to same group
        animation: 150,
        dataIdAttr: "data-id",
      });

      // add event listeners to every add button clicked
      list.querySelector(".list-add").onclick = (e) => {
        e.target.style.display = "none";
        list.querySelector(".list-add-action").style.display = "block";
      };
      list.querySelector(".list-add-action svg").onclick = (e) => {
        list.querySelector(".list-add-action").style.display = "none";
        list.querySelector(".list-add").style.display = "flex";
      };
      list.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        const title = e.target.querySelector("textarea").value;
        e.target.querySelector("textarea").value = "";
        todoEvents.fireEvent("card-added", list, Item(title));
        list.querySelector(".list-add-action").style.display = "none";
        list.querySelector(".list-add").style.display = "flex";
      };
      list.querySelector("h2 >svg").onclick = (e) => {
        project.removeList(currentList);
        list.remove();
      };
    });
  };
  const drawList = ({ title, items, id }) => {
    const listsContainer = document.querySelector(".lists-container");

    const element = /*HTML*/ `<div class="list" data-list='${id}'>
    <h2>${title} <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
</svg></h2> 
   <div class="item-container">
   ${items.map((item) => drawListItem(item)).join("")}
    </div>
    <div class="list-add">
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
   <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
   
</svg>
Add new card
    </div>
    <div class="list-add-action">
    <form>
    <div>
    <textarea type="text" required  name='title' placeholder="Enter The Title of this card" rows="3"></textarea>
    <div class="actions">
    <button type="submit">Add Card</button> <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
</svg>
</div>
    </div>
 
 
   </div>`;
    listsContainer.innerHTML += element;
  };
  const drawListItem = ({ title, id }) => {
    return /*Html*/ `<div class="list-item" data-id="${id}" draggable="true" ondragstart="this.style.opacity = 1">${title}</div>`;
  };
  const drawSidebarProjectItem = (project, app) => {
    const projectElement = document.createElement("div");
    projectElement.setAttribute("data-id", project.id);
    projectElement.classList.add("project-item");
    projectElement.innerHTML = `${project.title} <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
</svg>`;

    if (app?.currentProject?.id === project.id)
      projectElement.classList.add("active");

    projectElement.addEventListener("click", (e) => {
      const prevActive = document.querySelector(".project-item.active");
      if (prevActive) prevActive.classList.remove("active");
      projectElement.classList.add("active");
      app.switchProject(project.id);
      drawProject(app.currentProject);
    });
    projectElement.querySelector("svg").addEventListener("click", (e) => {
      e.stopPropagation();
      app.removeProject(project);
      drawProject(app.currentProject);
      projectElement.remove();
    });
    return projectElement;
  };
  const drawProjectSideBar = (app) => {
    const { projects } = app;
    const sidebarElement = document.createElement("div");
    const header2Element = document.createElement("h3");
    const projectsContainer = document.createElement("div");
    projectsContainer.classList.add("projects-container");
    header2Element.textContent = "Projects :";
    sidebarElement.append(header2Element);
    sidebarElement.append(projectsContainer);
    sidebarElement.classList.add("sidebar");

    // convert projects into html nodes
    const projectsNodes = projects.map((project) => {
      return drawSidebarProjectItem(project, app);
    });
    projectsNodes.forEach((node) => projectsContainer.append(node));
    const addProjectAction = document.createElement("div");
    addProjectAction.innerHTML = `    <div class="list-add">
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
   <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
   
</svg>
Add new Project 
    </div>
    <div class="list-add-action">
    <form>
    <div>
    <textarea type="text" required  name='title' placeholder="Enter The Title of the project" rows="3" maxlength="30"></textarea>
    <div class="actions">
    <button type="submit">Add Project</button> <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
</svg>
</div>
</form>
    </div>
 `;
    sidebarElement.append(addProjectAction);

    const addElement = sidebarElement.querySelector(".sidebar .list-add");
    const closeIcon = sidebarElement.querySelector(
      ".sidebar .list-add-action svg"
    );

    addElement.addEventListener("click", (e) => {
      addElement.style.display = "none";
      sidebarElement.querySelector(".sidebar .list-add-action").style.display =
        "block";
    });
    closeIcon.addEventListener("click", (e) => {
      addElement.style.display = "flex";
      sidebarElement.querySelector(".sidebar .list-add-action").style.display =
        "none";
    });
    sidebarElement.querySelector(".sidebar form").onsubmit = (e) => {
      e.preventDefault();
      const projectTitle = e.target.querySelector("textarea").value;
      e.target.querySelector("textarea").value = "";
      const newProject = Project(projectTitle, [
        List("Todo"),
        List("In Progress"),
        List("Done"),
      ]);
      app.addProject(newProject);
      document
        .querySelector(".projects-container  ")
        .append(drawSidebarProjectItem(newProject, app));
      addElement.style.display = "flex";
      sidebarElement.querySelector(".sidebar .list-add-action").style.display =
        "none";
    };
    return sidebarElement;
  };
  const header = () => {
    const headerElement = document.createElement("div");
    headerElement.classList.add("header");
    const headerTitle = document.createElement("h2");
    headerTitle.textContent = "MyTodo";
    headerElement.append(headerTitle);
    return headerElement;
  };

  const initializePageUi = (app) => {
    const pageWrapper = document.createElement("div");
    pageWrapper.setAttribute("id", "content");
    document.body.appendChild(pageWrapper);
    const mainWrapper = document.createElement("div");
    mainWrapper.classList.add("main-wrapper");

    pageWrapper.appendChild(header());
    pageWrapper.appendChild(drawProjectSideBar(app));
    pageWrapper.appendChild(mainWrapper);
    drawProject(app.currentProject);
  };
  return { initializePageUi, drawProject };
})();
