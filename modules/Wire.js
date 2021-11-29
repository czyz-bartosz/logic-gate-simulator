import { wires, gates, workArea } from "../main.js";

function getPosition(el) {
    const eleRect = el.getBoundingClientRect();
    const targetRect = workArea.getBoundingClientRect();

    const y = eleRect.top - targetRect.top;
    const x = eleRect.left - targetRect.left;
    
    return {x, y};
}

export class Wire {
    id = wires.length;
    el = document.createElementNS("http://www.w3.org/2000/svg", "path");;
    con = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    nextGateId;
    width;
    height;
    constructor(el1, el2) {
        this.el1 = {element: el1, position: {...getPosition(el1)}};
        this.el2 = {element: el2, position: {...getPosition(el2)}};
        this.array1 = el1.id.split("-");
        this.array2 = el2.id.split("-");
        if(this.array1[3]) {
            gates[this.array1[3]]?.outputs[this.array1[0]].wires.push(this.id);
        }else {
            gates[this.array1[1]]?.outputs[this.array1[0]].wires.push(this.id);
        }
        gates[this.array2[1]].inputs[this.array2[0]].wire = this.id;
        this.transfer();
        this.draw();
        this.addElement();
    }
    setPosition() {
        this.el1.position = {...getPosition(this.el1.element)};
        this.el2.position = {...getPosition(this.el2.element)};
    }
    transfer() {
        if(this.el1.element.classList.contains("true")){
            const myArray = this.el2.element.id.split("-");
            this.nextGateId = +myArray[1];
            const id = +myArray[0];
            gates[this.nextGateId].inputs[id].setInputValue(true, this.nextGateId);
        }else if(this.el1.element.classList.contains("false")) {
            const myArray = this.el2.element.id.split("-");
            this.nextGateId = +myArray[1];
            const id = +myArray[0];
            gates[this.nextGateId].inputs[id].setInputValue(false, this.nextGateId);
        }
    }
    draw() {
        this.setPosition();
        if(this.el1.position.x > this.el2.position.x - 60) {
            this.width = this.el1.position.x - this.el2.position.x + 120;
        }else {
            this.width = this.el2.position.x - this.el1.position.x;
        }
        if(this.el1.position.y > this.el2.position.y) {
            this.height = this.el1.position.y - this.el2.position.y;
        }else if(this.el1.position.y < this.el2.position.y){
            this.height = this.el2.position.y - this.el1.position.y;
        }else {
            this.height = 0;
        }
        this.height += 20;
        this.width += 20;
        this.con.setAttribute("width", this.width);
        this.con.setAttribute("height", this.height);
        if(this.el1.position.x < this.el2.position.x - 60) {
            if(this.el1.position.y > this.el2.position.y) {
                this.el.setAttribute("d", `M 0 ${this.height - 10} H ${this.width/2} V 10 H ${this.width}`);
                this.con.setAttribute("style", `top: ${this.el2.position.y}px; left: ${this.el1.position.x}px`);
            }else if(this.el1.position.y < this.el2.position.y){
                this.el.setAttribute("d", `M 0 10 H ${this.width/2} V ${this.height - 10} H ${this.width}`);
                this.con.setAttribute("style", `top: ${this.el1.position.y}px; left: ${this.el1.position.x}px`);
            }else {
                this.el.setAttribute("d", `M 0 ${this.height / 2} H ${this.width}`);
                this.con.setAttribute("style", `top: ${this.el1.position.y}px; left: ${this.el1.position.x}px`);
            }
        }else {
            if(this.el1.position.y >= this.el2.position.y) {
                this.el.setAttribute("d", `M 60 10 H 6 V ${this.height / 2} H ${this.width - 6} V ${this.height - 10} H ${this.width - 60}`);
                this.con.setAttribute("style", `top: ${this.el2.position.y}px; left: ${this.el2.position.x - 60}px`);
            }else if(this.el1.position.y < this.el2.position.y){
                this.el.setAttribute("d", `M ${this.width - 60} 10 H ${this.width - 6} V ${this.height / 2} H 6 V ${this.height - 10} H 60`);
                this.con.setAttribute("style", `top: ${this.el1.position.y}px; left: ${this.el2.position.x - 60}px`);
            }
        }
    }
    addElement() {
        this.con.appendChild(this.el);
        workArea.appendChild(this.con);
        this.el.addEventListener("click", (el) => {
            console.log(el.target);
        });
    }
}