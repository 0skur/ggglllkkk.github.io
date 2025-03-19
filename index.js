var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["DS", 4], ["DS", 1]]], ["Bio", 3, [["DS", 4], ["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Eco", 1.5, [["tests", 1]]]];
var notes=[]



// adds an input line to said column
function addEntryLine(column){

    // gets the column's subject id
    var subjectIndex = Array.from(column.parentNode.children).indexOf(column);

    // creates each and every input box
    for (let k in subjects[subjectIndex][2]){
        // creates the input box and sets it up
        var inputBox = document.createElement("input");
        inputBox.classList.add("inputBox");
        inputBox.style.gridColumn = parseInt(k)+1;
        inputBox.type = "text";
        inputBox.addEventListener("input", (element) => inputModified(element));
        inputBox.addEventListener("change", (element) => inputModified(element));
        inputBox.id = "idInput;"+subjectIndex+";"+k+";"+parseInt(notes[subjectIndex][k].length);

        // creates the input box's placeholder
        if(subjects[subjectIndex][2][k].length==3){inputBox.placeholder = "/"+subjects[subjectIndex][2][k][2];}
        else{inputBox.placeholder = "/20";}

        // updates the notes array
        notes[subjectIndex][k].push("");

        // adds the input to its column
        column.appendChild(inputBox);
    }

}

// called when an input is modified
function inputModified(element){

    // determines the modified field
    var targetInput = element.target;
    var targetedSubject = targetInput.id.replace("idInput;", "").split(";");
    var targetedColumn = targetInput.parentNode

    // verifies if the new value is correct and updates the notes array
    var value = targetInput.value.replace(",", ".");
    isValueNumber = true;
    for(let k in value){if("0123456789.,/".includes(value[k])==false){isValueNumber=false;}}
    if (isValueNumber) {notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]=value;}
    else{notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]="";}

    // changes the color of the input if incorrect
    if (!isValueNumber){targetInput.style.backgroundColor = "red";}
    else{targetInput.style.backgroundColor = "transparent";}

    if (targetedSubject[2] == notes[targetedSubject[0]][targetedSubject[1]].length-1 && targetedSubject.value!=""){addEntryLine(targetedColumn);}

    // checks if it makes the current line empty
    var isLineEmpty = true;
    for(let k in notes[targetedSubject[0]]){
        if(notes[targetedSubject[0]][k][targetedSubject[2]]!=""){isLineEmpty=false;}
    }

    console.log(isLineEmpty);

    // deletes said line if empty
    if (isLineEmpty){
        for (let k in notes[targetedSubject[0]]){
            notes[targetedSubject[0]][k].splice(targetedSubject[2], 1);
            targetedColumn.removeChild(targetedColumn.children[3+parseInt(targetedSubject[2])]);
        }
    }


    console.log(notes);
}

// builds the average calcul table
function buildTable(isFirstTime=false){

    // empties the table section
    document.getElementById("tableDiv").innerHTML="";

    // loads the css stylesheet
    if (isFirstTime){
        var cssFile=document.createElement("link");
        cssFile.href="computerStyle.css";
        cssFile.rel="stylesheet";
        cssFile.type="text/css";
        document.getElementsByTagName("head")[0].appendChild(cssFile);
    }

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

        // completes the notes array and creates the subsubjects headers
        notes.push([]);
        for (let n in subjects[k][2]){
            notes[k].push([]);

            var subSubjectHeader = document.createElement("div");
            subSubjectHeader.classList.add("subSubjectHeader");
            subSubjectHeader.innerHTML = subjects[k][2][n][0]+", coeff: "+subjects[k][2][n][1];
            column.appendChild(subSubjectHeader);
        }

        // adds the column to the table section and adds the first line to it
        addEntryLine(document.getElementById("tableDiv").appendChild(column));
    }
}

document.body.onload=buildTable(true);