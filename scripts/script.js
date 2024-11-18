const undoBtn = document.querySelector('.fa-rotate-left');
const redoBtn = document.querySelector('.fa-rotate-right');
const fontStyleSelect = document.getElementById('font-style');
const fontSizeInput = document.getElementById('font-size');
const fontSizeIncrease = document.querySelector('.fa-plus');
const fontSizeDecrease = document.querySelector('.fa-minus');
const boldBtn = document.querySelector('.fa-bold');
const italicBtn = document.querySelector('.fa-italic');
const underlineBtn = document.querySelector('.fa-underline');
const addTextBtn = document.querySelector('.add-text-btn');
const canvas = document.querySelector('.canvas');

let textObjects = [];
let history = [];
let redoStack = [];
let selectedTextElement = null;

function createTextObject(content, fontStyle, fontSize, fontWeight, fontStyleItalic, textDecoration, positionX, positionY) {
    return {
        content: content,
        fontStyle: fontStyle,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontStyleItalic: fontStyleItalic,
        textDecoration: textDecoration,
        positionX: positionX,
        positionY: positionY
    };
}

addTextBtn.addEventListener('click', () => {
    history.push([...textObjects]);
    redoStack.length = 0;

    const content = 'New Text';
    const fontStyle = fontStyleSelect.value;
    const fontSize = fontSizeInput.value || 16;
    const fontWeight = 'normal';
    const fontStyleItalic = 'normal';
    const textDecoration = 'none';

    
    const positionX = 500;
    const positionY = 100;

    const textObject = createTextObject(content, fontStyle, fontSize, fontWeight, fontStyleItalic, textDecoration, positionX, positionY);

    textObjects.push(textObject);
    renderCanvas();
});

function renderCanvas() {
    canvas.innerHTML = '';

    textObjects.forEach((obj, index) => {
        const textElement = document.createElement('div');
        textElement.contentEditable = true;
        textElement.innerText = obj.content;
        textElement.style.fontFamily = obj.fontStyle;
        textElement.style.fontSize = `${obj.fontSize}px`;
        textElement.style.fontWeight = obj.fontWeight;
        textElement.style.fontStyle = obj.fontStyleItalic;
        textElement.style.textDecoration = obj.textDecoration;
        textElement.style.position = 'absolute';
        textElement.style.left = `${obj.positionX}px`;
        textElement.style.top = `${obj.positionY}px`;
        textElement.style.cursor = 'move';

        textElement.addEventListener('click', (e) => {
            selectedTextElement = e.target;
        });

        textElement.onmousedown = function (event) {
            const shiftX = event.clientX - textElement.getBoundingClientRect().left;
            const shiftY = event.clientY - textElement.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                textElement.style.left = pageX - shiftX + 'px';
                textElement.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            textElement.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                textElement.onmouseup = null;

                textObjects[index].positionX = parseInt(textElement.style.left);
                textObjects[index].positionY = parseInt(textElement.style.top);
            };
        };

        canvas.appendChild(textElement);
    });
}


undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
        redoStack.push([...textObjects]);
        textObjects = history.pop();
        renderCanvas();
    }
});


redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        history.push([...textObjects]);
        textObjects = redoStack.pop(); 
        renderCanvas();
    }
});

boldBtn.addEventListener('click', () => {
    if (selectedTextElement) {
        const isBold = selectedTextElement.style.fontWeight === 'bold';
        selectedTextElement.style.fontWeight = isBold ? 'normal' : 'bold';

        const index = Array.from(canvas.children).indexOf(selectedTextElement);
        textObjects[index].fontWeight = selectedTextElement.style.fontWeight;
    }
});

italicBtn.addEventListener('click', () => {
    if (selectedTextElement) {
        const isItalic = selectedTextElement.style.fontStyle === 'italic';
        selectedTextElement.style.fontStyle = isItalic ? 'normal' : 'italic';

        const index = Array.from(canvas.children).indexOf(selectedTextElement);
        textObjects[index].fontStyleItalic = selectedTextElement.style.fontStyle;
    }
});

underlineBtn.addEventListener('click', () => {
    if (selectedTextElement) {
        const isUnderline = selectedTextElement.style.textDecoration === 'underline';
        selectedTextElement.style.textDecoration = isUnderline ? 'none' : 'underline';

        const index = Array.from(canvas.children).indexOf(selectedTextElement);
        textObjects[index].textDecoration = selectedTextElement.style.textDecoration;
    }
});

fontSizeIncrease.addEventListener('click', () => {
    if (selectedTextElement) {
        const newSize = parseInt(selectedTextElement.style.fontSize) + 2;
        selectedTextElement.style.fontSize = `${newSize}px`;
        fontSizeInput.value = newSize;

        const index = Array.from(canvas.children).indexOf(selectedTextElement);
        textObjects[index].fontSize = newSize;
    }
});

fontSizeDecrease.addEventListener('click', () => {
    if (selectedTextElement) {
        const newSize = parseInt(selectedTextElement.style.fontSize) - 2;
        selectedTextElement.style.fontSize = `${newSize}px`;
        fontSizeInput.value = newSize;

        const index = Array.from(canvas.children).indexOf(selectedTextElement);
        textObjects[index].fontSize = newSize;
    }
});
