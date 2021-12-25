import { ANDGate, NOTGate, MyGate, prepareGate } from "./Gate.js";
import { InputsElement } from "./InputsElement.js";
import { nInputsElement } from "./nInputsElement.js";
import { nOutputsElement } from "./nOutputsElement.js";
import { OutputsElement } from "./OutputsElement.js";
import { gates, presetsGates } from "../main.js";

let projects = [];
let savedGates = [];
let savedPresetsGates = [];
let projectIndex = 0;

export function loadSave() {
    const loadedProjects = getFromLocalStorage("projects");
    if(loadedProjects) {
        projects = [ ...loadedProjects ];
        const project = loadedProjects[projectIndex];
        if(project) {
            if(project.gates) {
                savedGates = [ ...project.gates ];
                addGates(savedGates);
            }
            if(project.presetsGates) {
                savedPresetsGates = [ ...project.presetsGates ];
                savedPresetsGates.forEach((obj) => {
                    presetsGates.push(new MyGate(presetsGates.length, obj.amountOfInputs, obj.amountOfOutputs, obj.functionString, obj.outputsArray, obj.name, obj.color, obj.makeStringArr, obj.stringIndexArr));
                });
            }
        }
        
    }

}

function addGates(loadGates) {
    loadGates.forEach((gate) => {
        const type = gate.type;
        if(type) {
            let obj;
            switch(type) {
                case "ANDGate": 
                    obj = new ANDGate();
                    break;
                case "NOTGate":
                    obj = new NOTGate();
                    break;
                case "OutputsElement":
                    obj = new OutputsElement(1);
                    break;
                case "InputsElement":
                    obj = new InputsElement(1);
                    break;
                case "nOutputsElement":
                    obj = new nOutputsElement(gate.n);
                    break;
                case "nInputsElement":
                    obj = new nInputsElement(gate.n);
                    break;
                case "MyGate":
                    obj = new MyGate(undefined, gate.amountOfInputs, gate.amountOfOutputs, gate.functionString, gate.outputsArray, gate.name, gate.color, gate.makeStringArr, gate.stringIndexArr);
            }
            obj.element.style.top = gate.position.top;
            obj.element.style.left = gate.position.left;
            prepareGate(obj);
            gates[parseInt(obj.id)] = obj;
        }
        
    });
}

export function saveGate(gate) {
    const obj = {};
    const el = gate.element;
    if(gate instanceof ANDGate) {
        obj.type = "ANDGate";
    }else if(gate instanceof NOTGate) {
        obj.type = "NOTGate";
    }else if(gate instanceof OutputsElement) {
        obj.type = "OutputsElement";
    }else if(gate instanceof InputsElement) {
        obj.type = "InputsElement";
    }else if(gate instanceof nOutputsElement) {
        obj.type = "nOutputsElement";
        obj.n = gate.n;
    }else if(gate instanceof nInputsElement) {
        obj.type = "nInputsElement";
        obj.n = gate.n;
    }else if(gate instanceof MyGate) {
        obj.type = "MyGate";
        obj.amountOfInputs = gate.amountOfInputs;
        obj.amountOfOutputs = gate.amountOfOutputs;
        obj.functionString = gate.functionString;
        obj.outputsArray = gate.outputsArray;
        obj.name = gate.name;
        obj.color = gate.color;
        obj.makeStringArr = gate.makeStringArr;
        obj.stringIndexArr = gate.stringIndexArr;
    }
    obj.position = {};
    obj.position.top = el.style.top;
    obj.position.left = el.style.left;
    savedGates.push(obj);
    if(obj.type === "nOutputsElement" || obj.type === "nInputsElement") {
        for(let i = 0; i < obj.n; i++) {
            savedGates.push({});
        }
    }
    saveToLocalStorage();
}

function saveToLocalStorage() {
    const project = {};
    project.gates = savedGates;
    project.presetsGates = savedPresetsGates;
    projects[projectIndex] = project;
    const string = JSON.stringify(projects);
    localStorage.setItem("projects", string);
}

function getFromLocalStorage(key) {
    const string = localStorage.getItem(key);
    return JSON.parse(string);
}

export function updateGatePosition(gateId) {
    savedGates[gateId].position.top = gates[gateId].element.style.top;
    savedGates[gateId].position.left = gates[gateId].element.style.left;
    saveToLocalStorage();
}

export function savePresetsGate(gate) {
    const obj = {};
    obj.amountOfInputs = gate.amountOfInputs;
    obj.amountOfOutputs = gate.amountOfOutputs;
    obj.functionString = gate.functionString;
    obj.outputsArray = gate.outputsArray;
    obj.name = gate.name;
    obj.color = gate.color;
    obj.makeStringArr = gate.makeStringArr;
    obj.stringIndexArr = gate.stringIndexArr;
    savedPresetsGates.push(obj);
    saveToLocalStorage();
}