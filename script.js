const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordlength = 10;
let checkCount = 0;
//let strength circle color to grey

setIndicator("#ccc");
handleSlider();

//set passwordLength
function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 90));
}

function generateSymbol() {
    const randNum = getRandInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible.
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swapping
    }
    return array.join("");
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if (checkbox.checked) checkCount++;
    });

    //special condition
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', e => {
    passwordlength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining addition
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log('done');
    
    //show in UI
    passwordDisplay.value = password;

    //calculate Strength
    calcStrength();
});
