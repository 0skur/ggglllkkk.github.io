var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["tests", 1]]], ["Bio", 3, [["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 3, [["tests", 1]]], ["Culture G", 3, [["tests", 1]]]];
var objects=[];//[[column, table, [header, th1, th2]]]]
var notes=[];
var errorMessages=[];

var errorMessageObject=document.getElementById("errorMessages");

function inputModified(element){
    console.log("NEW INPUT")
    var indexes=element.originalTarget.id.replace("idInput;", "").split(";");
    var value=element.originalTarget.value;

    var isValueNumber=true;
    for (let k in value){if("0123456789.,".includes(value[k])==false){isValueNumber=false;}}

    if (isValueNumber==false){errorMessageObject.textContent="Ceci n'est pas un nombre ! >:(";}
    else if (value==""){
        notes[indexes[0]][indexes[1]][indexes[2]]=NaN;
    }
    else{
        errorMessageObject.textContent="";
        notes[indexes[0]][indexes[1]][indexes[2]]=parseFloat(value);
    }

    var isLastLineFilled=false;
    for(let k in notes[indexes[0]]){isLastLineFilled=isLastLineFilled || !Object.is(notes[indexes[0]][k][notes[indexes[0]][k].length-1], NaN);}

    if(isLastLineFilled){
        console.log("expand")
        var line=document.createElement("tr");

        for (let n in subjects[indexes[0]][2]){
            let inputZone=document.createElement("input");
            inputZone.type="text";
            if(subjects[indexes[0]][2][n].length==3){inputZone.placeholder="/"+String(subjects[indexes[0]][2][n][2]); }
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.id="idInput;"+indexes[0]+";"+n+";"+notes[indexes[0]][indexes[1]].length;

            let inputCase=document.createElement("td");
            inputCase.appendChild(inputZone);
            line.appendChild(inputCase);

            notes[indexes[0]][n].push(NaN);
        }
        objects[indexes[0]][1].appendChild(line);
        objects[indexes[0]][2].push(line);
    }

    if (value==""){
        var maxFilledLine=0;    

        for(let k in notes[indexes[0]]){
            for(let n in notes[indexes[0]][k]){
                if (!Object.is(notes[indexes[0]][k][n], NaN)){
                    maxFilledLine=n;
                }
            }
        }

        for(let n in notes[indexes[0]]){
            console.log(notes, notes[indexes[0]][n].length)
            for(let i=maxFilledLine+1; i<notes[indexes[0]][n].length; i++){
                //console.log(i)
                objects[indexes[0]][1].removeChild(objects[indexes[0]][1].childNodes[i]);
            }

            notes[indexes[0]][n].splice(maxFilledLine+1);
        }
    }

    //console.log(notes, objects);
}

function initialize(){
    for (let k in subjects){
        var column=document.createElement("div");
        column.classList.add("column");
        column.appendChild(document.createTextNode(subjects[k][0]+", coeff: "+String(subjects[k][1])));

        var table=document.createElement("table");
        var header=document.createElement("tr");
        var firstLine=document.createElement("tr");
        
        var notesArray=[];

        for (let n in subjects[k][2]){
            let subHeader=document.createElement("th");
            subHeader.appendChild(document.createTextNode(subjects[k][2][n][0]+", coeff: "+String(subjects[k][2][n][1])));
            header.appendChild(subHeader);

            let inputZone=document.createElement("input");
            inputZone.type="text";
            if(subjects[k][2][n].length==3){inputZone.placeholder="/"+String(subjects[k][2][n][2]); }
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.id="idInput;"+k+";"+n+";0";

            let inputCase=document.createElement("td");
            inputCase.appendChild(inputZone);
            firstLine.appendChild(inputCase);

            notesArray.push([NaN]);
        }
        table.appendChild(header);
        table.appendChild(firstLine);
        column.appendChild(table);

        var currentObject=[];
        currentObject.push(column);
        currentObject.push(table);
        currentObject.push([header, firstLine]);

        objects.push(currentObject);
        document.getElementById("tables").appendChild(column);

        notes.push(notesArray);
    }

    const widthPercentage=String(100/subjects.length)+"%";
    for(let k in objects){
        objects[k][0].style.width=widthPercentage;
    }
    console.log(objects, notes);
}


document.body.onload=initialize();