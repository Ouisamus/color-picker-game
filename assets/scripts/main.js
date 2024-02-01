const pickerContainer = document.getElementById('pickerContainer');

// pick random color

const picker = colorjoe.rgb(pickerContainer, '#f00', '');
const currentColorBox = document.getElementById('currentColorBox');
const currentColorLabel = document.getElementById('currentColorLabel');
picker.on("change", color => {
    currentColorBox.style.backgroundColor = color.css()
    let textColor = color.xyz()._y >= 0.5 ? 'black' : 'white';
    currentColorLabel.style.color = textColor;
});
