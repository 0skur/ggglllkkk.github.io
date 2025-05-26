let meanPerSubject = {};
let mean = 0;
function createMean(){
    for (i = 0; i < subjects.length; i++){
        meanPerSubject[subjects[i].name] = null;
    }
}

function showMean(){
    subjects.forEach(subject => {
        let meanOn1 = ["Maths","Physique","Chimie","Bio"];
        if (!isNaN(meanPerSubject[subject.name])){
            if (meanOn1.includes(subject.name)){
                document.querySelector("#" + subject.name + " .meanValue").innerHTML = meanPerSubject[subject.name].toFixed(2);
            }
            else {
                document.querySelector("#" + subject.name + " .meanValue").innerHTML = meanPerSubject[subject.name].toFixed(2)/4;
            }
        }
        else {
            document.querySelector("#" + subject.name + " .meanValue").innerHTML = "";
        }
    })
    document.querySelector("#mean").innerHTML = mean.toFixed(2);
    document.querySelector(".mean").classList.remove("hidden");
}

function calculateMean(){
    subjects.forEach(subject => {
        let sum = 0;
        let count = 0;
        if (grades[subject.name].length === 3){
            for (i = 0; i < grades[subject.name][1][1].length; i++){
                if (grades[subject.name][1][1][i] !== "incorrect value"){
                    sum += Number(grades[subject.name][1][1][i]) * Number(grades[subject.name][1][0]);
                    count += Number(grades[subject.name][1][0]);
                }
            }
            for (i = 0; i < grades[subject.name][2][1].length; i++){
                if (grades[subject.name][2][1][i] !== "incorrect value"){
                    sum += Number(grades[subject.name][2][1][i]) * Number(grades[subject.name][2][0]) * 4;
                    count += Number(grades[subject.name][2][0]);
                }
            }
        }
        else if (grades[subject.name].length === 2){
            for (i = 0; i < grades[subject.name][1][1].length; i++){
                if (grades[subject.name][1][1][i] !== "incorrect value"){
                    sum += Number(grades[subject.name][1][1][i]) * Number(grades[subject.name][1][0]) * 4;
                    count += Number(grades[subject.name][1][0]);
                }
            }

        }
        meanPerSubject[subject.name] = sum / count;
    })
    //console.log(meanPerSubject);
    let sum = 0;
    let count = 0;
    subjects.forEach(subject => {
        if (!isNaN(meanPerSubject[subject.name])){
            sum += Number(meanPerSubject[subject.name]) * Number(subject.coeff);
            count += Number(subject.coeff);
        }
    })
    mean = sum / count;
    //console.log(mean);

    showMean();
}

