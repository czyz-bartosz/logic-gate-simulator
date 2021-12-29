import { NOTGate, ANDGate, MyGate, prepareGate } from "./modules/Gate.js";
import { Wire } from "./modules/Wire.js";
import { OutputsElement } from "./modules/OutputsElement.js";
import { InputsElement } from "./modules/InputsElement.js";
import { nOutputsElement } from "./modules/nOutputsElement.js";
import { nInputsElement } from "./modules/nInputsElement.js";
import { editSavedPresetsGate, getWorkAreaGates, getWorkAreaWires, loadSave, saveGate, saveMode, savePresetsGate, saveToLocalStorage, saveWire, updateGatePosition } from "./modules/save.js";
export { gates, wires, workArea, presetsGates, selectElement, hideSVG, makeConnection, enterToEditMode, isEditMode, editGateId, changeMode };

const workArea = document.querySelector("#work-area");
const gatesToolbox = document.querySelector("footer");
const createGateMenuButton = document.querySelector("#create-gate-menu-button");
const createGateButton = document.querySelector("#create-gate-button");
const createBlockMenu = document.querySelector("#create-block-menu");
const deleteButton = document.querySelector("#delete-button");
const presetsGates = [];
const gates = [];
const wires = [];
const outputsSet = new Set();
let selectedOutput;
let selectedInput;
let selectedElement;
let editGateId;
let isEditMode = false;

function changeMode() {
    if(isEditMode) {
        isEditMode = false;
    }else {
        isEditMode = true;
    }
}

function enterToEditMode(id) {
    isEditMode = true;
    presetsGates[id].element.classList.add("edit");
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach(el => {
        el.style.display = "none";
    });
    createGateMenuButton.textContent = "edit gate";
    createGateButton.textContent = "edit gate";
    editGateId = id;
    saveMode();
}

function exitFromEditMode() {
    isEditMode = false;
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach(el => {
        el.style.display = "block";
    });
    createGateMenuButton.textContent = "create gate";
    createGateButton.textContent = "create gate";
    saveToLocalStorage();
}

function unselectElement() {
    selectedElement?.classList.remove("selected");
    selectedElement = null;
}

function selectElement(element) {
    if(selectedElement === element) {
        return;
    }
    selectedElement?.classList.remove("selected");
    selectedElement = element;
}

function hideSVG() {
    const wiresArr = document.querySelectorAll("svg");
    wiresArr.forEach((el) => {
        el.classList.add("hide");
    });
}
function showSVG() {
    const wiresArr = document.querySelectorAll("svg");
    wiresArr.forEach((el) => {
        el.classList.remove("hide");
    });
}

workArea.addEventListener("click", () => {
    unselectElement();
})

function makeConnection(el) {
    if(el.classList.contains("output")) {
        selectedOutput = el;
    }else {
        const gateId = el.id.split("-")[1];
        const inputId = el.id.split("-")[0];
        const wire = gates[gateId].inputs[inputId].wire;
        if(wire === undefined) {
            selectedInput = el;
        }
    }
    const outputGate = selectedOutput?.id.split("-")[1];
    const inputGate = selectedInput?.id.split("-")[1];
    if(selectedInput && selectedOutput && outputGate !== inputGate) {
        const wireIndex = wires.push(new Wire(selectedOutput, selectedInput)) - 1;
        saveWire(selectedOutput, selectedInput, wireIndex);
        selectedOutput = selectedInput = null;
    }
}

function makePresetsGate(gate, index) {
    if(gate instanceof MyGate) {
        gate.addEditButton();
    }
    gate.element.classList.add("draggable-gate");
    gate.element.setAttribute("draggable", "true");
    gate.element.setAttribute("id", index + "drag");
    gate.element.style.order = index + 1;
    gatesToolbox.appendChild(gate.element);
    gate.element.addEventListener("dragstart", (event) => {
        const dragElementId = gate.element.getAttribute("id");
        event.dataTransfer.setData("text/plain", dragElementId);
        event.dataTransfer.dropEffect = "copy";
        hideSVG();
    });
}

