var subjects=[["Maths", 7, [["DS", 4], ["tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["tests", 1]]], ["Chimie", 4, [["DS", 4], ["tests", 1]]], ["Bio", 3, [["DS", 4], ["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Eco", 1.5, [["tests", 1]]]];
var notes=[]
var notesOrder=[]
var globalOutOf=20;
var colorsCoeff = [[0.341328, -10.68, 64.6337, 254.862353], [-0.2791, 6.19454, -12.306, -1.4046463], [-0.1835, 6.657, -46.6007, 4.32]];
var strongColors = false;
var showAverageGraph = false;
var isMobileBrowser = false;


function changeNoteOrder(){

    var tempNotesOrder = [];
    for(let k in notes){
        for(let n in notes[k]){
            for(let i in notes[k][n]){
                var currentNoteOrder = document.getElementById("idInput;"+k+";"+n+";"+i).parentNode.childNodes[1].value;
				if(tempNotesOrder[currentNoteOrder-1]!=undefined){tempNotesOrder[currentNoteOrder-1]=undefined;}
                else if(currentNoteOrder!="" && notes[k][n][i]!=""){tempNotesOrder[currentNoteOrder-1]=[k, n, i];}
            }
        }
    }

    notesOrder=[];
    for(let k in tempNotesOrder){
        if(tempNotesOrder[k]!=null){notesOrder.push(tempNotesOrder[k]);}
    }

    // saves the changes
    localStorage.setItem("notesOrder", JSON.stringify(notesOrder));

    //console.log(notesOrder);
    assignNoteOrder();
    makeAverageGraph();
}

// called to place correctly the notes order
function assignNoteOrder(){
	// resets all the inputs
	var orderInputList = document.getElementsByClassName("noteOrderInput");
	for(let k in orderInputList){
		orderInputList[k].value="";
	}

	// changes the concerned inputs
    for (let k in notesOrder){
        var currentNoteIndex=notesOrder[k];
        document.getElementById("idInput;"+currentNoteIndex[0]+";"+currentNoteIndex[1]+";"+currentNoteIndex[2]).parentNode.childNodes[1].value=parseInt(k)+1;
    }
}

// makes the average chart
function makeAverageGraph(){
    
    // hides or shows the chart
    if(!showAverageGraph){
        document.getElementById("averageGraph").style.visibility = "collapse";
        var listOfNoteOrderInputs = document.getElementsByClassName("noteOrderInput")
        for (let k=0; k<listOfNoteOrderInputs.length; k++){
            listOfNoteOrderInputs[k].style.display = "none";
        }
    }
    else{
        document.getElementById("averageGraph").style.visibility = "visible";
        var listOfNoteOrderInputs = document.getElementsByClassName("noteOrderInput")
        for (let k=0; k<listOfNoteOrderInputs.length; k++){
            listOfNoteOrderInputs[k].style.display = "initial";
        }

        // chart variables
        var xValues=[]
        var yValues=[]
        var currentNotesArray=[]

        // initializes the current notes array
        for (let k in subjects){
            currentNotesArray.push([]);
            for (let n in subjects[k][2]){
                currentNotesArray[k].push([]);
            }
        }

        // computes the chart values
        for (let k in notesOrder){
            var currentNoteIndexes=notesOrder[k];
            currentNotesArray[currentNoteIndexes[0]][currentNoteIndexes[1]].push(notes[currentNoteIndexes[0]][currentNoteIndexes[1]][currentNoteIndexes[2]]);
            var currentNote=calculAverage(currentNotesArray, false);
            currentNote=currentNote.toFixed(2);
            xValues.push(parseInt(k));
            yValues.push(parseFloat(currentNote));
        }

        //console.log("xyvalues", xValues, yValues);

        // plots the average chart
        new Chart("averageGraph", {
            type: "line",
            data: {
              labels: xValues,
              datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
              }]
            },
            options: {
              legend: {display: false},
              scales: {
                //yAxes: [{ticks: {min: minValue, max:maxValue}}],
              }
            }
          });
    }
}


// exports the current data to the clipboard
function exportData(){
    navigator.clipboard.writeText(JSON.stringify([notes, notesOrder]));
    document.getElementById("exportDataButton").innerHTML="données copiées";
}

// imports the data placed in the data input
function importData(){
    var data = document.getElementById("importDataInput").value;
    var parsedData = JSON.parse(data);
    var hasNotesBeenLoaded=loadNotes(parsedData[0], parsedData[1]);
    document.getElementById("importDataInput").value="";
    buildTable();
}

// calculates the note's according color
function calculAverageColor(note){
    var colors = [];

    for (let k in colorsCoeff){
        var color = 0;
        for (let n in colorsCoeff[k]){
            color+=colorsCoeff[k][n]*Math.pow(note, colorsCoeff[k].length-n-1);
        }
        colors.push(color);
    }

    return "rgb("+colors[0]+","+colors[1]+","+colors[2]+")";
}

// changes the visibility of the graph
function changeShowGraph(){
    showAverageGraph = document.getElementById("showGraphButton").checked;
    makeAverageGraph();
}

// changes the color strength
function changeColorStrength(){
    strongColors = document.getElementById("strongColorsButton").checked;
    calculAverage();
}


// cleans the page
function cleanPage(){
    loadNotes([], []);
    buildTable();
}

// calculs the current average
function calculAverage(notesArray="", show=true){
    var avg=0;
    var coeffSum=0
    var avgModified=false;

    if(notesArray==""){notesArray=notes;}

    for (let k in notesArray){
        var subjectAvg=0;
        var subjectCoeffSum=0;
        var subjectAvgModified=false;

        for (let n in notesArray[k]){
            var subSubjectAvg=0;
            var subSubjectAvgModified = false;
            var numberOfNotes = 0;

            for (let i in notesArray[k][n]){
                var currentNote = notesArray[k][n][i]
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
            
            if(show){
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
        }
        else if(show){
			subjectAverageDivChildNodes[0].innerHTML="";
            //subjectAverageDivChildNodes[0].visibility="collapse";
            //subjectAverageDivChildNodes[1].visibility="collapse";
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
        
        if(show){
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
    }
    else if(show){
        avgTextField.style.visibility = "collapse";
        outOfTextField.style.visibility = "collapse";
        avgTextField.style.color = "rgb(0,0,0)";
        document.body.style.backgroundColor="transparent";
    }

    return avg;
}


// loads the saved notes or creates the notes table
function loadNotes(givenNotes, givenNotesOrder){
    if(givenNotes==null){givenNotes=[];}
    if(givenNotesOrder==null){givenNotesOrder=[];}
    else{notesOrder=givenNotesOrder;}

    // checks if the given notes format is the good one
    var isNotesFormatCorrect=true;
    if (subjects.length!=givenNotes.length){isNotesFormatCorrect = false;}
    else{
       for (let k in subjects){
           if(subjects[k][2].length!=givenNotes[k].length){for(let i=0; i<subjects[k][2].length-givenNotes[k].length; i++){givenNotes[k].push([])};}
           else{
            for(let n in givenNotes[k]){
                if(givenNotes[k][n].length==0){givenNotes[k][n].push("");}
            }
           }
       }
    }

    if (isNotesFormatCorrect){
        notes=givenNotes;
    }
    else{ // creates an adequate empty notes array
        notes=[];
        for (let k in subjects){
            notes.push([]);
            for (let n in subjects[k][2]){
                notes[k].push([""]);
            }
        }
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("notesOrder", JSON.stringify(notesOrder));

    return isNotesFormatCorrect;
}

// called when an input is modified
function inputModified(element){

    // determines the modified field
    var targetedInput = element.target;
    var targetedSubject = targetedInput.id.replace("idInput;", "").split(";");
    var targetedColumn = targetedInput.parentNode.parentNode

    // verifies if the new value is correct and updates the notes array
    var value = targetedInput.value.replace(",", ".");
    isValueNumber = true;
    for(let k in value){isValueNumber &&="0123456789.,/".includes(value[k]);}
    notes[targetedSubject[0]][targetedSubject[1]][targetedSubject[2]]=value;
	if(isValueNumber && value!=""){targetedInput.parentNode.childNodes[1].value=notesOrder.length+1;}

    // adds a line if there are no more left
    if (targetedSubject[2] == notes[targetedSubject[0]][targetedSubject[1]].length-1 && targetedSubject.value!=""){
        notes[targetedSubject[0]][targetedSubject[1]].push("");
        //console.log("newline ?!")

        // creates the input box container
        var inputBoxDiv = document.createElement("div");
        inputBoxDiv.style.gridColumn = parseInt(targetedSubject[1])+1;
        inputBoxDiv.style.gridRow = 4+parseInt(targetedSubject[2]);

        // creates the input boxes and sets it up
        var inputBox = document.createElement("input");
        inputBox.classList.add("inputBox");
        inputBox.type = "text";
        inputBox.addEventListener("input", (element) => inputModified(element));
        inputBox.addEventListener("change", (element) => inputModified(element));
        inputBox.id = "idInput;"+targetedSubject[0]+";"+targetedSubject[1]+";"+parseInt(parseInt(targetedSubject[2])+1);

        // creates the note order input
        var noteOrderInput = document.createElement("input");
        noteOrderInput.classList.add("noteOrderInput");
        noteOrderInput.type="text";

        inputBoxDiv.appendChild(inputBox);
        inputBoxDiv.appendChild(noteOrderInput);

        // creates the input box's placeholder
        if(subjects[targetedSubject[0]][2][targetedSubject[1]].length==3){inputBox.placeholder = "/"+subjects[targetedSubject[0]][2][targetedSubject[1]][2];}
        else{inputBox.placeholder = "/20";}

        // adds the input to its column
        if(targetedSubject[1]==subjects[targetedSubject[0]][2].length-1){targetedColumn.insertBefore(inputBoxDiv, targetedColumn.childNodes[targetedColumn.childNodes.length-1]);}
        else{targetedColumn.insertBefore(inputBoxDiv, document.getElementById("subSubjectId;"+targetedSubject[0]+";"+parseInt(parseInt(targetedSubject[1])+1)));}
    
    }
    
    // gets the last filled line
    var lastFilledLine = -1;
    i=notes[targetedSubject[0]][targetedSubject[1]].length-1;
    while (lastFilledLine==-1 && i>=0){
        if(notes[targetedSubject[0]][targetedSubject[1]][i]!=""){lastFilledLine=i;}
        i--;
        //console.log(i, notes[targetedSubject[0]][targetedSubject[1]][i])
    }

    //console.log("LASTFILLEDLINE", lastFilledLine+1, notes[targetedSubject[0]][targetedSubject[1]].length-lastFilledLine-2);
    //console.log("csc", lastFilledLine, notes[targetedSubject[0]][targetedSubject[1]].length)

    // deletes all the other empty lines
    for(let i=lastFilledLine+2; i<notes[targetedSubject[0]][targetedSubject[1]].length; i++){
        //console.log("FUUUUCK", "idInput;"+targetedSubject[0]+";"+targetedSubject[1]+";"+i)
        document.getElementById("idInput;"+targetedSubject[0]+";"+targetedSubject[1]+";"+i).parentElement.remove();
    }
    notes[targetedSubject[0]][targetedSubject[1]].splice(lastFilledLine+1, notes[targetedSubject[0]][targetedSubject[1]].length-lastFilledLine-2);

    // saves the changes to the notes
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("notesOrder", JSON.stringify(notesOrder));

    //console.log(notes, notesOrder);

    //buildTable();
	changeNoteOrder();
    calculAverage();

    // changes the color of the input if incorrect
    if (!isValueNumber){document.getElementById(targetedInput.id).style.backgroundColor = "red";}

    // resets the import button text
    document.getElementById("exportDataButton").innerHTML="exporter données";
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
            subSubjectHeader.id = "subSubjectId;"+k+";"+n;
            subSubjectHeader.style.gridRow = "2";
            subSubjectHeader.innerHTML = subjects[k][2][n][0]+", coeff: "+subjects[k][2][n][1];
            column.appendChild(subSubjectHeader);

            for (let i in notes[k][n]){
                // create the input box container
                var inputBoxDiv = document.createElement("div");
                inputBoxDiv.classList.add("inputBoxDiv");
                inputBoxDiv.style.gridColumn = parseInt(n)+1;
                inputBoxDiv.style.gridRow = 3+parseInt(i);

                // creates the input boxes and sets it up
                var inputBox = document.createElement("input");
                inputBox.classList.add("inputBox");
                inputBox.type = "text";
                inputBox.addEventListener("input", (element) => inputModified(element));
                inputBox.addEventListener("change", (element) => inputModified(element));
                inputBox.id = "idInput;"+k+";"+n+";"+i;
                inputBox.value = notes[k][n][i];
                if(subjects[k][2][n].length==3){inputBox.placeholder = "/"+subjects[k][2][n][2];}
                else{inputBox.placeholder = "/20";}

                // creates the note order input
                var noteOrderInput = document.createElement("input");
                noteOrderInput.classList.add("noteOrderInput");
                noteOrderInput.type="text";

                // adds the input to its column
                inputBoxDiv.appendChild(inputBox);
                inputBoxDiv.appendChild(noteOrderInput);
                column.appendChild(inputBoxDiv);
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

    assignNoteOrder();
    makeAverageGraph();
    calculAverage();
}

// initializes the page
function initialize(){

    // initializes some variables
    strongColors = document.getElementById("strongColorsButton").checked;
    showAverageGraph = document.getElementById("showGraphButton").checked;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobileBrowser = true;})(navigator.userAgent||navigator.vendor||window.opera);

    // loads the css main stylesheet
    var cssMainFile=document.createElement("link");
    cssMainFile.href="main.css";
    cssMainFile.rel="stylesheet";
    cssMainFile.type="text/css";
    document.getElementsByTagName("head")[0].appendChild(cssMainFile);

    // loads the css computer of mobile stylesheet
    var cssFile=document.createElement("link");
    if(!isMobileBrowser){cssFile.href="computerStyle.css";}
    else{cssFile.href="mobileStyle.css";}
    cssFile.rel="stylesheet";
    cssFile.type="text/css";
    document.getElementsByTagName("head")[0].appendChild(cssFile);

    // makes the buttons work
    document.getElementById("cleanButton").addEventListener("click", cleanPage);
    document.getElementById("strongColorsButton").addEventListener("click", changeColorStrength);
    document.getElementById("showGraphButton").addEventListener("click", changeShowGraph);
    document.getElementById("computeGraphButton").addEventListener("click", changeNoteOrder);
    document.getElementById("importDataButton").addEventListener("click", importData);
    document.getElementById("exportDataButton").addEventListener("click", exportData);

    // loads the saved notes
    loadNotes(JSON.parse(localStorage.getItem("notes")), JSON.parse(localStorage.getItem("notesOrder")));

    buildTable();
}

document.body.onload=initialize();