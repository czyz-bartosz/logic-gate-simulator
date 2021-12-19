export class Output {
    outputEl = document.createElement("div");
    currentValue = null;
    id = null;
    wires = [];
    constructor(id) {
        this.createElement();
        this.id = id;
    }
    createElement() {
        this.outputEl.classList.add("output");
    }
}