workArea.addEventListener("dragover", function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
});

function getMousePositionRelativToWorkArea(e) {
    const rect = workArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x: x + "px", y: y + "px"};
}

workArea.addEventListener("drop", function(event) {
    event.preventDefault();
    showSVG();
    const id = event.dataTransfer.getData("text/plain");
    const el = document.getElementById(id);
    const mousePosition = getMousePositionRelativToWorkArea(event);
    const gatesIndex = gates.length;
    gates[gatesIndex] = presetsGates[parseInt(id)].clone();
    const gate = gates[gatesIndex];
    prepareGate(gate);
    gate.element.style.top = mousePosition.y;
    gate.element.style.left = mousePosition.x;
    saveGate(gate);
});

function getPreviousGate(input) {
    const wire = wires[input.wire];
    return gates[wire.array1[1]];
}

function getWhichOutput(input) {
    const wire = wires[input.wire];
    return wire.array1[0];
}

createGateButton.addEventListener("click", () => {
    const inputsElementArray = Array.from(document.querySelectorAll("#work-area .inputs-element"));
    const outputsElementArray = Array.from(document.querySelectorAll("#work-area .outputs-element"));
    const functionStringArray = [];
    const idInputsElement = inputsElementArray.map((el) => {
        return parseInt(el.id);
    });
    const outputsArray = outputsElementArray.map((el) => {
        const id = parseInt(el.id);
        return gates[id].outputs[0].outputEl.id;
    });
    idInputsElement.forEach((value) => {
        const stringFun = prepareString(goThroughTheGates(getPreviousGate(gates[value].inputs[0]), getWhichOutput(gates[value].inputs[0])));
        functionStringArray.push(stringFun);
    });

    const outputsArr = outputsArray.filter((value) => {
        return outputsSet.has(value);
    });
    const workAreaGates = getWorkAreaGates();
    const workAreaWires = getWorkAreaWires();
    workArea.innerHTML = null;
    if(isEditMode) {
        editMyGate(functionStringArray, outputsArr, workAreaGates, workAreaWires);
    }else {
        createMyGate(functionStringArray, outputsArr, workAreaGates, workAreaWires);
    }
    outputsSet.clear();
});

function editMyGate(functionStringArray, outputsArray, workAreaGates, workAreaWires) {
    const amountOfInputs = outputsArray.length;
    const amountOfOutputs = functionStringArray.length;
    const colorInput = document.querySelector("#color");
    const nameInput = document.querySelector("#name");
    const name = nameInput.value;
    const color = colorInput.value;
    presetsGates[editGateId].element.remove();
    presetsGates[editGateId] = new MyGate(editGateId, amountOfInputs, amountOfOutputs, functionStringArray, outputsArray, name, color);
    createBlockMenu.style.display = "none";
    const gate = presetsGates[editGateId];
    console.log(gate);
    gate.gatesId = [ ...workAreaGates ];
    gate.wiresId = [ ...workAreaWires ];
    editSavedPresetsGate(gate, editGateId);
    makePresetsGate(gate, editGateId);
    exitFromEditMode();
}

function createMyGate(functionStringArray, outputsArray, workAreaGates, workAreaWires) {
    const amountOfInputs = outputsArray.length;
    const amountOfOutputs = functionStringArray.length;
    const colorInput = document.querySelector("#color");
    const nameInput = document.querySelector("#name");
    const name = nameInput.value;
    const color = colorInput.value;
    presetsGates.push(new MyGate(presetsGates.length, amountOfInputs, amountOfOutputs, functionStringArray, outputsArray, name, color));
    createBlockMenu.style.display = "none";
    const gate = presetsGates[presetsGates.length - 1];
    gate.gatesId = [ ...workAreaGates ];
    gate.wiresId = [ ...workAreaWires ];
    savePresetsGate(gate);
    makePresetsGate(gate, presetsGates.length - 1);
}

