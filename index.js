var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["DS", 4], ["DS", 1]]], ["Bio", 3, [["DS", 4], ["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Eco", 1.5, [["tests", 1]]]];
var notes=[]


// calculs the current average
function calculAverage(){
    
}


// loads the saved notes or creates the notes table
function loadNotes(givenNotes=-1){
    if (givenNotes!=-1){
        notes=givenNotes;
    }
    else{
        for (let k in subjects){
            notes.push([]);
            for (let n in subjects[k][2]){
                notes[k].push([""]);
            }
        }
    }

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
    for(let k in value){if("0123456789.,/".includes(value[k])==false){isValueNumber=false;}}
    if (isValueNumber) {notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]=value;}
    else{notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]="";}

    // changes the color of the input if incorrect
    if (!isValueNumber){targetedInput.style.backgroundColor = "red";}
    else{targetedInput.style.backgroundColor = "transparent";}

    if (targetedSubject[2] == notes[targetedSubject[0]][targetedSubject[1]].length-1 && targetedSubject.value!=""){
        for (let k in notes[targetedSubject[0]]){
            notes[targetedSubject[0]][k].push("");
        }
    }

    // checks if it makes the current line empty
    var isLineEmpty = true;
    for(let k in notes[targetedSubject[0]]){
        if(notes[targetedSubject[0]][k][targetedSubject[2]]!=""){isLineEmpty=false;}
    }

    //console.log(isLineEmpty);

    // deletes said line if empty
    if (isLineEmpty){
        for(let k in notes[targetedSubject[0]]){
            notes[targetedSubject[0]][k].splice([targetedSubject[2]], 1);
        }
    }

    // saves the changes to the notes
    localStorage.setItem("notes", JSON.stringify(notes));

    calculAverage();

    buildTable();
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

        // adds the column to the table section
        document.getElementById("tableDiv").appendChild(column);
    }

    // replaces the cursor where it should be
    if(activeElementId!=""){document.getElementById(activeElementId).focus();}
}

// initializes the page
function initialize(){

    // loads the css stylesheet
    var cssFile=document.createElement("link");
    cssFile.href="computerStyle.css";
    cssFile.rel="stylesheet";
    cssFile.type="text/css";
    document.getElementsByTagName("head")[0].appendChild(cssFile);

    loadNotes(JSON.parse(localStorage.getItem("notes")));

    buildTable();
}

document.body.onload=initialize();