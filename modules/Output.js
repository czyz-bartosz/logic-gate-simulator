export class Output {
    outputEl = document.createElement("div");
    currentValue = null;
    id = null;
    constructor(id) {
        this.createElement();
        this.id = id;
    }
    createElement() {
        this.outputEl.classList.add("output");
    }
}