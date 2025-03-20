var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["DS", 4], ["tests", 1]]], ["Bio", 3, [["DS", 4], ["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Eco", 1.5, [["tests", 1]]]];
var notes=[]
var globalOutOf=20;
var colorsCoeff = [[0.341328, -10.68, 64.6337, 254.862353], [-0.2791, 6.19454, -12.306, -1.4046463], [-0.1835, 6.657, -46.6007, 4.32]];
var strongColors = false;

// calculates the note's according color
function calculAverageColor(note){
    var colors = [];

    for (let k in colorsCoeff){
        var color = 0
        for (let n in colorsCoeff[k]){
            color+=colorsCoeff[k][n]*Math.pow(note, colorsCoeff[k].length-n-1);
        }
        colors.push(color);
    }

    return "rgb("+colors[0]+","+colors[1]+","+colors[2]+")";
}

// changes the color strength
function changeColorStrength(){
    strongColors = !strongColors;
    calculAverage();
}


// cleans the page
function cleanPage(){
    loadNotes(-1);
    buildTable();
}

// calculs the current average
function calculAverage(){
    var avg=0;
    var coeffSum=0
    var avgModified=false;

    for (let k in notes){
        var subjectAvg=0;
        var subjectCoeffSum=0;
        var subjectAvgModified=false;

        for (let n in notes[k]){
            var subSubjectAvg=0;
            var subSubjectAvgModified = false;
            var numberOfNotes = 0;

            for (let i in notes[k][n]){
                var currentNote = notes[k][n][i]
                if(subjects[k][2][n].length==3){var noteOn = subjects[k][2][n][2];}
                else{var noteOn = 20;}

                // checks if the current note is a number and modifies the parametesr if the note is on a unusual number
                var isNoteValue=true;
                var isNoteOnUnusual = false;
                for (let k in currentNote){isNoteValue &&="0123456789.,/".includes(currentNote[k]); isNoteOnUnusual ||="/".includes(currentNote[k]);}

                // computes if there is a note
                if(currentNote!="" && isNoteValue){
                    if(isNoteOnUnusual){
                        currentNote = currentNote.split("/");
                        noteOn = currentNote[1];
                        currentNote = currentNote[0];
                    }
                    if(currentNote<=noteOn){
                        normalizedNote = parseFloat(currentNote)*100/parseFloat(noteOn);
                        subSubjectAvg+=normalizedNote;
                        numberOfNotes++;
                        subSubjectAvgModified=true;
                    }
                }
            }

            // calculates the average of the subsubject
            if(subSubjectAvgModified){
                subSubjectAvg/=numberOfNotes;
                subjectAvg+=subSubjectAvg*parseFloat(subjects[k][2][n][1]);
                subjectCoeffSum+=parseFloat(subjects[k][2][n][1]);
                subjectAvgModified=true;
                //console.log("subsub", subSubjectAvg);
            }
        }
        
        // calculates the average of the subject and modifies the subject average panel
        var column=document.getElementById("tableDiv").childNodes[k];
        var subjectAverageDivChildNodes = column.childNodes[column.childNodes.length-1].childNodes;
        if(subjectAvgModified){
            subjectAvg/=subjectCoeffSum;
            avg+=subjectAvg*parseFloat(subjects[k][1]);
            coeffSum+=parseFloat(subjects[k][1]);
            avgModified=true;
            //console.log("sub", subjectAvg, subjectCoeffSum);
            

            subjectAverageDivChildNodes[0].innerHTML=(subjectAvg*globalOutOf/100).toFixed(2);
            subjectAverageDivChildNodes[0].visibility="visible";
            subjectAverageDivChildNodes[1].visibility="visible";
            if(!strongColors){
                subjectAverageDivChildNodes[0].style.color = calculAverageColor(subjectAvg*globalOutOf/100);
                document.getElementById("tableDiv").childNodes[k].style.backgroundColor="transparent";
            }
            else{
                document.getElementById("tableDiv").childNodes[k].style.backgroundColor=calculAverageColor(subjectAvg*globalOutOf/100);
                subjectAverageDivChildNodes[0].style.color = "rgb(0,0,0)";
            }
        }
        else{
            subjectAverageDivChildNodes[0].visibility="collapse";
            subjectAverageDivChildNodes[1].visibility="collapse";
            subjectAverageDivChildNodes[0].style.color = "rgb(0,0,0)";
            document.getElementById("tableDiv").childNodes[k].style.backgroundColor="transparent";
        }
    }

    //console.log("avg", avg, coeffSum);

    // calculates the average and modifies the average panel accordingly
    var avgTextField = document.getElementById("average");
    var outOfTextField = document.getElementById("outOf");
    if(avgModified){
        avg/=coeffSum;
        avg/=100/globalOutOf;

        //console.log("moyenne", avg);
        
        avgTextField.innerHTML=avg.toFixed(2);
        avgTextField.style.visibility = "visible";
        outOfTextField.style.visibility = "visible";
        if(!strongColors){
            avgTextField.style.color = calculAverageColor(avg);
            document.body.style.backgroundColor="transparent";
        }
        else{
            document.body.style.backgroundColor=calculAverageColor(avg);
            avgTextField.style.color = "rgb(0,0,0)";
        }
    }
    else{
        avgTextField.style.visibility = "collapse";
        outOfTextField.style.visibility = "collapse";
        avgTextField.style.color = "rgb(0,0,0)";
        document.body.style.backgroundColor="transparent";
    }

}


// loads the saved notes or creates the notes table
function loadNotes(givenNotes=-1){
    if (givenNotes!=-1){
        notes=givenNotes;
    }
    else{
        notes=[];
        for (let k in subjects){
            notes.push([]);
            for (let n in subjects[k][2]){
                notes[k].push([""]);
            }
        }
    }
    localStorage.setItem("notes", JSON.stringify(notes));

    console.log("notes loaded", notes);
}

// called when an input is modified
function inputModified(element){

    // determines the modified field
    var targetedInput = element.target;
    var targetedSubject = targetedInput.id.replace("idInput;", "").split(";");
    var targetedColumn = targetedInput.parentNode

    // verifies if the new value is correct and updates the notes array
    var value = targetedInput.value.replace(",", ".");
    isValueNumber = true;
    //for(let k in value){if("0123456789.,/".includes(value[k])==false){isValueNumber=false;}}
    for(let k in value){isValueNumber &&="0123456789.,/".includes(value[k]);}
    notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]=value;

    // adds a line if there are no more left
    if (targetedSubject[2] == notes[targetedSubject[0]][targetedSubject[1]].length-1 && targetedSubject.value!=""){
        notes[targetedSubject[0]][targetedSubject[1]].push("");
        console.log("newline ?!")
    }

    // gets the last filled line
    var lastFilledLine = -1;
    i=notes[targetedSubject[0]][targetedSubject[1]].length-1;
    while (lastFilledLine==-1 && i>=0){
        if(notes[targetedSubject[0]][targetedSubject[1]][i]!=""){lastFilledLine=i;}
        i--;
        console.log(i, notes[targetedSubject[0]][targetedSubject[1]][i])
    }

    console.log("LASTFILLEDLINE", lastFilledLine+1, notes[targetedSubject[0]][targetedSubject[1]].length-lastFilledLine-2);
    console.log("csc", lastFilledLine, notes[targetedSubject[0]][targetedSubject[1]].length)

    // deletes all the other empty lines
    notes[targetedSubject[0]][targetedSubject[1]].splice(lastFilledLine+1, notes[targetedSubject[0]][targetedSubject[1]].length-lastFilledLine-2);
    
    // saves the changes to the notes
    localStorage.setItem("notes", JSON.stringify(notes));

    console.log(notes);

    buildTable();

    // changes the color of the input if incorrect
    if (!isValueNumber){document.getElementById(targetedInput.id).style.backgroundColor = "red";}
}

