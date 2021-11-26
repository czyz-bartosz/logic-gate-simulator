import { gates, wires } from "../main.js";
import { Output } from "./Output.js";

export class OutputsElement {
    outputs = [];
    element = document.createElement("div");
    constructor(amountOfOutputs, id=gates.length) {
        this.amountOfOutputs = amountOfOutputs;
        this.id = id;
        this.generateOutputsCon();
        this.addOutputs();
    }
    generateOutputsCon() {
        this.element.classList.add("outputs-element");
    }
    addOutputs() {
        for(let i = 0; i < this.amountOfOutputs; i++) {
            this.outputs.push(new Output(i));
            this.outputs[i].outputEl.setAttribute("id", i+"-"+this.id);
            this.outputs[i].outputEl.classList.add("false");
            this.outputs[i].outputEl.addEventListener("dblclick", () => {
                this.outputs[i].outputEl.classList.toggle("false");
                this.outputs[i].outputEl.classList.toggle("true");
            });
            this.element.appendChild(this.outputs[i].outputEl);
        }
    }
    move() {
        this.outputs.forEach((el, id) => {
            this.outputs[id]?.wires.forEach((el, idW) => {
                wires[this.outputs[id].wires[idW]].draw();
                console.log(idW);
            });
        });
    }
    clone() {
        return new OutputsElement(1, (gates.length + "-gate"));
    }
}