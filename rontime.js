// constanty
const SHOWWORKED = "Již odpracováno: ";


htmlBody = document.body.innerHTML;
// #for debuging/testing
//var htmlBody = 
//"<html><head></head><body><table class='browser browserdenni puvodnidochazka'><tr class='today '><td class='browser_rowheader'><span class='zkratkadne'>Út</span>27.2.2018</td><td>07:07 &nbsp; Příchod</td><td>11:11 &nbsp; Přestávka</td><td>11:39 &nbsp; Příchod</td><td>13:44 &nbsp; Odchod</td><td>15:25 &nbsp; Příchod</td><td>16:54 &nbsp; Odchod</td></tr></table></body></html>";

//document.body.innerHTML= htmlBody;
 //alert(GetDiffMinutes("11:30","12:30"));                  
                  
                  
      



   //document.body.innerHTML;
   var tables =  document.getElementsByClassName("browser browserdenni puvodnidochazka");
   if (tables == null)
   {
    alert("null");
   }
   
   var table = tables[0];

   var today = table.getElementsByClassName("today")[0];
   var actions = today.childNodes;
   
                                           





var totalWorkMinute = 0;
var starttime = "";
var result = "";
var endwithExit = false;
for (var i = 1; i < actions.length; i++) {
    var cur = actions[i].innerText;
    //alert(cur);
    if (!cur || 0===cur.lenght)
    {
      continue;
    }
    var stringtime = cur.split(' ')[0].trim();
    var stringactivity = cur.split(' ')[2].trim();

     if (stringactivity.toLowerCase().includes("příchod") && starttime == "")
     {
      starttime =  stringtime;
      //alert(starttime);
     }
     if (stringactivity.toLowerCase().includes("odchod") || stringactivity.toLowerCase().includes("přestávka") || stringactivity.toLowerCase().includes("soukromě")
     )
     {
             totalWorkMinute += GetDiffMinutes(starttime,stringtime);
             starttime = "";
             endwithExit = i == actions.length-1;
   
     }
    //alert(i);
    //test(stringtime);
    //alert(totalWorkMinute+"ST:"+starttime+";endwidth"+endwithExit);
}       
   

var currentdate = new Date();
var currentTime =  currentdate.getHours() + ":" + currentdate.getMinutes();

if (!endwithExit)
{
    totalWorkMinute += GetDiffMinutes(starttime,currentTime);
}

result =  GetHourAndMinuteFromMinute(totalWorkMinute);                       

document.body.innerHTML= '<div style="padding-top:8px;padding-bottom:8px;position:relative;top:0;margin-top:0;width:100%;opacity:0.3;z-index:100;background:white;color:black;font-size:25px;text-align:center;">'+SHOWWORKED+result+'</div>'+htmlBody;


function GetDiffMinutes(startTime, endTime)
{
    //alert ("Začátek "+startTime +" konec "+endTime);
   var totalStartMinute = GetTotalMinute(startTime) ;
   var totalEndMinute =  GetTotalMinute(endTime);
   var totalDiffMinute = totalEndMinute - totalStartMinute;
   return  totalDiffMinute;
  
}

function GetTotalMinute(time)
{
   var startTimeHour = parseInt(time.split(':')[0]);
   var startTimeMinute = parseInt(time.split(':')[1]);
   var totalMinute = startTimeHour*60+ startTimeMinute;
  return totalMinute;

}

 function GetHourAndMinuteFromMinute(totalminute)
{
      var minute = totalminute % 60;
      var hour =  Math.floor(totalminute/60);
           var hourResult = hour < 10 ? "0"+hour.toString() : hour.toString();
      var minuteResult = minute < 10 ? "0"+minute.toString() : minute.toString();
      return hourResult+":"+minuteResult;

}






