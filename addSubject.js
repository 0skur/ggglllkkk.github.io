function addSubject(){
    const subjectContainer = document.querySelector("main");
    const mainSubjectTemplate = document.querySelector("#mainSubject");
    const secondarySubjectTemplate = document.querySelector("#secondarySubject");

    for (let i = 0; i < subjects.length; i++){
        if (subjects[i].eval.length === 1){
            newSubject = secondarySubjectTemplate.cloneNode(true).content;
            newSubject.querySelector(".center > .type").innerHTML = subjects[i].eval[0].type + ", coeff: " + subjects[i].eval[0].coeff;
        }
        else if (subjects[i].eval.length === 2){
            newSubject = mainSubjectTemplate.cloneNode(true).content;
            newSubject.querySelector(".left > .type").innerHTML = subjects[i].eval[0].type + ", coeff: " + subjects[i].eval[0].coeff;
            newSubject.querySelector(".right > .type").innerHTML = subjects[i].eval[1].type + ", coeff: " + subjects[i].eval[1].coeff;
        }
        newSubject.querySelector(".description").innerHTML = subjects[i].name + ", coeff: " + subjects[i].coeff;
        newSubject.querySelector(".subject").id = subjects[i].name;

        subjectContainer.appendChild(newSubject);
    }
}