function addStringAtPosition(string, stringToAdd, index) {
    return string.slice(0, index) + stringToAdd + string.slice(index, string.length);
}

function prepareString(str) {
    const regEx = /\51[a-zA-Z0-9]/g;
    let string = str;
    while(regEx.test(string)) {
        const index = string.search(regEx) + 1;
        string = addStringAtPosition(string, ",", index);
    }
    return string;
}

function goThroughTheGates(gate, outputIndex) {
    if(!gate.element.classList.contains("outputs-element")) {
        const gateArray = [];
        const outputIndexArray = [];
        let string = "";
        gate.inputs.forEach((el) => {
            gateArray.push(getPreviousGate(el));
            outputIndexArray.push(getWhichOutput(el));
        });
        if(gate instanceof ANDGate || gate instanceof NOTGate) {
            gateArray.forEach((el, index) => {
                string += `goThroughTheGates(gates[${parseInt(el.id)}], ${outputIndexArray[index]})+`
            });
            string = string.slice(0, (string.length - 1));
            return (gate.functionStringHead + eval(string) + gate.functionStringTail);
        }else {
            const stringIndexArr = gate.stringIndexArr[outputIndex];
            let functionString = gate.makeStringArr[outputIndex];
            for(let i = 0; i <= stringIndexArr.length; i++) {
                let start;
                let end;
                if(i === 0) {
                    start = -1;
                    end = stringIndexArr[i][0];
                }else if(i === stringIndexArr.length){
                    start = stringIndexArr[i-1][1];
                    end = functionString.length;
                }else {
                    start = stringIndexArr[i-1][1];
                    end = stringIndexArr[i][0];
                }
                if(i !== stringIndexArr.length) {
                    string += `functionString.slice(${start+1},${end})+goThroughTheGates(gates[parseInt(gateArray[${parseInt(functionString.slice(stringIndexArr[i][0]+1, stringIndexArr[i][1]))}].id)], ${outputIndexArray[parseInt(functionString.slice(stringIndexArr[i][0]+1, stringIndexArr[i][1]))]})+`;
                }else {
                    string += `functionString.slice(${start+1},${end})`;
                }
            }
            return eval(string);
        }
    }else {
        const id = gate.outputs[0].outputEl.getAttribute("id");
        outputsSet.add(id);
        return id + ",";
    }
}

createGateMenuButton.addEventListener("click", () => {
    function randomColor() {
        const deg = Math.random() * 360;
        function hslToHex(h, s=60, l=50) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }
        return hslToHex(deg);
    }
    const colorInput = document.querySelector("#color");
    colorInput.value = randomColor();
    createBlockMenu.style.display = "flex";
});

deleteButton.addEventListener("click", () => {
    const id = selectedElement?.id?.split("-");
    if(id[1] === "gate") {
        gates[id[0]].delete();
    }else if(id[1] === "wire"){
        wires[id[0]].delete();
    }
    saveToLocalStorage();
})

presetsGates.push(new OutputsElement(1, presetsGates.length));
presetsGates.push(new nOutputsElement(2, presetsGates.length));
presetsGates.push(new nOutputsElement(4, presetsGates.length));
presetsGates.push(new nOutputsElement(8, presetsGates.length));
presetsGates.push(new InputsElement(1, presetsGates.length));
presetsGates.push(new nInputsElement(2, presetsGates.length));
presetsGates.push(new nInputsElement(4, presetsGates.length));
presetsGates.push(new nInputsElement(8, presetsGates.length));
presetsGates.push(new ANDGate(presetsGates.length));
presetsGates.push(new NOTGate(presetsGates.length));

loadSave();

presetsGates.forEach((gate, index) => {
    makePresetsGate(gate, index);
});

saveToLocalStorage();