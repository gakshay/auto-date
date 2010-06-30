// -----------------------------------------------------------------------------------
//
//	Autodate v1.0.1 : a prototype based autocomplete date picker
//	by Akshay Gupta (gakshay) - http://gakshay.wordpress.com
//	Last Modification: 30/06/2010
//
//	Questions, comments, bugs? - see the project page: http://code.google.com/p/auto-date
//
//	Released under MIT-LICENSE
//
// -----------------------------------------------------------------------------------

ONLY_FUTURE_DATE = false;
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dateWord = /^(to(day)?|to(morrow)?|ye(sterday)?|ch(ristmas)?|new(\syear)?|((next|last)\s)?(wee(k)?|wee(kend)?|mo(nth)?|mo(nday)?|tu(esday)?|wed(nesday)?|th(ursday)?|f(riday)?|sa(turday)?|su(nday)?))/gi;
var dateMMDD  = /^(1[0-2]|0?[1-9])([\.\/\-\s])((0?[1-9])|[12][0-9]|3[01])([\.\/\-\s\'])?(\d{2})?$/gi;
var dateDDMM  = /^((0?[1-9])|[12][0-9]|3[01])([\.\/\-\s])(1[0-2]|0?[1-9])([\.\/\-\s\'])?(\d{2})?$/gi;
var dateDDMon = /^((0?[1-9])|[12][0-9]|3[01])([\.\/\-\s\'])?(\w{3,9})([\.\/\-\s\'])?(\d{2})?$/gi;
var dateMonDD = /^(\w{3,9})([\.\/\-\s\'])?((0?[1-9])|[12][0-9]|3[01])?([\.\/\-\s\'])?(\d{2})?$/gi;

var AutoDate = Class.create ({
	initialize : function (element, future_date) {
		cal = this;
		ONLY_FUTURE_DATE = (future_date == null) ? false : future_date;
		console.log(ONLY_FUTURE_DATE);
		this.element = element;
		this.dateId = element.id;
		this.preDate = (this.element.tagName == "INPUT") ? $(this.dateId).value : $(this.dateId).innerHTML;
		this.dateForm(this.dateId);
		this.dText = $('date_text'); 
		this.dHide = $('date_hidden'); 
		this.flag = 0;
		this.dateArr = [];
		this.presentDate();
		this.autoEvents();
	},
	
	dateForm: function (id) {
		this.end();
		var newDate="<div id='date_popup'><input id='date_text' name='date_text' value='' size='23'/><div id='date_hidden' class='autocomplete'></div><h4>\tEnter Date</h4></div>";
		$(id).insert({before: newDate});
	},
	
	autoEvents: function () {
		$(this.dText).writeAttribute({onkeyup: "cal.autoDate(event)", onkeydown: "cal.dateUpDown(event)", onchange:"cal.dateEnter()", onselect:"cal.autoOff()", onblur:"cal.dateEnter();"});
		Form.Element.select(this.dText);
	},
	
	presentDate: function() {
	 	$(this.dText).value = this.preDate;
	 	$(this.dHide).hide();	
	},
	
	autoDate: function (e) {
		var key = getKeyCode(e);
		if ( key!=9 && key!=16 && key!=13 && key!=38 && key!=40 && key!=65 && key!=224)   {
			this.flag = 0; this.dateArr.clear();
			var inp = $(this.dText).value ;
			if (inp == "" ) { this.autoOff();}
			if (inp.match(dateDDMM)) {this.flag++; this.menuDate(this.funDDMM(inp));}
			if (inp.match(dateMMDD)) {this.flag++; this.menuDate(this.funMMDD(inp));}
			if (inp.match(dateDDMon)){this.flag++; this.menuDate(this.funDDMon(inp));}
			else if(inp.match(dateWord))  {this.flag++; this.funWord(inp);}
			else if (inp.match(dateMonDD)){this.flag++; this.menuDate(this.funMonDD(inp));}
		}
		if(key == 27) {
			this.end();
		}
	},
	
	dateUpDown: function(e) {
		var key = getKeyCode(e);
		if(key == 38 || key == 40) {
			var li = $$("#"+$(this.dHide).id+ " li");
			var tmp = $$("#"+$(this.dHide).id+" .date_selected")[0];
			if (tmp && li) {
				var no = $(tmp).id.split('_')[2];
				if (key == 40 && no < li.length-1){
					$("date_hidden_"+ no).removeClassName($(tmp).className);
					++no; $("date_hidden_"+ no).addClassName("date_selected");
				}
				else if (key ==38 && no > 0){
					$("date_hidden_"+ no).removeClassName($(tmp).className);
					--no; $("date_hidden_"+ no).addClassName("date_selected");
				}
			}
		}
	},
	
	dateEnter: function(){
			if ($$("#"+$(this.dHide).id + " .date_selected")[0]) {
				var val = $$("#" + $(this.dHide).id + " .date_selected")[0].innerHTML;
				if (val.match(/\,/g)) {
					$(this.dText).value= val.split('\,')[1];}
				else { $(this.dText).value = val; }
			}
			this.autoOff();
			if ($(cal.dText).value){
				if (cal.element.tagName == "INPUT")
					$(cal.dateId).value = $(cal.dText).value;
				else
					$(cal.dateId).innerHTML = $(cal.dText).value;								
				}
			else { 
				if (cal.element.tagName == "INPUT") 
					$(cal.dateId).value = cal.preDate;
				else
					$(cal.dateId).innerHTML = cal.preDate;
				}
			if ($('date_popup')) {$('date_popup').remove();}	
			return ;	
	},
	
	menuDate: function(date) {
		if (this.flag && date) {
			this.dateArr.push(date); 
			this.autoOn(this.dateArr);
		}
	},
	
	autoOn: function(list) {
		var a = [];
		this.autoOff();
		list = list.uniq();
		for(var i=0; i<list.length; i++) {
			a[i] = new Element('li',{'id':"date_hidden_"+i}).update(list[i]);
			$(this.dHide).insert(a[i],'bottom');
		 }
		$$("#"+$(this.dHide).id+" #date_hidden_0")[0].addClassName('date_selected');
		$(this.dHide).show();
	},
	
	autoOff: function() {
		$(this.dHide).hide();
		var child = $(this.dHide).childElements();
		child.each( function (item) {item.remove();});	
	},
	
	funDDMM: function(inp) {
		var dList = inp.split(/[\.\/\-\s]/g);
		dList = dateList(dList);
		return (dateVer(dList[0],dList[1],dList[2]));
	},

	funMMDD: function(inp) {
		var dList = inp.split(/[\.\/\-\s]/g);
		dList = dateList(dList);
		return (dateVer(dList[1],dList[0],dList[2]));
	},

	funDDMon: function(inp) {
		inp = inp.replace(/[\.\/\-\s\']/gi,"");
		var dList = [];
		var mm = inp.split(/\d{1,4}/gi)[1];
		var ddyy = inp.split(/\D{1,4}/gi);
		mm = monNo(mm);
		if (ddyy[1] != "") {dList = [ddyy[0],mm,ddyy[1]];} 
		else {dList = [ddyy[0],mm];}
		dList = dateList(dList);
		return (dateVer(dList[0],dList[1],dList[2]));
	},

	funMonDD: function(inp) {
		var date = new Date();
		var dList = [];
		dList[1] = monNo(inp.split(/\d{1,4}/gi)[0]);
		if(dList[1]) {
			if (dList[1] <= date.getMonth()+1) { dList[2] = "09" ;}
			var tmp = inp.split(/\D/gi);
			if (tmp[tmp.length-2] != ""){
				dList[0] = tmp[tmp.length-2];
				dList[2] = tmp[tmp.length-1];
				}
			else if (tmp[tmp.length-1] != "") { dList[0] = tmp[tmp.length-1];}
			else {dList[0] =1;}
			dList = dateList(dList);
			return (dateVer(dList[0],dList[1],dList[2]));
		}
		else {return false;}
	},
	
	common: function(dd, mm, yy, word) {
		var date = new Date();
		date.setMonth(mm); date.setDate(dd);  date.setFullYear(yy);
		if (!isPastDate(date.getDate(),date.getMonth()+1, date.getFullYear()) ){
			var matchList = [word, dateFormat(date)];
			this.menuDate(matchList);
		}
	},
	
	funWord: function(inp) {
		var set =0;
		var date = new Date();
		var dd = date.getDate(); var mm = date.getMonth(); var yy = date.getFullYear(); var day = date.getDay();
		
		if ( inp.match(/^tod/gi)) {	set=1; this.common(dd,mm,yy,"Today");	}
	 	else if ( inp.match(/^tom/gi)) {set=1; this.common(dd+1,mm,yy,"Tomorrow"); }
		else if ( inp.match(/^to$/gi)) {
			set=1; this.common(dd,mm,yy,"Today");
			this.common(dd+1,mm,yy,"Tomorrow"); 
		}
	 	else if (inp.match(/^ye/gi)) {	set=1; this.common(dd-1,mm,yy,"Yesterday"); }
		else if (inp.match(/^ch/gi)) {	set=1; this.common(25,11,yy,"Christmas"); }
		else if (inp.match(/^new/gi)) {	set=1; this.common(1,0,yy+1,"New Year"); 	}
		else if (inp.match(/^last\s/gi)) {
			var dtext = inp.split(' ')[1];
			if (dtext.match(/^mo(nth)?/gi)) 	{set=1; this.common(01,mm-1,yy,"Last Month");}
			if (dtext.match(/^wee(kend)?/gi)) 	{set=1; this.common(dd-day-1,mm,yy,"Last Weekend");}
			if (dtext.match(/^wee(k)?/gi)) 		{set=1; this.common(dd-day-6,mm,yy,"Last Week");}
			if (dtext.match(/^mo(nday)?/gi)) 	{set=1; this.common(dd-day-6,mm,yy,"Last Monday"); }
			if (dtext.match(/^tue(sday)?/gi))	{date.setDate(dd-day-5); }
			if (dtext.match(/^wed(nesday)?/gi)) {date.setDate(dd-day-4); }
			if (dtext.match(/^thu(rsday)?/gi)) 	{date.setDate(dd-day-3); }
			if (dtext.match(/^f(riday)?/gi)) 	{date.setDate(dd-day-2); }
			if (dtext.match(/^sa(turday)?/gi))	{date.setDate(dd-day-1); }
			if (dtext.match(/^su(nday)?/gi))	{date.setDate(dd-day);   }
		}
		else if (inp.match(/^next\s/gi)) {
			var dtext = inp.split(' ')[1];
			if (dtext.match(/^mo(nth)?/gi)) 	{set=1; this.common(01,mm+1,yy,"Next Month");}
			if (dtext.match(/^wee(kend)?/gi)) 	{set=1; this.common(dd-day+13,mm,yy,"Next Weekend");}
			if (dtext.match(/^wee(k)?/gi)) 		{set=1; this.common(dd-day+8,mm,yy,"Next Week");}
			if (dtext.match(/^mo(nday)?/gi)) 	{set=1; this.common(dd-day+8,mm,yy,"Next Monday"); }
			if (dtext.match(/^tu(esday)?/gi))	{date.setDate(dd-day+9); }
			if (dtext.match(/^wed(nesday)?/gi)) {date.setDate(dd-day+10); }
			if (dtext.match(/^th(ursday)?/gi)) 	{date.setDate(dd-day+11); }
			if (dtext.match(/^f(riday)?/gi)) 	{date.setDate(dd-day+12); }
			if (dtext.match(/^sa(turday)?/gi))	{date.setDate(dd-day+13); }
			if (dtext.match(/^su(nday)?/gi))	{date.setDate(dd-day+14); }	
		}
		if ( inp.match(/^wee/gi)) {
			set=1; this.common(dd-day+6,mm,yy,"Weekend"); 
			this.common(dd-day+8,mm,yy,"Week");
		}
		else if (inp.match(/^mo(nday)?/gi) ) {
			if (day > 0) {date.setDate(dd+8-day);}
			else {date.setDate(dd+(1-day));}
		}
		else if( inp.match(/^tu(esday)?/gi)) {
			if (day > 1) {date.setDate(dd+9-day);}
			else	{date.setDate(dd+(2-day));}
		}
		else if( inp.match(/^wed(nesday)?/gi)) {
			if (day > 2) {date.setDate(dd+10-day);}
			else {date.setDate(dd+(3-day)); }
		}
		else if( inp.match(/^th(ursday)?/gi)) {
			if (day > 3) {date.setDate(dd+11-day); }
			else {date.setDate(dd+(4-day));}
		}
		else if( inp.match(/^f(riday)?/gi)) {
			if (day > 4) {date.setDate(dd+12-day);}
			else {date.setDate(dd+5-day);}
		}
		else if( inp.match(/^sa(turday)?/gi)) {
			if (day > 5) {date.setDate(dd+13-day);}
			else {date.setDate(dd+6-day);}
		}
		else if( inp.match(/^su(nday)?/gi)) { date.setDate(dd+7-day);}
		if (set != 1) { this.menuDate(dateFormat(date)); }
	},
	
	end: function() { 
		if ($('date_popup')) {$('date_popup').remove();}
	}
});

function getKeyCode(e) {
	if (e == null) { 
		var keycode = e.keyCode; //VAR
	} else { 
		var keycode = e.which; //VAR
	}
	return keycode;
}

function dateList(dList) {
	for (var i=0; i<2; i++) {
		if ((/^[0-9]$/g).test(dList[i])){ dList[i] = "0"+ dList[i]; }
	}
	if(dList[2]){
		if ((dList[2]).match(/^[7-9]\d$/g)) { dList[2] = "19" + dList[2]; }
		else {dList[2] = "20" + dList[2]; }	
	}
	else {dList[2] = new Date().getFullYear();}
	return dList;
}

function dateVer (dd, mm, yyyy) {
	var dArray = [dd,mm,yyyy].join('/');
	var date = new Date();
	if (isDate(dArray)) {
		date.setMonth(mm-1); date.setDate(dd); date.setFullYear(yyyy);
		return dateFormat(date);
	}
}

function dateFormat(date) {
	if (!isPastDate(date.getDate(),date.getMonth()+1, date.getFullYear()) ){
		return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear()
	}
}


function isPastDate(day, month, year) {
	today = new Date();
	date = new Date(year,month-1,day) 
	if (ONLY_FUTURE_DATE && ( date < today)) {
		return true;
	}
}

function monNo (mon) {
	if (mon.match(/^jan(uary)?/gi))  {return 01;}
	if (mon.match(/^feb(rary)?/gi))  {return 02;}
	if (mon.match(/^mar(ch)?/gi)) 	 {return 03;}
	if (mon.match(/^apr(il)?/gi)) 	 {return 04;}
	if (mon.match(/^may/gi)) 		 {return 05;}
	if (mon.match(/^jun(e)?/gi))	 {return 06;}
	if (mon.match(/^jul(y)?/gi)) 	 {return 07;}
	if (mon.match(/^aug(ust)?/gi))	 {return 8;}
	if (mon.match(/^sep(tember)?/gi)){return 9;}
	if (mon.match(/^oct(ober)?/gi))  {return 10;}
	if (mon.match(/^nov(ember)?/gi)) {return 11;}
	if (mon.match(/^dec(ember)?/gi)) {return 12;}
	else return false;
}

/**
 * DHTML date validation script for dd/mm/yyyy. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */
var dtCh= "/";
var minYear=1970;
var maxYear=2069;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31;
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30;}
		if (i==2) {this[i] = 29;}
   } 
   return this;
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12);
	var pos1=dtStr.indexOf(dtCh);
	var pos2=dtStr.indexOf(dtCh,pos1+1);
	var strDay=dtStr.substring(0,pos1);
	var strMonth=dtStr.substring(pos1+1,pos2);
	var strYear=dtStr.substring(pos2+1);
	strYr=strYear;
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1);
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1);
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
	}
	month=parseInt(strMonth);
	day=parseInt(strDay);
	year=parseInt(strYr);
	if (pos1==-1 || pos2==-1){
		return false;
	}
	//if (isPastDate(day, month, year)){ return false;}
	if (strMonth.length<1 || month<1 || month>12){return false;}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		return false; }
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		return false;}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		return false ;}
return true;
}
