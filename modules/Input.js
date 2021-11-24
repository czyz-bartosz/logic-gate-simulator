import { gates } from "../main.js";

export class Input {
    inputEl = document.createElement("div");
    currentValue = null;
    id = null;
    constructor(id) {
        this.createElement();
        this.id = id;
    }
    createElement() {
        this.inputEl.classList.add("input");
    }
    setInputValue(value, parentId) {
        this.currentValue = value;
        gates[parentId].changeStatus();
    }
}