const gradeParagraphOn5 = document.querySelector("#gradeOn5");
const gradeParagraphOn20 = document.querySelector("#gradeOn20");
const addGradeCallback = (event) => {addGrade(event.target.value, event.target)};
const removeGradeCallback = (event) => {removeGrade(event.target.value, event.target)};

function GradeListener() {
    document.querySelectorAll("input").forEach((element) => {
        if (element.classList.contains("submit")) {
            element.addEventListener("input", addGradeCallback);
        }
        else if (element.classList.contains("grade")){
            element.addEventListener("input", removeGradeCallback);
        }
    })
}

function addGrade(grade, inputElement) {
    if (grade.trim() === "" ) {
        return;
    }
    let newGrade;
    if (inputElement.parentElement.classList.contains("left")) {
        newGrade = gradeParagraphOn20.cloneNode(true).content;
    }
    else if (inputElement.parentElement.classList.contains("right") || inputElement.parentElement.classList.contains("center")) {
        newGrade = gradeParagraphOn5.cloneNode(true).content;
    }

    newGrade.addEventListener("input", addGradeCallback);

    inputElement.removeEventListener("input", addGradeCallback);
    inputElement.classList.remove("submit");
    inputElement.classList.add("grade");
    inputElement.after(newGrade);
    GradeListener();
}

function removeGrade(grade, inputElement) {
    if (grade.trim() === "" ) {
        inputElement.remove();
    }
}