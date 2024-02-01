// Getting DOM elements
const pickerContainer = document.getElementById('pickerContainer');
const currentColorBox = document.getElementById('currentColorBox');
const currentColorLabel = document.getElementById('currentColorLabel');
const goalColorBox = document.getElementById('goalColorBox');
const goalColorLabel = document.getElementById('goalColorLabel');
const nextButton = document.getElementById('nextButton');
let goalColor;

// Draw picker
const picker = colorjoe.rgb(pickerContainer, 'red', '');
picker.on("change", color => {
    if (!nextButton.classList.contains('newGame')){
        currentColorBox.style.backgroundColor = color.css()
        currentColorLabel.style.color = color.xyz()._y >= 0.5 ? 'black' : 'white';
    }
});

// Reset
resetGame();

// Button event listener
nextButton.addEventListener('click', buttonClick);

function generateNewGoalColor() {
    const hexadecimalDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    let random, colorHex = "#";
    for (i = 0; i < 6; i++) {
        random = Math.floor(Math.random() * 16);
        colorHex += hexadecimalDigits[random];
    }
    goalColorLabel.innerText = colorHex;
    colorObj = one.color(colorHex);
    return colorObj;
}

function buttonClick() {
    nextButton.classList.toggle('newGame');
    if (nextButton.classList.contains('newGame')) {
        showResults();
    } else {
        resetGame();
    }
}

function showResults() {
    nextButton.innerText = 'New game';
    console.log(computeRgbDistance(picker.get(), goalColor));
    goalColorBox.style.backgroundColor = goalColor.hex().toUpperCase();
    goalColorLabel.style.color = goalColor.xyz()._y >= 0.5 ? 'black' : 'white';
    currentColorLabel.innerText = picker.get().hex().toUpperCase();
}

function resetGame() {
    nextButton.innerText = 'Show score';
    goalColor = generateNewGoalColor();
    goalColorBox.style.backgroundColor = '#ddd';
    goalColorLabel.style.color = 'black';
    currentColorLabel.innerText = '??????';
    picker.set('red');
}

function computeRgbDistance(c1, c2) {
    let dr = c2.red() - c1.red();
    let dg = c2.green() - c1.green();
    let db = c2.blue() - c1.blue();
    let distance = Math.sqrt(dr * dr + dg * dg + db * db);
    distance /= Math.sqrt(3);
    return Math.floor(distance * 1000) / 10;
}

function computeLabDistance(c1, c2) {

}