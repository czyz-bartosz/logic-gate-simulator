const main = document.querySelector("main");
const gatesToolbox = document.querySelector("#left");
const presetsGates = [];
const gates = [];
let dragElementId;

class Gate {
    gateEl = document.createElement("div");
    InputsConEl = document.createElement("div");
    OutputsConEl = document.createElement("div");
    text = document.createElement("p");
    amountOfInputs = 2;
    inputs = [];
    output;
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.gateEl.classList.add("gate");
        this.generateInputsCon();
        this.gateEl.appendChild(this.text);
        this.generateOutputsCon();
        this.addInputsAndOutput();
    }
    generateInputsCon() {
        this.InputsConEl.classList.add("inputs");
        this.gateEl.appendChild(this.InputsConEl);
    }
    generateOutputsCon() {
        this.OutputsConEl.classList.add("outputs");
        this.gateEl.appendChild(this.OutputsConEl);
    }
    addInputsAndOutput() {
        for(let i = 0; i < this.amountOfInputs; i++) {
            this.inputs.push(new Input());
            this.InputsConEl.appendChild(this.inputs[i].inputEl);
        }
        this.output = new Output();
        this.OutputsConEl.appendChild(this.output.outputEl);
    }
}

class ANDGate extends Gate {
    constructor(type, id) {
        super(type, id);
        this.text.innerHTML += "AND";
    }
    returnValue(a, b) {
        if(a === true && b === true) {
            return true;
        }else {
            return false;
        }
    }
    clone() {
        return new ANDGate(this.type, this.id);
    }
}

class NOTGate extends Gate {
    constructor() {
        super();
        this.text.innerHTML += "NOT";
    }
    returnValue(a) {
        return !a;
    }
    clone() {
        return new NOTGate(this.type, this.id);
    }
}

class Input {
    inputEl = document.createElement("div");
    constructor() {
        this.createElement();
    }
    createElement() {
        this.inputEl.classList.add("input");
    }
}

class Output {
    outputEl = document.createElement("div");
    constructor() {
        this.createElement();
    }
    createElement() {
        this.outputEl.classList.add("output");
    }
}

presetsGates.push(new ANDGate(presetsGates.length));
presetsGates.push(new NOTGate(presetsGates.length));

presetsGates.forEach((el, index) => {
    el.gateEl.classList.add("draggable-gate");
    el.gateEl.setAttribute("draggable", "true");
    el.gateEl.setAttribute("id", index + "drag");
    gatesToolbox.appendChild(el.gateEl);
    el.gateEl.addEventListener("dragstart", (event) => {
        console.log("dragstart");
        dragElementId = event.target.getAttribute("id");
        event.dataTransfer.setData("text/plain", event.target.id);
        event.dataTransfer.dropEffect = "copy";
    });
    el.gateEl.addEventListener("dragend", () => {
        main.style.background = "none";
    });
});

main.addEventListener("dragleave", function(event) {
    this.style.background = "none";
    console.log("enter")
});

main.addEventListener("dragover", function(event) {
    event.preventDefault();
    this.style.background = "blue";
    event.dataTransfer.dropEffect = "copy";
});

main.addEventListener("drop", function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    let nodeCopy = document.getElementById(id).cloneNode(true);
    nodeCopy.id = gates.length + "gate";
    this.appendChild(nodeCopy);
    gates.push(presetsGates[parseInt(id)].clone());
    gates[gates.length-1].gateEl = nodeCopy;
});
