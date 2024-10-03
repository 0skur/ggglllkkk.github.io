var currentSection=0;
var subjects=[["Maths", 7, 1], ["Physique", 7, 0], ["Chimie", 4, 0], ["Bio", 3, 0], ["Info", 3, 0], ["Anglais", 1.5, 0], ["LV2", 1.5, 0], ["Sport", 1.5, 0], ["Culture G", 1.5, 0]];
var subSubjects=[[["DS", 4], ["tests", 1, 5]], [["DS", 4], ["tests", 1]], [["tests", 1]], [["tests", 1]], [["tests", 1]], [["tests", 1]], [["tests", 1]], [["tests", 1]], [["tests", 1]]];
var notes=[];

var divList=[];

var errorMessage=document.getElementById("errorMessages");

function calculAverage(){
    return 0;
}

function inputModified(a){
    /*console.log(a.originalTarget.value);
    console.log(a.originalTarget.classList);
    console.log(a.originalTarget.id);*/
    console.log("NEW INPUT")

    let value=a.originalTarget.value
    errorMessage.innerHTML="";

    let isValueNumber=true;
    for (let char in value){if("0123456789.,".includes(value[char])==false){isValueNumber=false;}}

    let indexes=a.originalTarget.id;
    indexes=indexes.replace("idInput;", "").split(";");
    console.log(indexes)

    let maxValues=0;
    for(let len in notes[indexes[0]]){maxValues=Math.max(maxValues, notes[indexes[0]][len].length);}

    if (isValueNumber){
        for(let index in indexes){indexes[index]=parseInt(indexes[index]);}
        if (value=="" && indexes[2]==maxValues-1){notes[indexes[0]][indexes[1]].splice(indexes[2], 1);}
        else{notes[indexes[0]][indexes[1]][indexes[2]]=parseFloat(value);}
    }
    else{
        errorMessage.innerHTML="Ceci n'est pas un nombre ! >:(";
    }

    maxValues=0;
    for(let len in notes[indexes[0]]){maxValues=Math.max(maxValues, notes[indexes[0]][len].length);}

    let tableID=a.originalTarget.id.split(";")
    var currentTable=document.getElementById("idColumn;"+tableID[1]);

    if (currentTable.childElementCount-2<maxValues){
        var textLine=document.createElement("tr");
        for(let sub in subSubjects[indexes[0]]){
            textLine.id="idLine;"+String(indexes[0])+";"+String(indexes[1]+1);

            let inputZone=document.createElement("input");
            inputZone.type="text";
            if(subSubjects[indexes[0]][sub].length==3){inputZone.placeholder="/"+subSubjects[indexes[0]][sub][2];}
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.id="idInput;"+String(indexes[0])+";"+String(sub)+";"+maxValues;

            let inputCase=document.createElement("td");
            inputCase.appendChild(inputZone);
            textLine.appendChild(inputCase);
        }
        currentTable.appendChild(textLine);
    }

    while(value=="" && indexes[2]==maxValues){
        let lineToRemove=document.getElementById("idLine;"+tableID[1]+";"+(parseInt(tableID[2])+1));
        console.log("idLine;"+tableID[1]+";"+tableID[2])
        currentTable.removeChild(lineToRemove);

        maxValues=0;
        for(let len in notes[indexes[0]]){maxValues=Math.max(maxValues, notes[indexes[0]][len].length);}
    }

    console.log(notes);

    calculAverage();

    return 0;
}

function initialize(){
    for(let a in subjects){
        var newDiv=document.createElement("div");
        divList.push(newDiv);
        divList[currentSection].classList.add("column")
        divList[currentSection].appendChild(document.createTextNode(subjects[currentSection][0]+", coeff: "+subjects[currentSection][1]));

        var table=document.createElement("table");
        table.id="idColumn;"+String(currentSection);
        var header=document.createElement("tr");
        var textLine=document.createElement("tr");
        textLine.id="idLine;"+String(currentSection)+";"+"0";
        notes.push([]);
        for(let sub in subSubjects[currentSection]){
            let subHeader=document.createElement("th");
            subHeader.appendChild(document.createTextNode(subSubjects[currentSection][sub][0]+", coeff: "+subSubjects[currentSection][sub][1]));
            header.appendChild(subHeader);
            notes[currentSection].push([]);

            let inputZone=document.createElement("input");
            inputZone.type="text";
            if(subSubjects[currentSection][sub].length==3){inputZone.placeholder="/"+subSubjects[currentSection][sub][2];}
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.id="idInput;"+String(currentSection)+";"+String(sub)+";"+"0";
            //inputZone.classList.add(String(subjects[currentSection][0]).replace(" ", "_"), String(subSubjects[currentSection][sub][0]).replace(" ", "_"));
            let inputCase=document.createElement("td");
            inputCase.appendChild(inputZone);
            textLine.appendChild(inputCase);
        }
        table.appendChild(header);
        table.appendChild(textLine);
        divList[currentSection].appendChild(table);

        document.getElementById("tables").appendChild(divList[currentSection]);
        currentSection++;
    }
    for (let element of document.getElementsByClassName("column")){
            const percentage=String(Math.round(100/currentSection))+"%";
            element.style.width=percentage;
        };
}

document.body.onload = initialize();