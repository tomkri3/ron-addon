﻿// constanty a proměné
const SHOWWORKED = "Odpracováno: ";
const SHOWTODAYNOWORK = "Dnes jste nezapočali doposud práci.";

var divStyle = '"width:100%;padding-top:8px;text-align:center;padding-bottom:8px;position: relative; top: 0;margin-top:0; opacity: 0.9; z-index:100;background: white;color: black;font-size:25px;"';
var exit = ['odchod', 'soukromě', 'přestávka'];
var enter = ['příchod', 'příchod od lékaře', 'návštěva lékaře', 'školení'];




htmlBody = document.body.innerHTML;
// #for debuging/testing
//var htmlBody = 
//"<html><head></head><body><table class='browser browserdenni puvodnidochazka'><tr class='today '><td class='browser_rowheader'><span class='zkratkadne'>Út</span>27.2.2018</td><td>07:07 &nbsp; Příchod</td><td>11:11 &nbsp; Přestávka</td><td>11:39 &nbsp; Příchod</td><td>13:44 &nbsp; Odchod</td><td>15:25 &nbsp; Příchod</td><td>16:54 &nbsp; Odchod</td></tr></table></body></html>";

//document.body.innerHTML = htmlBody;

var tables = document.getElementsByClassName("browser browserdenni puvodnidochazka");
var table = tables[0];

var today = table.getElementsByClassName("today")[0];
var actions = today.childNodes;



var totalWorkMinute = 0;
var starttime = "";
var resultMessage = "";
var endwithExit = false;
var previous = "";
var breakInfo = "";
var breakStartTime = "";
for (var i = 1; i < actions.length; i++) {
    var cur = actions[i].innerText;
    //alert(cur);
    if (!cur || 0 === cur.lenght) {
        continue;
    }
    var stringtime = cur.split(' ')[0].trim();
    var stringactivity = cur.split(' ')[2].trim();

    if (enter.includes(stringactivity.toLowerCase()) && starttime == "") {
        starttime = stringtime;
        if (previous == "přestávka") {
            var breakMinute = getDiffMinutes(breakStartTime, starttime);
            if (breakMinute < 30) breakMinute = 30;
            var breakTime = getHourAndMinuteFromMinute(breakMinute);
            breakInfo = "Obědová pauza trvala: " + breakTime;
        }
        //alert(starttime);
    }
    if (exit.includes(stringactivity.toLowerCase()))
    //if (stringactivity.toLowerCase().includes("odchod") || stringactivity.toLowerCase().includes("přestávka") || stringactivity.toLowerCase().includes("soukromě")
    {
        previous = stringactivity.toLowerCase();
        totalWorkMinute += getDiffMinutes(starttime, stringtime);
        if (stringactivity.toLowerCase().includes("přestávka")) { breakStartTime = stringtime; }
        starttime = "";
        endwithExit = i == actions.length - 1;

    }
    //alert(i);
    //test(stringtime);
    //alert(totalWorkMinute+"ST:"+starttime+";endwidth"+endwithExit);
}


var currentdate = new Date();
var currentTime = currentdate.getHours() + ":" + currentdate.getMinutes();

if (!endwithExit) {
    totalWorkMinute += getDiffMinutes(starttime, currentTime);
}

resultMessage = SHOWWORKED + getHourAndMinuteFromMinute(totalWorkMinute);

if (resultMessage.lenght == 0) { resultMessage = SHOWTODAYNOWORK; }

if (breakInfo.length > 0) {
    resultMessage += "<br>" + breakInfo;
}

// přidáme sádlo
var sadloTime = getDaySadlo(totalWorkMinute);

if (totalWorkMinute > 0) {
    var sadloMessage = "Sádlo:";
    if (sadloTime.startsWith("-")) {
        sadloMessage += '<span style="color:red;">' + sadloTime + '</span>';
    }
    else {
        sadloMessage += '<span style="color:green;">' + sadloTime + '</span>';
    }
    resultMessage += "<br>" + sadloMessage;
}
document.body.innerHTML = '<div style=' + divStyle + '>' + resultMessage + '</div>' + htmlBody;


function getDaySadlo(minute) {
    var dayMinutes = 8 * 60;
    var result = "";
    var currentSadlo = 0;
    if (minute < dayMinutes) {
        currentSadlo = dayMinutes - minute;
        result = "-";
    }
    else {
        currentSadlo = minute - dayMinutes;
        result = "+";
    }
    result += getHourAndMinuteFromMinute(currentSadlo);
    return result;


}

function getDiffMinutes(startTime, endTime) {
    var totalStartMinute = getTotalMinute(startTime);
    var totalEndMinute = getTotalMinute(endTime);
    var totalDiffMinute = totalEndMinute - totalStartMinute;
    return totalDiffMinute;

}

function getTotalMinute(time) {
    var startTimeHour = parseInt(time.split(':')[0]);
    var startTimeMinute = parseInt(time.split(':')[1]);
    var totalMinute = startTimeHour * 60 + startTimeMinute;
    return totalMinute;

}

function getHourAndMinuteFromMinute(totalminute) {
    if (isNaN(totalminute)) {
        return null;
    }
    var minute = totalminute % 60;
    var hour = Math.floor(totalminute / 60);
    var hourResult = hour < 10 ? "0" + hour.toString() : hour.toString();
    var minuteResult = minute < 10 ? "0" + minute.toString() : minute.toString();
    return hourResult + ":" + minuteResult;

}






