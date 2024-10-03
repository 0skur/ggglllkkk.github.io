var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["tests", 1]]], ["Bio", 3, [["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 3, [["tests", 1]]], ["Culture G", 3, [["tests", 1]]]];
var objects=[];//[[column, table],]
var notes=[];
var errorMessages=[];
var averageValue=NaN;

var errorMessageObject=document.getElementById("errorMessages");
var averageObject=document.getElementById("average");
var outOf20=document.getElementById("outOf20");

function calculAverage(){
    //console.log("average calculus");
    var ponderedValueSum=0;
    var ponderationSum=0;

    var subjectAverage;
    var subjectPonderation;
    var testTypeAverage;
    var value;
    var valueOnHundred;
    var noteOn;

    for(let k in notes){
        subjectAverage=0;
        subjectPonderation=0;
        for (let n in notes[k]){
            testTypeAverage=0;
            numberOfNotes=0;
            for (let i in notes[k][n]){
                value=notes[k][n][i]
                if(value!="" && /^[0-9.,/]+$/.test(value)){
                    if (value.indexOf("/")!=-1){
                        const a=value.split("/")
                        noteOn=parseFloat(a[1]);
                        value=parseFloat(a[0]);
                    }
                    else{
                        noteOn=subjects[k][2][n][2];
                        if(noteOn==undefined){noteOn=20;}
                    }

                    if(parseFloat(value)<=noteOn){
                        valueOnHundred=value*(100/noteOn);
                        testTypeAverage+=valueOnHundred;
                        //console.log(value, valueOnHundred, noteOn)
                        numberOfNotes++;
                    }
                }

                //console.log("i", i, testTypeAverage)
            }

            if(numberOfNotes!=0){
                testTypeAverage=testTypeAverage/(numberOfNotes)
                subjectAverage+=testTypeAverage*subjects[k][2][n][1];
                subjectPonderation+=subjects[k][2][n][1];}

            //console.log("n", n, testTypeAverage, subjectAverage, subjects[k][2][n][1], numberOfNotes);
        }
        if(subjectPonderation!=0){
            subjectAverage=subjectAverage/subjectPonderation;
            ponderedValueSum+=subjectAverage*subjects[k][1];
            ponderationSum+=subjects[k][1]};

        //console.log("k", k, subjectAverage, subjectPonderation)
    }

    averageValue=ponderedValueSum/ponderationSum;
    if(ponderationSum!=0){
        averageObject.innerHTML=(averageValue/5).toFixed(2);
        outOf20.style.visibility="visible";
    }
    else{
        averageObject.innerHTML="";
        outOf20.style.visibility="collapse";
    }
}

function printErrorMessages(){
    var errorMessageString="";

    for (let k in errorMessages){
        em=errorMessages[k];
        if (em[0]==0){ // letters in inputs
            errorMessageString+=("Il n'y a pas que des nombres dans la case "+subjects[em[1][0]][0]+", "+subjects[em[1][0]][2][em[1][1]][0]+", ligne "+String(parseInt(em[1][2])+1)+"... >:( !");
        }

        errorMessageString+="<br>";
    }
    errorMessageObject.innerHTML=errorMessageString;
}

function inputModified(element){
    //console.log("NEW INPUT")
    var indexes=element.originalTarget.id.replace("idInput;", "").split(";");
    var value=element.originalTarget.value;

    var isValueNumber=true;
    for (let k in value){if("0123456789.,/".includes(value[k])==false){isValueNumber=false;}}

    var isInErrorMessages=-1;
    for(let k in errorMessages){
        em=errorMessages[k]
        if(em[0]==0  && em[1][0]==indexes[0] && em[1][1]==indexes[1] && em[1][2]==indexes[2]){  
            isInErrorMessages=k;
        }
    }

    if (isValueNumber==false){if(isInErrorMessages==-1){errorMessages.push([0, indexes]);}}
    else{if(isInErrorMessages!=-1){errorMessages.splice(isInErrorMessages, 1);}
    }
    notes[indexes[0]][indexes[1]][indexes[2]]=value;

    var isLastLineFilled=false;
    for(let k in notes[indexes[0]]){isLastLineFilled=isLastLineFilled || !Object.is(notes[indexes[0]][k][notes[indexes[0]][k].length-1], "");}

    if(isLastLineFilled){
        //console.log("expand")
        var line=document.createElement("tr");

        for (let n in subjects[indexes[0]][2]){
            let inputZone=document.createElement("input");
            inputZone.type="text";
            if(subjects[indexes[0]][2][n].length==3){inputZone.placeholder="/"+String(subjects[indexes[0]][2][n][2]); }
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.id="idInput;"+indexes[0]+";"+n+";"+String(objects[indexes[0]][1].childNodes.length-1);
            //console.log(objects[indexes[0]][1].childNodes.length)

            let inputCase=document.createElement("td");
            inputCase.appendChild(inputZone);
            line.appendChild(inputCase);

            notes[indexes[0]][n].push("");
        }
        objects[indexes[0]][1].appendChild(line);
    }

    var maxFilledLine=-1;    

    for(let k in notes[indexes[0]]){
        for(let n in notes[indexes[0]][k]){
            if (!Object.is(notes[indexes[0]][k][n], "")){
                maxFilledLine=parseInt(n);
            }
        }
    }

    if (value==""){
        //console.log("reduction", maxFilledLine, objects[indexes[0]][1].childNodes.length)
        
        if(objects[indexes[0]][1].childNodes.length==maxFilledLine+4){
            //console.log("removing last line")

            objects[indexes[0]][1].removeChild(objects[indexes[0]][1].childNodes[maxFilledLine+3]);
            for (let n in notes[indexes[0]]){
                notes[indexes[0]][n].splice(maxFilledLine+2)
            }
        }
        else if (maxFilledLine<objects[indexes[0]][1].childNodes.length-3){
            for(let n in notes[indexes[0]]){
                //console.log(notes, maxFilledLine, notes[indexes[0]][n].length)
                //for(let i=maxFilledLine+2; i<=notes[indexes[0]][n].length; i++){
                const a=objects[indexes[0]][1].childNodes.length-maxFilledLine-3;
                notes[indexes[0]][n].splice(maxFilledLine+2);
            }

            const a=objects[indexes[0]][1].childNodes.length-maxFilledLine-3;
            //console.log(maxFilledLine, a)
            for(let i=0; i<a; i++){
                //console.log(i)
                objects[indexes[0]][1].removeChild(objects[indexes[0]][1].childNodes[maxFilledLine+3]);
            }
            //objects[indexes[0]][1].removeChild(objects[indexes[0]][1].childNodes[maxFilledLine+2]);    
        }
    }

    //console.log(notes, objects);
    printErrorMessages();
    calculAverage();
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

            notesArray.push([""]);
        }
        table.appendChild(header);
        table.appendChild(firstLine);
        column.appendChild(table);

        objects.push([column, table]);
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