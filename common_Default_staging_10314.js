/**
 * Copyright 2006 Tim Down.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function log_init()
{
}

if(!Array.prototype.push){
	Array.prototype.push=function(){
		for(var i=0;i<arguments.length;i++){
			this[this.length]=arguments[i]
		}
		return this.length
	}
}

if(!Array.prototype.shift){
	Array.prototype.shift=function(){
		if(this.length>0){
			var firstItem=this[0];
			for(var i=0;i<this.length-1;i++){
				this[i]=this[i+1]
			}
			this.length=this.length-1;
			return firstItem
		}
	}
}

if(!Array.prototype.splice){
	Array.prototype.splice=function(startIndex,deleteCount){
		var itemsAfterDeleted=this.slice(startIndex+deleteCount);
		var itemsDeleted=this.slice(startIndex,startIndex+deleteCount);
		this.length=startIndex;
		var argumentsArray=[];
		
		for(var i=0;i<arguments.length;i++){
			argumentsArray[i]=arguments[i]
		}
		
		var itemsToAppend=(argumentsArray.length>2)?itemsAfterDeleted=argumentsArray.slice(2).concat(itemsAfterDeleted):itemsAfterDeleted;
		
		for(i=0;i<itemsToAppend.length;i++){
			this.push(itemsToAppend[i])
		}
		
		return itemsDeleted
	}
}

var log4javascript;
var SimpleDateFormat;
(function(){
	function isUndefined(obj){
		return typeof obj=="undefined"
	}
(function(){
	var regex=/('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
	var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
	var dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var TEXT2=0,TEXT3=1,NUMBER=2,YEAR=3,MONTH=4,TIMEZONE=5;var types={G:TEXT2,y:YEAR,Y:YEAR,M:MONTH,w:NUMBER,W:NUMBER,D:NUMBER,d:NUMBER,F:NUMBER,E:TEXT3,a:TEXT2,H:NUMBER,k:NUMBER,K:NUMBER,h:NUMBER,m:NUMBER,s:NUMBER,S:NUMBER,Z:TIMEZONE};
	var ONE_DAY=24*60*60*1000;
	var ONE_WEEK=7*ONE_DAY;
	var DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK=1;
	Date.prototype.getDifference=function(date){
		return this.getTime()-date.getTime()
	};
	Date.prototype.isBefore=function(d){
		return this.getTime()<d.getTime()
	};
	Date.prototype.getWeekInYear=function(minimalDaysInFirstWeek){
		if(isUndefined(this.minimalDaysInFirstWeek)){
			minimalDaysInFirstWeek=DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK
		}
		var previousSunday=new Date(this.getTime()-this.getDay()*ONE_DAY);
		previousSunday=new Date(previousSunday.getFullYear(),previousSunday.getMonth(),previousSunday.getDate());
		var startOfYear=new Date(this.getFullYear(),0,1);
		var numberOfSundays=previousSunday.isBefore(startOfYear)?0:1+Math.floor((previousSunday.getTime()-startOfYear.getTime())/ONE_WEEK);
		var numberOfDaysInFirstWeek=7-startOfYear.getDay();
		var weekInYear=numberOfSundays;
		
		if(numberOfDaysInFirstWeek>=minimalDaysInFirstWeek){
			weekInYear++
		}return weekInYear
	};
	Date.prototype.getWeekInMonth=function(minimalDaysInFirstWeek){
		if(isUndefined(this.minimalDaysInFirstWeek)){
			minimalDaysInFirstWeek=DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK
		}
		var previousSunday=new Date(this.getTime()-this.getDay()*ONE_DAY);
		previousSunday=new Date(previousSunday.getFullYear(),previousSunday.getMonth(),previousSunday.getDate());
		var startOfMonth=new Date(this.getFullYear(),this.getMonth(),1);
		var numberOfSundays=previousSunday.isBefore(startOfMonth)?0:1+Math.floor((previousSunday.getTime()-startOfMonth.getTime())/ONE_WEEK);
		var numberOfDaysInFirstWeek=7-startOfMonth.getDay();
		var weekInMonth=numberOfSundays;
		
		if(numberOfDaysInFirstWeek>=minimalDaysInFirstWeek){
			weekInMonth++
		}
		return weekInMonth
	};
	
	Date.prototype.getDayInYear=function(){
		var startOfYear=new Date(this.getFullYear(),0,1);
		return 1+Math.floor((this.getTime()-startOfYear.getTime())/ONE_DAY)
	};
	SimpleDateFormat=function(formatString){
		this.formatString=formatString
	};
	SimpleDateFormat.prototype.setMinimalDaysInFirstWeek=function(days){
		this.minimalDaysInFirstWeek=days
	};
	SimpleDateFormat.prototype.getMinimalDaysInFirstWeek=function(days){
		return isUndefined(this.minimalDaysInFirstWeek)?DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK:this.minimalDaysInFirstWeek
	};
	SimpleDateFormat.prototype.format=function(date){
		var formattedString="";
		var result;
		var padWithZeroes=function(str,len){
			while(str.length<len){
				str="0"+str
			}
			return str
		};
			
		var formatText=function(data,numberOfLetters,minLength){
			return(numberOfLetters>=4)?data:data.substr(0,Math.max(minLength,numberOfLetters))
		};
		
		var formatNumber=function(data,numberOfLetters){
			var dataString=""+data;return padWithZeroes(dataString,numberOfLetters)
		};
		var searchString=this.formatString;
		
		while((result=regex.exec(searchString))){
			var matchedString=result[0];
			var quotedString=result[1];
			var patternLetters=result[2];
			var otherLetters=result[3];
			var otherCharacters=result[4];
			if(quotedString){
				if(quotedString=="''"){
					formattedString+="'"
				}else{
					formattedString+=quotedString.substring(1,quotedString.length-1)
				}
			}else 
			if(otherLetters){
			}else if(otherCharacters){
				formattedString+=otherCharacters
			}else if(patternLetters){
				var patternLetter=patternLetters.charAt(0);
				var numberOfLetters=patternLetters.length;
				var rawData="";
				switch(patternLetter){
					case "G":rawData="AD";
						break;
					case "y":rawData=date.getFullYear();
						break;
					case "M":rawData=date.getMonth();
						break;
					case "w":rawData=date.getWeekInYear(this.getMinimalDaysInFirstWeek());
						break;
					case "W":rawData=date.getWeekInMonth(this.getMinimalDaysInFirstWeek());
						break;
					case "D":rawData=date.getDayInYear();
						break;
					case "d":rawData=date.getDate();
						break;
					case "F":rawData=1+Math.floor((date.getDate()-1)/7);
						break;
					case "E":rawData=dayNames[date.getDay()];
						break;
					case "a":rawData=(date.getHours()>=12)?"PM":"AM";
						break;
					case "H":rawData=date.getHours();
						break;
					case "k":rawData=1+date.getHours();
						break;
					case "K":rawData=date.getHours()%12;
						break;
					case "h":rawData=1+(date.getHours()%12);
						break;
					case "m":rawData=date.getMinutes();
						break;
					case "s":rawData=date.getSeconds();
						break;
					case "S":rawData=date.getMilliseconds();
						break;
					case "Z":rawData=date.getTimezoneOffset();
						break
				}
				switch(types[patternLetter]){
					case TEXT2:formattedString+=formatText(rawData,numberOfLetters,2);
						break;
					case TEXT3:formattedString+=formatText(rawData,numberOfLetters,3);
						break;
					case NUMBER:formattedString+=formatNumber(rawData,numberOfLetters);
						break;
					case YEAR:if(numberOfLetters<=2){
						var dataString=""+rawData;
						formattedString+=dataString.substr(2,2)
						}else{
							formattedString+=formatNumber(rawData,numberOfLetters)
						}
						break;
					case MONTH:
						if(numberOfLetters>=3){
							formattedString+=formatText(monthNames[rawData],numberOfLetters,numberOfLetters)
						}else{
							formattedString+=formatNumber(rawData+1,numberOfLetters)
						}
						break;
					case TIMEZONE:var isPositive=(rawData>0);
						var prefix=isPositive?"-":"+";
						var absData=Math.abs(rawData);
						var hours=""+Math.floor(absData/60);hours=padWithZeroes(hours,2);
						var minutes=""+(absData%60);
						minutes=padWithZeroes(minutes,2);
						formattedString+=prefix+hours+minutes;
						break
					}
				}
				searchString=searchString.substr(result.index+result[0].length)
			}
			return formattedString
		}
	})();
		
	var applicationStartDate=new Date();
	var uniqueId="log4javascript_"+applicationStartDate.getTime()+"_"+Math.floor(Math.random()*100000000);
	var emptyFunction=function(){};
	var newLine="\r\n";
	log4javascript={};
	log4javascript.version="1.3.1";
	function getExceptionStringRep(ex){
		if(ex){
			var exStr="Exception: ";
			if(ex.message){
				exStr+=ex.message
			}else if(ex.description){
				exStr+=ex.description
			}if(ex.lineNumber){
				exStr+=" on line number "+ex.lineNumber
			}if(ex.fileName){
				exStr+=" in file "+ex.fileName
			}if(showStackTraces&&ex.stack){
				exStr+=newLine+"Stack trace:"+newLine+ex.stack
			}return exStr
		}
		return null
	}
	
	function formatObjectExpansion(obj,depth,indentation){
		var i,output,childDepth,childIndentation,childLines;
		if((obj instanceof Array)&&depth>0){
			if(!indentation){
				indentation=""
			}
			output="["+newLine;childDepth=depth-1;
			childIndentation=indentation+"  ";
			childLines=[];
			for(i=0;i<obj.length;i++){
				childLines.push(childIndentation+formatObjectExpansion(obj[i],childDepth,childIndentation))
			}
			output+=childLines.join(","+newLine)+newLine+indentation+"]";
			return output
		}else if(typeof obj=="object"&&depth>0){
			if(!indentation){
				indentation=""
			}
			output=""+"{"+newLine;childDepth=depth-1;
			childIndentation=indentation+"  ";
			childLines=[];
			for(i in obj){
				childLines.push(childIndentation+i+": "+formatObjectExpansion(obj[i],childDepth,childIndentation))
			}
			output+=childLines.join(","+newLine)+newLine+indentation+"}";
			return output
		}else if(typeof obj=="string"){
			return obj
		}else{return obj.toString()
	}
}

function escapeNewLines(str){
	return str.replace(/\r\n|\r|\n/g,"\\r\\n")
}

function urlEncode(str){
	return escape(str).replace(/\+/g,"%2B").replace(/"/g, "%22").replace(/'/g, "%27").replace(/\//g, "%2F")
}

function bool(obj){
	return Boolean(obj)
}

function array_remove(arr,val){
	var index=-1;
	for(var i=0;i<arr.length;i++){
		if(arr[i]===val){
			index=i;
			break
		}
	}
	
	if(index>=0){
		arr.splice(index,1);return true
	}else{
		return false
	}
}

function extractBooleanFromParam(param,defaultValue){
	if(isUndefined(param)){
		return defaultValue}
	else{
		return bool(param)
	}
}

function extractStringFromParam(param,defaultValue){
	if(isUndefined(param)){
		return defaultValue
	}else{
		return String(param)
	}
}

function extractIntFromParam(param,defaultValue){
	if(isUndefined(param)){
		return defaultValue
	}else{
		try{
			var value=parseInt(param,10);
			return isNaN(value)?defaultValue:value
		}catch(ex){
			logLog.warn("Invalid int param "+param,ex);
			return defaultValue
		}
	}
}

function extractFunctionFromParam(param,defaultValue){
	if(typeof param=="function"){
		return param
	}else{
		return defaultValue
	}
}

var logLog={
	quietMode:false,
	setQuietMode:function(quietMode){this.quietMode=bool(quietMode)},
	numberOfErrors:0,
	alertAllErrors:false,
	setAlertAllErrors:function(alertAllErrors){this.alertAllErrors=alertAllErrors},
	debug:function(message,exception){},
	warn:function(message,exception){},
	error:function(message,exception){
		if(++this.numberOfErrors==1||this.alertAllErrors){
			if(!this.quietMode){
				var alertMessage="log4javascript error: "+message;
				if(exception){
					alertMessage+=newLine+newLine+"Original error: "+getExceptionStringRep(exception)
				}
				alert(alertMessage)
			}
		}
	}
};

log4javascript.logLog=logLog;
var errorListeners=[];
log4javascript.addErrorListener=function(listener){
					if(typeof listener=="function"){
						errorListeners.push(listener)
					}else{
						handleError("addErrorListener: listener supplied was not a function")
					}
				};
				
log4javascript.removeErrorListener=function(listener){
					array_remove(errorListeners,listener)
				};
				
function handleError(message,exception){
	logLog.error(message,exception);
	for(var i=0;i<errorListeners.length;i++){
		errorListeners[i](message,exception)
	}
}

var enabled=(typeof log4javascript_disabled!="undefined")&&log4javascript_disabled?false:true;
log4javascript.setEnabled=function(enable){
				enabled=bool(enable)
			};
			
log4javascript.isEnabled=function(){
				return enabled
			};
			
log4javascript.evalInScope=function(expr){
				return eval(expr)
			};
			
var showStackTraces=false;
log4javascript.setShowStackTraces=function(show){
					showStackTraces=bool(show)
				};
				
function Logger(name){
		this.name=name;
		var appenders=[];
		var loggerLevel=Level.DEBUG;
		this.addAppender=function(appender){
					if(appender instanceof log4javascript.Appender){
						appenders.push(appender)
					}else{
						handleError("Logger.addAppender: appender supplied is not a subclass of Appender")
					}
				};
		this.removeAppender=function(appender){
				array_remove(appenders,appender)
		};
		
		this.removeAllAppenders=function(appender){
				appenders.length=0
		};
		
		this.log=function(level,message,exception){
				if(level.isGreaterOrEqual(loggerLevel)){
						var loggingEvent=new LoggingEvent(this,new Date(),level,message,exception);
						for(var i=0;i<appenders.length;i++){
							appenders[i].doAppend(loggingEvent)
						}
				}
			};
			
		this.setLevel=function(level){
				loggerLevel=level
		};
		
		this.getLevel=function(){
				return loggerLevel
		}
}

Logger.prototype={
	trace:function(message,exception){
		this.log(Level.TRACE,message,exception)
	},
	debug:function(message,exception){
		this.log(Level.DEBUG,message,exception)
	},
	info:function(message,exception){
		this.log(Level.INFO,message,exception)
	},
	warn:function(message,exception){
		this.log(Level.WARN,message,exception)
	},
	error:function(message,exception){
		this.log(Level.ERROR,message,exception)
	},
	fatal:function(message,exception){
		this.log(Level.FATAL,message,exception)
	}
};

Logger.prototype.trace.isEntryPoint=true;
Logger.prototype.debug.isEntryPoint=true;
Logger.prototype.info.isEntryPoint=true;
Logger.prototype.warn.isEntryPoint=true;
Logger.prototype.error.isEntryPoint=true;
Logger.prototype.fatal.isEntryPoint=true;
var loggers={};
log4javascript.getLogger=function(loggerName){
	if(!(typeof loggerName=="string")){
		loggerName="[anonymous]"
	}
	if(!loggers[loggerName]){
		loggers[loggerName]=new Logger(loggerName)
	}return loggers[loggerName]
};

var defaultLogger=null;
log4javascript.getDefaultLogger=function(){
	if(!defaultLogger){
		defaultLogger=log4javascript.getLogger("[default]");
		var a=new log4javascript.PopUpAppender();
		defaultLogger.addAppender(a)
	}
	return defaultLogger
};

var nullLogger=null;
log4javascript.getNullLogger=function(){
	if(!nullLogger){
		nullLogger=log4javascript.getLogger("[null]")
	}
	return nullLogger
};

var Level=function(level,name){
	this.level=level;this.name=name
};

Level.prototype={
	toString:function(){
		return this.name
	},
	equals:function(level){
		return this.level==level.level
	},
	isGreaterOrEqual:function(level){
		return this.level>=level.level
	}
};

Level.ALL=new Level(Number.MIN_VALUE,"ALL");
Level.TRACE=new Level(10000,"TRACE");
Level.DEBUG=new Level(20000,"DEBUG");
Level.INFO=new Level(30000,"INFO");
Level.WARN=new Level(40000,"WARN");
Level.ERROR=new Level(50000,"ERROR");
Level.FATAL=new Level(60000,"FATAL");
Level.OFF=new Level(Number.MAX_VALUE,"OFF");
log4javascript.Level=Level;
var LoggingEvent=function(logger,timeStamp,level,message,exception){
	this.logger=logger;
	this.timeStamp=timeStamp;
	this.timeStampInSeconds=Math.floor(timeStamp.getTime()/1000);
	this.level=level;
	this.message=message;
	this.exception=exception};
	LoggingEvent.prototype.getThrowableStrRep=function(){
		return this.exception?getExceptionStringRep(this.exception):""
	};
	
	log4javascript.LoggingEvent=LoggingEvent;var Layout=function(){};
	Layout.prototype={
		defaults:{
			loggerKey:"logger",timeStampKey:"timestamp",levelKey:"level",messageKey:"message",exceptionKey:"exception",urlKey:"url"
		},
		loggerKey:"logger",
		timeStampKey:"timestamp",
		levelKey:"level",
		messageKey:"message",
		exceptionKey:"exception",
		urlKey:"url",
		batchHeader:"",batchFooter:"",
		batchSeparator:"",
		format:function(loggingEvent){
			handleError("Layout.format: layout supplied has no format() method")
		},
		ignoresThrowable:function(){
			handleError("Layout.ignoresThrowable: layout supplied has no ignoresThrowable() method")
		},
		getContentType:function(){
			return "text/plain"
		},
		allowBatching:function(){
			return true
		},
		getDataValues:function(loggingEvent){
			var dataValues=[ [this.loggerKey,loggingEvent.logger.name],[this.timeStampKey,loggingEvent.timeStampInSeconds],[this.levelKey,loggingEvent.level.name],[this.urlKey,window.location.href],[this.messageKey,loggingEvent.message] ];
			if(loggingEvent.exception){
				dataValues.push([this.exceptionKey,getExceptionStringRep(loggingEvent.exception)])
			}
			if(this.hasCustomFields()){
				for(var i=0;i<this.customFields.length;i++){
					dataValues.push([this.customFields[i].name,this.customFields[i].value])
				}
			}
			
			return dataValues
		},
		setKeys:function(loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey){
			this.loggerKey=extractStringFromParam(loggerKey,this.defaults.loggerKey);
			this.timeStampKey=extractStringFromParam(timeStampKey,this.defaults.timeStampKey);
			this.levelKey=extractStringFromParam(levelKey,this.defaults.levelKey);
			this.messageKey=extractStringFromParam(messageKey,this.defaults.messageKey);
			this.exceptionKey=extractStringFromParam(exceptionKey,this.defaults.exceptionKey);
			this.urlKey=extractStringFromParam(urlKey,this.defaults.urlKey)
		},
		setCustomField:function(name,value){
			var fieldUpdated=false;
			for(var i=0;i<this.customFields.length;i++){
				if(this.customFields[i].name===name){
					this.customFields[i].value=value;fieldUpdated=true
				}
			}
			if(!fieldUpdated){
				this.customFields.push({"name":name,"value":value})
			}
		},
		hasCustomFields:function(){
			return(this.customFields.length>0)
		}
	};
	log4javascript.Layout=Layout;
	var SimpleLayout=function(){
		this.customFields=[]
	};
	SimpleLayout.prototype=new Layout();
	SimpleLayout.prototype.format=function(loggingEvent){
		return loggingEvent.level.name+" - "+loggingEvent.message
	};
	SimpleLayout.prototype.ignoresThrowable=function(loggingEvent){
		return true
	};
	log4javascript.SimpleLayout=SimpleLayout;
	var NullLayout=function(){
		this.customFields=[]
	};
	NullLayout.prototype=new Layout();
	NullLayout.prototype.format=function(loggingEvent){
		return loggingEvent.message
	};
	NullLayout.prototype.ignoresThrowable=function(loggingEvent){
		return true
	};
	log4javascript.NullLayout=NullLayout;
	var XmlLayout=function(){
		this.customFields=[]
	};
	XmlLayout.prototype=new Layout();
	XmlLayout.prototype.getContentType=function(){
		return "text/xml"
	};
	XmlLayout.prototype.escapeCdata=function(str){
		return str.replace(/\]\]>/,"]]>]]&gt;<![CDATA[")
	};
	XmlLayout.prototype.format=function(loggingEvent){
		var str="<log4javascript:event logger=\""+loggingEvent.logger.name+"\" timestamp=\""+loggingEvent.timeStampInSeconds+"\" level=\""+loggingEvent.level.name+"\">"+newLine+"<log4javascript:message><![CDATA["+this.escapeCdata(loggingEvent.message.toString())+"]]></log4javascript:message>"+newLine;
		if(this.hasCustomFields()){
			for(var i=0;i<this.customFields.length;i++){
				str+="<log4javascript:customfield name=\""+this.customFields[i].name+"\"><![CDATA["+this.customFields[i].value.toString()+"]]></log4javascript:customfield>"+newLine
			}
		}
		if(loggingEvent.exception){
			str+="<log4javascript:exception><![CDATA["+getExceptionStringRep(loggingEvent.exception)+"]]></log4javascript:exception>"+newLine}str+="</log4javascript:event>"+newLine+newLine;return str
		};
		XmlLayout.prototype.ignoresThrowable=function(loggingEvent){
			return false
		};
		
		log4javascript.XmlLayout=XmlLayout;
		var JsonLayout=function(readable,loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey){
			this.readable=bool(readable);this.batchHeader=this.readable?"["+newLine:"[";this.batchFooter=this.readable?"]"+newLine:"]";
			this.batchSeparator=this.readable?","+newLine:",";
			this.setKeys(loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey);
			this.propertySeparator=this.readable?", ":",";
			this.colon=this.readable?": ":":";
			this.customFields=[]
		};
		
		JsonLayout.prototype=new Layout();
		JsonLayout.prototype.setReadable=function(readable){
			this.readable=bool(readable)
		};
		JsonLayout.prototype.isReadable=function(){
			return this.readable
		};
		JsonLayout.prototype.format=function(loggingEvent){
			var dataValues=this.getDataValues(loggingEvent);
			var str="{";
			if(this.readable){
				str+=newLine
			}
			for(var i=0;i<dataValues.length;i++){
				if(this.readable){
					str+="\t"
				}
				var valType=typeof dataValues[i][1];
				var val=(valType!="number"&&valType!="boolean")?"\""+escapeNewLines(dataValues[i][1].toString().replace(/\"/g, "\\\""))+"\"":
				dataValues[i][1];
				str+="\""+dataValues[i][0]+"\""+this.colon+val;
				if(i<dataValues.length-1){
					str+=this.propertySeparator
				}
				
				if(this.readable){
					str+=newLine
				}
			}
			str+="}";
			if(this.readable){
				str+=newLine
			}
			return str
		};
		JsonLayout.prototype.ignoresThrowable=function(loggingEvent){
			return false
		};
		log4javascript.JsonLayout=JsonLayout;
		var HttpPostDataLayout=function(loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey){
			this.setKeys(loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey);
			this.customFields=[]
		};
		HttpPostDataLayout.prototype=new Layout();
		HttpPostDataLayout.prototype.allowBatching=function(){
			return false
		};
		HttpPostDataLayout.prototype.format=function(loggingEvent){
			var dataValues=this.getDataValues(loggingEvent);
			var queryBits=[];
			for(var i=0;i<dataValues.length;i++){
				queryBits.push(urlEncode(dataValues[i][0])+"="+urlEncode(dataValues[i][1]))
			}
			return queryBits.join("&")
		};
		HttpPostDataLayout.prototype.ignoresThrowable=function(loggingEvent){
			return false
		};
		log4javascript.HttpPostDataLayout=HttpPostDataLayout;
		var PatternLayout=function(pattern){
			if(pattern){
				this.pattern=pattern
			}else{
				this.pattern=PatternLayout.DEFAULT_CONVERSION_PATTERN
			}
			this.customFields=[]
		};
		PatternLayout.TTCC_CONVERSION_PATTERN="%r %p %c - %m%n";
		PatternLayout.DEFAULT_CONVERSION_PATTERN="%m%n";
		PatternLayout.ISO8601_DATEFORMAT="yyyy-MM-dd HH:mm:ss,SSS";
		PatternLayout.DATETIME_DATEFORMAT="dd MMM yyyy HH:mm:ss,SSS";
		PatternLayout.ABSOLUTETIME_DATEFORMAT="HH:mm:ss,SSS";
		PatternLayout.prototype=new Layout();
		PatternLayout.prototype.format=function(loggingEvent){
			var regex=/%(-?[0-9]+)?(\.?[0-9]+)?([cdfmMnpr%])(\{([^\}]+)\})?|([^%]+)/;
			var formattedString="";
			var result;
			var searchString=this.pattern;
			while((result=regex.exec(searchString))){
				var matchedString=result[0];
				var padding=result[1];
				var truncation=result[2];
				var conversionCharacter=result[3];
				var specifier=result[5];
				var text=result[6];
				if(text){
					formattedString+=""+text
				}else{
					var replacement="";
					switch(conversionCharacter){
						case "c":
							var loggerName=loggingEvent.logger.name;
							if(specifier){
								var precision=parseInt(specifier,10);
								var loggerNameBits=loggingEvent.logger.name.split(".");
								if(precision>=loggerNameBits.length){
									replacement=loggerName
								}else{
									replacement=loggerNameBits.slice(loggerNameBits.length-precision).join(".")
								}
							}else{
								replacement=loggerName
							}
							break;
						case "d":
							var dateFormat=PatternLayout.ISO8601_DATEFORMAT;
							if(specifier){
								dateFormat=specifier;
								if(dateFormat=="ISO8601"){
									dateFormat=PatternLayout.ISO8601_DATEFORMAT
								}else if(dateFormat=="ABSOLUTE"){
									dateFormat=PatternLayout.ABSOLUTETIME_DATEFORMAT
								}else if(dateFormat=="DATE"){
									dateFormat=PatternLayout.DATETIME_DATEFORMAT
								}
							}
							replacement=(new SimpleDateFormat(dateFormat)).format(loggingEvent.timeStamp);
							break;
						case "f":
							if(this.hasCustomFields()){
								var fieldIndex=0;
								if(specifier){
									fieldIndex=parseInt(specifier,10);
									if(isNaN(fieldIndex)){
										handleError("PatternLayout.format: invalid specifier '"+specifier+"' for conversion character 'f' - should be a number")
									}else if(fieldIndex===0){
										handleError("PatternLayout.format: invalid specifier '"+specifier+"' for conversion character 'f' - must be greater than zero")
									}else if(fieldIndex>this.customFields.length){
										handleError("PatternLayout.format: invalid specifier '"+specifier+"' for conversion character 'f' - there aren't that many custom fields")
									}else{
										fieldIndex=fieldIndex-1
									}
								}
								replacement=this.customFields[fieldIndex].value
							}
							break;
						case "m":
							if(specifier){
								var depth=parseInt(specifier,10);
								if(isNaN(depth)){
									handleError("PatternLayout.format: invalid specifier '"+specifier+"' for conversion character 'm' - should be a number");
									replacement=loggingEvent.message
								}else{
									replacement=formatObjectExpansion(loggingEvent.message,depth)
								}
							}else{
								replacement=loggingEvent.message
							}
							break;
						case "n":
							replacement=newLine;
							break;
						case "p":
							replacement=loggingEvent.level.name;
							break;
						case "r":
							replacement=""+loggingEvent.timeStamp.getDifference(applicationStartDate);
							break;
						case "%":
							replacement="%";
							break;
						default:
							replacement=matchedString;break
					}
					var len;
					if(truncation){
						len=parseInt(truncation.substr(1),10);
						var strLen=replacement.length;
						if(len<strLen){
							replacement=replacement.substring(strLen-len,strLen)
						}
					}
					if(padding){
						if(padding.charAt(0)=="-"){
							len=parseInt(padding.substr(1),10);
							while(replacement.length<len){
								replacement+=" "
							}
						}else{
							len=parseInt(padding,10);
							while(replacement.length<len){
								replacement=" "+replacement
							}
						}
					}
					formattedString+=replacement
				}
				searchString=searchString.substr(result.index+result[0].length)
			}
			return formattedString
		};
		PatternLayout.prototype.ignoresThrowable=function(loggingEvent){
			return true
		};
		log4javascript.PatternLayout=PatternLayout;
		var Appender=function(){};
		Appender.prototype={
			layout:new PatternLayout(),
			threshold:Level.ALL,
			doAppend:function(loggingEvent){
				if(enabled&&loggingEvent.level.level>=this.threshold.level){
					this.append(loggingEvent)
				}
			},
			append:function(loggingEvent){},
			setLayout:function(layout){
				if(layout instanceof Layout){
					this.layout=layout
				}else{
					handleError("Appender.setLayout: layout supplied to "+this.toString()+" is not a subclass of Layout")
				}
			},
			getLayout:function(){
				return this.layout
			},
			setThreshold:function(threshold){
				if(threshold instanceof Level){
					this.threshold=threshold
				}else{
					handleError("Appender.setThreshold: threshold supplied to "+this.toString()+" is not a subclass of Level")
				}
			},
			getThreshold:function(){
				return this.threshold
			},
			toString:function(){
				return "[Base Appender]"
			}
		};
		log4javascript.Appender=Appender;
		var AlertAppender=function(layout){
			if(layout){
				this.setLayout(layout)
			}
		};
		
		AlertAppender.prototype=new Appender();
		AlertAppender.prototype.layout=new SimpleLayout();
		AlertAppender.prototype.append=function(loggingEvent){
			var formattedMessage=this.getLayout().format(loggingEvent);
			if(this.getLayout().ignoresThrowable()){
				formattedMessage+=loggingEvent.getThrowableStrRep()
			}
			alert(formattedMessage)
		};
		AlertAppender.prototype.toString=function(){
			return "[AlertAppender]"
		};
		log4javascript.AlertAppender=AlertAppender;
		var AjaxAppender=function(url,layout,timed,waitForResponse,batchSize,timerInterval,requestSuccessCallback,failCallback){
			var appender=this;
			var isSupported=true;
			if(!url){
				handleError("AjaxAppender: URL must be specified in constructor");
				isSupported=false
			}
			timed=extractBooleanFromParam(timed,this.defaults.timed);
			waitForResponse=extractBooleanFromParam(waitForResponse,this.defaults.waitForResponse);
			batchSize=extractIntFromParam(batchSize,this.defaults.batchSize);
			timerInterval=extractIntFromParam(timerInterval,this.defaults.timerInterval);
			requestSuccessCallback=extractFunctionFromParam(requestSuccessCallback,this.defaults.requestSuccessCallback);
			failCallback=extractFunctionFromParam(failCallback,this.defaults.failCallback);
			var sessionId=null;
			var queuedLoggingEvents=[];
			var queuedRequests=[];
			var sending=false;
			var initialized=false;
			function checkCanConfigure(configOptionName){
				if(initialized){
					handleError("AjaxAppender: configuration option '"+configOptionName+"' may not be set after the appender has been initialized");
					return false
				}
				return true
			}
			this.getSessionId=function(){
				return sessionId
			};
			this.setSessionId=function(sessionIdParam){
				sessionId=extractStringFromParam(sessionIdParam,null);
				this.layout.setCustomField("sessionid",sessionId)
			};
			this.setLayout=function(layout){
				if(checkCanConfigure("layout")){
					this.layout=layout;
					if(sessionId!==null){
						this.setSessionId(sessionId)
					}
				}
			};
			if(layout){
				this.setLayout(layout)
			}
			this.isTimed=function(){
				return timed
			};
			this.setTimed=function(timedParam){
				if(checkCanConfigure("timed")){
					timed=bool(timedParam)
				}
			};
			this.getTimerInterval=function(){
				return timerInterval
			};
			this.setTimerInterval=function(timerIntervalParam){
				if(checkCanConfigure("timerInterval")){
					timerInterval=extractIntFromParam(timerIntervalParam,timerInterval)
				}
			};
			this.isWaitForResponse=function(){
				return waitForResponse
			};
			this.setWaitForResponse=function(waitForResponseParam){
				if(checkCanConfigure("waitForResponse")){
					waitForResponse=bool(waitForResponseParam)
				}
			};
			this.getBatchSize=function(){
				return batchSize
			};
			this.setBatchSize=function(batchSizeParam){
				if(checkCanConfigure("batchSize")){
					batchSize=extractIntFromParam(batchSizeParam,batchSize)
				}
			};
			this.setRequestSuccessCallback=function(requestSuccessCallbackParam){
				requestSuccessCallback=extractFunctionFromParam(requestSuccessCallbackParam,requestSuccessCallback)
			};
			this.setFailCallback=function(failCallbackParam){
				failCallback=extractFunctionFromParam(failCallbackParam,failCallback)
			};
			function sendAll(){
				if(isSupported&&enabled){
					sending=true;
					var currentRequestBatch;
					if(waitForResponse){
						if(queuedRequests.length>0){
							currentRequestBatch=queuedRequests.shift();
							sendRequest(preparePostData(currentRequestBatch),sendAll)
						}else{
							sending=false;
							if(timed){scheduleSending()
						}
					}
				}else{
					while((currentRequestBatch=queuedRequests.shift())){
						sendRequest(preparePostData(currentRequestBatch))
					}
					sending=false;
					if(timed){
						scheduleSending()
					}
				}
			}
		}
		this.sendAll=sendAll;
		function preparePostData(batchedLoggingEvents){
			var formattedMessages=[];
			var currentLoggingEvent;
			var postData="";
			while((currentLoggingEvent=batchedLoggingEvents.shift())){
				var currentFormattedMessage=appender.getLayout().format(currentLoggingEvent);
				if(appender.getLayout().ignoresThrowable()){
					currentFormattedMessage+=loggingEvent.getThrowableStrRep()
				}
				formattedMessages.push(currentFormattedMessage)
			}
			if(batchedLoggingEvents.length==1){
				postData=formattedMessages.join("")
			}else{
				postData=appender.getLayout().batchHeader+formattedMessages.join(appender.getLayout().batchSeparator)+appender.getLayout().batchFooter
			}
		return postData
	}
	function scheduleSending(){
		setTimeout(sendAll,timerInterval)
	}
	function getXmlHttp(){
		var xmlHttp=null;
		if(typeof XMLHttpRequest=="object"||typeof XMLHttpRequest=="function"){
			xmlHttp=new XMLHttpRequest()
		}else{
			try{
				xmlHttp=new ActiveXObject("Msxml2.XMLHTTP")
			}catch(e2){
				try{
					xmlHttp=new ActiveXObject("Microsoft.XMLHTTP")
				}catch(e3){
					var msg="AjaxAppender: could not create XMLHttpRequest object. AjaxAppender disabled";
					handleError(msg);
					isSupported=false;
					if(failCallback){
						failCallback(msg)
					}
				}
			}
		}
		return xmlHttp
	}
	
	function sendRequest(postData,successCallback){
		try{
			var xmlHttp=getXmlHttp();
			if(isSupported){
				if(xmlHttp.overrideMimeType){
					xmlHttp.overrideMimeType(appender.getLayout().getContentType())
				}
				xmlHttp.onreadystatechange=function(){
					if(xmlHttp.readyState==4){
						var success=(isUndefined(xmlHttp.status)||xmlHttp.status===0||(xmlHttp.status>=200&&xmlHttp.status<300));
						if(success){
							if(requestSuccessCallback){
								requestSuccessCallback(xmlHttp)
							}
							if(successCallback){
								successCallback(xmlHttp)
							}
						}else{
							var msg="AjaxAppender.append: XMLHttpRequest request to URL "+url+" returned status code "+xmlHttp.status;handleError(msg);
							if(failCallback){
								failCallback(msg)
							}
						}
						xmlHttp.onreadystatechange=emptyFunction;xmlHttp=null
					}
				};
				xmlHttp.open("POST",url,true);
				try{
					xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
				}catch(headerEx){
					var msg="AjaxAppender.append: your browser's XMLHttpRequest implementation"+" does not support setRequestHeader, therefore cannot post data. AjaxAppender disabled";
					handleError(msg);
					isSupported=false;
					if(failCallback){
						failCallback(msg)
					}
					return
				}
				xmlHttp.send(postData)
			}
		}catch(ex){
			var msg="AjaxAppender.append: error sending log message to "+url;
			handleError(msg,ex);
			if(failCallback){
				failCallback(msg+". Details: "+getExceptionStringRep(ex))
			}
		}
	}
	this.append=function(loggingEvent){
		if(isSupported){
			if(!initialized){
				init()
			}
			queuedLoggingEvents.push(loggingEvent);
			var actualBatchSize=this.getLayout().allowBatching()?batchSize:1;
			if(queuedLoggingEvents.length>=actualBatchSize){
				var currentLoggingEvent;
				var postData="";
				var batchedLoggingEvents=[];
				while((currentLoggingEvent=queuedLoggingEvents.shift())){
					batchedLoggingEvents.push(currentLoggingEvent)
				}
				queuedRequests.push(batchedLoggingEvents);
				if(!timed){
					if(!waitForResponse||(waitForResponse&&!sending)){
						sendAll()
					}
				}
			}
		}
	};

	function init(){
		initialized=true;
		if(timed){
			scheduleSending()
		}
	}
};
AjaxAppender.prototype=new Appender();
AjaxAppender.prototype.defaults={
	waitForResponse:false,timed:false,timerInterval:1000,batchSize:1,requestSuccessCallback:null,failCallback:null
};
AjaxAppender.prototype.layout=new HttpPostDataLayout();
AjaxAppender.prototype.toString=function(){
	return "[AjaxAppender]"
};

log4javascript.AjaxAppender=AjaxAppender;(function(){
	var getConsoleHtmlLines=function(){
		return [ '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
				 '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">',
				 '<head>',
				 '<title>log4javascript</title>',
				 '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
				 '<script type="text/javascript">',
				 '//<![CDATA[','var loggingEnabled=true;' +
				 'function toggleLoggingEnabled(){' +
				 	'setLoggingEnabled($("enableLogging").checked)' +
				 '}' +
				 'function setLoggingEnabled(enable){' +
				 	'loggingEnabled=enable' +
				 '}' +
				 'var newestAtTop=false;' +
				 'function setNewestAtTop(isNewestAtTop){' +
				 	'var oldNewestAtTop=newestAtTop;' +
				 	'newestAtTop=Boolean(isNewestAtTop);' +
				 	'if(oldNewestAtTop!=newestAtTop){' +
				 		'var lc=getLogContainer();' +
				 		'var numberOfEntries=lc.childNodes.length;' +
				 		'var node=null;' +
				 		'var logContainerChildNodes=[];' +
				 		'while((node=lc.firstChild)){' +
				 			'lc.removeChild(node);' +
				 			'logContainerChildNodes.push(node)' +
				 		'}' +
				 		'while((node=logContainerChildNodes.pop())){' +
				 			'lc.appendChild(node)' +
				 		'}' +
				 		'if(currentSearch){' +
				 			'var currentMatch=currentSearch.matches[currentMatchIndex];' +
				 			'var matchIndex=0;' +
				 			'var matches=[];' +
				 			'var actOnLogEntry=' +
				 			'	function(logEntry){' +
				 					'var logEntryMatches=logEntry.getSearchMatches();' +
				 					'for(var i=0;i<logEntryMatches.length;i++){' +
				 						'matches[matchIndex]=logEntryMatches[i];' +
				 						'if(currentMatch&&logEntryMatches[i].equals(currentMatch)){' +
				 							'currentMatchIndex=matchIndex' +
				 						'}' +
				 						'matchIndex++' +
				 					'}' +
				 				'};' +
				 			'var i;' +
				 			'if(newestAtTop){' +
				 				'for(i=logEntries.length-1;i>=0;i--){' +
				 					'actOnLogEntry(logEntries[i])' +
				 				'}' +
				 			'}else{' +
				 				'for(i=0;i<logEntries.length;i++){' +
				 					'actOnLogEntry(logEntries[i])' +
				 				'}' +
				 			'}' +
				 			'currentSearch.matches=matches;' +
				 			'if(currentMatch){' +
				 				'currentMatch.setCurrent()' +
				 			'}' +
				 		'}else if(scrollToLatest){' +
				 			'doScrollToLatest()' +
				 		'}' +
				 	'}' +
				 	'$("newestAtTop").checked=isNewestAtTop' +
				 '}' +
				 'function toggleNewestAtTop(){' +
				 	'var isNewestAtTop=$("newestAtTop").checked;' +
				 	'setNewestAtTop(isNewestAtTop)' +
				 '}' +
				 'var scrollToLatest=true;' +
				 'function setScrollToLatest(isScrollToLatest){' +
				 	'scrollToLatest=isScrollToLatest;' +
				 	'if(scrollToLatest){' +
				 		'doScrollToLatest()' +
				 	'}' +
				 	'$("scrollToLatest").checked=isScrollToLatest' +
				 '}' +
				 'function toggleScrollToLatest(){' +
				 	'var isScrollToLatest=$("scrollToLatest").checked;' +
				 	'setScrollToLatest(isScrollToLatest)' +
				 '}' +
				 'function doScrollToLatest(){' +
				 	'var l=getLogContainer();' +
				 	'if(typeof l.scrollTop!="undefined"){' +
				 		'if(newestAtTop){' +
				 			'l.scrollTop=0' +
				 		'}' +
				 		'else{' +
				 			'var latestLogEntry=l.lastChild;' +
				 			'if(latestLogEntry){' +
				 				'l.scrollTop=l.scrollHeight' +
				 			'}' +
				 		'}' +
				 	'}' +
				 '}' +
				 'var maxMessages=null;' +
				 'function setMaxMessages(max){' +
				 	'maxMessages=max;pruneLogEntries()' +
				 '}' +
				 'var logQueuedEventsTimer=null;' +
				 'var logEntries=[];' +
				 'var isCssWrapSupported;' +
				 'var renderDelay=100;' +
				 'function log(logLevel,formattedMessage){' +
				 	'if(loggingEnabled){' +
				 		'var logEntry=new LogEntry(logLevel,formattedMessage);' +
				 		'logEntries.push(logEntry);' +
				 		'if(loaded){' +
				 			'if(logQueuedEventsTimer!==null){' +
				 				'clearTimeout(logQueuedEventsTimer)' +
				 			'}' +
				 			'setTimeout(renderQueuedLogEntries,renderDelay)' +
				 		'}' +
				 	'}' +
				 '}' +
				 'function renderQueuedLogEntries(){' +
				 	'logQueuedEventsTimer=null;' +
				 	'var pruned=pruneLogEntries();' +
				 	'var initiallyHasMatches=currentSearch?currentSearch.hasMatches():false;' +
				 	'for(var i=0;i<logEntries.length;i++){' +
				 		'if(!logEntries[i].isRendered){' +
				 			'logEntries[i].render();' +
				 			'logEntries[i].appendToLog();' +
				 			'if(currentSearch){' +
				 				'currentSearch.applyTo(logEntries[i])' +
				 			'}' +
				 		'}' +
				 	'}' +
				 	'if(currentSearch){' +
				 		'if(pruned){' +
				 			'if(currentSearch.hasMatches()){' +
				 				'if(currentMatchIndex===null){' +
				 					'setCurrentMatchIndex(0)' +
				 				'}' +
				 				'displayMatches()' +
				 			'}' +
				 			'else{displayNoMatches()' +
				 		'}' +
				 	'}else if(!initiallyHasMatches&&currentSearch.hasMatches()){' +
				 		'setCurrentMatchIndex(0);' +
				 		'displayMatches()' +
				 	'}' +
				 '}' +
				 'if(scrollToLatest){' +
				 	'doScrollToLatest()' +
				 '}' +
				'}' +
				'function pruneLogEntries(){' +
					'if((maxMessages!==null)&&(logEntries.length>maxMessages)){' +
						'var numberToDelete=logEntries.length-maxMessages;' +
						'for(var i=0;i<numberToDelete;i++){' +
							'logEntries[i].remove()' +
						'}' +
						'logEntries=array_removeFromStart(logEntries,numberToDelete);' +
						'if(currentSearch){' +
							'currentSearch.removePrunedMatches()' +
						'}' +
						'return true' +
					'}' +
					'return false' +
				'}' +
				'function LogEntry(level,formattedMessage){' +
					'this.level=level;' +
					'this.formattedMessage=formattedMessage;' +
					'this.isRendered=false' +
				'}' +
				'LogEntry.prototype={' +
					'render:function(){' +
						'this.mainDiv=document.createElement("div");' +
						'this.mainDiv.className="logentry "+this.level.name;' +
						'if(isCssWrapSupported){' +
							'this.mainDiv.appendChild(document.createTextNode(this.formattedMessage))' +
						'}' +
						'else{' +
							'this.formattedMessage=this.formattedMessage.replace(/\\r\\n/g,"\\r");' +
							'this.unwrappedPre=this.mainDiv.appendChild(document.createElement("pre"));' +
							'this.unwrappedPre.appendChild(document.createTextNode(this.formattedMessage));' +
							'this.unwrappedPre.className="unwrapped";' +
							'this.wrappedSpan=this.mainDiv.appendChild(document.createElement("span"));' +
							'this.wrappedSpan.appendChild(document.createTextNode(this.formattedMessage));' +
							'this.wrappedSpan.className="wrapped"' +
						'}' +
						'this.content=this.formattedMessage;' +
						'this.isRendered=true' +
					'},' +
					'appendToLog:function(){' +
						'var lc=getLogContainer();' +
						'if(newestAtTop&&lc.hasChildNodes()){' +
							'lc.insertBefore(this.mainDiv,lc.firstChild)' +
						'}' +
						'else{' +
							'getLogContainer().appendChild(this.mainDiv)' +
						'}' +
					'},' +
					'setContent:function(content){' +
						'if(content!=this.content){' +
							'if(getLogContainer().currentStyle){' +
								'if(content===this.formattedMessage){' +
									'this.unwrappedPre.innerHTML="";' +
									'this.unwrappedPre.appendChild(document.createTextNode(this.formattedMessage));' +
									'this.wrappedSpan.innerHTML="";' +
									'this.wrappedSpan.appendChild(document.createTextNode(this.formattedMessage))' +
								'}' +
								'else{' +
									'content=content.replace(/\\r\\n/g,"\\r");' +
									'this.unwrappedPre.innerHTML=content;this.wrappedSpan.innerHTML=content' +
								'}' +
							'}' +
							'else {' +
								'if(content===this.formattedMessage){' +
									'this.mainDiv.innerHTML="";' +
									'this.mainDiv.appendChild(document.createTextNode(this.formattedMessage))' +
								'}' +
								'else{' +
									'this.mainDiv.innerHTML=content' +
								'}' +
							'}' +
							'this.content=content' +
						'}' +
					'},' +
					'getSearchMatches:function(){' +
						'var matches=[];' +
						'if(isCssWrapSupported){' +
							'var els=getElementsByClass(this.mainDiv,"searchterm","span");' +
							'for(var i=0;i<els.length;i++){' +
								'matches[i]=new Match(this.level,els[i])' +
							'}' +
						'}' +
						'else{' +
							'var unwrappedEls=getElementsByClass(this.unwrappedPre,"searchterm","span");' +
							'var wrappedEls=getElementsByClass(this.wrappedSpan,"searchterm","span");' +
							'for(i=0;i<unwrappedEls.length;i++){' +
								'matches[i]=new Match(this.level,null,unwrappedEls[i],wrappedEls[i])' +
							'}' +
						'}' +
						'return matches' +
					'},' +
					'remove:function(){' +
						'if(this.isRendered){' +
							'this.mainDiv.parentNode.removeChild(this.mainDiv);' +
							'this.mainDiv=null' +
						'}' +
					'}' +
				'};' +
				'function mainPageReloaded(){' +
					'var separator=document.createElement("div");' +
					'separator.className="separator";' +
					'separator.innerHTML="&nbsp;";' +
					'getLogContainer().appendChild(separator)' +
				'}' +
				'window.onload=function(){' +
					'isCssWrapSupported=(' +
						'typeof getLogContainer().currentStyle=="undefined");' +
						'setLogContainerHeight();' +
						'toggleLoggingEnabled();' +
						'toggleSearchEnabled();' +
						'toggleSearchFilter();' +
						'toggleSearchHighlight();' +
						'applyFilters();toggleWrap();' +
						'toggleNewestAtTop();' +
						'toggleScrollToLatest();' +
						'renderQueuedLogEntries();' +
						'loaded=true;' +
						'setTimeout(setLogContainerHeight,20);' +
						'if(window!=top){' +
							'$("closeButton").style.display="none"' +
						'}' +
					'};' +
					'var loaded=false;' +
					'var logLevels=["TRACE","DEBUG","INFO","WARN","ERROR","FATAL"];' +
					'function getCheckBox(logLevel){' +
						'return $("switch_"+logLevel)' +
					'}' +
					'function getLogContainer(){' +
						'return $("log")' +
					'}' +
					'function applyFilters(){' +
						'for(var i=0;i<logLevels.length;i++){' +
							'if(getCheckBox(logLevels[i]).checked){' +
								'addClass(getLogContainer(),logLevels[i])' +
							'}' +
							'else{' +
								'removeClass(getLogContainer(),logLevels[i])' +
							'}' +
						'}' +
						'updateSearchFromFilters()' +
					'}' +
					'function toggleAllLevels(){' +
						'var turnOn=$("switch_ALL").checked;' +
						'for(var i=0;i<logLevels.length;i++){' +
							'getCheckBox(logLevels[i]).checked=turnOn;' +
							'if(turnOn){' +
								'addClass(getLogContainer(),logLevels[i])' +
							'}' +
							'else{' +
								'removeClass(getLogContainer(),logLevels[i])' +
							'}' +
						'}' +
					'}' +
					'function checkAllLevels(){' +
						'for(var i=0;i<logLevels.length;i++){' +
							'if(!getCheckBox(logLevels[i]).checked){' +
								'getCheckBox("ALL").checked=false;' +
								'return' +
							'}' +
						'}' +
						'getCheckBox("ALL").checked=true' +
					'}' +
					'function clearLog(){' +
						'getLogContainer().innerHTML="";' +
						'logEntries=[];' +
						'doSearch()' +
					'}' +
					'function toggleWrap(){' +
						'var enable=$("wrap").checked;' +
						'if(enable){' +
							'addClass(getLogContainer(),"wrap")' +
						'}' +
						'else{' +
							'removeClass(getLogContainer(),"wrap")' +
						'}' +
						'refreshCurrentMatch()' +
					'}' +
					'var searchTimer=null;' +
					'function scheduleSearch(){' +
						'try{' +
							'clearTimeout(searchTimer)' +
						'}catch(ex){' +
						'}' +
						'searchTimer=setTimeout(doSearch,500)' +
					'}' +
					'function Search(searchTerm,isRegex,searchRegex,isCaseSensitive){' +
						'this.searchTerm=searchTerm;' +
						'this.isRegex=isRegex;' +
						'this.searchRegex=searchRegex;' +
						'this.isCaseSensitive=isCaseSensitive;' +
						'this.matches=[]' +
					'}' +
					'Search.prototype={' +
						'hasMatches:function(){' +
							'return this.matches.length>0' +
						'},' +
						'hasVisibleMatches:function(){' +
							'if(this.hasMatches()){' +
								'for(var i=0;i<=this.matches.length;i++){' +
									'if(this.matches[i].isVisible()){' +
										'return true' +
									'}' +
								'}' +
							'}' +
							'return false' +
						'},' +
						'match:function(logEntry){' +
							'var entryText=logEntry.formattedMessage;' +
							'var matchesSearch=false;' +
							'if(this.isRegex){' +
								'matchesSearch=this.searchRegex.test(entryText)' +
							'}' +
							'else if(this.isCaseSensitive){' +
								'matchesSearch=(entryText.indexOf(this.searchTerm)>-1)' +
							'}' +
							'else{' +
								'matchesSearch=(entryText.toLowerCase().indexOf(this.searchTerm.toLowerCase())>-1)' +
							'}' +
							'return matchesSearch' +
						'},' +
						'getNextVisibleMatchIndex:function(){' +
							'for(var i=currentMatchIndex+1;i<this.matches.length;i++){' +
								'if(this.matches[i].isVisible()){' +
									'return i' +
								'}' +
							'}' +
							'for(var i=0;i<=currentMatchIndex;i++){' +
								'if(this.matches[i].isVisible()){' +
									'return i' +
								'}' +
							'}' +
							'return-1' +
						'},' +
						'getPreviousVisibleMatchIndex:function(){' +
							'for(var i=currentMatchIndex-1;i>=0;i--){' +
								'if(this.matches[i].isVisible()){' +
									'return i' +
								'}' +
							'}' +
							'for(var i=this.matches.length-1;i>=currentMatchIndex;i--){' +
								'if(this.matches[i].isVisible()){' +
									'return i' +
								'}' +
							'}' +
							'return-1' +
						'},' +
						'applyTo:function(logEntry){' +
							'var doesMatch=this.match(logEntry);' +
							'if(doesMatch){' +
								'replaceClass(logEntry.mainDiv,"searchmatch","searchnonmatch");' +
								'var logEntryContent;' +
								'if(this.isRegex){' +
									'var flags=this.isCaseSensitive?"g":"gi";' +
									'var capturingRegex=new RegExp("("+this.searchRegex.source+")",flags);' +
									'logEntryContent=logEntry.formattedMessage.replace(capturingRegex,"<span class=\\\"searchterm\\\">$1</span>")' +
								'}' +
								'else{' +
									'logEntryContent="";' +
									'var searchTermReplacementStartTag="<span class=\\\"searchterm\\\">";' +
									'var searchTermReplacementEndTag="</span>";' +
									'var searchTermReplacementLength=searchTermReplacementStartTag.length+this.searchTerm.length+searchTermReplacementEndTag.length;' +
									'var searchTermLength=this.searchTerm.length;' +
									'var startIndex=0;var searchIndex;' +
									'var searchTermLowerCase=this.searchTerm.toLowerCase();' +
									'var logTextLowerCase=logEntry.formattedMessage.toLowerCase();' +
									'while((searchIndex=logTextLowerCase.indexOf(searchTermLowerCase,startIndex))>-1){' +
										'var searchTermReplacement=searchTermReplacementStartTag+logEntry.formattedMessage.substr(searchIndex,this.searchTerm.length)+searchTermReplacementEndTag;' +
										'logEntryContent+=logEntry.formattedMessage.substring(startIndex,searchIndex)+searchTermReplacement;' +
										'startIndex=searchIndex+searchTermLength' +
									'}' +
									'logEntryContent+=logEntry.formattedMessage.substr(startIndex)' +
								'}' +
								'logEntry.setContent(logEntryContent);' +
								'var logEntryMatches=logEntry.getSearchMatches();' +
								'this.matches=this.matches.concat(logEntryMatches)' +
							'}' +
							'else{' +
								'replaceClass(logEntry.mainDiv,"searchnonmatch","searchmatch");' +
								'logEntry.setContent(logEntry.formattedMessage)' +
							'}' +
							'return doesMatch' +
						'},' +
						'removePrunedMatches:function(){' +
							'var matchesToRemoveCount=0;' +
							'var currentMatchRemoved=false;' +
							'for(var i=0;i<this.matches.length;i++){' +
								'if(this.matches[i].isOrphan()){' +
									'this.matches[i].remove();' +
									'if(i===currentMatchIndex){' +
										'currentMatchRemoved=true' +
									'}' +
									'matchesToRemoveCount++}' +
								'}' +
								'if(matchesToRemoveCount>0){' +
									'array_removeFromStart(this.matches,matchesToRemoveCount);' +
									'var newMatchIndex=currentMatchRemoved?0:currentMatchIndex-matchesToRemoveCount;' +
									'if(this.hasMatches()){' +
										'setCurrentMatchIndex(newMatchIndex)' +
									'}' +
									'else{' +
										'currentMatchIndex=null' +
									'}' +
								'}' +
							'}' +
						'};' +
						'function getPageOffsetTop(el){' +
							'var currentEl=el;' +
							'var y=0;' +
							'while(currentEl){' +
								'y+=currentEl.offsetTop;' +
								'currentEl=currentEl.offsetParent' +
							'}' +
							'return y' +
						'}' +
						'function scrollIntoView(el){' +
							'getLogContainer().scrollLeft=el.offsetLeft;' +
							'getLogContainer().scrollTop=getPageOffsetTop(el)-getToolBarsHeight()' +
						'}' +
						'function Match(logEntryLevel,spanInMainDiv,spanInUnwrappedPre,spanInWrappedSpan){' +
							'this.logEntryLevel=logEntryLevel;' +
							'this.spanInMainDiv=spanInMainDiv;' +
							'if(!isCssWrapSupported){' +
								'this.spanInUnwrappedPre=spanInUnwrappedPre;' +
								'this.spanInWrappedSpan=spanInWrappedSpan' +
							'}' +
							'this.mainSpan=isCssWrapSupported?spanInMainDiv:spanInUnwrappedPre' +
						'}' +
						'Match.prototype={' +
							'equals:function(match){' +
								'return this.mainSpan===match.mainSpan' +
							'},' +
							'setCurrent:function(){' +
								'if(isCssWrapSupported){' +
									'addClass(this.spanInMainDiv,"currentmatch");' +
									'scrollIntoView(this.spanInMainDiv)' +
								'}' +
								'else{' +
									'addClass(this.spanInUnwrappedPre,"currentmatch");' +
									'addClass(this.spanInWrappedSpan,"currentmatch");' +
									'var elementToScroll=$("wrap").checked?this.spanInWrappedSpan:this.spanInUnwrappedPre;scrollIntoView(elementToScroll)' +
								'}' +
							'},' +
							'setNotCurrent:function(){' +
								'if(isCssWrapSupported){' +
									'removeClass(this.spanInMainDiv,"currentmatch")' +
								'}' +
								'else{' +
									'removeClass(this.spanInUnwrappedPre,"currentmatch");' +
									'removeClass(this.spanInWrappedSpan,"currentmatch")' +
								'}' +
							'},' +
							'isOrphan:function(){' +
								'return isOrphan(this.mainSpan)' +
							'},' +
							'isVisible:function(){' +
								'return getCheckBox(this.logEntryLevel).checked' +
							'},' +
							'remove:function(){' +
								'if(isCssWrapSupported){' +
									'this.spanInMainDiv=null' +
								'}' +
								'else{' +
									'this.spanInUnwrappedPre=null;' +
									'this.spanInWrappedSpan=null}' +
								'}' +
							'};' +
							'var currentSearch=null;' +
							'var currentMatchIndex=null;' +
							'function doSearch(){' +
								'var searchBox=$("searchBox");' +
								'var searchTerm=searchBox.value;' +
								'var isRegex=$("searchRegex").checked;' +
								'var isCaseSensitive=$("searchCaseSensitive").checked;' +
								'var i;' +
								'if(searchTerm===""){' +
									'$("searchReset").disabled=true;' +
									'$("searchNav").style.display="none";' +
									'removeClass(document.body,"searching");' +
									'removeClass(searchBox,"hasmatches");' +
									'removeClass(searchBox,"nomatches");' +
									'for(i=0;i<logEntries.length;i++){' +
										'removeClass(logEntries[i].mainDiv,"searchmatch");' +
										'removeClass(logEntries[i].mainDiv,"searchnonmatch");' +
										'logEntries[i].setContent(logEntries[i].formattedMessage)' +
									'}' +
									'currentSearch=null;' +
									'setLogContainerHeight()' +
								'}' +
								'else{' +
									'$("searchReset").disabled=false;' +
									'$("searchNav").style.display="block";' +
									'var searchRegex;' +
									'var regexValid;' +
									'if(isRegex){' +
										'try{' +
											'searchRegex=isCaseSensitive?new RegExp(searchTerm,"g"):new RegExp(searchTerm,"gi");' +
											'regexValid=true;' +
											'replaceClass(searchBox,"validregex","invalidregex");' +
											'searchBox.title="Valid regex"' +
										'}' +
										'catch(ex)' +
										'{' +
											'regexValid=false;' +
											'replaceClass(searchBox,"invalidregex","validregex");' +
											'searchBox.title="Invalid regex: "+(ex.message?ex.message:(ex.description?ex.description:"unknown error"));' +
											'return' +
										'}' +
									'}else{' +
										'searchBox.title="";' +
										'removeClass(searchBox,"validregex");' +
										'removeClass(searchBox,"invalidregex")' +
									'}' +
									'addClass(document.body,"searching");' +
									'currentSearch=new Search(searchTerm,isRegex,searchRegex,isCaseSensitive);' +
									'for(i=0;i<logEntries.length;i++){' +
										'currentSearch.applyTo(logEntries[i])}setLogContainerHeight();' +
										'if(currentSearch.hasMatches()){' +
											'setCurrentMatchIndex(0);' +
											'displayMatches()' +
										'}' +
										'else{' +
											'displayNoMatches()' +
										'}' +
									'}' +
								'}' +
								'function updateSearchFromFilters(){' +
									'if(currentSearch&&currentSearch.hasMatches()){' +
										'var currentMatch=currentSearch.matches[currentMatchIndex];' +
										'if(currentMatch.isVisible()){' +
											'displayMatches();' +
											'setCurrentMatchIndex(currentMatchIndex)' +
										'}else{' +
											'currentMatch.setNotCurrent();' +
											'var nextVisibleMatchIndex=currentSearch.getNextVisibleMatchIndex();' +
											'if(nextVisibleMatchIndex>-1){' +
												'setCurrentMatchIndex(nextVisibleMatchIndex);' +
												'displayMatches()' +
											'}' +
											'else{' +
												'displayNoMatches()' +
											'}' +
										'}' +
									'}' +
								'}' +
								'function refreshCurrentMatch(){' +
									'if(currentSearch&&currentSearch.hasMatches()){' +
										'setCurrentMatchIndex(currentMatchIndex)' +
									'}' +
								'}' +
								'function displayMatches(){' +
									'replaceClass($("searchBox"),"hasmatches","nomatches");' +
									'$("searchBox").title=""+currentSearch.matches.length+" matches found";' +
									'$("searchNav").style.display="block";' +
									'setLogContainerHeight()' +
								'}' +
								'function displayNoMatches(){' +
									'replaceClass($("searchBox"),"nomatches","hasmatches");' +
									'$("searchBox").title="No matches found";' +
									'$("searchNav").style.display="none";' +
									'setLogContainerHeight()' +
								'}' +
								'function toggleSearchEnabled(enable){' +
									'enable=(typeof enable=="undefined")?!$("searchDisable").checked:enable;' +
									'$("searchBox").disabled=!enable;' +
									'$("searchReset").disabled=!enable;' +
									'$("searchRegex").disabled=!enable;' +
									'$("searchNext").disabled=!enable;' +
									'$("searchPrevious").disabled=!enable;' +
									'$("searchCaseSensitive").disabled=!enable;' +
									'$("searchNav").style.display=(enable&&($("searchBox").value!==""))?"block":"none";' +
									'if(enable){' +
										'removeClass($("search"),"greyedout");' +
										'addClass(document.body,"searching");' +
										'if($("searchHighlight").checked){' +
											'addClass(getLogContainer(),"searchhighlight")' +
										'}else{' +
											'removeClass(getLogContainer(),"searchhighlight")' +
										'}' +
										'if($("searchFilter").checked){' +
											'addClass(getLogContainer(),"searchfilter")' +
										'}else{' +
											'removeClass(getLogContainer(),"searchfilter")' +
										'}' +
										'$("searchDisable").checked=!enable' +
									'}else{' +
										'addClass($("search"),"greyedout");' +
										'removeClass(document.body,"searching");' +
										'removeClass(getLogContainer(),"searchhighlight");' +
										'removeClass(getLogContainer(),"searchfilter")' +
									'}' +
									'setLogContainerHeight()' +
								'}' +
								'function toggleSearchFilter(){' +
									'var enable=$("searchFilter").checked;' +
									'if(enable){' +
										'addClass(getLogContainer(),"searchfilter")' +
									'}else{' +
										'removeClass(getLogContainer(),"searchfilter")' +
									'}' +
									'refreshCurrentMatch()' +
								'}' +
								'function toggleSearchHighlight(){' +
									'var enable=$("searchHighlight").checked;' +
									'if(enable){' +
										'addClass(getLogContainer(),"searchhighlight")' +
									'}else{' +
										'removeClass(getLogContainer(),"searchhighlight")' +
									'}' +
								'}' +
								'function clearSearch(){' +
									'$("searchBox").value="";' +
									'doSearch()' +
								'}' +
								'function searchNext(){' +
									'try{' +
										'if(currentSearch!==null&&currentMatchIndex!==null){' +
											'currentSearch.matches[currentMatchIndex].setNotCurrent();' +
											'var nextMatchIndex=currentSearch.getNextVisibleMatchIndex();' +
											'if(nextMatchIndex>currentMatchIndex||confirm("Reached the end of the page. Start from the top?")){' +
												'setCurrentMatchIndex(nextMatchIndex)' +
											'}' +
										'}' +
									'}catch(err){' +
										'alert("currentMatchIndex is "+currentMatchIndex)' +
									'}' +
								'}' +
								'function searchPrevious(){' +
									'if(currentSearch!==null&&currentMatchIndex!==null){' +
										'currentSearch.matches[currentMatchIndex].setNotCurrent();' +
										'var previousMatchIndex=currentSearch.getPreviousVisibleMatchIndex();' +
										'if(previousMatchIndex<currentMatchIndex||confirm("Reached the start of the page. Continue from the bottom?")){' +
										'	setCurrentMatchIndex(previousMatchIndex)' +
										'}' +
									'}' +
								'}' +
								'function setCurrentMatchIndex(index){' +
									'currentMatchIndex=index;currentSearch.matches[currentMatchIndex].setCurrent()' +
								'}' +
								'function addClass(el,cssClass){' +
									'if(!hasClass(el,cssClass)){' +
										'if(el.className){' +
											'el.className+=" "+cssClass}else{el.className=cssClass' +
										'}' +
									'}' +
								'}' +
								'function hasClass(el,cssClass){' +
									'if(el.className){' +
										'var classNames=el.className.split(" ");' +
										'return array_contains(classNames,cssClass)' +
									'}' +
									'return false' +
								'}' +
								'function removeClass(el,cssClass){' +
									'if(hasClass(el,cssClass)){' +
										'var existingClasses=el.className.split(" ");' +
										'var newClasses=[];' +
										'for(var i=0;i<existingClasses.length;i++){' +
											'if(existingClasses[i]!=cssClass){' +
												'newClasses[newClasses.length]=existingClasses[i]' +
											'}' +
										'}' +
										'el.className=newClasses.join(" ")' +
									'}' +
								'}' +
								'function replaceClass(el,newCssClass,oldCssClass){' +
									'removeClass(el,oldCssClass);' +
									'addClass(el,newCssClass)' +
								'}' +
								'function getElementsByClass(el,cssClass,tagName){' +
									'var elements=el.getElementsByTagName(tagName);' +
									'var matches=[];' +
									'for(var i=0;i<elements.length;i++){' +
										'if(hasClass(elements[i],cssClass)){' +
											'matches.push(elements[i])' +
										'}' +
									'}' +
									'return matches' +
								'}' +
								'function $(id){' +
									'return document.getElementById(id)' +
								'}' +
								'function isOrphan(node){' +
									'var currentNode=node;' +
									'while(currentNode){' +
									'if(currentNode==document.body){' +
									'	return false' +
									'}' +
									'currentNode=currentNode.parentNode' +
								'}' +
								'return true' +
							'}' +
							'function getWindowWidth(){' +
								'if(window.innerWidth){' +
									'return window.innerWidth' +
								'}else ' +
									'if(document.documentElement&&document.documentElement.clientWidth){' +
										'return document.documentElement.clientWidth' +
									'}else ' +
										'if(document.body){' +
											'return document.body.clientWidth' +
										'}' +
										'return 0' +
								'}' +
								'function getWindowHeight(){' +
									'if(window.innerHeight){' +
										'return window.innerHeight' +
									'}' +
									'else if(document.documentElement&&document.documentElement.clientHeight){' +
										'return document.documentElement.clientHeight' +
									'}' +
									'else if(document.body){' +
										'return document.body.clientHeight' +
									'}' +
									'return 0' +
								'}' +
								'function getToolBarsHeight(){' +
									'return $("switches").offsetHeight' +
								'}' +
								'function setLogContainerHeight(){' +
									'var windowHeight=getWindowHeight();' +
									'$("body").style.height=getWindowHeight()+"px";' +
									'getLogContainer().style.height=""+(windowHeight-getToolBarsHeight())+"px"' +
								'}' +
								'window.onresize=setLogContainerHeight;' +
								'if(!Array.prototype.push){' +
									'Array.prototype.push=function(){' +
										'for(var i=0;i<arguments.length;i++){' +
											'this[this.length]=arguments[i]' +
										'}' +
										'return this.length' +
									'}' +
								'}' +
								'if(!Array.prototype.pop){' +
									'Array.prototype.pop=function(){' +
										'if(this.length>0){var val=this[this.length-1];' +
										'this.length=this.length-1;' +
										'return val' +
									'}' +
								'}' +
							'}' +
							'if(!Array.prototype.shift){' +
								'Array.prototype.shift=function(){' +
									'if(this.length>0){' +
										'var firstItem=this[0];' +
										'for(var i=0;i<this.length-1;i++){' +
											'this[i]=this[i+1]' +
										'}' +
										'this.length=this.length-1;' +
										'return firstItem' +
									'}' +
								'}' +
							'}' +
							'function array_removeFromStart(array,numberToRemove){' +
								'if(Array.prototype.splice){' +
									'array.splice(0,numberToRemove)' +
								'}' +
								'else{' +
									'for(var i=numberToRemove;i<array.length;i++){' +
										'array[i-numberToRemove]=array[i]' +
									'}array.length=array.length-numberToRemove' +
								'}' +
								'return array' +
							'}' +
							'function array_contains(arr,val){' +
								'for(var i=0;i<arr.length;i++){' +
									'if(arr[i]==val){' +
										'return true' +
									'}' +
								'}' +
								'return false' +
							'}',
							'//]]>',
							'</script>',
							'<style type="text/css">',
							'body{background-color:white;color:black;padding:0px;margin:0px;font-family:tahoma,verdana,arial,helvetica,sans-serif;overflow:hidden}div#switchesContainer input{margin-bottom:0px}div#switches div.toolbar{border-top:solid #ffffff 1px;border-bottom:solid #aca899 1px;background-color:#f1efe7;padding:3px 5px;font-size:68.75%}div#switches div.toolbar,div#search input{font-family:tahoma,verdana,arial,helvetica,sans-serif}div#switches input.button{padding:0px 5px;font-size:100%}div#switches input#clearButton{margin-left:20px}div#levels label{font-weight:bold}div#levels label,div#options label{margin-right:5px}div#levels label#wrapLabel{font-weight:normal}div#search{padding:5px 0px}div#search label{margin-right:10px}div#search label.searchboxlabel{margin-right:0px}div#search input{font-size:100%}div#search input.validregex{color:green}div#search input.invalidregex{color:red}div#search input.nomatches{color:white;background-color:#ff6666}div#search input.nomatches{color:white;background-color:#ff6666}*.greyedout{color:gray}*.greyedout *.alwaysenabled{color:black}div#log{font-family:Courier New,Courier;font-size:75%;width:100%;overflow:auto}*.logentry{overflow:visible;display:none;white-space:pre}*.logentry pre.unwrapped{display:inline}*.logentry span.wrapped{display:none}body.searching *.logentry span.currentmatch{color:white !important;background-color:green !important}body.searching div.searchhighlight *.logentry span.searchterm{color:black;background-color:yellow}div.wrap *.logentry{white-space:normal !important;border-width:0px 0px 1px 0px;border-color:#dddddd;border-style:dotted}div.wrap *.logentry pre.unwrapped{display:none}div.wrap *.logentry span.wrapped{display:inline}div.searchfilter *.searchnonmatch{display:none !important}div#log *.TRACE,label#label_TRACE{color:#666666}div#log *.DEBUG,label#label_DEBUG{color:green}div#log *.INFO,label#label_INFO{color:#000099}div#log *.WARN,label#label_WARN{color:#999900}div#log *.ERROR,label#label_ERROR{color:red}div#log *.FATAL,label#label_FATAL{color:#660066}div.TRACE#log *.TRACE,div.DEBUG#log *.DEBUG,div.INFO#log *.INFO,div.WARN#log *.WARN,div.ERROR#log *.ERROR,div.FATAL#log *.FATAL{display:block}div#log div.separator{background-color:#cccccc;margin:5px 0px;line-height:1px}',
							'</style>',
							'</head>',
							'<body id="body">',
							'<div id="switchesContainer">',
							'<div id="switches">',
							'<div id="levels" class="toolbar">',
							'Filters:',
							'<input type="checkbox" id="switch_TRACE" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide trace messages" /><label for="switch_TRACE" id="label_TRACE">trace</label>',
							'<input type="checkbox" id="switch_DEBUG" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide debug messages" /><label for="switch_DEBUG" id="label_DEBUG">debug</label>',
							'<input type="checkbox" id="switch_INFO" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide info messages" /><label for="switch_INFO" id="label_INFO">info</label>',
							'<input type="checkbox" id="switch_WARN" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide warn messages" /><label for="switch_WARN" id="label_WARN">warn</label>',
							'<input type="checkbox" id="switch_ERROR" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide error messages" /><label for="switch_ERROR" id="label_ERROR">error</label>',
							'<input type="checkbox" id="switch_FATAL" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide fatal messages" /><label for="switch_FATAL" id="label_FATAL">fatal</label>',
							'<input type="checkbox" id="switch_ALL" onclick="toggleAllLevels(); applyFilters()" checked="checked" title="Show/hide all messages" /><label for="switch_ALL" id="label_ALL">all</label>','</div>',
							'<div id="search" class="toolbar">','<label for="searchBox" class="searchboxlabel">Search:</label> <input type="text" id="searchBox" onclick="toggleSearchEnabled(true)" onkeyup="scheduleSearch()" size="20" />',
							'<input type="button" id="searchReset" disabled="disabled" value="Reset" onclick="clearSearch()" class="button" title="Reset the search" />',
							'<input type="checkbox" id="searchRegex" onclick="doSearch()" title="If checked, search is treated as a regular expression" /><label for="searchRegex">Regex</label>','<input type="checkbox" id="searchCaseSensitive" onclick="doSearch()" title="If checked, search is case sensitive" /><label for="searchCaseSensitive">Match case</label>',
							'<input type="checkbox" id="searchDisable" onclick="toggleSearchEnabled()" title="Enable/disable search" /><label for="searchDisable" class="alwaysenabled">Disable</label>',
							'<div id="searchNav">',
							'<input type="button" id="searchNext" disabled="disabled" value="Next" onclick="searchNext()" class="button" title="Go to the next matching log entry" />',
							'<input type="button" id="searchPrevious" disabled="disabled" value="Previous" onclick="searchPrevious()" class="button" title="Go to the previous matching log entry" />',
							'<input type="checkbox" id="searchFilter" onclick="toggleSearchFilter()" title="If checked, non-matching log entries are filtered out" /><label for="searchFilter">Filter</label>',
							'<input type="checkbox" id="searchHighlight" onclick="toggleSearchHighlight()" title="Highlight matched search terms" /><label for="searchHighlight" class="alwaysenabled">Highlight all</label>',
							'</div>',
							'</div>',
							'<div id="options" class="toolbar">',
							'Options:',
							'<input type="checkbox" id="enableLogging" onclick="toggleLoggingEnabled()" checked="checked" title="Enable/disable logging" /><label for="enableLogging" id="wrapLabel">Log</label>',
							'<input type="checkbox" id="wrap" onclick="toggleWrap()" title="Enable / disable word wrap" /><label for="wrap" id="wrapLabel">Wrap</label>','<input type="checkbox" id="newestAtTop" onclick="toggleNewestAtTop()" title="If checked, causes newest messages to appear at the top" /><label for="newestAtTop" id="newestAtTopLabel">Newest at the top</label>','<input type="checkbox" id="scrollToLatest" onclick="toggleScrollToLatest()" checked="checked" title="If checked, window automatically scrolls to a new message when it is added" /><label for="scrollToLatest" id="scrollToLatestLabel">Scroll to latest</label>',
							'<input type="button" id="clearButton" value="Clear" onclick="clearLog()" class="button" title="Clear all log messages"  />',
							'<input type="button" id="closeButton" value="Close" onclick="window.close()" class="button" title="Close the window" />',
							'</div>',
							'</div>',
							'</div>',
							'<div id="log" class="TRACE DEBUG INFO WARN ERROR FATAL"></div>',
							'</body>',
							'</html>' ]
						};
						function ConsoleAppender(){}
						var consoleAppenderIdCounter=1;
						ConsoleAppender.prototype=new Appender();
						ConsoleAppender.prototype.create=function(inPage,containerElement,layout,lazyInit,focusConsoleWindow,useOldPopUp,complainAboutPopUpBlocking,newestMessageAtTop,scrollToLatestMessage,initiallyMinimized,width,height,reopenWhenClosed,maxMessages){
							var appender=this;
							if(layout){
								this.setLayout(layout)
							}else{
								this.setLayout(this.defaults.layout)
							}
							var initialized=false;
							var consoleWindowLoaded=false;
							var queuedLoggingEvents=[];
							var isSupported=true;
							var consoleAppenderId=consoleAppenderIdCounter++;lazyInit=extractBooleanFromParam(lazyInit,true);newestMessageAtTop=extractBooleanFromParam(newestMessageAtTop,this.defaults.newestMessageAtTop);
							scrollToLatestMessage=extractBooleanFromParam(scrollToLatestMessage,this.defaults.scrollToLatestMessage);
							width=width?width:this.defaults.width;
							height=height?height:this.defaults.height;
							maxMessages=maxMessages?maxMessages:this.defaults.maxMessages;
							var init,safeToAppend,getConsoleWindow;
							var appenderName=inPage?"InPageAppender":"PopUpAppender";
							var checkCanConfigure=function(configOptionName){
								if(initialized){handleError(appenderName+": configuration option '"+configOptionName+"' may not be set after the appender has been initialized");
									return false
								}
								return true
							};
							this.isNewestMessageAtTop=function(){
								return newestMessageAtTop};
								this.setNewestMessageAtTop=function(newestMessageAtTopParam){
									newestMessageAtTop=bool(newestMessageAtTopParam);
									if(consoleWindowLoaded&&isSupported){
										getConsoleWindow().setNewestAtTop(newestMessageAtTop)}};
										this.isScrollToLatestMessage=function(){
											return scrollToLatestMessage
										};
										this.setScrollToLatestMessage=function(scrollToLatestMessageParam){
											scrollToLatestMessage=bool(scrollToLatestMessageParam);
											if(consoleWindowLoaded&&isSupported){
												getConsoleWindow().setScrollToLatest(scrollToLatestMessage)
											}
										};
										this.getWidth=function(){
											return width
										};
										this.setWidth=function(widthParam){
											if(checkCanConfigure("width")){
												width=extractStringFromParam(widthParam,width)
											}
										};
										this.getHeight=function(){
											return height
										};
										this.setHeight=function(heightParam){
											if(checkCanConfigure("height")){
												height=extractStringFromParam(heightParam,height)
											}
										};
										this.getMaxMessages=function(){
											return maxMessages
										};
										this.setMaxMessages=function(maxMessagesParam){
											maxMessages=extractIntFromParam(maxMessagesParam,maxMessages);
											if(consoleWindowLoaded&&isSupported){
												getConsoleWindow().setMaxMessages(maxMessages)
											}
										};
										this.append=function(loggingEvent){
											if(isSupported){queuedLoggingEvents.push(loggingEvent);
											var isSafeToAppend=safeToAppend();
											if(!initialized||(consoleClosed&&reopenWhenClosed)){
												init()
											}
											if(safeToAppend()){
												appendQueuedLoggingEvents()
											}
										}
									};
									var appendQueuedLoggingEvents=function(loggingEvent){
										while(queuedLoggingEvents.length>0){
											var currentLoggingEvent=queuedLoggingEvents.shift();
											var formattedMessage=appender.getLayout().format(currentLoggingEvent);
											if(appender.getLayout().ignoresThrowable()){
												formattedMessage+=currentLoggingEvent.getThrowableStrRep()
											}getConsoleWindow().log(currentLoggingEvent.level,formattedMessage)
										}
										if(focusConsoleWindow){
											getConsoleWindow().focus()
										}
									};
									var writeHtml=function(doc){
										var lines=getConsoleHtmlLines();
										doc.open();
										for(var i=0;i<lines.length;i++){
											doc.writeln(lines[i])}doc.close()
										};
										var consoleClosed=false;
										var pollConsoleWindow=function(windowTest,successCallback,errorMessage){
											function pollConsoleWindowLoaded(){
												try{
													if(consoleClosed){
														clearInterval(poll)
													}
													if(windowTest(getConsoleWindow())){
														clearInterval(poll);
														successCallback()
													}
												}
												catch(ex){
													clearInterval(poll);
													isSupported=false;
													handleError(errorMessage,ex)
												}
											}
											var poll=setInterval(pollConsoleWindowLoaded,100)};
											if(inPage){
												if(!containerElement||!containerElement.appendChild){
													isSupported=false;
													handleError("InPageAppender.init: a container DOM element must be supplied for the console window");
													return
												}
												initiallyMinimized=extractBooleanFromParam(initiallyMinimized,appender.defaults.initiallyMinimized);
												this.isInitiallyMinimized=function(){
													return initiallyMinimized
												};
												this.setInitiallyMinimized=function(initiallyMinimizedParam){
													if(checkCanConfigure("initiallyMinimized")){
														initiallyMinimized=bool(initiallyMinimizedParam)
													}
												};
												var minimized=false;
												var iframeContainerDiv;
												var iframeId=uniqueId+"_InPageAppender_"+consoleAppenderId;
												this.hide=function(){
													iframeContainerDiv.style.display="none";
													minimized=true
												};
												this.show=function(){
													iframeContainerDiv.style.display="block";
													minimized=false
												};
												this.isVisible=function(){
													return!minimized
												};
												this.close=function(){
													if(!consoleClosed){
														iframeContainerDiv.parentNode.removeChild(iframeContainerDiv);
														consoleClosed=true
													}
												};
												init=function(){
													var initErrorMessage="InPageAppender.init: unable to create console iframe";
													function finalInit(){
														try{
															getConsoleWindow().setNewestAtTop(newestMessageAtTop);
															getConsoleWindow().setScrollToLatest(scrollToLatestMessage);
															getConsoleWindow().setMaxMessages(maxMessages);
															consoleWindowLoaded=true;
															appendQueuedLoggingEvents();
															if(initiallyMinimized){
																appender.hide()
															}
														}catch(ex){
															isSupported=false;
															handleError(initErrorMessage,ex)
														}
													}
													function writeToDocument(){
														try{
															var windowTest=function(win){
																return bool(win.loaded)
															};
															writeHtml(getConsoleWindow().document);
															if(windowTest(getConsoleWindow())){
																finalInit()
															}else{
																pollConsoleWindow(windowTest,finalInit,initErrorMessage)
															}
														}catch(ex){
															isSupported=false;
															handleError(initErrorMessage,ex)
														}
													}
													minimized=initiallyMinimized;
													iframeContainerDiv=containerElement.appendChild(document.createElement("div"));
													iframeContainerDiv.style.width=width;
													iframeContainerDiv.style.height=height;
													iframeContainerDiv.style.border="solid gray 1px";
													var iframeHtml="<iframe id='"+iframeId+"' name='"+iframeId+"' width='100%' height='100%' frameborder='0'"+"scrolling='no'></iframe>";
													iframeContainerDiv.innerHTML=iframeHtml;
													consoleClosed=false;
													var iframeDocumentExistsTest=function(win){
														return bool(win)&&bool(win.document)
													};
													if(iframeDocumentExistsTest(getConsoleWindow())){
														writeToDocument()
													}else{
														pollConsoleWindow(iframeDocumentExistsTest,writeToDocument,initErrorMessage)
													}
													initialized=true
												};
												getConsoleWindow=function(){
													var iframe=window.frames[iframeId];
													if(iframe){
														return iframe
													}
												};
												safeToAppend=function(){
													if(isSupported&&!consoleClosed){
														if(!consoleWindowLoaded&&getConsoleWindow()&&getConsoleWindow().loaded){
															consoleWindowLoaded=true
														}
														return consoleWindowLoaded
													}
													return false
												}
											}else{
												useOldPopUp=extractBooleanFromParam(useOldPopUp,appender.defaults.useOldPopUp);
												complainAboutPopUpBlocking=extractBooleanFromParam(complainAboutPopUpBlocking,appender.defaults.complainAboutPopUpBlocking);
												reopenWhenClosed=extractBooleanFromParam(reopenWhenClosed,this.defaults.reopenWhenClosed);
												this.isUseOldPopUp=function(){
													return useOldPopUp
												};
												this.setUseOldPopUp=function(useOldPopUpParam){
													if(checkCanConfigure("useOldPopUp")){
														useOldPopUp=bool(useOldPopUpParam)
													}
												};
												this.isComplainAboutPopUpBlocking=function(){
													return complainAboutPopUpBlocking
												};
												this.setComplainAboutPopUpBlocking=function(complainAboutPopUpBlockingParam){
													if(checkCanConfigure("complainAboutPopUpBlocking")){
														complainAboutPopUpBlocking=bool(complainAboutPopUpBlockingParam)
													}
												};
												this.isFocusPopUp=function(){
													return focusConsoleWindow
												};
												this.setFocusPopUp=function(focusPopUpParam){
													focusConsoleWindow=bool(focusPopUpParam)
												};
												this.isReopenWhenClosed=function(){
													return reopenWhenClosed
												};
												this.setReopenWhenClosed=function(reopenWhenClosedParam){
													reopenWhenClosed=bool(reopenWhenClosedParam)
												};
												this.close=function(){
													try{
														popUp.close()
													}catch(e)
													{
													}
													consoleClosed=true};
													var popUp;
													init=function(){
														var windowProperties="width="+width+",height="+height+",status,resizable";
														var windowName="PopUp_"+location.host.replace(/[^a-z0-9]/gi,"_")+"_"+consoleAppenderId;
														if(!useOldPopUp){
															windowName=windowName+"_"+uniqueId
														}
														function finalInit(){
															consoleWindowLoaded=true;
															getConsoleWindow().setNewestAtTop(newestMessageAtTop);
															getConsoleWindow().setScrollToLatest(scrollToLatestMessage);
															getConsoleWindow().setMaxMessages(maxMessages);
															appendQueuedLoggingEvents()
														}
														try{
															popUp=window.open("",windowName,windowProperties);
															consoleClosed=false;
															if(popUp){
																if(useOldPopUp&&popUp.loaded){
																	popUp.mainPageReloaded();
																	finalInit()
																}else{
																	writeHtml(popUp.document);
																	var popUpLoadedTest=function(win){
																		return bool(win)&&win.loaded
																	};
																	if(popUp.loaded){
																		finalInit()
																	}else{
																		pollConsoleWindow(popUpLoadedTest,finalInit,"PopUpAppender.init: unable to create console window")
																	}
																}
															}else{
																isSupported=false;
																logLog.warn("PopUpAppender.init: pop-ups blocked, please unblock to use PopUpAppender");
																if(complainAboutPopUpBlocking){
																	handleError("log4javascript: pop-up windows appear to be blocked. Please unblock them to use pop-up logging.")
																}
															}
														}
														catch(ex){
															handleError("PopUpAppender.init: error creating pop-up",ex)
														}
														initialized=true};
														getConsoleWindow=function(){
															return popUp};
															safeToAppend=function(){
																if(isSupported&&!isUndefined(popUp)&&!consoleClosed){
																	if(popUp.closed||(consoleWindowLoaded&&isUndefined(popUp.closed))){
																		consoleClosed=true;
																		logLog.debug("PopUpAppender: pop-up closed");
																		return false
																	}
																	if(!consoleWindowLoaded&&popUp.loaded){
																		consoleWindowLoaded=true}
																	}
																	return isSupported&&consoleWindowLoaded&&!consoleClosed
																}
															}
															if(enabled&&!lazyInit){
																init()
															}
															this.getConsoleWindow=getConsoleWindow};
															var PopUpAppender=function(lazyInit,layout,focusPopUp,useOldPopUp,complainAboutPopUpBlocking,newestMessageAtTop,scrollToLatestMessage,reopenWhenClosed,width,height,maxMessages){
																var focusConsoleWindow=extractBooleanFromParam(focusPopUp,this.defaults.focusPopUp);
																this.create(false,null,layout,lazyInit,focusConsoleWindow,useOldPopUp,complainAboutPopUpBlocking,newestMessageAtTop,scrollToLatestMessage,null,width,height,reopenWhenClosed,maxMessages)
															};
															PopUpAppender.prototype=new ConsoleAppender();
															PopUpAppender.prototype.defaults={
																layout:new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"),focusPopUp:false,lazyInit:true,useOldPopUp:true,complainAboutPopUpBlocking:true,newestMessageAtTop:false,scrollToLatestMessage:true,width:"600",height:"400",reopenWhenClosed:false,maxMessages:null};
																PopUpAppender.prototype.toString=function(){
																	return "[PopUpAppender]"};
																	log4javascript.PopUpAppender=PopUpAppender;
																	var InPageAppender=function(containerElement,lazyInit,layout,initiallyMinimized,newestMessageAtTop,scrollToLatestMessage,width,height,maxMessages){
																		this.create(true,containerElement,layout,lazyInit,false,null,null,newestMessageAtTop,scrollToLatestMessage,initiallyMinimized,width,height,null,maxMessages)
																	};
																	InPageAppender.prototype=new ConsoleAppender();
																	InPageAppender.prototype.defaults={
																		layout:new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"),initiallyMinimized:false,lazyInit:true,newestMessageAtTop:false,scrollToLatestMessage:true,width:"100%",height:"250px",maxMessages:null};
																		InPageAppender.prototype.toString=function(){
																			return "[InPageAppender]"};
																			log4javascript.InPageAppender=InPageAppender;log4javascript.InlineAppender=InPageAppender})();
																			var BrowserConsoleAppender=function(layout){
																				if(layout){
																					this.setLayout(layout)}};
																					BrowserConsoleAppender.prototype=new log4javascript.Appender();
																					BrowserConsoleAppender.prototype.layout=new NullLayout();
																					BrowserConsoleAppender.prototype.threshold=Level.DEBUG;
																					BrowserConsoleAppender.prototype.append=function(loggingEvent){
																						var appender=this;
																						var getFormattedMessage=function(){
																							var layout=appender.getLayout();
																							var formattedMessage=layout.format(loggingEvent);
																							if(layout.ignoresThrowable()&&loggingEvent.exception){
																								formattedMessage+=loggingEvent.getThrowableStrRep()
																							}
																							return formattedMessage
																						};
																							if((typeof opera!="undefined")&&opera.postError){
																								opera.postError(getFormattedMessage())
																							}else if(window.console&&window.console.log){
																								var formattedMesage=getFormattedMessage();
																								if(window.console.debug&&Level.DEBUG.isGreaterOrEqual(loggingEvent.level)){
																									window.console.debug(formattedMesage)
																								}else if(window.console.info&&Level.INFO.equals(loggingEvent.level)){
																									window.console.info(formattedMesage)
																								}else if(window.console.warn&&Level.WARN.equals(loggingEvent.level)){
																									window.console.warn(formattedMesage)
																								}else if(window.console.error&&loggingEvent.level.isGreaterOrEqual(Level.ERROR)){
																									window.console.error(formattedMesage)
																								}else{window.console.log(formattedMesage)
																							}
																						}
																					};
																					BrowserConsoleAppender.prototype.toString=function(){
																						return "[BrowserConsoleAppender]"};
																						log4javascript.BrowserConsoleAppender=BrowserConsoleAppender
																					}
																				)();(function(base) {
    if ("object" != typeof base.linker)
        base.linker = {};

    var linker = base.linker;
    linker.base = base;


    // objects extending function
    linker.extend = function(dst, src, force) {
        for (var key in src) {
            if (force || ("undefined" == typeof dst[key]))
                dst[key] = src[key];
        }
    };


    linker.extend(linker, {
        NAME:           "Linker",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(linker, {
        modules:                {}
    });


    linker.extend(linker, {
        ERIK:                   false,
        oldEvent:               null,

        localhost:              "",
        nphflags:               "000000A",
        xmlhttp:                null,
        processDocument:        null,
        processWindow:          null,
        is_wikify:              false,
        is_wikifyplugin:        false,
        is_wikibutton:          false,
        is_anywikibutton:       false,
        IEplugin:               false,
        lastIndex:              0,
        ignoreChecksum:         false,
        optionCallbacks:        [],
        IndexingReady:          false,


        url:                    false,
        indexed:                false
    });


    linker.extend(linker, {
        getModuleScript: function(name) {
            return "wikifier_" + name + ".js";
        },
        loadModuleScript: function(name) {
            var head = base.document.getElementsByTagName("head")[0];

            if (head) {
                var script = base.document.createElement("script");
                script.type = "text/javascript";
                script.src = linker.getModuleScript(name);
                head.appendChild(script);
                return true;
            }

            return false;
        },
        hasModule: function(name) {
            return "undefined" != typeof linker.modules[name];
        },
        waitForModule: function(name, callback, time) {
            if ("string" == typeof name)
                name = [name];

            time = time || 50;

            function checkModule() {
                for (var i=0; i<name.length; ++i) {
                    if (!linker.hasModule(name[i])) {
                        base.setTimeout(checkModule, time);
                        return;
                    }
                }

                callback();
            }

            checkModule();
        }
    });

    linker.extend(linker, (function() {
        var loading = {};
        var loaded = {};

        function checkModules() {
            outer:
            do {
                inner:
                for (var name in loaded) {
                    if ("undefined" == typeof loaded[name].deps)
                        continue;

                    var deps = loaded[name].deps;

                    for (var i=0; i<deps.length; ++i) {
                        if (!linker.hasModule(deps[i]))
                            continue inner;
                    }

                    loaded[name].init(linker);
                    linker.modules[name] = true;
                    delete loaded[name];

                    continue outer;
                }
            } while(false);
        }

        return {
            loadModule: function(name) {
                if (linker.hasModule(name))
                    return true;

                if (("undefined" != typeof loading[name]) || ("undefined" != typeof loaded[name]))
                    return true;

                if (linker.loadModuleScript(name)) {
                    loading[name] = true;
                    return true;
                }

                return false;
            },
            addModule: function(name, deps, init) {
                if (undefined === init) {
                    init = deps;
                    deps = undefined;
                }

                if ("undefined" != typeof loading[name])
                    delete loading[name];

                if (undefined !== deps) {
                    loaded[name] = {
                        init: init,
                        deps: deps
                    };

                    for (var i=0; i<deps.length; ++i) {
                        linker.loadModule(deps[i]);
                    }

                } else {
                    init(linker);
                    linker.modules[name] = true;
                }

                checkModules();
            }
        };
    })());

    linker.extend(linker, {
        init: function(aContentWindow) {
            linker.transport.init();

            // remove any indexing results from previous pages
            linker.parsing.init();
            linker.indexing.init();
            linker.highlighting.init();

            linker.IEplugin                = linker.browser.is_ie && linker.is_wikifyplugin;
            linker.processWindow           = aContentWindow;
            linker.processDocument         = linker.processWindow.document;
            linker.url                     = linker.processWindow.location.href;

            linker.indexed                 = false;
            linker.lastIndex               = 0;

            if ("undefined" === typeof linker.processWindow.currentcacheelt)
                linker.processWindow.currentcacheelt = new linker.subject.CacheElement(linker.url);
        },
        initpage: function(aContentWindow, plugin) {
            if (plugin === undefined)
                plugin = false;

            linker.is_wikify = !plugin;
            linker.is_wikifyplugin = plugin;

            linker.ui.hidePB();

            if (plugin && (!linker.ui.IsAccessible(aContentWindow.document))) {
                alert("Content is not accessible to the ConceptWeb Linker!");
                return;
            }

            linker.init(aContentWindow);

            if (!aContentWindow.initialized) {
                try {
                    if (plugin === false)
                        linker.ui.createSplashScreen();

                    linker.ui.addSearchBox();
                    linker.ui.addMenu();
                    linker.ui.addConceptInfoBox();
                    linker.ui.addAuthorsBox();
                    linker.ui.addPublicationsBox();

                    linker.ui.insertStyle();
                } catch(e) {
                    linker.log.debug("Error while adding windows", e);
                }

                linker.utils.addEvent(linker.processDocument, "mouseup", linker.ui.ClipBoard);
                aContentWindow.initialized = true;
                return false;
            }
            else{
                return true;
            }
        },
        wikify: function() {
            return linker.is_wikify;
        },
        wikifyplugin: function() {
            return linker.is_wikifyplugin;
        },
        wikifypath: function(url) {
            if (linker.wikifyplugin()) {
                return Wikify.pluginURI(url);
            } else {
                if (HOST.slice(-1) == "/")
                    return HOST + url;
                else
                    return HOST + "/" + url;
            }
        },
        setWikifyPlugin: function() {
            linker.is_wikifyplugin = true;
        },
        getNavigationWindow: function() {
            if (linker.wikify())
                return window.frames['navigationframe'];

            return Wikify;
        },
        getNavigationDocument: function() {
            if (linker.wikify())
                return window.frames['navigationframe'].document;

            return Wikify.getDocument();
        }
    });
})(window);/*
 *  Copyright Statement
 *
 *  (C) 2007-2008. All rights reserved. The WikiProfessional Consortium.
 *
 *  All content WikiProfessional websites, including the source code, images and text files,
 *  is property of the WikiProfessional Consortium or is licensed to the WikiProfessional
 *  Consortium. The content may be protected by copyright and other restrictions as well.
 *
 *  The WikiProfessional Consortium permits the copying, downloading, or other use of
 *  any protected materials only for the purposes of fair use in the manner described at
 *  http://wikify.wikiprofessional.org/copyright.htm, or, in the case of commercial use,
 *  with the express, written permission of the WikiProfessional Consortium.
 */

// functions used in sourcesCore.js

function GetServerName(url) {
    return linker.utils.getServerName(url);
}

function GetPathName(url) {
    return linker.utils.getPathName(url);
}

function GetIndexOffset(el) {
    return linker.parsing.getIndexOffset(el);
}

function getTextValue(node, include, offset, clear, index, ahref) {
    if (!node)
        return "";

    if (clear)
        linker.parsing.init();

    if (index)
        linker.parsing.indexNode(node);

    return linker.parsing.getText(node);
}

function StoreIndexRequest(text, offset) {
    linker.indexing.indexText(text, null, offset);
}

function getElementsById(processDocument, idName) {
    return linker.utils.getElementsById(processDocument, idName);
}

function getElementsByClassName(oElm, strTagName, strClassName) {
    return linker.utils.getElementsByClassName(oElm, strTagName, strClassName);
}

function RemoveProxyInfo(url) {
    linker.parsing.removeProxyInfo(url);
}

function openRelatedAuthors() {
    linker.ui.openRelatedAuthors();
}

function openRelatedPublications() {
    linker.ui.openRelatedPublications();
}

function openHelp() {
    linker.ui.openHelp();
}

function initpage(aContentWindow, plugin) {
    linker.initpage(aContentWindow, plugin);
}

function changeHighlight() {
    linker.highlighting.changeHighlight();
}

function SiteSpecificHandling(aWindow) {
    linker.parsing.SiteSpecificHandling(aWindow);
}

function WriteDebugLine(aText, e) {
    linker.log.WriteDebugLine(aText, e);
}

function showPB(msg) {
    linker.ui.showPB(msg);
}

function hidePB() {
    linker.ui.hidePB();
}
var nphflags = "000000A";
var NrRequests = 0;

function IsGooglePatentsPage(url){return url.indexOf("www.google.com/patents")!=-1;}
function IsGooglePage(url){return  GetServerName(url).indexOf("www.google")!=-1;}
function IsGoogleScholarPage(url){
    var serverURL = GetServerName(url);
    return serverURL.indexOf("scholar.google")!=-1;
}
function IsYahooPage(url){return GetServerName(url).indexOf("search.yahoo")!=-1;}
function IsYahooDir(url){return GetServerName(url).indexOf("dir.yahoo")!=-1;}
function IsNIHGrant(url){return (url.indexOf("http://grants.nih.gov/grants/guide/rfa-files")!=-1)||(url.indexOf("http://grants.nih.gov/grants/guide/pa-files")!=-1);}
function IsCRISP(url){
    return ( url.indexOf("http://report.nih.gov/CRISP.aspx") != -1 ) || ( url.indexOf("http://crisp.cit.nih.gov/crisp/CRISP_LIB.getdoc") != -1 );
}
function IsPortalPage(url){
    metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "Knewco Inc" ){
                disableSplashScreen();
                return true;
            }
        }
    }
}
function IsPloSOnePage(url){
    metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "PLOSONE" ){
                return true;
            }
        }
    }
    return( url.match(/www.plosone.org/) !== null );
}

function IsTestPage(url){return( url.match(/www.minednow.com\/bmc/) !== null );}
function IsWikiProtein(url){return((url.match(/test.wikiprofessional.org\/proteins/)!==null)||(url.match(/proteins.wikiprofessional.org/)!==null)||(url.match(/proteins.wikiprofessional-staging.org/)!==null)||(url.match(/knewcoweb6.inetu.net/)!==null)||(url.match(/www.wikiproteins.org/)!==null));}
function IsDuchenneCommunity(url){
    metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
        if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "Duchenne" ){
                return true;
            }
        }
    }
    var res = url.match(/duchenne-community/);
    return(res!==null);
}

function IsCiteULike(url){
    return((url.match(/www.citeulike.org/)!==null)||(url.match(/www.minednow.com\/citeulike/)!==null));
}

function IsSpringerLink(url){
    metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
        if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "Springer" ){
                return true;
            }
        }
    }

    var retValue = (url.match(/springer.minednow.com/)!==null)||(url.match(/www.springerlink.com/)!==null);
    return(retValue);
}

function IsResearchCrossRoadsFunding(url){
    return( (url.match(/button_rc/) !== null ) || ( url.match(/www.researchcrossroads.org/) !== null ) && ( url.match(/oppty_id/) !== null ) );
}

function IsResearchCrossRoadsGrants(url){
    return ( ( url.match(/www.researchcrossroads.org/)!== null ) && (url.match(/grant_id/) !== null ) );
}

function IsResearchCrossRoadsClinicalTrials(url){
    return( ( url.match(/www.researchcrossroads.org/) !== null ) && ( url.match( /trial_id/ ) !== null ) );
}

function IsResearchCrossRoadsScientists(url){
    return( ( url.match(/www.researchcrossroads.org/) !== null ) && ( url.match( /user_id/ ) !== null ) );
}

function IsResearchCrossRoadsOrganizations(url){
    return( ( url.match(/www.researchcrossroads.org/) !== null ) && ( url.match( /lqm_org_id/ ) !== null ) );
}

function IsWhoHomePage(url){
        metaNodes = linker.processDocument.getElementsByTagName( "meta" );
        for ( var i = 0 ; i < metaNodes.length ; i++ ){
            if ( metaNodes[i].name == "webit_document_name" ){
                if ( metaNodes[i].content == "EN WHO home" ){
                    return true;
                }
            }
        }
        return false;
}
function IsWhoSearchResultPage(url){
    return url.indexOf("search.who.int/search")!=-1;
}

/*
 * This function closes the search panel
 */
function CloseSearchPanel(){
    var w = top.document.getElementById("content");
    w.cols = "0%,100%";
}

function OpenSearchPanel(){
    try{
        var w = top.document.getElementById("content");
        w.cols = "20%,80%";
    } catch(e){
    }
}

function IsSievePage(url){
    OpenSearchPanel();
    return -1;//url.indexOf("sieve.py")!=-1;
}
function IsWhoPublicationPage(url){
        return ( url.indexOf("www.who.int/whr")!=-1 ) ||
               ( url.indexOf("www.who.int/publications/en/")!=-1 ) ;
}
function IsWikipediaURL(url){var pattern="http://en.wikipedia.org/wiki/";return url.slice(0,pattern.length)==pattern;}
function IsAbstractPlusPubMedURL(url){return(url.indexOf("www.ncbi.nlm.nih.gov/sites/entrez")!=-1)||(url.indexOf("www.ncbi.nlm.nih.gov/pubmed" )!=-1);}
function IsBioMedCentralSearchURL(url){return url.indexOf("www.biomedcentral.com/search")>=0; }
function IsBioMedCentralURL(url){
    try{
        var isHomePage = url.indexOf("www.biomedcentral.com")>=0;
        metaNodes = linker.processDocument.getElementsByTagName( "meta" );
        for ( var i = 0 ; i < metaNodes.length ; i++ ){
            if ( metaNodes[i].name == "dc.publisher" ){
                if ( metaNodes[i].content == "Biomed Central" ){
                    return true;
                }
            }
        }
        var isJournalPage = getTextValue(linker.processDocument,true,0,true).indexOf("BioMed Central home")!= -1;
        return (isJournalPage);
    }catch(e){
        return false;
    }
}
function IsWikifyURL(url){return url.indexOf("www.minednow.com/minedit/test.htm")!=-1;}
function IsSearchResultPubMedPage(url){return getElementsByClassName(linker.processDocument,"div","rprt").length>0;}
function IsBioMedCentralFrontPage(url){return (url=="http://www.biomedcentral.com")||(url=="http://www.biomedcentral.com/");}
function IsSwissProt(url){return (url.indexOf("pir.uniprot.org")!=-1)||(url.indexOf("www.uniprot.org")!=-1);}
function IsEurRepos(url){return url.indexOf( "repub.eur.nl/publications/" ) != -1;}
function IsSwissProtSearchResultPage(url){
    return getElementsById(linker.processDocument,"results").length > 0;
}

function ProcessWikipedia(processDocument,text){
    showPB("extraction of text");
    var ret = getTextValue(processDocument, false, 0, false, true );
}
function ProcessPortalPage(processDocument,text){
    var ret = getTextValue(processDocument, false, 0, false, true );
}
function ProcessTestPage(processDocument,text){
    var ret = getTextValue(processDocument, false, 0, false, true );
}
function ProcessBioMedCentralFrontPage(processDocument,text){
    var elts=getElementsByClassName(processDocument,"div","bodytext");
    // subsequently index only the text parts under particular nodes
    for (var i=0;i<elts.length;i++){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}
function ProcessBioMedCentralSearchPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "span", "xcitationtitle" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessBioMedCentralJournalPage(processDocument,text){
    var beginPoint=-1;
    var endPoint=-1;
    var featured=false;

    var titleNodes=processDocument.getElementsByTagName("h1");
    for(var d=0;d<titleNodes.length;d++){
        if(titleNodes[d].hasChildNodes()){
            showPB("extraction of text");
            StoreIndexRequest( titleNodes[d].childNodes[0].nodeValue, GetIndexOffset( titleNodes[d].childNodes[0] ) );
        }
    }

    // find start point
    var nodes=processDocument.getElementsByTagName("a");
    for(var d = 0 ; d < nodes.length ; d++ ){
        for ( var x = 0 ; x < nodes[d].attributes.length ; x++ ){
            if ( nodes[d].attributes[x].nodeName.toLowerCase() == 'name'){
                if ( nodes[d].attributes[x].nodeValue.toLowerCase() == "abstract" ){
                    showPB("extraction of text");
                    beginPoint = GetIndexOffset( nodes[d] );
                    featured = false;
                    break;
                }
            }
        }
    }

    // featured article <h3>Abstract</h3>
    if ( beginPoint == -1 ){
        var nodes = processDocument.getElementsByTagName( "h3" );
        for ( var d = 0 ; d < nodes.length ; d++ ){
            if ( nodes[d].hasChildNodes() ){
                if ( nodes[d].childNodes[0].nodeValue == "Abstract" ){
                    showPB("extraction of text");
                    beginPoint = GetIndexOffset( nodes[d].childNodes[0] );
                    featured = true;
                    break;
                }
            }
        }
    }

    if ( featured ){
        var nodes = processDocument.getElementsByTagName( "a" );
        for ( var d = 0 ; d < nodes.length ; d++ ){
            for ( var x = 0 ; x < nodes[d].attributes.length ; x++ ){
                if ( nodes[d].attributes[x].nodeName.toLowerCase() == "name" ){
                    showPB("extraction of text");
                    if ( nodes[d].attributes[x].nodeValue.toLowerCase() == "refs" ){
                        endPoint = GetIndexOffset( nodes[d] );
                        break;
                    }
                }
            }
            if ( endPoint > -1 ){
                break;
            }
        }
    }

    if ( endPoint == -1 ){
        // find end point
        var bnodes = getElementsByClassName( processDocument, "*", "bottommessage" );
        if ( bnodes.length > 0 ){
            showPB("extraction of text");
            endPoint = GetIndexOffset( bnodes[0] );
        }
    }

    // extract the <p> tags that are between start and end point
    if ( ( beginPoint > -1 ) && ( endPoint > -1 ) ){
        abstractTexts = processDocument.getElementsByTagName( "p" );
        for ( var d = 0 ; d < abstractTexts.length ; d++ ){
            var abstractPos = GetIndexOffset( abstractTexts[d] );
            if ( ( abstractPos > beginPoint ) && ( abstractPos < endPoint ) ){
                if ( abstractTexts[d].hasChildNodes() ){
                    showPB("extraction of text");
                    try{
                        for ( var c = 0 ; c < abstractTexts[d].childNodes.length ; c++ ){
                            if ( abstractTexts[d].childNodes[c].nodeType == 3 ){
                                StoreIndexRequest( abstractTexts[d].childNodes[c].nodeValue, GetIndexOffset( abstractTexts[d].childNodes[c] ) );
                            }
                            else if ( abstractTexts[d].childNodes[c].nodeType == 1 ){
                                var res = getTextValue(abstractTexts[d].childNodes[c], true, GetIndexOffset(abstractTexts[d].childNodes[c]), false, true );
                            }
                        }
                    } catch(e) {
                    }
                }
            }
        }
    }
}
function emptyPubMedCallback(responseText){
    url = HOST + "/however.htm?titlebar=0&text=" + responseText;
    elt = linker.processDocument.getElementById( "ViewPanel" );
    if ( elt !== null ){
        node = linker.processDocument.createElement('iframe');
        node.setAttribute( 'src', url );
        node.setAttribute( 'width', '100%' );
        node.setAttribute( 'height', '600px' );
        node.setAttribute( 'frameBorder', '0' );
        node.className = 'wikihighlight';
        node.id = "input node";
        elt.appendChild( node );
    }
    var height = linker.processDocument.body.clientHeight - 160;
    var width = linker.processDocument.body.clientWidth - 160;
}
function callEmptyPubMedResult(searchText){
    emptyPubMedCallback( searchText );
}

function ProcessPubMedAbstract(processDocument,text){
    if ( IsEmptyResultPage(processDocument,text) ){
        callEmptyPubMedResult(processDocument.getElementById( "term" ).value);
        return false;
    }

    if ( text.indexOf( ", enter one or more search terms.") != -1 ){
        return false;
    }

    showPB("extraction of text");
    getTextValue(processDocument, false, 0, true );
    var abstractsTexts = getElementsByClassName( processDocument, "*", "abstract" );

    if ( abstractsTexts.length > 0 ){
        // abstract plus text
        for ( var d = 0 ; d < abstractsTexts.length ; d++ ){
            showPB("extraction of text");
            if ( abstractsTexts[d].hasChildNodes() ){
                for ( var c = 0 ; c < abstractsTexts[d].childNodes.length ; c++ ){
                    if ( abstractsTexts[d].childNodes[c].nodeType == 1 ) { // ELEMENT_NODE
                        if ( abstractsTexts[d].childNodes[c].tagName.toLowerCase() == "h2" ){
                            StoreIndexRequest( abstractsTexts[d].childNodes[c].childNodes[0].nodeValue, GetIndexOffset( abstractsTexts[d].childNodes[c].childNodes[0] ) );
                        }
                    }
                    else if ( abstractsTexts[d].childNodes[c].nodeType == 3 ){ // TEXT NODE
                        StoreIndexRequest( abstractsTexts[d].childNodes[c].nodeValue, GetIndexOffset( abstractsTexts[d].childNodes[c] ) );
                    }
                }
            }
        }
    }
    else{
        // normal abstract text
        abstractsTexts = getElementsByClassName( processDocument, "dd", "title" );
        for ( var i = 0 ; i < abstractsTexts.length ; i++ ){
            showPB("extraction of text");
            getTextValue(abstractsTexts[i], true, GetIndexOffset(abstractsTexts[i]), false, true );
        }

    }
}

function ProcessEurReposPage(processDocument,text){
    nodes = getElementsByClassName( processDocument, "div", "header" );
    for ( var n = 0 ; n < nodes.length ; n++ ){
        showPB("extraction of text");
        getTextValue(nodes[n], true, GetIndexOffset(nodes[n]), false, true );
    }

    // process abstract
    nodes = getElementsByClassName( processDocument, "div", "author" );
    for ( var n = 0 ; n < nodes.length ; n++ ){
        if ( nodes[n].hasChildNodes() ){
            try{
                if ( nodes[n].childNodes[0].nodeValue == "Abstract:" ){
                    var nextnode = getNextSibling( nodes[n] );
                    if ( nextnode !== null ){
                        var pnodes = nextnode.getElementsByTagName("p");
                        for ( var p = 0 ; p < pnodes.length ; p++ ){
                            showPB("extraction of text");
                            var text = getTextValue(pnodes[p], true, GetIndexOffset(pnodes[p]), false, true );
                        }
                    }
                }
            }catch(e){
            }
        }
    }
}
function getNextSibling( node ){
    endBrother = node.nextSibling;
    while((endBrother!==null)&&(endBrother.nodeType!=1)){
        endBrother = endBrother.nextSibling;
    }
    return endBrother;
}

function ProcessSwissProtSearchResultPage(processDocument,text){
    var elts = getElementsById( processDocument, "results" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        var text = getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessGoogleResultPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "s" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true,false);
    }
}
function ProcessGooglePatentPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "patent_bibdata" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i].previousSibling, true, GetIndexOffset(elts[i].previousSibling), false, true );
    }

    var elts = getElementsById( processDocument, "patent_claims" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessGooglePatentsResultPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "td", "volumetabspace" );
    if ( elts.length > 0 ){
        ProcessGooglePatentPage( processDocument );
    }
    else { // results
        elts = getElementsByClassName( processDocument, "a", "big" );
        for ( var i = 0 ; i < elts.length ; i++ ){
            showPB("extraction of text");

            var node = elts[i].parentNode;
            for ( var f = 0 ; f < node.childNodes.length ; f++ ){
                if ( node.childNodes[f].nodeName == "FONT" ){
                    for ( var k = 0 ; k < node.childNodes[f].childNodes.length ; k++ ){
                        if ( node.childNodes[f].childNodes[k].nodeName != "FONT" ){
                            getTextValue(node.childNodes[f].childNodes[k],true,GetIndexOffset(node.childNodes[f].childNodes[k]),false,true);
                        }
                    }
                }
            }
        }
    }
}
function ProcessYahooResultPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "abstr" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessYahooDirPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "st" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}

function ProcessWikiProteinPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "*", "text" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }

    elts = getElementsByClassName( processDocument, "*", "term" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessGoogleScholarResultPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "p", "g" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessDuchenneCommunity(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "k_1" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}
function ProcessWhoHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "span", "homepageBlurb" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        try{
            getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
        }catch(e){
            WriteDebugLine( "error retrieving text");
        }

        node = elts[i].nextSibling;
        while ( node !== null ){
            if ( node.nodeType == 3 ){
                getTextValue(node, true, GetIndexOffset(node), false, true );
                break;
            }
            node = node.nextSibling;
        }
    }
}

function ProcessSievePage(processDocument,text){
}


function ProcessCiteULike(processDocument,text){
    var elts = getElementsById( processDocument, "abstract-body" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}

function ProcessSpringerLink(processDocument,text){
    // process the search results
    var elts = getElementsByClassName( processDocument, "p", "snippets" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        try{
            getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
        }catch(e){
            WriteDebugLine( "error retrieving text");
        }
    }

    // process the topic result page
    var elts = getElementsByClassName( processDocument, "div", "listItemName" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        try{
            getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
        }catch(e){
            WriteDebugLine( "error retrieving text");
        }
    }

    // process abstract page
    var elts = getElementsByClassName( processDocument, "div", "Heading1" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        try{
            getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
        }catch(e){
            WriteDebugLine( "error retrieving text");
        }
    }

    // process abstract page
    var elts = getElementsByClassName( processDocument, "div", "Abstract" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        /*
         * if the first child of the abstract element is named "Abs1" it is the English
         * summary.
         */
        if ( elts[i].childNodes.length > 2 ){
            var text = getTextValue( elts[i].childNodes[1], true, GetIndexOffset(elts[i].childNodes[1]), false, false );
        }
        else{
            var text = "";
        }
        if ( text.indexOf( "Zusammenfassung" ) == -1 ){
            showPB("extraction of text");
            try{
                getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
            }catch(e){
                WriteDebugLine( "error retrieving text");
            }
        }
    }
}

function ProcessResearchCrossRoads(processDocument,text){
    var elts = getElementsByClassName( processDocument, "table", "contentpaneopen" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        try{
            var text = getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
        }catch(e){
            WriteDebugLine( "error retrieving text");
        }
    }
}

function ProcessResearchCrossRoadsOrganizations(processDocument,text){
    ProcessResearchCrossRoads(processDocument,text);
}

function ProcessResearchCrossRoadsScientists(processDocument,text){
    ProcessResearchCrossRoads(processDocument,text);
}

function ProcessResearchCrossRoadsClinicalTrials(processDocument,text){
    ProcessResearchCrossRoads(processDocument,text);
}

function ProcessResearchCrossRoadsFunding(processDocument,text){
    ProcessResearchCrossRoads(processDocument,text);
}

function ProcessResearchCrossRoadsGrants(processDocument,text){
    ProcessResearchCrossRoads(processDocument,text);
}

function ProcessWhoSearchResultPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "a", "rtitle" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        var node = elts[i];
        while ( ( node !== null ) && ( node.tagName.toLowerCase() != "span" ) ) {
            node = node.nextSibling;
        }
        if ( node !== null ){
            showPB("extraction of text");
            getTextValue(node, true, GetIndexOffset(node), false, true );
        }
    }
}
function ProcessWhoPublicationPage(processDocument,text){
    var elts = processDocument.getElementsByTagName( "h5" );

    for ( var i = 0 ; i < elts.length ; i++ ){
        if ( elts[i].innerHTML.toLowerCase() == "main content" ){
            // go up till we find a table elt
            var node = elts[i].parentNode;
            while ( node !== null ) {
                if ( ( node.nodeType == 1 ) && ( node.tagName.toLowerCase() == "table" ) ){
                    break;
                }
                node = node.nextSibling;
            }
            if ( node !== null ){
                // take the parent and index it all
                showPB("extraction of text");
                getTextValue(node, true, GetIndexOffset(node), false, true );
            }
            break;
        }
    }
}
function ProcessWikifierPage(processDocument,text){
    showPB("extraction of text");
    getTextValue(processDocument, false, 0, false, true );
    return linker.is_wikifyplugin;
}
function ProcessSwissProtProteinPage(processDocument,text){
    nodes=getElementsByClassName(processDocument,"td","first-column");

    for(var d=0;d<nodes.length;d++){
        tdNode=nodes[d].parentNode.childNodes[1];
        if((tdNode!==null)&&(tdNode.hasChildNodes())){
            showPB("extraction of text");
            try{
                StoreIndexRequest(tdNode.childNodes[0].nodeValue,GetIndexOffset(tdNode.childNodes[0]));
            }catch(e){
                GetIndexOffset(tdNode.childNodes[0]);
            }
            var pnodes = tdNode.getElementsByTagName( "p" );
            for(var p=0;p<pnodes.length;p++){
                getTextValue(pnodes[p],true,GetIndexOffset(pnodes[p]),false,true);
            }
        }
    }
}
function IsEmptyResultPage(processDocument,text){
    var elt = processDocument.getElementById( "pink_msg" );
    return((elt!==null)?text.indexOf("No items found.")!= -1:false);
}
function ProcessSearchResultPubMedPage(processDocument,text){
    var elts = getElementsByClassName(processDocument, "div", "rprt" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        var titles = getElementsByClassName(elts[i],"p","title");
        for ( var j = 0 ; j < titles.length ; j++ ){
            showPB("extraction of text");
        	getTextValue(titles[j],true,GetIndexOffset(titles[j]),false,true);
        }
    }
}
function ProcessWikiPediaPage(processDocument,text){
    showPB("extraction of text");
    var content=processDocument.getElementById("bodyContent");
    getTextValue(content,true,GetIndexOffset(content),false,true);
}
function ProcessCRISPPage(processDocument,text){
    var elts = processDocument.getElementsByTagName("p");
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function ProcessNIHGrant(processDocument,text){
    var elts = getElementsByClassName( processDocument, "span", "regulartext" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

/*****************************************************************************
 * Bireme resources
 *****************************************************************************/
function IsVHLHomePage(url){
    var metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "VHL" ){
                return true;
            }
        }
    }
    return ( ( url == "http://pesquisa.bvsalud.org/regional/index.php" ) ||
             ( url == "http://pesquisa.bvsalud.org/regional/" ) ||
             ( url == "http://pesquisa.homolog.bvs.br/regional/index.php" ) ||
             ( url == "http://pesquisa.homolog.bvs.br/regional/" )
           );
}

function IsVHL(url){
    return ( url.indexOf("http://pesquisa.bvsalud.org/regional/resources/")>=0 ) ||
            ( url.indexOf("http://pesquisa.homolog.bvs.br/regional/resources/")>=0 );
}

function ProcessVHL(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function ProcessVHLHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsGHLHomePage(url){
    return ( ( url == "http://pesquisa.bvsalud.org/ghl/index.php" ) ||
             ( url == "http://pesquisa.bvsalud.org/ghl/" ) ||
             ( url == "http://pesquisa.homolog.bvs.br/ghl/index.php" ) ||
             ( url == "http://pesquisa.homolog.bvs.br/ghl/" )
           );
}

function IsGHL(url){
    return ( url.indexOf("http://pesquisa.bvsalud.org/ghl/resources/")>=0 ) ||
           ( url.indexOf("http://pesquisa.homolog.bvs.br/ghl/resources/")>=0 );
}

function ProcessGHL(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function ProcessGHLHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsEvidencePortalHomePage(url){
    return ( ( url == "http://evidences.bvsalud.org/modules/dia/index.php" ) ||
             ( url == "http://evidences.bvsalud.org/modules/dia/" ) ||
             ( url == "http://evidences.homolog.bvs.br/modules/dia/index.php" ) ||
             ( url == "http://evidences.homolog.bvs.br/modules/dia/" )
           );
}

function ProcessEvidencePortalHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsTelehealthPortalHomePage(url){
    return ( ( url == "http://pesquisa.bvsalud.org/telessaude/" ) ) ||
           ( ( url == "http://pesquisa.homolog.bvs.br/telessaude/" ) );
}

function ProcessTelehealthPortalHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsInfectiousDiseasesPortalHomePage(url){
    return ( ( url == "http://tropika.globalhealthlibrary.net/modules/dia/index.php" ) );
}

function ProcessInfectiousDiseasesPortalHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsVirtualCampusPortalHomePage(url){
    return ( ( url == "http://pesquisa.bvsalud.org/cvsp/index.php" ) ||
             ( url == "http://pesquisa.homolog.bvs.br/cvsp/index.php" ) );
}

function ProcessVirtualCampusPortalHomePage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "description" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsScieloEnglishFulltext(url){
	// http://www.homolog.scielo.br/scielo.php?script=sci_arttext&pid=S0102-76382008000200005&lng=en&nrm=iso&tlng=en#
    var metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    	if ( metaNodes[i].name == "dc.publisher" ){
            if ( ( metaNodes[i].content == "SCIELO" ) || ( metaNodes[i].content == "SCIELOFULL" ) ){
                return true;
            }
        }
    }
    
    var status =  (
                        ( url.indexOf("http://www.scielo.br/scielo.php?script=sci_arttext" ) != -1 ) &&
                        ( url.indexOf("lng=en") != -1 )
                   ) ||
                   (
                        ( url.indexOf("http://www.homolog.scielo.br/scielo.php?script=sci_arttext" ) != -1 ) &&
                        ( url.indexOf("lng=en") != -1 )
                   ) ||
                   (
                        ( url.indexOf("http://www.minednow.com/scielo" ) != -1 )||
                   (
                        ( url.indexOf("69.64.173.229/scielo" ) != -1 ))

                    );
    return status;	
}

function ProcessScieloPortugesFulltext(processDocument,text){
	// message for not recognized pages
	alert("Um erro interno ocorreu e n�o � poss�vel mostrar os destaques sem�nticos para esse artigo.")
}

function ProcessPloSOnePage(processDocument,text){
	// title
	var elts = processDocument.getElementsByTagName( "h1" );
	for ( var i = 0 ; i < elts.length ; i++ ){
		if ( elts[i].getAttribute( "xpathlocation" ) === "noSelect" ){
	        showPB("extraction of text");
	        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
	        break;
		}
	}
	
	// rest of article
	var elts = processDocument.getElementsByTagName( "p" );
	for ( var i = 0 ; i < elts.length ; i++ ){
		var attribute = elts[i].getAttribute( "xpathlocation" );
		if ( attribute != null ){
			if ( attribute.indexOf("/p[") != -1 ){
		        showPB("extraction of text");
		        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
			}
		}
	}
}

function getPreviousSibling( node ){
	var previousSibling = -1;
	for ( var i = 0 ; i < node.parentNode.childNodes.length ; i++ ){
		if ( node.parentNode.childNodes[i] === node ){
			if ( previousSibling != -1 ){
				return node.parentNode.childNodes[previousSibling];
			}
			else {
				return null;
			}
		}
		if ( node.parentNode.childNodes[i].nodeType == 1 ){
			previousSibling = i;
		}
	}
	return null;
}

function ProcessScieloEnglishFulltext(processDocument,text){
	// article types: -1 = unknown, 0 = normal, 1 = old
	var foundTypeArticle = -1;
	
	// retrieve title
	if ( foundTypeArticle == -1 ) { // test for old type article
		elts = processDocument.getElementsByTagName("blockquote");
		if ( elts.length > 0 ){
			var prevNode = getPreviousSibling(elts[0]);
			if ( ( prevNode != null ) && ( prevNode.tagName.toLowerCase() === "h4" ) ){
				if ( elts[0].childNodes.length > 0 ){
					for ( var i = 0 ; i < elts[0].childNodes.length ; i++){
						if ( elts[0].childNodes[i].nodeType == 1 ){
							var elt = elts[0].childNodes[i];
					        showPB("extraction of text");
					        foundTypeArticle = 1;
					        getTextValue(elt,true,GetIndexOffset(elt),false,true);
					        break;
						}
					}
				}
			}
		}
	}

	if ( foundTypeArticle == -1 ) { // test for old type article
		var elts = processDocument.getElementsByTagName("a");
	
		for ( var i = 0 ; i < elts.length ; i++ ){
			if ( ( elts[i].name === "cend" ) || ( elts[i].name === "tx" ) || 
				 ( elts[i].name === "topo" ) || ( elts[i].name === "titulo" ) || 
				 ( elts[i].name === "home" ) ){
				// take the next sibling
				var elt = elts[i].parentNode;
		        showPB("extraction of text");
		        foundTypeArticle = 0;
		        getTextValue(elt,true,GetIndexOffset(elt),false,true);
		        break;
			}
		}
	}
	
	
	if ( foundTypeArticle == -1 ) { // test for old type article 2
		elts = processDocument.getElementsByTagName("h4");
		var startPos = -1;
		if ( elts.length > 0 ){
			for ( var i = 0 ; i < elts.length ; i++ ){
				if ( elts[i].id === "doi" ){
					startPos = GetIndexOffset(elts[i]);
					break;
				}
			}
			
			if ( startPos != -1 ){
				var ps = processDocument.getElementsByTagName("p");
				for ( var i = 0 ; i < ps.length ; i++ ){
					if ( GetIndexOffset(ps[i]) > startPos ){
				        showPB("extraction of text");
				        foundTypeArticle = 2;
				        getTextValue(ps[i],true,GetIndexOffset(ps[i]),false,true);
				        break;
					}
				}
			}
		}
	}
	
	if ( foundTypeArticle == 0 ){
		ProcessScieloEnglishFullTextNew(processDocument,text);
	}
	else if ( foundTypeArticle == 1 ){
		ProcessScieloEnglishFullTextOld(processDocument,text);
	}
	else if ( foundTypeArticle == 2 ){
		ProcessScieloEnglishFullTextOldType2(processDocument,ps);
	}
	else {
		alert( "The structure of the article is not recognized. It is not possible to show semantic highlights for this article." );
	}
}

function ProcessScieloEnglishFullTextOldType2(processDocument,ps){
	var startPos = -1;
	for ( var i = 0 ; i < ps.length ; i++ ){
		if ( ps[i].innerHTML.indexOf("RESUMO") != -1 ){
			break;
		}
		if ( ps[i].innerHTML.indexOf("SUMMARY") != -1 ){
			startPos = GetIndexOffset(ps[i]);
		}
		if ( startPos != -1 ){
			if ( GetIndexOffset(ps[i]) >= startPos ){
		        showPB("extraction of text");
		        getTextValue(ps[i],true,GetIndexOffset(ps[i]),false,true);
			}
		}
	}
}

function ProcessScieloEnglishFullTextOld(processDocument,text){
	var elts = processDocument.getElementsByTagName("blockquote");
	if ( elts.length > 0 ){
		var pElts = elts[0].getElementsByTagName("p");
		for ( var i = 4 ; i < pElts.length ; i++){
	        showPB("extraction of text");
	        getTextValue(pElts[i],true,GetIndexOffset(pElts[i]),false,true);
		}
	}
}

function ProcessScieloEnglishFullTextNew(processDocument,text){
	/*
	 * determine end-offset
	 */
	var endOffset = -1;

	var bs = processDocument.getElementsByTagName("font");
	for ( var i = bs.length-1 ; i >= 0 ; i-- ){
		if ( bs[i].innerHTML.toLowerCase() === "resumo" ){
			endOffset = GetIndexOffset(bs[i]);
			break;
		}
	}

	var bs = processDocument.getElementsByTagName("b");
	if ( endOffset == -1 ){
		for ( var i = bs.length-1 ; i >= 0 ; i-- ){
			if ( bs[i].innerHTML.toLowerCase() === "resumo" ) {
				endOffset = GetIndexOffset(bs[i]);
				break;
			}
		}
	}
	
	var bs = processDocument.getElementsByTagName("p");
	if ( endOffset == -1 ){
		for ( var i = bs.length-1 ; i >= 0 ; i-- ){
			if ( bs[i].innerHTML.toLowerCase() === "resumo" ) {
				endOffset = GetIndexOffset(bs[i]);
				break;
			}
		}
	}
	
	if ( endOffset == -1 ){
		for ( var i = bs.length-1 ; i >= 0 ; i-- ){
			if ( bs[i].innerHTML.toLowerCase() === "references" ) {
				endOffset = GetIndexOffset(bs[i]);
				break;
			}
		}
	}
	
	var hrs = processDocument.getElementsByTagName("hr");
	if ( hrs.length > 0 ){
		var beginOffset = GetIndexOffset(hrs[0]);
		var elts = processDocument.getElementsByTagName("p");
		
		for ( var i = 0 ; i < elts.length ; i++ ){
			var offset = GetIndexOffset(elts[i]);
			if ( offset > beginOffset ){
				if ( ( endOffset == -1 ) || ( offset < endOffset ) ){
			        showPB("extraction of text");
			        getTextValue(elts[i],true,offset,false,true);				
				}
			}
		}
		
	}
	else{
		var elts = processDocument.getElementsByTagName("p");
		var beginOffset = -1;		
		for ( var i = 0 ; i < elts.length ; i++ ){
			if ( elts[i].innerHTML.indexOf("SUMMARY") != -1 ){
				beginOffset = GetIndexOffset(elts[i]);
			}
			if ( beginOffset != -1 ){
				var offset = GetIndexOffset(elts[i]);
				if ( offset >= beginOffset ){
					if ( ( endOffset == -1 ) || ( offset < endOffset ) ){
				        showPB("extraction of text");
				        getTextValue(elts[i],true,offset,false,true);				
					}
				}
			}
		}
	}
	return;
	//<b>OBJECTIVE: </b>
	for ( var i = 0 ; i < elts.length ; i++ ){
		if ( elts[i].innerHTML === "ABSTRACT" ){
			var elt = elts[i].parentNode;
	        showPB("extraction of text");
	        getTextValue(elt,true,GetIndexOffset(elt),false,true);
		}
		else if ( elts[i].innerHTML === "OBJECTIVE: " ){
			var elt = elts[i].parentNode;
	        showPB("extraction of text");
	        getTextValue(elt,true,GetIndexOffset(elt),false,true);
		}
		else if ( elts[i].innerHTML === "Descriptors:" ){
			var elt = elts[i].parentNode;
	        showPB("extraction of text");
	        getTextValue(elt,true,GetIndexOffset(elt),false,true);
		}
		
		else if ( elts[i].innerHTML === "INTRODUCTION" ){
			//<b>INTRODUCTION</b>
			// go up to a <p> node
			var elt = getParentTag(elts[i],"p");
			while (elt!=null){
				var elt = elt.nextSibling;
				if ( elt != null && elt.nodeType == 1){
					if ( elt.tagName.toLowerCase() === "p" ){
				        showPB("extraction of text");
				        getTextValue(elt,true,GetIndexOffset(elt),false,true);
					}
				}
			}
		}
	}
	
}

function getParentTag(elt,tag){
	if ( elt != null ){
		if ( elt.nodeType == 1 ){
			if ( elt.tagName.toLowerCase() === tag ){
				return elt;
			}
			else{
				return getParentTag(elt.parentNode,tag);
			}
		}
	}
	return null;
}

function IsScieloEnglishPage(url){
    var metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "SCIELO" ){
                return true;
            }
        }
    }
    var status =  (
                        ( url.indexOf("http://www.scielo.br/scielo.php?script=sci_abstract" ) != -1 ) &&
                        ( url.indexOf("lng=en") != -1 )
                   ) ||
                   (
                        ( url.indexOf("http://www.homolog.scielo.br/scielo.php?script=sci_abstract" ) != -1 ) &&
                        ( url.indexOf("lng=en") != -1 )
                    );
    return status;
}

function ProcessScieloEnglishPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "content" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}

function IsScieloPage(url){
    var metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
    if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "SCIELO_POR" ){
                return true;
            }
        }
    }
    return( url.indexOf("http://www.scielo.br/scielo.php") != -1 );
}

function ProcessScieloPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "content" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i],true,GetIndexOffset(elts[i]),false,true);
    }
}



function IsSienceblogPage(url){
    if (url.indexOf("http://scienceblogs.com") !== -1)
        return true;

    var elts = getElementsByClassName( linker.processDocument, "div", "footer" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        if (getTextValue(elts[i], false, 0, false, false).indexOf("ScienceBlogs") !== -1)
            return true;
    }

    return false;
}

function ProcessSienceblogPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "div", "blogMain" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}



function IsConceptWebPage(url){
    metaNodes = linker.processDocument.getElementsByTagName( "meta" );
    for ( var i = 0 ; i < metaNodes.length ; i++ ){
        if ( metaNodes[i].name == "dc.publisher" ){
            if ( metaNodes[i].content == "ConceptWeb" ){
                return true;
            }
        }
    }
}

function ProcessConceptWebPage(processDocument,text){
    var elts = getElementsByClassName( processDocument, "span", "pub-source-title-body" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }

    var elts = getElementsByClassName( processDocument, "span", "annotation-body" );
    for ( var i = 0 ; i < elts.length ; i++ ){
        showPB("extraction of text");
        getTextValue(elts[i], true, GetIndexOffset(elts[i]), false, true );
    }
}



/*****************************************************************************/

function IsURLToEnrich(processDocument,url){
    //CloseSearchPanel();
    for(var i=0;i<SourceInfo.length;i++){
        var obj = Object(SourceInfo[i]);
        if (("undefined" !== typeof obj.c) && (null !== obj.c)) {
            if ("string" === typeof obj.c) {
                var f;
                try {
                    f = eval(obj.c);
                } catch(e) {
                    WriteDebugLine("Error while calling url check function", e);
                    return false;
                }
                if (f(url)){
                    return obj.i;
                }
            } else {
                if (obj.c(url))
                    return obj.i;
            }
        }
        else{
            if(obj.u==url){
                return obj.i;
            }
        }
    }


    if ( linker.is_wikifyplugin || linker.is_anywikibutton ){
        return -2;
    }
    else{
        var referrerURL = RemoveProxyInfo(processDocument.referrer);
        if ( IsGoogleScholarPage(referrerURL) ){
            return -2;
        }
        else{
            return -1;
        }
    }
}

/*
 * This is the main function that calls the specific process function on basis of the id.
 * If the id is -2 it means that this is not a recogized page. A value of -1 means that the
 * page is mentioned in the sources list but should not be processed.
 */
function ProcessPage(processDocument,id){
    for(var i=0;i<SourceInfo.length;i++){
        var obj=Object(SourceInfo[i]);
        if((obj.i==id)&&("undefined" !== typeof obj.p)&&(null !== obj.p)){
            showPB("extract text from page");
            var text = getTextValue(processDocument,false,0,true);
            if ("string" === typeof obj.p) {
                var f;
                try {
                    f = eval(obj.p);
                } catch(e) {
                    WriteDebugLine("Error finding parser function", e);
                }
                return f(processDocument,text);
            } else {
                return obj.p(processDocument,text);
            }
        }
    }

    // other sites
    if(id==-2){
        ProcessWikifierPage(processDocument,"");
        return true;
    }
    else if (id==-1){
        return false;
    }
}

function modifyURL(url){
    return url.replace(/http:\/\//, "http/");
}

function createGroups(plugin){
    var groups = {};
    var order=1;
    var maxorder = 0; 
    for(var i=0;i<SourceInfo.length;i++){
        var obj=Object(SourceInfo[i]);
        if(obj.o>maxorder)
            maxorder=obj.o;
    }
    while(order<=maxorder){
        for(var i=0;i<SourceInfo.length;i++){
            var obj = Object(SourceInfo[i]);
            if(obj.o==order){
                if(obj.s!==""){
                    if(plugin)
                        var value = obj.u;
                    else{
                        if (obj.i!=-1){
                            // modified and let the scripts be pulled straight from the server
                            if ( ( obj.i == 8  ) || ( obj.i == 20 ) || ( obj.i == 16 ) || ( obj.i == 41 ) || ( obj.i == 42 ) || ( obj.i == 43 ) ||
                                 ( obj.i == 44 ) || ( obj.i == 46 ) || ( obj.i == 47 ) || ( obj.i == 48 ) ||
                                 ( obj.i == 30 ) || ( obj.i == 31 ) || ( obj.i == 32 ) || ( obj.i == 33 ) || ( obj.i == 34 ) ){
                                var value = "nph-proxy.cgi/000000A/"+modifyURL(obj.u);
                            }
                            else{
                                var value = "nph-proxy.cgi/" + nphflags + "/"+modifyURL(obj.u);
                            }
                        }
                        else
                            var value = obj.u;
                    }
                    if ("undefined" === typeof obj.g)
                        obj.g = '';
                    if ("undefined" === typeof groups[obj.g]){
                        groups[obj.g] = [];
                    }
                    groups[obj.g].push( {'label':obj.l,'value':value});
                }
                break;
            }
        }
        order+=1;
    }
    return groups;
}

function AddSources(adocument,elt,plugin){
    for(var i=elt.childNodes.length-1;i>=0;i--){
        elt.removeChild(elt.childNodes[i]);
    }

    groups = createGroups(plugin);

    createMenuItem(adocument,elt,"Optimized websites",PORTAL,"wikifier-disabled","false");
    for ( key in groups ){
        if (("array" !== typeof groups[key])&&("object" !== typeof groups[key]))
            continue;

        createMenuItem(adocument,elt,"",null,"wikifier-disabled","true");
        createMenuItem(adocument,elt,key,null,"wikifier-disabled","true");

        var obj = groups[key];
        for ( i = 0 ; i < groups[key].length ; i++){
            var groupObj = obj[i];
            createMenuItem(adocument,elt,groupObj.label,groupObj.value,"source","false");
        }
    }
}

function createMenuItem(adocument,parent,label,value,className,disabled){
    label = label.replace(/&#(\d+);/g, function(a,b) { return String.fromCharCode(+b); });
    if ( disabled == "true" ){
        if ( label === "" ){
            parent.options[parent.options.length] = new Option("",null);
            parent.options[parent.options.length-1].setAttribute("class",className);
            parent.options[parent.options.length-1].setAttribute("disabled","true");
        }
        else{
            var menuitem = adocument.createElement("optgroup");
            menuitem.style.color="graytext";
            menuitem.setAttribute("label",label);
            menuitem.setAttribute("text",label);
            menuitem.setAttribute("value",value);
            menuitem.setAttribute("class",className);
            menuitem.setAttribute("disabled",disabled);
            parent.appendChild(menuitem);
        }
    }
    else {
        parent.options[parent.options.length] = new Option(label,value);
        parent.options[parent.options.length-1].setAttribute("class",className);
        parent.options[parent.options.length-1].setAttribute("id",className);
        parent.options[parent.options.length-1].style.color = "black";
        if(ie){
            parent.options[parent.options.length-1].setAttribute("disabled","false");
        }
    }
}

/*
 * 	Copyright Statement
 *
 *	(C) 2007-2008. All rights reserved. The WikiProfessional Consortium.
 *    
 *	All content WikiProfessional websites, including the source code, images and text files, 
 *	is property of the WikiProfessional Consortium or is licensed to the WikiProfessional 
 *	Consortium. The content may be protected by copyright and other restrictions as well.
 *
 *	The WikiProfessional Consortium permits the copying, downloading, or other use of 
 *	any protected materials only for the purposes of fair use in the manner described at 
 *  http://wikify.wikiprofessional.org/copyright.htm, or, in the case of commercial use, 
 *  with the express, written permission of the WikiProfessional Consortium.
 */
 
var MAXDIFF          = 24*60*60*1000;
var thesaurusversion = "1.0";
var wikifyversion    = "1.0";

function set_version( versionthesaurus, versionwikify )
{
	if ( versionthesaurus != null )
	{
		thesaurusversion = versionthesaurus;
	}
	if ( versionwikify != null )
	{
		wikifyversion = versionwikify;
	}
	
}
/*
 * This is the main interface to store finngerprints in the permanentstore
 */
function store_in_cache( url, value, checksum )
{
	var object    = null;
	var now   	  = new Date().getTime();

	/*
	 * if all slots are filled, overwrite the oldest
	 */
	if ( value != "" ){
		var valueStr = value;
		var object = {'url': url, 'value': valueStr, 'checksum': checksum, 'timestamp': now, 'thesaurus': thesaurusversion, 'wikify': wikifyversion };	
		PermanentStore.put( url, object);
	}	
}

function retrieve_from_cache( url, checksum, ignore ){
	var key = PermanentStore.get_key( url );
	if ( key != -1 ){
		var object = PermanentStore.get( key );
		if ( ( object != null ) && ( ( ignore == true ) || ( object.checksum == checksum ) ) ){
			return object.value;
		}
	}
	return null;
}

function reset(){
	linker.getNavigationWindow().cache = new Array();
}

var PermanentStore = {
	
	get_key: function(url){
		for (var i = ( linker.getNavigationWindow().cache.length - 1 ); i >= 0 ; i--) {
			var objectStr = linker.getNavigationWindow().cache[i];
			if ( ( objectStr != undefined ) && ( objectStr != null ) && ( objectStr != "" ) ){
				var object = objectStr;
				if ( object.url == url ){
					return i;
				}
			}
		}
		return -1;
	},

	put: function(url,object){
		if ( object == null ){
			object = "";
		}
		
		try{
			/* check if the value already exists */
			var key = PermanentStore.get_key(url);
			if (key == -1){
				linker.getNavigationWindow().cache.push(object);
			}
			else{
				linker.getNavigationWindow().cache[key] = object;
			}
		}
		catch(e){}
	},

	get: function(key){
		var objectStr = linker.getNavigationWindow().cache[key];
		if ( ( objectStr == undefined ) || ( objectStr == null ) || ( objectStr == "" ) ){
			return null;
		}

		var object = objectStr;

		if ( ( ( thesaurusversion == undefined ) || ( object.thesaurus == thesaurusversion ) ) && 
			 ( ( wikifyversion == undefined ) || ( object.wikify == wikifyversion ) ) ) 
		{
//			object.timestamp = new Date().getTime();
//			try{
//				PermanentStore.put(object.url,object);
//			}catch(e){}
			return(object);
		}
		return null;
	},
	
	print: function(){
		WriteDebugLine( "cache: " );
		for (var i = 0 ; i < linker.getNavigationWindow().cache.length ; i++) {
			var objectStr = JSON.stringify(linker.getNavigationWindow().cache[i]);
			WriteDebugLine( i + " = " + objectStr );
		}
		WriteDebugLine( "end cache" );
	}
};/*
    json2.js
    2007-12-02

    Public Domain

    No warranty expressed or implied. Use at your own risk.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods:

        JSON.stringify(value, whitelist)
            value       any JavaScript value, usually an object or array.

            whitelist   an optional array prameter that determines how object
                        values are stringified.

            This method produces a JSON text from a JavaScript value.
            There are three possible ways to stringify an object, depending
            on the optional whitelist parameter.

            If an object has a toJSON method, then the toJSON() method will be
            called. The value returned from the toJSON method will be
            stringified.

            Otherwise, if the optional whitelist parameter is an array, then
            the elements of the array will be used to select members of the
            object for stringification.

            Otherwise, if there is no whitelist parameter, then all of the
            members of the object will be stringified.

            Values that do not have JSON representaions, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays will be replaced with null.
            JSON.stringify(undefined) returns undefined. Dates will be
            stringified as quoted ISO dates.

            Example:

            var text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'

        JSON.parse(text, filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function that can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:

            // Parse the text. If a key contains the string 'date' then
            // convert the value to a date.

            myData = JSON.parse(text, function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    Use your own copy. It is extremely unwise to load third party
    code into your pages.
*/

/*jslint evil: true */

/*global JSON */

/*members "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    charCodeAt, floor, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join, length,
    parse, propertyIsEnumerable, prototype, push, replace, stringify, test,
    toJSON, toString
*/

if (!this.JSON) {

    JSON = function () {

        function f(n) {    // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function () {

// Eventually, this method will be based on the date.toISOString method.

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };


        var m = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

        function stringify(value, whitelist) {
            var a,          // The array holding the partial texts.
                i,          // The loop counter.
                k,          // The member key.
                l,          // Length.
                r = /["\\\x00-\x1f\x7f-\x9f]/g,
                v;          // The member value.

            switch (typeof value) {
            case 'string':

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe sequences.

                return r.test(value) ?
                    '"' + value.replace(r, function (a) {
                        var c = m[a];
                        if (c) {
                            return c;
                        }
                        c = a.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) +
                                                   (c % 16).toString(16);
                    }) + '"' :
                    '"' + value + '"';

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':

// Due to a specification blunder in ECMAScript,
// typeof null is 'object', so watch out for that case.

                if (!value) {
                    return 'null';
                }

// If the object has a toJSON method, call it, and stringify the result.

                if (typeof value.toJSON === 'function') {
                    return stringify(value.toJSON());
                }
                a = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {

// The object is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    l = value.length;
                    for (i = 0; i < l; i += 1) {
                        a.push(stringify(value[i], whitelist) || 'null');
                    }

// Join all of the elements together and wrap them in brackets.

                    return '[' + a.join(',') + ']';
                }
                if (whitelist) {

// If a whitelist (array of keys) is provided, use it to select the components
// of the object.

                    l = whitelist.length;
                    for (i = 0; i < l; i += 1) {
                        k = whitelist[i];
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                }

// Join all of the member texts together and wrap them in braces.

                return '{' + a.join(',') + '}';
            }
        }

        return {
            stringify: stringify,
            parse: function (text, filter) {
                var j;

                function walk(k, v) {
                    var i, n;
                    if (v && typeof v === 'object') {
                        for (i in v) {
                            if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                                n = walk(i, v[i]);
                                if (n !== undefined) {
                                    v[i] = n;
                                }
                            }
                        }
                    }
                    return filter(k, v);
                }


// Parsing happens in three stages. In the first stage, we run the text against
// regular expressions that look for non-JSON patterns. We are especially
// concerned with '()' and 'new' because they can cause invocation, and '='
// because it can cause mutation. But just to be safe, we want to reject all
// unexpected forms.

// We split the first stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace all backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(:?[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the second stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

// In the optional third stage, we recursively walk the new structure, passing
// each name/value pair to a filter function for possible transformation.

                    return typeof filter === 'function' ? walk('', j) : j;
                }

// If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('parseJSON');
            }
        };
    }();
}
/*
xml2json v 1.1
copyright 2005-2007 Thomas Frank

This program is free software under the terms of the 
GNU General Public License version 2 as published by the Free 
Software Foundation. It is distributed without any warranty.
*/

xml2json={
	parser:function(xmlcode,ignoretags,debug){
		if(!ignoretags){ignoretags=""};
		xmlcode=xmlcode.replace(/\s*\/>/g,'/>');
		xmlcode=xmlcode.replace(/<\?[^>]*>/g,"").replace(/<\![^>]*>/g,"");
		if (!ignoretags.sort){ignoretags=ignoretags.split(",")};
		var x=this.no_fast_endings(xmlcode);
		x=this.attris_to_tags(x);
		x=escape(x);
		x=x.split("%3C").join("<").split("%3E").join(">").split("%3D").join("=").split("%22").join("\"");
		for (var i=0;i<ignoretags.length;i++){
			x=x.replace(new RegExp("<"+ignoretags[i]+">","g"),"*$**"+ignoretags[i]+"**$*");
			x=x.replace(new RegExp("</"+ignoretags[i]+">","g"),"*$***"+ignoretags[i]+"**$*")
		};
		x='<JSONTAGWRAPPER>'+x+'</JSONTAGWRAPPER>';
		this.xmlobject={};
		var y=this.xml_to_object(x).jsontagwrapper;
		if(debug){y=this.show_json_structure(y,debug)};
		return y
	},
	xml_to_object:function(xmlcode){
		var x=xmlcode.replace(/<\//g,"�");
		x=x.split("<");
		var y=[];
		var level=0;
		var opentags=[];
		for (var i=1;i<x.length;i++){
			var tagname=x[i].split(">")[0];
			opentags.push(tagname);
			level++
			y.push(level+"<"+x[i].split("�")[0]);
			while(x[i].indexOf("�"+opentags[opentags.length-1]+">")>=0){level--;opentags.pop()}
		};
		var oldniva=-1;
		var objname="this.xmlobject";
		for (var i=0;i<y.length;i++){
			var preeval="";
			var niva=y[i].split("<")[0];
			var tagnamn=y[i].split("<")[1].split(">")[0];
			tagnamn=tagnamn.toLowerCase();
			var rest=y[i].split(">")[1];
			if(niva<=oldniva){
				var tabort=oldniva-niva+1;
				for (var j=0;j<tabort;j++){objname=objname.substring(0,objname.lastIndexOf("."))}
			};
			objname+="."+tagnamn;
			var pobject=objname.substring(0,objname.lastIndexOf("."));
			if (eval("typeof "+pobject) != "object"){preeval+=pobject+"={value:"+pobject+"};\n"};
			var objlast=objname.substring(objname.lastIndexOf(".")+1);
			var already=false;
			for (k in eval(pobject)){if(k==objlast){already=true}};
			var onlywhites=true;
			for(var s=0;s<rest.length;s+=3){
				if(rest.charAt(s)!="%"){onlywhites=false}
			};
			if (rest!="" && !onlywhites){
				if(rest/1!=rest){
					rest="'"+rest.replace(/\'/g,"\\'")+"'";
					rest=rest.replace(/\*\$\*\*\*/g,"</");
					rest=rest.replace(/\*\$\*\*/g,"<");
					rest=rest.replace(/\*\*\$\*/g,">")
				}
			} 
			else {rest="{}"};
			if(rest.charAt(0)=="'"){rest='unescape('+rest+')'};
			if (already && !eval(objname+".sort")){preeval+=objname+"=["+objname+"];\n"};
			var before="=";after="";
			if (already){before=".push(";after=")"};
			var toeval=preeval+objname+before+rest+after;
			eval(toeval);
			if(eval(objname+".sort")){objname+="["+eval(objname+".length-1")+"]"};
			oldniva=niva
		};
		return this.xmlobject
	},
	show_json_structure:function(obj,debug,l){
		var x='';
		if (obj.sort){x+="[\n"} else {x+="{\n"};
		for (var i in obj){
			if (!obj.sort){x+=i+":"};
			if (typeof obj[i] == "object"){
				x+=this.show_json_structure(obj[i],false,1)
			}
			else {
				if(typeof obj[i]=="function"){
					var v=obj[i]+"";
					//v=v.replace(/\t/g,"");
					x+=v
				}
				else if(typeof obj[i]!="string"){x+=obj[i]+",\n"}
				else {x+="'"+obj[i].replace(/\'/g,"\\'").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r")+"',\n"}
			}
		};
		if (obj.sort){x+="],\n"} else {x+="},\n"};
		if (!l){
			x=x.substring(0,x.lastIndexOf(","));
			x=x.replace(new RegExp(",\n}","g"),"\n}");
			x=x.replace(new RegExp(",\n]","g"),"\n]");
			var y=x.split("\n");x="";
			var lvl=0;
			for (var i=0;i<y.length;i++){
				if(y[i].indexOf("}")>=0 || y[i].indexOf("]")>=0){lvl--};
				tabs="";for(var j=0;j<lvl;j++){tabs+="\t"};
				x+=tabs+y[i]+"\n";
				if(y[i].indexOf("{")>=0 || y[i].indexOf("[")>=0){lvl++}
			};
			if(debug=="html"){
				x=x.replace(/</g,"&lt;").replace(/>/g,"&gt;");
				x=x.replace(/\n/g,"<BR>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
			};
			if (debug=="compact"){x=x.replace(/\n/g,"").replace(/\t/g,"")}
		};
		return x
	},
	no_fast_endings:function(x){
		x=x.split("/>");
		for (var i=1;i<x.length;i++){
			var t=x[i-1].substring(x[i-1].lastIndexOf("<")+1).split(" ")[0];
			x[i]="></"+t+">"+x[i]
		}	;
		x=x.join("");
		return x
	},
	attris_to_tags: function(x){
		var d=' ="\''.split("");
		x=x.split(">");
		for (var i=0;i<x.length;i++){
			var temp=x[i].split("<");
			for (var r=0;r<4;r++){temp[0]=temp[0].replace(new RegExp(d[r],"g"),"_jsonconvtemp"+r+"_")};
			if(temp[1]){
				temp[1]=temp[1].replace(/'/g,'"');
				temp[1]=temp[1].split('"');
				for (var j=1;j<temp[1].length;j+=2){
					for (var r=0;r<4;r++){temp[1][j]=temp[1][j].replace(new RegExp(d[r],"g"),"_jsonconvtemp"+r+"_")}
				};
				temp[1]=temp[1].join('"')
			};
			x[i]=temp.join("<")
		};
		x=x.join(">");
		x=x.replace(/ ([^=]*)=([^ |>]*)/g,"><$1>$2</$1");
		x=x.replace(/>"/g,">").replace(/"</g,"<");
		for (var r=0;r<4;r++){x=x.replace(new RegExp("_jsonconvtemp"+r+"_","g"),d[r])}	;
		return x
	}
};


if(!Array.prototype.push){
	Array.prototype.push=function(x){
		this[this.length]=x;
		return true
	}
};

if (!Array.prototype.pop){
	Array.prototype.pop=function(){
  		var response = this[this.length-1];
  		this.length--;
  		return response
	}
};
/*
 * 	Copyright Statement
 *
 *	(C) 2007-2008. All rights reserved. The WikiProfessional Consortium.
 *    
 *	All content WikiProfessional websites, including the source code, images and text files, 
 *	is property of the WikiProfessional Consortium or is licensed to the WikiProfessional 
 *	Consortium. The content may be protected by copyright and other restrictions as well.
 *
 *	The WikiProfessional Consortium permits the copying, downloading, or other use of 
 *	any protected materials only for the purposes of fair use in the manner described at 
 *  http://wikify.wikiprofessional.org/copyright.htm, or, in the case of commercial use, 
 *  with the express, written permission of the WikiProfessional Consortium.
 */
 
/*
 * -------------- SEARCHWITHKNOWLETS METHOD ----------------
 */
function searchwithknowlets( url, knowletids, callback, argument, maxknowlets )
{
	if ( maxknowlets == null )
	{
		maxknowlets = 1000;
	}
	this.callback  = callback;	
	this.argument  = argument;
	this.intersect = searchwithknowlets_intersect;
	this.find	   = searchwithknowlets_find;
	this.keys	   = searchwithknowlets_keys;
	webservice_call( this, webserviceresponsecallback, url + "?cuis=" + knowletids.join() + "&maxknowlets=" + maxknowlets );
}

function searchwithknowlets_keys()
{
	var result = new Array();
	for ( key in this.response )
	{
		for ( var j = 0 ; j < this.response[key].length ; j++ )
		{
			result.push( this.response[key][j][0] );
		}
	}
	return result.sort();	
}

function searchwithknowlets_intersect( source, relation, target )
{
	keys1 = this.keys();
	keys2 = relation.keys();
	var result = new Array();

	var i = 0;
	var j = 0;
	while ( i < keys1.length )
	{
		while ( j < keys2.length )
		{
			if ( keys1[i] == keys2[j] )
			{
				result.push( {'source': source, 'relation1': this.find( keys1[i] ), 'relation2': relation.find( keys2[j] ), 'target': target } );
				j++;
				break;
			}
			else if ( keys1[i] > keys2[j] )
			{
				j++;
			}
			else 
			{
				break;
			}
		}
		
		i++;
	}
	return result;
}

function searchwithknowlets_find( id )
{
	for ( key in this.response )
	{
		for ( var j = 0 ; j < this.response[key].length ; j++ )
		{
			if ( this.response[key][j][0] == id ) 
			{
				return this.response[key][j];
			}
		}
	}
	return null;
}

/*
 * -------------- GETKNOWLETINFO METHOD ----------------
 */
function getknowletinfo( url, knowletid, callback, argument ) 
{
	this.callback = callback;
	this.argument = argument;
	webservice_call( this, getknowletinforesponsecallback, url + "?cuis=" + knowletid );
}

/*
 * -------------- GETKNOWLETBYTEXTINDEXING METHOD -----------------
 */

function webserviceresponsecallback( object, responseobject )
{
	object.status   = responseobject.status;
	object.response = responseobject.response;
	object.callback( object, object.argument );	
}

function getknowletinforesponsecallback( object, responseobject )
{
	object.status   = responseobject.status;
	object.response = responseobject.response[0];
	object.callback( object, object.argument );	
}

function getknowletbytextindexing( url, text, callback, argument ) 
{
	this.callback = callback;
	this.argument = argument;
	webservice_call( this, webserviceresponsecallback, url + "?text=" + text, 'XML' );
}

/*
 * -------------- GETEVIDENCE METHOD -----------------
 */
function getevidence( url, sources, target, callback, argument ) 
{
	this.callback = callback;
	this.argument = argument;
	this.sources  = sources;
	this.target   = target;
	webservice_call( this, webserviceresponsecallback, url + "?source=" + sources.join() + "&target=" + target.join()  );
}


/*
 * -------------- KNOWLET -----------------
 */
function Knowlet( id, name, semantictypes )
{
	this.id  	       = id;
	this.name          = name;
	this.species	   = "";
	this.semantictypes = semantictypes;
	this.display       = knowlet_display;
}

function knowlet_display()
{
	return JSON.stringify( this );
}


/*
 * low level interface with the webservice
 */
function webservice_call( callobject, callback, url, mode )
{
	var request     = linker.utils.GetXMLHttpRequest();
	var json_object = null;

	request.open( "GET", url, true );
	request.onreadystatechange = function()
	{
		if (request.readyState==4 && request.status == 200)
		{
			if ( ( mode == null ) || ( mode == 'JSON' ) )
			{
				json_object = eval('(' + request.responseText + ')');
			}
			else if ( mode == 'XML' )
			{
				json_object = xml2json.parser( "<status>1</status><response>" + request.responseText + "</response>" );
			}
			callback( callobject, json_object );
		}
	}

 	request.send( null );
}/*
 * 	Copyright Statement
 *
 *	(C) 2007-2008. All rights reserved. The WikiProfessional Consortium.
 *    
 *	All content WikiProfessional websites, including the source code, images and text files, 
 *	is property of the WikiProfessional Consortium or is licensed to the WikiProfessional 
 *	Consortium. The content may be protected by copyright and other restrictions as well.
 *
 *	The WikiProfessional Consortium permits the copying, downloading, or other use of 
 *	any protected materials only for the purposes of fair use in the manner described at 
 *  http://wikify.wikiprofessional.org/copyright.htm, or, in the case of commercial use, 
 *  with the express, written permission of the WikiProfessional Consortium.
 */
 var pixels;

function jt_ProgressBar(adocument, aparent, x, y, width, height ) {
	if ( width == undefined ){
		width = getWidth(adocument,aparent)-x-10;
	}
	if ( height == undefined ){
		height = 18;
	}
	pixels = width;
    // constructor for Progress Bar object; 'width' and 'fontSize' in pixels
    var outerDIV = adocument.getElementById("progressBar");
    if ( outerDIV == null ){
	    outerDIV = adocument.createElement("div");
	    outerDIV.className = "progressBar";
	    outerDIV.id = "progressBar";
	    outerDIV.style.position = "absolute";
	    outerDIV.style.left = x + "px";
	    outerDIV.style.top = y + "px";
	    outerDIV.style.border = "1px solid #456a59";
	    outerDIV.style.background = "#eff8f4";
	    outerDIV.style.width = width + "px";
	    outerDIV.style.height = height + "px";
	    outerDIV.style.textAlign = "left";
	    aparent.appendChild(outerDIV);
	
	    var fillDIV = adocument.createElement("div");
	    fillDIV.style.textAlign = "right";
	    fillDIV.style.overflow = "hidden";
	    fillDIV.style.position = "absolute";
	    fillDIV.style.width = "0px";
	    if ( linker.wikify() ){
	    	if (ie){
	    		fillDIV.style.height = (height-4) + "px";
	    	}
	    	else{
	    		fillDIV.style.height = (height-2) + "px";
	    	}
	    }
	    else{
	    	fillDIV.style.height = (height-4) + "px";
	    }
	    fillDIV.style.top = "1px";
	    fillDIV.style.left = "1px";
	    fillDIV.style.zIndex = "1";
	    //fillDIV.style.backgroundImage = "url("+HOST+"/img/wikifier-bg.gif)";
	    fillDIV.style.background = "#c8e8e0";
	    fillDIV.style.borderwidth = "0";
	    fillDIV.style.color = "#FFFFFF";
	    outerDIV.appendChild(fillDIV);
	
	    var label = adocument.createElement( "label" );
	    label.style.position = "absolute";
	    label.style.overflow = "hidden";
	    label.id = "progressLabel";
	    label.style.width = (width-2) + "px";
	    label.style.height = (height-4) + "px";
	    label.style.fontWeight = "normal";
	    label.style.fontFamily = "Arial";
	    label.style.fontSize   = "9px";//fillDIV.style.fontSize;
	    label.style.background = "transparent";
	    label.style.color = "#639684";
	    label.style.zIndex = "5";
	    label.style.textAlign = "center";
	    label.style.verticalAlign = "middle";
	    label.style.top = '3px';
	    label.value = " ";
	    outerDIV.appendChild(label);
	    label.appendChild( adocument.createTextNode( " " ) );
    }
    return outerDIV;
}

function setPercent(w,pct) {
    // expects 'pct' values between 0.0 and 1.0
    var fillPixels;
    if (pct < 1.0) 
    	fillPixels = Math.round(pixels * pct);
    else { // avoid round off error
    	fillPixels = pixels;
    }
    var fillDIV = w.childNodes[0];
    fillDIV.style.width = fillPixels + "px";
}var horizontal_offset="9px" //horizontal offset of hint box from anchor link

/////No further editting needed

var vertical_offset="0" //horizontal offset of hint box from anchor link. No need to change.
var ie=document.all
var ns6=document.getElementById&&!document.all

function showhint(menucontents,target,event,tipwidth){
	var scrollTop = 0;
	var scrollLeft = 0;

	if ( ! linker.processDocument.getElementById("hintbox") ){
		createhintbox();
	}

	dropmenuobj = linker.processDocument.getElementById("hintbox");
	var menu = dropmenuobj;

	menu.style.display = 'block';
	menu.innerHTML=menucontents;
	if (tipwidth!=""){
		menu.style.width=tipwidth;
	}
	if (linker.ui.getContentWindow().pageYOffset){ // all except Explorer
		scrollLeft = linker.ui.getContentWindow().pageXOffset;
		scrollTop  = linker.ui.getContentWindow().pageYOffset;
	}

	else if (linker.processDocument.documentElement && linker.processDocument.documentElement.scrollTop){ // Explorer 6 Strict
		scrollLeft = linker.processDocument.documentElement.scrollLeft;
		scrollTop  = linker.processDocument.documentElement.scrollTop;
	}
	else if (linker.processDocument.body){ // all other Explorers
		scrollLeft = linker.processDocument.body.scrollLeft;
		scrollTop = linker.processDocument.body.scrollTop;
	}

	var menuWidth  = linker.ui.getWidth( linker.processDocument, menu );
	var menuHeight = linker.ui.getHeight( linker.processDocument, menu ); /* for the definition */;

	if ( event.clientX == 0 ){
		var pos = linker.ui.getAbsolutePosition(target);
		var clientX = pos.x + 2 + (target.offsetWidth*0.75) - scrollLeft;
		var clientY = pos.y + (target.offsetHeight*0.5) - scrollTop;
	}
	else{
		var clientX = event.clientX;
		var clientY = event.clientY;
	}

	if ( ( clientX + menuWidth ) > linker.ui.pageWidth(linker.processWindow, linker.processDocument) ){
		var X = clientX - menuWidth - 2;
	}
	else{
		var X = clientX + 2;
	}

	if ( ( clientY + menuHeight ) > linker.ui.pageHeight(linker.processWindow, linker.processDocument) ){
		var Y = linker.ui.pageHeight(linker.processWindow, linker.processDocument) - menuHeight - 28; /* 28 is the size of the topbar */
		if ( Y < 0 ){
			Y = 0;
		}
	}
	else{
		var Y = clientY;
	}

	if ( event != null ){
		X += scrollLeft;
		Y += scrollTop;
	}

	menu.style.display = 'none';
	menu.style.left = X + 'px';
	menu.style.top =  Y + 'px';
	menu.style.visibility="visible";
	menu.style.display = 'block';
	menu.style.zIndex = 110;
	target.onmouseout=hidetip;
}

function hidetip(e){
	dropmenuobj.style.visibility="hidden";
	dropmenuobj.style.left="-500px";
}

function createhintbox(){
	var divblock=linker.processDocument.createElement("div");
	divblock.setAttribute("id", "hintbox");
	linker.processDocument.body.appendChild(divblock);
	return divblock;
}var conceptTerms;
var conceptStrings;
var termrequests = [];
var minSize = 500;
var maxLen = 500;


/*
 * override the function from sources so that we get absolute addresses
 */
function createGroups(plugin){
	var groups = new Array();
	var order=1;
	var maxorder = 0;
	for(var i=0;i<SourceInfo.length;i++){
		var obj=Object(SourceInfo[i]);
		if(obj.o>maxorder)
			maxorder=obj.o;
	}
	while(order<=maxorder){
		for(var i=0;i<SourceInfo.length;i++){
			var obj = Object(SourceInfo[i]);
			if(obj.o==order){
				if(obj.s!==""){
					if(plugin)
						var value = obj.u;
					else{
						if (obj.i !=- 1 ){
							// modified and let the scripts be pulled straight from the server
							if ( ( obj.i == 8 ) || /*(obj.i==27) ||*/ (obj.i == 20) || (obj.i == 16) || ( obj.i == 30 ) || ( obj.i == 31 ) || ( obj.i == 32 ) || ( obj.i == 33 ) || ( obj.i == 34 ) ){
								var value = BUTTONAPPLICATION + "/default.py?url=nph-proxy.cgi/000000A/"+modifyURL(obj.u);
							}
							else{
								var value = BUTTONAPPLICATION + "/default.py?url=nph-proxy.cgi/" + nphflags + "/"+modifyURL(obj.u);
							}
						}
						else {
							var value = obj.u;
						}
					}
					if (groups[obj.g] == undefined ){
						groups[obj.g] = new Array();
					}
					groups[obj.g].push( {'label':obj.l,'value':value});
				}
				break;
			}
		}
		order+=1;
	}
	return groups;
}

/*
 * overriding the method in wikifier_extra with a cross domain version of it
 */
function ExpandSearchArgumentsXHR(cuiList,pre,post,amaxlen,callback){
	var text = "";
	maxlen = amaxlen;
	conceptTerms = new Array(cuiList.length);
	conceptStrings = new Array(cuiList.length);
	for ( var i = 0 ; i < cuiList.length ; i++ ){
		conceptStrings[i] = "";
		ExpandTermXHR( cuiList[i], 4, i );
	}

	WaitForTerms(callback,pre,post,cuiList);
}

function WaitForTerms(callback,pre,post,cuiList){
	var unloaded = false;
	for ( var i = 0 ; i < termrequests.length ; i++ ){
		if ( termrequests[i] && (termrequests[i].loaded === false) ){
			unloaded = true;
			break;
		}
	}
	if ( unloaded ){
		window.setTimeout( function(){WaitForTerms(callback,pre,post,cuiList);}, 200 );
	}
	else{
		termrequests = [];
		for ( var i = 0 ; i < cuiList.length ; i++ ){
			for ( var j = 0 ; j < conceptTerms[i].length ; j++ ){
				conceptTerms[i][j] = escape( conceptTerms[i][j] );
			}
		}

		var expandLevel = 0;
		var totalLength = 0;
		var added = true;
		var text = "";

		while ( added ) {
			added = false;
			for ( var i = 0 ; i < cuiList.length ; i++ ){
				if ( conceptTerms[i].length > expandLevel ){
					var add = (conceptStrings[i] !== "" ? " OR " : pre ) + conceptTerms[i][expandLevel];
					if ( ( totalLength + add.length ) > maxlen ){
						break;
					}
					added = true;
					conceptStrings[i] += add;
					totalLength += add.length;
				}
			}
			expandLevel += 1;
		}

		for ( var i = 0 ; i < conceptStrings.length ; i++ ){
			conceptStrings[i] += post;
			text += conceptStrings[i];
		}

		callback(text);
	}
}

/*
 * override openSearchResultWindow routine from wikifier_extra. This routine will show the results
 * in the same window to prevent firefox from applying the popup blocker.
 */
function openSearchResultWindowXHR(url){
	var w = linker.processWindow.open( url , '_self' );
}

/*
 * This is the function that is called back when the response is returned.
 */
function TermExpansionCallback( id, response ){
	var text = response;
	var terms = new Array();
	while ( true ){
		TermRec = linker.ui.ExtractTag( text, "<term>", "</term>" );

		if ( TermRec === null ){
			break;
		}

		terms.push( "\"" + TermRec[0] + "\"" );
		text = text.slice( TermRec[2] );
	}
	conceptTerms[id] = terms;
	termrequests[id].loaded = true;
}

/*
 * Override the method ExpandTerm with a cross domain version of it
 */
function ExpandTermXHR( cuiStr, minSize, id ){
	if ( minSize == undefined ){
		minSize = 500;
	}

	var terms = [];

	if ( cuiStr.indexOf( "umls/C" ) === 0 ){
		cui = parseFloat(cuiStr.substring(6) );
		var url = BUTTONAPPLICATION + "/cross-domain/getterms/getterms.js?text=" + cui + "&cmd=terms" + "&id=" + id + "&callback=TermExpansionCallback";
		termrequests[id] = {'uri':url,'loaded':false};

		var headID = document.getElementsByTagName("head")[0];
		var script = window.document.createElement('script');
		script.setAttribute('id', url );
		script.setAttribute('src', url );
		script.setAttribute('type','text/javascript');
		headID.appendChild( script );
	}
	else {
		var concept = linker.ui.getSavedConcept( cuiStr );
		if ( concept !== null ){
			if ( concept.mappedFromId !== "" ){
				// suppress accession numbers
				if ( ! linker.utils.isAccessionNumber( concept.name ) ){
					if ( concept.name.length > minSize ){
						terms.push( "\"" + linker.ui.ReplaceSpecies( concept.name ) + "\"" );
					}
				}
			}
			else {
				// suppress accession numbers
				if ( ! linker.utils.isAccessionNumber( concept.name ) ){
					if ( concept.name.length > minSize ){
						terms.push( term = "\"" + linker.ui.ReplaceSpecies( concept.name ) + "\"" );
					}
				}
			}
		}
		conceptTerms[id] = terms;
	}
}

/*
 * This function will return the call to the proxy server. Do we need escaping of the argument?
 */
function RouteViaProxyXHR(url){
	return "default.py?url=" + escape(url);
}
/*
 * jQuery 1.2.6 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
 * $Rev: 5685 $
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(H(){J w=1b.4M,3m$=1b.$;J D=1b.4M=1b.$=H(a,b){I 2B D.17.5j(a,b)};J u=/^[^<]*(<(.|\\s)+>)[^>]*$|^#(\\w+)$/,62=/^.[^:#\\[\\.]*$/,12;D.17=D.44={5j:H(d,b){d=d||S;G(d.16){7[0]=d;7.K=1;I 7}G(1j d=="23"){J c=u.2D(d);G(c&&(c[1]||!b)){G(c[1])d=D.4h([c[1]],b);N{J a=S.61(c[3]);G(a){G(a.2v!=c[3])I D().2q(d);I D(a)}d=[]}}N I D(b).2q(d)}N G(D.1D(d))I D(S)[D.17.27?"27":"43"](d);I 7.6Y(D.2d(d))},5w:"1.2.6",8G:H(){I 7.K},K:0,3p:H(a){I a==12?D.2d(7):7[a]},2I:H(b){J a=D(b);a.5n=7;I a},6Y:H(a){7.K=0;2p.44.1p.1w(7,a);I 7},P:H(a,b){I D.P(7,a,b)},5i:H(b){J a=-1;I D.2L(b&&b.5w?b[0]:b,7)},1K:H(c,a,b){J d=c;G(c.1q==56)G(a===12)I 7[0]&&D[b||"1K"](7[0],c);N{d={};d[c]=a}I 7.P(H(i){R(c 1n d)D.1K(b?7.V:7,c,D.1i(7,d[c],b,i,c))})},1g:H(b,a){G((b==\'2h\'||b==\'1Z\')&&3d(a)<0)a=12;I 7.1K(b,a,"2a")},1r:H(b){G(1j b!="49"&&b!=U)I 7.4E().3v((7[0]&&7[0].2z||S).5F(b));J a="";D.P(b||7,H(){D.P(7.3t,H(){G(7.16!=8)a+=7.16!=1?7.76:D.17.1r([7])})});I a},5z:H(b){G(7[0])D(b,7[0].2z).5y().39(7[0]).2l(H(){J a=7;1B(a.1x)a=a.1x;I a}).3v(7);I 7},8Y:H(a){I 7.P(H(){D(7).6Q().5z(a)})},8R:H(a){I 7.P(H(){D(7).5z(a)})},3v:H(){I 7.3W(19,M,Q,H(a){G(7.16==1)7.3U(a)})},6F:H(){I 7.3W(19,M,M,H(a){G(7.16==1)7.39(a,7.1x)})},6E:H(){I 7.3W(19,Q,Q,H(a){7.1d.39(a,7)})},5q:H(){I 7.3W(19,Q,M,H(a){7.1d.39(a,7.2H)})},3l:H(){I 7.5n||D([])},2q:H(b){J c=D.2l(7,H(a){I D.2q(b,a)});I 7.2I(/[^+>] [^+>]/.11(b)||b.1h("..")>-1?D.4r(c):c)},5y:H(e){J f=7.2l(H(){G(D.14.1f&&!D.4n(7)){J a=7.6o(M),5h=S.3h("1v");5h.3U(a);I D.4h([5h.4H])[0]}N I 7.6o(M)});J d=f.2q("*").5c().P(H(){G(7[E]!=12)7[E]=U});G(e===M)7.2q("*").5c().P(H(i){G(7.16==3)I;J c=D.L(7,"3w");R(J a 1n c)R(J b 1n c[a])D.W.1e(d[i],a,c[a][b],c[a][b].L)});I f},1E:H(b){I 7.2I(D.1D(b)&&D.3C(7,H(a,i){I b.1k(a,i)})||D.3g(b,7))},4Y:H(b){G(b.1q==56)G(62.11(b))I 7.2I(D.3g(b,7,M));N b=D.3g(b,7);J a=b.K&&b[b.K-1]!==12&&!b.16;I 7.1E(H(){I a?D.2L(7,b)<0:7!=b})},1e:H(a){I 7.2I(D.4r(D.2R(7.3p(),1j a==\'23\'?D(a):D.2d(a))))},3F:H(a){I!!a&&D.3g(a,7).K>0},7T:H(a){I 7.3F("."+a)},6e:H(b){G(b==12){G(7.K){J c=7[0];G(D.Y(c,"2A")){J e=c.64,63=[],15=c.15,2V=c.O=="2A-2V";G(e<0)I U;R(J i=2V?e:0,2f=2V?e+1:15.K;i<2f;i++){J d=15[i];G(d.2W){b=D.14.1f&&!d.at.2x.an?d.1r:d.2x;G(2V)I b;63.1p(b)}}I 63}N I(7[0].2x||"").1o(/\\r/g,"")}I 12}G(b.1q==4L)b+=\'\';I 7.P(H(){G(7.16!=1)I;G(b.1q==2p&&/5O|5L/.11(7.O))7.4J=(D.2L(7.2x,b)>=0||D.2L(7.34,b)>=0);N G(D.Y(7,"2A")){J a=D.2d(b);D("9R",7).P(H(){7.2W=(D.2L(7.2x,a)>=0||D.2L(7.1r,a)>=0)});G(!a.K)7.64=-1}N 7.2x=b})},2K:H(a){I a==12?(7[0]?7[0].4H:U):7.4E().3v(a)},7b:H(a){I 7.5q(a).21()},79:H(i){I 7.3s(i,i+1)},3s:H(){I 7.2I(2p.44.3s.1w(7,19))},2l:H(b){I 7.2I(D.2l(7,H(a,i){I b.1k(a,i,a)}))},5c:H(){I 7.1e(7.5n)},L:H(d,b){J a=d.1R(".");a[1]=a[1]?"."+a[1]:"";G(b===12){J c=7.5C("9z"+a[1]+"!",[a[0]]);G(c===12&&7.K)c=D.L(7[0],d);I c===12&&a[1]?7.L(a[0]):c}N I 7.1P("9u"+a[1]+"!",[a[0],b]).P(H(){D.L(7,d,b)})},3b:H(a){I 7.P(H(){D.3b(7,a)})},3W:H(g,f,h,d){J e=7.K>1,3x;I 7.P(H(){G(!3x){3x=D.4h(g,7.2z);G(h)3x.9o()}J b=7;G(f&&D.Y(7,"1T")&&D.Y(3x[0],"4F"))b=7.3H("22")[0]||7.3U(7.2z.3h("22"));J c=D([]);D.P(3x,H(){J a=e?D(7).5y(M)[0]:7;G(D.Y(a,"1m"))c=c.1e(a);N{G(a.16==1)c=c.1e(D("1m",a).21());d.1k(b,a)}});c.P(6T)})}};D.17.5j.44=D.17;H 6T(i,a){G(a.4d)D.3Y({1a:a.4d,31:Q,1O:"1m"});N D.5u(a.1r||a.6O||a.4H||"");G(a.1d)a.1d.37(a)}H 1z(){I+2B 8J}D.1l=D.17.1l=H(){J b=19[0]||{},i=1,K=19.K,4x=Q,15;G(b.1q==8I){4x=b;b=19[1]||{};i=2}G(1j b!="49"&&1j b!="H")b={};G(K==i){b=7;--i}R(;i<K;i++)G((15=19[i])!=U)R(J c 1n 15){J a=b[c],2w=15[c];G(b===2w)6M;G(4x&&2w&&1j 2w=="49"&&!2w.16)b[c]=D.1l(4x,a||(2w.K!=U?[]:{}),2w);N G(2w!==12)b[c]=2w}I b};J E="4M"+1z(),6K=0,5r={},6G=/z-?5i|8B-?8A|1y|6B|8v-?1Z/i,3P=S.3P||{};D.1l({8u:H(a){1b.$=3m$;G(a)1b.4M=w;I D},1D:H(a){I!!a&&1j a!="23"&&!a.Y&&a.1q!=2p&&/^[\\s[]?H/.11(a+"")},4n:H(a){I a.1C&&!a.1c||a.2j&&a.2z&&!a.2z.1c},5u:H(a){a=D.3k(a);G(a){J b=S.3H("6w")[0]||S.1C,1m=S.3h("1m");1m.O="1r/4t";G(D.14.1f)1m.1r=a;N 1m.3U(S.5F(a));b.39(1m,b.1x);b.37(1m)}},Y:H(b,a){I b.Y&&b.Y.2r()==a.2r()},1Y:{},L:H(c,d,b){c=c==1b?5r:c;J a=c[E];G(!a)a=c[E]=++6K;G(d&&!D.1Y[a])D.1Y[a]={};G(b!==12)D.1Y[a][d]=b;I d?D.1Y[a][d]:a},3b:H(c,b){c=c==1b?5r:c;J a=c[E];G(b){G(D.1Y[a]){2U D.1Y[a][b];b="";R(b 1n D.1Y[a])1X;G(!b)D.3b(c)}}N{1U{2U c[E]}1V(e){G(c.5l)c.5l(E)}2U D.1Y[a]}},P:H(d,a,c){J e,i=0,K=d.K;G(c){G(K==12){R(e 1n d)G(a.1w(d[e],c)===Q)1X}N R(;i<K;)G(a.1w(d[i++],c)===Q)1X}N{G(K==12){R(e 1n d)G(a.1k(d[e],e,d[e])===Q)1X}N R(J b=d[0];i<K&&a.1k(b,i,b)!==Q;b=d[++i]){}}I d},1i:H(b,a,c,i,d){G(D.1D(a))a=a.1k(b,i);I a&&a.1q==4L&&c=="2a"&&!6G.11(d)?a+"2X":a},1F:{1e:H(c,b){D.P((b||"").1R(/\\s+/),H(i,a){G(c.16==1&&!D.1F.3T(c.1F,a))c.1F+=(c.1F?" ":"")+a})},21:H(c,b){G(c.16==1)c.1F=b!=12?D.3C(c.1F.1R(/\\s+/),H(a){I!D.1F.3T(b,a)}).6s(" "):""},3T:H(b,a){I D.2L(a,(b.1F||b).6r().1R(/\\s+/))>-1}},6q:H(b,c,a){J e={};R(J d 1n c){e[d]=b.V[d];b.V[d]=c[d]}a.1k(b);R(J d 1n c)b.V[d]=e[d]},1g:H(d,e,c){G(e=="2h"||e=="1Z"){J b,3X={30:"5x",5g:"1G",18:"3I"},35=e=="2h"?["5e","6k"]:["5G","6i"];H 5b(){b=e=="2h"?d.8f:d.8c;J a=0,2C=0;D.P(35,H(){a+=3d(D.2a(d,"57"+7,M))||0;2C+=3d(D.2a(d,"2C"+7+"4b",M))||0});b-=29.83(a+2C)}G(D(d).3F(":4j"))5b();N D.6q(d,3X,5b);I 29.2f(0,b)}I D.2a(d,e,c)},2a:H(f,l,k){J e,V=f.V;H 3E(b){G(!D.14.2k)I Q;J a=3P.54(b,U);I!a||a.52("3E")==""}G(l=="1y"&&D.14.1f){e=D.1K(V,"1y");I e==""?"1":e}G(D.14.2G&&l=="18"){J d=V.50;V.50="0 7Y 7W";V.50=d}G(l.1I(/4i/i))l=y;G(!k&&V&&V[l])e=V[l];N G(3P.54){G(l.1I(/4i/i))l="4i";l=l.1o(/([A-Z])/g,"-$1").3y();J c=3P.54(f,U);G(c&&!3E(f))e=c.52(l);N{J g=[],2E=[],a=f,i=0;R(;a&&3E(a);a=a.1d)2E.6h(a);R(;i<2E.K;i++)G(3E(2E[i])){g[i]=2E[i].V.18;2E[i].V.18="3I"}e=l=="18"&&g[2E.K-1]!=U?"2F":(c&&c.52(l))||"";R(i=0;i<g.K;i++)G(g[i]!=U)2E[i].V.18=g[i]}G(l=="1y"&&e=="")e="1"}N G(f.4g){J h=l.1o(/\\-(\\w)/g,H(a,b){I b.2r()});e=f.4g[l]||f.4g[h];G(!/^\\d+(2X)?$/i.11(e)&&/^\\d/.11(e)){J j=V.1A,66=f.65.1A;f.65.1A=f.4g.1A;V.1A=e||0;e=V.aM+"2X";V.1A=j;f.65.1A=66}}I e},4h:H(l,h){J k=[];h=h||S;G(1j h.3h==\'12\')h=h.2z||h[0]&&h[0].2z||S;D.P(l,H(i,d){G(!d)I;G(d.1q==4L)d+=\'\';G(1j d=="23"){d=d.1o(/(<(\\w+)[^>]*?)\\/>/g,H(b,a,c){I c.1I(/^(aK|4f|7E|aG|4T|7A|aB|3n|az|ay|av)$/i)?b:a+"></"+c+">"});J f=D.3k(d).3y(),1v=h.3h("1v");J e=!f.1h("<au")&&[1,"<2A 7w=\'7w\'>","</2A>"]||!f.1h("<ar")&&[1,"<7v>","</7v>"]||f.1I(/^<(aq|22|am|ak|ai)/)&&[1,"<1T>","</1T>"]||!f.1h("<4F")&&[2,"<1T><22>","</22></1T>"]||(!f.1h("<af")||!f.1h("<ad"))&&[3,"<1T><22><4F>","</4F></22></1T>"]||!f.1h("<7E")&&[2,"<1T><22></22><7q>","</7q></1T>"]||D.14.1f&&[1,"1v<1v>","</1v>"]||[0,"",""];1v.4H=e[1]+d+e[2];1B(e[0]--)1v=1v.5T;G(D.14.1f){J g=!f.1h("<1T")&&f.1h("<22")<0?1v.1x&&1v.1x.3t:e[1]=="<1T>"&&f.1h("<22")<0?1v.3t:[];R(J j=g.K-1;j>=0;--j)G(D.Y(g[j],"22")&&!g[j].3t.K)g[j].1d.37(g[j]);G(/^\\s/.11(d))1v.39(h.5F(d.1I(/^\\s*/)[0]),1v.1x)}d=D.2d(1v.3t)}G(d.K===0&&(!D.Y(d,"3V")&&!D.Y(d,"2A")))I;G(d[0]==12||D.Y(d,"3V")||d.15)k.1p(d);N k=D.2R(k,d)});I k},1K:H(d,f,c){G(!d||d.16==3||d.16==8)I 12;J e=!D.4n(d),40=c!==12,1f=D.14.1f;f=e&&D.3X[f]||f;G(d.2j){J g=/5Q|4d|V/.11(f);G(f=="2W"&&D.14.2k)d.1d.64;G(f 1n d&&e&&!g){G(40){G(f=="O"&&D.Y(d,"4T")&&d.1d)7p"O a3 a1\'t 9V 9U";d[f]=c}G(D.Y(d,"3V")&&d.7i(f))I d.7i(f).76;I d[f]}G(1f&&e&&f=="V")I D.1K(d.V,"9T",c);G(40)d.9Q(f,""+c);J h=1f&&e&&g?d.4G(f,2):d.4G(f);I h===U?12:h}G(1f&&f=="1y"){G(40){d.6B=1;d.1E=(d.1E||"").1o(/7f\\([^)]*\\)/,"")+(3r(c)+\'\'=="9L"?"":"7f(1y="+c*7a+")")}I d.1E&&d.1E.1h("1y=")>=0?(3d(d.1E.1I(/1y=([^)]*)/)[1])/7a)+\'\':""}f=f.1o(/-([a-z])/9H,H(a,b){I b.2r()});G(40)d[f]=c;I d[f]},3k:H(a){I(a||"").1o(/^\\s+|\\s+$/g,"")},2d:H(b){J a=[];G(b!=U){J i=b.K;G(i==U||b.1R||b.4I||b.1k)a[0]=b;N 1B(i)a[--i]=b[i]}I a},2L:H(b,a){R(J i=0,K=a.K;i<K;i++)G(a[i]===b)I i;I-1},2R:H(a,b){J i=0,T,2S=a.K;G(D.14.1f){1B(T=b[i++])G(T.16!=8)a[2S++]=T}N 1B(T=b[i++])a[2S++]=T;I a},4r:H(a){J c=[],2o={};1U{R(J i=0,K=a.K;i<K;i++){J b=D.L(a[i]);G(!2o[b]){2o[b]=M;c.1p(a[i])}}}1V(e){c=a}I c},3C:H(c,a,d){J b=[];R(J i=0,K=c.K;i<K;i++)G(!d!=!a(c[i],i))b.1p(c[i]);I b},2l:H(d,a){J c=[];R(J i=0,K=d.K;i<K;i++){J b=a(d[i],i);G(b!=U)c[c.K]=b}I c.7d.1w([],c)}});J v=9B.9A.3y();D.14={5B:(v.1I(/.+(?:9y|9x|9w|9v)[\\/: ]([\\d.]+)/)||[])[1],2k:/75/.11(v),2G:/2G/.11(v),1f:/1f/.11(v)&&!/2G/.11(v),42:/42/.11(v)&&!/(9s|75)/.11(v)};J y=D.14.1f?"7o":"72";D.1l({71:!D.14.1f||S.70=="6Z",3X:{"R":"9n","9k":"1F","4i":y,72:y,7o:y,9h:"9f",9e:"9d",9b:"99"}});D.P({6W:H(a){I a.1d},97:H(a){I D.4S(a,"1d")},95:H(a){I D.3a(a,2,"2H")},91:H(a){I D.3a(a,2,"4l")},8Z:H(a){I D.4S(a,"2H")},8X:H(a){I D.4S(a,"4l")},8W:H(a){I D.5v(a.1d.1x,a)},8V:H(a){I D.5v(a.1x)},6Q:H(a){I D.Y(a,"8U")?a.8T||a.8S.S:D.2d(a.3t)}},H(c,d){D.17[c]=H(b){J a=D.2l(7,d);G(b&&1j b=="23")a=D.3g(b,a);I 7.2I(D.4r(a))}});D.P({6P:"3v",8Q:"6F",39:"6E",8P:"5q",8O:"7b"},H(c,b){D.17[c]=H(){J a=19;I 7.P(H(){R(J i=0,K=a.K;i<K;i++)D(a[i])[b](7)})}});D.P({8N:H(a){D.1K(7,a,"");G(7.16==1)7.5l(a)},8M:H(a){D.1F.1e(7,a)},8L:H(a){D.1F.21(7,a)},8K:H(a){D.1F[D.1F.3T(7,a)?"21":"1e"](7,a)},21:H(a){G(!a||D.1E(a,[7]).r.K){D("*",7).1e(7).P(H(){D.W.21(7);D.3b(7)});G(7.1d)7.1d.37(7)}},4E:H(){D(">*",7).21();1B(7.1x)7.37(7.1x)}},H(a,b){D.17[a]=H(){I 7.P(b,19)}});D.P(["6N","4b"],H(i,c){J b=c.3y();D.17[b]=H(a){I 7[0]==1b?D.14.2G&&S.1c["5t"+c]||D.14.2k&&1b["5s"+c]||S.70=="6Z"&&S.1C["5t"+c]||S.1c["5t"+c]:7[0]==S?29.2f(29.2f(S.1c["4y"+c],S.1C["4y"+c]),29.2f(S.1c["2i"+c],S.1C["2i"+c])):a==12?(7.K?D.1g(7[0],b):U):7.1g(b,a.1q==56?a:a+"2X")}});H 25(a,b){I a[0]&&3r(D.2a(a[0],b,M),10)||0}J C=D.14.2k&&3r(D.14.5B)<8H?"(?:[\\\\w*3m-]|\\\\\\\\.)":"(?:[\\\\w\\8F-\\8E*3m-]|\\\\\\\\.)",6L=2B 4v("^>\\\\s*("+C+"+)"),6J=2B 4v("^("+C+"+)(#)("+C+"+)"),6I=2B 4v("^([#.]?)("+C+"*)");D.1l({6H:{"":H(a,i,m){I m[2]=="*"||D.Y(a,m[2])},"#":H(a,i,m){I a.4G("2v")==m[2]},":":{8D:H(a,i,m){I i<m[3]-0},8C:H(a,i,m){I i>m[3]-0},3a:H(a,i,m){I m[3]-0==i},79:H(a,i,m){I m[3]-0==i},3o:H(a,i){I i==0},3S:H(a,i,m,r){I i==r.K-1},6D:H(a,i){I i%2==0},6C:H(a,i){I i%2},"3o-4u":H(a){I a.1d.3H("*")[0]==a},"3S-4u":H(a){I D.3a(a.1d.5T,1,"4l")==a},"8z-4u":H(a){I!D.3a(a.1d.5T,2,"4l")},6W:H(a){I a.1x},4E:H(a){I!a.1x},8y:H(a,i,m){I(a.6O||a.8x||D(a).1r()||"").1h(m[3])>=0},4j:H(a){I"1G"!=a.O&&D.1g(a,"18")!="2F"&&D.1g(a,"5g")!="1G"},1G:H(a){I"1G"==a.O||D.1g(a,"18")=="2F"||D.1g(a,"5g")=="1G"},8w:H(a){I!a.3R},3R:H(a){I a.3R},4J:H(a){I a.4J},2W:H(a){I a.2W||D.1K(a,"2W")},1r:H(a){I"1r"==a.O},5O:H(a){I"5O"==a.O},5L:H(a){I"5L"==a.O},5p:H(a){I"5p"==a.O},3Q:H(a){I"3Q"==a.O},5o:H(a){I"5o"==a.O},6A:H(a){I"6A"==a.O},6z:H(a){I"6z"==a.O},2s:H(a){I"2s"==a.O||D.Y(a,"2s")},4T:H(a){I/4T|2A|6y|2s/i.11(a.Y)},3T:H(a,i,m){I D.2q(m[3],a).K},8t:H(a){I/h\\d/i.11(a.Y)},8s:H(a){I D.3C(D.3O,H(b){I a==b.T}).K}}},6x:[/^(\\[) *@?([\\w-]+) *([!*$^~=]*) *(\'?"?)(.*?)\\4 *\\]/,/^(:)([\\w-]+)\\("?\'?(.*?(\\(.*?\\))?[^(]*?)"?\'?\\)/,2B 4v("^([:.#]*)("+C+"+)")],3g:H(a,c,b){J d,1t=[];1B(a&&a!=d){d=a;J f=D.1E(a,c,b);a=f.t.1o(/^\\s*,\\s*/,"");1t=b?c=f.r:D.2R(1t,f.r)}I 1t},2q:H(t,o){G(1j t!="23")I[t];G(o&&o.16!=1&&o.16!=9)I[];o=o||S;J d=[o],2o=[],3S,Y;1B(t&&3S!=t){J r=[];3S=t;t=D.3k(t);J l=Q,3j=6L,m=3j.2D(t);G(m){Y=m[1].2r();R(J i=0;d[i];i++)R(J c=d[i].1x;c;c=c.2H)G(c.16==1&&(Y=="*"||c.Y.2r()==Y))r.1p(c);d=r;t=t.1o(3j,"");G(t.1h(" ")==0)6M;l=M}N{3j=/^([>+~])\\s*(\\w*)/i;G((m=3j.2D(t))!=U){r=[];J k={};Y=m[2].2r();m=m[1];R(J j=0,3i=d.K;j<3i;j++){J n=m=="~"||m=="+"?d[j].2H:d[j].1x;R(;n;n=n.2H)G(n.16==1){J g=D.L(n);G(m=="~"&&k[g])1X;G(!Y||n.Y.2r()==Y){G(m=="~")k[g]=M;r.1p(n)}G(m=="+")1X}}d=r;t=D.3k(t.1o(3j,""));l=M}}G(t&&!l){G(!t.1h(",")){G(o==d[0])d.4s();2o=D.2R(2o,d);r=d=[o];t=" "+t.6v(1,t.K)}N{J h=6J;J m=h.2D(t);G(m){m=[0,m[2],m[3],m[1]]}N{h=6I;m=h.2D(t)}m[2]=m[2].1o(/\\\\/g,"");J f=d[d.K-1];G(m[1]=="#"&&f&&f.61&&!D.4n(f)){J p=f.61(m[2]);G((D.14.1f||D.14.2G)&&p&&1j p.2v=="23"&&p.2v!=m[2])p=D(\'[@2v="\'+m[2]+\'"]\',f)[0];d=r=p&&(!m[3]||D.Y(p,m[3]))?[p]:[]}N{R(J i=0;d[i];i++){J a=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];G(a=="*"&&d[i].Y.3y()=="49")a="3n";r=D.2R(r,d[i].3H(a))}G(m[1]==".")r=D.5m(r,m[2]);G(m[1]=="#"){J e=[];R(J i=0;r[i];i++)G(r[i].4G("2v")==m[2]){e=[r[i]];1X}r=e}d=r}t=t.1o(h,"")}}G(t){J b=D.1E(t,r);d=r=b.r;t=D.3k(b.t)}}G(t)d=[];G(d&&o==d[0])d.4s();2o=D.2R(2o,d);I 2o},5m:H(r,m,a){m=" "+m+" ";J c=[];R(J i=0;r[i];i++){J b=(" "+r[i].1F+" ").1h(m)>=0;G(!a&&b||a&&!b)c.1p(r[i])}I c},1E:H(t,r,h){J d;1B(t&&t!=d){d=t;J p=D.6x,m;R(J i=0;p[i];i++){m=p[i].2D(t);G(m){t=t.8r(m[0].K);m[2]=m[2].1o(/\\\\/g,"");1X}}G(!m)1X;G(m[1]==":"&&m[2]=="4Y")r=62.11(m[3])?D.1E(m[3],r,M).r:D(r).4Y(m[3]);N G(m[1]==".")r=D.5m(r,m[2],h);N G(m[1]=="["){J g=[],O=m[3];R(J i=0,3i=r.K;i<3i;i++){J a=r[i],z=a[D.3X[m[2]]||m[2]];G(z==U||/5Q|4d|2W/.11(m[2]))z=D.1K(a,m[2])||\'\';G((O==""&&!!z||O=="="&&z==m[5]||O=="!="&&z!=m[5]||O=="^="&&z&&!z.1h(m[5])||O=="$="&&z.6v(z.K-m[5].K)==m[5]||(O=="*="||O=="~=")&&z.1h(m[5])>=0)^h)g.1p(a)}r=g}N G(m[1]==":"&&m[2]=="3a-4u"){J e={},g=[],11=/(-?)(\\d*)n((?:\\+|-)?\\d*)/.2D(m[3]=="6D"&&"2n"||m[3]=="6C"&&"2n+1"||!/\\D/.11(m[3])&&"8q+"+m[3]||m[3]),3o=(11[1]+(11[2]||1))-0,d=11[3]-0;R(J i=0,3i=r.K;i<3i;i++){J j=r[i],1d=j.1d,2v=D.L(1d);G(!e[2v]){J c=1;R(J n=1d.1x;n;n=n.2H)G(n.16==1)n.4q=c++;e[2v]=M}J b=Q;G(3o==0){G(j.4q==d)b=M}N G((j.4q-d)%3o==0&&(j.4q-d)/3o>=0)b=M;G(b^h)g.1p(j)}r=g}N{J f=D.6H[m[1]];G(1j f=="49")f=f[m[2]];G(1j f=="23")f=6u("Q||H(a,i){I "+f+";}");r=D.3C(r,H(a,i){I f(a,i,m,r)},h)}}I{r:r,t:t}},4S:H(b,c){J a=[],1t=b[c];1B(1t&&1t!=S){G(1t.16==1)a.1p(1t);1t=1t[c]}I a},3a:H(a,e,c,b){e=e||1;J d=0;R(;a;a=a[c])G(a.16==1&&++d==e)1X;I a},5v:H(n,a){J r=[];R(;n;n=n.2H){G(n.16==1&&n!=a)r.1p(n)}I r}});D.W={1e:H(f,i,g,e){G(f.16==3||f.16==8)I;G(D.14.1f&&f.4I)f=1b;G(!g.24)g.24=7.24++;G(e!=12){J h=g;g=7.3M(h,H(){I h.1w(7,19)});g.L=e}J j=D.L(f,"3w")||D.L(f,"3w",{}),1H=D.L(f,"1H")||D.L(f,"1H",H(){G(1j D!="12"&&!D.W.5k)I D.W.1H.1w(19.3L.T,19)});1H.T=f;D.P(i.1R(/\\s+/),H(c,b){J a=b.1R(".");b=a[0];g.O=a[1];J d=j[b];G(!d){d=j[b]={};G(!D.W.2t[b]||D.W.2t[b].4p.1k(f)===Q){G(f.3K)f.3K(b,1H,Q);N G(f.6t)f.6t("4o"+b,1H)}}d[g.24]=g;D.W.26[b]=M});f=U},24:1,26:{},21:H(e,h,f){G(e.16==3||e.16==8)I;J i=D.L(e,"3w"),1L,5i;G(i){G(h==12||(1j h=="23"&&h.8p(0)=="."))R(J g 1n i)7.21(e,g+(h||""));N{G(h.O){f=h.2y;h=h.O}D.P(h.1R(/\\s+/),H(b,a){J c=a.1R(".");a=c[0];G(i[a]){G(f)2U i[a][f.24];N R(f 1n i[a])G(!c[1]||i[a][f].O==c[1])2U i[a][f];R(1L 1n i[a])1X;G(!1L){G(!D.W.2t[a]||D.W.2t[a].4A.1k(e)===Q){G(e.6p)e.6p(a,D.L(e,"1H"),Q);N G(e.6n)e.6n("4o"+a,D.L(e,"1H"))}1L=U;2U i[a]}}})}R(1L 1n i)1X;G(!1L){J d=D.L(e,"1H");G(d)d.T=U;D.3b(e,"3w");D.3b(e,"1H")}}},1P:H(h,c,f,g,i){c=D.2d(c);G(h.1h("!")>=0){h=h.3s(0,-1);J a=M}G(!f){G(7.26[h])D("*").1e([1b,S]).1P(h,c)}N{G(f.16==3||f.16==8)I 12;J b,1L,17=D.1D(f[h]||U),W=!c[0]||!c[0].32;G(W){c.6h({O:h,2J:f,32:H(){},3J:H(){},4C:1z()});c[0][E]=M}c[0].O=h;G(a)c[0].6m=M;J d=D.L(f,"1H");G(d)b=d.1w(f,c);G((!17||(D.Y(f,\'a\')&&h=="4V"))&&f["4o"+h]&&f["4o"+h].1w(f,c)===Q)b=Q;G(W)c.4s();G(i&&D.1D(i)){1L=i.1w(f,b==U?c:c.7d(b));G(1L!==12)b=1L}G(17&&g!==Q&&b!==Q&&!(D.Y(f,\'a\')&&h=="4V")){7.5k=M;1U{f[h]()}1V(e){}}7.5k=Q}I b},1H:H(b){J a,1L,38,5f,4m;b=19[0]=D.W.6l(b||1b.W);38=b.O.1R(".");b.O=38[0];38=38[1];5f=!38&&!b.6m;4m=(D.L(7,"3w")||{})[b.O];R(J j 1n 4m){J c=4m[j];G(5f||c.O==38){b.2y=c;b.L=c.L;1L=c.1w(7,19);G(a!==Q)a=1L;G(1L===Q){b.32();b.3J()}}}I a},6l:H(b){G(b[E]==M)I b;J d=b;b={8o:d};J c="8n 8m 8l 8k 2s 8j 47 5d 6j 5E 8i L 8h 8g 4K 2y 5a 59 8e 8b 58 6f 8a 88 4k 87 86 84 6d 2J 4C 6c O 82 81 35".1R(" ");R(J i=c.K;i;i--)b[c[i]]=d[c[i]];b[E]=M;b.32=H(){G(d.32)d.32();d.80=Q};b.3J=H(){G(d.3J)d.3J();d.7Z=M};b.4C=b.4C||1z();G(!b.2J)b.2J=b.6d||S;G(b.2J.16==3)b.2J=b.2J.1d;G(!b.4k&&b.4K)b.4k=b.4K==b.2J?b.6c:b.4K;G(b.58==U&&b.5d!=U){J a=S.1C,1c=S.1c;b.58=b.5d+(a&&a.2e||1c&&1c.2e||0)-(a.6b||0);b.6f=b.6j+(a&&a.2c||1c&&1c.2c||0)-(a.6a||0)}G(!b.35&&((b.47||b.47===0)?b.47:b.5a))b.35=b.47||b.5a;G(!b.59&&b.5E)b.59=b.5E;G(!b.35&&b.2s)b.35=(b.2s&1?1:(b.2s&2?3:(b.2s&4?2:0)));I b},3M:H(a,b){b.24=a.24=a.24||b.24||7.24++;I b},2t:{27:{4p:H(){55();I},4A:H(){I}},3D:{4p:H(){G(D.14.1f)I Q;D(7).2O("53",D.W.2t.3D.2y);I M},4A:H(){G(D.14.1f)I Q;D(7).4e("53",D.W.2t.3D.2y);I M},2y:H(a){G(F(a,7))I M;a.O="3D";I D.W.1H.1w(7,19)}},3N:{4p:H(){G(D.14.1f)I Q;D(7).2O("51",D.W.2t.3N.2y);I M},4A:H(){G(D.14.1f)I Q;D(7).4e("51",D.W.2t.3N.2y);I M},2y:H(a){G(F(a,7))I M;a.O="3N";I D.W.1H.1w(7,19)}}}};D.17.1l({2O:H(c,a,b){I c=="4X"?7.2V(c,a,b):7.P(H(){D.W.1e(7,c,b||a,b&&a)})},2V:H(d,b,c){J e=D.W.3M(c||b,H(a){D(7).4e(a,e);I(c||b).1w(7,19)});I 7.P(H(){D.W.1e(7,d,e,c&&b)})},4e:H(a,b){I 7.P(H(){D.W.21(7,a,b)})},1P:H(c,a,b){I 7.P(H(){D.W.1P(c,a,7,M,b)})},5C:H(c,a,b){I 7[0]&&D.W.1P(c,a,7[0],Q,b)},2m:H(b){J c=19,i=1;1B(i<c.K)D.W.3M(b,c[i++]);I 7.4V(D.W.3M(b,H(a){7.4Z=(7.4Z||0)%i;a.32();I c[7.4Z++].1w(7,19)||Q}))},7X:H(a,b){I 7.2O(\'3D\',a).2O(\'3N\',b)},27:H(a){55();G(D.2Q)a.1k(S,D);N D.3A.1p(H(){I a.1k(7,D)});I 7}});D.1l({2Q:Q,3A:[],27:H(){G(!D.2Q){D.2Q=M;G(D.3A){D.P(D.3A,H(){7.1k(S)});D.3A=U}D(S).5C("27")}}});J x=Q;H 55(){G(x)I;x=M;G(S.3K&&!D.14.2G)S.3K("69",D.27,Q);G(D.14.1f&&1b==1S)(H(){G(D.2Q)I;1U{S.1C.7V("1A")}1V(3e){3B(19.3L,0);I}D.27()})();G(D.14.2G)S.3K("69",H(){G(D.2Q)I;R(J i=0;i<S.4W.K;i++)G(S.4W[i].3R){3B(19.3L,0);I}D.27()},Q);G(D.14.2k){J a;(H(){G(D.2Q)I;G(S.3f!="68"&&S.3f!="1J"){3B(19.3L,0);I}G(a===12)a=D("V, 7A[7U=7S]").K;G(S.4W.K!=a){3B(19.3L,0);I}D.27()})()}D.W.1e(1b,"43",D.27)}D.P(("7R,7Q,43,85,4y,4X,4V,7P,"+"7O,7N,89,53,51,7M,2A,"+"5o,7L,7K,8d,3e").1R(","),H(i,b){D.17[b]=H(a){I a?7.2O(b,a):7.1P(b)}});J F=H(a,c){J b=a.4k;1B(b&&b!=c)1U{b=b.1d}1V(3e){b=c}I b==c};D(1b).2O("4X",H(){D("*").1e(S).4e()});D.17.1l({67:D.17.43,43:H(g,d,c){G(1j g!=\'23\')I 7.67(g);J e=g.1h(" ");G(e>=0){J i=g.3s(e,g.K);g=g.3s(0,e)}c=c||H(){};J f="2P";G(d)G(D.1D(d)){c=d;d=U}N{d=D.3n(d);f="6g"}J h=7;D.3Y({1a:g,O:f,1O:"2K",L:d,1J:H(a,b){G(b=="1W"||b=="7J")h.2K(i?D("<1v/>").3v(a.4U.1o(/<1m(.|\\s)*?\\/1m>/g,"")).2q(i):a.4U);h.P(c,[a.4U,b,a])}});I 7},aL:H(){I D.3n(7.7I())},7I:H(){I 7.2l(H(){I D.Y(7,"3V")?D.2d(7.aH):7}).1E(H(){I 7.34&&!7.3R&&(7.4J||/2A|6y/i.11(7.Y)||/1r|1G|3Q/i.11(7.O))}).2l(H(i,c){J b=D(7).6e();I b==U?U:b.1q==2p?D.2l(b,H(a,i){I{34:c.34,2x:a}}):{34:c.34,2x:b}}).3p()}});D.P("7H,7G,7F,7D,7C,7B".1R(","),H(i,o){D.17[o]=H(f){I 7.2O(o,f)}});J B=1z();D.1l({3p:H(d,b,a,c){G(D.1D(b)){a=b;b=U}I D.3Y({O:"2P",1a:d,L:b,1W:a,1O:c})},aE:H(b,a){I D.3p(b,U,a,"1m")},aD:H(c,b,a){I D.3p(c,b,a,"3z")},aC:H(d,b,a,c){G(D.1D(b)){a=b;b={}}I D.3Y({O:"6g",1a:d,L:b,1W:a,1O:c})},aA:H(a){D.1l(D.60,a)},60:{1a:5Z.5Q,26:M,O:"2P",2T:0,7z:"4R/x-ax-3V-aw",7x:M,31:M,L:U,5Y:U,3Q:U,4Q:{2N:"4R/2N, 1r/2N",2K:"1r/2K",1m:"1r/4t, 4R/4t",3z:"4R/3z, 1r/4t",1r:"1r/as",4w:"*/*"}},4z:{},3Y:H(s){s=D.1l(M,s,D.1l(M,{},D.60,s));J g,2Z=/=\\?(&|$)/g,1u,L,O=s.O.2r();G(s.L&&s.7x&&1j s.L!="23")s.L=D.3n(s.L);G(s.1O=="4P"){G(O=="2P"){G(!s.1a.1I(2Z))s.1a+=(s.1a.1I(/\\?/)?"&":"?")+(s.4P||"7u")+"=?"}N G(!s.L||!s.L.1I(2Z))s.L=(s.L?s.L+"&":"")+(s.4P||"7u")+"=?";s.1O="3z"}G(s.1O=="3z"&&(s.L&&s.L.1I(2Z)||s.1a.1I(2Z))){g="4P"+B++;G(s.L)s.L=(s.L+"").1o(2Z,"="+g+"$1");s.1a=s.1a.1o(2Z,"="+g+"$1");s.1O="1m";1b[g]=H(a){L=a;1W();1J();1b[g]=12;1U{2U 1b[g]}1V(e){}G(i)i.37(h)}}G(s.1O=="1m"&&s.1Y==U)s.1Y=Q;G(s.1Y===Q&&O=="2P"){J j=1z();J k=s.1a.1o(/(\\?|&)3m=.*?(&|$)/,"$ap="+j+"$2");s.1a=k+((k==s.1a)?(s.1a.1I(/\\?/)?"&":"?")+"3m="+j:"")}G(s.L&&O=="2P"){s.1a+=(s.1a.1I(/\\?/)?"&":"?")+s.L;s.L=U}G(s.26&&!D.4O++)D.W.1P("7H");J n=/^(?:\\w+:)?\\/\\/([^\\/?#]+)/;G(s.1O=="1m"&&O=="2P"&&n.11(s.1a)&&n.2D(s.1a)[1]!=5Z.al){J i=S.3H("6w")[0];J h=S.3h("1m");h.4d=s.1a;G(s.7t)h.aj=s.7t;G(!g){J l=Q;h.ah=h.ag=H(){G(!l&&(!7.3f||7.3f=="68"||7.3f=="1J")){l=M;1W();1J();i.37(h)}}}i.3U(h);I 12}J m=Q;J c=1b.7s?2B 7s("ae.ac"):2B 7r();G(s.5Y)c.6R(O,s.1a,s.31,s.5Y,s.3Q);N c.6R(O,s.1a,s.31);1U{G(s.L)c.4B("ab-aa",s.7z);G(s.5S)c.4B("a9-5R-a8",D.4z[s.1a]||"a7, a6 a5 a4 5N:5N:5N a2");c.4B("X-9Z-9Y","7r");c.4B("9W",s.1O&&s.4Q[s.1O]?s.4Q[s.1O]+", */*":s.4Q.4w)}1V(e){}G(s.7m&&s.7m(c,s)===Q){s.26&&D.4O--;c.7l();I Q}G(s.26)D.W.1P("7B",[c,s]);J d=H(a){G(!m&&c&&(c.3f==4||a=="2T")){m=M;G(f){7k(f);f=U}1u=a=="2T"&&"2T"||!D.7j(c)&&"3e"||s.5S&&D.7h(c,s.1a)&&"7J"||"1W";G(1u=="1W"){1U{L=D.6X(c,s.1O,s.9S)}1V(e){1u="5J"}}G(1u=="1W"){J b;1U{b=c.5I("7g-5R")}1V(e){}G(s.5S&&b)D.4z[s.1a]=b;G(!g)1W()}N D.5H(s,c,1u);1J();G(s.31)c=U}};G(s.31){J f=4I(d,13);G(s.2T>0)3B(H(){G(c){c.7l();G(!m)d("2T")}},s.2T)}1U{c.9P(s.L)}1V(e){D.5H(s,c,U,e)}G(!s.31)d();H 1W(){G(s.1W)s.1W(L,1u);G(s.26)D.W.1P("7C",[c,s])}H 1J(){G(s.1J)s.1J(c,1u);G(s.26)D.W.1P("7F",[c,s]);G(s.26&&!--D.4O)D.W.1P("7G")}I c},5H:H(s,a,b,e){G(s.3e)s.3e(a,b,e);G(s.26)D.W.1P("7D",[a,s,e])},4O:0,7j:H(a){1U{I!a.1u&&5Z.9O=="5p:"||(a.1u>=7e&&a.1u<9N)||a.1u==7c||a.1u==9K||D.14.2k&&a.1u==12}1V(e){}I Q},7h:H(a,c){1U{J b=a.5I("7g-5R");I a.1u==7c||b==D.4z[c]||D.14.2k&&a.1u==12}1V(e){}I Q},6X:H(a,c,b){J d=a.5I("9J-O"),2N=c=="2N"||!c&&d&&d.1h("2N")>=0,L=2N?a.9I:a.4U;G(2N&&L.1C.2j=="5J")7p"5J";G(b)L=b(L,c);G(c=="1m")D.5u(L);G(c=="3z")L=6u("("+L+")");I L},3n:H(a){J s=[];G(a.1q==2p||a.5w)D.P(a,H(){s.1p(3u(7.34)+"="+3u(7.2x))});N R(J j 1n a)G(a[j]&&a[j].1q==2p)D.P(a[j],H(){s.1p(3u(j)+"="+3u(7))});N s.1p(3u(j)+"="+3u(D.1D(a[j])?a[j]():a[j]));I s.6s("&").1o(/%20/g,"+")}});D.17.1l({1N:H(c,b){I c?7.2g({1Z:"1N",2h:"1N",1y:"1N"},c,b):7.1E(":1G").P(H(){7.V.18=7.5D||"";G(D.1g(7,"18")=="2F"){J a=D("<"+7.2j+" />").6P("1c");7.V.18=a.1g("18");G(7.V.18=="2F")7.V.18="3I";a.21()}}).3l()},1M:H(b,a){I b?7.2g({1Z:"1M",2h:"1M",1y:"1M"},b,a):7.1E(":4j").P(H(){7.5D=7.5D||D.1g(7,"18");7.V.18="2F"}).3l()},78:D.17.2m,2m:H(a,b){I D.1D(a)&&D.1D(b)?7.78.1w(7,19):a?7.2g({1Z:"2m",2h:"2m",1y:"2m"},a,b):7.P(H(){D(7)[D(7).3F(":1G")?"1N":"1M"]()})},9G:H(b,a){I 7.2g({1Z:"1N"},b,a)},9F:H(b,a){I 7.2g({1Z:"1M"},b,a)},9E:H(b,a){I 7.2g({1Z:"2m"},b,a)},9D:H(b,a){I 7.2g({1y:"1N"},b,a)},9M:H(b,a){I 7.2g({1y:"1M"},b,a)},9C:H(c,a,b){I 7.2g({1y:a},c,b)},2g:H(k,j,i,g){J h=D.77(j,i,g);I 7[h.36===Q?"P":"36"](H(){G(7.16!=1)I Q;J f=D.1l({},h),p,1G=D(7).3F(":1G"),46=7;R(p 1n k){G(k[p]=="1M"&&1G||k[p]=="1N"&&!1G)I f.1J.1k(7);G(p=="1Z"||p=="2h"){f.18=D.1g(7,"18");f.33=7.V.33}}G(f.33!=U)7.V.33="1G";f.45=D.1l({},k);D.P(k,H(c,a){J e=2B D.28(46,f,c);G(/2m|1N|1M/.11(a))e[a=="2m"?1G?"1N":"1M":a](k);N{J b=a.6r().1I(/^([+-]=)?([\\d+-.]+)(.*)$/),2b=e.1t(M)||0;G(b){J d=3d(b[2]),2M=b[3]||"2X";G(2M!="2X"){46.V[c]=(d||1)+2M;2b=((d||1)/e.1t(M))*2b;46.V[c]=2b+2M}G(b[1])d=((b[1]=="-="?-1:1)*d)+2b;e.3G(2b,d,2M)}N e.3G(2b,a,"")}});I M})},36:H(a,b){G(D.1D(a)||(a&&a.1q==2p)){b=a;a="28"}G(!a||(1j a=="23"&&!b))I A(7[0],a);I 7.P(H(){G(b.1q==2p)A(7,a,b);N{A(7,a).1p(b);G(A(7,a).K==1)b.1k(7)}})},9X:H(b,c){J a=D.3O;G(b)7.36([]);7.P(H(){R(J i=a.K-1;i>=0;i--)G(a[i].T==7){G(c)a[i](M);a.7n(i,1)}});G(!c)7.5A();I 7}});J A=H(b,c,a){G(b){c=c||"28";J q=D.L(b,c+"36");G(!q||a)q=D.L(b,c+"36",D.2d(a))}I q};D.17.5A=H(a){a=a||"28";I 7.P(H(){J q=A(7,a);q.4s();G(q.K)q[0].1k(7)})};D.1l({77:H(b,a,c){J d=b&&b.1q==a0?b:{1J:c||!c&&a||D.1D(b)&&b,2u:b,41:c&&a||a&&a.1q!=9t&&a};d.2u=(d.2u&&d.2u.1q==4L?d.2u:D.28.5K[d.2u])||D.28.5K.74;d.5M=d.1J;d.1J=H(){G(d.36!==Q)D(7).5A();G(D.1D(d.5M))d.5M.1k(7)};I d},41:{73:H(p,n,b,a){I b+a*p},5P:H(p,n,b,a){I((-29.9r(p*29.9q)/2)+0.5)*a+b}},3O:[],48:U,28:H(b,c,a){7.15=c;7.T=b;7.1i=a;G(!c.3Z)c.3Z={}}});D.28.44={4D:H(){G(7.15.2Y)7.15.2Y.1k(7.T,7.1z,7);(D.28.2Y[7.1i]||D.28.2Y.4w)(7);G(7.1i=="1Z"||7.1i=="2h")7.T.V.18="3I"},1t:H(a){G(7.T[7.1i]!=U&&7.T.V[7.1i]==U)I 7.T[7.1i];J r=3d(D.1g(7.T,7.1i,a));I r&&r>-9p?r:3d(D.2a(7.T,7.1i))||0},3G:H(c,b,d){7.5V=1z();7.2b=c;7.3l=b;7.2M=d||7.2M||"2X";7.1z=7.2b;7.2S=7.4N=0;7.4D();J e=7;H t(a){I e.2Y(a)}t.T=7.T;D.3O.1p(t);G(D.48==U){D.48=4I(H(){J a=D.3O;R(J i=0;i<a.K;i++)G(!a[i]())a.7n(i--,1);G(!a.K){7k(D.48);D.48=U}},13)}},1N:H(){7.15.3Z[7.1i]=D.1K(7.T.V,7.1i);7.15.1N=M;7.3G(0,7.1t());G(7.1i=="2h"||7.1i=="1Z")7.T.V[7.1i]="9m";D(7.T).1N()},1M:H(){7.15.3Z[7.1i]=D.1K(7.T.V,7.1i);7.15.1M=M;7.3G(7.1t(),0)},2Y:H(a){J t=1z();G(a||t>7.15.2u+7.5V){7.1z=7.3l;7.2S=7.4N=1;7.4D();7.15.45[7.1i]=M;J b=M;R(J i 1n 7.15.45)G(7.15.45[i]!==M)b=Q;G(b){G(7.15.18!=U){7.T.V.33=7.15.33;7.T.V.18=7.15.18;G(D.1g(7.T,"18")=="2F")7.T.V.18="3I"}G(7.15.1M)7.T.V.18="2F";G(7.15.1M||7.15.1N)R(J p 1n 7.15.45)D.1K(7.T.V,p,7.15.3Z[p])}G(b)7.15.1J.1k(7.T);I Q}N{J n=t-7.5V;7.4N=n/7.15.2u;7.2S=D.41[7.15.41||(D.41.5P?"5P":"73")](7.4N,n,0,1,7.15.2u);7.1z=7.2b+((7.3l-7.2b)*7.2S);7.4D()}I M}};D.1l(D.28,{5K:{9l:9j,9i:7e,74:9g},2Y:{2e:H(a){a.T.2e=a.1z},2c:H(a){a.T.2c=a.1z},1y:H(a){D.1K(a.T.V,"1y",a.1z)},4w:H(a){a.T.V[a.1i]=a.1z+a.2M}}});D.17.2i=H(){J b=0,1S=0,T=7[0],3q;G(T)ao(D.14){J d=T.1d,4a=T,1s=T.1s,1Q=T.2z,5U=2k&&3r(5B)<9c&&!/9a/i.11(v),1g=D.2a,3c=1g(T,"30")=="3c";G(T.7y){J c=T.7y();1e(c.1A+29.2f(1Q.1C.2e,1Q.1c.2e),c.1S+29.2f(1Q.1C.2c,1Q.1c.2c));1e(-1Q.1C.6b,-1Q.1C.6a)}N{1e(T.5X,T.5W);1B(1s){1e(1s.5X,1s.5W);G(42&&!/^t(98|d|h)$/i.11(1s.2j)||2k&&!5U)2C(1s);G(!3c&&1g(1s,"30")=="3c")3c=M;4a=/^1c$/i.11(1s.2j)?4a:1s;1s=1s.1s}1B(d&&d.2j&&!/^1c|2K$/i.11(d.2j)){G(!/^96|1T.*$/i.11(1g(d,"18")))1e(-d.2e,-d.2c);G(42&&1g(d,"33")!="4j")2C(d);d=d.1d}G((5U&&(3c||1g(4a,"30")=="5x"))||(42&&1g(4a,"30")!="5x"))1e(-1Q.1c.5X,-1Q.1c.5W);G(3c)1e(29.2f(1Q.1C.2e,1Q.1c.2e),29.2f(1Q.1C.2c,1Q.1c.2c))}3q={1S:1S,1A:b}}H 2C(a){1e(D.2a(a,"6V",M),D.2a(a,"6U",M))}H 1e(l,t){b+=3r(l,10)||0;1S+=3r(t,10)||0}I 3q};D.17.1l({30:H(){J a=0,1S=0,3q;G(7[0]){J b=7.1s(),2i=7.2i(),4c=/^1c|2K$/i.11(b[0].2j)?{1S:0,1A:0}:b.2i();2i.1S-=25(7,\'94\');2i.1A-=25(7,\'aF\');4c.1S+=25(b,\'6U\');4c.1A+=25(b,\'6V\');3q={1S:2i.1S-4c.1S,1A:2i.1A-4c.1A}}I 3q},1s:H(){J a=7[0].1s;1B(a&&(!/^1c|2K$/i.11(a.2j)&&D.1g(a,\'30\')==\'93\'))a=a.1s;I D(a)}});D.P([\'5e\',\'5G\'],H(i,b){J c=\'4y\'+b;D.17[c]=H(a){G(!7[0])I;I a!=12?7.P(H(){7==1b||7==S?1b.92(!i?a:D(1b).2e(),i?a:D(1b).2c()):7[c]=a}):7[0]==1b||7[0]==S?46[i?\'aI\':\'aJ\']||D.71&&S.1C[c]||S.1c[c]:7[0][c]}});D.P(["6N","4b"],H(i,b){J c=i?"5e":"5G",4f=i?"6k":"6i";D.17["5s"+b]=H(){I 7[b.3y()]()+25(7,"57"+c)+25(7,"57"+4f)};D.17["90"+b]=H(a){I 7["5s"+b]()+25(7,"2C"+c+"4b")+25(7,"2C"+4f+"4b")+(a?25(7,"6S"+c)+25(7,"6S"+4f):0)}})})();',62,669,'|||||||this|||||||||||||||||||||||||||||||||||if|function|return|var|length|data|true|else|type|each|false|for|document|elem|null|style|event||nodeName|||test|undefined||browser|options|nodeType|fn|display|arguments|url|window|body|parentNode|add|msie|css|indexOf|prop|typeof|call|extend|script|in|replace|push|constructor|text|offsetParent|cur|status|div|apply|firstChild|opacity|now|left|while|documentElement|isFunction|filter|className|hidden|handle|match|complete|attr|ret|hide|show|dataType|trigger|doc|split|top|table|try|catch|success|break|cache|height||remove|tbody|string|guid|num|global|ready|fx|Math|curCSS|start|scrollTop|makeArray|scrollLeft|max|animate|width|offset|tagName|safari|map|toggle||done|Array|find|toUpperCase|button|special|duration|id|copy|value|handler|ownerDocument|select|new|border|exec|stack|none|opera|nextSibling|pushStack|target|html|inArray|unit|xml|bind|GET|isReady|merge|pos|timeout|delete|one|selected|px|step|jsre|position|async|preventDefault|overflow|name|which|queue|removeChild|namespace|insertBefore|nth|removeData|fixed|parseFloat|error|readyState|multiFilter|createElement|rl|re|trim|end|_|param|first|get|results|parseInt|slice|childNodes|encodeURIComponent|append|events|elems|toLowerCase|json|readyList|setTimeout|grep|mouseenter|color|is|custom|getElementsByTagName|block|stopPropagation|addEventListener|callee|proxy|mouseleave|timers|defaultView|password|disabled|last|has|appendChild|form|domManip|props|ajax|orig|set|easing|mozilla|load|prototype|curAnim|self|charCode|timerId|object|offsetChild|Width|parentOffset|src|unbind|br|currentStyle|clean|float|visible|relatedTarget|previousSibling|handlers|isXMLDoc|on|setup|nodeIndex|unique|shift|javascript|child|RegExp|_default|deep|scroll|lastModified|teardown|setRequestHeader|timeStamp|update|empty|tr|getAttribute|innerHTML|setInterval|checked|fromElement|Number|jQuery|state|active|jsonp|accepts|application|dir|input|responseText|click|styleSheets|unload|not|lastToggle|outline|mouseout|getPropertyValue|mouseover|getComputedStyle|bindReady|String|padding|pageX|metaKey|keyCode|getWH|andSelf|clientX|Left|all|visibility|container|index|init|triggered|removeAttribute|classFilter|prevObject|submit|file|after|windowData|inner|client|globalEval|sibling|jquery|absolute|clone|wrapAll|dequeue|version|triggerHandler|oldblock|ctrlKey|createTextNode|Top|handleError|getResponseHeader|parsererror|speeds|checkbox|old|00|radio|swing|href|Modified|ifModified|lastChild|safari2|startTime|offsetTop|offsetLeft|username|location|ajaxSettings|getElementById|isSimple|values|selectedIndex|runtimeStyle|rsLeft|_load|loaded|DOMContentLoaded|clientTop|clientLeft|toElement|srcElement|val|pageY|POST|unshift|Bottom|clientY|Right|fix|exclusive|detachEvent|cloneNode|removeEventListener|swap|toString|join|attachEvent|eval|substr|head|parse|textarea|reset|image|zoom|odd|even|before|prepend|exclude|expr|quickClass|quickID|uuid|quickChild|continue|Height|textContent|appendTo|contents|open|margin|evalScript|borderTopWidth|borderLeftWidth|parent|httpData|setArray|CSS1Compat|compatMode|boxModel|cssFloat|linear|def|webkit|nodeValue|speed|_toggle|eq|100|replaceWith|304|concat|200|alpha|Last|httpNotModified|getAttributeNode|httpSuccess|clearInterval|abort|beforeSend|splice|styleFloat|throw|colgroup|XMLHttpRequest|ActiveXObject|scriptCharset|callback|fieldset|multiple|processData|getBoundingClientRect|contentType|link|ajaxSend|ajaxSuccess|ajaxError|col|ajaxComplete|ajaxStop|ajaxStart|serializeArray|notmodified|keypress|keydown|change|mouseup|mousedown|dblclick|focus|blur|stylesheet|hasClass|rel|doScroll|black|hover|solid|cancelBubble|returnValue|wheelDelta|view|round|shiftKey|resize|screenY|screenX|relatedNode|mousemove|prevValue|originalTarget|offsetHeight|keyup|newValue|offsetWidth|eventPhase|detail|currentTarget|cancelable|bubbles|attrName|attrChange|altKey|originalEvent|charAt|0n|substring|animated|header|noConflict|line|enabled|innerText|contains|only|weight|font|gt|lt|uFFFF|u0128|size|417|Boolean|Date|toggleClass|removeClass|addClass|removeAttr|replaceAll|insertAfter|prependTo|wrap|contentWindow|contentDocument|iframe|children|siblings|prevAll|wrapInner|nextAll|outer|prev|scrollTo|static|marginTop|next|inline|parents|able|cellSpacing|adobeair|cellspacing|522|maxLength|maxlength|readOnly|400|readonly|fast|600|class|slow|1px|htmlFor|reverse|10000|PI|cos|compatible|Function|setData|ie|ra|it|rv|getData|userAgent|navigator|fadeTo|fadeIn|slideToggle|slideUp|slideDown|ig|responseXML|content|1223|NaN|fadeOut|300|protocol|send|setAttribute|option|dataFilter|cssText|changed|be|Accept|stop|With|Requested|Object|can|GMT|property|1970|Jan|01|Thu|Since|If|Type|Content|XMLHTTP|th|Microsoft|td|onreadystatechange|onload|cap|charset|colg|host|tfoot|specified|with|1_|thead|leg|plain|attributes|opt|embed|urlencoded|www|area|hr|ajaxSetup|meta|post|getJSON|getScript|marginLeft|img|elements|pageYOffset|pageXOffset|abbr|serialize|pixelLeft'.split('|'),0,{}))/*
 * 	Copyright Statement
 *
 *	(C) 2007-2008. All rights reserved. The WikiProfessional Consortium.
 *
 *	All content WikiProfessional websites, including the source code, images and text files,
 *	is property of the WikiProfessional Consortium or is licensed to the WikiProfessional
 *	Consortium. The content may be protected by copyright and other restrictions as well.
 *
 *	The WikiProfessional Consortium permits the copying, downloading, or other use of
 *	any protected materials only for the purposes of fair use in the manner described at
 *  http://wikify.wikiprofessional.org/copyright.htm, or, in the case of commercial use,
 *  with the express, written permission of the WikiProfessional Consortium.
 */


// o = order in source popdown menu
// g = group
// l = label
// u = url (

var SourceInfo = [
//{'g':'Other:','o':1,'l':'Portal','u':PORTAL,'i':-1},
{'g':'','o':-1,'l':'','u':'','c':'IsPortalPage','p':'ProcessPortalPage','i':39},
{'g':'Literature:','o':5,'l':'Wikipedia','u':'http://en.wikipedia.org/wiki/Main_Page','i':2,'c':'IsWikipediaURL','p':'ProcessWikipedia'},
{'g':'Literature:','o':2,'l':'PubMed','u':'http://www.ncbi.nlm.nih.gov/sites/entrez','i':8,'c':'IsSearchResultPubMedPage','p':'ProcessSearchResultPubMedPage'},
{'g':'Search Engines:','o':7,'l':'Google Patents','u':'http://www.google.com/patents','i':13,'c':'IsGooglePatentsPage','p':'ProcessGooglePatentsResultPage'},
{'g':'Search Engines:','o':6,'l':'Google','u':'http://www.google.com/ncr','i':10,'c':'IsGooglePage','p':'ProcessGoogleResultPage'},
{'g':'Search Engines:','o':9,'l':'Yahoo','u':'http://search.yahoo.com','i':15,'c':'IsYahooPage','p':'ProcessYahooResultPage'},
{'g':'Search Engines:','o':-1,'i':29,'c':'IsYahooDir','p':'ProcessYahooDirPage'},
{'g':'Search Engines:','o':8,'l':'Scholar Google','u':'http://scholar.google.com/','i':11,'c':'IsGoogleScholarPage','p':'ProcessGoogleScholarResultPage'},
{'l':'','u':'','o':-1,'i':3,'c':'IsAbstractPlusPubMedURL','p':'ProcessPubMedAbstract'},
{'g':'Literature:','o':3,'l':'BioMedCentral','u':'http://www.biomedcentral.com','i':7,'c':'IsBioMedCentralFrontPage','p':'ProcessBioMedCentralFrontPage'},
{'l':'','u':'','o':-1,'i':17,'c':'IsBioMedCentralSearchURL','p':'ProcessBioMedCentralSearchPage'},
{'l':'','u':'','o':-1,'i':5,'c':'IsBioMedCentralURL','p':'ProcessBioMedCentralJournalPage'},
{'l':'','u':'','o':-1,'i':9,'c':'IsSwissProtSearchResultPage','p':'ProcessSwissProtSearchResultPage'},
{'g':'Literature:','o':4,'l':'UniProt','u':'http://www.uniprot.org/','i':6,'c':'IsSwissProt','p':'ProcessSwissProtProteinPage'},
{'g':'Literature:','o':11,'l':'EUR Pub Repository','u':'http://repub.eur.nl/publications/','i':12,'c':'IsEurRepos','p':'ProcessEurReposPage'},
{'g':'Literature:','o':10,'l':'WikiProfessional','u':'http://proteins.wikiprofessional.org','i':16,'c':'IsWikiProtein','p':'ProcessWikiProteinPage'},
{'g':'Literature:','o':26,'l':'CiteULike','u':'http://www.citeulike.org','i':22,'c':'IsCiteULike','p':'ProcessCiteULike'},
{'g':'Literature:','o':27,'l':'Springer Link','u':'http://www.springerlink.com','i':27,'c':'IsSpringerLink','p':'ProcessSpringerLink'},
//{'g':'Literature:','o':27,'l':'Springer Link','u':'http://springer.minednow.com','i':27,'c':IsSpringerLink,'p':ProcessSpringerLink},
//{'g':'Other:','o':12,'l':'Linker home','u':LANDINGPAGE,'i':-1},
//{'g':'Other:','o':13,'l':'Linker plugin','u':LANDINGPAGE,'i':-1},
{'g':'Patient societies:','o':18,'l':'Duchenne Community','u':'http://www.duchenne-community.com','i':26,'c':'IsDuchenneCommunity','p':'ProcessDuchenneCommunity'},
//{'g':'Other:','o':19,'l':'World Health Organization','u':'http://www.who.int/en/','i':23,'c':IsWhoHomePage,'p':ProcessWhoHomePage},
//{'g':'Other:','o':28,'l':'Double Link','u':'http://www.minednow.com/bmc/doublelink.htm','i':-1},
//{'g':'Other:','o':28,'l':'Sieve','u':'http://www.minednow.com','i':28,'c':IsSievePage,'p':ProcessSievePage},
//{'g':'Other:','o':-1,'i':24,'c':IsWhoPublicationPage,'p':ProcessWhoPublicationPage},
//{'g':'Other:','o':-1,'i':25,'c':IsWhoSearchResultPage,'p':ProcessWhoSearchResultPage},
{'g':'Grants/proposals:','o':14,'l':'CRISP','u':'http://report.nih.gov/CRISP.aspx','i':20,'c':'IsCRISP','p':'ProcessCRISPPage'},
{'g':'Grants/proposals:','o':-1,'l':'NIH Grants & Contracts','u':'http://grants.nih.gov/grants/guide/index.html','i':21,'c':'IsNIHGrant','p':'ProcessNIHGrant'},
//{'g':'Other:','o':16,'l':'Genome Biology Article','u':'http://www.minednow.com/bmc/monsarticle.htm','i':-2},
//{'g':'Other:','o':41,'l':'Test2','u':'http://www.minednow.com/bmc/testerik.htm','c':IsTestPage,'p':ProcessTestPage,'i':41},
//{'g':'Other:','o':14,'l':'Association tool','u':'http://www.minednow.com/minedit/however.htm','i':-1},
{'g':'Other:','o':-1,'l':'Research CrossRoads (scientists)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=125&Itemid=2','i':30,'c':'IsResearchCrossRoadsScientists','p':'ProcessResearchCrossRoadsScientists'},
{'g':'Other:','o':-1,'l':'Research CrossRoads (organizations)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=126&Itemid=63','i':31,'c':'IsResearchCrossRoadsOrganizations','p':'ProcessResearchCrossRoadsOrganizations'},
{'g':'Grants/proposals:','o':-1,'l':'Research CrossRoads (grants)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=127&Itemid=64','i':32,'c':'IsResearchCrossRoadsGrants','p':'ProcessResearchCrossRoadsGrants'},
{'g':'Grants/proposals:','o':-1,'l':'Research CrossRoads (funding)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=205&Itemid=68','i':33,'c':'IsResearchCrossRoadsFunding','p':'ProcessResearchCrossRoadsFunding'},
{'g':'Grants/proposals:','o':34,'l':'Research CrossRoads','u':'http://www.researchcrossroads.org/','i':34,'c':'IsResearchCrossRoadsClinicalTrials','p':'ProcessResearchCrossRoadsClinicalTrials'},
{'g':'Test:','o':35,'l':'test page','u':'http://www.minednow.com/mineditdevelop/test.htm','i':-2},
//{'g':'Test:','o':36,'l':'Research CrossRoads (test clinical trial)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=128&Itemid=65&trial_id=NCT00317629','i':-2},
//{'g':'Test:','o':37,'l':'Research CrossRoads (test clinical funding)','u':'http://www.researchcrossroads.org/index.php?option=com_content&view=article&id=204&Itemid=68&oppty_id=220577','i':-2},
//{'g':'Test:','o':38,'l':'Research CrossRoads (test clinical grants)','u':'http://www.researchcrossroads.org/index.php?view=article&id=50%3Agrant-details&option=com_content&Itemid=37&grant_id=3429014','i':-2},
//{'g':'Test:','o':39,'l':'New Portal Page','u':'http://wikify.minednow.com/test.html','c':IsPortalPage,'p':ProcessPortalPage,'i':39},
//{'g':'Test:','o':40,'l':'New Text','u':'http://www.minednow.com/mineditdevelop/newpage.html','i':-2},
{'g':'Bireme/Scielo:','o':-1,'l':'VHL - Scientific and Technical Literature','u':'http://pesquisa.bvsalud.org/regional/','c':'IsVHLHomePage','p':'ProcessVHLHomePage','i':41},
{'g':'Bireme/Scielo:','o':-1,'l':'VHL - Scientific and Technical Literature','u':'http://pesquisa.bvsalud.org/regional/','c':'IsVHL','p':'ProcessVHL','i':42},
{'g':'Bireme/Scielo:','o':-1,'l':'GHL - Scientific and Technical Literature','u':'http://pesquisa.bvsalud.org/ghl','c':'IsGHLHomePage','p':'ProcessGHLHomePage','i':43},
{'g':'Bireme/Scielo:','o':-1,'l':'GHL - Scientific and Technical Literature','u':'http://pesquisa.bvsalud.org/ghl','c':'IsGHL','p':'ProcessGHL','i':44},
{'g':'Bireme/Scielo:','o':-1,'l':'Evidence Portal','u':'http://evidences.bvsalud.org/modules/dia/','c':'IsEvidencePortalHomePage','p':'ProcessEvidencePortalHomePage','i':45},
{'g':'Bireme/Scielo:','o':-1,'l':'Programa Nacional de Telessa&#0250;de','u':'http://pesquisa.bvsalud.org/telessaude/','c':'IsTelehealthPortalHomePage','p':'ProcessTelehealthPortalHomePage','i':46},
{'g':'Bireme/Scielo:','o':-1,'l':'Scientific Literature on Infectious Diseases Related to TropIKA.net','u':'http://tropika.globalhealthlibrary.net/modules/dia/index.php','c':'IsInfectiousDiseasesPortalHomePage','p':'ProcessInfectiousDiseasesPortalHomePage','i':47},
{'g':'Bireme/Scielo:','o':-1,'l':'Virtual Campus of Public Health','u':'http://pesquisa.bvsalud.org/cvsp/index.php','c':'IsVirtualCampusPortalHomePage','p':'ProcessVirtualCampusPortalHomePage','i':48},
{'g':'Bireme/Scielo:','o':-1,'l':'Scielo','u':'http://www.scielo.br/scielo.php','c':'IsScieloEnglishPage','p':'ProcessScieloEnglishPage','i':49},
{'g':'Bireme/Scielo:','o':-1,'l':'Scienceblog','u':'http://scienceblogs.com/gnxp/','c':'IsSienceblogPage','p':'ProcessSienceblogPage','i':50},
{'g':'Search Engines:','o':51,'l':'ConceptWeb','u':'http://spaces.wikiprofessional.com','i':51,'c':'IsConceptWebPage','p':'ProcessConceptWebPage'},
{'g':'Literature:','o':-1,'l':'PloS One','u':'http://www.plosone.org/','c':'IsPloSOnePage','p':'ProcessPloSOnePage','i':52},
];

linker.addModule("transport", function(linker) {
    if ("object" != typeof linker.transport)
        linker.transport = {};

    var transport = linker.transport;


    linker.extend(transport, {
        NAME:           "Linker Transportation Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(transport, {
        optStack:       [],
        callbackCount:  0
    });


    linker.extend(transport, {
        init: function() {
            jQuery.ajaxSetup({
                timeout: 10000,
                error: transport.errorHandler,
                global: false
            });
        },
        optPush: function(opts) {
            transport.optStack[transport.optStack.length] = opts;
        },
        optPop: function() {
            if (0 === transport.optStack.lenght)
                return;

            transport.optStack.splice(transport.optStack.length-1, 1);
        },
        wrapCall: function(opts, code) {
            transport.optPush(opts);
            try {
                code();
            } finally {
                transport.optPop();
            }
        },
        errorHandler: function(request, status, error) {
            linker.log.debug("Communication error with server", error);
            alert("Communication error with server");
        },
        makeCall: function(url, method, callback, data, opts) {
            function extend(dest, src) {
                for (var key in src) {
                    if ("undefined" == dest[key]) {
                        dest[key] = src[key];
                    } else if (src[key] instanceof Function) {
                        if (dest[key] instanceof Array)
                            dest[key][dest[key].length] = src[key];
                        else
                            dest[key] = [dest[key], src[key]];
                    } else if (("object" == typeof src[key]) && ("object" == typeof dest[key]) && (null !== dest[key])) {
                        linker.extend(dest[key], src[key], true);
                    } else {
                        dest[key] = src[key];
                    }
                }
            }

            var obj = {
                type: "GET",
                data: null
            };

            for (var i=0; i<transport.optStack.length; ++i)
                extend(obj, transport.optStack[i]);

            extend(obj, {
                url: url
            });

            if (callback) {
                extend(obj, {
                success: callback
                });
            }

            if (method) {
                extend(obj, {
                    type: method.toUpperCase()
                });
            }

            if (data) {
                extend(obj, {
                    data: data
                });
            }

            extend(obj, opts || {});

            function wrap(list) {
                return function() {
                    for (var i=0; i<list.length; ++i) {
                        try {
                            list[i].apply(this, arguments);
                        } catch(e) {
                        }
                    }
                };
            }

            if (obj.beforeSend && !(obj.beforeSend instanceof Function))
                obj.beforeSend = wrap(obj.beforeSend);
            if (obj.complete && !(obj.complete instanceof Function))
                obj.complete = wrap(obj.complete);
            if (obj.error && !(obj.error instanceof Function))
                obj.error = wrap(obj.error);
            if (obj.success && !(obj.success instanceof Function))
                obj.success = wrap(obj.success);

            jQuery.ajax(obj);
        },
        callServer: function(url, method, callback, data, opts) {
            url = url.replace(/^\/+/, '');

            if (url.match(/cross-domain/)) {
                transport.callbackCount++;
                var name = "linker_callback_" + transport.callbackCount;

                var cb = callback;
                callback = undefined;

                window[name] = function() {
                    cb.apply(transport, arguments);
                };

                data = data || {};
                data.callback = name;

                opts = opts || {};

                var old_complete = null;
                if (opts.complete)
                    old_complete = opts.complete;

                linker.extend(opts, {
                    dataType: "script",
                    complete: function(request, status) {
                        delete window[name];
                        if (old_complete)
                            old_complete.apply(this, arguments);
                    }
                }, true);
            }

            if ("undefined" == typeof BUTTONAPPLICATION)
                url = HOST + "/" + url;
            else
                url = BUTTONAPPLICATION + url;

            transport.makeCall(url, method, callback, data, opts);
        },
        getIndex: function(text, callback, id) {
            transport.callServer("index2.py", "POST", function(data, status) { callback(id, data); }, "<id>" + id + "</id>" + text);
        },
        getDefinition: function(id, callback) {
            transport.callServer("get.py?" + WIKIHOST + "/index.php?title=Special:ConceptAsXML&id=" + id, "GET", callback);
        },
        getRelatedAuthors: function(list, callback) {
            transport.callServer("cross-domain/getauthors/getauthors.js", "GET", callback, {
                list: list
            });
        },
        getRelatedPublications: function(list, callback) {
            transport.callServer("cross-domain/getpublications/getpublications.js", "GET", callback, {
                list: list
            });
        },
        getBooks: function(keywords, publisher, callback) {
            var url = "books.py?Keywords=" + keywords;
            if (publisher)
                url += "&Publisher=" + publisher;

            transport.callServer(url, "GET", function(data, status) {
                if ("string" == typeof data)
                    data = eval("(" + data + ")");
                callback(data);
            });
        }
    });
});
linker.addModule("browser", function(linker) {
    if ("object" != typeof linker.browser)
        linker.browser = {};

    var browser = linker.browser;


    linker.extend(browser, {
        NAME:           "Linker Browser Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(browser, (function() {
        var BrowserDetect = {
            init: function () {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent)
                    || this.searchVersion(navigator.appVersion)
                    || "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
            },
            searchString: function (data) {
                for (var i=0;i<data.length;i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
            },
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {   string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {       // for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {       // for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS : [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ]

        };

        BrowserDetect.init();

        var browser = {
            name:       BrowserDetect.browser,
            version:    BrowserDetect.version,
            os:         BrowserDetect.OS,

            is_ie:      BrowserDetect.browser === "Explorer",
            is_ff:      BrowserDetect.browser === "Firefox",
            is_opera:   BrowserDetect.browser === "Opera",
            is_safari:  BrowserDetect.browser === "Safari",
            is_chrome:  BrowserDetect.browser === "Chrome",
            is_konq:    BrowserDetect.browser === "Konqueror"
        };

        browser.is_khtml = browser.is_safari || browser.is_chrome || browser.is_konq;
        browser.is_gecko = !browser.is_khtml && navigator.product && (navigator.product.toLowerCase() === "gecko");

        browser.is_ie6 = browser.is_ie && (parseInt(browser.version) === 6);
        browser.is_ie7 = browser.is_ie && (parseInt(browser.version) === 7);

        browser.is_ff2 = browser.is_ff && (parseInt(browser.version) === 2);
        browser.is_ff3 = browser.is_ff && (parseInt(browser.version) === 3);

        browser.is_mac = browser.os == "Mac";

        browser.has_events = linker.base.document.implementation.hasFeature("Events", "2.0");

        return browser;
    })());
});
linker.addModule("utils", ["browser"], function(linker) {
    if ("object" != typeof linker.utils)
        linker.utils = {};

    var utils = linker.utils;


    linker.extend(utils, {
        NAME:           "Linker Utilites Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    // event handling
    if (linker.browser.has_events) {
        linker.extend(utils, {
            addEvent: function(element, type, listener) {
                if (null === element)
                    return false;

                element.addEventListener(type, listener, true);
                return true;
            },
            removeEvent: function(element, type, listener) {
                if (null === element)
                    return false;

                element.removeEventListener(type, listener, true);
                return true;
            },
            fireEvent: function(element, type) {
                if (null === element)
                    return false;

                var event = element.ownerDocument.createEvent("MouseEvents");
                event.initEvent(element, true, true);
                return element.dispatchEvent(event);
            }
        }, true);
    } else {
        linker.extend(utils, (function() {
            var wrappersCache = {};

            // make event objects more standard like
            function fixEvent(event) {

                if ("undefined" == typeof event.bubbles)
                    event.bubbles = true;

                if ("undefined" == typeof event.cancelable)
                    event.cancelable = true;

                if ("undefined" == typeof event.target) {
                    if ("undefined" == typeof event.srcElement) {
                        event.target = null;
                    } else {
                        event.target = event.srcElement;
                    }

                    if ((null !== event.target) && (3 == event.target.nodeType))
                        event.target = event.target.parentNode;
                }

                if (!event.stopPropagation) {
                    event.stopPropagation = function() {
                        event.cancelBubble = true;
                    };
                }

                if (!event.preventDefault) {
                    event.preventDefault = function() {
                        event.returnValue = false;
                    };
                }
            }

            // create wrapper for event listener
            function createWrapper(element, listener) {
                if ("undefined" == typeof wrappersCache[listener]) {
                    wrappersCache[listener] = function(event) {

                        if (undefined === event) {
                            if ("undefined" == typeof base.event)
                                return false;

                            event = base.event;
                        }

                        fixEvent(event);
                        listener.call(element, event);
                    };
                }

                return wrappersCache[listener];
            }

            return {
                addEvent: function(element, type, listener) {
                    var wrapper = createWrapper(element, listener);

                    if (element.attachEvent) {
                        return element.attachEvent("on" + type, wrapper);
                    } else if (element.addEventListener) {
                        element.addEventListener(type, wrapper, true);
                        return true;
                    }

                    return false;
                },
                removeEvent: function(element, type, listener) {
                    if ("undefined" != typeof wrappersCache[listener])
                        listener = wrappersCache[listener];

                    if (element.detachEvent) {
                        element.detachEvent("on" + type, listener);
                    } else if (element.removeEventListener) {
                        element.removeEventListener(type, listener, true);
                    }

                    return true;
                }
            };
        })(), true);

        linker.extend(utils, {
            fireEvent: function(element, type) {
                if (null === element)
                    return false;

                if ("undefined" != typeof element.fireEvent) {
                    return element.fireEvent("on" + type);
                } else if ("undefined" != typeof element.ownerDocument.createEvent) {
                    var event = element.ownerDocument.createEvent("MouseEvents");
                    event.initEvent(element, true, true);
                    return element.dispatchEvent(event);
                }

                return false;
            }
        }, true);
    }


    linker.extend(utils, {
        isDigit: function(num) {
            if (num.length > 1)
                return false;

            var string="1234567890";
            if (string.indexOf(num) != -1)
                return true;

            return false;
        },
        isAlpha: function(num) {
            if (num.length > 1)
                return false;

            var string="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (string.indexOf(num) != -1)
                return true;

            return false;
        },
        isAccessionNumber: function(Id) {
            OPQ = "OPQ";
            if (Id.length == 6) {
                if (OPQ.indexOf(Id.charAt(0))) {
                    if (utils.isDigit(Id.charAt(1))) {
                        if (utils.isDigit(Id.charAt(2)) || utils.isAlpha(Id.charAt(2))) {
                            if (utils.isDigit(Id.charAt(3)) || utils.isAlpha(Id.charAt(3))) {
                                if (utils.isDigit(Id.charAt(4)) || utils.isAlpha(Id.charAt(4))) {
                                    if (utils.isDigit(Id.charAt(5))) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return false;
        }
    });


    // list functions
    linker.extend(utils, {
        map: function(f, list) {
            if (!list)
                return list;

            if ("string" == typeof f) {
                var name = f;
                f = function(a) {
                    a[name]();
                };
            }

            if ("function" == typeof list.map)
                return list.map(f);

            if (("array" == typeof list) || ("function" == typeof list.join)) {
                var r = [];
                for (var i=0; i<list.length; ++i)
                    r[r.length] = f(list[i]);
                return r;
            }

            if ("object" != typeof list)
                return list;

            var r = {};
            for (var key in list) {
                if ("function" != typeof list[key])
                    r[key] = f(list[key]);
                else
                    r[key] = list[key];
            }
            return r;
        },
        hasValue: function(list, value) {
            if ("undefined" != typeof list.indexOf)
                return list.indexOf(value);

            for (var i=0; i<list.length; ++i) {
                if (i in list && list[i] === value)
                    return i;
            }

            return -1;
        },
        intersect: function(a, b) {
            var intersection = [];
            for (var i=0; i<a.length; ++i) {
                if (-1 != utils.hasValue(b, a[i]))
                    intersection[intersection.length] = a[i];
            }

            return intersection;
        },
        compare: function(a, b) {
            var len = Math.min(a.length, b.length);

            for (var i=0; i<len; ++i) {
                if (a[i] != b[i])
                    return a[i] - b[i];
            }

            return 0;
        }
    });


    // string functions
    linker.extend(utils, {
        trimSquare: function(str) {
            return str.replace(/^[\s\[]+|[\s\]]+$/g, "");
        },
        trimRound: function(str) {
            return str.replace(/^[\s\(]+|[\s\)]+$/g, "");
        },
        unquote: function(str) {
            return str.replace(/^([\'\"])(.*)\1$/, "$2");
        }
    });


    // date functions
    linker.extend(utils, {
        fromISO8601: function(string) {
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
            var d = string.match(new RegExp(regexp));

            var offset = 0;
            var date = new Date(d[1], 0, 1);

            if (d[3]) { date.setMonth(d[3] - 1); }
            if (d[5]) { date.setDate(d[5]); }
            if (d[7]) { date.setHours(d[7]); }
            if (d[8]) { date.setMinutes(d[8]); }
            if (d[10]) { date.setSeconds(d[10]); }
            if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
            if (d[14]) {
                offset = (Number(d[16]) * 60) + Number(d[17]);
                offset *= ((d[15] == '-') ? 1 : -1);
            }

            offset -= date.getTimezoneOffset();
            time = (Number(date) + (offset * 60 * 1000));

            var r = new Date();
            r.setTime(Number(time));
            return r;
        }
    });


    // URLs functions
    linker.extend(utils, {
        parseUri: function(sourceUri) {
            var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
            var uriParts = new RegExp("^(?:([^:/?:.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
            var uri = {};

            for(var i = 0; i < 10; i++)
                uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");

            // Always end directoryPath with a trailing backslash if a path was present in the source URI
            // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
            if(uri.directoryPath.length > 0)
                uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");

            return uri;
        },
        getServerName: function(url) {
            var uri = utils.parseUri(url);
            return uri["authority"];
        },
        getPathName: function(url) {
            var pos = url.indexOf( "nph-proxy.cgi");
            if ( pos == -1 )
                pos = url.indexOf( "pubmed.py" );

            if ( pos > -1 )
                url = url.slice( 0, pos );

            var uri = utils.parseUri(url);
            return uri["directoryPath"];
        }
    });


    // elements' data functions
    linker.extend(utils, {
        getData: function(node, name) {
            if ("undefined" != typeof node.getUserData) {
                try {
                    return node.getUserData(name);
                } catch(e) {
                    // FF2
                }
            }

            if ("undefined" != typeof node[name])
                return node[name];

            if ("undefined" != typeof node.getAttribute) {
                var s = node.getAttribute(name);
                var i = parseInt(s);

                if (isNaN(i))
                    return s;
                else
                    return i;
            }

            return null;
        },
        setData: function(node, name, value) {
            if ("undefined" != typeof node.setUserData) {
                try {
                    node.setUserData(name, value, null);
                    return;
                } catch(e) {
                    // FF2 will raise "not implemented" exception, so let it use attributes
                }
            }

            try {
                node[name] = value;
            } catch(e) {
                if ("undefined" !== typeof node.setAttribute) {
                    if (null === value)
                        node.removeAttribute(name); // does not raise exception on not found by specification
                    else
                        node.setAttribute(name, value);
                }
            }
        }
    });


    // DOM functions
    linker.extend(utils, {
        getElementsById: function(processDocument, idName) {
            var elt = processDocument.getElementById(idName);
            if (null !== elt)
                return [elt];
            return [];
        },
        getElementsByClassName: function(oElm, strTagName, strClassName) {
            strClassName = strClassName.replace(/\-/g, "\\-");
            var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");

            var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
            var arrReturnElements = [];
            for(var i=0; i<arrElements.length; i++){
                if(oRegExp.test(arrElements[i].className)){
                    arrReturnElements[arrReturnElements.length] = arrElements[i];
                }
            }

            return arrReturnElements;
        },
        isContains: function(node, parent) {
            while (null !== node) {
                if (node === parent)
                    return true;

                node = node.parentNode;
            }

            return false;
        },
        nextSibling: function(node) {
            if (!linker.browser.is_ie)
                return node.nextSibling;

            if (null !== node.nextSibling)
                return node.nextSibling;

            if (null === node.parentNode)
                return null;

            if (node.parentNode.lastChild === node)
                return null;

            var i;
            for (i=0; i<node.parentNode.childNodes.length; ++i) {
                if (node === node.parentNode.childNodes[i])
                    break;
            }

            ++i;

            if (i < node.parentNode.childNodes.length)
                return node.parentNode.childNodes[i];

            return null;
        },
        nextElement: function(node) {
            do {
                node = node.nextSibling;
            } while ((null !== node) && (3 == node.nodeType));

            return node;
        },
        isWikifierNode: function(node) {
            while (null !== node) {
                if (("string" == typeof node.id) && (node.id.substr(0,9) == "wikifier-"))
                    return true;
                node = node.parentNode;
            }
            return false;
        },
        IsInVisibleWindow: function(node, clip) {
            if (!linker.browser.is_ie) {
                var winW = linker.processWindow.innerWidth;
                var winH = linker.processWindow.innerHeight;
            } else {
                var winW = linker.processDocument.body.offsetWidth;
                var winH = linker.processDocument.body.offsetHeight;
            }

            if ( ( node.offsetLeft < winW ) && ( node.offsetTop < winH ) ){
                if ((node.offsetLeft < clip.left) || (node.offsetLeft > clip.left + clip.width)) {
                    return true;
                } else if ((node.offsetTop < clip.top) || (node.offsetTop > clip.top + clip.height)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        splitIds: function(idStr) {
            var id = idStr.split("_");
            fpId = parseInt(id[0]);
            ps = id[1].split(",");
            return [fpId, ps];
        },
        RetrieveNodeFromPage: function(clip) {
            var nodes = utils.getElementsByClassName(linker.processDocument, "font", "wikihighlight");
            for (var i=0; i<nodes.length; i++) {
                if (utils.IsInVisibleWindow(nodes[i], clip)) {
                    var rec = utils.splitIds(nodes[i].id);
                    var fpId = rec[0];
                    var cuiList = rec[1];

                    /*
                     * Only return nodes it they have a true semantic type
                     */
                    for (var j=0; j<cuiList.length; j++) {
                        var concept = getConceptById(cuiList[j]);
                        var semanticgroups = concept.semanticgroups();

                        if ( ( semanticgroups[0] != "New" ) &&
                             ( semanticgroups[0] != "Other" ) &&
                             ( semanticgroups[0] != undefined ) &&
                             ( semanticgroups[0] != "null" ) ){
                            return nodes[i];
                        }
                    }
                }
            }
            return null;
        },
        getStyle: function(el) {
            if(el.currentStyle)
                return el.currentStyle.color;
            if(el.ownerDocument.defaultView)
                return el.ownerDocument.defaultView.getComputedStyle(el, "").getPropertyValue("color");
            return "";
        },
        clearNodes: function(node) {
            for (var i=node.childNodes.length-1; i>=0; i--)
                node.removeChild( node.childNodes[i] );
        }
    });


    // cookie functions
    linker.extend(utils, {
        createCookie: function(name, value, days) {
            try {
                var expires = "";
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                }
                document.cookie = name+"="+value+expires+"; path=/";
            } catch(e) {
                WriteDebugLine("Error while setting cookie", e);
            }
        },
        readCookie: function(name) {
            var nameEQ = name + "=";
            try {
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0)
                        return c.substring(nameEQ.length, c.length);
                }
            } catch(e) {
            }
            return null;
        },
        eraseCookie: function(name) {
            utils.createCookie(name,"",-1);
        }
    });


    // helpers
    linker.extend(utils, {
        getXMLDOM: function(text) {
            if ("string" != typeof text)
                return text;

            if ("undefined" != typeof DOMParser) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, "text/xml");
                var error = false;

                if ("parsererror" == doc.documentElement.tagName.toLowerCase()) {
                    error = doc.documentElement.firstChild.nodeValue;
                    error = error.split(/\n/, 2)[0];
                }

                if (("html" == doc.documentElement.tagName.toLowerCase()) && ("body" == doc.documentElement.firstChild.tagName.toLowerCase()) && ("parsererror" == doc.documentElement.firstChild.firstChild.tagName.toLowerCase())) {
                    var node = doc.documentElement.firstChild.firstChild;
                    if (("div" == node.childNodes[1].tagName.toLowerCase()) && (3 == node.childNodes[1].firstChild))
                        error = node.childNodes[1].firstChild.nodeValue;
                    else
                        error = node.innerHTML;
                }

                if (error) {
                    var r = error.match(/^.*:\s+(.*)/);
                    if (null !== r)
                        throw r[1];
                    else
                        throw error;
                   }

                return doc;
            }

            if ("undefined" != typeof ActiveXObject) {
                var progIDs = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0'];
                var doc;

                for (var i = 0; i < progIDs.length; i++) {
                    try {
                        doc = new ActiveXObject(progIDs[i]);
                        break;
                    }
                    catch (e) {}
                }
                if (doc) {
                    doc.async = "false";
                    doc.loadXML(text);
                    if (null === doc.documentElement)
                        throw doc.parseError.reason;
                }
                return doc;
            }

            return null;
        },
        GetXMLHttpRequest: function() {
            var req = null;

            if ("undefined" != typeof XMLHttpRequest) {
                req = new XMLHttpRequest();
                if (req.overrideMimeType)
                    req.overrideMimeType('text/xml');
            }

            if (!req && ("undefined" != typeof ActiveXObject)) {
                var msxmls = new Array( 'Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Msxml2.XMLHTTP','Microsoft.XMLHTTP');
                for (var i=0; i<msxmls.length; i++) {
                  try {
                    req = new ActiveXObject(msxmls[i]);
                    break;
                  } catch (e) {}
                }
            }

            return req;
        }
    });


    // UUID
    linker.extend(utils, {
        /* Pad a string to a certain length with another string; similar to
        PHP's str_pad() function.
         * Derived from code by Carlos Reche <carlosreche at yahoo.com>.
         *    len   - Pad the string up to this length
         *   (pad)  - String used for padding (default: a single space)
         *   (type) - Type can be String.PAD_LEFT, String.PAD_RIGHT (default) or
        String.PAD_BOTH
         */
        String: {
            PAD_LEFT:   0,
            PAD_RIGHT:  1,
            PAD_BOTH:   2,

            pad: function(string, len, pad, type) {
                var append = new String();

                len = isNaN (len) ? 0 : len - string.length;
                pad = typeof (pad) == "string" ? pad : " ";

                if (type == this.PAD_BOTH) {
                    string = this.pad(string, Math.floor(len / 2) + string.length, pad, this.PAD_LEFT);
                    return this.pad(string, Math.ceil(len / 2) + string.length, pad, this.PAD_RIGHT);
                }

                while ((len -= pad.length) > 0)
                    append += pad;
                append += pad.substr (0, len + pad.length);

                return (type == this.PAD_LEFT ? append.concat(string) : string.concat(append));
            }
        },

        /* Generate a uniformly distributed random integer within the range
        <min> .. <max>.
         *   (min) - Lower limit: random >= min (default: 0)
         *   (max) - Upper limit: random <= max (default: 1)
         */
        randomInt: function (min, max) {
            if (! isFinite (min)) min = 0;
            if (! isFinite (max)) max = 1;
            return Math.floor((Math.random () % 1) * (max - min + 1) + min);
        },
        /* Generate a new universally unique identifier (UUID) according to RFC
        4122.
         * Returns the string representation of the UUID as defined in section 3
        of RFC 4122.
         *   (type) - The type of UUID to generate: "v4" (default) or "NIL"
         */
        UUID: {
            generate: function (type) {
                switch ((type || 'v4').toUpperCase ()) {
                    // Version 4 UUID  (Section 4.4 of RFC 4122)
                    case 'V4':
                        var tl    = this._randomHexString (8);
                        // time_low
                        var tm    = this._randomHexString (4);
                        // time_mid
                        var thav  = '4' + this._randomHexString (3);
                        // time_hi_and_version
                        var cshar = utils.randomInt (0, 0xFF);
                        // clock_seq_hi_and_reserved
                        cshar = ((cshar & ~(1 << 6)) | (1 << 7)).toString (16);
                        var csl   = this._randomHexString (2);
                        // clock_seq_low
                        var n     = this._randomHexString (12);
                        // node
                        return (tl + '-' + tm + '-' + thav + '-' + cshar + csl + '-' + n);

                    // Nil UUID  (Section 4.1.7 of RFC 4122)
                    case 'NIL':
                        return ('00000000-0000-0000-0000-000000000000');
                }
                return (null);
            },
            _randomHexString: function (len) {
                var random = utils.randomInt (0, Math.pow (16, len) - 1);
                return utils.String.pad(random.toString(16), len, '0', utils.String.PAD_LEFT);
            }
        }
    });
});
linker.addModule("log", function(linker) {
    if ("object" != typeof linker.log)
        linker.log = {};

    var log = linker.log;


    linker.extend(log, {
        NAME:           "Linker Cache Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(log, {
        debug: function(text, e) {
            if (DEBUG) {
                if (linker.is_wikifyplugin) {
                    Wikify.log.info(text);
                    if (e)
                       Wikify.log.exception(e);
                } else {
                    linker.base.log.debug(text, e);
                }

                if (e)
                    throw e;
            }
        },
        WriteDebugLine: function(text, e) {
            log.debug(text, e);
        },
        Log: function(filename) {
            linker.extend(this, {
                reset: function() {
                    if (DEBUG && linker.browser.is_ff) {
                        if (this.outputStream !== null)
                            this.close();

                        try {
                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        } catch (e) {
                        }

                        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                        file.initWithPath( this.filename );
                        if ( file.exists() === false ) {
                            file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
                        }
                        this.outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
                        this.outputStream.init( file, 0x04 | 0x08 | 0x20, 420, 0 );
                    } else if (DEBUG && linker.browser.is_ie) {
                        var fs = new ActiveXObject('Scripting.FileSystemObject');
                        try {
                            this.outputStream = fs.CreateTextFile (this.filename, true);
                        } catch(e) {
                            this.filename += "001.txt";
                            this.outputStream = fs.CreateTextFile (this.filename, true);
                        }
                    }
                },
                open: function() {
                    if (DEBUG && linker.browser.is_ff) {
                        if (this.outputStream !== null)
                            this.close();

                        try {
                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        } catch (e) {
                        }
                        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                        file.initWithPath( this.filename );
                        if ( file.exists() === false ) {
                            file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
                        }
                        this.outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
                        this.outputStream.init( file, 0x04 | 0x08 | 0x10, 420, 0 );
                    }
                },
                write: function(output) {
                    if (DEBUG && linker.browser.is_ff) {
                        output = output + "\n";
                        return this.outputStream.write(output, output.length);
                    } else if ( DEBUG && linker.browser.is_ie ){
                        this.outputStream.WriteLine(output);
                    }
                },
                close: function() {
                    if (DEBUG && linker.browser.is_ff) {
                        this.outputStream.close();
                        this.outputStream = null;
                    } else if (DEBUG && linker.browser.is_ie) {
                        this.outputStream.Close();
                        this.outputStream = null;
                    }
                }
            });

            if (DEBUG) {
                this.filename = filename;
                this.outputStream = null;
                this.reset();
            }
        }
    });
});
linker.addModule("cache", function(linker) {
    if ("object" != typeof linker.cache)
        linker.cache = {};

    var cache = linker.cache;


    linker.extend(cache, {
        NAME:           "Linker Cache Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(cache, {
        ConceptCache:           [],
        SemanticTypeCache:      []
    });


    linker.extend(cache, {
        init: function(concepts, semantictypes) {
            cache.ConceptCache = concepts || [];
            cache.SemanticTypeCache = semantictypes || [];
        },
        putConcept: function(conceptId, conceptName, mappedFromId, mappedFromName, semanticTypes) {
            mappedFromId = mappedFromId || "";
            mappedFromName = mappedFromName || "";
            return cache.ConceptCache[conceptId] = {'id':conceptId, 'name':conceptName, 'mappedFromId':mappedFromId, 'mappedFromName':mappedFromName, 'semanticTypes':semanticTypes, 'definition':''};
        },
        getConcept: function(conceptId) {
            if ("undefined" != typeof cache.ConceptCache[conceptId])
                return cache.ConceptCache[conceptId];

            return null;
        },
        putSemanticType: function(semTypeId, semTypeName) {
            return cache.SemanticTypeCache[semTypeId] = semTypeName;
        },
        getSemanticType: function(semTypeId) {
            if ("undefined" != typeof cache.SemanticTypeCache[semTypeId])
                return cache.SemanticTypeCache[semTypeId];

            return null;
        }
    });
});
linker.addModule("parsing", function(linker) {
    if ("object" != typeof linker.parsing)
        linker.parsing = {};

    var parsing = linker.parsing;
    var utils = linker.utils;


    linker.extend(parsing, {
        NodeOffset:         [],
        IndexNodeQueue:     [],
        parsed:             false
    });


    linker.extend(parsing, (function() {
        var timeout = null;

        return {
            indexNode: function(node) {
                if (!node)
                    return;

                try {
                    switch(node.nodeType) {
                        case 3:
                            break;

                        case 9:
                        case 10:
                            for (var i=0; i < node.body.childNodes.length; ++i)
                                arguments.callee(node.body.childNodes[i]);
                            return;

                        case 1:
                            var tagName = node.tagName.toLowerCase();

                            if(tagName == "script")
                                return;

                            if(tagName == "body") {
                                for (var i=0; i < node.childNodes.length; ++i)
                                    arguments.callee(node.childNodes[i]);
                                return;
                            }

                            if (utils.isWikifierNode(node))
                                return;

                            break;
                    }

                    parsing.IndexNodeQueue[parsing.IndexNodeQueue.length] = {
                        node:       node,
                        handled:    false
                    };

                    if (!timeout) {
                        timeout = linker.base.setTimeout(function() {
                            timeout = null;
                            parsing.processNodeQueue();
                        }, 100);
                    }

                    return true;
                } catch(e) {
                    linker.log.debug("Error while adding indexing node", e);
                    return false;
                }
            },
            processNodeQueue: function() {
                if (!parsing.parsed)
                    return;

                for (var i=0; i<parsing.IndexNodeQueue.length; ++i) {
                    if (parsing.IndexNodeQueue[i].handled)
                        continue;

                    parsing.IndexNodeQueue[i].handled = true;

                    try {
                        var node = parsing.IndexNodeQueue[i].node;
                        var s = parsing.getText(node);

                        var off = parsing.getOffset(node);
                        var offset = off;

                        var brakes = [];

                        if ("undefined" !== typeof node.getElementsByTagName) {
                            var list = node.getElementsByTagName("br");

                            for(var i=0; i<list.length; ++i)
                                brakes[brakes.length] = parsing.getOffset(list[i]);
                        }

                        if (linker.browser.is_ie && ("undefined" != typeof node.innerText)) {
                            var text = node.innerText;
                            var re = /\r|\n/g;
                            var pos;
                            var n = 0;

                            while (null !== (pos = re.exec(text))) {
                                brakes[brakes.length] = off + pos.index - n;
                                ++n;
                            }
                        }

                        if (0 < brakes.length) {
                            brakes.sort(function(a, b) {
                                return a-b;
                            });

                            for (var i=0; i<brakes.length; ++i) {
                                if (brakes[i] > offset) {
                                    linker.indexing.indexText(s.substr(offset-off, brakes[i]-offset), node, offset);
                                    offset = brakes[i];
                                }
                            }
                        }

                        if (offset < off + s.length)
                            linker.indexing.indexText((off<offset) ? s.substr(offset-off) : s, node, offset);
                    } catch(e) {
                        parsing.IndexNodeQueue[i].handled = false;
                    }
                }
            },
            clearNodeQueue: function() {
                if (timeout) {
                    linker.base.clearTimeout(timeout);
                    timeout = null;
                }

                parsing.IndexNodeQueue = [];
            }
        };
    })());


    linker.extend(parsing, (function() {
        var text_pattern = /\r|\n/g;
        var html_pattern = /<\/?[^>]*>/g;

        function getBodyText(node) {
            var s = "";
            for (var i=0; i < node.childNodes.length; ++i) {
                var child = node.childNodes[i];
                if (utils.isWikifierNode(child))
                    continue;
                s += parsing.getText(child);
            }
            return s;
        }

        return {
            getText: function(node) {
                if (null === node)
                    return "";

                switch (node.nodeType) {
                    case 2:
                    case 3:
                    case 4:
                        if ("string" == typeof node.nodeValue)
                            return node.nodeValue;

                        return "";

                    case 7:
                    case 8:
                        return "";

                    case 9:
                    case 10:
                        return getBodyText(node.body);

                    default:
                        if(node.tagName.toLowerCase()=="body")
                            return getBodyText(node);

                        if ("undefined" != typeof node.textContent)
                            return node.textContent;

                        if ("undefined" != typeof node.innerText)
                            return node.innerText.replace(text_pattern,"");

                        if ("undefined" != typeof node.innerHTML)
                            return node.innerHTML.replace(html_pattern,"").replace(text_pattern,"");

                        if ("string" == typeof node.nodeValue)
                            return node.nodeValue;

                        return "";
                }
            }
        };
    })());


    linker.extend(parsing, {
        init: function() {
            for (var i=0; i<parsing.NodeOffset.length; i++) {
                try {
                    if (null !== utils.getData(parsing.NodeOffset[i].node, "wikifier-offset"))
                        utils.setData(parsing.NodeOffset[i].node, "wikifier-offset", null);
                } catch(e) {
                }
            }
            parsing.NodeOffset = [];
            parsing.parsed = false;
        },
        getTextLength: function(node) {
            return parsing.getText(node).length;
        },
        setOffset: function(node, offset, type, index) {
            utils.setData(node, "wikifier-offset", offset);

            if ("undefined" == typeof index) {
                index = parsing.getIndexByPos(offset);

                while ((-1 < index) && utils.isContains(parsing.NodeOffset[index].node, node))
                    --index;

                ++index;
            }

            if (parsing.NodeOffset.length == index)
                parsing.NodeOffset[index] = { offset: offset, node: node, type: type };
            else
                parsing.NodeOffset.splice(index, 0, { offset: offset, node: node, type: type });
        },
        getOffset: function(node) {
            if (null === node)
                return null;

            var offset = utils.getData(node, "wikifier-offset");
            if (null !== offset)
                return offset;

            if (("undefined" != typeof node.tagName) && ("body" == node.tagName.toLowerCase()))
                return 0;

            var text = parsing.getText(node);
            if (0 === text.length) {
                var next = utils.nextSibling(node);
                while (null === next) {
                    node = node.parentNode;
                    if (null === node)
                        return 0;
                    next = utils.nextSibling(node);
                }

                return arguments.callee(next);
            }

            if (text.length > 30)
                text = text.substr(0, 30);

            var parent = node.parentNode;
            offset = arguments.callee(parent);

            var start = 0;
            var size = 1;

            for (var i=0; (i < parent.childNodes.length) && (parent.childNodes[i] !== node); ++i) {
                start += parsing.getTextLength(parent.childNodes[i]);
                ++size;
            }

            start -= size;

            if (start < 0) {
                size += start;
                start = 0;
            }

            var ptext = parsing.getText(parent).substr(start, 30 + 2*size);

            if (ptext.substr(size, text.length) !== text) {
                start += ptext.indexOf(text);
            } else {
                start += size;
            }

            offset += start;

            if (3 === node.nodeType) {
                // making sure that it not in NodeOffset already if it is text element
                index = parsing.getIndexByPos(offset);

                if (parsing.NodeOffset[index].node === node)
                    return offset;

                if ((null === node.nodeValue) || (0 === node.nodeValue.length)) {
                    // if node has zerro length than we must check previous NodeOffsets with same offset
                    --index;
                    while ((-1 < index) && (parsing.NodeOffset[index].offset == offset)) {
                        if (parsing.NodeOffset[index].node === node)
                            return offset;
                        --index;
                    }
                }
            }

            parsing.setOffset(node, offset, (3 === node.nodeType) ? 3 : 1);
            return offset;
        },
        getIndexOffset: function(el) {
            if (utils.isWikifierNode(el))
                return 0;

            return parsing.getOffset(el);
        },
        getCheckSum: function() {
            return parsing.getTextLength(linker.processDocument.body);
        },
        getIndexByPos: function(aPos, index) {
            if (0 === parsing.NodeOffset.length)
                return -1;

            var cur = index || 0;
            var step = parsing.NodeOffset.length - cur;

            while (true) {
                step = Math.max(1, step >> 1);

                if (parsing.NodeOffset[cur].offset > aPos) {
                    cur -= step;
                    if (cur < 0)
                        return -1;
                } else if (cur+1 < parsing.NodeOffset.length && parsing.NodeOffset[cur+1].offset <= aPos) {
                    cur += step;
                    if (cur >= parsing.NodeOffset.length)
                        return parsing.NodeOffset.length-1;
                } else {
                    return cur;
                }
            }
        },
        removeProxyInfo: function(aUrl) {
            var pos = aUrl.lastIndexOf("http://");
            if (pos > 6) {
                aUrl = aUrl.slice(pos);
                return aUrl;
            }

            pos = aUrl.lastIndexOf(/http/);
            if (pos > 6) {
                aUrl = "http://" + aUrl.slice(pos + 6);
            }

            return aUrl;
        },
        constructFullUrl: function(processDocument, aurl, page) {
            // try to construct a unique URL for the page
            var url = aurl;
            if ((page == 3) || (page == 8)) {
                var Db   = "";
                var Term = "";

                for (var f=0; f<processDocument.forms.length; f++) {
                    for (var e=0; e<processDocument.forms[f].elements.length; e++) {
                        if (processDocument.forms[f].elements[e].name == "EntrezSystem2.PEntrez.Pubmed.SearchBar.Db") {
                            Db = processDocument.forms[f].elements[e].value;
                        }
                        if (processDocument.forms[f].elements[e].name == "EntrezSystem2.PEntrez.Pubmed.SearchBar.Term") {
                            Term = processDocument.forms[f].elements[e].value;
                        }
                    }
                }
                url += "?EntrezSystem2.PEntrez.Pubmed.SearchBar.Db=" + Db + "&EntrezSystem2.PEntrez.Pubmed.SearchBar.Term=" + Term;
            }

            return url;
        },
        SiteSpecificHandling: function(aWindow) {
            try {
                var offset  = 0;
                var aUrl    = parsing.removeProxyInfo(linker.url);
                var page    = IsURLToEnrich(linker.processDocument, aUrl);

                linker.ui.showPB("Extraction of text");

                var toIndex = ProcessPage(linker.processDocument, page);
                linker.processWindow.currentcacheelt.page = parsing.constructFullUrl(linker.processDocument, aUrl, page);

                linker.indexed = true;

                if (toIndex !== false) {
                    parsing.NodeOffset.sort(function(a, b) {
                        return a.offset - b.offset;
                    });

                    var fingerprints = null;
                    try {
                        var cache_elt = retrieve_from_cache(linker.processWindow.currentcacheelt.page, parsing.getCheckSum(), linker.ignoreChecksum);
                        linker.ignoreChecksum = false;
                        if (cache_elt !== null) {
                            linker.cache.init(cache_elt.concepts, cache_elt.semantictypes);
                            fingerprints = cache_elt.fp;
                        }
                    } catch(e) {
                        linker.log.WriteDebugLine("catch error on retrieving fingerprint from cache", e);
                    }

                    if (fingerprints !== null) {
                        parsing.clearNodeQueue();
                        linker.indexing.clearTextQueue();

                        parsing.parsed = true;

                        linker.processWindow.currentcacheelt.fingerprints = fingerprints;
                        for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
                            linker.subject.FingerprintInit(linker.processWindow.currentcacheelt.fingerprints[f]);
                            linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
                        }
                        linker.highlighting.ShowConcepts(0);

                        linker.highlighting.setColoring();
                        linker.highlighting.removeColoring();
                    } else {
                        /* remove any popups before indexing the page */
                        linker.ui.truepopdown();

                        parsing.parsed = true;

                        parsing.processNodeQueue();
                        linker.indexing.processTextQueue();
                    }
                }
            } catch(e) {
                linker.log.WriteDebugLine("Error in sitespecifichandling", e);
            } finally {
                linker.ui.hidePB();
            }
        }
    });

});
linker.addModule("indexing", function(linker) {
    if ("object" != typeof linker.indexing)
        linker.indexing = {};

    var indexing = linker.indexing;


    linker.extend(indexing, {
        NAME:           "Linker Indexing Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(indexing, {
        IndexTextQueue:         [],
        IndexingRequestQueue:   [],
        IndexingResultQueue:    [],
        IndexingResponseQueue:  [],
        queryLength:            1024,
        indexed:                false
    });


    linker.extend(indexing, (function() {
        var timeout = null;

        return {
            indexText: function(text, node, offset) {
                var length = text.length;
                if (0 === length)
                    return;

                try {
                    node = node || linker.processDocument.body;
                    offset = offset || linker.parsing.getOffset(node);

                    indexing.IndexTextQueue[indexing.IndexTextQueue.length] = {
                        text:       text,
                        node:       node,
                        offset:     offset,
                        handled:    false
                    };

                    if (!timeout) {
                        timeout = linker.base.setTimeout(function() {
                            timeout = null;
                            indexing.processTextQueue();
                        }, 10);
                    }

                    return true;
                } catch(e) {
                    linker.log.debug("Error while adding indexing text", e);
                    return false;
                }
            },
            processTextQueue: function() {
                if (!linker.parsing.parsed)
                    return;

                for (var i=0; i<indexing.IndexTextQueue.length; ++i) {
                    if (indexing.IndexTextQueue[i].handled)
                        continue;

                    indexing.IndexTextQueue[i].handled = true;

                    var node = indexing.IndexTextQueue[i].node;
                    var text = indexing.IndexTextQueue[i].text;
                    var offset = indexing.IndexTextQueue[i].offset;

                    var length = text.length;

                    try {
                        var off = 0;
                        do {
                            var len = Math.min(length-off, indexing.queryLength);

                            indexing.storeIndexRequest((len==length) ? text : text.substr(off, len), offset + off, node);

                            off += len;
                        } while (off < length);
                    } catch(e) {
                        indexing.IndexTextQueue[i].handled = false;
                    }
                }

                linker.parsing.processNodeQueue();
            },
            clearTextQueue: function() {
                if (timeout) {
                    linker.base.clearTimeout(timeout);
                    timeout = null;
                }

                indexing.IndexTextQueue = [];
            }
        };
    })());


    linker.extend(indexing, (function() {
        var timeout = null;
        var blocked = false;

        return {
            storeIndexRequest: function(text, offset, node) {
                if (0 === text.length)
                    return;

                try {
                    node = node || processDocument.body;

                    indexing.IndexingRequestQueue[indexing.IndexingRequestQueue.length] = {
                        text: text,
                        offset: offset,
                        fp: new linker.subject.Fingerprint(),
                        handled: false,
                        node: node
                    };

                    if (!timeout) {
                        timeout = linker.base.setTimeout(function() {
                            timeout = null;
                            indexing.processRequestQueue();
                        }, 10);
                    }

                    return true;
                } catch(e) {
                    linker.log.debug("Error while adding indexing request", e);
                    return false;
                }
            },
            processRequestQueue: function() {
                if (blocked)
                    return;

                blocked = true;

                var text = "";
                var requests  = [];

                try {
                    linker.ui.showPB("semantic analysis of text");

                    for (var i=0; i<indexing.IndexingRequestQueue.length; ++i) {
                        if (indexing.IndexingRequestQueue[i].handled)
                            continue;

                        if (text.length + indexing.IndexingRequestQueue[i].text.length > indexing.queryLength)
                            break;

                        indexing.IndexingRequestQueue[i].handled = true;
                        requests[requests.length] = {
                            request: indexing.IndexingRequestQueue[i],
                            offset: text.length
                        };
                        text += indexing.IndexingRequestQueue[i].text + ". ";
                    }

                    if (0 < requests.length) {
                        indexing.storeIndexResult(requests, text);
                    } else {
                        linker.ui.hidePB();
                        indexing.processTextQueue();
                    }
                } catch(e) {
                    linker.log.debug("Error while processing indexing requests queue", e);
                    linker.ui.hidePB();
                } finally {
                    blocked = false;
                }
            },
            requestPending: function() {
                if (blocked)
                    return true;

                for (var i=0; i<indexing.IndexingResultQueue.length; ++i) {
                    if (indexing.IndexingResultQueue[i].handled)
                        continue;

                    return true;
                }

                return false;
            }
        };
    })());


    linker.extend(indexing, (function() {
        var timeout = null;
        var blocked = false;

        return {
            storeIndexResult: function(requests, text) {
                try {
                    var id = linker.utils.UUID.generate("v4");

                    indexing.IndexingResultQueue[id] = indexing.IndexingResultQueue[indexing.IndexingResultQueue.length] = {
                        id: id,
                        requests: requests,
                        text: text,
                        handled: false
                    };

                    if (!timeout) {
                        timeout = linker.base.setTimeout(function() {
                            timeout = null;
                            indexing.processResultQueue();
                        }, 10);
                    }

                    return true;
                } catch(e) {
                    linker.log.debug("Error while adding indexing result", e);
                    return false;
                }
            },
            processResultQueue: function() {
                if (blocked)
                    return;

                blocked = true;

                var index = -1;

                try {
                    for (var i=0; i<indexing.IndexingResultQueue.length; ++i) {
                        if (indexing.IndexingResultQueue[i].handled)
                            continue;

                        indexing.IndexingResultQueue[i].handled = true;

                        index = i;
                        break;
                    }

                    if (-1 < index) {
                        linker.transport.wrapCall({
                            complete: function() {
                                blocked = false;
                                indexing.processResultQueue();
                            }
                        }, function() {
                            indexing.Index(indexing.IndexingResultQueue[index].text, indexing.processResultCallback, indexing.IndexingResultQueue[index].id);
                        });
                    } else {
                        blocked = false;
                        indexing.processRequestQueue();
                    }
                } catch(e) {
                    blocked = false;
                    linker.log.debug("Error while processing indexing results queue", e);
                }
            },
            processResultCallback: function(id, text) {
                if ("undefined" == indexing.IndexingResultQueue[id]) {
                    linker.log.debug("Error while finding result by id: " + id);
                    return;
                }

                var result = indexing.IndexingResultQueue[id];
                result.handled = true;

                indexing.storeIndexResponse(result, text);
            },
            resultPending: function() {
                if (blocked)
                    return true;

                for (var i=0; i<indexing.IndexingResultQueue.length; ++i) {
                    if (indexing.IndexingResultQueue[i].handled)
                        continue;

                    return true;
                }

                return false;
            }
        };
    })());


    linker.extend(indexing, (function() {
        var timeout = null;
        var blocked = false;

        return {
            storeIndexResponse: function(result, text) {
                try {
                    indexing.IndexingResponseQueue[indexing.IndexingResponseQueue.length] = {
                        result: result,
                        text: text,
                        handled: false
                    };

                    if (!timeout) {
                        timeout = linker.base.setTimeout(function() {
                            timeout = null;
                            indexing.processResponseQueue();
                        }, 100);
                    }

                    return true;
                } catch(e) {
                    linker.log.debug("Error while adding indexing response", e);
                    return false;
                }
            },
            processResponseQueue: function() {
                if (blocked)
                    return;

                blocked = true;

                var index = -1;

                try {
                    for (var i=0; i<indexing.IndexingResponseQueue.length; ++i) {
                        if (indexing.IndexingResponseQueue[i].handled)
                            continue;

                        index = i;
                        break;
                    }

                    if (-1 < index) {
                        var fp = new linker.subject.Fingerprint();
                        fp.parse(indexing.IndexingResponseQueue[i]);
                    } else {
                        blocked = false;

                        if (indexing.resultPending())
                            indexing.processResultQueue();
                        else if (indexing.requestPending())
                            indexing.processRequestQueue();
                        else
                            indexing.finished();
                        }
                } catch(e) {
                    blocked = false;
                    linker.log.debug("Error while processing indexing responses queue", e);
                }
            },
            processResponseCallback: function(response) {
                for (var i=0; i<response.result.requests.length; i++) {
                    linker.processWindow.currentcacheelt.addfp(response.result.requests[i].request.fp, response.result.requests[i].request.offset);
                    linker.highlighting.ShowConcepts(linker.processWindow.currentcacheelt.fingerprints.length-1);
                }

                response.handled = true;

                blocked = false;

                indexing.processResponseQueue();
            },
            responsePending: function() {
                if (blocked)
                    return true;

                for (var i=0; i<indexing.IndexingResponseQueue.length; ++i) {
                    if (indexing.IndexingResponseQueue[i].handled)
                        continue;

                    return true;
                }

                return false;
            }
        };
    })());


    linker.extend(indexing, {
        init: function() {
            indexing.IndexingRequestQueue = [];
            indexing.IndexingResultQueue = [];
            indexing.IndexingResponseQueue = [];
            indexing.indexed = false;
        },
        finished: function() {
            if (indexing.indexed)
                return;

            indexing.indexed = true;

            linker.ui.hidePB();

            if (linker.processWindow.wikify) {
                linker.processWindow.wikify.parsing = false;
                linker.processWindow.wikify.parsed = true;
            }

            try {
                store_in_cache( linker.processWindow.currentcacheelt.page, {
                    'fp': linker.processWindow.currentcacheelt.fingerprints,
                    'concepts': linker.cache.ConceptCache,
                    'semantictypes': linker.cache.SemanticTypeCache,
                    'nodeoffset': linker.parsing.NodeOffset
                }, linker.parsing.getCheckSum());
            } catch(e) {
                linker.log.debug("error while storing in cache", e);
            }

            //linker.ui.showSplashScreen();

            try {
                var w = linker.getNavigationDocument().getElementById("wikifier-toolbar");
                linker.utils.addEvent(w, "mouseover", linker.highlighting.setColoring);
                linker.utils.addEvent(w, "mouseout", linker.highlighting.removeColoring);
            } catch(e) {
                linker.log.debug("Error while adding coloring handlers", e);
            }

            linker.highlighting.setColoring();
            linker.highlighting.removeColoring();
        },
        Index: function(text, callback, id) {
            text=text.replace(/\n|\x01|\x02/g,' ');
            linker.transport.getIndex(text, callback, id);
        },
        getRequestByPos: function(result, pos) {
            for (var i=0; i<result.requests.length-1; i++) {
                if (pos < result.requests[i+1].offset)
                    return result.requests[i];
            }

            return result.requests[result.requests.length-1];
        }
    });
});
linker.addModule("highlighting", ["parsing"], function(linker) {
    if ("object" != typeof linker.highlighting)
        linker.highlighting = {};

    var highlighting = linker.highlighting;


    linker.extend(highlighting, {
        NAME:           "Linker Highlighting Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(highlighting, {
        new_concepts:       null
    });


    linker.extend(highlighting, {
        init: function() {
            highlighting.new_concepts = [];
        },
        partHighlight: function(f, initial, checked) {
            if (!linker.processWindow.currentcacheelt)
                return;

            var i = 0;
            while (i < 1000 && f < linker.processWindow.currentcacheelt.fingerprints.length) {
                highlighting.Highlight(f, initial, checked);
                i++;
                f++;
            }

            if (f < linker.processWindow.currentcacheelt.fingerprints.length) {
                linker.base.setTimeout(function() {
                    highlighting.partHighlight(f,initial,checked);
                }, 10);
            }
        },
        changeHighlight: function() {
            // added this functionality for the sieve tool. It is essential to see if there is a
            // dynamic frame that contains the search results.
            if ("undefined" !== typeof linker.processWindow.frames['dynamic']) {
                var w = linker.processWindow.frames['dynamic'];
                if (w.currentcacheelt)
                    linker.processWindow = w;
            }

            var enrichmentChecked = linker.getNavigationDocument().getElementById( 'wikifier-enrich' ).checked;
            if (linker.indexed && ("undefined" !== typeof linker.processWindow.currentcacheelt.highlightnodes)) {
                    linker.ui.truepopdown();
                    highlighting.partHighlight(0, 0===linker.processWindow.currentcacheelt.highlightnodes.length, enrichmentChecked);

                    if (enrichmentChecked)
                        linker.indexing.processRequestQueue();
            } else {
                linker.parsing.SiteSpecificHandling();
            }
        },
        clearHighlight: function(){
            if (!linker.indexed || !linker.processWindow.currentcacheelt)
                return;

            highlighting.partHighlight(0, 0===linker.processWindow.currentcacheelt.highlightnodes.length, false);
        },
        highlightCallback: function(f, initial, checked) {
            if (f < linker.processWindow.currentcacheelt.fingerprints.length) {
                if (!linker.processWindow.currentcacheelt.fingerprints[f].shown) {
                    highlighting.Highlight(f,initial,checked);
                    linker.processWindow.currentcacheelt.fingerprints[f].shown = true;
                    self.setTimeout(function(){highlighting.highlightCallback(f+1,initial,checked);}, 0 );
                }
            }
        },
        AddHighlightNodes: function(fpId, positions) {
            if (positions.length === 0)
                return;

            for (var p=0; p < positions.length; ++p ) {
                var concept = linker.ui.getConceptById(positions[p].concepts[0]);

                if (null === concept) {
                    WriteDebugLine("can not find concept " + positions[p].concepts[0]);
                    continue;
                }

                var id = fpId + "_" + positions[p].concepts.join(",");

                var index = linker.parsing.getIndexByPos(positions[p].startPos);
                if (-1 === index)
                    continue;

                var node = linker.parsing.NodeOffset[index].node;
                var offset = positions[p].startPos - linker.parsing.NodeOffset[index].offset;


                var len = linker.parsing.getTextLength(node);
                while ((null !== node) && (offset >= len)) {
                    offset -= len;

                    while ((null !== node) && (null === linker.utils.nextSibling(node)))
                        node = node.parentNode;

                    if (null !== node) {
                        node = linker.utils.nextSibling(node);
                        len = linker.parsing.getTextLength(node);
                        linker.parsing.setOffset(node, linker.parsing.NodeOffset[index].offset + positions[p].startPos - linker.parsing.NodeOffset[index].offset - offset, 1, index+1);
                    }
                }

            	if (null === node) {
                    continue;
                }

                while ((null !== node) && (3 !== node.nodeType)) {
                    var cur;
                    for (var i=0; i < node.childNodes.length; ++i) {
                        cur = node.childNodes[i];
                        len = linker.parsing.getTextLength(cur);
                        if (offset < len)
                            break;

                        offset -= len;
                    }

                    node = cur;

                    if (null !== node)
                        linker.parsing.setOffset(node, linker.parsing.NodeOffset[index].offset + positions[p].startPos - linker.parsing.NodeOffset[index].offset - offset, 1, index+1);
                }

                if (null !== node) {
                    if (linker.utils.isWikifierNode(node))
                        continue;

                    var highlightnode = linker.processDocument.createElement('font');
                    highlightnode.className = 'wikiprotein';
                    highlightnode.id = id;

                    var fontnode = linker.processDocument.createElement('font');
                    fontnode.className = 'wikihighlight';
                    fontnode.id = id;

                    if (linker.browser.is_ie)
                        fontnode.style.styleFloat = "none"; // IE float
                    else
                        fontnode.style.cssFloat = "none"; // FF float

                    fontnode.style.background = "transparent";
                    fontnode.style.borderLeft = "0px none";
                    fontnode.style.borderRight = "0px none";

                    var urlNode = highlighting.getEnclosingUrl(node);

                    if (null !== urlNode) {
                        linker.utils.addEvent(urlNode,"click", highlighting.indirectCall);
                        urlNode.indirectUrl = urlNode.href;
                        fontnode.url = urlNode.indirectUrl;
                    }

                    var txt = node.splitText(offset);

                    offset = positions[p].endPos - positions[p].startPos;
                    if (offset < txt.nodeValue.length)
                        txt.splitText(offset);

                	node.parentNode.replaceChild(highlightnode, txt);
                    fontnode.appendChild(txt);
                    highlightnode.appendChild(fontnode);

                    linker.utils.addEvent( highlightnode, "click", highlighting.highlightClick );

                    linker.utils.addEvent( highlightnode, "mouseover", highlighting.highlightNode );
                    linker.utils.addEvent( highlightnode, "mouseout", highlighting.unhighlightNode );

                    offset -= txt.nodeValue.length;
                    node = highlightnode;

                    if ("undefined" !== typeof linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId])
                        linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId].push( linker.processWindow.currentcacheelt.highlightnodes.length );
                    else
                        linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId] = [ linker.processWindow.currentcacheelt.highlightnodes.length ];

                    linker.processWindow.currentcacheelt.highlightnodes.push([highlightnode, [fpId, p]]);

                    while (0 < offset) {
                        while ((null !== node) && (3 !== node.nodeType)) {
                            while ((null !== node) && (null === linker.utils.nextSibling(node)))
                                node = node.parentNode;

                            if (null !== node)
                                node = linker.utils.nextSibling(node);

                            while ((null !== node) && (null !== node.firstChild))
                                node = node.firstChild;
                        }

                        if (null === node)
                            break;

                        highlightnode = linker.processDocument.createElement('font');
                        highlightnode.className = 'wikiprotein';
                        highlightnode.id = id;

                        fontnode = linker.processDocument.createElement('font');
                        fontnode.className = 'wikihighlight';
                        fontnode.id = id;
                        fontnode.style.cssFloat = "none"; // FF float
                        fontnode.style.styleFloat = "none"; // IE float
                        fontnode.style.background = "transparent";
                        fontnode.style.borderLeft = "0px none";
                        fontnode.style.borderRight = "0px none";

                        if (offset < node.nodeValue.length)
                            node.splitText(offset);

                        node.parentNode.replaceChild(highlightnode, node);
                        fontnode.appendChild(node);
                        highlightnode.appendChild(fontnode);

                        linker.utils.addEvent( highlightnode, "click", highlighting.highlightClick );

                        linker.utils.addEvent( highlightnode, "mouseover", highlighting.highlightNode );
                        linker.utils.addEvent( highlightnode, "mouseout", highlighting.unhighlightNode );

                        offset -= node.nodeValue.length;
                        node = highlightnode;

                        linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId].push( linker.processWindow.currentcacheelt.highlightnodes.length );
                        linker.processWindow.currentcacheelt.highlightnodes.push([highlightnode, [fpId, p]]);
                    }
                }
            }
        },
        Highlight: function(fpId, initial, On) {
            try {
                if (initial) {
                    try{
                        highlighting.AddHighlightNodes( fpId, linker.processWindow.currentcacheelt.fingerprints[fpId].positions );
                    } catch(e){
                        linker.log.WriteDebugLine("addhighlightnodes error", e);
                    }
                }
                
                if (!linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId])
                    return;

                for (var j=0; j<linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId].length; j++) {

                    var i = linker.processWindow.currentcacheelt.highlightnodesByFp['_'+fpId][j];
                    
                    var rec = linker.processWindow.currentcacheelt.highlightnodes[i][1];
                    try {
                        var cui = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[linker.processWindow.currentcacheelt.fingerprints[fpId].positions[rec[1]].concept].id;
                    } catch(e) {
                        linker.log.WriteDebugLine("error in finding cui", e);
                    }

                    var node = highlighting.getFontNode(linker.processWindow.currentcacheelt.highlightnodes[i][0]);
                    var annotation = "";

                    // create a annotation text
                    for (var n=0; n<highlighting.new_concepts.length; n++) {
                        // do a unicode insensitive comparison
                        if (0 === cui.localeCompare(highlighting.new_concepts[n][0])) {
                            var date = fromISO8601(highlighting.new_concepts[n][2]);
                            annotation = "edited by " + highlighting.new_concepts[n][1] + " at " + date.toLocaleString();
                            break;
                        }
                    }

                    var suppress = false;
                    try {
                        var suppress = highlighting.IsSuppressed(linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[linker.processWindow.currentcacheelt.fingerprints[fpId].positions[rec[1]].concept]);
                    } catch (e) {
                    }

                    linker.ui.ShowHighlight(node, On && (linker.ui.getSavedConcept(cui)!==null));

                    var concept = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[linker.processWindow.currentcacheelt.fingerprints[fpId].positions[rec[1]].concept];
                    node.concept = concept;
                    concept.preferred = true;

                    if (On && !suppress) {
                        if ("" !== annotation) {
                            node.style.color = "white";
                            node.style.backgroundColor = "red";
                        }
                    } else {
                        node.style.color = "";
                    }

                    var semanticgroups = concept.semanticgroups();
                    if (0 < semanticgroups.length)
                        annotation = semanticgroups[0].replace( "&amp;", "&" ) + ( annotation.length > 0 ? ", ": "" ) + annotation;

                    node.title = concept.name() + " [" + annotation + "]";
                    node.suppress = suppress;

                    linker.utils.removeEvent( node, "mouseup", linker.ui.popupShow );
                    if (On && !suppress) {
                        node.style.position = "relative";
                        node.style.cursor = "pointer";
                        node.style.borderBottom = "1px dotted";

                        if (!node.className.match(/wikifier-\w+-node/)) {
                            linker.utils.addEvent( node, "mouseup", linker.ui.popupShow );
                            node.className += " "+highlighting.getSemanticTypeClassName(node.concept)+"-node";
                        }
                    } else {
                        node.style.position = "";
                        node.style.color = "";
                        node.style.cursor = "";
                        node.style.borderBottom = "0px dotted";

                        linker.utils.removeEvent( node, "mouseup", linker.ui.popupShow );
                        node.className = node.className.replace(new RegExp("(^|\\s)"+highlighting.getSemanticTypeClassName(node.concept)+"-node($|\\b)", "g"), "");
                    }
                }
            } catch(e) {
                linker.log.WriteDebugLine("highlight error", e);
            }
        },
        IsSuppressed: function(concept) {
            if (null === concept)
                return true;

            var suppressed = true;

            var semanticgroups = concept.semanticgroups();
            for (var i=0; i<semanticgroups.length; i++) {
                if ((semanticgroups[i] == "Behavior & Activity") || (semanticgroups[i] == "Behavior &amp; Activity")) {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-behavior').checked;
                }
                else if (semanticgroups[i] == "Anatomy") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-anatomy').checked;
                }
                else if ((semanticgroups[i] == "Chemicals & Drugs") || (semanticgroups[i] == "Chemicals &amp; Drugs")) {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-chemicals').checked;
                }
                else if ((semanticgroups[i] == "Diseases & Disorders") || (semanticgroups[i] == "Diseases &amp; Disorders")) {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-diseases').checked;
                }
                else if ((semanticgroups[i] == "Genes & Molecular Sequences") || (semanticgroups[i] == "Genes &amp; Molecular Sequences")) {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-genes').checked;
                }
                else if (semanticgroups[i] == "Living Beings") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-living').checked;
                }
                else if (semanticgroups[i] == "Physiology") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-physiology').checked;
                }
                else if (semanticgroups[i] == "New") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-new').checked;
                }
                else if (semanticgroups[i] == "Other") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-other').checked;
                }
                else if (semanticgroups[i] == "null") {
                    suppressed = ! linker.getNavigationDocument().getElementById('wikifier-other').checked;
                }
            }
            return suppressed;
        },
        getSemanticTypeClassName: function(concept) {
            var semanticgroups = concept.semanticgroups();
            if (0 < semanticgroups.length) {
                switch ( semanticgroups[0] ){
                    case "Behavior & Activity":
                    case "Behavior &amp; Activity": return 'wikifier-yellow';
                    case "Anatomy": return 'wikifier-blue';
                    case "Chemicals & Drugs":
                    case "Chemicals &amp; Drugs": return 'wikifier-turquoise';
                    case "Diseases & Disorders":
                    case "Diseases &amp; Disorders": return 'wikifier-red';
                    case "Genes & Molecular Sequences":
                    case "Genes &amp; Molecular Sequences": return 'wikifier-orange';
                    case "Living Beings": return 'wikifier-green';
                    case "Physiology": return 'wikifier-pink';
                    case "New": return 'wikifier-purple';
                    default: return 'wikifier-gray';
                }
            }
            semanticgroups = null;
            return 'wikifier-gray';
        },
        getForegroundColor: function(concept) {
            switch (highlighting.getSemanticTypeClassName(concept)) {
                case 'wikifier-orange': return '#eca420';
                case 'wikifier-blue': return '#2b8bc1';
                case 'wikifier-turquoise': return '#38c0be';
                case 'wikifier-red':return '#e76f5f';
                case 'wikifier-yellow':return '#a38442';
                case 'wikifier-pink': return '#d763a5';
                case 'wikifier-green': return '#58bb57';
                case 'wikifier-purple': return '#FF0080';
                default: return ( linker.browser.is_gecko || linker.browser.is_safari || linker.browser.is_mac ? "#000000" : "transparent" );
            }
        },
        highlightNode: function(event) {
            if (!event.target.className.match(/wikifier-\w+-node/))
                return;

            highlighting.setColoring();

//            event.target.style.color = highlighting.getForegroundColor(event.target.concept);
//            event.target.style.textDecoration = "none";
        },
        unhighlightNode: function(event,underlined) {
            if (!event.target.className.match(/wikifier-\w+-node/))
                return;

            highlighting.removeColoring();

//            event.target.style.color = "";
//            event.target.style.textDecoration = "";
        },
        highlightClick: function(event) {
            // stopping event bubbling
            event.preventDefault();
            event.stopPropagation();

            if (!event.target.className.match(/wikifier-\w+-node/))
                linker.utils.fireEvent(event.target.parentNode, "click");
        },
        getEnclosingUrl: function(node) {
            while (null !== node) {
                if((node.nodeType==1) && (node.tagName.toLowerCase()=="a") && (node.className!="wikihighlight"))
                    return node;
                node = node.parentNode;
            }

            return null;
        },
        getFontNode: function(node) {
            for (var c=0; c<node.childNodes.length; c++ ) {
                if (node.childNodes[c].className.indexOf("wikihighlight") != -1)
                    return node.childNodes[c];
            }

            return null;
        },
        /*
         * &new=[(umls/C0024530,mulligen@knewco.com,20070512),(uniprot/P1221,weeber@knewco.com,20070513)]
         */
        getNewCooccurrences: function(url) {
            var i = 0;
            var startPos, endPos, argument, elts, parts;
            var result = [];
            startPos = url.indexOf( "new=[(" );
            if ( startPos != -1 ){
                endPos = url.indexOf( ")]" );
                argument = linker.utils.trimSquare(url.slice( startPos + 4, endPos ));
                elts = argument.split("),");
                for ( j = 0; j < elts.length ; j++ ){
                    if ( elts[j] !== "" ){
                        parts = elts[j].split( "," );
                        for ( p = 0 ; p < parts.length ; p++ ){
                            parts[p] = linker.utils.trimSquare(parts[p]);
                            if ( parts[p][1] == 'u' ){ // unicode encoding
                                parts[p] = parts[p].substr(2);
                            }
                            parts[p] = linker.utils.unquote(linker.utils.trimRound(parts[p]));
                        }
                        result[result.length] = parts;
                    }
                }
            }
            return result;
        },
        /*
         * This method is called when a HREF has been enriched with tagged elements. If the popup
         * menu is shown, the hyperlink is not followed.
         */
        indirectCall: function(event) {
            var node = linker.processDocument.getElementById('wikifier-menu-container');
            if ((null !== node) && (node.style.display == "none")) {
                var urlNode = highlighting.getEnclosingUrl(event.target);
                linker.ui.openURL(urlNode,urlNode.indirectUrl);
            }
        },
        setUrlForHighlightNode: function(highlightNode, urlNode) {
            if (urlNode !== null) {
                var fontNode = highlighting.getFontNode(highlightNode);
                if (fontNode !== null) {
                    fontNode.url = urlNode.indirectUrl;
                }
            }
        },
        ShowConcepts: function(f) {
            try {
                if (linker.processWindow.currentcacheelt!==null) {
                    linker.ui.showPB("presentation of analysis results");

                    try {
                        var widget = linker.getNavigationDocument().getElementById("wikifier-enrich");
                        var checked = widget.checked;
                    } catch(e) {
                        var checked = true;
                    }
                    // parse the URL for arguments passed for highlighting
                    highlighting.new_concepts = highlighting.getNewCooccurrences(unescape(linker.url));
                    self.setTimeout(function() {
                        highlighting.highlightCallback(f, true, checked);
                    }, 0);
                }
            }catch(e){
                linker.log.WriteDebugLine("error in ShowConcepts", e);
                linker.ui.hidePB();
            }
        }
    });


    // coloring functions
    linker.extend(highlighting, (function() {
        var coloringTimeout = null;
        var blockedColoring = false;

        return {
            setColoring: function() {
                if (blockedColoring)
                    return;

                blockedColoring = true;

                if (coloringTimeout) {
                    linker.base.clearTimeout(coloringTimeout);
                    coloringTimeout = null;
                }

                if (linker.processDocument) {
                    try {
                        linker.processDocument.body.className += " wikifier-coloring-show";
                    } catch(e) {
                        linker.log.debug("failure setting color", e);
                    }
                }
            },
            removeColoring: function() {
                blockedColoring = false;

                coloringTimeout = setTimeout(function() {
                    coloringTimeout = null;

                    if (linker.processDocument) {
                        try {
                            linker.processDocument.body.className = linker.processDocument.body.className.replace(new RegExp("(^|\\s)wikifier-coloring-show($|\\b)", "g"), "");
                        } catch(e) {
                            linker.log.debug("failure removing color", e);
                        }
                    }
                }, 10000);
            }
        };
    })());
});
linker.addModule("subject", function(linker) {
    if ("object" != typeof linker.subject)
        linker.subject = {};

    var subject = linker.subject;


    linker.extend(subject, {
        Position: function() {
            var startPos = -1;
            var endPos = -1;
            var concept = null;
        },

        Fingerprint: function() {
            this.concepts = [];
            this.offset = 0;
            this.positions = null;

            subject.FingerprintInit(this);
        },
        FingerprintInit: function(fp) {
            linker.extend(fp, {
                add: function(id) {
                    var concept = new subject.Concept();

                    if ("undefined" != typeof id) {
                        concept.id = id;
                        this.concepts[id] = concept;
                    }

                    return this.concepts[this.concepts.length] = concept;
                },
                find: function(id) {
                    if (this.concepts[id])
                        return this.concepts[id];

                    return null;
                },
                destroy: function() {
                    linker.utils.map("destroy", this.concepts);
                    this.concepts = [];
                },
                last: function () {
                    if (0 < this.concepts.length)
                        return this.concepts[this.concepts.length-1];

                    return null;
                },
                extractpositions: function() {
                    if (null === this.positions) {
                        this.positions = [];

                        var starts = new Object();
                        var last = this.concepts.length-1;
                        for (var c=0; c<this.concepts.length; ++c) {
                            for (var w=0; w<this.concepts[c].words.length; ++w) {
                                var pos_start = this.concepts[c].words[w].pos + this.offset;
                                var pos_end = pos_start + this.concepts[c].words[w].len;

                                if ("undefined" != typeof starts["_"+pos_start]) {
                                    this.positions[starts["_"+pos_start]].concepts.push(this.concepts[c].id);
                                } else {
                                    starts["_"+pos_start] = this.positions.length;
                                    var position = new subject.Position();
                                    position.startPos = pos_start;
                                    position.endPos = pos_end;
                                    position.concept =  c;
                                    position.concepts = [this.concepts[c].id];
                                    position.concepts["_"+c] = this.concepts[c].id;
                                    position.firstWord = this.concepts[c].words[w].text;
                                    position.clid = this.concepts[c].words[w].clid;
                                    this.positions[this.positions.length] = position;
                                }
                            }
                        }

                        starts = null;

                        this.positions.sort(function(a, b) {
                            return a.startPos - b.startPos;
                        });

                        if (0 < this.positions.length) {
                            if (1 < this.positions[0].concepts.length) {

                                this.positions[0].concepts.sort();

                                var k = 0;
                                while (k < this.positions[0].concepts.length-1) {
                                    if (this.positions[0].concepts[k] == this.positions[0].concepts[k+1]) {
                                        this.positions[0].concepts.splice(k+1,1);
                                        k--;
                                    }
                                    k++;
                                }
                            }
                        }

                        // combine positions
                        var c = 0;
                        while (c < this.positions.length-1) {

                            if (1 < this.positions[c+1].concepts.length) {

                                this.positions[c+1].concepts.sort();

                                var k = 0;
                                while (k < this.positions[c+1].concepts.length-1) {
                                    if (this.positions[c+1].concepts[k] == this.positions[c+1].concepts[k+1]) {
                                        this.positions[c+1].concepts.splice(k+1,1);
                                        k--;
                                    }
                                    k++;
                                }
                            }

                            if ( this.positions[c+1].clid == this.positions[c].clid ){
                            //if (this.positions[c+1].startPos - this.positions[c].endPos <= 5) {
                                var intersection = linker.utils.intersect(this.positions[c+1].concepts, this.positions[c].concepts);
                                if (0 < intersection.length) {
                                    this.positions[c].endPos = this.positions[c+1].endPos;
                                    this.positions[c].concepts = intersection;
                                    this.positions.splice(c+1,1);
                                    c--;
                                }
                            }
                            c++;
                        }
                    }
                    return this.positions;
                },
                setOffset: function(offset) {
                    this.offset = offset;
                    this.extractpositions();
                },
                parse: function(response) {
                    var self = this;
                    linker.base.setTimeout(function() {
                        self.subParse(response, response.text);
                    }, 0);
                },
                subParse: function(response, xml) {
                    if ("string" == typeof xml) {
                        if ("<id" == xml.substr(0, 3)) {
                            var pos = xml.indexOf("</id>");
                            if (-1 != pos)
                                xml = xml.substr(pos+5);
                        }

                        if ("<response" != xml.substr(0, 9))
                            xml = "<response>" + xml;

                        if ("</response>" != xml.substr(xml.length-11))
                            xml += "</response>";

                        xml = linker.utils.getXMLDOM(xml);
                    }


                    var fp = {};

                    var add = function(o, node) {
                        var obj = null;
                        if (node.attributes.length) {
                            obj = {};
                            for (var i=0; i<node.attributes.length; i++) {
                                obj[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
                            }
                        }
                        if (node.childNodes.length) {
                            for (var i=0; i<node.childNodes.length; i++) {
                                if (1 == node.childNodes[i].nodeType)
                                {
                                    if (null === obj) {
                                        obj = {};
                                    }

                                    add(obj, node.childNodes[i]);
                                }
                            }
                        }
                        if (1 == node.childNodes.length && 3 == node.childNodes[0].nodeType) {
                            if (null === obj) {
                                obj = node.childNodes[0].nodeValue;
                            } else {
                                obj.value = node.childNodes[0].nodeValue;
                            }
                        }
                        if (null === obj) {
                            obj = {};
                        }
                        if (o[node.tagName]) {
                            if ("undefined" === typeof o[node.tagName].push) {
                                o[node.tagName] = [ o[node.tagName] ];
                            }
                            o[node.tagName].push(obj);
                        } else {
                            o[node.tagName] = obj;
                        }
                    };

                    add(fp, xml.documentElement);
                    fp = fp.response;

                    xml = null;


                    if (fp.fingerprint.concepts.count === "0") {
                        linker.ui.hidePB();
                    } else {
                        if (!(fp.fingerprint.concept instanceof Array))
                            fp.fingerprint.concept = [ fp.fingerprint.concept ];

                        for ( var i = 0 ; i < fp.fingerprint.concept.length ; i++ ){
                            subject.parseConcept(response.result, fp.fingerprint.concept[i]);
                            fp.fingerprint.concept[i].preferred = true;
                        }

                        /*
                         * add the mappedfrom concepts also to the concept list
                         */
                        for ( var i = fp.fingerprint.concept.length - 1 ; i >= 0 ; i-- ){
                            if ("undefined" != typeof fp.fingerprint.concept[i].mappedfrom) {
                                var concept = fp.fingerprint.concept[i];

                                concept.id = concept.mappedfrom;
                                concept.name = concept.mappedfromname;
                                concept.mappedfrom = "";
                                concept.mappedfromname = "";
                                concept.preferred = false;
                            }
                        }
                    }

                    linker.indexing.processResponseCallback(response);
                },
                shown: false
            });

            linker.utils.map(subject.ConceptInit, fp.concepts);
        },

        Concept: function() {
            this.id = "";
            this.rank = 0.0;
            this.info = null;
            this.words = [];

            subject.ConceptInit(this);
        },
        ConceptInit: function(concept) {
            linker.extend(concept, {
                name: function() {
                    return this.info.name;
                },
                add: function() {
                    return this.words[this.words.length] = {'pos':-1,'len':-1};
                },
                destroy: function() {
                    this.words = [];
                },
                mappedFromName: function() {
                    return this.info.mappedFromName;
                },
                mappedFromId: function() {
                    return this.info.mappedFromId;
                },
                semanticgroups: function() {
                    return this.info.semanticTypes;
                },
                getDefinition: function() {
                    return this.info.definition;
                },
                setDefinition: function(text) {
                    this.info.definition = text;
                }
            });
        },

        CacheElement: function(page) {
            this.page = page;
            this.fingerprints = [];
            this.highlightnodes = [];
            this.highlightnodesByFp = {};
            this.cached = false;

            linker.extend(this, {
                addfp: function(fp, offset) {
                    this.offset = offset;
                    fp.setOffset(this.offset);
                    return this.fingerprints[this.fingerprints.length] = fp;
                }
            });
        },

        parseWord: function(result, conceptinfo, word) {
            if ("number" != typeof word.pos)
                word.pos = parseInt(word.pos);

            var request = linker.indexing.getRequestByPos(result, word.pos);
            var conceptObj = request.request.fp.find(conceptinfo.id);
            if (conceptObj === null) {
                conceptObj = request.request.fp.add(conceptinfo.id);
                conceptObj.info = conceptinfo;
            }

            var wordObj = conceptObj.add();
            /* correct the position for the sentence offset in the combined index request */
            wordObj.pos  = Math.max(word.pos - request.offset - 1, 0);
            wordObj.len  = parseInt(word.len);
            wordObj.clid = word.clid;
            wordObj.text = word.value;
        },
        parseSemanticType: function(semanticType) {
            var semanticInfo = linker.cache.getSemanticType(semanticType.id);
            if (null === semanticInfo)
                semanticInfo = linker.cache.putSemanticType(semanticType.id, semanticType.group);
            return semanticInfo;
        },
        parseConcept: function(result, concept) {
            var conceptInfo = linker.cache.getConcept(concept.id);
            if (null === conceptInfo) {
                var semanticTypes = [];
                if (concept.semantictypes.semantictype instanceof Array) {
                    for (var s=0; s<concept.semantictypes.semantictype.length; s++){
                            semanticTypes[semanticTypes.length] = subject.parseSemanticType(concept.semantictypes.semantictype[s]);
                    }
                } else {
                    semanticTypes[semanticTypes.length] = subject.parseSemanticType(concept.semantictypes.semantictype);
                }

                conceptInfo = linker.cache.putConcept(concept.id, concept.name, concept.mappedfrom, concept.mappedfromname, semanticTypes);
            }

            if (concept.word instanceof Array) {
                for (var w=0; w<concept.word.length; w++)
                    subject.parseWord(result, conceptInfo, concept.word[w]);
            } else {
                subject.parseWord(result, conceptInfo, concept.word);
            }
        }
    });
});
linker.addModule("ui", function(linker) {
    if ("object" != typeof linker.ui)
        linker.ui = {};

    var ui = linker.ui;


    linker.extend(ui, {
        NAME:           "Linker User Interface Module",
        VERSION:        "1.0",
        LAST_MODIFIED:  ""
    });


    linker.extend(ui, {
        SplashCookieString:     "LinkerSplashScreenCount",
        SplashSessionSeen:      "LinkerSplashSessionSeen",
        caller:                 ""
    });


    linker.extend(ui, {
        ClipBoard: function() {
            txt = (linker.processWindow.getSelection) ? linker.processWindow.getSelection() : (linker.processDocument.selection ? linker.processDocument.selection.createRange() : "");
            if ("undefined" !== typeof txt.text)
                txt = txt.text;

            if ( txt !== "" ){
                var navDocument = linker.getNavigationDocument();
                if ( navDocument !== null ){
                    var widget = navDocument.getElementById( "wikifier-selectedText" );
                    if ( widget !== null ){
                        widget.value = txt;
                    }
                }
            }
        },
        ExtractTag: function(text, startTag, endTag) {
            startOffset = text.indexOf(startTag);
            if (startOffset == -1)
                return null;

            endOffset = text.indexOf(endTag, startOffset + startTag.length);
            if (endOffset != -1)
                return [text.slice(startOffset + startTag.length, endOffset), startOffset, endOffset + endTag.length];

            return [text.slice(startOffset + startTag.length), startOffset, endOffset];
        },
        isProtein: function(concept) {
            var semanticgroups = concept.semanticgroups();
            for (var i=0; i<semanticgroups.length; i++) {
                if (semanticgroups[i] == "Genes & Molecular Sequences")
                    return true;
            }
            return false;
        },
        GetDefinitionFromWiki: function(callback, concept) {
            // this function retrieves the definition from the wiki
            if (concept.getDefinition() !== "") {
                callback(concept.getDefinition(), concept);
                return;
            }

            linker.transport.getDefinition(concept.id, function(data, status) {
                callback(data, concept);
            });
        },
        ExpandTerms: function(cuiList) {
            var terms = "";

            for (var i=0; i<cuiList.length; i++) {
                cuiStr = cuiList[i];
                if (terms.length > 0) {
                    terms += " OR ";
                }
                terms += ui.ExpandTerm(cuiStr).join(" OR ");
            }
            return terms;
        },
        ExpandTerm: function(cuiStr, minSize) {
            if (minSize === undefined) {
                minSize = 500;
            }

            var terms = [];

            if (cuiStr.indexOf( "umls/C" ) === 0) {
                cui = parseFloat(cuiStr.substring(6));
                var url = HOST + "/index.py?text=" + cui + "&cmd=terms";
                var xmlhttp = linker.utils.GetXMLHttpRequest();
                try {
                    xmlhttp.async = false;
                } catch(e) {
                }

                xmlhttp.open("GET", url, false);
                xmlhttp.send(null);

                if (xmlhttp.status == 200) {
                    var text = xmlhttp.responseText;
                    while (true) {
                        TermRec = ui.ExtractTag(text, "<term>", "</term>");

                        if (TermRec === null)
                            break;

                        if (TermRec[0].length > minSize)
                            terms[terms.length] = "\"" + TermRec[0] + "\"";

                        text = text.slice( TermRec[2] );
                    }
                }
            } else {
                var concept = ui.getSavedConcept(cuiStr);
                if (concept !== null) {
                    if (concept.mappedFromId !== "") {
                        // suppress accession numbers
                        if (!linker.utils.isAccessionNumber(concept.name)) {
                            if (concept.name.length > minSize) {
                                terms[terms.length] = "\"" + ui.ReplaceSpecies( concept.name ) + "\"";
                            }
                        }
                    } else {
                        // suppress accession numbers
                        if (!linker.utils.isAccessionNumber(concept.name)) {
                            if (concept.name.length > minSize) {
                                terms[terms.length] = "\"" + ui.ReplaceSpecies( concept.name ) + "\"";
                            }
                        }
                    }
                }
            }

            return terms;
        },
        ReplaceSpecies: function(aTerm) {
            aTerm = aTerm.replace(/\(Mus Musculus\)/i, "");
            aTerm = aTerm.replace(/\(Homo Sapiens\)/i, "");
            aTerm = aTerm.replace(/\(Rattus Norvegicus\)/i, "");
            return linker.utils.trimSquare(aTerm);
        },
        addQuery: function() {
            var node = linker.processDocument.getElementById('wikifier-add-menu');
            ui.selectConceptCB(node, node.cuiList, false);
            ui.truepopdown();
        },
        activateLink: function(nodeId) {
            var node = linker.processDocument.getElementById(nodeId);
            if (null !== node)
                ui.openURL(node,node.link);
        },
        callLink: function(event) {
            var node = event.target;
            ui.openURL(node,node.link);
        },
        followLink: function() {
            ui.activateLink('followlink-reference');
        },
        callEditDefinition: function() {
            ui.activateLink('wikifier-edit-definition');
        },
        callWiki: function() {
            ui.activateLink('wikifier-viewwiki');
        },
        openConceptWeb: function() {
            ui.activateLink('wikifier-conceptweb-reference');
        },
        joinConceptWeb: function() {
            ui.openURL(null, CONCEPTWEBHOST + "/createProfile");
        },
        IsAccessible: function(document) {
            var container = document.createElement("div");
            try {
                container.style.backgroundColor = "transparent";
                return true;
            } catch(e) {
                return false;
            }
        },
        addQueryItem: function(node, cui, name) {
            if (!linker.utils.isAccessionNumber(name)) {
                var checkbox = linker.processDocument.createElement("input");
                checkbox.type = 'checkbox';
                linker.utils.addEvent(checkbox, 'click', ui.changeSelection);
                checkbox.cui = cui;
                node.appendChild(checkbox);
                checkbox.checked = ui.isSelectedConcept(checkbox.cui);

                var span = linker.processDocument.createElement("span");
                node.appendChild(span);

                span.innerHTML = ui.adjustForSpecies(cui, name);

                var br = linker.processDocument.createElement( "br" );
                node.appendChild(br);
            }
        },
        showRelatedAuthors: function(list) {
            if (0 !== list.status) {
                return;
            }

            var popup = linker.processDocument.getElementById('wikifier-menu-container' );

            var titleNode = linker.processDocument.getElementById('wikifier-title-definition');
            linker.processDocument.getElementById(dialog.id+"-title").innerHTML = titleNode.innerHTML + " - related authors:";

            var X = ui.getX(linker.processDocument, popup);
            var Y = ui.getY(linker.processDocument, popup);

            popup.style.display = "none";

            while (null !== dialog.content.firstChild)
                dialog.content.removeChild(dialog.content.firstChild);

            for (var k in list.response) {
                var name = list.response[k][0];

                if (name == undefined)
                        continue;

                var d = linker.processDocument.createElement("div");
                var a = linker.processDocument.createElement("a");
                a.href = list.response[k][1];
                a.target = "_blank";
                a.appendChild(linker.processDocument.createTextNode(name));
                d.appendChild(a);
                dialog.content.appendChild(d);
            }

            dialog.style.display = "none";
            dialog.style.left = X + "px";
            dialog.style.top =  Y + "px";
            dialog.style.zIndex = 100;
            dialog.style.display = "block";
        },
        showRelatedPublications: function(list) {
            //var title_length = 100;

            if (0 !== list.status) {
                return;
            }

            var dialog = linker.processDocument.getElementById("wikifier-publications-container");
            var popup = linker.processDocument.getElementById("wikifier-menu-container" );

            var titleNode = linker.processDocument.getElementById('wikifier-title-definition');
            linker.processDocument.getElementById(dialog.id+"-title").innerHTML = titleNode.innerHTML + " - related publications:";

            var X = ui.getX(linker.processDocument, popup);
            var Y = ui.getY(linker.processDocument, popup);

            popup.style.display = "none";

            while (null !== dialog.content.firstChild)
                dialog.content.removeChild(dialog.content.firstChild);

            for (var k in list.response) {
                var name = list.response[k][2];
                if (name == undefined)
                    continue;
                //if (title_length < name.length)
                //    name = name.substr(0, title_length-3) + "...";
                var d = linker.processDocument.createElement("div");
                var a = linker.processDocument.createElement("a");
                a.href = list.response[k][1];
                a.target = "_blank";
                //a.title = name;
                a.innerHTML = name;
                //a.appendChild(linker.processDocument.createInnerHTML(name));
                d.appendChild(a);
                dialog.content.appendChild(d);
            }

            dialog.style.display = "none";
            dialog.style.left = X + "px";
            dialog.style.top =  Y + "px";
            dialog.style.zIndex = 100;
            dialog.style.width = "400px";
            dialog.style.display = "block";
        },
        showQueryDialog: function() {
            var dialog = linker.processDocument.getElementById("wikifier-search-container");
            var querymenu = linker.processDocument.getElementById("wikifier-querylist");
            var popup = linker.processDocument.getElementById("wikifier-menu-container");
            linker.utils.clearNodes(querymenu);

            var X = ui.getX(linker.processDocument, popup);
            var Y = ui.getY(linker.processDocument, popup);

            popup.style.display = "none";

            try {
                for (var i=linker.getNavigationWindow().savedConcepts.length-1; i>=0; i--) {
                    var cui = linker.getNavigationWindow().savedConcepts[i].cui;
                    var name = linker.getNavigationWindow().savedConcepts[i].name;
                    var concept = ui.getConceptById( linker.getNavigationWindow().savedConcepts[i].cui );
                    ui.addQueryItem( querymenu, cui, name, linker.getNavigationWindow().savedConcepts[i].selected );
                }
            } catch(e) {
                WriteDebugLine("issue with adding new queryitems", e);
            }

            dialog.style.display = "none";
            dialog.style.left = X + "px";
            dialog.style.top =  Y + "px";
            dialog.style.zIndex = 100;
            dialog.style.display = "block";
        },
        closePopup: function() {
            ui.truepopdown();
        },
        closeInfoBox: function() {
            try {
                linker.processDocument.getElementById("wikifier-conceptinfobox-container").style.display = "none";
            } catch(e) {
            }
        },
        searchQueryCB: function() {
            var sources = linker.processDocument.getElementById("wikifier-sources2");
            var querymenu = linker.processDocument.getElementById("wikifier-querylist");
            if ( sources.selectedIndex != -1 ){
                ui.truepopdown();
                linker.optionCallbacks[sources.selectedIndex](this, cuiList);
            }
        },
        addBox: function(id, title) {
            var container = linker.processDocument.getElementById(id);
            if (null !== container)
                return container;

            container = linker.processDocument.createElement("div");
            container.id = id;
            container.className = "wikifier-container";

            container.style.left = 0;
            container.style.top = 0;
            container.style.display = 'none';

            var contents = linker.processDocument.createElement("div");
            contents.className = "wikifier-contents";
            container.appendChild(contents);

            var header = linker.processDocument.createElement("div");
            header.className = "wikifier-button-menu-top";
            contents.appendChild(header);

            var close = linker.processDocument.createElement("img");
            close.popup = container;
            linker.utils.addEvent(close, "click", ui.closePopup);
            close.src = linker.wikifypath("img/close.gif");
            close.className = "wikifier-closemenu";
            header.appendChild(close);

            var name = linker.processDocument.createElement("span");
            name.id = id + "-title";
            name.className = "wikifier-button-menu-text";
            name.appendChild(linker.processDocument.createTextNode(title));
            header.appendChild(name);

            var content = linker.processDocument.createElement("div");
            content.className = "wikifier-content";
            container.content = content;
            contents.appendChild(content);

            linker.processDocument.body.appendChild(container);
            return container;
        },
        addAuthorsBox: function() {
            var container = linker.processDocument.getElementById( 'wikifier-authors-container');
            if (null !== container)
                return container;

            var container = ui.addBox("wikifier-authors-container", "Related authors:");
            return container;
        },
        addPublicationsBox: function() {
            var container = linker.processDocument.getElementById( 'wikifier-publications-container');
            if (null !== container)
                return container;

            var container = ui.addBox("wikifier-publications-container", "Related publications:");
            return container;
        },
        addSearchBox: function() {
            if (linker.processDocument.getElementById( 'wikifier-search-container')===null){
                var container = linker.processDocument.createElement("div");
                container.id = "wikifier-search-container";
                container.className = "wikifier-search-container";
                try {
                    container.style.backgroundColor = "transparent";
                } catch(e) {}
                try {
                    container.style.borderColor = "transparent";
                } catch(e) {}
                container.style.left = 0;
                container.style.top = 0;
                container.style.display = 'none';

                var contents = linker.processDocument.createElement("div");
                contents.id = "wikifier-search-contents";
                container.appendChild(contents);

                var headerquerylist = linker.processDocument.createElement("div");
                headerquerylist.id = "wikifier-header-querylist";
                contents.appendChild(headerquerylist);

                var closebtn = linker.processDocument.createElement( "img" );
                closebtn.popup = container;
                linker.utils.addEvent( closebtn, "click", ui.closePopup );
                closebtn.src = linker.wikifypath("img/close.gif");
                closebtn.className = "wikifier-closemenu";
                headerquerylist.appendChild(closebtn);

                var buttonmenutext = linker.processDocument.createElement("span");
                buttonmenutext.className = "wikifier-button-menu-text";
                headerquerylist.appendChild(buttonmenutext);

                buttonmenutext.appendChild( linker.processDocument.createTextNode( "Concepts in search query: " ) );

                var querymenu = linker.processDocument.createElement("div");
                querymenu.id = 'wikifier-query-menu';
                contents.appendChild(querymenu);

                var ahref = linker.processDocument.createElement("span");
                ahref.id = "wikifier-clear-button";
                linker.utils.addEvent(ahref,"click", ui.ClearQueryCB);

                querymenu.appendChild(ahref);

                ahref.appendChild(linker.processDocument.createTextNode("empty list"));

                var querylist = linker.processDocument.createElement( "div" );
                querylist.id = "wikifier-querylist";
                querylist.style.overflow = 'hidden';
                querymenu.appendChild( querylist );

                var querybottommenu = linker.processDocument.createElement( "div" );
                querybottommenu.id = "wikifier-query-menu-bottom";
                contents.appendChild( querybottommenu );

                var sourceselect = linker.processDocument.createElement( "select" );
                sourceselect.id = 'wikifier-sources2';
                querybottommenu.appendChild( sourceselect );

                ui.addSourceItem(sourceselect, "Google", ui.GoogleCB);
                //ui.addSourceItem(sourceselect, "Federated Search", ui.SieveCB);
                ui.addSourceItem(sourceselect, "Concept Web", ui.KnowletCB);
                //ui.addSourceItem(sourceselect, "Explore Associations", ui.HoweverCB);
                ui.addSourceItem(sourceselect, "PubMed", ui.PubMedCB);
                ui.addSourceItem(sourceselect, "BioMedCentral", ui.BMCCB);
                ui.addSourceItem(sourceselect, "SpringerLink", ui.SpringerLinkCB);
                ui.addSourceItem(sourceselect, "Google Scholar", ui.GoogleScholarCB);
                ui.addSourceItem(sourceselect, "Google Patents", ui.GooglePatentCB);
                ui.addSourceItem(sourceselect, "Yahoo", ui.YahooCB);
                ui.addSourceItem(sourceselect, "CRISP", ui.CRISPCB);
                ui.addSourceItem(sourceselect, "NIH Grants", ui.NIHGrantsCB);

                var searchquery = linker.processDocument.createElement( "span" );
                searchquery.id = "wikifier-search-query";
                linker.utils.addEvent(searchquery,'click', ui.searchQueryCB);
                querybottommenu.appendChild(searchquery);

                var image = linker.processDocument.createElement("img");
                image.src = linker.wikifypath("img/wikifier-query-icon.gif");
                searchquery.appendChild(image);

                searchquery.appendChild(linker.processDocument.createTextNode(" Search"));

                linker.processDocument.body.appendChild(container);
                return false;
            } else {
                return true;
            }
        },
        addSourceItem: function(father, text, callback) {
            var option = linker.processDocument.createElement("option");
            option.className = "wikifier-source";
            option.id = text;
            linker.optionCallbacks[linker.optionCallbacks.length] = callback;
            father.appendChild( option );
            option.appendChild( linker.processDocument.createTextNode( text ) );
        },
        changeSelection: function(event) {
            var target = event.target;
            var savedConcept = ui.getSavedConcept(target.cui);
            if ((savedConcept!==null)&&(savedConcept.selected!=target.checked)){
                savedConcept.selected=target.checked;
                var selectNodes = ui.getSelectedNodes(target.cui);
                for (var j=0;j<selectNodes.length;j++){
                    var ids=linker.utils.splitIds(selectNodes[j].id )[1];
                    var selected=target.checked;
                    for(i=0;i<ids.length;i++){
                        if(ids[i]==target.cui)continue;
                        var otherConcept = ui.getSavedConcept(ids[i]);
                        if((otherConcept!==null)&&(otherConcept.selected)){
                            selected=true;
                            break;
                        }
                    }
                    ui.ShowHighlight(selectNodes[j],selected);
                }
            }
        },
        ExtractSpecies: function(cui) {
            var Species = null;
            if ( cui.indexOf( "uniprot" ) != -1 ){
                var concept = ui.getConceptById( cui );
                if ( concept != undefined ){
                    var aTerm = concept.name();
                    lpos = aTerm.length-1;
                    if ( aTerm.charAt(lpos) == ")" ){
                        bpos = aTerm.lastIndexOf("(");
                        if ( bpos != -1 ){
                            var Species = aTerm.substring(bpos+1,lpos);
                        }
                    }
                }
            }
            return Species;
        },
        adjustForSpecies: function(cui, aTerm) {
            var Species = ui.ExtractSpecies(cui);
            if (Species) {
                var bpos = aTerm.lastIndexOf("(");
                aTerm = aTerm.substring(0, bpos-1) + "<font size=-3>" + " (<i>" + Species + "</i>\)" + "</font>";
            }
            return aTerm;
        },
        disableSplashScreen: function() {
            ui.IncreaseSplashCookieCount(true);
        },
        IncreaseSplashCookieCount: function(disable) {
            if (disable) {
                var newCount = -1;
            } else {
                var count = linker.utils.readCookie(ui.SplashCookieString);
                var newCount = (count === null) ? 1 : (parseInt(count) == -1 ? -1 : (parseInt(count) + 1));
            }
            linker.utils.createCookie(ui.SplashCookieString,disable ? -1 : newCount,3650); //  set for 10 years
            linker.utils.createCookie(ui.SplashSessionSeen, true);
        },
        closeSplashScreen: function() {
            try {
                menu = linker.processDocument.getElementById('wikifier-infobox-container');
                if (null !== menu) {
                    menu.style.display = 'none';
                    menu.visible = false;
                }
                var node = linker.processDocument.getElementById('nosplash');
                if (null !== node)
                    ui.IncreaseSplashCookieCount(node.checked);
            } catch(e) {
            }
        },
        addMenu: function() {
            // This function creates a div that can be used for showing the menu.
            if (linker.processDocument.getElementById("wikifier-menu-container") === null) {
                var container = linker.processDocument.createElement("div");
                container.id = "wikifier-menu-container";
                container.className = "wikifier-menu-container";
                container.style.display = "none";
                linker.processDocument.body.appendChild(container);

                var contents = linker.processDocument.createElement("div");
                contents.id = "wikifier-menu-contents";
                container.appendChild(contents);

                ui.createLogoButton(linker.processDocument,contents);

                var topmenu = linker.processDocument.createElement("div");
                topmenu.className = "wikifier-button-menu-top";
                contents.appendChild(topmenu);

                var closebtn = linker.processDocument.createElement( "img" );
                closebtn.popup = container;
                linker.utils.addEvent(closebtn,'click', ui.closePopup);
                closebtn.src = linker.wikifypath("img/close.gif");
                closebtn.className = "wikifier-closemenu";
                topmenu.appendChild( closebtn );

                var topspan = linker.processDocument.createElement( "div" );
                topspan.className = "wikifier-close-span";
                topspan.style.width = "180px";
                topmenu.appendChild(topspan);

                var h4 = linker.processDocument.createElement("div");
                h4.id = "wikifier-title-definition";
                h4.className = "wikifier-turquoise";
                h4.style.width = "175px";
                topspan.appendChild(h4);

                var buttonmenu = linker.processDocument.createElement("div");
                buttonmenu.className = "wikifier-button-menu";
                buttonmenu.id = "wikifier-add-menu";
                linker.utils.addEvent(buttonmenu,'click', ui.addQuery);
                buttonmenu.cuiList = null;
                buttonmenu.style.cursor = 'pointer';
                contents.appendChild(buttonmenu);

                var addqueryicon = linker.processDocument.createElement("img");
                addqueryicon.className = "wikifier-icon";
                addqueryicon.src = linker.wikifypath("img/wikifier-add-icon.gif");
                buttonmenu.appendChild(addqueryicon);

                var buttonmenutext = linker.processDocument.createElement("span");
                buttonmenutext.className = "wikifier-button-menu-text";
                buttonmenutext.innerHTML = "Add to search query";
                buttonmenu.appendChild(buttonmenutext);

                var buttonmenu2 = linker.processDocument.createElement("div");
                buttonmenu2.className = "wikifier-button-menu";
                buttonmenu2.id = "wikifier-search-menu";
                buttonmenu2.style.cursor = 'pointer';
                contents.appendChild(buttonmenu2);

                var queryicon = linker.processDocument.createElement("img");
                queryicon.className = "wikifier-icon";
                queryicon.src = linker.wikifypath("img/wikifier-query-icon.gif");
                buttonmenu2.appendChild(queryicon);

                var buttonmenutext2 = linker.processDocument.createElement("span");
                buttonmenutext2.className = "wikifier-button-menu-text";
                buttonmenutext2.innerHTML = "View query and search";
                buttonmenutext2.popup = container;
                linker.utils.addEvent(buttonmenutext2,'click', ui.showQueryDialog);

                buttonmenu2.appendChild(buttonmenutext2);

                var definitionmenu = linker.processDocument.createElement("div");
                definitionmenu.id = "wikifier-definition-menu";
                contents.appendChild(definitionmenu);

                var definitiondiv = linker.processDocument.createElement("div");
                definitiondiv.id = "wikifier-text-definition";
                definitiondiv.style.overflow = 'hidden';
                definitiondiv.innerHTML = "";
                definitionmenu.appendChild(definitiondiv);

                var viewwikiref = linker.processDocument.createElement("span");
                viewwikiref.id = "wikifier-viewwiki";
                if ( linker.ERIK ){
                    linker.utils.addEvent(viewwikiref,'click', ui.myhint2);
                }
                else{
                    linker.utils.addEvent(viewwikiref,'click', ui.callWiki);
                }
                definitionmenu.appendChild(viewwikiref);

                if ( linker.ERIK ){
                    var wikitext = linker.processDocument.createTextNode("more..");
                }

                var buttonbottommenu2 = linker.processDocument.createElement("div");
                buttonbottommenu2.className = "wikifier-button-menu";
                buttonbottommenu2.id = "wikifier-border-bottom";
                buttonbottommenu2.disabled = true;
                buttonbottommenu2.style.cursor = 'pointer';
                contents.appendChild(buttonbottommenu2);

                ui.createAdButton(linker.processDocument,contents);

                var icon2 = linker.processDocument.createElement("img");
                icon2.className = "wikifier-icon";
                icon2.src = linker.wikifypath("img/wikifier-link-icon.gif");
                buttonbottommenu2.appendChild(icon2);

                var followlink = linker.processDocument.createElement("span");
                followlink.id = "followlink-reference";
                followlink.className = "wikifier-button-menu-text";
                followlink.innerHTML = "Follow this link";
                linker.utils.addEvent(followlink, 'click', ui.followLink);
                buttonbottommenu2.appendChild(followlink);

                // Related Authors
                var panel = linker.processDocument.createElement("div");
                panel.className = "wikifier-button-menu-bottom";
                panel.style.cursor = 'pointer';
                contents.appendChild(panel);

                icon = linker.processDocument.createElement("img");
                icon.className = "wikifier-icon";
                icon.src = linker.wikifypath("img/wiki-icon.gif");
                panel.appendChild(icon);

                var link = linker.processDocument.createElement("span");
                link.id = "wikifier-authors-reference";
                link.className = "wikifier-button-menu-text";
                link.appendChild(linker.processDocument.createTextNode("Show related experts"));
                linker.utils.addEvent(link,'click', ui.openRelatedAuthors);

                panel.appendChild(link);

                // Related Publications
                panel = linker.processDocument.createElement("div");
                panel.className = "wikifier-button-menu-bottom";
                panel.style.cursor = 'pointer';
                contents.appendChild(panel);

                icon = linker.processDocument.createElement("img");
                icon.className = "wikifier-icon";
                icon.src = linker.wikifypath("img/wiki-icon.gif");
                panel.appendChild(icon);

                link = linker.processDocument.createElement("span");
                link.id = "wikifier-publications-reference";
                link.className = "wikifier-button-menu-text";
                link.appendChild(linker.processDocument.createTextNode("Show related publications"));
                linker.utils.addEvent(link,'click', ui.openRelatedPublications);

                panel.appendChild(link);

                // Open in Concept Web
                var buttonbottommenu = linker.processDocument.createElement("div");
                buttonbottommenu.className = "wikifier-button-menu-bottom";
                buttonbottommenu.style.cursor = 'pointer';
                contents.appendChild(buttonbottommenu);

                var icon = linker.processDocument.createElement("img");
                icon.className = "wikifier-icon";
                icon.src = linker.wikifypath("img/wiki-icon.gif");
                buttonbottommenu.appendChild(icon);

                var openconceptweb = linker.processDocument.createElement("span");
                openconceptweb.id = "wikifier-conceptweb-reference";
                openconceptweb.className = "wikifier-button-menu-text";
                openconceptweb.appendChild(linker.processDocument.createTextNode("Connected concepts"));
                linker.utils.addEvent(openconceptweb,'click', ui.openConceptWeb);

                buttonbottommenu.appendChild(openconceptweb);


                // Join the Concept Web
                var buttonbottommenu = linker.processDocument.createElement("div");
                buttonbottommenu.className = "wikifier-button-menu-bottom";
                buttonbottommenu.style.cursor = 'pointer';
                contents.appendChild(buttonbottommenu);

                var icon = linker.processDocument.createElement("img");
                icon.className = "wikifier-icon";
                icon.src = linker.wikifypath("img/wiki-icon.gif");
                buttonbottommenu.appendChild(icon);

                var joinconceptweb = linker.processDocument.createElement("span");
                joinconceptweb.id = "wikifier-conceptweb-reference";
                joinconceptweb.className = "wikifier-button-menu-text";
                joinconceptweb.appendChild(linker.processDocument.createTextNode("Join the Concept Web"));
                linker.utils.addEvent(joinconceptweb,'click', ui.joinConceptWeb);

                buttonbottommenu.appendChild(joinconceptweb);

                // Amazon books
                var bookmenu = linker.processDocument.createElement("div");
                bookmenu.id = "wikifier-book-menu";
                contents.appendChild(bookmenu);
                var bookdiv = linker.processDocument.createElement("div");
                bookdiv.id = "wikifier-text-book";
                bookdiv.style.overflow = 'hidden';
                bookdiv.innerHTML = "";
                bookmenu.appendChild(bookdiv);
            }
        },
        openRelatedAuthors: function() {
            var cuiList = linker.processDocument.getElementById('wikifier-add-menu').cuiList;

            linker.transport.getRelatedAuthors(cuiList, ui.showRelatedAuthors);
        },
        openRelatedPublications: function() {
            var cuiList = linker.processDocument.getElementById('wikifier-add-menu').cuiList;

            linker.transport.getRelatedPublications(cuiList, ui.showRelatedPublications);
        },
        openHelp: function() {
            var url = LANDINGPAGE;

            if ("undefined" !== typeof window.openWikifyHelp)
                url = openWikifyHelp();

            if (url) {
                if (!url.match(/^https?:\/\//))
                    url = "http://" + url;

                ui.openURL(null, url, true);
            }
        },
        createSplashScreen: function() {
		// Disable splash screen
		return;

            var count = linker.utils.readCookie(ui.SplashCookieString);
            var seen = linker.utils.readCookie(ui.SplashSessionSeen);

            if ( ( seen == "true" ) || ( parseInt(count) == -1 ) ){
                return;
            }

            if ( linker.processDocument.getElementById( 'wikifier-infobox-container' ) === null ){
                var container = linker.processDocument.createElement("div");
                container.id = "wikifier-infobox-container";
                container.className = "wikifier-infobox-container";

                container.innerHTML =
        "<div id=\"wikifier-infobox-contents\">"+
        "    <div id=\"wikifier-definition-menu\">"+
        "       <div style=\"overflow: hidden;\" id=\"wikifier-text-information\">"+
        "            <div><img src=\""+linker.wikifypath("img/linker-help.gif")+"\"/></div>"+
        "            <div id=\"wikifier-custom-splash\" style=\"margin-left: 8px; margin-right: 8px;\"></div>"+
        "            <div><input id=\"wikifier-closemenu\" class=\"wikifier-closesplash\" type=\"button\" style=\"margin-left: 8px; margin-right: 8px;\" value=\"Close this window\"/> <input type=\"checkbox\" id=\"nosplash\"/> Don't show this information again</div>"+
        "        </div>"+
        "    </div>"+
        "</div>";

                linker.processDocument.body.appendChild(container);

                if ("undefined" !== typeof window.insertWikifySplash) {
                    var place = linker.processDocument.getElementById("wikifier-custom-splash");
                    insertWikifySplash(place);
                }

                linker.utils.addEvent(linker.processDocument.getElementById("wikifier-closemenu" ), "click", ui.closeSplashScreen );
            }
        },
        SetCuiList: function(cuiList) {
            try {
                linker.processDocument.getElementById('wikifier-add-menu').cuiList = cuiList;
            } catch (e) {
                WriteDebugLine( "error setting cuiList" );
            }
        },
        SetDefinitionAndShow: function(text, concept) {
            var w = linker.processDocument.getElementById('wikifier-text-definition');
            ui.SetDefinition(text,concept);
            ui.myhint2(oldEvent);
        },
        SetDefinition: function(text, concept) {
            // this function sets the definition in the popup menu
            var xmlDoc;
            var items = null;
            var info = null;
            var viewURL = "";
            var editURL = "";

            if ( typeof(concept) === "string" ){
                concept = ui.getConceptById(concept);
            }

            var evalText = "";
            var resultText = text;
            try {
                xmlDoc = linker.utils.getXMLDOM(text);
                var extendedInfo = xmlDoc.getElementsByTagName("extendedInfo");
                viewURL = extendedInfo[0].getAttribute('viewURL');
                editURL = extendedInfo[0].getAttribute('editURL');
                var infoItems = extendedInfo[0].childNodes;

                if ( info === null )
                    info = [];

                for (var i = 0; i < infoItems.length; i++) {
                    if (infoItems[i].nodeType != 1)
                        continue;

                    var mainAttribute = infoItems[i].getAttribute('name');
                    if (!mainAttribute)
                        continue;

                    if ("undefined" == typeof info[mainAttribute])
                        info[mainAttribute] = [];

                    for (var j=0; j<infoItems[i].childNodes.length; j++) {
                        if (infoItems[i].childNodes[j].nodeType != 1)
                            continue;

                        var subattribute = infoItems[i].childNodes[j].getAttribute('name');

                        if (!subattribute)
                            subattribute = "#";

                        if ("undefined" == typeof info[mainAttribute][subattribute])
                            info[mainAttribute][subattribute] = [];

                        try {
                            info[mainAttribute][subattribute].push(infoItems[i].childNodes[j].childNodes[0].nodeValue);
                        } catch (e) {
                            info[mainAttribute][subattribute].push(infoItems[i].childNodes[j].nodeValue);
                        }
                    }
                }
		
		    try {
                    evalText = info["Definition"]["definition"][0] + "<br/>";
                } catch (e) {
                }

                if (evalText) {
                    try {
                        if (ui.isProtein(concept)) {
                            for (var i=0; i<info["Functional information"]["has function"].length; i++) {
                                evalText += "Function: " + info["Functional information"]["has function"][i] + "<br/>";
                            }
                        } else {
                            for ( var i = 0 ; i < info["Also known as"]["#"].length ; i++  ) {
                                var goodValue = true;
                                var valueI = info["Also known as"]["#"][i].toLowerCase();
					
                                for ( var j = i + 1 ; j < info["Also known as"]["#"].length ; j++  ) {
                                    var valueJ = info["Also known as"]["#"][j].toLowerCase();
                                        if (valueI == valueJ || valueI + "s" == valueJ || valueI == valueJ + "s") {
                                        goodValue = false;
                                    }
                                }

                                if (concept !== null && (concept.name().toLowerCase() == valueI ||
                                    concept.name().toLowerCase() + "s" == valueI ||
                                    concept.name().toLowerCase() == valueI + "s")) {
                                    goodValue = false;
                                }

                                if (goodValue)
                                    evalText += "Also known as: " + info["Also known as"]["#"][i] + "<br/>";
                            }
                        }
                    } catch(e) {
                    }
                }

              resultText = evalText;
            } catch(e) {
            }

            if (concept) {
                concept.setDefinition( resultText );

                var cuiList = linker.processDocument.getElementById('wikifier-add-menu').cuiList;

                loop:
                while (true) {
                    for (var i=0; i<cuiList.length; ++i) {
                        if (concept.id == cuiList[i])
                            break loop; // go to definition setting
                    }

                    return; // ignore this definition cause it is not for current popup
                }
            }

            var defaultDefinition = "Definitions are from Wikiprofessional, which does not contain a valid definition for this concept yet. Please define this concept for the community by clicking the 'Connected concepts' link and then the [edit] button in the definition field, which can be found on the right hand side of the Concept Web page.";

            linker.processDocument.getElementById('wikifier-text-definition').definitionInfo = info;
            linker.processDocument.getElementById('wikifier-text-definition').viewURL = viewURL;
            linker.processDocument.getElementById('wikifier-text-definition').editURL = editURL;

            linker.processDocument.getElementById('wikifier-text-definition').innerHTML = (resultText === "") ? ui.truncateDefinition(defaultDefinition) : ui.truncateDefinition(resultText);
            linker.processDocument.getElementById('wikifier-text-definition').definitionText = (resultText === "") ? defaultDefinition : resultText;

            if (!linker.ERIK ) {
                linker.utils.addEvent(linker.processDocument.getElementById('wikifier-text-definition'), 'mouseover', ui.myhint);
            }
        },
        showProtein: function(event, definitionInfo, viewURL, editURL, conceptName) {
            var target = event.target;
            var definitionNode = null;
            var maintable = linker.processDocument.getElementById( "wikifier-conceptinfo-table" );

            clearTable(maintable);

            createANode( maintable, "Go to full WikiProfessional page", WIKIHOST + viewURL );

            for ( key in definitionInfo ){
                var submenu = createNode( maintable, key, false );
                for ( subkey in definitionInfo[key] ){
                    if ( subkey === "" || subkey === "definition" ){
                        var subsubmenu = submenu;
                    }
                    else{
                        var subsubmenu = createNode( submenu, subkey, false );
                    }

                    for ( i = 0 ; i < definitionInfo[key][subkey].length ; i++ ){
                        var node = createNode( subsubmenu, definitionInfo[key][subkey][i], true, WIKIHOST + editURL );
                        if ( subkey === "definition" ){
                            definitionNode = submenu;
                        }
                    }
                }
            }

            target = linker.processDocument.getElementById( "wikifier-menu-container" ).origin;

            linker.processDocument.getElementById("extended-infobox-conceptname").innerHTML = conceptName;
            ui.ContextShow(event,target,'wikifier-conceptinfobox-container');
            if (definitionNode !== null) {
                ui.Toggle(definitionNode);
            }
        },
        myhint: function(event) {
            var w = linker.processDocument.getElementById('wikifier-text-definition');
            if (null !== w) {
                if ( w.definitionText === "" ){
                    showhint( "WikiProfessional does not contain a valid definition for this concept yet. Please define this concept for the community by clicking the [edit] button in the definition field.", w, event, '300px');
                }
                else{
                    showhint(w.definitionText, w, event, '300px');
                }
            }
        },
        myhint2: function(event) {
            var w = linker.processDocument.getElementById('wikifier-text-definition');
            var concept = ui.getConceptById(w.concept.id);

            if ( w.definitionInfo === null ){
                concept.setDefinition("");
                oldEvent = event;
                ui.GetDefinitionFromWiki(ui.SetDefinitionAndShow,concept);
            } else {
                showProtein( event, w.definitionInfo, w.viewURL, w.editURL, concept.name() );
            }
        },
        createNode: function(parent, label, leaf, editURL) {
            leaf = leaf || false;

            var tr = linker.processDocument.createElement( "tr" );
            parent.appendChild( tr );

            var td = linker.processDocument.createElement( "td" );
            tr.appendChild( td );

            var table = linker.processDocument.createElement( "table" );
            td.appendChild( table );

            var subtr = linker.processDocument.createElement( "tr" );
            table.appendChild( subtr );

            var subtd = linker.processDocument.createElement( "td" );
            subtr.appendChild( subtd );

            if (leaf === false) {
                var ahref = linker.processDocument.createElement( "a" );
                //linker.utils.addEvent( ahref, "click", ui.Toggle );
                subtd.appendChild( ahref );

                var img = linker.processDocument.createElement( "img" );
                img.src = linker.wikifypath("images/plus.gif");
                ahref.appendChild( img );

                var bold = linker.processDocument.createElement( "b" );
                ahref.appendChild( bold );

                var text = linker.processDocument.createTextNode( "  " + label );
                bold.appendChild( text );
            } else {
                subtd.appendChild( linker.processDocument.createTextNode( "  " + label ) );

                subtd.appendChild( linker.processDocument.createElement( "br" ) );

                var a = linker.processDocument.createElement( "a" );
                a.href = editURL;
                subtd.appendChild(a);

                a.appendChild( linker.processDocument.createTextNode( "(edit)" ) );
            }

            var div = linker.processDocument.createElement( "div" );
            div.id = label + "_menu";
            div.style.display = "none";
            subtd.appendChild(div);

            if (leaf === false) {
                ahref.onclick = function() {
                    ui.Toggle(div);
                };
            }

            return div;
        },
        createANode: function(parent, label, href) {
            var tr = linker.processDocument.createElement( "tr" );
            parent.appendChild( tr );

            var td = linker.processDocument.createElement( "td" );
            tr.appendChild( td );

            var table = linker.processDocument.createElement( "table" );
            td.appendChild( table );

            var subtr = linker.processDocument.createElement( "tr" );
            table.appendChild( subtr );

            var subtd = linker.processDocument.createElement( "td" );
            subtr.appendChild( subtd );

            var a = linker.processDocument.createElement( "a" );
            a.href = href;
            subtd.appendChild( a );

            var text = linker.processDocument.createTextNode( "  " + label );
            a.appendChild( text );

            var div = linker.processDocument.createElement( "div" );
            div.id = label + "_menu";
            div.style.display = "none";
            subtd.appendChild( div );

            return div;
        },
        addConceptInfoBox: function() {
            if (linker.processDocument.getElementById( 'wikifier-conceptinfobox-container')===null){
                var container = linker.processDocument.createElement("div");
                container.id = "wikifier-conceptinfobox-container";
                container.className = "wikifier-conceptinfobox-container";
                try{
                    container.style.backgroundColor = "transparent";
                }catch(e){}
                try{
                    container.style.borderColor = "transparent";
                }catch(e){}
                container.style.left = 0;
                container.style.top = 0;
                container.style.display = 'none';
                container.style.position = 'absolute';
                linker.processDocument.body.appendChild(container);

                var contents = linker.processDocument.createElement("div");
                contents.id = "wikifier-search-contents";
                container.appendChild(contents);

                var headerquerylist = linker.processDocument.createElement("div");
                headerquerylist.id = "wikifier-header-querylist";
                headerquerylist.style.overflow = "hidden";
                //headerquerylist.style.width = '400px';
                contents.appendChild(headerquerylist);

                var closebtn = linker.processDocument.createElement( "img" );
                closebtn.popup = container;
                linker.utils.addEvent( closebtn, "click", ui.closeInfoBox );
                closebtn.src = linker.wikifypath("img/close.gif");
                closebtn.className = "wikifier-closemenu";
                headerquerylist.appendChild(closebtn);

                var bold = linker.processDocument.createElement( "b" );
                headerquerylist.appendChild( bold );

                var buttonmenutext = linker.processDocument.createElement("span");
                buttonmenutext.className = "wikifier-button-menu-text";
                buttonmenutext.id = "extended-infobox-conceptname";
                bold.appendChild(buttonmenutext);

                buttonmenutext.appendChild( linker.processDocument.createTextNode( "Information on concept: " ) );

                var tree = linker.processDocument.createElement( "div" );
                tree.id = "concept-info-tree";
                tree.className = "concept-info-tree";
                tree.style.height = '400px';
                tree.style.overflow = 'auto';
                contents.appendChild(tree);

                var maintable = linker.processDocument.createElement( "table" );
                maintable.id = "wikifier-conceptinfo-table";
                maintable.style.width = '400px';
                maintable.border = "0";

                tree.appendChild( maintable );
            }
        },
        truncateDefinition: function(text) {
            /*
             * Reduce the length of the definition to the first space after the 80th character.
             */
            try{
                if ( text.length > 80 ){
                    for ( var i = 80 ; i < text.length ; i++ ){
                        if ( text.charAt(i) == " " ){
                            text = text.slice(0,i) + "...";
                            break;
                        }
                    }
                }
                return text;
            }
            catch(e){
                return text;
            }
        },
        Toggle: function(node) {
            // Unfold the branch if it isn't visible
            if (node.style.display == 'none')
            {
                // Change the image (if there is an image)
                if (node.parentNode.childNodes.length > 0){
                    if ( node.parentNode.childNodes.item(0).childNodes.length > 0){
                        if (node.parentNode.childNodes.item(0).childNodes.item(0).nodeName.toLowerCase() === "img"){
                            node.parentNode.childNodes.item(0).childNodes.item(0).src = linker.wikifypath( "images/minus.gif" );
                        }
                    }
                }

                node.style.display = 'block';
            }
            // Collapse the branch if it IS visible
            else
            {
                // Change the image (if there is an image)
                if (node.parentNode.childNodes.length > 0){
                    if ( node.parentNode.childNodes.item(0).childNodes.length > 0){
                        if (node.parentNode.childNodes.item(0).childNodes.item(0).nodeName.toLowerCase() === "img"){
                            node.parentNode.childNodes.item(0).childNodes.item(0).src = linker.wikifypath( "images/plus.gif" );
                        }
                    }
                }

                node.style.display = 'none';
            }
        },
        IsUMLSAbove2M: function(conceptId) {
            /*
             * bug fix #742; This routine checks whether a UMLS concept has a concept number above
             * 2M. In those cases there is no equivalent knowlet
             */
            var elts = conceptId.split("/");
            if ( ( elts[0] == "umls" ) && (parseInt(elts[1].slice(1)) >= 2000000 ) ){
                return true;
            }
            else{
                return false;
            }
        },
        ContextShow: function(event, target, popupName) {
            // call from the onContextMenu event, passing the event
            // if this function returns false, the browser's context menu will not show up
            // IE is evil and doesn't pass the event object

            try {
                linker.processDocument.getElementById('wikifier-search-container').style.display = 'none';
            } catch(e) {}

            var scrollTop = 0;
            var scrollLeft = 0;
            if (ui.getContentWindow().pageYOffset){ // all except Explorer
                scrollLeft = ui.getContentWindow().pageXOffset;
                scrollTop  = ui.getContentWindow().pageYOffset;
            }
            else if (linker.processDocument.documentElement && linker.processDocument.documentElement.scrollTop){ // Explorer 6 Strict
                scrollLeft = linker.processDocument.documentElement.scrollLeft;
                scrollTop  = linker.processDocument.documentElement.scrollTop;
            }
            else if (linker.processDocument.body){ // all other Explorers
                scrollLeft = linker.processDocument.body.scrollLeft;
                scrollTop = linker.processDocument.body.scrollTop;
            }

            /* position the popup menu in such a way that is shows right */
            var menu = linker.processDocument.getElementById( popupName );
            //var menu = linker.processDocument.getElementById('wikifier-menu-container');
            menu.style.display = 'block';

            var menuWidth  = ui.getWidth( linker.processDocument, menu );
            var menuHeight = ui.getHeight( linker.processDocument, menu ); /* for the definition */

            if ( event.clientX === 0 ){
                var pos = ui.getAbsolutePosition(target);
                var clientX = pos.x + 2 + (target.offsetWidth*0.75) - scrollLeft;
                var clientY = pos.y + (target.offsetHeight*0.5) - scrollTop;
            }
            else{
                var clientX = event.clientX;
                var clientY = event.clientY;
            }

            if ( ( clientX + menuWidth ) > ui.pageWidth(linker.processWindow, linker.processDocument) ){
                var X = clientX - menuWidth;
            }
            else{
                var X = clientX;
            }

            if ( ( clientY + menuHeight ) > ui.pageHeight(linker.processWindow, linker.processDocument) ){
                var Y = ui.pageHeight(linker.processWindow, linker.processDocument) - menuHeight - 28; /* 28 is the size of the topbar */
                if ( Y < 0 ){
                    Y = 0;
                }
            }
            else{
                var Y = clientY;
            }

            if ( event !== null ){
                X += scrollLeft;
                Y += scrollTop;
            }

            menu.style.display = 'none';
            menu.style.left = X + 'px';
            menu.style.top =  Y + 'px';
            menu.style.display = 'block';
            menu.style.zIndex = 100;
            return true;
        },
        truepopdown: function() {
            try {
                linker.processDocument.getElementById('wikifier-menu-container').style.display = 'none';
                linker.processDocument.getElementById('wikifier-search-container').style.display = 'none';
                linker.processDocument.getElementById('wikifier-authors-container').style.display = 'none';
                linker.processDocument.getElementById('wikifier-publications-container').style.display = 'none';
            } catch(e) {
            }
        },
        showSplashScreen: function() {
		// Splash Screen temporarily disabled
		return true;

            /*
             * Show the spash screen centered on the window
             */
            var menu = linker.processDocument.getElementById('wikifier-infobox-container');
            if (!menu){
                return;
            }

            if (!linker.is_wikibutton) {
                if (ui.caller == "CWButton")
                    return;
            }

            var seen = linker.utils.readCookie(ui.SplashSessionSeen);
            if ( seen == "true" ){
                return;
            }

            if ( menu.visible === true ){
                return;
            }

            menu.visible = true;
            menu.style.display = 'block';

            if (!ie) {
                winW = window.innerWidth;
                winH = window.innerHeight;
            }
            else {
                winW = document.body.offsetWidth;
                winH = document.body.offsetHeight;
            }

            X = ( winW - menu.offsetWidth) / 2;
            Y = ( winH - menu.offsetHeight) / 2;

            menu.style.display = 'none';
            menu.style.left = X + 'px';
            menu.style.top =  Y + 'px';
            menu.style.display = 'block';
            menu.style.zIndex = 90;
            return true;
        },
        SetBook: function(concept){
            var w = linker.processDocument.getElementById('wikifier-text-book');
            if ( null !== w ){
                w.innerHTML = "";
                w.parentNode.style.display = "none";
                if ("undefined" !== typeof window.getBook) {
                    if ( concept != undefined ){
                         getBook(w, concept.name(), concept);
                    }
                }
            }
        },
        popupShow: function(event) {
            /* create the popup menu */
            ui.truepopdown();
            ui.SetDefinition("Retrieving definition..");

            target = event.target;
            if (linker.browser.is_ie) {
                if(linker.IEplugin) {
                    event = linker.processWindow.event;
                } else {
                    event = frames['contentframe'].event;
                }
            }

            rec=linker.utils.splitIds( target.id );
            fpId=rec[0];
            cuiList=rec[1];

            var concept = null;
            var addbutton = linker.processDocument.getElementById('wikifier-add-menu');
            var searchbutton = linker.processDocument.getElementById('wikifier-search-menu');
            try {
                var selected = ui.FindHomologue(cuiList);
                if ( selected !== null ){
                    concept = linker.processWindow.currentcacheelt.fingerprints[fpId].find(selected);
                } else {
                    for ( i = 0 ; i < cuiList.length ; i++ ){
                        concept = linker.processWindow.currentcacheelt.fingerprints[fpId].find(cuiList[i]);
                        if ( concept.preferred === true ){
                            break;
                        }
                    }
                }
            } catch(e) {
                /* for the home page of the who the load event is not trickered if one gets there the second
                 * time; for those cases retrieve the page from cache anyhow. Set the checkum flag on ignore.
                 */
                linker.ignoreChecksum = true;
                linker.initpage(content, false);
                linker.parsing.SiteSpecificHandling();
                concept = linker.processWindow.currentcacheelt.fingerprints[fpId].find(cuiList[0]);
            }
            var conceptNameButton = linker.processDocument.getElementById('wikifier-title-definition');
            try{
                var conceptName=(concept.mappedFromName()!==""?concept.mappedFromName():concept.name());
            } catch(e) { }

            conceptNameButton.style.color = linker.highlighting.getForegroundColor( concept );

            var selected = false;
            for ( i = 0 ; i < cuiList.length ; i++ ){
                if (ui.isSelectedConcept(cuiList[i])) {
                    selected = true;
                    break;
                }
            }

            cui=concept.id;
            elts=cui.split("/");

            linker.ui.SetBook(concept);

            addbutton.style.display = selected ? "none" : "";
            searchbutton.style.display = ui.hasSavedNodes() ? "" : "none";
            conceptNameButton.innerHTML=conceptName;
            conceptNameButton.title=conceptName;

            ui.SetCuiList(cuiList);

            linker.processDocument.getElementById('wikifier-text-definition').concept = concept;

            ui.GetDefinitionFromWiki(ui.SetDefinition, concept);

            /* wiki edit */
            var dataset=(elts[0]=="uniprot"?"sp":"umls");
            var elt = linker.processDocument.getElementById('wikifier-edit-definition');
            if ( elt !== null ){
                elt.link=WIKIHOST +"/index.php/Special:Datasearch?search-text="+elts[1]+"&go=Go&action=edit";
            }

            var elt = linker.processDocument.getElementById('wikifier-viewwiki');
            if ( elt !== null ){
                elt.link=WIKIHOST +"/index.php/Special:Datasearch?search-text="+elts[1]+"&go=Go";
            }

            /* conceptweb page */
            linker.processDocument.getElementById('wikifier-conceptweb-reference').link=CONCEPTWEBHOST + "/conceptNavigator?knowletId="+cui;

            /* follow url */
            linker.processDocument.getElementById('wikifier-border-bottom').style.display = (target.url == undefined ? 'none' : '' );
            linker.processDocument.getElementById('wikifier-border-bottom').disabled = (target.url == undefined);
            linker.processDocument.getElementById('followlink-reference').link = target.url;

            ui.ContextShow(event,target,'wikifier-menu-container');
        },
        insertStyle: function() {
            if (linker.processDocument.createStyleSheet) {
                linker.processDocument.createStyleSheet(linker.wikifypath("css/menu.css"));
            } else {
                var fileref=linker.processDocument.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");

                fileref.setAttribute("href", linker.wikifypath("css/menu.css"));

                linker.processDocument.getElementsByTagName("head")[0].appendChild(fileref);
            }
        },
        openURL: function(node, argument, newtab) {
            if (null !== linker.processWindow) {
                ui.truepopdown();
                linker.processWindow.open(argument, (linker.wikify() && !newtab) ? 'contentframe' : '_blank', "", false);
            }
        },
        openWikiURL: function(node, argument) {
            truepopdown();
            linker.processWindow.open( argument, (linker.wikify() ? 'contentframe' : '_blank' ), "" );
        },
        createLogoButton: function(processDocument, menu) {
        },
        createAdButton: function(processDocument, menu) {
        }
    });

    linker.extend(ui, {
        getAbsolutePosition: function(element) {
            var r = { x: element.offsetLeft, y: element.offsetTop };
            if (element.offsetParent) {
              var tmp = arguments.callee(element.offsetParent);
              r.x += tmp.x;
              r.y += tmp.y;
            }
            return r;
        },
        getX: function(doc, elt) {
            var id = elt.id;
            return doc.getElementById(id).offsetLeft;
        },
        getY: function(doc, elt) {
            var id = elt.id;
            return doc.getElementById(id).offsetTop;
        },
        getHeight: function(doc, elt) {
            var id = elt.id;
            return doc.getElementById(id).offsetHeight;
        },
        getWidth: function(doc, elt) {
            var id = elt.id;
            return doc.getElementById(id).offsetWidth;
        },
        pageWidth: function(aWindow, aDocument) {
            return aWindow.innerWidth !== null ? aWindow.innerWidth : aDocument.documentElement && aDocument.documentElement.clientWidth ? aDocument.documentElement.clientWidth : aDocument.body !== null ? aDocument.body.clientWidth : null;
        },
        pageHeight: function(aWindow, aDocument) {
            return  aWindow.innerHeight !== null ? aWindow.innerHeight : aDocument.documentElement && aDocument.documentElement.clientHeight ? aDocument.documentElement.clientHeight : aDocument.body !== null ? aDocument.body.clientHeight : null;
        },
        posLeft: function() {
            return typeof window.frames['contentframe'].pageXOffset !== "undefined" ? window.frames['contentframe'].pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
        },
        posTop: function() {
            return typeof window.frames['contentframe'].pageYOffset !== "undefined" ?  window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
        }
    });


    // progress bar functions

    linker.extend(ui, (function() {
        var progressSteps = 0.0;

        return {
            setProgressPB: function(current) {
                progressSteps = current || 0.0;

                var w = ui.getProgressBarDocument().getElementById("progressBar");
                if (null === w)
                    return;

                progressSteps += 0.01;
                setPercent(w, progressSteps);

                if (progressSteps >= 1.0)
                    progressSteps = 0.0;

                linker.base.setTimeout(arguments.callee, 200);
            }
        };
    })());


    linker.extend(ui, {
        getProgressBarDocument: function() {
            if (linker.wikify()) {
                return window.frames['navigationframe'].document;
            } else {
                return Wikify.getDocument();
            }
        },
        initPB: function() {
            try {
                var d = ui.getProgressBarDocument();
                var w = d.getElementById("progressBar");
                if (null === w) {
                    var parentNode = d.getElementById("wikifier-toolbar");
                    var highlightbutton = d.getElementById("wikifier-legend");
                    var x = ui.getX(d, highlightbutton);
                    var y = ui.getY(d, highlightbutton);

                    if (x < 10) {
                        x = 100;
                        y = 3;
                    }

                    var width = parentNode.offsetWidth;
                    w = jt_ProgressBar(d, parentNode, x, y+2, width-x-10, 18);
                    ui.startPB(); // start timer
                }
                return w;
            } catch(e) { }
            return null;
        },
        startPB: function() {
            ui.setProgressPB(0.0);
        },
        showPB: function(msg) {
            if ("undefined" == typeof jt_ProgressBar) {
                Wikify.showPB(msg, linker.processWindow);
                return;
            }

            try {
                ui.initPB();
                ui.setProgressBarMessage(msg);
                ui.getProgressBarDocument().getElementById("wikifier-legend").style.display = "none";
            } catch(e) { }
        },
        hidePB: function() {
            if ("undefined" == typeof jt_ProgressBar) {
                Wikify.hidePB(linker.processWindow);
                return;
            }

            try {
                var d = ui.getProgressBarDocument();
                var w = d.getElementById("progressBar");
                if (null !== w)
                    w.parentNode.removeChild(w);

                d.getElementById("wikifier-legend").style.display = "block";
            } catch(e) { }
        },
        setProgressBarMessage: function(msg) {
            try {
                var w = ui.getProgressBarDocument().getElementById("progressBar");
                if (null === w)
                    w = ui.initPB();

                if (null !== w.childNodes[1].childNodes[0])
                    w.childNodes[1].childNodes[0].nodeValue = msg;
            } catch(e) { }
        }
    });


    linker.extend(ui, {
        getSelectedCuiList: function() {
            var w = linker.getNavigationWindow();
            var cuiList = [];
            for (var i=0; i<w.savedConcepts.length; i++) {
                if (w.savedConcepts[i].selected)
                    cuiList[cuiList.length] = w.savedConcepts[i].cui;
            }
            return cuiList;
        },
        ExpandConcepts: function(pre, post) {
            var w = linker.getNavigationWindow();
            var terms = "";
            for (var i=0; i<w.savedConcepts.length; i++) {
                if (w.savedConcepts[i].selected)
                    terms += pre + w.savedConcepts[i].name + post;
            }
            return terms;
        },
        openSearchResult: function(url) {
            if (linker.is_wikibutton) {
                openSearchResultWindowXHR(url);
            } else {
                ui.openSearchResultWindow(url);
            }
        },
        getContentWindow: function() {
            if (linker.wikify()) {
                return  window.frames['contentframe'];
            } else {
                return linker.processWindow;
            }
        },
        FindSpecies: function(Species, conceptList) {
            for (var i=0; i<conceptList.length; i++) {
                var species = ui.ExtractSpecies(conceptList[i]);
                if (species) {
                    if (species.toLowerCase() == Species)
                        return i;
                }
            }
            return -1;
        },
        FindHomologue: function(conceptList) {
            var selected = -1;
            if (conceptList !== null) {
                selected = ui.FindSpecies("homo sapiens", conceptList);
                if (selected == -1) {
                    selected = ui.FindSpecies("mus musculus", conceptList);
                }
            }
            if (selected != -1)
                return conceptList[selected];

            return null;
        },
        isSelectedConcept: function(cui) {
            var savedConcept = ui.getSavedConcept(cui);
            return (savedConcept !== null) && savedConcept.selected;
        },
        getSelectedNode: function(node) {
            for (var c=0; c<node.childNodes.length; c++) {
                if (-1 != node.childNodes[c].className.indexOf("wikihighlight"))
                    return node.childNodes[c];
            }
            return null;
        },
        hasSavedNodes: function() {
            try {
                return linker.getNavigationWindow().savedConcepts.length > 0;
            } catch(e) {
                return false;
            }
        },
        getSavedConcept: function(cui) {
            try {
                for (var i=0; i<linker.getNavigationWindow().savedConcepts.length; i++) {
                    if (linker.getNavigationWindow().savedConcepts[i].cui == cui) {
                        return linker.getNavigationWindow().savedConcepts[i];
                    }
                }
            } catch(e) {
            }
            return null;
        },
        ShowHighlight: function(node, selected) {
            node.style.backgroundColor = selected ? "rgb(255,255,0)" : "transparent";
        },
        RouteViaProxy: function(url) {
            /*
             * This function will insert code to route the page via the proxy server. For the already proxyified
             * pages this is not necessary, but for the button it is. The button has an override version of this
             * method that will route it via the proxy.
             */
            if (linker.is_wikibutton) {
                return RouteViaProxyXHR(url);
            } else {
                return url;
            }
        },
        RemoveConceptFromSavedConcepts: function(cui) {
            for (var i=0; i<linker.getNavigationWindow().savedConcepts.length; i++) {
                if (linker.getNavigationWindow().savedConcepts[i] == cui) {
                    linker.getNavigationWindow().savedConcepts.splice(i, 1);
                    return;
                }
            }
        },
        AddConceptToSavedConcepts: function(cui, override) {
            override = !!override;
            if (cui) {
                var savedConcept = ui.getSavedConcept(cui);
                if (savedConcept === null) {
                    var conceptName = ui.getConceptName(cui);
                    var concept = ui.getConceptById(cui);
                    if (concept.mappedFromId() !== "") {
                        linker.getNavigationWindow().savedConcepts[linker.getNavigationWindow().savedConcepts.length] = {'cui':cui, 'selected':override, 'name':conceptName, 'mappdFromId':concept.mappedFromId, 'mappedFromName':concept.mappedFromName};
                    } else {
                        linker.getNavigationWindow().savedConcepts[linker.getNavigationWindow().savedConcepts.length] = {'cui':cui, 'selected':true, 'name':conceptName};
                    }
                    savedConcept = linker.getNavigationWindow().savedConcepts[linker.getNavigationWindow().savedConcepts.length-1];
                } else {
                    savedConcept.selected = true;
                }
            }
            return savedConcept;
        },
        getSelectedNodes: function(cui) {
            res = [];
            for (var c=0; c<linker.processWindow.currentcacheelt.highlightnodes.length; c++) {
                var ids = linker.utils.splitIds(linker.processWindow.currentcacheelt.highlightnodes[c][0].id)[1];
                for (var i=0; i<ids.length; i++) {
                    if (cui == ids[i]) {
                        res[res.length] = ui.getSelectedNode(linker.processWindow.currentcacheelt.highlightnodes[c][0]);
                        break;
                    }
                }
            }
            return res;
        },
        ExpandSearchArguments: function(cuiList, pre, post, maxlen, callback) {
            /*
             * This routine expands all concepts equally with their terms thereby considering the maximum
             * length of the resulting query string
             */
            var text = "";
            var conceptTerms = new Array(cuiList.length);
            var conceptStrings = new Array(cuiList.length);
            for (var i=0; i<cuiList.length; i++) {
                conceptTerms[i] = ui.ExpandTerm(cuiList[i], 2, callback);
                conceptStrings[i] = "";
            }

            for (var i=0; i<cuiList.length; i++) {
                for (var j=0; j<conceptTerms[i].length; j++) {
                    conceptTerms[i][j] = escape(conceptTerms[i][j]);
                }
            }

            var expandLevel = 0;
            var totalLength = 0;
            var added = true;
            while (added) {
                added = false;
                for (var i=0; i<cuiList.length; i++) {
                    if (conceptTerms[i].length > expandLevel) {
                        var add = (conceptStrings[i] !== "" ? " OR " : pre) + conceptTerms[i][expandLevel];
                        if (totalLength + add.length > maxlen) {
                            break;
                        }
                        added = true;
                        conceptStrings[i] += add;
                        totalLength += add.length;
                    }
                }
                expandLevel += 1;
            }

            for (i=0; i<conceptStrings.length; i++) {
                conceptStrings[i] += post;
                text += conceptStrings[i];
            }

            return callback(text);
        },
        openSearchResultWindow: function(url) {
            return linker.processWindow.open(url, linker.wikify() ? 'contentframe' : '_blank');
        },
        mit_enrich: function() {
            if (null !== window) {
                if ("undefined" != typeof window.frames['dynamic']) {
                    contentframe = window.frames['dynamic'];
                } else if ("undefined" != typeof window.frames['contentframe']) {
                    contentframe = window.frames['contentframe'];
                }

                if (null !== contentframe) {
                    if (null !== contentframe.location) {
                        try {
                            var href = contentframe.location.href;
                            pos = href.indexOf("caller=CWButton");
                            if (pos > 0) {
                                ui.caller = "CWButton";
                            }
                        } catch(e) {
                            return -1;
                        }

                        if (contentframe.location.href === null) {
                            return -2;
                        }
                    } else {
                        return -3;
                    }
                } else {
                    return -4;
                }
            } else {
                return -5;
            }

            try {
                var widget = window.frames["navigationframe"].document.getElementById("wikifier-enrich");
            } catch(e) {
                linker.log.WriteDebugLine("cannot access widget");
                var widget = null;
            }

            if (widget !== null) {
                linker.initpage(contentframe, false);
                if (widget.checked) {
                    try {
                        linker.parsing.SiteSpecificHandling();
                    } catch(e) {
                        return -6;
                    }
                }
            } else {
                return -7;
            }
            return 0;
        },
        resetInitialization: function() {
            if (window !== null) {
                if (window.frames['dynamic'] !== null) {
                    contentframe = window.frames['dynamic'];
                } else if (window.frames['contentframe'] !== null) {
                    contentframe = window.frames['contentframe'];
                }
                contentframe.initialized = false;
            }
        },
        getConceptName: function(cui) {
            try {
                var concept = ui.getConceptById(cui);

                if (null !== concept) {
                    return concept.name();
                } else {
                    return cui;
                }
            } catch(e) {
                return cui;
            }
        },
        getConceptById: function(cui) {
            if (linker.processWindow.currentcacheelt.conceptsByCui) {
                if (linker.processWindow.currentcacheelt.conceptsByCui[cui]) {
                    return linker.processWindow.currentcacheelt.conceptsByCui[cui];
                }
            } else {
                linker.processWindow.currentcacheelt.conceptsByCui = {};

                for (var fpId=0; fpId<linker.processWindow.currentcacheelt.fingerprints.length; fpId++) {
                    for (var c=0; c<linker.processWindow.currentcacheelt.fingerprints[fpId].concepts.length; c++) {
                        var key = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[c].id;
                        linker.processWindow.currentcacheelt.conceptsByCui[key] = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[c];
                    }
                }

                linker.processWindow.currentcacheelt.conceptsByCui.last = linker.processWindow.currentcacheelt.fingerprints.length;

                if (linker.processWindow.currentcacheelt.conceptsByCui[cui]) {
                    return linker.processWindow.currentcacheelt.conceptsByCui[cui];
                } else {
                   return null;
                }
            }

            if (linker.processWindow.currentcacheelt.conceptsByCui.last < linker.processWindow.currentcacheelt.fingerprints.length) {
                for (var fpId=linker.processWindow.currentcacheelt.conceptsByCui.last; fpId < linker.processWindow.currentcacheelt.fingerprints.length; fpId++) {
                    for (var c=0; c<linker.processWindow.currentcacheelt.fingerprints[fpId].concepts.length; c++) {
                        var key = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[c].id;
                        linker.processWindow.currentcacheelt.conceptsByCui[key] = linker.processWindow.currentcacheelt.fingerprints[fpId].concepts[c];
                    }
                }

                linker.processWindow.currentcacheelt.conceptsByCui.last = linker.processWindow.currentcacheelt.fingerprints.length;

                if (linker.processWindow.currentcacheelt.conceptsByCui[cui]) {
                    return linker.processWindow.currentcacheelt.conceptsByCui[cui];
                } else {
                    return null;
                }
            }
            return null;
        }
    });


    // search functions

    linker.extend(ui, {
        CRISPCB: function(node, conceptList) {
            var terms = ui.ExpandConcepts("", " ");
            var url = HOST + "/" + ui.RouteViaProxy( "nph-proxy.cgi/" + linker.nphflags + "/http/crisp.cit.nih.gov/crisp/crisp_lib.query?p_keywords=" + terms + "&p_opr=or&p_expansion=none&p_maxhit=250&p_state=&p_irg=&p_fy=2008%2C&p_icd=&p_nlast=&p_nfirst=&p_type=&p_activity=&p_grant=&p_title=&p_irg1=&p_icd1=&p_inst=&p_fy1=2008&p_state1=&p_query=(" + terms + ")&ticket=58810770&p_audit_session_id=296504978&p_audit_query_type=ASQ&p_test_mode=N" );
            ui.openSearchResult(url + "&caller=" + escape(ui.caller));
        },
        NIHGrantsCB: function(node, conceptList) {
            var terms = ui.ExpandConcepts("", ",");
            var url = HOST + "/" + ui.RouteViaProxy( "nph-proxy.cgi/" + linker.nphflags + "/http/grants.nih.gov/grants/guide/search_results.htm?scope=rfa&scope=pa&year=active&text_curr=" + terms + "&Search.x=30&Search.y=7" );
            ui.openSearchResult(url + "&caller=" + escape(ui.caller));
        },
        GoogleCallback: function(text) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/" + linker.nphflags + "/http/www.google.com/search?q=" + text);
            ui.openSearchResult(url + "&caller=" + escape(ui.caller) );
            return text;
        },
        GoogleCB: function(node, conceptList, maxlen) {
            maxlen = maxlen || 500;

            if (linker.is_wikibutton) {
                ExpandSearchArgumentsXHR(ui.getSelectedCuiList(), "%2b(", ") ", maxlen, ui.GoogleCallback);
            } else {
                ui.ExpandSearchArguments(ui.getSelectedCuiList(), "%2b(", ") ", maxlen, ui.GoogleCallback);
            }
        },
        SieveCB: function(node, conceptList) {
            ExecuteSearch(ui.getSelectedCuiList());
        },
        FederatedSearchCB: function(node, conceptList) {
            var w = window.document.getElementById("content");
            w.cols = "20%,80%";
            w.border = "1;";
            return false;
        },
        YahooCallback: function(text) {
            var url = HOST + "/" + ui.RouteViaProxy( "nph-proxy.cgi/" + nphflags + "/http/search.yahoo.com/search?p=" + text);
            ui.openSearchResult(url + "&caller=" + escape(ui.caller), linker.wikify() ? 'contentframe' : '_blank');
        },
        YahooCB: function(node, conceptList) {
            if (linker.is_wikibutton) {
                ExpandSearchArgumentsXHR(ui.getSelectedCuiList(), "%2b(", ") ", 1024, ui.YahooCallback);
            } else {
                ui.ExpandSearchArguments(ui.getSelectedCuiList(), "%2b(", ") ", 1024, ui.YahooCallback);
            }
        },
        GoogleScholarCallback: function(text) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/" + nphflags + "/http/scholar.google.com/scholar?q=" + text);
            ui.openSearchResult(url + "&caller=" + escape(ui.caller), linker.wikify() ? 'contentframe' : '_blank');
        },
        GoogleScholarCB: function(node, conceptList) {
            if (linker.is_wikibutton) {
                ExpandSearchArgumentsXHR(ui.getSelectedCuiList(), "%2b(", ") ", 500, ui.GoogleScholarCallback);
            } else {
                ui.ExpandSearchArguments(ui.getSelectedCuiList(), "%2b(", ") ", 500, ui.GoogleScholarCallback);
            }
        },
        GooglePatentCallback: function(text) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/" + nphflags + "/http/www.google.com/patents?q=" + text);
            ui.openSearchResult( url + "&caller=" + escape(ui.caller), linker.wikify() ? 'contentframe' : '_blank');
        },
        GooglePatentCB: function(node, conceptList) {
            if (linker.is_wikibutton) {
                ExpandSearchArgumentsXHR(ui.getSelectedCuiList(), "%2b(", ") ", 500, ui.GooglePatentCallback);
            } else {
                ui.ExpandSearchArguments(ui.getSelectedCuiList(), "%2b(", ") ", 500, ui.GooglePatentCallback);
            }
        },
        HoweverCB: function(node, conceptList) {
            var url = HOST + "/however.htm?titlebar=0&text=" + ui.ExpandConcepts("", " ");
            ui.openSearchResultWindow(url);
        },
        BMCCB: function(node, conceptList) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/" + nphflags + "/http/www.biomedcentral.com/search/results.asp?terms=" + ui.ExpandConcepts("", " ")+ "&drpPhrase1=and&type=bmc_advanced_results&chkBMCJournals=true&chkCurrentOpinion=true&chkNSP=true&Search.x=10");
            ui.openSearchResult(url + "&caller=" + escape(ui.caller));
        },
        SpringerLinkCB: function(node, conceptList) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/" + nphflags + "/http/www.springerlink.com/content/=3fk=3d" + ui.ExpandConcepts("", " "));
            ui.openSearchResult(url + "&caller=" + escape(ui.caller));
        },
        PubMedCB: function(node, conceptList) {
            var url = HOST + "/" + ui.RouteViaProxy("nph-proxy.cgi/000000A/http/www.ncbi.nlm.nih.gov/sites/entrez?Db=pubmed&Cmd=Search&Term=" + ui.ExpandConcepts("", " ")+ "&itool=EntrezSystem2.PEntrez.Pubmed.Pubmed_ResultsPanel.Pubmed_RVAbstractPlus");
            ui.openSearchResult(url + "&caller=" + escape(ui.caller));
        },
        KnowletCB: function(node, conceptList) {
            var url     = "";
            var count   = 0;
            var message = "";

            for ( var i = 0 ; i < linker.getNavigationWindow().savedConcepts.length ; i++ ){
                if ( linker.getNavigationWindow().savedConcepts[i].selected ){
                    /*
                     * Fix #742 for the UMLS concepts above 2M: these can not be used for
                     * searching the knowlet space
                     */
                    if (ui.IsUMLSAbove2M(linker.getNavigationWindow().savedConcepts[i].cui ) === false) {
                        url += (count === 0 ? "" : "|" ) + linker.getNavigationWindow().savedConcepts[i].cui;
                        count += 1;
                    } else {
                        message += "\"" + linker.getNavigationWindow().savedConcepts[i].name + "\"\n";
                    }
                }
            }

            if (message.length > 0)
                alert("There is not enough unambiguous information to build the knowlets for:\n" + message);

            if (url.length > 0)
                ui.openSearchResult(CONCEPTWEBHOST + "/conceptNavigator?knowletId="  + url);
        },
        ClearQueryCB: function(node) {
            ui.truepopdown();
            for (var i=0; i<linker.getNavigationWindow().savedConcepts.length; i++) {
                var selectNodes = ui.getSelectedNodes(linker.getNavigationWindow().savedConcepts[i].cui);

                for (var j=0; j<selectNodes.length; j++) {
                    selectNodes[j].style.backgroundColor = "transparent";
                }
            }
            linker.getNavigationWindow().savedConcepts = [];
        },
        AddPageCB: function(node) {
            var url = "";
            count = 0;
            ui.truepopdown();
            for (var i=0; i<linker.getNavigationWindow().savedConcepts.length; i++) {
                if (linker.getNavigationWindow().savedConcepts[i].selected) {
                    url += (count === 0 ? "" : " AND ") + linker.getNavigationWindow().savedConcepts[i].name;
                    count += 1;
                }
            }
            var originalURL = escape(linker.processWindow.currentcacheelt.page);
            var title = linker.processWindow.document.title;
            ui.openSearchResult("http://www.citeulike.org/posturl?bml=nopopup&url=" + originalURL + "&title=" + title + "&tags="  + url, linker.wikify() ? 'contentframe' : '_blank');
        },
        selectConceptCB: function(node, conceptList, override) {
            // override indicates that the concept has to be selected anyhow.
            if (conceptList !== null) {
                var selected = ui.FindHomologue(conceptList);
                if (selected === null) {
                    selected = conceptList[0];
                }
                for (var i=conceptList.length-1; i >= 0; i--) {
                    var selectNodes = ui.getSelectedNodes(conceptList[i]);

                    var savedConcept = ui.getSavedConcept(conceptList[i]);
                    if ((savedConcept === null) || (override === true )) {
                        savedConcept = ui.AddConceptToSavedConcepts(conceptList[i], conceptList[i] == selected);
                    } else {
                        savedConcept.selected = !savedConcept.selected;
                    }

                    if (savedConcept.selected) {
                        for (var j=0; j<selectNodes.length; j++) {
                            ui.ShowHighlight(selectNodes[j], savedConcept.selected);
                        }
                    }
                }
            }
        }
    });
});
function getBook(bookdiv, keywords, concept) {
    findBooks(bookdiv, keywords, PUBLISHER, showBook, concept);
}

function showBook(bookdiv, response, concept) {
    if (concept) {
        var cuiList = linker.processDocument.getElementById('wikifier-add-menu').cuiList;

        loop:
        while (true) {
            for (var i=0; i<cuiList.length; ++i) {
                if (concept.id == cuiList[i])
                    break loop; // go to definition setting
            }

            return; // ignore this definition cause it is not for current popup
        }
    }


    var html = "Available books:<br/><br/>";
    var maxbooks = (response.items.length < 5 ? response.items.length : 5 );

    for (var i=0; i<maxbooks; i++) {
        html += "<b>" + response.items[i].ItemAttributes.Title + "</b><br/>";
        try {
            for ( var j = 0 ; j < response.items[i].ItemAttributes.Authors.length ; j++ ){
                if (j > 0) {
                    html += ", ";
                }
                if (j === 0) {
                    html += "<small>by:&nbsp;</small>";
                }
                html += response.items[i].ItemAttributes.Authors[j];
            }
            if ( response.items[i].ItemAttributes.Authors.length > 0 ){
                html += "<br/>";
            }
        } catch(e) {
        }
        html += "<a href='" + response.items[i].DetailPageURL + "' target='blank'>" + response.items[i].ItemAttributes.Manufacturer + "</a><br/><br/>";
    }

    if (response.items.length > 0) {
        bookdiv.innerHTML = html;
    } else {
        bookdiv.innerHTML = "";
    }

    if (bookdiv.innerHTML === "") {
        bookdiv.parentNode.style.display = "none";
    } else {
        bookdiv.parentNode.style.display = "";
    }
}

function findBooks(bookdiv, keywords, publisher, callback, concept) {
    linker.transport.getBooks(keywords, publisher, function(response) {
        if ((response.items.length === 0) && (publisher !== "")) {
            findBooks( bookdiv, keywords, "", callback, concept);
        } else {
            callback(bookdiv, response, concept);
        }
    });
}