// builds the average calcul table
function buildTable(){

    // stores the cursor's location
    var activeElementId = document.activeElement.id;

    // empties the table section
    document.getElementById("tableDiv").innerHTML="";

    // create each subject's column
    for (let k in subjects){

        // creates the column
        var column = document.createElement("div");
        column.classList.add("column");
        //column.style.gridTemplateColumns="repeat("+subjects[k][2].length+", )";

        // creates the column header
        var subjectHeader = document.createElement("div");
        subjectHeader.classList.add("subjectHeader");
        subjectHeader.style.gridColumn = "1 / "+parseInt(subjects[k][2].length+1);
        subjectHeader.innerHTML = subjects[k][0]+", coeff: "+subjects[k][1]
        column.appendChild(subjectHeader);

        // creates the subsubjects 
        for (let n in subjects[k][2]){
            var subSubjectHeader = document.createElement("div");
            subSubjectHeader.classList.add("subSubjectHeader");
            subSubjectHeader.style.gridRow = "2";
            subSubjectHeader.innerHTML = subjects[k][2][n][0]+", coeff: "+subjects[k][2][n][1];
            column.appendChild(subSubjectHeader);

            for (let i in notes[k][n]){
                // creates the input boxes and sets it up
                var inputBox = document.createElement("input");
                inputBox.classList.add("inputBox");
                inputBox.style.gridColumn = parseInt(n)+1;
                inputBox.style.gridRow = 3+parseInt(i);
                inputBox.type = "text";
                inputBox.addEventListener("input", (element) => inputModified(element));
                inputBox.addEventListener("change", (element) => inputModified(element));
                inputBox.id = "idInput;"+k+";"+n+";"+i;
                inputBox.value = notes[k][n][i];

                // creates the input box's placeholder
                if(subjects[k][2][n].length==3){inputBox.placeholder = "/"+subjects[k][2][n][2];}
                else{inputBox.placeholder = "/20";}

                // adds the input to its column
                column.appendChild(inputBox);
            }
        }

        var subjectAverageDiv = document.createElement("div");
        subjectAverageDiv.classList.add("subjectAverageDiv");
        subjectAverageDiv.style.gridColumn = parseInt(subjects[k][2].length);

        var subjectAvg=document.createElement("text");
        subjectAvg.classList.add("subjectAverage");
        subjectAverageDiv.appendChild(subjectAvg);

        var subjectOutOf=document.createElement("text");
        subjectOutOf.classList.add("subjectOutOf");
        subjectOutOf.innerHTML = "/"+globalOutOf;
        subjectAverageDiv.appendChild(subjectOutOf);

        column.appendChild(subjectAverageDiv);

        // adds the column to the table section
        document.getElementById("tableDiv").appendChild(column);
    }

    // replaces the cursor where it should be
    if(activeElementId!="" && isNaN(activeElementId) && Array.from(document.querySelectorAll('[id]')).map(el => el.id).includes(activeElementId)){document.getElementById(activeElementId).focus();}

    calculAverage();
}

// initializes the page
function initialize(){

    // loads the css stylesheet
    var cssFile=document.createElement("link");
    cssFile.href="computerStyle.css";
    cssFile.rel="stylesheet";
    cssFile.type="text/css";
    document.getElementsByTagName("head")[0].appendChild(cssFile);

    document.getElementById("cleanButton").addEventListener("click", cleanPage);
    document.getElementById("strongColorsButton").addEventListener("click", changeColorStrength);
    document.getElementById("strongColorsButton").value = "off";

    loadNotes(JSON.parse(localStorage.getItem("notes")));

    buildTable();
}

document.body.onload=initialize();