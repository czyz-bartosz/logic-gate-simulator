import { Input } from "./Input.js";
import { Output } from "./Output.js";
import { gates, wires } from "../main.js";
export {Gate, NOTGate, ANDGate, MyGate};

class Gate {
    element = document.createElement("div");
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
        this.element.classList.add("gate");
        this.generateInputsCon();
        this.element.appendChild(this.text);
        this.generateOutputsCon();
        this.addInputsAndOutput();
    }
    generateInputsCon() {
        this.inputsConEl.classList.add("inputs");
        this.element.appendChild(this.inputsConEl);
    }
    generateOutputsCon() {
        this.outputsConEl.classList.add("outputs");
        this.element.appendChild(this.outputsConEl);
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
    move() {
        this.outputs.forEach((el, id) => {
            this.outputs[id]?.wires.forEach((el, idW) => {
                wires[this.outputs[id].wires[idW]].draw();
            });
        });
        this.inputs.forEach((el, id) => {
            wires[this.inputs[id].wire]?.draw();
        });
    }
}

class ANDGate extends Gate {
    functionStringHead = "AND(";
    functionStringTail = ")";
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
    clone( id = (gates.length + "-gate") ) {
        return new ANDGate(id);
    }
    changeStatus() {
        if(this.returnValue(this.inputs[0].currentValue, this.inputs[1].currentValue)) {
            this.outputs[0].currentValue = true;
            this.outputs[0].outputEl.classList.add("true");
            this.outputs[0].outputEl.classList.remove("false");
        }else {
            this.outputs[0].currentValue = false;
            this.outputs[0].outputEl.classList.add("false");
            this.outputs[0].outputEl.classList.remove("true");
        }
        this.outputs[0].wires.forEach((el) => {
            wires[el].transfer();
        });
    }
}

class NOTGate extends Gate {
    amountOfInputs = 1;
    functionStringHead = "NOT(";
    functionStringTail = ")";
    constructor(id, inputs, outputs) {
        super(id, 1, 1);
        this.text.innerHTML += "NOT";
    }
    returnValue(a) {
        return !a;
    }
    clone(id = (gates.length + "-gate")) {
        return new NOTGate(id);
    }
    changeStatus() {
        if(this.returnValue(this.inputs[0].currentValue)) {
            this.outputs[0].currentValue = true;
            this.outputs[0].outputEl.classList.add("true");
            this.outputs[0].outputEl.classList.remove("false");
        }else {
            this.outputs[0].currentValue = false;
            this.outputs[0].outputEl.classList.add("false");
            this.outputs[0].outputEl.classList.remove("true");
        }
        this.outputs[0].wires.forEach((el) => {
            wires[el].transfer();
        });
    }
}

class MyGate extends Gate {
    functionStringHead;
    functionStringTail;
    constructor(id, inputs, outputs, functionStringArray, outputsArray) {
        super(id, inputs, outputs);
        this.text.innerHTML += "MyGate";
        this.functionString = functionStringArray;
        this.outputsArray = outputsArray;
        this.makeStringArr = [...this.makeString()];
        this.stringIndexArr = [...this.stringIndex()];
        console.log("a", this.makeStringArr, this.stringIndexArr)
    }
    makeString() {
        const arr = [];
        this.functionString.forEach((string) => {
            let str = string;
            this.outputsArray.forEach((value, index) => {
                str = str.replaceAll(value+",", 'g'+index+'k');
            });
            arr.push(str);
        });
        return arr;
    }
    stringIndex() {
        const arr = [];
        this.makeStringArr.forEach((string) => {
            const a = [];
            let from = 0;
            while(true) {
                const gPosition = string.indexOf("g", from);
                const kPosition = string.indexOf("k", from);
                console.log(gPosition, kPosition)
                from = kPosition + 1;
                if(kPosition !== -1) {
                    a.push([gPosition, kPosition]);
                    console.log(a);
                }else {
                    break;
                }
            }
            arr.push(a);
        });
        return arr;
    }
    clone(id = (gates.length + "-gate")) {
        return new MyGate(id, this.amountOfInputs, this.amountOfOutputs, this.functionString, this.outputsArray);
    }
    changeStatus() {
        const valueArray = this.inputs.map((el) => {
            return el.currentValue;
        });

        this.functionString.forEach((value, outputIndex) => {
            let string = value;
            this.outputsArray.forEach((outputId, index) => {
                string = string.replaceAll(outputId, valueArray[index]);
            });
            const result = eval(string);
            if(result) {
                this.outputs[outputIndex].currentValue = true;
                this.outputs[outputIndex].outputEl.classList.add("true");
                this.outputs[outputIndex].outputEl.classList.remove("false");
            }else {
                this.outputs[outputIndex].currentValue = false;
                this.outputs[outputIndex].outputEl.classList.add("false");
                this.outputs[outputIndex].outputEl.classList.remove("true");
            }
        });
        this.outputs.forEach((el) => {
            el.wires.forEach((el) => {
                wires[el].transfer();
            });
        });
    }
}

function AND(a, b) {
    return a && b ? true : false;
}

function NOT(a) {
    return !a;
}