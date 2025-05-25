const gradeParagraphOn5 = document.querySelector("#gradeOn5");
const gradeParagraphOn20 = document.querySelector("#gradeOn20");
const addGradeCallback = (event) => {addGrade(event.target.value, event.target)};
const changeGradeValueCallback = (event) => {changeGradeValue(event.target.value, event.target)};

function GradeListener() {
    document.querySelectorAll("input").forEach((element) => {
        if (element.classList.contains("submit")) {
            element.addEventListener("input", addGradeCallback);
        }
        else if (element.classList.contains("grade")){
            element.addEventListener("input", changeGradeValueCallback);
        }
    })
}

function addGrade(grade, inputElement) {
    if (grade.trim() === "" ) {
        return;
    }
    let newGrade;
    if (inputElement.parentElement.classList.contains("left") || inputElement.parentElement.classList.contains("right")) {
        if (inputElement.parentElement.classList.contains("left")){
            newGrade = gradeParagraphOn20.cloneNode(true).content;
            grades[inputElement.parentElement.parentElement.parentElement.id][1][1].push(checkGrade(grade));
        }
        else {
            newGrade = gradeParagraphOn5.cloneNode(true).content;
            grades[inputElement.parentElement.parentElement.parentElement.id][2][1].push(checkGrade(grade));
        }

    }
    else if (inputElement.parentElement.classList.contains("center")) {
        newGrade = gradeParagraphOn5.cloneNode(true).content;
        grades[inputElement.parentElement.parentElement.id][1][1].push(grade);
    }
    console.log(grades);
    newGrade.addEventListener("input", addGradeCallback);

    inputElement.removeEventListener("input", addGradeCallback);
    inputElement.classList.remove("submit");
    inputElement.classList.add("grade");
    inputElement.after(newGrade);
    showIncorrectValue();
    calculateMean();
    GradeListener();
}

function getPositionInDOM(inputElement) {
    let position = 0;
    let sibling = inputElement.previousElementSibling;

    while (sibling) {
        position++;
        sibling = sibling.previousElementSibling;
    }
    position--;
    return position;
}

function removeGrade(grade, inputElement) {
    if (grade.trim() === "" ) {
        if (inputElement.parentElement.classList.contains("left")){
            grades[inputElement.parentElement.parentElement.parentElement.id][1][1].splice(getPositionInDOM(inputElement), 1)
        }
        else if (inputElement.parentElement.classList.contains("right")){
            grades[inputElement.parentElement.parentElement.parentElement.id][2][1].splice(getPositionInDOM(inputElement), 1)
        }
        else if (inputElement.parentElement.classList.contains("center")){
            grades[inputElement.parentElement.parentElement.parentElement.id][1][1][position] = checkGrade(grade);
        }
        inputElement.remove();
        calculateMean();
        return true;
    }
    else {
        return false;
    }
}

function changeGradeValue(grade, inputElement) {
    if (removeGrade(grade, inputElement) === false){
        if (inputElement.parentElement.classList.contains("left")){
            grades[inputElement.parentElement.parentElement.parentElement.id][1][1][getPositionInDOM(inputElement)] = checkGrade(grade,20);
        }
        else if (inputElement.parentElement.classList.contains("right")){
            grades[inputElement.parentElement.parentElement.parentElement.id][2][1][getPositionInDOM(inputElement)] = checkGrade(grade,20);
        }
        else if (inputElement.parentElement.classList.contains("center")){
            grades[inputElement.parentElement.parentElement.parentElement.id][1][1][getPositionInDOM(inputElement)] = checkGrade(grade,5);
        }
    }
    //console.log(grades);
    showIncorrectValue();
    calculateMean();
}

function checkGrade(grade,maxGrade){
    console.log(grade, grade.match(/[0-9]+,?[0-9]*/g));
    if (grade.match(/\d/g) === null || grade.match(/[0-9]+,?[0-9]*/g)[0] !== grade) {
        return "incorrect value";
    }
    if (grade > maxGrade || grade < 0) {
        return "incorrect value";
    }
    else {
        return Number(grade.replace(",", "."));
    }
}