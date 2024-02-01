// Getting DOM elements
const pickerContainer = document.getElementById('pickerContainer');
const currentColorBox = document.getElementById('currentColorBox');
const currentColorLabel = document.getElementById('currentColorLabel');
const goalColorBox = document.getElementById('goalColorBox');
const goalColorLabel = document.getElementById('goalColorLabel');
const nextButton = document.getElementById('nextButton');
const DECIMAL_PLACES = 2;
let goalColor;

// Draw picker
const picker = colorjoe.rgb(pickerContainer, 'red', '');
picker.on("change", color => {
    if (!nextButton.classList.contains('newGame')) {
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
    console.log(computeLabDistance(picker.get(), goalColor));
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

function computeRgbDistance(col1, col2) {
    let dr = col2.red() - col1.red();
    let dg = col2.green() - col1.green();
    let db = col2.blue() - col1.blue();
    let distance = Math.sqrt(dr * dr + dg * dg + db * db);
    distance /= Math.sqrt(3);
    return (distance * 100).toFixed(DECIMAL_PLACES);
}

function computeLabDistance(col1, col2) {
    const col1Arr = labColor(col1);
    const col2Arr = labColor(col2);
    const l1 = col1Arr[0];
    const a1 = col1Arr[1];
    const b1 = col1Arr[2];
    const l2 = col2Arr[0];
    const a2 = col2Arr[1];
    const b2 = col2Arr[2];

    // https://github.com/hamada147/IsThisColourSimilar/
    // Utility functions added to Math Object
    Math.rad2deg = function (rad) {
        return 360 * rad / (2 * Math.PI);
    };
    Math.deg2rad = function (deg) {
        return (2 * Math.PI * deg) / 360;
    };
    // Start Equation
    // Equation exist on the following URL http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
    const avgL = (l1 + l2) / 2;
    const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    const avgC = (c1 + c2) / 2;
    const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;

    const a1p = a1 * (1 + g);
    const a2p = a2 * (1 + g);

    const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
    const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));

    const avgCp = (c1p + c2p) / 2;

    let h1p = Math.rad2deg(Math.atan2(b1, a1p));
    if (h1p < 0) {
        h1p = h1p + 360;
    }

    let h2p = Math.rad2deg(Math.atan2(b2, a2p));
    if (h2p < 0) {
        h2p = h2p + 360;
    }

    const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;

    const t = 1 - 0.17 * Math.cos(Math.deg2rad(avghp - 30)) + 0.24 * Math.cos(Math.deg2rad(2 * avghp)) + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));

    let deltahp = h2p - h1p;
    if (Math.abs(deltahp) > 180) {
        if (h2p <= h1p) {
            deltahp += 360;
        } else {
            deltahp -= 360;
        }
    }

    const deltalp = l2 - l1;
    const deltacp = c2p - c1p;

    deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(Math.deg2rad(deltahp) / 2);

    const sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
    const sc = 1 + 0.045 * avgCp;
    const sh = 1 + 0.015 * avgCp * t;

    const deltaro = 30 * Math.exp(-(Math.pow((avghp - 275) / 25, 2)));
    const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
    const rt = -rc * Math.sin(2 * Math.deg2rad(deltaro));

    const kl = 1;
    const kc = 1;
    const kh = 1;

    const deltaE = Math.sqrt(Math.pow(deltalp / (kl * sl), 2) + Math.pow(deltacp / (kc * sc), 2) + Math.pow(deltahp / (kh * sh), 2) + rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh)));

    return deltaE.toFixed(DECIMAL_PLACES);
}

function labColor(colorObj) {
    // https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e
    let x = (colorObj.xyz()._x * 100) / 95.047;
    let y = colorObj.xyz()._y;
    let z = (colorObj.xyz()._z * 100) / 108.883;

    // XYZ to Lab (Observer = 2°, Illuminant = D65)
    if (x > 0.008856) {
        x = Math.pow(x, 0.333333333)
    } else {
        x = 7.787 * x + 0.137931034
    }

    if (y > 0.008856) {
        y = Math.pow(y, 0.333333333)
    } else {
        y = 7.787 * y + 0.137931034
    }

    if (z > 0.008856) {
        z = Math.pow(z, 0.333333333)
    } else {
        z = 7.787 * z + 0.137931034
    }

    const l = (116 * y) - 16
    const a = 500 * (x - y)
    const b = 200 * (y - z)

    return [l, a, b];
}