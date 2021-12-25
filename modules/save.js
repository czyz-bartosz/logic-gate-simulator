import { ANDGate, NOTGate, MyGate, prepareGate } from "./Gate.js";
import { InputsElement } from "./InputsElement.js";
import { nInputsElement } from "./nInputsElement.js";
import { nOutputsElement } from "./nOutputsElement.js";
import { OutputsElement } from "./OutputsElement.js";
import { gates } from "../main.js";

const savedGates = [];
const savedPresetsGates = [];

export function loadSave() {
    const string = localStorage.getItem("savedGates");
    const loadGates = JSON.parse(string);
    addGates(loadGates);
}

function addGates(loadGates) {
    // loadGates.forEach((gate) => {
    //     const type = gate.type;
    //     console.log(type);
    //     let obj;
    //     switch(type) {
    //         case "ANDGate": 
    //             obj = new ANDGate();
    //             prepareGate(obj);
    //     }
    // });
}

export function saveGate(gate) {
    console.log(gate);
    const obj = {};
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
    }else if(gate instanceof nInputsElement) {
        obj.type = "nInputsElement";
    }else if(gate instanceof MyGate) {
        obj.type = "MyGate";
    }
    savedGates.push(obj);
    console.log(obj, savedGates);
    const string = JSON.stringify(savedGates);
    localStorage.setItem("savedGates", string);
}

export function savePresetsGate(gate) {

}