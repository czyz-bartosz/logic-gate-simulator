import { NOTGate, ANDGate, MyGate } from "./modules/Gate.js";
import { Wire } from "./modules/Wire.js";
import { OutputsElement } from "./modules/OutputsElement.js";
import { InputsElement } from "./modules/InputsElement.js";
export { gates, wires, workArea };

const workArea = document.querySelector("#work-area");
const gatesToolbox = document.querySelector("#left");
const presetsGates = [];
const gates = [];
const wires = [];
class Stack {
    data = [];
    push(element) {
        this.data.push(element);
    }
    pop() {
        return this.data.pop() || -1;
    }
    get() {
        return this.data[this.data.length-1];
    }
    isEmpty() {
        return this.data.length === 0 ? true : false;
    }
}
let gatesStack = [new Stack, new Stack];
let tempArray;

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

function getCloneId(input) {
    const wire = wires[input.wire];
    if(wire.array1[3]) {
        console.log("kutas")
        return wire.array1[3];
    }else {
        return -2;
    }
}

function pushToStack(input) {
    const outputId = getOutputId(input);
    const id = outputId.split("-")[3];
    if(id) {
        for(let i = 0; i < gates[id].amountOfInputs; i++) {
            if(gatesStack[i] === undefined) {
                gatesStack[i].push(new Stack);
            }
            gatesStack[i].push(id);
        }
    }
}

function pushToStack1(input, copyStack) {
    const outputId = getOutputId(input);
    const id = outputId.split("-")[3];
    if(id) {
        for(let i = 0; i < gates[id].amountOfInputs; i++) {
            if(gatesStack[i] === undefined) {
                gatesStack[i].push(new Stack);
            }
            copyStack[i].forEach((value) => {
                gatesStack[i].push(value);
            });
            gatesStack[i].push(id);
        }
    }
}

function getOutputId(input) {
    const wire = wires[input.wire];
    return wire.el1.element.id;
}

document.querySelector("button").addEventListener("click", () => {
    const inputsElementArray = Array.from(document.querySelectorAll(".work.inputs-element"));
    const outputsElementArray = Array.from(document.querySelectorAll(".work.outputs-element"));
    const functionStringArray = [];
    const outputIdArray = [];
    const idInputsElement = inputsElementArray.map((el) => {
        return parseInt(el.id);
    });
    const outputsArray = outputsElementArray.map((el) => {
        const id = parseInt(el.id);
        return gates[id].outputs[0].outputEl.id;
    });
    tempArray = [ ...outputsArray];
    idInputsElement.forEach((value) => {
        const previousGate = getPreviousGate(gates[value].inputs[0]);
        pushToStack(gates[value].inputs[0]);
        const stringFun = prepareString(goThroughTheGates(previousGate));
        const array = getOutputId(gates[value].inputs[0]).split("-");
        if(array[3]) {
            array[1] = array[3];
        }
        const inputidstring = `${array[0]}-${array[1]}-${array[2]}`;
        outputIdArray.push(inputidstring);
        console.log("koniec", stringFun, outputsArray);
        functionStringArray.push(stringFun);
    });
    console.log(outputIdArray);
    createMyGate(functionStringArray, outputsArray, idInputsElement);
    workArea.innerHTML = null;
});

function createMyGate(functionStringArray, outputsArray, outputIdArray) {
    const amountOfInputs = outputsArray.length;
    const amountOfOutputs = functionStringArray.length;
    presetsGates.push(new MyGate(presetsGates.length, amountOfInputs, amountOfOutputs, functionStringArray, outputsArray, outputIdArray));
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

function goThroughTheGates(gate) {
    if(!gate.element.classList.contains("outputs-element")) {
        const gateArray = [];
        const inputsToStack = [];
        let string = "";
        // if(gate.element.classList.contains("inputs-element")) {
        //     pushToStack(el);
        // }
        gate.inputs.forEach((el) => {
            gateArray.push(getPreviousGate(el));
            pushToStack(el);
        });
        // gateArray.forEach((el) => {
        //     string += "goThroughTheGates(gates[" + parseInt(el.id) + "])+";
        // });
        for(let i = gateArray.length - 1; i >= 0; i--) {
            const el = gateArray[i];
            if(el.element.classList.contains("outputs-element") && !gatesStack[i].isEmpty() ) {
                
                let stack = gatesStack[i].pop();
                while(getPreviousGate(gates[stack].inputs[i]).element.classList.contains("outputs-element") && !tempArray.includes(getPreviousGate(gates[stack].inputs[i]).outputs[0].outputEl.id) && !gatesStack[i].isEmpty()) {
                    stack = gatesStack[i].pop();
                    console.log("chuj")
                }
                string += "goThroughTheGates(getPreviousGate(gates[" + stack + "].inputs[" + i + "]))+";
                inputsToStack.push(gates[stack].inputs[i]);
                console.log("hello")
            }else {
                string += "goThroughTheGates(gates[" + parseInt(el.id) + "])+";
            }
        }
        const copyStack = gatesStack.map((el) => {
            return [...el.data];
        });

        for(let i = inputsToStack.length - 1; i >= 0; i--) {
            const el = inputsToStack[i];
            if(i === inputsToStack.length - 1) {
                pushToStack(el);
            }else {
                pushToStack1(el, copyStack);
            }
        }

        string = string.slice(0, (string.length - 1));
        console.log(gate, string, gatesStack[0].data, gatesStack[1].data);
        return (gate.functionStringHead + eval(string) + gate.functionStringTail);
    }else {
        console.log(gatesStack)
        return gate.outputs[0].outputEl.getAttribute("id") + ",";
    }
}