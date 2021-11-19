const main = document.querySelector("main");
const draggableGates = document.querySelectorAll(".draggable-gate");
const gates = [];
let dragElementId;

draggableGates.forEach((el) => {
    el.addEventListener("dragstart", () => {
        console.log("dragstart");
        dragElementId = el.getAttribute("id");
    });
    el.addEventListener("dragend", () => {
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
});

main.addEventListener("drop", function(event) {
    const id = dragElementId;
    switch(id) {
        case "ANDGate":
            gates.push(new ANDGate("AND", gates.length));
            break;
        case "NOTGate":
            gates.push(new NOTGate("NOT", gates.length));
            break;
    }
});

class Gate {
    gateEl = document.createElement("div");
    constructor(type, id) {
        this.type;
        this.id = id;
        this.displayGate(type);
    }
    displayGate(type) {
        this.gateEl.classList.add("gate");
        main.appendChild(this.gateEl);
        this.gateEl.innerHTML = type;
    }
}

class ANDGate extends Gate {
    returnValue(a, b) {
        if(a === true && b === true) {
            return true;
        }else {
            return false;
        }
    }
}

class NOTGate extends Gate {
    returnValue(a) {
        return !a;
    }
}