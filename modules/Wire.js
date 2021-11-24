import { wires, gates, main, inputs } from "../main.js";

export class Wire {
    id = wires.length;
    el = document.createElementNS("http://www.w3.org/2000/svg", "path");;
    con = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    nextGateId;
    width;
    height;
    constructor(el1, el2) {
        this.el1 = {element: el1, position: { x:el1.offsetLeft, y:el1.offsetTop}};
        this.el2 = {element: el2, position: { x:el2.offsetLeft, y:el2.offsetTop}};
        this.transfer();
        this.draw();
    }
    transfer() {
        if(!this.el2.element.classList.contains("main-input")) {
            if(this.el1.element.classList.contains("true")){
                const myArray = this.el2.element.id.split("-");
                console.log(true, +myArray[1]);
                this.nextGateId = +myArray[1];
                const id = +myArray[0];
                gates[this.nextGateId].inputs[id].setInputValue(true, this.nextGateId);
            }else if(this.el1.element.classList.contains("false")) {
                const myArray = this.el2.element.id.split("-");
                console.log(true, +myArray[1]);
                this.nextGateId = +myArray[1];
                const id = +myArray[0];
                gates[this.nextGateId].inputs[id].setInputValue(false, this.nextGateId);
            }
        }else {
            if(this.el1.element.classList.contains("true")){
                this.el2.element.classList.add("true");
                this.el2.element.classList.remove("false");
            }else if(this.el1.element.classList.contains("false")) {
                this.el2.element.classList.add("false");
                this.el2.element.classList.remove("true");
            }
        }
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
            this.height = 0;
        }
        this.height += 20;
        this.width += 20;
        this.con.setAttribute("width", this.width);
        this.con.setAttribute("height", this.height);
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
        // this.el.setAttribute("d", `M 0 0 H ${this.width/2}  ${this.width/2},${this.height} ${this.width},${this.height}`);
        this.con.appendChild(this.el);
        main.appendChild(this.con);
        this.el.addEventListener("click", () => {
            console.log("dipa");
        });
    }
}