import { NOTGate, ANDGate } from "./modules/Gate.js";
import { Wire } from "./modules/Wire.js";
export { gates, wires, inputs, outputs, main };

const workArea = document.querySelector("#work-area");
const main = document.querySelector("main");
const gatesToolbox = document.querySelector("#left");
const outputs = document.querySelectorAll(".output");
const inputs = document.querySelectorAll(".input");
const presetsGates = [];
const gates = [];
const wires = [];
const mainOutputs = document.querySelectorAll(".main-output");
const mainInputs = [];
let selectedOutput;
let selectedInput;

function makeMainOutputs() {

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
            console.log();
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

presetsGates.forEach((el, index) => {
    el.gateEl.classList.add("draggable-gate");
    el.gateEl.setAttribute("draggable", "true");
    el.gateEl.setAttribute("id", index + "drag");
    gatesToolbox.appendChild(el.gateEl);
    el.gateEl.addEventListener("dragstart", (event) => {
        const dragElementId = el.gateEl.getAttribute("id");
        event.dataTransfer.setData("text/plain", dragElementId);
        event.dataTransfer.dropEffect = "copy";
        hideSVG();
    });
});

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
        this.appendChild(gates[gates.length-1].gateEl);
        const inputsArr = gates[gates.length-1].gateEl.querySelectorAll(".input");
        const outputsArr = gates[gates.length-1].gateEl.querySelectorAll(".output");
        gates[gates.length-1].gateEl.classList.add("work");
        const rect = workArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        gates[gates.length-1].gateEl.style.top = y + "px";
        gates[gates.length-1].gateEl.style.left = x + "px";
        gates[gates.length-1].gateEl.id = gates[gates.length-1].id;
        gates[gates.length-1].gateEl.setAttribute("draggable", "true");
        gates[gates.length-1].gateEl.addEventListener("dragstart", function(event) {
            const dragElementId = this.getAttribute("id");
            hideSVG();
            event.dataTransfer.setData("text/plain", dragElementId);
            event.dataTransfer.dropEffect = "copy";
        });
        inputsArr.forEach((el) => {
            el.addEventListener("click", () => {
                makeConnection(el);
            });
        });
        outputsArr.forEach((el) => {
            el.addEventListener("click", () => {
                makeConnection(el);
            });
        });
    }
    
});

outputs.forEach((el, index) => {
    el.addEventListener("click", () => {
        makeConnection(el);
    });
});

inputs.forEach((el, index) => {
    el.addEventListener("click", () => {
        makeConnection(el);
    });
});

mainOutputs.forEach((el) => {
    el.addEventListener("dblclick", () => {
        el.classList.toggle("false");
        el.classList.toggle("true");
    });
});