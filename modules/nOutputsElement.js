import { gates, presetsGates } from "../main.js";
import { OutputsElement } from "./OutputsElement.js";

export class nOutputsElement {
    element = document.createElement("div");
    outputsElements = [];
    constructor(n, id=gates.length) {
        this.element.classList.add("n-outputs-element");
        this.n = n;
        this.id = id;
        this.addOutputsElements(n);
    }
    addOutputsElements(n) {
        const id = parseInt(this.id);
        const idString = this.id.toString();
        console.log(idString);
        for(let i = 1; i <= n; i++) {
            if(idString.includes("gate")) {
                console.log(this.id)
                gates[id + i] = new OutputsElement(1, (id + i + "-gate"));
                const outputsEl = gates[id + i];
                this.outputsElements.push(outputsEl);
                this.element.appendChild(outputsEl.element);
            }else {
                const outputsEl = new OutputsElement(1);
                this.outputsElements.push(outputsEl);
                this.element.appendChild(outputsEl.element);
            }
            
        }
    }
    clone() {
        return new nOutputsElement(this.n, (gates.length + "-gate"))
    }
}