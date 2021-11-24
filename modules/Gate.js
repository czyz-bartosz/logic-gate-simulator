import { Input } from "./Input.js";
import { Output } from "./Output.js";
import { gates } from "../main.js";
export {Gate, NOTGate, ANDGate};

class Gate {
    gateEl = document.createElement("div");
    inputsConEl = document.createElement("div");
    outputsConEl = document.createElement("div");
    text = document.createElement("p");
    amountOfInputs;
    amountOfOutputs;
    inputs = [];
    outputs = [];
    constructor(id, inputs = 2, outputs = 1) {
        this.id = id;
        this.amountOfInputs = inputs;
        this.amountOfOutputs = outputs;
        this.gateEl.classList.add("gate");
        this.generateInputsCon();
        this.gateEl.appendChild(this.text);
        this.generateOutputsCon();
        this.addInputsAndOutput();
    }
    generateInputsCon() {
        this.inputsConEl.classList.add("inputs");
        this.gateEl.appendChild(this.inputsConEl);
    }
    generateOutputsCon() {
        this.outputsConEl.classList.add("outputs");
        this.gateEl.appendChild(this.outputsConEl);
    }
    addInputsAndOutput() {
        for(let i = 0; i < this.amountOfInputs; i++) {
            this.inputs.push(new Input(i));
            this.inputs[i].inputEl.setAttribute("id", i+"-"+this.id);
            this.inputsConEl.appendChild(this.inputs[i].inputEl);
        }
        for(let i = 0; i < this.amountOfOutputs; i++) {
            this.outputs.push(new Output(i));
            this.outputs[i].outputEl.setAttribute("id", i+"-"+this.id);
            this.outputsConEl.appendChild(this.outputs[i].outputEl);
        }
    }
    move(el) {
        if(isMouseDown) {
            console.log(window.event);
            el.style.top = event.y + "px";
            el.style.left = event.x + "px";
        }
    }
}

class ANDGate extends Gate {
    constructor(id) {
        super(id);
        this.text.innerHTML += "AND";
    }
    returnValue(a, b) {
        if(a === true && b === true) {
            return true;
        }else {
            return false;
        }
    }
    clone(id = gates.length) {
        return new ANDGate(id);
    }
    changeStatus() {
        console.log(this.inputs[0].currentValue, this.inputs[1].currentValue)
        if(this.returnValue(this.inputs[0].currentValue, this.inputs[1].currentValue)) {
            this.outputs[0].currentValue = true;
            this.outputs[0].outputEl.classList.add("true");
            this.outputs[0].outputEl.classList.remove("false");
            console.log(true)
        }else {
            this.outputs[0].currentValue = false;
            this.outputs[0].outputEl.classList.add("false");
            this.outputs[0].outputEl.classList.remove("true");
            console.log(false)
        }
    }
}

class NOTGate extends Gate {
    amountOfInputs = 1;
    constructor(id, inputs, outputs) {
        super(id, 1, 1);
        this.text.innerHTML += "NOT";
    }
    returnValue(a) {
        return !a;
    }
    clone(id = gates.length) {
        return new NOTGate(id);
    }
    changeStatus() {
        console.log(this.inputs[0].currentValue)
        if(this.returnValue(this.inputs[0].currentValue)) {
            this.outputs[0].currentValue = true;
            this.outputs[0].outputEl.classList.add("true");
            this.outputs[0].outputEl.classList.remove("false");
            console.log(true)
        }else {
            this.outputs[0].currentValue = false;
            this.outputs[0].outputEl.classList.add("false");
            this.outputs[0].outputEl.classList.remove("true");
            console.log(false)
        }
    }
}

