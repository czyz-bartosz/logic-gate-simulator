const projectList = document.querySelector("#projects-list");
const createProjectBtn = document.querySelector("#create-project");
const openCreateProjectMenu = document.querySelector("#open-create-project-menu");
const createProjectMenu = document.querySelector(".create-project-menu")
import { start } from "../main.js";
import { deleteProject, projects, setProjectIndex } from "./save.js"

class Project {
    con;
    nameEl;
    buttonCon;
    openProjectButton;
    deleteProjectButton;
    constructor(id, name="My project") {
        this.name = name;
        this.createElement();
        this.id = id;
    }
    createElement() {
        this.con = document.createElement("div");
        this.con.classList.add("project-con");
        this.nameEl = document.createElement("h2");
        this.nameEl.textContent = this.name;
        this.con.appendChild(this.nameEl);
        this.buttonCon = document.createElement("div");
        this.buttonCon.classList.add("project-button-con");
        this.openProjectButton = document.createElement("button");
        this.openProjectButton.addEventListener('click', this.openProject);
        this.openProjectButton.textContent = "open";
        this.openProjectButton.classList.add("open-project");
        this.deleteProjectButton = document.createElement("button");
        this.deleteProjectButton.addEventListener('click', this.deleteProject);
        this.deleteProjectButton.textContent = "delete";
        this.deleteProjectButton.classList.add("delete-project");
        this.buttonCon.appendChild(this.openProjectButton);
        this.buttonCon.appendChild(this.deleteProjectButton);
        this.con.appendChild(this.buttonCon);
        projectList.appendChild(this.con);
    }
    openProject = () => {
        console.log(this.id);
        setProjectIndex(this.id);
        start();
    }
    deleteProject = () => {
        deleteProject(this.id);
    }
}

export function showProjects() {
    projects.forEach( (obj, id) => {
        new Project(id);
    });
}

openCreateProjectMenu.addEventListener('click', () => {
    createProjectMenu.style.display = 'flex';
});

createProjectBtn.addEventListener('click', () => {
    console.log('a');
    const newProjectIndex = projects.length;
    setProjectIndex(newProjectIndex);
    start();
});