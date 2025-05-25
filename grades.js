let grades = {};
function createListOfGrades(){
    for (i = 0; i < subjects.length; i++){
        if (subjects[i].eval.length === 1) {
            grades[subjects[i].name] = [subjects[i].coeff,[subjects[i].eval[0].coeff,[]]];
        }
        else if (subjects[i].eval.length === 2) {
            grades[subjects[i].name] = [subjects[i].coeff,[subjects[i].eval[0].coeff,[]],[subjects[i].eval[1].coeff,[]]];
        }
    }
    //console.log(grades);
}