import { ANDGate, NOTGate, MyGate } from "./Gate.js";
import { InputsElement } from "./InputsElement.js";
import { nInputsElement } from "./nInputsElement.js";
import { nOutputsElement } from "./nOutputsElement.js";
import { OutputsElement } from "./OutputsElement.js";

const savedGates = [];
const savedPresetsGates = [];

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
}

export function savePresetsGate(gate) {

}