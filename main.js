import { NOTGate, ANDGate, MyGate } from "./modules/Gate.js";
import { Wire } from "./modules/Wire.js";
import { OutputsElement } from "./modules/OutputsElement.js";
import { InputsElement } from "./modules/InputsElement.js";
export { gates, wires, workArea };

const workArea = document.querySelector("#work-area");
const gatesToolbox = document.querySelector("footer");
const createGateMenuButton = document.querySelector("#create-gate-menu-button");
const createGateButton = document.querySelector("#create-gate-button");
const presetsGates = [];
const gates = [];
const wires = [];
const outputsSet = new Set();
let selectedOutput;
let selectedInput;

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

function makeConnection(el) {
    if(el.classList.contains("output")) {
        if(!selectedOutput) {
            selectedOutput = el;
        }
    }else {
        const gateId = el.id.split("-")[1];
        const inputId = el.id.split("-")[0];
        const wire = gates[gateId].inputs[inputId].wire;
        if(!selectedInput && wire === undefined) {
            selectedInput = el;
        }
    }
    if(selectedInput && selectedOutput) {
        wires.push(new Wire(selectedOutput, selectedInput));
        selectedOutput = selectedInput = null;
    }
}

presetsGates.push(new ANDGate(presetsGates.length));
presetsGates.push(new NOTGate(presetsGates.length));
presetsGates.push(new OutputsElement(1, presetsGates.length));
presetsGates.push(new InputsElement(1, presetsGates.length));

presetsGates.forEach((el, index) => {
    makePresetsGate(el, index);
});

function makePresetsGate(el, index) {
    el.element.classList.add("draggable-gate");
    el.element.setAttribute("draggable", "true");
    el.element.setAttribute("id", index + "drag");
    gatesToolbox.appendChild(el.element);
    el.element.addEventListener("dragstart", (event) => {
        const dragElementId = el.element.getAttribute("id");
        event.dataTransfer.setData("text/plain", dragElementId);
        event.dataTransfer.dropEffect = "copy";
        hideSVG();
    });
}

workArea.addEventListener("dragover", function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
});

workArea.addEventListener("drop", function(event) {
    event.preventDefault();
    showSVG();
    const id = event.dataTransfer.getData("text/plain");
    const el = document.getElementById(id);
    if(id.includes("gate")) {
        const idGate = parseInt(id);
        const rect = workArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        el.style.top = y + "px";
        el.style.left = x + "px";
        gates[idGate].move();
    }else {
        gates.push(presetsGates[parseInt(id)].clone());
        this.appendChild(gates[gates.length-1].element);
        const inputsArr = gates[gates.length-1].element.querySelectorAll(".input");
        const outputsArr = gates[gates.length-1].element.querySelectorAll(".output");
        gates[gates.length-1].element.classList.add("work");
        const rect = workArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        gates[gates.length-1].element.style.top = y + "px";
        gates[gates.length-1].element.style.left = x + "px";
        gates[gates.length-1].element.id = gates[gates.length-1].id;
        gates[gates.length-1].element.setAttribute("draggable", "true");
        gates[gates.length-1].element.addEventListener("dragstart", function(event) {
            const dragElementId = this.getAttribute("id");
            hideSVG();
            event.dataTransfer.setData("text/plain", dragElementId);
            event.dataTransfer.dropEffect = "copy";
        });
        inputsArr.forEach((el) => {
            el.addEventListener("mouseup", (event) => {
                if(event.button === 2) {
                    makeConnection(el);
                }
            });
        });
        outputsArr.forEach((el) => {
            el.addEventListener("mouseup", (event) => {
                if(event.button === 2) {
                    makeConnection(el);
                }
            });
        });
    }
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
    const inputsElementArray = Array.from(document.querySelectorAll(".work.inputs-element"));
    const outputsElementArray = Array.from(document.querySelectorAll(".work.outputs-element"));
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
        console.log("koniec", stringFun);
        functionStringArray.push(stringFun);
    });

    const outputsArr = outputsArray.filter((value) => {
        return outputsSet.has(value);
    });
    console.log(functionStringArray, outputsArr);
    createMyGate(functionStringArray, outputsArr);
    workArea.innerHTML = null;
    outputsSet.clear();
});

function createMyGate(functionStringArray, outputsArray) {
    const amountOfInputs = outputsArray.length;
    const amountOfOutputs = functionStringArray.length;
    const colorInput = document.querySelector("#color");
    const nameInput = document.querySelector("#name");
    const name = nameInput.value;
    const color = colorInput.value;
    presetsGates.push(new MyGate(presetsGates.length, amountOfInputs, amountOfOutputs, functionStringArray, outputsArray, name, color));
    makePresetsGate(presetsGates[presetsGates.length - 1], presetsGates.length - 1);
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
            console.log(gate, string);
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
            console.log(gate, string);
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
});