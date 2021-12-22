import { gates, wires } from "../main.js";
import { OutputsElement } from "./OutputsElement.js";

export class nOutputsElement {
    element = document.createElement("div");
    valueEl = document.createElement("h2");
    outputsElements = [];
    constructor(n, id=gates.length) {
        this.element.classList.add("n-outputs-element");
        this.element.appendChild(this.valueEl);
        this.n = n;
        this.id = id;
        this.addOutputsElements(n);
    }
    addOutputsElements(n) {
        const id = parseInt(this.id);
        const idString = this.id.toString();
        console.log(idString);
        if(idString.includes("gate")) {
            for(let i = 1; i <= n; i++) {
                console.log(this.id)
                this.valueEl.textContent = 0;
                gates[id + i] = new OutputsElement(1, (id + i + "-gate"));
                const outputsEl = gates[id + i];
                outputsEl.element.id = outputsEl.id;
                this.outputsElements.push(outputsEl);
                this.element.appendChild(outputsEl.element);
            }
        }else {
            this.valueEl.textContent = n;
        }
    }
    move() {
        this.outputsElements.forEach((el) => {
            el.move();
        });
    }
    delete() {
        this.element.remove();
        this.outputsElements.forEach((el) => {
            el.outputs.forEach((output) => {
                output.wires.forEach((wireId) => {
                wires[wireId]?.delete();
            });
            });
        });
    }
    clone() {
        return new nOutputsElement(this.n, (gates.length + "-gate"))
    }
}