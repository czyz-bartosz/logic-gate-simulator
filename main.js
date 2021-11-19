const main = document.querySelector("main");
const gatesToolbox = document.querySelector("#left");
const presetsGates = [];
const gates = [];
let dragElementId;

class Gate {
    gateEl = document.createElement("div");
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.gateEl.classList.add("gate");
    }
}

class ANDGate extends Gate {
    constructor(type, id) {
        super(type, id);
        this.gateEl.innerHTML = "AND";
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
        this.gateEl.innerHTML = "NOT";
    }
    returnValue(a) {
        return !a;
    }
    clone() {
        return new NOTGate(this.type, this.id);
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