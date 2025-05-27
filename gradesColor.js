function showIncorrectValue(){
    console.log(grades)
    for (i = 0; i < subjects.length; i++){
        if (grades[subjects[i].name].length === 3){
            for (let j = 0; j < grades[subjects[i].name][1][1].length; j++) {
                if (grades[subjects[i].name][1][1][j] === "incorrect value" || Number(grades[subjects[i].name][1][1][j]) < 0 || Number(grades[subjects[i].name][1][1][j]) > 20){
                    document.querySelector("#" + subjects[i].name + " .left").children[j+1].classList.add("incorrect");
                }
                else {
                    document.querySelector("#" + subjects[i].name + " .left").children[j+1].classList.remove("incorrect");
                }
            }
            for (let j = 0; j < grades[subjects[i].name][2][1].length; j++) {
                if (grades[subjects[i].name][2][1][j] === "incorrect value" || Number(grades[subjects[i].name][2][1][j]) < 0 || Number(grades[subjects[i].name][2][1][j]) > 5){
                    document.querySelector("#" + subjects[i].name + " .right").children[j+1].classList.add("incorrect");
                }
                else {
                    document.querySelector("#" + subjects[i].name + " .right").children[j+1].classList.remove("incorrect");
                }
            }
        }
        else if (grades[subjects[i].name].length === 2){
            for (let j = 0; j < grades[subjects[i].name][1][1].length; j++) {
                if (grades[subjects[i].name][1][1][j] === "incorrect value" || Number(grades[subjects[i].name][1][1][j]) < 0 || Number(grades[subjects[i].name][1][1][j]) > 5){
                    document.querySelector("#" + subjects[i].name + " .center").children[j+1].classList.add("incorrect");
                }
                else {
                    document.querySelector("#" + subjects[i].name + " .center").children[j+1].classList.remove("incorrect");
                }
            }
        }

    }
}