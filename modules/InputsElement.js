import { gates, wires } from "../main.js";
import { Input } from "./Input.js";

export class InputsElement {
    inputs = [];
    functionStringHead = "";
    functionStringTail = "";
    element = document.createElement("div");
    constructor(amountOfInputs, id=gates.length) {
        this.amountOfInputs = amountOfInputs;
        this.id = id;
        this.generateInputsCon();
        this.addInputs();
    }
    generateInputsCon() {
        this.element.classList.add("inputs-element");
    }
    addInputs() {
        for(let i = 0; i < this.amountOfInputs; i++) {
            this.inputs.push(new Input(i));
            this.inputs[i].inputEl.setAttribute("id", (i+"-"+this.id));
            this.inputs[i].id = this.inputs[i].inputEl.getAttribute("id");
            this.element.appendChild(this.inputs[i].inputEl);
        }
    }
    move() {
        this.inputs.forEach((el, id) => {
            wires[this.inputs[id].wire]?.draw();
        });
    }
    changeStatus() {
    }
    clone() {
        return new InputsElement(1, (gates.length + "-gate"));
    }
}