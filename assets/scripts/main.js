// Getting DOM elements
const pickerContainer = document.getElementById('pickerContainer');
const currentColorBox = document.getElementById('currentColorBox');
const currentColorLabel = document.getElementById('currentColorLabel');
const goalColorBox = document.getElementById('currentColorBox');
const goalColorLabel = document.getElementById('goalColorLabel');
goalColor = generateNewGoalColor();

// Draw picker
const picker = colorjoe.rgb(pickerContainer, '#ff0000', '');
picker.on("change", color => {
    currentColorBox.style.backgroundColor = color.css()
    let textColor = color.xyz()._y >= 0.5 ? 'black' : 'white';
    currentColorLabel.style.color = textColor;
});

// Next button event listener

function generateNewGoalColor(){
    const hexadecimalDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    let random, color = "#";
    for(i = 0; i < 6; i++){
        random = Math.floor(Math.random() * 16);
        color += hexadecimalDigits[random];
    }
    goalColorLabel.innerText = color;
    return color;
}

