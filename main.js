const workArea = document.querySelector("#work-area");
const main = document.querySelector("main");
const gatesToolbox = document.querySelector("#left");
const outputs = document.querySelectorAll(".output");
const inputs = document.querySelectorAll("#work-area .input");
const presetsGates = [];
const gates = [];
const wires = [];
let selectedOutput;
let selectedInput;

class Gate {
    gateEl = document.createElement("div");
    inputsConEl = document.createElement("div");
    outputsConEl = document.createElement("div");
    text = document.createElement("p");
    amountOfInputs;
    amountOfOutputs;
    inputs = [];
    outputs = [];
    constructor(id, inputs = 2, outputs = 1) {
        this.id = id;
        this.amountOfInputs = inputs;
        this.amountOfOutputs = outputs;
        this.gateEl.classList.add("gate");
        this.generateInputsCon();
        this.gateEl.appendChild(this.text);
        this.generateOutputsCon();
        this.addInputsAndOutput();
    }
    generateInputsCon() {
        this.inputsConEl.classList.add("inputs");
        this.gateEl.appendChild(this.inputsConEl);
    }
    generateOutputsCon() {
        this.outputsConEl.classList.add("outputs");
        this.gateEl.appendChild(this.outputsConEl);
    }
    addInputsAndOutput() {
        for(let i = 0; i < this.amountOfInputs; i++) {
            this.inputs.push(new Input(i));
            this.inputs[i].inputEl.setAttribute("id", i+"-"+this.id);
            this.inputsConEl.appendChild(this.inputs[i].inputEl);
        }
        for(let i = 0; i < this.amountOfOutputs; i++) {
            this.outputs.push(new Output(i));
            this.outputs[i].outputEl.setAttribute("id", i+"-"+this.id);
            this.outputsConEl.appendChild(this.outputs[i].outputEl);
        }
    }
}

class ANDGate extends Gate {
    constructor(id) {
        super(id);
        this.text.innerHTML += "AND";
    }
    returnValue(a, b) {
        if(a === true && b === true) {
            return true;
        }else {
            return false;
        }
    }
    clone(id = gates.length) {
        return new ANDGate(id);
    }
}

class NOTGate extends Gate {
    amountOfInputs = 1;
    constructor(id, inputs, outputs) {
        super(id, 1, 1);
        this.text.innerHTML += "NOT";
    }
    returnValue(a) {
        return !a;
    }
    clone(id = gates.length) {
        return new NOTGate(id);
    }
}

class Input {
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
}

class Output {
    outputEl = document.createElement("div");
    currentValue = null;
    id = null;
    constructor(id) {
        this.createElement();
        this.id = id;
    }
    createElement() {
        this.outputEl.classList.add("output");
        this.outputEl.classList.add("false");
    }
}

class Wire {
    id = wires.length;
    el = document.createElementNS("http://www.w3.org/2000/svg", "path");;
    con = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    width;
    height;
    constructor(el1, el2) {
        this.el1 = {position: { x:el1.offsetLeft, y:el1.offsetTop}};
        this.el2 = {position: { x:el2.offsetLeft, y:el2.offsetTop}};
        this.draw();
    }
    draw() {
        if(this.el1.position.x > this.el2.position.x) {
            this.width = this.el1.position.x - this.el2.position.x;
        }else {
            this.width = this.el2.position.x - this.el1.position.x;
        }
        if(this.el1.position.y > this.el2.position.y) {
            this.height = this.el1.position.y - this.el2.position.y;
        }else if(this.el1.position.y < this.el2.position.y){
            this.height = this.el2.position.y - this.el1.position.y;
        }else {
            this.height = 10;
        }
        this.height += 20;
        this.width += 20;
        this.con.setAttribute("width", this.width);
        this.con.setAttribute("height", this.height);
        this.con.setAttribute("style", `top: ${this.el1.position.y}px; left: ${this.el1.position.x}px`);
        this.el.setAttribute("d", `M 0 10 H ${this.width/2} V ${this.height - 10} H ${this.width}`);
        // this.el.setAttribute("d", `M 0 0 H ${this.width/2}  ${this.width/2},${this.height} ${this.width},${this.height}`);
        this.con.appendChild(this.el);
        main.appendChild(this.con);
    }
}

function makeConnection(el) {
    if(el.classList.contains("output")) {
        if(!selectedOutput) {
            selectedOutput = el;
            console.log(el);
        }
    }else {
        if(!selectedInput) {
            selectedInput = el;
        }
    }
    if(selectedInput && selectedOutput) {
        wires.push(new Wire(selectedOutput, selectedInput));
        selectedOutput = selectedInput = null;
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
        workArea.style.background = "none";
    });
});

workArea.addEventListener("dragleave", function(event) {
    this.style.background = "none";
    console.log("enter")
});

workArea.addEventListener("dragover", function(event) {
    event.preventDefault();
    this.style.background = "blue";
    event.dataTransfer.dropEffect = "copy";
});

workArea.addEventListener("drop", function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    gates.push(presetsGates[parseInt(id)].clone());
    this.appendChild(gates[gates.length-1].gateEl);
    const inputsArr = gates[gates.length-1].gateEl.querySelectorAll(".input");
    const outputsArr = gates[gates.length-1].gateEl.querySelectorAll(".output");
    inputsArr.forEach((el) => {
        el.addEventListener("click", () => {
            makeConnection(el);
            console.log(el);
        });
    });
    outputsArr.forEach((el) => {
        el.addEventListener("click", () => {
            makeConnection(el);
            console.log(el);
        });
    });
});

outputs.forEach((el, index) => {
    el.addEventListener("click", () => {
        makeConnection(el);
        console.log(el);
    });
});

inputs.forEach((el, index) => {
    el.addEventListener("click", () => {
        makeConnection(el);
        console.log(el);
    });
});