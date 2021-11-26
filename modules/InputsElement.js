import { gates, wires } from "../main.js";
import { Input } from "./Input.js";

export class InputsElement {
    inputs = [];
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
            this.inputs[i].inputEl.setAttribute("id", i+"-"+this.id);
            this.element.appendChild(this.inputs[i].inputEl);
        }
    }
    move() {
        this.inputs.forEach((el, id) => {
            wires[this.inputs[id].wire]?.draw();
        });
    }
    changeStatus() {
        this.inputs.forEach((el) => {
            if(el.currentValue) {
                el.inputEl.classList.add("true");
                el.inputEl.classList.remove("false");
            }else {
                el.inputEl.classList.add("false");
                el.inputEl.classList.remove("true");
            }
        });
    }
    clone() {
        return new InputsElement(1, (gates.length + "-gate"));
    }
}