import { gates, wires } from "../main.js";
import { OutputsElement } from "./OutputsElement.js";

export class nOutputsElement {
    element = document.createElement("div");
    valueEl = document.createElement("h2");
    outputsElementsId = [];
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
        if(idString.includes("gate")) {
            for(let i = 1; i <= n; i++) {
                this.valueEl.textContent = 0;
                gates[id + i] = new OutputsElement(1, (id + i + "-gate"));
                const outputsEl = gates[id + i];
                outputsEl.element.id = outputsEl.id;
                this.outputsElementsId.push(id + i);
                this.element.appendChild(outputsEl.element);
                this.changeNumber();
            }
        }else {
            this.valueEl.textContent = n;
        }
    }
    changeNumber() {
        let i = 0;
        let sum = 0;
        for(let j = this.outputsElementsId.length - 1; j >= 0; j--) {
            const id = this.outputsElementsId[j];
            gates[id].outputs.forEach((el) => {
                console.log(el.currentValue);
                const value = el.currentValue;
                if(value) {
                    sum += Math.pow(2, i);
                }
                i++;
            });
        };
        this.valueEl.textContent = sum;
    }
    move() {
        this.outputsElementsId.forEach((id) => {
            const el = gates[id];
            el.move();
        });
    }
    delete() {
        this.element.remove();
        this.outputsElementsId.forEach((id) => {
            const el = gates[id];
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