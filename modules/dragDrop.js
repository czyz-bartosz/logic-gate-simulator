export function addDragDrop(ele, dragzone, dragFunction, moveFunction, dropFunction) {
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