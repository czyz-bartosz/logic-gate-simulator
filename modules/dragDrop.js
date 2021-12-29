import { makeConnection, workArea } from "../main.js";

export function addDragging(ele, dragzone, dragFunction, moveFunction, dropFunction) {
    ele.addEventListener("mousedown", (event) => {
        ele.style.zIndex = "100";
        if(dragFunction) {
            dragFunction();
        }
        const shiftX = event.clientX - ele.getBoundingClientRect().left;
        const shiftY = event.clientY - ele.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            ele.style.left = pageX - shiftX + 'px';
            ele.style.top = pageY - shiftY + 'px';
        }

        onMouseMove(event);

        function onMouseMove(event) {
            const rect = dragzone.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            moveAt(x, y);
            if(moveFunction) {
                moveFunction();
            }
        }

        document.addEventListener("mousemove", onMouseMove);

        function drop() {
            ele.style.zIndex = "1";
            document.removeEventListener("mousemove", onMouseMove);
            ele.removeEventListener("mouseup", drop);
            if(dropFunction) {
                dropFunction();
            }
        }

        ele.addEventListener("mouseup", drop);
    });
    ele.addEventListener("dragstart", () => false );
}

export function dragWire(ele, dragzone) {
    ele.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const con = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        con.appendChild(path);
        workArea.appendChild(con);
        
        function getPosition(ele) {
            const eleRect = ele.getBoundingClientRect();
            const targetRect = workArea.getBoundingClientRect();
        
            const y = eleRect.top - targetRect.top;
            const x = eleRect.left - targetRect.left;
            
            return {x, y};
        }
        const elePosition = getPosition(ele);
        const mousePosition = {};


        function onMouseMove(event) {
            const rect = dragzone.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            mousePosition.x = x;
            mousePosition.y = y;
            if(ele.classList.contains("input")) {
                draw(elePosition, mousePosition);
            }else {
                draw(mousePosition, elePosition);
            }
        }

        document.addEventListener("mousemove", onMouseMove);

        function drop(event) {
            event.stopPropagation();
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            if(elemBelow.classList.contains("input") || elemBelow.classList.contains("output")) {
                makeConnection(ele);
                makeConnection(elemBelow);
            }
            document.removeEventListener("mousemove", onMouseMove);
            con.remove();
            document.removeEventListener("mouseup", drop);
        }

        document.addEventListener("mouseup", drop);

        function draw(el1, ele2) {
            let width;
            let height;
            if(ele2.x > el1.x - 60) {
                width = ele2.x - el1.x + 120;
            }else {
                width = el1.x - ele2.x;
            }
            if(ele2.y > el1.y) {
                height = ele2.y - el1.y;
            }else if(ele2.y < el1.y){
                height = el1.y - ele2.y;
            }else {
                height = 0;
            }
            height += 20;
            width += 20;
            con.setAttribute("width", width);
            con.setAttribute("height", height);
            if(ele2.x < el1.x - 60) {
                if(ele2.y > el1.y) {
                    path.setAttribute("d", `M 0 ${height - 10} H ${width/2} V 10 H ${width}`);
                    con.setAttribute("style", `top: ${el1.y}px; left: ${ele2.x}px`);
                }else if(ele2.y < el1.y){
                    path.setAttribute("d", `M 0 10 H ${width/2} V ${height - 10} H ${width}`);
                    con.setAttribute("style", `top: ${ele2.y}px; left: ${ele2.x}px`);
                }else {
                    path.setAttribute("d", `M 0 ${height / 2} H ${width}`);
                    con.setAttribute("style", `top: ${ele2.y}px; left: ${ele2.x}px`);
                }
            }else {
                if(ele2.y >= el1.y) {
                    path.setAttribute("d", `M 60 10 H 6 V ${height / 2} H ${width - 6} V ${height - 10} H ${width - 60}`);
                    con.setAttribute("style", `top: ${el1.y}px; left: ${el1.x - 60}px`);
                }else if(ele2.y < el1.y){
                    path.setAttribute("d", `M ${width - 60} 10 H ${width - 6} V ${height / 2} H 6 V ${height - 10} H 60`);
                    con.setAttribute("style", `top: ${ele2.y}px; left: ${el1.x - 60}px`);
                }
            }
        }
    });
    ele.addEventListener("dragstart", () => false );
}