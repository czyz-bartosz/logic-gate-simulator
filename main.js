const main = document.querySelector("main");
const gates = [];

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

gates.push(new ANDGate("AND", gates.length));
gates.push(new NOTGate("NOT", gates.length));